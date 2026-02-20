#!/usr/bin/env python3
"""
Index parsed Talon commands into searchable JSON artifacts.

Groups commands by normalized action body, identifies alternatives,
marks canonical (community) forms, and produces summary + detail files.
"""

import hashlib
import json
import os
import re
import sys
from collections import defaultdict

DEFAULT_CACHE_DIR = os.path.join(os.path.dirname(__file__), ".cache")
INPUT_FILE = "parsed_commands.json"

COMMUNITY_REPO = "talonhub/community"
MAX_REPOS_PER_FORM = 10  # Cap repo lists in detail files


def normalize_action(action_body):
    """Normalize an action body for grouping.

    Collapses whitespace and strips comments to group equivalent actions.
    """
    # Remove inline comments
    lines = []
    for line in action_body.split("\n"):
        line = re.sub(r"#.*$", "", line).strip()
        if line:
            lines.append(line)
    return "\n".join(lines).strip()


def make_id(action_body):
    """Generate a short stable ID from the action body."""
    normalized = normalize_action(action_body)
    return hashlib.sha256(normalized.encode()).hexdigest()[:12]


def get_letter(spoken_form):
    """Get the letter bucket for a spoken form."""
    first = spoken_form.strip().lower()[:1]
    if first.isalpha():
        return first
    return "_misc"


