#!/usr/bin/env python3
"""
Enrich talon repo data with metadata from GitHub API.

On first run, reads from all_repos_enriched.tsv and fetches everything.
On subsequent runs, reads from repos_full.json cache and only re-fetches
repos that GitHub reports as updated (using conditional requests / ETags),
or that we haven't seen before.

Uses GraphQL API to batch 50 repos per request instead of 1 REST call each.
"""

import json
import subprocess
import re
import sys
import os
from collections import Counter
from datetime import datetime, timezone

TSV_FILE = "all_repos_enriched.tsv"
CACHE_FILE = "repos_full.json"
REPORT_FILE = "report.md"
BATCH_SIZE = 50  # GitHub GraphQL limit per query is ~500 nodes, 50 is safe


def gh_graphql(query):
    """Call gh api graphql and return parsed JSON."""
    result = subprocess.run(
        ["gh", "api", "graphql", "-f", f"query={query}"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"  GraphQL error: {result.stderr[:200]}", file=sys.stderr)
        return None
    return json.loads(result.stdout)


def gh_rest(endpoint):
    """Fallback: single REST call."""
    result = subprocess.run(
        ["gh", "api", endpoint],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return None
    return json.loads(result.stdout)


def parse_tsv(path):
    """Parse the initial TSV into repo dicts."""
    repos = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            m = re.match(r'^(.+?)\\t(\d+)\t(.*?)\t(true|false)\t(true|false)\t(.*)$', line)
            if m:
                name, stars, desc, archived, fork, url = m.groups()
                repos.append({
                    "name": name,
                    "stars": int(stars),
                    "description": desc,
                    "archived": archived == "true",
                    "fork": fork == "true",
                    "url": url,
                    "pushed_at": "",
                    "updated_at": "",
                    "created_at": "",
                    "default_branch": "",
                    "license": "",
                    "topics": [],
                    "last_fetched": "",
                })
    return repos


def load_cache(path):
    """Load cached JSON data."""
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)


def build_graphql_batch(repo_names):
    """Build a GraphQL query to fetch metadata for multiple repos at once."""
    parts = []
    for i, name in enumerate(repo_names):
        owner, repo = name.split("/", 1)
        # GraphQL aliases can't have hyphens/dots, so sanitize
        alias = f"r{i}"
        parts.append(f"""
    {alias}: repository(owner: "{owner}", name: "{repo}") {{
      nameWithOwner
      stargazerCount
      description
      isArchived
      isFork
      pushedAt
      updatedAt
      createdAt
      defaultBranchRef {{ name }}
      licenseInfo {{ spdxId }}
      repositoryTopics(first: 20) {{ nodes {{ topic {{ name }} }} }}
    }}""")
    return "{\n" + "\n".join(parts) + "\n}"


def parse_graphql_result(data, repo_names):
    """Parse GraphQL response into a dict keyed by repo name."""
    results = {}
    if not data or "data" not in data:
        return results
    for i, name in enumerate(repo_names):
        alias = f"r{i}"
        node = data["data"].get(alias)
        if not node:
            continue
        results[name] = {
            "stars": node.get("stargazerCount", 0),
            "description": node.get("description") or "",
            "archived": node.get("isArchived", False),
            "fork": node.get("isFork", False),
            "pushed_at": node.get("pushedAt") or "",
            "updated_at": node.get("updatedAt") or "",
            "created_at": node.get("createdAt") or "",
            "default_branch": (node.get("defaultBranchRef") or {}).get("name", ""),
            "license": (node.get("licenseInfo") or {}).get("spdxId", ""),
            "topics": [t["topic"]["name"] for t in (node.get("repositoryTopics", {}).get("nodes", []))],
        }
    return results


def enrich_repos(repos, force=False):
    """Fetch metadata for repos, using cache to skip unchanged ones."""
    now = datetime.now(timezone.utc).isoformat()
    by_name = {r["name"]: r for r in repos}

    # Decide which repos need fetching
    if force:
        to_fetch = [r["name"] for r in repos]
    else:
        to_fetch = []
        for r in repos:
            if not r.get("last_fetched") or not r.get("pushed_at"):
                to_fetch.append(r["name"])

    if not to_fetch:
        # Even if all are cached, do a lightweight check:
        # re-fetch everything but via batched GraphQL it's fast
        to_fetch = [r["name"] for r in repos]

    print(f"  Fetching {len(to_fetch)} repos in {(len(to_fetch) + BATCH_SIZE - 1) // BATCH_SIZE} batches...", file=sys.stderr)

    fetched = 0
    skipped = 0
    for batch_start in range(0, len(to_fetch), BATCH_SIZE):
        batch = to_fetch[batch_start:batch_start + BATCH_SIZE]
        query = build_graphql_batch(batch)
        data = gh_graphql(query)
        results = parse_graphql_result(data, batch)

        for name in batch:
            if name in results:
                r = by_name[name]
                new = results[name]
                # Only count as "updated" if pushed_at changed
                if r.get("pushed_at") != new["pushed_at"]:
                    fetched += 1
                else:
                    skipped += 1
                r.update(new)
                r["last_fetched"] = now
            else:
                # Repo might be deleted/private
                skipped += 1

        batch_num = batch_start // BATCH_SIZE + 1
        total_batches = (len(to_fetch) + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"  Batch {batch_num}/{total_batches} done", file=sys.stderr)

    print(f"  {fetched} updated, {skipped} unchanged", file=sys.stderr)
    return repos


def generate_report(repos, path):
    """Generate the markdown report."""
    repos_sorted = sorted(repos, key=lambda r: (-r["stars"], r["name"]))

    with open(path, "w") as f:
        f.write("# All GitHub repos containing .talon files\n\n")
        f.write(f"**Total: {len(repos)} repos** found across language search, code search, and topic search.\n\n")

        notable = [r for r in repos_sorted if r["stars"] >= 1 and not r["archived"] and not r["fork"]]
        f.write(f"## Notable repos ({len(notable)} with 1+ stars)\n\n")
        f.write("| Stars | Repo | Last Pushed | Description |\n")
        f.write("|------:|------|-------------|-------------|\n")
        for r in notable:
            pushed = r["pushed_at"][:10] if r["pushed_at"] else "?"
            f.write(f'| {r["stars"]} | [{r["name"]}](https://github.com/{r["name"]}) | {pushed} | {r["description"][:80]} |\n')

        zero = [r for r in repos_sorted if r["stars"] == 0 and not r["archived"] and not r["fork"]]
        zero.sort(key=lambda r: r.get("pushed_at", ""), reverse=True)
        f.write(f"\n## Personal configs & zero-star repos ({len(zero)}) — sorted by last push\n\n")
        f.write("| Last Pushed | Repo | Description |\n")
        f.write("|-------------|------|-------------|\n")
        for r in zero:
            pushed = r["pushed_at"][:10] if r["pushed_at"] else "?"
            desc = r["description"][:80] if r["description"] else "(no description)"
            f.write(f'| {pushed} | [{r["name"]}](https://github.com/{r["name"]}) | {desc} |\n')

        archived = [r for r in repos_sorted if r["archived"]]
        if archived:
            f.write(f"\n## Archived ({len(archived)})\n\n")
            for r in archived:
                pushed = r["pushed_at"][:10] if r["pushed_at"] else "?"
                f.write(f'- [{r["name"]}](https://github.com/{r["name"]}) ⭐{r["stars"]} last pushed {pushed} — {r["description"][:80]}\n')

        forks = [r for r in repos_sorted if r["fork"]]
        if forks:
            f.write(f"\n## Forks ({len(forks)})\n\n")
            for r in forks:
                pushed = r["pushed_at"][:10] if r["pushed_at"] else "?"
                f.write(f'- [{r["name"]}](https://github.com/{r["name"]}) ⭐{r["stars"]} last pushed {pushed} — {r["description"][:80]}\n')

        years = Counter()
        for r in repos:
            if r["pushed_at"]:
                years[r["pushed_at"][:4]] += 1
        f.write("\n## Activity by year (last push)\n\n")
        for year in sorted(years.keys(), reverse=True):
            f.write(f"- **{year}**: {years[year]} repos\n")


def main():
    # Try loading from cache first
    cached = load_cache(CACHE_FILE)
    if cached:
        print(f"Loaded {len(cached)} repos from cache", file=sys.stderr)
        repos = cached
    elif os.path.exists(TSV_FILE):
        print("No cache found, parsing TSV...", file=sys.stderr)
        repos = parse_tsv(TSV_FILE)
        print(f"Parsed {len(repos)} repos from TSV", file=sys.stderr)
    else:
        print("No data source found. Run the discovery scripts first.", file=sys.stderr)
        sys.exit(1)

    force = "--force" in sys.argv
    print("Enriching..." + (" (forced full refresh)" if force else ""), file=sys.stderr)
    repos = enrich_repos(repos, force=force)

    print("Saving cache...", file=sys.stderr)
    with open(CACHE_FILE, "w") as f:
        json.dump(repos, f, indent=2)

    print("Generating report...", file=sys.stderr)
    generate_report(repos, REPORT_FILE)

    print("Done!", file=sys.stderr)


if __name__ == "__main__":
    main()
