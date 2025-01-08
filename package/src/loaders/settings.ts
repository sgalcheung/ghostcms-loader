import type { TSGhostContentAPI } from '@ts-ghost/content-api';
import type { Loader, LoaderContext } from 'astro/loaders';
import { settingsSchema } from '../schemas/index.js';

export function SettingsLoader(api: TSGhostContentAPI<`v5.${string}`>): Loader {
	return {
		name: 'ghostcms-settings',
		schema: settingsSchema,
		load: async ({ store, parseData }: LoaderContext) => {
			const res = await api.settings.fetch();
			if (!res.success) {
				throw new Error('Failed to fetch settings from Ghost Content API');
			}
			const settings = await parseData({ id: 'settings', data: res.data });
			store.set({ id: 'settings', data: settings });
		},
	};
}
