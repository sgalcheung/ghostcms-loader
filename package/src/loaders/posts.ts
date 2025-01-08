import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { postsSchema, type Post } from '../schemas/index.js';

export function PostsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-posts',
		schema: postsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
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
	};
}
