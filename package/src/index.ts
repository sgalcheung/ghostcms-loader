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
import type { LoaderCollection, LoaderCollectionOpts } from './types.js';
import {
	AuthorsLoader,
	PageLoader,
	PostsLoader,
	TagsLoader,
	SettingsLoader,
	TiersLoader,
} from './loaders/index.js';
import { GhostCMSContentAPIFactory } from './api.js';

export function GhostCMSLoaderCollection({
	ghostUrl,
	apiVersion = 'v5.0',
	__DO_NOT_USE__API_KEY,
}: LoaderCollectionOpts): LoaderCollection {
	const env = loadEnv('all', process.cwd(), 'GHOST_');
	const key = env.GHOST_CONTENT_API_KEY || __DO_NOT_USE__API_KEY || '';

	if (!key) {
		console.error(
			'GHOST_CONTENT_API_KEY is required in your .env file to use the astro-ghostcms-loader'
		);
	}

	const api = GhostCMSContentAPIFactory(ghostUrl, key, apiVersion);

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
