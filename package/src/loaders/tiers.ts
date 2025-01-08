import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import { AstroError } from 'astro/errors';
import type { Loader, LoaderContext } from 'astro/loaders';
import { type Tier, tiersSchema } from '../schemas/index.js';
import { logger } from '../utils.js';

export function TiersLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-tiers',
		schema: tiersSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			const tiers: Tier[] = [];

			logger.log('Fetching tiers from Ghost Content API');

			let cursor = await api.tiers
				.browse()
				.include({ benefits: true, monthly_price: true, yearly_price: true })
				.paginate()
				.catch((err) => {
					logger.error(`Failed to fetch authors from Ghost Content API: ${err}`);
					throw new AstroError('Failed to fetch authors from Ghost Content API', err);
				});
			if (cursor.current.success) tiers.push(...cursor.current.data);
			while (cursor.next) {
				cursor = await cursor.next.paginate();
				if (cursor.current.success) tiers.push(...cursor.current.data);
			}

			for (const tier of tiers) {
				const parsedTier = await parseData({ id: tier.id, data: tier });
				store.set({ id: parsedTier.id, data: parsedTier });
			}

			logger.success('Fetched tiers from Ghost Content API');
		},
	};
}
