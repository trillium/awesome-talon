"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuGithub } from "react-icons/lu";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/list", label: "List" },
	{ href: "/ecosystem", label: "Ecosystem" },
];

export function SiteHeader() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
				<Link
					href="/"
					className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white"
				>
					<span className="text-teal-600 dark:text-teal-400">~</span> Awesome Talon
				</Link>
				<nav className="flex items-center gap-1">
					{NAV_LINKS.map((link) => {
						const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
									isActive
										? "bg-teal-500/10 text-teal-700 dark:text-teal-400"
										: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
								}`}
							>
								{link.label}
							</Link>
						);
					})}
					<a
						href="https://github.com/trillium/awesome-talon"
						target="_blank"
						rel="noopener noreferrer"
						className="ml-2 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
					>
						<LuGithub className="h-4 w-4" />
						<span className="hidden sm:inline">GitHub</span>
					</a>
					<ThemeToggle />
				</nav>
			</div>
		</header>
	);
}
