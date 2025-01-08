# astro-ghostcms-loader

This package provides a GhostCMS loader for astro. Allowing ease of use of all your GhostCMS content within astro's built in Content Layer!

## Installation

```sh
npm install astro-ghostcms-loader
```

## Usage

To use this loader, it is required that you be on at least Astro `v5.0.0`

Also make sure to create and set your `.env` file with the following:

```.env
GHOST_CONTENT_API_KEY=your_api_key_here
```

In `src/content.config.ts`, import and configure the loaderCollection:

```ts
import { GhostCMSLoaderCollection} from 'astro-ghostcms-loader';

export const collections = {
  ...GhostCMSLoaderCollection({
    ghostUrl: 'https://demo.ghost.io' // Your GhostCMS Instance URL
    apiVersion?: 'v5.0' // OPTIONAL - Allows you to define a specific version (min: v5.0)
  }),
}
```

[Query the content collection](https://docs.astro.build/en/guides/content-collections/#querying-collections) like any other Astro content collection entry:

```ts
import { getCollection } from "astro:content"

const pages = await getCollection("ghostPages"); // Supports the render() function from astro
const posts = await getCollection("ghostPosts"); // Supports the render() function from astro
const tags = await getCollection("ghostTags");
const authors = await getCollection("ghostAuthors");
const tiers = await getCollection("ghostTiers");
const settings = await getEntry('ghostSettings', 'settings');
```

## Changelog

See the [Changelog](https://github.com/MatthiesenXYZ/ghostcms-loader/blob/main/package/CHANGELOG.md) for the change history of this loader.

## Contribution

If you see any errors or room for improvement, feel free to open an [issues or pull request](https://github.com/MatthiesenXYZ/ghostcms-loader/) . Thank you in advance for contributing! ❤️