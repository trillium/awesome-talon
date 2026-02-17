export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

export function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function timeAgo(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals = [
		{ label: "year", seconds: 31536000 },
		{ label: "month", seconds: 2592000 },
		{ label: "week", seconds: 604800 },
		{ label: "day", seconds: 86400 },
		{ label: "hour", seconds: 3600 },
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.seconds);
		if (count >= 1) {
			return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
		}
	}

	return "just now";
}

export function extractGitHubSlug(url: string): string | undefined {
	const match = url.match(/github\.com\/([^/]+\/[^/]+)\/?$/);
	return match ? match[1] : undefined;
}

export type ResourceType =
	| "github"
	| "video"
	| "wiki"
	| "podcast"
	| "extension"
	| "package"
	| "website";

export function getResourceType(url: string): ResourceType {
	try {
		const hostname = new URL(url).hostname.replace(/^www\./, "");

		if (hostname === "github.com") return "github";
		if (hostname === "youtube.com" || hostname === "youtu.be") return "video";
		if (hostname === "talon.wiki" || hostname === "talonvoice.com") return "wiki";
		if (hostname === "marketplace.visualstudio.com" || hostname === "open-vsx.org")
			return "extension";
		if (hostname === "pypi.org" || hostname === "npmjs.com") return "package";
		if (
			hostname === "syntax.fm" ||
			hostname === "changelog.com" ||
			hostname.includes("libsyn.com") ||
			hostname.includes("podcast")
		)
			return "podcast";

		return "website";
	} catch {
		return "website";
	}
}

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
	github: "GitHub",
	video: "Video",
	wiki: "Wiki",
	podcast: "Podcast",
	extension: "Extension",
	package: "Package",
	website: "Website",
};
