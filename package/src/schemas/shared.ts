import { z } from 'astro/zod';

export const ghostVisibilitySchema = z.union([
	z.literal('public'),
	z.literal('members'),
	z.literal('none'),
	z.literal('internal'),
	z.literal('paid'),
	z.literal('tiers'),
]);

export const ghostIdentitySchema = z.object({
	slug: z.string(),
	id: z.string(),
});

export const ghostMetaSchema = z.object({
	pagination: z.object({
		pages: z.number(),
		page: z.number(),
		limit: z.union([z.number(), z.literal('all')]),
		total: z.number(),
		prev: z.number().nullable(),
		next: z.number().nullable(),
	}),
});

export const ghostCodeInjectionSchema = z.object({
	codeinjection_head: z.string().nullable(),
	codeinjection_foot: z.string().nullable(),
});

export const ghostFacebookSchema = z.object({
	og_image: z.string().nullable(),
	og_title: z.string().nullable(),
	og_description: z.string().nullable(),
});

export const ghostTwitterSchema = z.object({
	twitter_image: z.string().nullable(),
	twitter_title: z.string().nullable(),
	twitter_description: z.string().nullable(),
});

export const ghostSocialMediaSchema = z.object({
	...ghostFacebookSchema.shape,
	...ghostTwitterSchema.shape,
});

export const ghostMetadataSchema = z.object({
	meta_title: z.string().nullable(),
	meta_description: z.string().nullable(),
});
