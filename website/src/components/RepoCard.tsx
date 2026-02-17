import type { Repo } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { LuArchive, LuBookMarked, LuStar } from "react-icons/lu";

interface RepoCardProps {
	repo: Repo;
	isCurated: boolean;
}

export function RepoCard({ repo, isCurated }: RepoCardProps) {
	return (
		<div className="rounded-lg border border-neutral-200/80 bg-white p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800/50 dark:bg-neutral-900/30 dark:hover:border-neutral-700">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<a
							href={repo.url}
							target="_blank"
							rel="noopener noreferrer"
							className="truncate font-mono text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-teal-600 hover:decoration-teal-500/50 dark:text-neutral-100 dark:decoration-neutral-700 dark:hover:text-teal-400"
						>
							{repo.name}
						</a>
						{isCurated && (
							<span
								className="flex shrink-0 items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-400"
								title="Featured in the Awesome Talon list"
							>
								<LuBookMarked className="h-3 w-3" />
								featured
							</span>
						)}
						{repo.archived && (
							<span className="flex shrink-0 items-center gap-1 rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-500">
								<LuArchive className="h-3 w-3" />
								archived
							</span>
						)}
					</div>
					{repo.description && (
						<p className="mt-1.5 text-sm leading-relaxed text-neutral-500 line-clamp-2">
							{repo.description}
						</p>
					)}
					<div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-neutral-400 dark:text-neutral-600">
						<span className="flex items-center gap-1" title={`${repo.stars} stars`}>
							<LuStar className="h-3 w-3" />
							{repo.stars.toLocaleString()}
						</span>
						<span title={`Last pushed ${repo.pushed_at}`}>Updated {timeAgo(repo.pushed_at)}</span>
						{repo.license && <span>{repo.license}</span>}
					</div>
				</div>
			</div>
			{repo.topics.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{repo.topics.slice(0, 5).map((topic) => (
						<span
							key={topic}
							className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800/60"
						>
							{topic}
						</span>
					))}
					{repo.topics.length > 5 && (
						<span className="text-xs text-neutral-400 dark:text-neutral-600">
							+{repo.topics.length - 5}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
