import { ListSearch } from "@/components/ListSearch";
import { type RepoMeta, getRepoMetaMap } from "@/lib/cross-reference";
import { loadRepos } from "@/lib/load-repos";
import { loadResourceDates } from "@/lib/load-resource-dates";
import { parseReadme } from "@/lib/parse-readme";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Curated List - Awesome Talon",
	description: "Browse the curated list of Talon voice control resources, tools, and command sets.",
};

export default function ListPage() {
	const list = parseReadme();
	const repos = loadRepos();
	const metaMap = getRepoMetaMap(repos);
	const resourceDates = loadResourceDates();

	// Convert Map to plain object for client component serialization
	const metaMapObj: Record<string, RepoMeta> = {};
	for (const [key, value] of metaMap) {
		metaMapObj[key] = value;
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
			<div className="mb-10">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Curated List</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-400">
				A curated list of awesome{" "}
				<a href="https://talonvoice.com/" className="text-teal-600 underline hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300" target="_blank" rel="noopener noreferrer">Talon</a>
				{" "}resources, command sets, plugins, and tools for voice-controlled computing.
			</p>
			</div>
			<ListSearch sections={list.sections} repoMeta={metaMapObj} resourceDates={resourceDates} />
		</div>
	);
}
