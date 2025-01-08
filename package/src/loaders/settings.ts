import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import { AstroError } from 'astro/errors';
import type { Loader, LoaderContext } from 'astro/loaders';
import { loaderSettingsSchema } from '../schemas/index.js';
import { logger } from '../utils.js';

export const GHOST_CMS_SETTINGS_ID = 'settings';

export function SettingsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-settings',
		schema: loaderSettingsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			logger.log('Fetching settings from Ghost Content API');

			const res = await api.settings.fetch().catch((err) => {
				logger.error(`Failed to fetch authors from Ghost Content API: ${err}`);
				throw new AstroError('Failed to fetch authors from Ghost Content API', err);
			});
			if (!res.success) {
				throw new AstroError(
					'Failed to fetch settings from Ghost Content API',
					res.errors.join(', ')
				);
			}

			const settings = {
				...res.data,
				id: GHOST_CMS_SETTINGS_ID,
			};

			const parsedSettings = await parseData({ id: settings.id, data: settings });
			store.set({ id: parsedSettings.id, data: parsedSettings });

			logger.success('Fetched settings from Ghost Content API');
		},
	};
}
