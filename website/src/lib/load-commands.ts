import fs from "node:fs";
import path from "node:path";
import type { CommandStats } from "./command-types";

export type { CommandStats } from "./command-types";

const DEFAULT_STATS: CommandStats = {
	totalCommands: 0,
	totalRepos: 0,
	totalSpokenForms: 0,
	uniqueCommands: 0,
	communityCommands: 0,
};

export function loadCommandStats(): CommandStats {
	const filePath = path.resolve(process.cwd(), "data", "commands-stats.json");
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(content);
	} catch {
		return DEFAULT_STATS;
	}
}
