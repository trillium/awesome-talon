"use client";

import type { RepoMeta } from "@/lib/cross-reference";
import type { AwesomeSection } from "@/lib/types";
import { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { ItemCard } from "./ItemCard";
import { TableOfContents } from "./TableOfContents";

interface ListSearchProps {
	sections: AwesomeSection[];
	repoMeta: Record<string, RepoMeta>;
}

export function ListSearch({ sections, repoMeta }: ListSearchProps) {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		if (!query.trim()) return sections;
		const q = query.toLowerCase();
		return sections
			.map((section) => {
				const matchingItems = section.items.filter(
					(item) =>
						item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
				);
				const matchingSubs = section.subsections
					.map((sub) => ({
						...sub,
						items: sub.items.filter(
							(item) =>
								item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
						),
					}))
					.filter((sub) => sub.items.length > 0);

				const hasMatches = matchingItems.length > 0 || matchingSubs.length > 0;
				if (!hasMatches) return null;
				return { ...section, items: matchingItems, subsections: matchingSubs };
			})
			.filter(Boolean) as AwesomeSection[];
	}, [sections, query]);

	function getMeta(item: { githubSlug?: string }) {
		return item.githubSlug ? repoMeta[item.githubSlug.toLowerCase()] : undefined;
	}

	return (
		<div className="flex gap-8">
			<aside className="hidden w-56 shrink-0 lg:block">
				<div className="sticky top-24">
					<TableOfContents sections={filtered} />
				</div>
			</aside>
			<div className="min-w-0 flex-1">
				<div className="mb-8">
					<div className="relative">
						<LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<input
							type="text"
							placeholder="Search resources..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-600"
						/>
					</div>
					{query && (
						<p className="mt-2 text-sm text-neutral-500">
							{filtered.reduce(
								(acc, s) =>
									acc + s.items.length + s.subsections.reduce((a, sub) => a + sub.items.length, 0),
								0,
							)}{" "}
							results
						</p>
					)}
				</div>
				<div className="space-y-12">
					{filtered.map((section) => (
						<section key={section.slug} id={section.slug}>
							<h2 className="mb-1 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
								{section.title}
							</h2>
							{section.description && (
								<p className="mb-4 text-sm italic text-neutral-500">{section.description}</p>
							)}
							<div className="space-y-2">
								{section.items.map((item) => {
									const meta = getMeta(item);
									return (
										<ItemCard
											key={item.url}
											item={item}
											stars={meta?.stars}
											pushedAt={meta?.pushedAt}
										/>
									);
								})}
							</div>
							{section.subsections.map((sub) => (
								<div key={sub.slug} id={sub.slug} className="mt-6">
									<h3 className="mb-3 text-lg font-medium text-neutral-600 dark:text-neutral-300">
										{sub.title}
									</h3>
									<div className="space-y-2">
										{sub.items.map((item) => {
											const meta = getMeta(item);
											return (
												<ItemCard
													key={item.url}
													item={item}
													stars={meta?.stars}
													pushedAt={meta?.pushedAt}
												/>
											);
										})}
									</div>
								</div>
							))}
						</section>
					))}
					{filtered.length === 0 && (
						<p className="py-12 text-center text-neutral-500">No resources match your search.</p>
					)}
				</div>
			</div>
		</div>
	);
}
