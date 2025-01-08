import { TSGhostContentAPI } from '@ts-ghost/content-api';
// @ts-expect-error - This is a Virtual Module from Astro
import { defineCollection } from 'astro:content';
import { loadEnv } from 'vite';
import {
	tagsSchema,
	pagesSchema,
	postsSchema,
	tiersSchema,
	authorsSchema,
	settingsSchema,
} from './schemas/index.js';
import type { LoaderCollection } from './types.js';
import {
	AuthorsLoader,
	PageLoader,
	PostsLoader,
	TagsLoader,
	SettingsLoader,
	TiersLoader,
} from './loaders/index.js';

export function GhostCMSLoaderCollection(
	/**
	 * The URL of your Ghost CMS instance
	 *
	 * @example
	 * 'https://demo.ghost.io'
	 *
	 */
	ghostUrl: string,
	/**
	 * The version of the Ghost Content API to use
	 *
	 * @example
	 * 'v5.0'
	 *
	 * @default 'v5.0'
	 */
	apiVersion?: `v5.${string}`,
	/**
	 * DO NOT USE THIS, THIS IS UNSAFE AND MEANT FOR INTERNAL USE ONLY/TESTING
	 *
	 * Set your api key in your .env file as `GHOST_CONTENT_API_KEY`
	 */
	__DO_NOT_USE__API_KEY?: string
): LoaderCollection {
	const env = loadEnv('all', process.cwd(), 'GHOST_');
	const version = apiVersion || 'v5.0';
	const key = env.GHOST_CONTENT_API_KEY || __DO_NOT_USE__API_KEY;

	if (!key) {
		throw new Error('GHOST_CONTENT_API_KEY is required in your .env file');
	}

	const api = new TSGhostContentAPI(ghostUrl, key, version);

	return {
		ghostAuthors: defineCollection({
			schema: authorsSchema,
			loader: AuthorsLoader(api),
		}),
		ghostPages: defineCollection({
			schema: pagesSchema,
			loader: PageLoader(api),
		}),
		ghostPosts: defineCollection({
			schema: postsSchema,
			loader: PostsLoader(api),
		}),
		ghostSettings: defineCollection({
			schema: settingsSchema,
			loader: SettingsLoader(api),
		}),
		ghostTags: defineCollection({
			schema: tagsSchema,
			loader: TagsLoader(api),
		}),
		ghostTiers: defineCollection({
			schema: tiersSchema,
			loader: TiersLoader(api),
		}),
	};
}
