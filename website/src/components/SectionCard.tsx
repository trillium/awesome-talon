import type { AwesomeSection } from "@/lib/types";
import Link from "next/link";

function countItems(section: AwesomeSection): number {
	let count = section.items.length;
	for (const sub of section.subsections) {
		count += sub.items.length;
	}
	return count;
}

export function SectionCard({ section }: { section: AwesomeSection }) {
	const itemCount = countItems(section);

	return (
		<Link
			href={`/list#${section.slug}`}
			className="group rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-teal-500/30 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
		>
			<div className="flex items-start justify-between">
				<h3 className="font-semibold text-neutral-900 group-hover:text-teal-600 transition-colors dark:text-neutral-100 dark:group-hover:text-teal-400">
					{section.title}
				</h3>
				<span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
					{itemCount}
				</span>
			</div>
			{section.description && (
				<p className="mt-2 text-sm leading-relaxed text-neutral-500 line-clamp-2">
					{section.description}
				</p>
			)}
			{section.subsections.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{section.subsections.map((sub) => (
						<span
							key={sub.slug}
							className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800/60"
						>
							{sub.title}
						</span>
					))}
				</div>
			)}
		</Link>
	);
}
