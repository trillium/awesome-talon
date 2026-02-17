"use client";

import type { Repo } from "@/lib/types";
import { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { RepoCard } from "./RepoCard";

type SortOption = "recent" | "stars" | "alpha";

interface EcosystemFilterProps {
	repos: Repo[];
	curatedSlugs: string[];
	lastUpdated: string | null;
}

function getActivityBuckets(repos: Repo[]) {
	const now = Date.now();
	const month = 30 * 24 * 60 * 60 * 1000;
	const buckets = [
		{ label: "Last month", count: 0 },
		{ label: "1-3 months", count: 0 },
		{ label: "3-6 months", count: 0 },
		{ label: "6-12 months", count: 0 },
		{ label: "1+ years", count: 0 },
	];

	for (const repo of repos) {
		const age = now - new Date(repo.pushed_at).getTime();
		if (age < month) buckets[0].count++;
		else if (age < 3 * month) buckets[1].count++;
		else if (age < 6 * month) buckets[2].count++;
		else if (age < 12 * month) buckets[3].count++;
		else buckets[4].count++;
	}

	return buckets;
}

export function EcosystemFilter({ repos, curatedSlugs, lastUpdated }: EcosystemFilterProps) {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<SortOption>("recent");
	const [hideArchived, setHideArchived] = useState(true);
	const [minStars, setMinStars] = useState(0);
	const [curatedOnly, setCuratedOnly] = useState(false);

	const curatedSet = useMemo(() => new Set(curatedSlugs), [curatedSlugs]);

	const filtered = useMemo(() => {
		let result = repos;
		const q = search.toLowerCase();

		if (q) {
			result = result.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.description.toLowerCase().includes(q) ||
					r.topics.some((t) => t.toLowerCase().includes(q)),
			);
		}

		if (hideArchived) result = result.filter((r) => !r.archived);
		if (minStars > 0) result = result.filter((r) => r.stars >= minStars);
		if (curatedOnly) result = result.filter((r) => curatedSet.has(r.name.toLowerCase()));

		switch (sort) {
			case "recent":
				result = [...result].sort(
					(a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
				);
				break;
			case "stars":
				result = [...result].sort((a, b) => b.stars - a.stars);
				break;
			case "alpha":
				result = [...result].sort((a, b) => a.name.localeCompare(b.name));
				break;
		}

		return result;
	}, [repos, search, sort, hideArchived, minStars, curatedOnly, curatedSet]);

	const buckets = useMemo(() => getActivityBuckets(repos), [repos]);

	return (
		<div>
			{/* Data freshness notice */}
			<div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
				<span>
					{lastUpdated
						? `Data last updated: ${new Date(lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
						: "Data updates weekly via CI"}
				</span>
				<span className="hidden sm:inline">&middot;</span>
				<a
					href="https://github.com/trillium/awesome-talon/blob/main/.playground/enrich.py"
					target="_blank"
					rel="noopener noreferrer"
					className="text-teal-600 underline underline-offset-2 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
				>
					View data pipeline
				</a>
				<span className="hidden sm:inline">&middot;</span>
				<a
					href="https://github.com/trillium/awesome-talon/actions/workflows/deploy-website.yml"
					target="_blank"
					rel="noopener noreferrer"
					className="text-teal-600 underline underline-offset-2 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
				>
					CI workflow
				</a>
			</div>

			{/* Activity buckets */}
			<div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
				{buckets.map((bucket) => (
					<div
						key={bucket.label}
						className="rounded-lg border border-neutral-200 bg-white p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
					>
						<div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
							{bucket.count}
						</div>
						<div className="mt-1 text-xs text-neutral-500">{bucket.label}</div>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						type="text"
						placeholder="Search repos..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-600"
					/>
				</div>
				<select
					value={sort}
					onChange={(e) => setSort(e.target.value as SortOption)}
					className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-600 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
				>
					<option value="recent">Recently pushed</option>
					<option value="stars">Most stars</option>
					<option value="alpha">Alphabetical</option>
				</select>
			</div>

			<div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={hideArchived}
						onChange={(e) => setHideArchived(e.target.checked)}
						className="accent-teal-500"
					/>
					Hide archived
				</label>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={curatedOnly}
						onChange={(e) => setCuratedOnly(e.target.checked)}
						className="accent-teal-500"
					/>
					Featured only
				</label>
				<label className="flex items-center gap-2 cursor-pointer">
					Min stars:
					<input
						type="number"
						value={minStars}
						onChange={(e) => setMinStars(Number(e.target.value) || 0)}
						min={0}
						className="w-20 rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-600 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
					/>
				</label>
				<span className="ml-auto text-neutral-500">
					{filtered.length} of {repos.length} repos
				</span>
			</div>

			{/* Repo grid */}
			<div className="grid gap-3 sm:grid-cols-2">
				{filtered.map((repo) => (
					<RepoCard
						key={repo.name}
						repo={repo}
						isCurated={curatedSet.has(repo.name.toLowerCase())}
					/>
				))}
			</div>
			{filtered.length === 0 && (
				<p className="py-12 text-center text-neutral-500">No repos match your filters.</p>
			)}
		</div>
	);
}
