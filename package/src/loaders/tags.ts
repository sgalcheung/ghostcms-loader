import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import { AstroError } from 'astro/errors';
import type { Loader, LoaderContext } from 'astro/loaders';
import { type Tag, tagsSchema } from '../schemas/index.js';
import { logger } from '../utils.js';

export function TagsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-tags',
		schema: tagsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			const tags: Tag[] = [];

			logger.log('Fetching tags from Ghost Content API');

			let cursor = await api.tags
				.browse()
				.include({ 'count.posts': true })
				.paginate()
				.catch((err) => {
					logger.error(`Failed to fetch authors from Ghost Content API: ${err}`);
					throw new AstroError('Failed to fetch authors from Ghost Content API', err);
				});
			if (cursor.current.success) tags.push(...cursor.current.data);
			while (cursor.next) {
				cursor = await cursor.next.paginate();
				if (cursor.current.success) tags.push(...cursor.current.data);
			}

			for (const tag of tags) {
				const parsedTag = await parseData({ id: tag.id, data: tag });
				store.set({ id: parsedTag.id, data: parsedTag });
			}

			logger.success('Fetched tags from Ghost Content API');
		},
	};
}
