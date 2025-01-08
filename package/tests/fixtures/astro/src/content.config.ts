import { GhostCMSLoaderCollection } from 'astro-ghostcms-loader';

export const collections = {
	...GhostCMSLoaderCollection({
		ghostUrl: 'https://demo.ghost.io',
		apiVersion: 'v5.0',
		__DO_NOT_USE_TESTING_ONLY__GHOST_CONTENT_API_KEY: '22444f78447824223cefc48062',
	}),
};
