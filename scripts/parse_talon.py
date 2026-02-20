#!/usr/bin/env python3
"""
Parse .talon files to extract voice commands.

Splits each file into context header and command body,
extracting spoken forms and their action bodies.
"""

import json
import os
import re
import sys

DEFAULT_CACHE_DIR = os.path.join(os.path.dirname(__file__), ".cache")
INPUT_FILE = "talon_files_raw.json"
OUTPUT_FILE = "parsed_commands.json"

# Context header keys we care about
CONTEXT_KEYS = {"os", "app", "app.name", "app.exe", "app.bundle", "tag", "mode", "title", "hostname"}


def parse_context_header(lines):
    """Parse the context header block above the separator.

    Returns dict with os, app, tag, mode, and raw_header.
    """
    context = {"os": "", "app": "", "tag": "", "mode": "", "raw_header": ""}
    raw_parts = []

    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        raw_parts.append(line)

        # Parse "key: value" or "key()" or "and/or" combinator lines
        m = re.match(r"^([\w.]+)\s*:\s*(.+)$", line)
        if not m:
            continue
        key, value = m.group(1), m.group(2).strip()

        if key == "os":
            context["os"] = value
        elif key in ("app", "app.name", "app.exe", "app.bundle"):
            context["app"] = value
        elif key == "tag":
            context["tag"] = value
        elif key == "mode":
            context["mode"] = value

    context["raw_header"] = "\n".join(raw_parts)
    return context


def parse_commands_body(lines):
    """Parse the command body below the separator.

    Returns list of {spoken_form, action_body, is_multiline}.
    """
    commands = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Skip blank lines, comments, settings blocks, tag declarations
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            i += 1
            continue

        # Skip settings() blocks
        if stripped.startswith("settings()"):
            i += 1
            # Skip until we leave the indented block
            while i < len(lines) and (not lines[i].strip() or lines[i][0] in (" ", "\t")):
                i += 1
            continue

        # Skip standalone tag() / key() / etc. declarations at top level
        if re.match(r"^(tag|key|app)\(\):", stripped):
            i += 1
            while i < len(lines) and (not lines[i].strip() or lines[i][0] in (" ", "\t")):
                i += 1
            continue

        # Try to match "spoken form: action" on one line
        # The delimiter is ": " (colon-space) — but we need to be careful
        # not to split on colons inside the action body
        m = re.match(r"^(\S.*?):\s+(.+)$", stripped)
        if m:
            spoken_form = m.group(1).strip()
            action_body = m.group(2).strip()
            commands.append({
                "spoken_form": spoken_form,
                "action_body": action_body,
                "is_multiline": False,
            })
            i += 1
            continue

        # Try to match "spoken form:" with action on next indented lines
        m = re.match(r"^(\S.*?):\s*$", stripped)
        if m:
            spoken_form = m.group(1).strip()
            # Gather indented continuation lines
            action_lines = []
            i += 1
            while i < len(lines):
                next_line = lines[i]
                if not next_line.strip():
                    # Blank line might be inside a multi-line action
                    # Check if the next non-blank line is still indented
                    peek = i + 1
                    while peek < len(lines) and not lines[peek].strip():
                        peek += 1
                    if peek < len(lines) and lines[peek][0] in (" ", "\t"):
                        action_lines.append("")
                        i += 1
                        continue
                    break
                if next_line[0] in (" ", "\t"):
                    action_lines.append(next_line.strip())
                    i += 1
                else:
                    break

            if action_lines:
                commands.append({
                    "spoken_form": spoken_form,
                    "action_body": "\n".join(action_lines),
                    "is_multiline": True,
                })
            continue

        # Unrecognized line — skip
        i += 1

    return commands


def parse_talon_file(content):
    """Parse a single .talon file.

    Returns {context, commands} or None if no commands found.
    """
    lines = content.split("\n")

    # Find the separator line (a line that is just dashes)
    sep_idx = None
    for idx, line in enumerate(lines):
        if re.match(r"^-+\s*$", line.strip()) and line.strip():
            sep_idx = idx
            break

    if sep_idx is not None:
        header_lines = lines[:sep_idx]
        body_lines = lines[sep_idx + 1:]
    else:
        # No header — entire file is body (global context)
        header_lines = []
        body_lines = lines

    context = parse_context_header(header_lines)
    commands = parse_commands_body(body_lines)

    return {"context": context, "commands": commands}


def parse_all(cache_dir=None, verbose=False):
    """
    Parse all .talon files from the crawl output.

    Returns path to output file.
    """
    cache_dir = cache_dir or DEFAULT_CACHE_DIR
    input_path = os.path.join(cache_dir, INPUT_FILE)

    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run crawl first.", file=sys.stderr)
        return None

    with open(input_path) as f:
        talon_files = json.load(f)

    print(f"Parsing {len(talon_files)} .talon files...", file=sys.stderr)

    results = []
    total_commands = 0
    parse_errors = 0

    for entry in talon_files:
        cache_path = entry["cache_path"]

        if not os.path.exists(cache_path):
            parse_errors += 1
            continue

        try:
            with open(cache_path) as f:
                content = f.read()
        except Exception:
            parse_errors += 1
            continue

        parsed = parse_talon_file(content)
        if not parsed["commands"]:
            continue

        total_commands += len(parsed["commands"])
        results.append({
            "repo": entry["repo"],
            "file_path": entry["path"],
            "blob_sha": entry["blob_sha"],
            "context": parsed["context"],
            "commands": parsed["commands"],
        })

        if verbose and parsed["commands"]:
            print(f"  {entry['repo']}:{entry['path']} -> {len(parsed['commands'])} commands", file=sys.stderr)

    output_path = os.path.join(cache_dir, OUTPUT_FILE)
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"Done: {total_commands} commands from {len(results)} files "
          f"({parse_errors} errors)", file=sys.stderr)

    return output_path


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Parse .talon files for voice commands")
    parser.add_argument("--cache-dir", default=DEFAULT_CACHE_DIR, help="Cache directory")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    args = parser.parse_args()
    parse_all(args.cache_dir, args.verbose)
