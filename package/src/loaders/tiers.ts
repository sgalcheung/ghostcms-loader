import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { tiersSchema, type Tier } from '../schemas/index.js';

export function TiersLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-tiers',
		schema: tiersSchema,
		load: async ({ store, parseData }: LoaderContext) => {
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
	};
}
