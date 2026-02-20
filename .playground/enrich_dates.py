#!/usr/bin/env python3
"""
Fetch publish dates for non-GitHub resources in the awesome-talon README.

Strategies:
  - YouTube: oEmbed API (no API key needed)
  - Podcasts: RSS feed parsing
  - Blog posts / talks: HTML <meta> tag scraping
  - Twitter: Snowflake ID extraction
  - Fallback: year from title if present

Output: website/data/resource_dates.json
Run manually when new URLs are added to the README.
"""

import json
import re
import sys
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

README_PATH = Path(__file__).parent.parent / "README.md"
OUTPUT_PATH = Path(__file__).parent.parent / "website" / "data" / "resource_dates.json"

# Existing data to merge with (only fetch new URLs)
EXISTING: dict[str, str] = {}

# URLs to skip (not date-relevant or not fetchable)
SKIP_PREFIXES = ("#", "CONTRIBUTING")
SKIP_DOMAINS = {"talonvoice.com", "talon.wiki", "awesome.re", "patreon.com"}

USER_AGENT = "awesome-talon-enricher/1.0"

# RSS feeds for known podcast domains
RSS_FEEDS: dict[str, str] = {
    "syntax.fm": "https://feed.syntax.fm/rss",
    "changelog.com": "https://changelog.com/podcast/feed",
    "gcppodcast.com": "https://www.gcppodcast.com/feed.xml",
    "ittalks.libsyn.com": "https://ittalks.libsyn.com/rss",
}


