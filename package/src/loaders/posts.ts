import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { postsSchema, type Post } from '../schemas/index.js';
import { logger } from '../utils.js';
import { AstroError } from 'astro/errors';

export function PostsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-posts',
		schema: postsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			const posts: Post[] = [];

			logger.log('Fetching posts from Ghost Content API');

			let cursor = await api.posts
				.browse()
				.include({ authors: true, tags: true })
				.paginate()
				.catch((err) => {
					logger.error(`Failed to fetch authors from Ghost Content API: ${err}`);
					throw new AstroError('Failed to fetch authors from Ghost Content API', err);
				});
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

			logger.success('Fetched posts from Ghost Content API');
		},
	};
}
