import { TSGhostContentAPI } from '@ts-ghost/content-api';

export function GhostCMSContentAPIFactory(url: string, key: string, version: `v5.${string}`) {
	return new TSGhostContentAPI(url, key, version);
}
