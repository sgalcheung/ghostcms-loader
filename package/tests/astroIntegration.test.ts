import { loadFixture } from '@inox-tools/astro-tests/astroFixture';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const fixture = await loadFixture({
	root: './fixtures/astro',
});

describe('Astro GhostCMS Loader Tests', () => {
	beforeAll(async () => {
		await fixture.build({});
	});

	afterAll(async () => {
		await fixture.clean();
	});

	test('Check Content Collection Data Entry', async () => {
		const content = await fixture.readFile('basic/index.html');

		expect(
			content
		).toContain(`<div> <h2>About this theme</h2> <p>As the default theme in Ghost, Casper is the easiest way to get started publishing content. In addition to being fully responsive and styled, it comes with a few optional bells and whistles that are explained below.


Publication cover

The default homepage of Casper is displayed with a beautiful gradient image. This image can be replaced by uploading a custom Publication cover found at Settings &gt; Design &gt; Brand.


Color scheme

Casper can be displayed in either light or dark mode.

 * Light (de</p> </div><div> <h2>Contact</h2> <p>If you want to set up a contact page for people to be able to reach out to you,
the simplest way is to set up a simple page like this and list the different
ways people can reach out to you.

For example, here&#39;s how to reach us!
 * @Ghost [https://twitter.com/ghost] on Twitter
 * @Ghost [https://www.facebook.com/ghost] on Facebook
 * @Ghost [https://instagram.com/ghost] on Instagram

If you prefer to use a contact form, almost all of the great embedded form
services work great with Ghost and are</p> </div>`);
	});
});
