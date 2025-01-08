import { blue, dim, green, red } from 'kleur/colors';

const dt = new Intl.DateTimeFormat('en-us', {
	hour: '2-digit',
	minute: '2-digit',
});

const date = dt.format(new Date());

export const logger = {
	log: (message: string) =>
		console.log(`${date} ${blue('[astro-ghostcms-loader]:')} ${dim(message)}`),
	info: (message: string) =>
		console.info(`${date} ${blue('[astro-ghostcms-loader]:')} ${dim(message)}`),
	success: (message: string) =>
		console.log(`${date} ${blue('[astro-ghostcms-loader]:')} ${green(`√ ${message}`)}`),
	error: (message: string) =>
		console.error(`${date} ${red('ERROR [astro-ghostcms-loader]:')} ${red(message)}`),
};
