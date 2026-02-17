import { LuGithub, LuHeart } from "react-icons/lu";

export function SiteFooter() {
	return (
		<footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
				<div className="flex flex-col items-center gap-4 text-center text-sm text-neutral-500 sm:flex-row sm:justify-between sm:text-left">
					<div className="flex flex-col gap-1">
						<p className="flex items-center gap-1.5">
							<LuHeart className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
							<span>
								Contributions welcome!{" "}
								<a
									href="https://github.com/trillium/awesome-talon/blob/main/CONTRIBUTING.md"
									target="_blank"
									rel="noopener noreferrer"
									className="text-teal-600 underline underline-offset-2 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
								>
									Learn how to contribute
								</a>
							</span>
						</p>
						<p>
							Licensed under{" "}
							<a
								href="https://creativecommons.org/publicdomain/zero/1.0/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-teal-600 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-teal-400"
							>
								CC0 1.0
							</a>
						</p>
					</div>
					<div className="flex flex-col items-center gap-1 sm:items-end">
						<p>
							Built with{" "}
							<a
								href="https://nextjs.org"
								target="_blank"
								rel="noopener noreferrer"
								className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-teal-600 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-teal-400"
							>
								Next.js
							</a>
						</p>
						<a
							href="https://github.com/trillium/awesome-talon"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-teal-600 dark:text-neutral-400 dark:hover:text-teal-400"
						>
							<LuGithub className="h-3.5 w-3.5" />
							Source
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
