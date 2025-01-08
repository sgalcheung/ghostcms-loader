import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import { AstroError } from 'astro/errors';
import type { Loader, LoaderContext } from 'astro/loaders';
import { type Author, authorsSchema } from '../schemas/index.js';
import { logger } from '../utils.js';

export function AuthorsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-authors',
		schema: authorsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			const authors: Author[] = [];

			logger.log('Fetching authors from Ghost Content API');

			let cursor = await api.authors
				.browse()
				.paginate()
				.catch((err) => {
					logger.error(`Failed to fetch authors from Ghost Content API: ${err}`);
					throw new AstroError('Failed to fetch authors from Ghost Content API', err);
				});
			if (cursor.current.success) authors.push(...cursor.current.data);
			while (cursor.next) {
				cursor = await cursor.next.paginate();
				if (cursor.current.success) authors.push(...cursor.current.data);
			}

			for (const author of authors) {
				const parsedAuthor = await parseData({ id: author.id, data: author });

				store.set({ id: parsedAuthor.id, data: parsedAuthor });
			}

			logger.success('Fetched authors from Ghost Content API');
		},
	};
}
