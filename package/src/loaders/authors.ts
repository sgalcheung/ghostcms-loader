import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { authorsSchema, type Author } from '../schemas/index.js';

export function AuthorsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-authors',
		schema: authorsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
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
	};
}
