import type { AwesomeList, Repo } from "./types";

/**
 * Build a Set of GitHub "owner/repo" slugs from the curated README list.
 */
export function getCuratedSlugs(list: AwesomeList): Set<string> {
	const slugs = new Set<string>();

	for (const section of list.sections) {
		for (const item of section.items) {
			if (item.githubSlug) slugs.add(item.githubSlug.toLowerCase());
		}
		for (const sub of section.subsections) {
			for (const item of sub.items) {
				if (item.githubSlug) slugs.add(item.githubSlug.toLowerCase());
			}
		}
	}

	return slugs;
}

export interface RepoMeta {
	stars: number;
	pushedAt: string;
}

/**
 * Build a map from GitHub slug to star count for repos in the ecosystem data.
 */
export function getRepoStarMap(repos: Repo[]): Map<string, number> {
	const map = new Map<string, number>();
	for (const repo of repos) {
		map.set(repo.name.toLowerCase(), repo.stars);
	}
	return map;
}

/**
 * Build a map from GitHub slug to repo metadata (stars + pushed_at).
 */
export function getRepoMetaMap(repos: Repo[]): Map<string, RepoMeta> {
	const map = new Map<string, RepoMeta>();
	for (const repo of repos) {
		map.set(repo.name.toLowerCase(), { stars: repo.stars, pushedAt: repo.pushed_at });
	}
	return map;
}
