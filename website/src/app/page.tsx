import { RepoCard } from "@/components/RepoCard";
import { SectionCard } from "@/components/SectionCard";
import { getCuratedSlugs } from "@/lib/cross-reference";
import { loadRepos } from "@/lib/load-repos";
import { parseReadme } from "@/lib/parse-readme";
import Link from "next/link";

export default function HomePage() {
	const list = parseReadme();
	const repos = loadRepos();
	const curatedSlugs = getCuratedSlugs(list);

	const totalItems = list.sections.reduce(
		(acc, s) => acc + s.items.length + s.subsections.reduce((a, sub) => a + sub.items.length, 0),
		0,
	);

	const recentRepos = [...repos]
		.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
		.slice(0, 6);

	return (
		<div>
			{/* Hero */}
			<section className="border-b border-neutral-200 dark:border-neutral-800">
				<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
					<h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
						Awesome <span className="text-teal-600 dark:text-teal-400">Talon</span>
					</h1>
					<p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
						A curated list of awesome{" "}
						<a href="https://talonvoice.com/" className="text-teal-600 underline hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300" target="_blank" rel="noopener noreferrer">Talon</a>
						{" "}resources, command sets, plugins, and tools for voice-controlled computing.
					</p>
					<div className="mt-8 flex gap-3">
						<Link
							href="/list"
							className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-500"
						>
							Browse the list
						</Link>
						<Link
							href="/ecosystem"
							className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
						>
							Explore ecosystem
						</Link>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/30">
				<div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-neutral-200 px-4 sm:px-6 dark:divide-neutral-800">
					<div className="py-6 text-center">
						<div className="text-3xl font-bold text-neutral-900 dark:text-white">{totalItems}</div>
						<div className="mt-1 text-sm text-neutral-500">Curated resources</div>
					</div>
					<div className="py-6 text-center">
						<div className="text-3xl font-bold text-neutral-900 dark:text-white">
							{repos.length}
						</div>
						<div className="mt-1 text-sm text-neutral-500">Repos tracked</div>
					</div>
					<div className="py-6 text-center">
						<div className="text-3xl font-bold text-neutral-900 dark:text-white">
							{list.sections.length}
						</div>
						<div className="mt-1 text-sm text-neutral-500">Categories</div>
					</div>
				</div>
			</section>

			{/* Section grid */}
			<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
				<h2 className="mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">Categories</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{list.sections.map((section) => (
						<SectionCard key={section.slug} section={section} />
					))}
				</div>
			</section>

			{/* Recently active */}
			<section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
				<div className="mb-8 flex items-center justify-between">
					<h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
						Recently Active
					</h2>
					<Link
						href="/ecosystem"
						className="text-sm text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
					>
						View all &rarr;
					</Link>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{recentRepos.map((repo) => (
						<RepoCard
							key={repo.name}
							repo={repo}
							isCurated={curatedSlugs.has(repo.name.toLowerCase())}
						/>
					))}
				</div>
			</section>
		</div>
	);
}
