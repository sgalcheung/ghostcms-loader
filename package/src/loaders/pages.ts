import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import { AstroError } from 'astro/errors';
import type { Loader, LoaderContext } from 'astro/loaders';
import { type Page, pagesSchema } from '../schemas/index.js';
import { logger } from '../utils.js';

export function PageLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-pages',
		schema: pagesSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			const pages: Page[] = [];

			logger.log('Fetching pages from Ghost Content API');

			let cursor = await api.pages
				.browse()
				.include({ authors: true, tags: true })
				.paginate()
				.catch((err) => {
					logger.error(`Failed to fetch authors from Ghost Content API: ${err}`);
					throw new AstroError('Failed to fetch authors from Ghost Content API', err);
				});
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

			logger.success('Fetched pages from Ghost Content API');
		},
	};
}
