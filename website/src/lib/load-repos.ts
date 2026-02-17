import fs from "node:fs";
import path from "node:path";
import type { Repo } from "./types";

export function loadRepos(dataPath?: string): Repo[] {
	const filePath = dataPath ?? path.resolve(process.cwd(), "data", "repos_full.json");
	if (!fs.existsSync(filePath)) {
		console.warn(`repos_full.json not found at ${filePath}, using empty array`);
		return [];
	}
	const raw = fs.readFileSync(filePath, "utf-8");
	return JSON.parse(raw) as Repo[];
}
