import { CommandsExplorer } from "@/components/CommandsExplorer";
import { loadCommandStats } from "@/lib/load-commands";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Commands - Awesome Talon",
	description:
		"Search and explore voice commands across 300+ Talon repositories. Discover alternative spoken forms and community conventions.",
};

export default function CommandsPage() {
	const stats = loadCommandStats();

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
			<div className="mb-10">
				<h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Command Explorer</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-400">
					{stats.totalCommands > 0
						? `${stats.totalCommands.toLocaleString()} unique commands from ${stats.totalRepos} repos with ${stats.totalSpokenForms.toLocaleString()} spoken forms.`
						: "Loading command data..."}{" "}
					Discover how different Talon users say the same thing.
				</p>
			</div>
			<CommandsExplorer stats={stats} />
		</div>
	);
}
