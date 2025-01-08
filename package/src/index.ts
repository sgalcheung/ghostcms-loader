import { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { LoaderContext } from 'astro/loaders';
// @ts-expect-error - This is a Virtual Module from Astro
import { defineCollection } from 'astro:content';
import { loadEnv } from 'vite';
import {
	type Author,
	type Page,
	type Post,
	type Tag,
	type Tier,
	tagsSchema,
	pagesSchema,
	postsSchema,
	tiersSchema,
	authorsSchema,
	settingsSchema,
} from './schemas/index.js';

export function GhostCMSLoaderCollection(ghostUrl: string, apiVersion?: `v5.${string}`) {
	const env = loadEnv('all', process.cwd(), 'GHOST_');
	const key = env.GHOST_CONTENT_API_KEY;
	const version = apiVersion || 'v5.0';

	const api = new TSGhostContentAPI(ghostUrl, key, version);

	return {
		ghostAuthors: defineCollection({
			schema: authorsSchema,
			loader: async ({ store, parseData }: LoaderContext) => {
				const authors: Author[] = [];

				let cursor = await api.authors.browse().paginate();
				if (cursor.current.success) authors.push(...cursor.current.data);
				while (cursor.next) {
					cursor = await cursor.next.paginate();
					if (cursor.current.success) authors.push(...cursor.current.data);
				}

				for (const author of authors) {
					const parsedAuthor = await parseData({ id: author.id, data: author });

					store.set({ id: parsedAuthor.id, data: parsedAuthor });
				}
			},
		}),
		ghostPages: defineCollection({
			schema: pagesSchema,
			loader: async ({ store, parseData }: LoaderContext) => {
				const pages: Page[] = [];
				let cursor = await api.pages.browse().include({ authors: true, tags: true }).paginate();
				if (cursor.current.success) pages.push(...cursor.current.data);
				while (cursor.next) {
					cursor = await cursor.next.paginate();
					if (cursor.current.success) pages.push(...cursor.current.data);
				}

				for (const page of pages) {
					const parsedPage = await parseData({ id: page.id, data: page });

					store.set({
						id: parsedPage.id,
						data: parsedPage,
						body: parsedPage.plaintext || undefined,
						rendered: { html: parsedPage.html },
					});
				}
			},
		}),
		ghostPosts: defineCollection({
			schema: postsSchema,
			loader: async ({ store, parseData }: LoaderContext) => {
				const posts: Post[] = [];
				let cursor = await api.posts.browse().include({ authors: true, tags: true }).paginate();
				if (cursor.current.success) posts.push(...cursor.current.data);
				while (cursor.next) {
					cursor = await cursor.next.paginate();
					if (cursor.current.success) posts.push(...cursor.current.data);
				}

				for (const post of posts) {
					const parsedPost = await parseData({ id: post.id, data: post });

					store.set({
						id: parsedPost.id,
						data: parsedPost,
						body: parsedPost.plaintext || undefined,
						rendered: { html: parsedPost.html },
					});
				}
			},
		}),
		ghostSettings: defineCollection({
			schema: settingsSchema,
			loader: async ({ store, parseData }: LoaderContext) => {
				const res = await api.settings.fetch();
				if (res.success) {
					const settings = await parseData({ id: 'settings', data: res.data });
					store.set({ id: 'settings', data: settings });
				}
				throw new Error('Failed to fetch settings from Ghost Content API');
			},
		}),
		ghostTags: defineCollection({
			schema: tagsSchema,
			loader: async ({ store, parseData }: LoaderContext) => {
				const tags: Tag[] = [];
				let cursor = await api.tags.browse().include({ 'count.posts': true }).paginate();

				if (cursor.current.success) tags.push(...cursor.current.data);
				while (cursor.next) {
					cursor = await cursor.next.paginate();
					if (cursor.current.success) tags.push(...cursor.current.data);
				}

				for (const tag of tags) {
					const parsedTag = await parseData({ id: tag.id, data: tag });

					store.set({ id: parsedTag.id, data: parsedTag });
				}
			},
		}),
		ghostTiers: defineCollection({
			schema: tiersSchema,
			loader: async ({ store, parseData }: LoaderContext) => {
				const tiers: Tier[] = [];
				let cursor = await api.tiers
					.browse()
					.include({ benefits: true, monthly_price: true, yearly_price: true })
					.paginate();

				if (cursor.current.success) tiers.push(...cursor.current.data);

				while (cursor.next) {
					cursor = await cursor.next.paginate();
					if (cursor.current.success) tiers.push(...cursor.current.data);
				}

				for (const tier of tiers) {
					const parsedTier = await parseData({ id: tier.id, data: tier });

					store.set({ id: parsedTier.id, data: parsedTier });
				}
			},
		}),
	};
}
