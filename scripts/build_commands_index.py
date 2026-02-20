#!/usr/bin/env python3
"""
Orchestrator: crawl → parse → index Talon commands.

Runs the full pipeline to produce searchable command data
for the Awesome Talon website.
"""

import argparse
import os
import sys
import time

# Add scripts dir to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from crawl_talon_files import crawl_repos
from parse_talon import parse_all
from index_commands import index_commands

DEFAULT_CACHE_DIR = os.path.join(os.path.dirname(__file__), ".cache")
DEFAULT_REPOS_FILE = os.path.join(os.path.dirname(__file__), "..", ".playground", "repos_full.json")


def main():
    parser = argparse.ArgumentParser(
        description="Build Talon command search index (crawl → parse → index)"
    )
    parser.add_argument("--full", action="store_true",
                        help="Force full recrawl of all repos")
    parser.add_argument("--repos-file", default=DEFAULT_REPOS_FILE,
                        help="Path to repos_full.json")
    parser.add_argument("--cache-dir", default=DEFAULT_CACHE_DIR,
                        help="Cache directory for intermediate files")
    parser.add_argument("--output-dir",
                        default=os.path.join(os.path.dirname(__file__), "..", "website"),
                        help="Website output directory")
    parser.add_argument("--skip-crawl", action="store_true",
                        help="Skip crawl step (use cached talon_files_raw.json)")
    parser.add_argument("--skip-parse", action="store_true",
                        help="Skip parse step (use cached parsed_commands.json)")
    parser.add_argument("--verbose", action="store_true",
                        help="Verbose output")
    args = parser.parse_args()

    start = time.time()
    os.makedirs(args.cache_dir, exist_ok=True)

    # Step 1: Crawl
    if not args.skip_crawl:
        print("=" * 60, file=sys.stderr)
        print("STEP 1: Crawling repos for .talon files", file=sys.stderr)
        print("=" * 60, file=sys.stderr)
        try:
            result = crawl_repos(
                repos_file=args.repos_file,
                cache_dir=args.cache_dir,
                full=args.full,
                verbose=args.verbose,
            )
            if not result:
                print("Crawl failed!", file=sys.stderr)
                return 1
        except Exception as e:
            print(f"Crawl error: {e}", file=sys.stderr)
            return 1
    else:
        print("Skipping crawl (using cached data)", file=sys.stderr)

    # Step 2: Parse
    if not args.skip_parse:
        print("=" * 60, file=sys.stderr)
        print("STEP 2: Parsing .talon files", file=sys.stderr)
        print("=" * 60, file=sys.stderr)
        try:
            result = parse_all(
                cache_dir=args.cache_dir,
                verbose=args.verbose,
            )
            if not result:
                print("Parse failed!", file=sys.stderr)
                return 1
        except Exception as e:
            print(f"Parse error: {e}", file=sys.stderr)
            return 1
    else:
        print("Skipping parse (using cached data)", file=sys.stderr)

    # Step 3: Index
    print("=" * 60, file=sys.stderr)
    print("STEP 3: Indexing commands", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    try:
        success = index_commands(
            cache_dir=args.cache_dir,
            output_dir=args.output_dir,
            verbose=args.verbose,
        )
        if not success:
            print("Index failed!", file=sys.stderr)
            return 1
    except Exception as e:
        print(f"Index error: {e}", file=sys.stderr)
        return 1

    elapsed = time.time() - start
    print("=" * 60, file=sys.stderr)
    print(f"Pipeline complete in {elapsed:.1f}s", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
