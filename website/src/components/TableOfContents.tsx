import type { AwesomeSection } from "@/lib/types";

export function TableOfContents({ sections }: { sections: AwesomeSection[] }) {
	return (
		<nav className="space-y-1">
			<h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
				Sections
			</h4>
			{sections.map((section) => (
				<a
					key={section.slug}
					href={`#${section.slug}`}
					className="block truncate rounded-md px-2 py-1 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
				>
					{section.title}
				</a>
			))}
		</nav>
	);
}
