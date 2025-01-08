import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { pagesSchema, type Page } from '../schemas/index.js';

export function PageLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-pages',
		schema: pagesSchema,
		load: async ({ store, parseData }: LoaderContext) => {
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
	};
}
