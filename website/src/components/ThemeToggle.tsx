"use client";

import { useEffect, useState } from "react";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
	const resolved = theme === "system" ? getSystemTheme() : theme;
	document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("system");

	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		if (stored) {
			setTheme(stored);
			applyTheme(stored);
		}

		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			const current = localStorage.getItem("theme") as Theme | null;
			if (!current || current === "system") {
				applyTheme("system");
			}
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	function cycle() {
		const order: Theme[] = ["light", "dark", "system"];
		const next = order[(order.indexOf(theme) + 1) % order.length];
		setTheme(next);
		localStorage.setItem("theme", next);
		applyTheme(next);
	}

	const label = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";
	const Icon = theme === "dark" ? LuMoon : theme === "light" ? LuSun : LuMonitor;

	return (
		<button
			type="button"
			onClick={cycle}
			className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
			aria-label={`Theme: ${label}. Click to switch.`}
		>
			<Icon className="h-4 w-4" />
			<span className="hidden sm:inline">{label}</span>
		</button>
	);
}
