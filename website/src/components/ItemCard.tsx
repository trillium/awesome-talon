import type { AwesomeItem } from "@/lib/types";
import { RESOURCE_TYPE_LABELS, type ResourceType, getResourceType, timeAgo } from "@/lib/utils";
import {
	LuBookOpen,
	LuClock,
	LuExternalLink,
	LuGithub,
	LuGlobe,
	LuPackage,
	LuPodcast,
	LuStar,
	LuVideo,
} from "react-icons/lu";

const RESOURCE_ICONS: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
	github: LuGithub,
	video: LuVideo,
	wiki: LuBookOpen,
	podcast: LuPodcast,
	extension: LuPackage,
	package: LuPackage,
	website: LuGlobe,
};

interface ItemCardProps {
	item: AwesomeItem;
	stars?: number;
	pushedAt?: string;
}

export function ItemCard({ item, stars, pushedAt }: ItemCardProps) {
	const resourceType = getResourceType(item.url);
	const ResourceIcon = RESOURCE_ICONS[resourceType];
	const resourceLabel = RESOURCE_TYPE_LABELS[resourceType];

	return (
		<div className="group rounded-lg border border-neutral-200/80 bg-white p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800/50 dark:bg-neutral-900/30 dark:hover:border-neutral-700">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span
							className="flex shrink-0 items-center text-neutral-400 dark:text-neutral-600"
							title={resourceLabel}
						>
							<ResourceIcon className="h-4 w-4" />
						</span>
						<a
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-teal-600 hover:decoration-teal-500/50 dark:text-neutral-100 dark:decoration-neutral-700 dark:hover:text-teal-400"
						>
							{item.title}
						</a>
						{item.notTalonSpecific && (
							<span
								className="flex shrink-0 items-center gap-1 rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-400"
								title="This project is not Talon-specific but is useful to the voice coding community"
							>
								<LuExternalLink className="h-3 w-3" />
								not Talon-specific
							</span>
						)}
					</div>
					<p className="mt-1 text-sm leading-relaxed text-neutral-500">{item.description}</p>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					{pushedAt && (
						<span
							className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-600"
							title={`Last pushed ${pushedAt}`}
						>
							<LuClock className="h-3 w-3" />
							{timeAgo(pushedAt)}
						</span>
					)}
					{stars !== undefined && stars > 0 && (
						<span
							className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:bg-neutral-800 dark:text-yellow-500"
							title={`${stars} stars on GitHub`}
						>
							<LuStar className="h-3 w-3" />
							{stars.toLocaleString()}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
