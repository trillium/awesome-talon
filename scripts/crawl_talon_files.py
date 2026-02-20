#!/usr/bin/env python3
"""
Crawl Talon repos and cache .talon file blobs.

Fetches git trees for all non-archived repos from repos_full.json,
filters for .talon files, and caches blob content by SHA (content-addressable).
"""

import base64
import json
import os
import subprocess
import sys
import time
from pathlib import Path

DEFAULT_REPOS_FILE = os.path.join(os.path.dirname(__file__), "..", ".playground", "repos_full.json")
DEFAULT_CACHE_DIR = os.path.join(os.path.dirname(__file__), ".cache")
CRAWL_STATE_FILE = "crawl_state.json"
OUTPUT_FILE = "talon_files_raw.json"
REQUEST_DELAY = 0.05  # 20 req/s


def gh_rest(endpoint):
    """Call gh api and return parsed JSON."""
    result = subprocess.run(
        ["gh", "api", endpoint],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return None


def load_repos(repos_file):
    """Load repos from repos_full.json."""
    with open(repos_file) as f:
        return json.load(f)


def load_crawl_state(cache_dir):
    """Load crawl state tracking per-repo timestamps."""
    state_path = os.path.join(cache_dir, CRAWL_STATE_FILE)
    if os.path.exists(state_path):
        with open(state_path) as f:
            return json.load(f)
    return {}


def save_crawl_state(cache_dir, state):
    """Save crawl state."""
    state_path = os.path.join(cache_dir, CRAWL_STATE_FILE)
    with open(state_path, "w") as f:
        json.dump(state, f, indent=2)


def fetch_tree(owner, repo, branch):
    """Fetch the full git tree for a repo."""
    endpoint = f"/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    time.sleep(REQUEST_DELAY)
    return gh_rest(endpoint)


def fetch_blob(owner, repo, sha, cache_dir):
    """Fetch blob content, using SHA-based cache."""
    blob_dir = os.path.join(cache_dir, "blobs")
    cache_path = os.path.join(blob_dir, f"{sha}.talon")

    if os.path.exists(cache_path):
        return cache_path

    endpoint = f"/repos/{owner}/{repo}/git/blobs/{sha}"
    time.sleep(REQUEST_DELAY)
    data = gh_rest(endpoint)
    if not data or "content" not in data:
        return None

    try:
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
    except Exception:
        return None

    os.makedirs(blob_dir, exist_ok=True)
    with open(cache_path, "w") as f:
        f.write(content)

    return cache_path


def crawl_repos(repos_file=None, cache_dir=None, full=False, verbose=False):
    """
    Main crawl function. Returns path to output file.

    Args:
        repos_file: Path to repos_full.json
        cache_dir: Path to cache directory
        full: Force full recrawl ignoring timestamps
        verbose: Print detailed progress
    """
    repos_file = repos_file or DEFAULT_REPOS_FILE
    cache_dir = cache_dir or DEFAULT_CACHE_DIR
    os.makedirs(cache_dir, exist_ok=True)

    repos = load_repos(repos_file)
    state = load_crawl_state(cache_dir)

    # Filter to non-archived repos with a default branch
    active_repos = [
        r for r in repos
        if not r.get("archived", False) and r.get("default_branch")
    ]

    print(f"Found {len(active_repos)} active repos (of {len(repos)} total)", file=sys.stderr)

    # Determine which repos need crawling
    if full:
        to_crawl = active_repos
    else:
        to_crawl = []
        for r in active_repos:
            name = r["name"]
            pushed_at = r.get("pushed_at", "")
            last_crawled = state.get(name, {}).get("last_crawled", "")
            if not last_crawled or pushed_at > last_crawled:
                to_crawl.append(r)

    print(f"Crawling {len(to_crawl)} repos ({len(active_repos) - len(to_crawl)} skipped as unchanged)", file=sys.stderr)

    # Collect all talon files
    all_files = []
    errors = 0
    cache_hits = 0
    blobs_fetched = 0

    # Load existing output to preserve files from skipped repos
    output_path = os.path.join(cache_dir, OUTPUT_FILE)
    existing_files = {}
    if not full and os.path.exists(output_path):
        with open(output_path) as f:
            for entry in json.load(f):
                key = f"{entry['repo']}:{entry['path']}"
                existing_files[key] = entry

    # Keep files from repos we're not re-crawling
    crawl_names = {r["name"] for r in to_crawl}
    for key, entry in existing_files.items():
        if entry["repo"] not in crawl_names:
            all_files.append(entry)

    for i, repo in enumerate(to_crawl):
        name = repo["name"]
        owner, repo_name = name.split("/", 1)
        branch = repo["default_branch"]

        if verbose:
            print(f"  [{i+1}/{len(to_crawl)}] {name}", file=sys.stderr)

        tree_data = fetch_tree(owner, repo_name, branch)
        if not tree_data or "tree" not in tree_data:
            if verbose:
                print(f"    Failed to fetch tree for {name}", file=sys.stderr)
            errors += 1
            continue

        talon_entries = [
            t for t in tree_data["tree"]
            if t["path"].endswith(".talon") and t["type"] == "blob"
        ]

        if verbose and talon_entries:
            print(f"    Found {len(talon_entries)} .talon files", file=sys.stderr)

        for entry in talon_entries:
            sha = entry["sha"]
            file_path = entry["path"]
            blob_cache = os.path.join(cache_dir, "blobs", f"{sha}.talon")

            if os.path.exists(blob_cache):
                cache_hits += 1
                cache_path = blob_cache
            else:
                cache_path = fetch_blob(owner, repo_name, sha, cache_dir)
                if cache_path:
                    blobs_fetched += 1
                else:
                    errors += 1
                    continue

            all_files.append({
                "repo": name,
                "path": file_path,
                "blob_sha": sha,
                "cache_path": cache_path,
            })

        # Update crawl state
        state[name] = {
            "last_crawled": repo.get("pushed_at", ""),
            "talon_file_count": len(talon_entries),
        }

    save_crawl_state(cache_dir, state)

    # Write output
    with open(output_path, "w") as f:
        json.dump(all_files, f, indent=2)

    print(f"Done: {len(all_files)} talon files indexed, "
          f"{cache_hits} cache hits, {blobs_fetched} blobs fetched, "
          f"{errors} errors", file=sys.stderr)

    return output_path


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Crawl Talon repos for .talon files")
    parser.add_argument("--full", action="store_true", help="Force full recrawl")
    parser.add_argument("--repos-file", default=DEFAULT_REPOS_FILE, help="Path to repos_full.json")
    parser.add_argument("--cache-dir", default=DEFAULT_CACHE_DIR, help="Cache directory")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    args = parser.parse_args()
    crawl_repos(args.repos_file, args.cache_dir, args.full, args.verbose)
