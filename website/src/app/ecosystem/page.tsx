import { EcosystemFilter } from "@/components/EcosystemFilter";
import { getCuratedSlugs } from "@/lib/cross-reference";
import { loadRepos } from "@/lib/load-repos";
import { parseReadme } from "@/lib/parse-readme";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Ecosystem - Awesome Talon",
	description: "Explore the Talon voice control ecosystem with sortable, filterable repo data.",
};

export default function EcosystemPage() {
	const list = parseReadme();
	const repos = loadRepos();
	const curatedSlugs = getCuratedSlugs(list);

	// Find most recent last_fetched date
	const lastUpdated = repos.reduce<string | null>((latest, repo) => {
		if (!repo.last_fetched) return latest;
		if (!latest) return repo.last_fetched;
		return repo.last_fetched > latest ? repo.last_fetched : latest;
	}, null);

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
			<div className="mb-10">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Ecosystem Explorer</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-400">
					Tracking {repos.length} Talon-related repositories across GitHub. Sort, filter, and
					discover projects in the Talon ecosystem.
				</p>
			</div>
			<EcosystemFilter
				repos={repos}
				curatedSlugs={Array.from(curatedSlugs)}
				lastUpdated={lastUpdated}
			/>
		</div>
	);
}
