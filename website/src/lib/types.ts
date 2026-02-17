export interface Repo {
	name: string;
	stars: number;
	description: string;
	archived: boolean;
	fork: boolean;
	url: string;
	pushed_at: string;
	updated_at: string;
	created_at: string;
	default_branch: string;
	license: string;
	topics: string[];
	last_fetched: string;
}

export interface AwesomeItem {
	title: string;
	url: string;
	description: string;
	/** GitHub owner/repo slug if URL is a GitHub repo */
	githubSlug?: string;
	/** True if marked as not Talon-specific in the README */
	notTalonSpecific?: boolean;
}

export interface AwesomeSection {
	title: string;
	slug: string;
	description?: string;
	items: AwesomeItem[];
	subsections: AwesomeSubsection[];
}

export interface AwesomeSubsection {
	title: string;
	slug: string;
	items: AwesomeItem[];
}

export interface AwesomeList {
	title: string;
	description: string;
	sections: AwesomeSection[];
}
