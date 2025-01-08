import type {
	authorsSchema,
	loaderSettingsSchema,
	pagesSchema,
	postsSchema,
	tagsSchema,
	tiersSchema,
} from './schemas/index.js';

// @ts-ignore
type BaseSchemaWithoutEffects =
	| import('astro/zod').AnyZodObject
	| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
	| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
	| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

type BaseSchema =
	| BaseSchemaWithoutEffects
	| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

export type ContentLayerConfig<
	S extends BaseSchema,
	TData extends { id: string } = { id: string },
> = {
	type?: 'content_layer';
	schema?: S;
	loader:
		| import('astro/loaders').Loader
		| (() =>
				| Array<TData>
				| Promise<Array<TData>>
				| Record<string, Omit<TData, 'id'> & { id?: string }>
				| Promise<Record<string, Omit<TData, 'id'> & { id?: string }>>);
};

type DataCollectionConfig<S extends BaseSchema> = {
	type: 'data';
	schema?: S;
};

type ContentCollectionConfig<S extends BaseSchema> = {
	type?: 'content';
	schema?: S;
	loader?: never;
};

export type CollectionConfig<S extends BaseSchema> =
	| ContentCollectionConfig<S>
	| DataCollectionConfig<S>
	| ContentLayerConfig<S>;

export type LoaderCollection = {
	ghostAuthors: CollectionConfig<typeof authorsSchema>;
	ghostPages: CollectionConfig<typeof pagesSchema>;
	ghostPosts: CollectionConfig<typeof postsSchema>;
	ghostSettings: CollectionConfig<typeof loaderSettingsSchema>;
	ghostTags: CollectionConfig<typeof tagsSchema>;
	ghostTiers: CollectionConfig<typeof tiersSchema>;
};
