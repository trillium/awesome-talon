import fs from "node:fs";
import path from "node:path";

export function loadResourceDates(): Record<string, string> {
	const filePath = path.resolve(process.cwd(), "data", "resource_dates.json");
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(content);
	} catch {
		return {};
	}
}
