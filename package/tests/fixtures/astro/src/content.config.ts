import { GhostCMSLoaderCollection } from 'astro-ghostcms-loader';

export const collections = {
	...GhostCMSLoaderCollection('https://demo.ghost.io', 'v5.0', '22444f78447824223cefc48062'),
};
