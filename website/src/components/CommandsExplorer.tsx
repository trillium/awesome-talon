"use client";

import type { CommandDetail, CommandStats, CommandSummary } from "@/lib/command-types";
import { fetchCommandDetail, fetchCommandsSummary } from "@/lib/command-types";
import { useVirtualizer } from "@tanstack/react-virtual";
import MiniSearch from "minisearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuChevronDown, LuChevronRight, LuSearch } from "react-icons/lu";

type SortOption = "popular" | "alpha" | "unique";

interface CommandsExplorerProps {
	stats: CommandStats;
}

export function CommandsExplorer({ stats }: CommandsExplorerProps) {
	const [commands, setCommands] = useState<CommandSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<SortOption>("popular");
	const [uniqueOnly, setUniqueOnly] = useState(false);
	const [communityOnly, setCommunityOnly] = useState(false);
	const [contextFilter, setContextFilter] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [detailCache, setDetailCache] = useState<Record<string, Record<string, CommandDetail>>>({});
	const [detailLoading, setDetailLoading] = useState<string | null>(null);
	const parentRef = useRef<HTMLDivElement>(null);
	const miniSearchRef = useRef<MiniSearch<CommandSummary> | null>(null);

	// Load summary data on mount
	useEffect(() => {
		fetchCommandsSummary().then((data) => {
			setCommands(data);
			// Build MiniSearch index
			const ms = new MiniSearch<CommandSummary>({
				fields: ["canonicalForm", "actionPreview", "allForms"],
				storeFields: ["id"],
				searchOptions: {
					prefix: true,
					fuzzy: 0.2,
					boost: { canonicalForm: 3, allForms: 2 },
				},
			});
			const docs = data.map((c) => ({
				...c,
				allForms: c.spokenForms.join(" "),
			}));
			ms.addAll(docs);
			miniSearchRef.current = ms;
			setLoading(false);
		});
	}, []);

	// Get unique context values for dropdown
	const contextOptions = useMemo(() => {
		const tags = new Set<string>();
		const apps = new Set<string>();
		for (const cmd of commands) {
			for (const ctx of cmd.contexts) {
				if (ctx.tag) tags.add(ctx.tag);
				if (ctx.app) apps.add(ctx.app);
			}
		}
		const options: { value: string; label: string }[] = [];
		for (const t of [...tags].sort()) options.push({ value: `tag:${t}`, label: `tag: ${t}` });
		for (const a of [...apps].sort()) options.push({ value: `app:${a}`, label: `app: ${a}` });
		return options;
	}, [commands]);

	// Filter and sort
	const filtered = useMemo(() => {
		let result = commands;

		// Text search via MiniSearch
		if (search && miniSearchRef.current) {
			const hits = miniSearchRef.current.search(search);
			const hitIds = new Set(hits.map((h) => h.id));
			result = result.filter((c) => hitIds.has(c.id));
			// Preserve MiniSearch relevance ordering for search results
			if (sort === "popular") {
				const idOrder = new Map(hits.map((h, i) => [h.id, i]));
				result = [...result].sort(
					(a, b) => (idOrder.get(a.id) ?? 999999) - (idOrder.get(b.id) ?? 999999),
				);
			}
		}

		if (uniqueOnly) result = result.filter((c) => c.isUnique);
		if (communityOnly) result = result.filter((c) => c.isCommunity);

		if (contextFilter) {
			const [type, value] = contextFilter.split(":", 2);
			result = result.filter((c) =>
				c.contexts.some((ctx) => {
					if (type === "tag") return ctx.tag === value;
					if (type === "app") return ctx.app === value;
					return false;
				}),
			);
		}

		// Sort (only if not using search relevance)
		if (!search || sort !== "popular") {
			switch (sort) {
				case "popular":
					result = [...result].sort((a, b) => b.repoCount - a.repoCount);
					break;
				case "alpha":
					result = [...result].sort((a, b) => a.canonicalForm.localeCompare(b.canonicalForm));
					break;
				case "unique":
					result = [...result].sort(
						(a, b) => (b.isUnique ? 1 : 0) - (a.isUnique ? 1 : 0) || b.repoCount - a.repoCount,
					);
					break;
			}
		}

		return result;
	}, [commands, search, sort, uniqueOnly, communityOnly, contextFilter]);

	// Virtual list
	const virtualizer = useVirtualizer({
		count: filtered.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 72,
		overscan: 10,
	});

	// Expand/collapse with detail loading
	const toggleExpand = useCallback(
		async (cmd: CommandSummary) => {
			if (expandedId === cmd.id) {
				setExpandedId(null);
				return;
			}

			setExpandedId(cmd.id);

			// Load detail if not cached
			if (!detailCache[cmd.letter]) {
				setDetailLoading(cmd.letter);
				const detail = await fetchCommandDetail(cmd.letter);
				setDetailCache((prev) => ({ ...prev, [cmd.letter]: detail }));
				setDetailLoading(null);
			}
		},
		[expandedId, detailCache],
	);

	if (loading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
						key={i}
						className="h-16 animate-pulse rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
					/>
				))}
			</div>
		);
	}

	if (commands.length === 0) {
		return (
			<div className="rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
				<p className="text-neutral-500">
					No command data available yet. The command index is built weekly by CI.
				</p>
			</div>
		);
	}

	return (
		<div>
			{/* Stats bar */}
			<div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					{ label: "Commands", value: stats.totalCommands },
					{ label: "Spoken forms", value: stats.totalSpokenForms },
					{ label: "Community", value: stats.communityCommands },
					{ label: "Unique", value: stats.uniqueCommands },
				].map((s) => (
					<div
						key={s.label}
						className="rounded-lg border border-neutral-200 bg-white p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
					>
						<div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
							{s.value.toLocaleString()}
						</div>
						<div className="mt-1 text-xs text-neutral-500">{s.label}</div>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						type="text"
						placeholder="Search commands..."
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
					<option value="popular">Most popular</option>
					<option value="alpha">Alphabetical</option>
					<option value="unique">Unique first</option>
				</select>
				{contextOptions.length > 0 && (
					<select
						value={contextFilter}
						onChange={(e) => setContextFilter(e.target.value)}
						className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-600 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
					>
						<option value="">All contexts</option>
						{contextOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				)}
			</div>

			<div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
				<label className="flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						checked={communityOnly}
						onChange={(e) => setCommunityOnly(e.target.checked)}
						className="accent-teal-500"
					/>
					Community only
				</label>
				<label className="flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						checked={uniqueOnly}
						onChange={(e) => setUniqueOnly(e.target.checked)}
						className="accent-teal-500"
					/>
					Unique only
				</label>
				<span className="ml-auto text-neutral-500">
					{filtered.length.toLocaleString()} of {commands.length.toLocaleString()} commands
				</span>
			</div>

			{/* Virtualized command list */}
			<div
				ref={parentRef}
				className="h-[70vh] overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-800"
			>
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{virtualizer.getVirtualItems().map((virtualRow) => {
						const cmd = filtered[virtualRow.index];
						const isExpanded = expandedId === cmd.id;
						const detail = detailCache[cmd.letter]?.[cmd.id];

						return (
							<div
								key={cmd.id}
								data-index={virtualRow.index}
								ref={virtualizer.measureElement}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<CommandCard
									cmd={cmd}
									isExpanded={isExpanded}
									detail={detail}
									detailLoading={detailLoading === cmd.letter}
									onToggle={() => toggleExpand(cmd)}
								/>
							</div>
						);
					})}
				</div>
			</div>

			{filtered.length === 0 && (
				<p className="py-12 text-center text-neutral-500">No commands match your filters.</p>
			)}
		</div>
	);
}

// --- Command Card ---

interface CommandCardProps {
	cmd: CommandSummary;
	isExpanded: boolean;
	detail?: CommandDetail;
	detailLoading: boolean;
	onToggle: () => void;
}

function CommandCard({ cmd, isExpanded, detail, detailLoading, onToggle }: CommandCardProps) {
	return (
		<div className="border-b border-neutral-100 dark:border-neutral-800/50">
			{/* Summary row */}
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
			>
				<span className="flex-shrink-0 text-neutral-400">
					{isExpanded ? (
						<LuChevronDown className="h-4 w-4" />
					) : (
						<LuChevronRight className="h-4 w-4" />
					)}
				</span>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<code className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
							{cmd.canonicalForm}
						</code>
						{cmd.spokenForms.length > 1 && (
							<span className="flex-shrink-0 text-xs text-neutral-400">
								+{cmd.spokenForms.length - 1} alt{cmd.spokenForms.length > 2 ? "s" : ""}
							</span>
						)}
					</div>
					<div className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-500">
						<code>{cmd.actionPreview}</code>
					</div>
				</div>

				<div className="flex flex-shrink-0 items-center gap-2">
					{cmd.isCommunity && (
						<span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-400">
							community
						</span>
					)}
					{cmd.isUnique && (
						<span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
							unique
						</span>
					)}
					<span className="min-w-[3rem] text-right text-xs text-neutral-400">
						{cmd.repoCount} repo{cmd.repoCount !== 1 ? "s" : ""}
					</span>
				</div>
			</button>

			{/* Expanded detail */}
			{isExpanded && (
				<div className="border-t border-neutral-100 bg-neutral-50/50 px-4 py-4 dark:border-neutral-800/50 dark:bg-neutral-900/20">
					{detailLoading && !detail ? (
						<div className="animate-pulse text-sm text-neutral-400">Loading details...</div>
					) : detail ? (
						<div className="space-y-4">
							{/* Action body */}
							<div>
								<h4 className="mb-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
									Action
								</h4>
								<pre className="overflow-x-auto rounded-md bg-neutral-100 p-3 text-xs text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
									{detail.actionBody}
								</pre>
							</div>

							{/* Spoken form alternatives */}
							{detail.spokenForms.length > 1 && (
								<div>
									<h4 className="mb-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
										Alternative spoken forms
									</h4>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="border-b border-neutral-200 text-left text-xs text-neutral-400 dark:border-neutral-700">
													<th className="pb-1.5 pr-4 font-medium">Form</th>
													<th className="pb-1.5 pr-4 font-medium">Context</th>
													<th className="pb-1.5 font-medium">Repos</th>
												</tr>
											</thead>
											<tbody>
												{detail.spokenForms.map((sf) => (
													<tr
														key={sf.form}
														className="border-b border-neutral-100 dark:border-neutral-800/30"
													>
														<td className="py-1.5 pr-4">
															<code className="text-neutral-900 dark:text-neutral-100">
																{sf.form}
															</code>
														</td>
														<td className="py-1.5 pr-4 text-xs text-neutral-500">
															{formatContext(sf.context)}
														</td>
														<td className="py-1.5 text-xs text-neutral-500">
															{sf.repos.slice(0, 3).join(", ")}
															{sf.repos.length > 3 && (
																<span> +{sf.repos.length - 3 + (sf.moreRepoCount ?? 0)} more</span>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* Single form — just show repos */}
							{detail.spokenForms.length === 1 && (
								<div>
									<h4 className="mb-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
										Repos
									</h4>
									<p className="text-xs text-neutral-500">
										{detail.spokenForms[0].repos.slice(0, 5).join(", ")}
										{detail.spokenForms[0].repos.length > 5 && (
											<span>
												{" "}
												+
												{detail.spokenForms[0].repos.length -
													5 +
													(detail.spokenForms[0].moreRepoCount ?? 0)}{" "}
												more
											</span>
										)}
									</p>
								</div>
							)}
						</div>
					) : (
						<div className="text-sm text-neutral-400">Details not available.</div>
					)}
				</div>
			)}
		</div>
	);
}

function formatContext(ctx: { os?: string; app?: string; tag?: string; mode?: string }): string {
	const parts: string[] = [];
	if (ctx.os) parts.push(`os: ${ctx.os}`);
	if (ctx.app) parts.push(`app: ${ctx.app}`);
	if (ctx.tag) parts.push(`tag: ${ctx.tag}`);
	if (ctx.mode) parts.push(`mode: ${ctx.mode}`);
	return parts.join(", ") || "global";
}