def index_commands(cache_dir=None, output_dir=None, verbose=False):
    """
    Build command index from parsed commands.

    Args:
        cache_dir: Path to cache directory with parsed_commands.json
        output_dir: Base path for website/ directory
        verbose: Print detailed progress
    """
    cache_dir = cache_dir or DEFAULT_CACHE_DIR
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(__file__), "..", "website")

    input_path = os.path.join(cache_dir, INPUT_FILE)
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run parse first.", file=sys.stderr)
        return False

    with open(input_path) as f:
        parsed_files = json.load(f)

    print(f"Indexing commands from {len(parsed_files)} files...", file=sys.stderr)

    # Phase 1: Group commands by normalized action body
    # Key: normalized_action -> list of occurrences
    action_groups = defaultdict(list)

    # Track unique blob SHAs to deduplicate verbatim copies.
    # Process community repo first so its blobs are registered before forks.
    seen_blobs = set()
    deduped = 0

    # Sort: community first, then everything else
    sorted_files = sorted(parsed_files, key=lambda f: (0 if f["repo"] == COMMUNITY_REPO else 1, f["repo"]))

    for file_entry in sorted_files:
        repo = file_entry["repo"]
        file_path = file_entry["file_path"]
        blob_sha = file_entry["blob_sha"]
        context = file_entry["context"]

        # Deduplicate: if we've seen this exact blob, skip it
        # (many repos fork community — same SHA = same content)
        if blob_sha in seen_blobs:
            deduped += 1
            continue
        seen_blobs.add(blob_sha)

        for cmd in file_entry["commands"]:
            normalized = normalize_action(cmd["action_body"])
            action_groups[normalized].append({
                "spoken_form": cmd["spoken_form"],
                "action_body": cmd["action_body"],
                "repo": repo,
                "file_path": file_path,
                "context": context,
                "is_multiline": cmd["is_multiline"],
            })

    print(f"Found {len(action_groups)} unique actions "
          f"({deduped} duplicate blobs skipped)", file=sys.stderr)

    # Phase 2: Build command entries
    commands = {}  # id -> command entry

    for normalized_action, occurrences in action_groups.items():
        cmd_id = make_id(normalized_action)

        # Collect unique spoken forms with their repos and contexts
        form_map = defaultdict(lambda: {"repos": set(), "contexts": [], "file_paths": []})
        repos_set = set()
        is_community = False

        for occ in occurrences:
            form = occ["spoken_form"]
            form_map[form]["repos"].add(occ["repo"])
            form_map[form]["contexts"].append(occ["context"])
            form_map[form]["file_paths"].append(occ["file_path"])
            repos_set.add(occ["repo"])
            if occ["repo"] == COMMUNITY_REPO:
                is_community = True

        # Determine canonical form (prefer community, then most common)
        canonical_form = None
        for form, info in form_map.items():
            if COMMUNITY_REPO in info["repos"]:
                canonical_form = form
                break
        if not canonical_form:
            # Pick most common form
            canonical_form = max(form_map.keys(), key=lambda f: len(form_map[f]["repos"]))

        # Build spoken forms list
        spoken_forms = []
        for form, info in form_map.items():
            repos_list = sorted(info["repos"])
            spoken_forms.append({
                "form": form,
                "repos": repos_list[:MAX_REPOS_PER_FORM],
                "moreRepoCount": max(0, len(repos_list) - MAX_REPOS_PER_FORM),
                "context": info["contexts"][0],  # Use first context as representative
                "filePath": info["file_paths"][0],
            })

        # Sort: canonical first, then by repo count descending
        spoken_forms.sort(key=lambda sf: (
            sf["form"] != canonical_form,
            -len(sf["repos"]) - sf["moreRepoCount"],
        ))

        repo_count = len(repos_set)
        is_unique = repo_count <= 2 and not is_community

        # Get action preview (first line, truncated)
        action_preview = occurrences[0]["action_body"].split("\n")[0]
        if len(action_preview) > 80:
            action_preview = action_preview[:77] + "..."

        # Collect distinct contexts
        contexts = []
        seen_ctx = set()
        for occ in occurrences:
            ctx = occ["context"]
            ctx_key = (ctx["os"], ctx["app"], ctx["tag"], ctx["mode"])
            if ctx_key not in seen_ctx:
                seen_ctx.add(ctx_key)
                contexts.append(ctx)

        commands[cmd_id] = {
            "id": cmd_id,
            "spokenForms": spoken_forms,
            "canonicalForm": canonical_form,
            "actionBody": occurrences[0]["action_body"],
            "actionPreview": action_preview,
            "repoCount": repo_count,
            "isUnique": is_unique,
            "isCommunity": is_community,
            "contexts": contexts,
            "letter": get_letter(canonical_form),
        }

    print(f"Built {len(commands)} command entries", file=sys.stderr)

    # Phase 3: Write output files
    data_dir = os.path.join(output_dir, "data")
    public_data_dir = os.path.join(output_dir, "public", "data")
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(public_data_dir, exist_ok=True)

    # 3a: commands-stats.json (build-time, small)
    stats = {
        "totalCommands": len(commands),
        "totalRepos": len({r for c in commands.values() for sf in c["spokenForms"] for r in sf["repos"]}),
        "totalSpokenForms": sum(len(c["spokenForms"]) for c in commands.values()),
        "uniqueCommands": sum(1 for c in commands.values() if c["isUnique"]),
        "communityCommands": sum(1 for c in commands.values() if c["isCommunity"]),
    }

    stats_path = os.path.join(data_dir, "commands-stats.json")
    with open(stats_path, "w") as f:
        json.dump(stats, f, indent=2)
    print(f"  commands-stats.json: {os.path.getsize(stats_path)} bytes", file=sys.stderr)

    # 3b: commands-summary.json (client-fetched, needs to be compact)
    summary = []
    for cmd in commands.values():
        summary.append({
            "id": cmd["id"],
            "spokenForms": [sf["form"] for sf in cmd["spokenForms"]],
            "canonicalForm": cmd["canonicalForm"],
            "actionPreview": cmd["actionPreview"],
            "repoCount": cmd["repoCount"],
            "isUnique": cmd["isUnique"],
            "isCommunity": cmd["isCommunity"],
            "contexts": [
                {k: v for k, v in ctx.items() if v and k != "raw_header"}
                for ctx in cmd["contexts"][:3]  # Cap at 3 contexts in summary
            ],
            "letter": cmd["letter"],
        })

    # Sort by repo count desc, then canonical form alpha
    summary.sort(key=lambda s: (-s["repoCount"], s["canonicalForm"]))

    summary_path = os.path.join(public_data_dir, "commands-summary.json")
    with open(summary_path, "w") as f:
        json.dump(summary, f, separators=(",", ":"))
    size_mb = os.path.getsize(summary_path) / (1024 * 1024)
    print(f"  commands-summary.json: {size_mb:.2f} MB", file=sys.stderr)

    # 3c: commands-detail-{letter}.json (on-demand per letter)
    by_letter = defaultdict(dict)
    for cmd in commands.values():
        letter = cmd["letter"]
        by_letter[letter][cmd["id"]] = {
            "spokenForms": cmd["spokenForms"],
            "actionBody": cmd["actionBody"],
            "repoCount": cmd["repoCount"],
            "isUnique": cmd["isUnique"],
            "isCommunity": cmd["isCommunity"],
        }

    for letter, detail in by_letter.items():
        detail_path = os.path.join(public_data_dir, f"commands-detail-{letter}.json")
        with open(detail_path, "w") as f:
            json.dump(detail, f, separators=(",", ":"))
        size_kb = os.path.getsize(detail_path) / 1024
        if verbose:
            print(f"  commands-detail-{letter}.json: {size_kb:.1f} KB ({len(detail)} commands)", file=sys.stderr)

    print(f"  {len(by_letter)} detail files written", file=sys.stderr)

    # Write .gitkeep for public/data
    gitkeep_path = os.path.join(public_data_dir, ".gitkeep")
    if not os.path.exists(gitkeep_path):
        with open(gitkeep_path, "w") as f:
            pass

    return True


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Index Talon commands into searchable JSON")
    parser.add_argument("--cache-dir", default=DEFAULT_CACHE_DIR, help="Cache directory")
    parser.add_argument("--output-dir", help="Website output directory")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    args = parser.parse_args()
    success = index_commands(args.cache_dir, args.output_dir, args.verbose)
    sys.exit(0 if success else 1)
