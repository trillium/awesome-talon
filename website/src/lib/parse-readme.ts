import fs from "node:fs";
import path from "node:path";
import type { AwesomeItem, AwesomeList, AwesomeSection, AwesomeSubsection } from "./types";
import { extractGitHubSlug, slugify } from "./utils";

const ITEM_RE = /^- \[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+)$/;
const H2_RE = /^## (.+)$/;
const H3_RE = /^### (.+)$/;
const SECTION_DESC_RE = /^\*(.+)\*$/;

const SKIP_SECTIONS = new Set(["Contents", "Contributing"]);

const NOT_TALON_RE = /\s*\*\(Not Talon-specific\)\*\s*$/;

function parseItem(line: string): AwesomeItem | null {
	const match = line.match(ITEM_RE);
	if (!match) return null;
	const [, title, url, rawDesc] = match;
	const notTalonSpecific = NOT_TALON_RE.test(rawDesc);
	const description = rawDesc.replace(NOT_TALON_RE, "").trim();
	return {
		title,
		url,
		description,
		githubSlug: extractGitHubSlug(url),
		...(notTalonSpecific && { notTalonSpecific: true }),
	};
}

export function parseReadme(readmePath?: string): AwesomeList {
	const filePath = readmePath ?? path.resolve(process.cwd(), "data", "README.md");
	const content = fs.readFileSync(filePath, "utf-8");
	const lines = content.split("\n");

	const sections: AwesomeSection[] = [];
	let currentSection: AwesomeSection | null = null;
	let currentSubsection: AwesomeSubsection | null = null;
	let listTitle = "";
	let listDescription = "";

	for (const line of lines) {
		const trimmed = line.trim();

		// Title
		if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
			listTitle = trimmed.replace(/^# /, "").replace(/\s*\[.*$/, "");
			continue;
		}

		// Description (blockquote)
		if (trimmed.startsWith("> ") && !listDescription) {
			listDescription = trimmed.replace(/^> /, "");
			continue;
		}

		// H2 section
		const h2Match = trimmed.match(H2_RE);
		if (h2Match) {
			const title = h2Match[1];
			if (SKIP_SECTIONS.has(title)) {
				currentSection = null;
				currentSubsection = null;
				continue;
			}
			currentSubsection = null;
			currentSection = {
				title,
				slug: slugify(title),
				items: [],
				subsections: [],
			};
			sections.push(currentSection);
			continue;
		}

		// H3 subsection
		const h3Match = trimmed.match(H3_RE);
		if (h3Match && currentSection) {
			currentSubsection = {
				title: h3Match[1],
				slug: slugify(h3Match[1]),
				items: [],
			};
			currentSection.subsections.push(currentSubsection);
			continue;
		}

		// Section description (italic text)
		const descMatch = trimmed.match(SECTION_DESC_RE);
		if (descMatch && currentSection && currentSection.items.length === 0) {
			currentSection.description = descMatch[1];
			continue;
		}

		// List item
		if (trimmed.startsWith("- [") && currentSection) {
			const item = parseItem(trimmed);
			if (item) {
				if (currentSubsection) {
					currentSubsection.items.push(item);
				} else {
					currentSection.items.push(item);
				}
			}
		}
	}

	return { title: listTitle, description: listDescription, sections };
}
