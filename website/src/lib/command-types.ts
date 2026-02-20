export interface CommandStats {
	totalCommands: number;
	totalRepos: number;
	totalSpokenForms: number;
	uniqueCommands: number;
	communityCommands: number;
}

export interface CommandContext {
	os?: string;
	app?: string;
	tag?: string;
	mode?: string;
}

export interface CommandSummary {
	id: string;
	spokenForms: string[];
	canonicalForm: string;
	actionPreview: string;
	repoCount: number;
	isUnique: boolean;
	isCommunity: boolean;
	contexts: CommandContext[];
	letter: string;
}

export interface CommandAlternative {
	form: string;
	repos: string[];
	moreRepoCount?: number;
	context: CommandContext & { raw_header?: string };
	filePath: string;
}

export interface CommandDetail {
	spokenForms: CommandAlternative[];
	actionBody: string;
	repoCount: number;
	isUnique: boolean;
	isCommunity: boolean;
}

export async function fetchCommandsSummary(): Promise<CommandSummary[]> {
	const res = await fetch("/data/commands-summary.json");
	if (!res.ok) return [];
	return res.json();
}

export async function fetchCommandDetail(letter: string): Promise<Record<string, CommandDetail>> {
	const res = await fetch(`/data/commands-detail-${letter}.json`);
	if (!res.ok) return {};
	return res.json();
}