def fetch_url(url: str, timeout: int = 15) -> str | None:
    """Fetch URL content as string."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        print(f"  WARN: Failed to fetch {url}: {e}", file=sys.stderr)
        return None


def fetch_json(url: str) -> dict | None:
    """Fetch URL and parse as JSON."""
    body = fetch_url(url)
    if body:
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return None
    return None


def get_youtube_date(url: str) -> str | None:
    """Get upload date via YouTube oEmbed API."""
    # Normalize youtu.be to youtube.com
    video_id = None
    if "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1].split("?")[0]
    elif "watch?v=" in url:
        video_id = url.split("watch?v=")[1].split("&")[0]

    if not video_id:
        return None

    # oEmbed doesn't return dates, use noembed which does
    oembed_url = f"https://noembed.com/embed?url=https://www.youtube.com/watch?v={video_id}"
    data = fetch_json(oembed_url)
    if data and "upload_date" in data:
        # noembed returns YYYY-MM-DD or similar
        return data["upload_date"]

    # Fallback: fetch the page and look for datePublished in JSON-LD
    page = fetch_url(f"https://www.youtube.com/watch?v={video_id}")
    if page:
        # Look for "datePublished":"YYYY-MM-DD" or "publishDate":"YYYY-MM-DD"
        match = re.search(r'"(?:datePublished|publishDate)"\s*:\s*"(\d{4}-\d{2}-\d{2})"', page)
        if match:
            return match.group(1)
        # Also try uploadDate
        match = re.search(r'"uploadDate"\s*:\s*"(\d{4}-\d{2}-\d{2})', page)
        if match:
            return match.group(1)
    return None


def get_twitter_date(url: str) -> str | None:
    """Extract date from Twitter snowflake ID."""
    match = re.search(r"/status/(\d+)", url)
    if not match:
        return None
    snowflake = int(match.group(1))
    # Twitter epoch: 2010-11-04T01:42:54.657Z = 1288834974657
    timestamp_ms = (snowflake >> 22) + 1288834974657
    dt = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)
    return dt.strftime("%Y-%m-%d")


def get_podcast_date_from_rss(url: str) -> str | None:
    """Match a podcast episode URL to its RSS feed and extract pubDate."""
    from urllib.parse import urlparse

    hostname = urlparse(url).hostname or ""
    hostname = hostname.replace("www.", "")

    feed_url = RSS_FEEDS.get(hostname)
    if not feed_url:
        return None

    # Determine episode identifier from URL
    episode_id = None
    if "syntax.fm" in url:
        # https://syntax.fm/show/481/...
        match = re.search(r"/show/(\d+)/", url)
        if match:
            episode_id = match.group(1)
    elif "changelog.com" in url:
        # https://changelog.com/podcast/423
        match = re.search(r"/podcast/(\d+)", url)
        if match:
            episode_id = match.group(1)
    elif "libsyn.com" in url:
        # Match by URL slug in the feed
        episode_id = url.rstrip("/").split("/")[-1]

    if not episode_id:
        return None

    print(f"  Fetching RSS: {feed_url}")
    body = fetch_url(feed_url, timeout=30)
    if not body:
        return None

    try:
        root = ET.fromstring(body)
    except ET.ParseError:
        return None

    # Search items for matching episode
    for item in root.iter("item"):
        link_el = item.find("link")
        guid_el = item.find("guid")
        title_el = item.find("title")
        pub_date_el = item.find("pubDate")

        if pub_date_el is None:
            continue

        link_text = (link_el.text or "") if link_el is not None else ""
        guid_text = (guid_el.text or "") if guid_el is not None else ""
        title_text = (title_el.text or "") if title_el is not None else ""

        matched = False
        if "syntax.fm" in hostname and episode_id:
            # Syntax titles often include the episode number
            matched = f"#{episode_id}" in title_text or f"/{episode_id}/" in link_text or f"/{episode_id}/" in guid_text
        elif "changelog.com" in hostname and episode_id:
            matched = f"/{episode_id}" in link_text or f"/{episode_id}" in guid_text
        elif "libsyn.com" in hostname and episode_id:
            matched = episode_id in link_text or episode_id in guid_text

        if matched:
            return parse_rfc2822_date(pub_date_el.text)

    return None


def parse_rfc2822_date(date_str: str | None) -> str | None:
    """Parse RFC 2822 date (from RSS) to YYYY-MM-DD."""
    if not date_str:
        return None
    # Try common RSS date formats
    for fmt in [
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%a, %d %b %Y %H:%M:%S",
    ]:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    # Fallback: try to find YYYY-MM-DD in the string
    match = re.search(r"(\d{4}-\d{2}-\d{2})", date_str)
    return match.group(1) if match else None


def get_html_meta_date(url: str) -> str | None:
    """Scrape publish date from HTML meta tags or JSON-LD."""
    page = fetch_url(url)
    if not page:
        return None

    # Strategy 1: Open Graph / meta tags
    # <meta property="article:published_time" content="2021-12-12T...">
    # <meta name="date" content="2019-09-03">
    # <meta property="og:article:published_time" ...>
    patterns = [
        r'<meta[^>]*(?:property|name)=["\'](?:article:published_time|og:article:published_time|date|DC\.date|sailthru\.date)["\'][^>]*content=["\']([^"\']+)["\']',
        r'<meta[^>]*content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\'](?:article:published_time|og:article:published_time|date|DC\.date)["\']',
        # time element with datetime
        r'<time[^>]*datetime=["\']([^"\']+)["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, page, re.IGNORECASE)
        if match:
            return normalize_date(match.group(1))

    # Strategy 2: JSON-LD
    # "datePublished": "2021-12-12"
    match = re.search(r'"datePublished"\s*:\s*"([^"]+)"', page)
    if match:
        return normalize_date(match.group(1))

    # Strategy 3: URL contains a date pattern
    match = re.search(r'/(\d{4})[/-](\d{2})[/-](\d{2})', url)
    if match:
        return f"{match.group(1)}-{match.group(2)}-{match.group(3)}"

    # Strategy 4: URL contains just a year-month pattern like /2025-04-14_
    match = re.search(r'/(\d{4}-\d{2}-\d{2})', url)
    if match:
        return match.group(1)

    return None


def normalize_date(raw: str) -> str | None:
    """Normalize various date formats to YYYY-MM-DD."""
    # Already YYYY-MM-DD
    match = re.match(r"(\d{4}-\d{2}-\d{2})", raw)
    if match:
        return match.group(1)
    # ISO 8601 with T
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})T", raw)
    if match:
        return f"{match.group(1)}-{match.group(2)}-{match.group(3)}"
    # Try parsing common formats
    for fmt in ["%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S", "%B %d, %Y", "%d %B %Y"]:
        try:
            dt = datetime.strptime(raw.strip(), fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def extract_urls_from_readme() -> list[tuple[str, str]]:
    """Extract (title, url) pairs for non-GitHub resources."""
    content = README_PATH.read_text()
    pairs = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)

    results = []
    for title, url in pairs:
        # Skip internal links, badges, GitHub repos, wiki, etc.
        if url.startswith(tuple(SKIP_PREFIXES)):
            continue
        if not url.startswith("http"):
            continue

        from urllib.parse import urlparse
        hostname = (urlparse(url).hostname or "").replace("www.", "")
        if hostname in SKIP_DOMAINS:
            continue
        # Skip GitHub repo links (already have pushed_at from repos_full.json)
        if "github.com" in hostname:
            continue

        results.append((title, url))

    return results


def enrich_url(title: str, url: str) -> str | None:
    """Try all strategies to get a publish date for a URL."""
    from urllib.parse import urlparse
    hostname = (urlparse(url).hostname or "").replace("www.", "")

    # YouTube
    if hostname in ("youtube.com", "youtu.be"):
        date = get_youtube_date(url)
        if date:
            return date

    # Twitter/X
    if hostname in ("twitter.com", "x.com"):
        return get_twitter_date(url)

    # Podcast RSS
    if hostname in RSS_FEEDS:
        date = get_podcast_date_from_rss(url)
        if date:
            return date

    # GCP Podcast special case
    if "gcppodcast.com" in hostname:
        date = get_podcast_date_from_rss(url)
        if date:
            return date

    # HTML meta tags (blogs, conference sites, etc.)
    date = get_html_meta_date(url)
    if date:
        return date

    return None


def main():
    # Load existing data if present
    if OUTPUT_PATH.exists():
        EXISTING.update(json.loads(OUTPUT_PATH.read_text()))
        print(f"Loaded {len(EXISTING)} existing entries from {OUTPUT_PATH}")

    urls = extract_urls_from_readme()
    print(f"Found {len(urls)} non-GitHub URLs to enrich")

    results: dict[str, str] = dict(EXISTING)
    new_count = 0
    failed: list[tuple[str, str]] = []

    for i, (title, url) in enumerate(urls, 1):
        if url in results:
            print(f"[{i}/{len(urls)}] CACHED: {title}")
            continue

        print(f"[{i}/{len(urls)}] Fetching: {title}")
        print(f"  URL: {url}")

        date = enrich_url(title, url)
        if date:
            results[url] = date
            new_count += 1
            print(f"  DATE: {date}")
        else:
            failed.append((title, url))
            print(f"  MISS: No date found")

        # Rate limit: be polite
        time.sleep(0.5)

    # Sort by URL for stable output
    sorted_results = dict(sorted(results.items()))

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(sorted_results, indent=2) + "\n")
    print(f"\nWrote {len(sorted_results)} entries to {OUTPUT_PATH}")
    print(f"  New: {new_count}, Cached: {len(EXISTING)}, Failed: {len(failed)}")

    if failed:
        print(f"\nFailed to find dates for {len(failed)} URLs:")
        for title, url in failed:
            print(f"  - {title}: {url}")


if __name__ == "__main__":
    main()
