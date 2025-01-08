import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { tagsSchema, type Tag } from '../schemas/index.js';

export function TagsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-tags',
		schema: tagsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
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
	};
}
