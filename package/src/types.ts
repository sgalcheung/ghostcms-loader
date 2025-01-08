import type {
	authorsSchema,
	loaderSettingsSchema,
	pagesSchema,
	postsSchema,
	tagsSchema,
	tiersSchema,
} from './schemas/index.js';

export type ImageFunction = () => import('astro/zod').ZodObject<{
	src: import('astro/zod').ZodString;
	width: import('astro/zod').ZodNumber;
	height: import('astro/zod').ZodNumber;
	format: import('astro/zod').ZodUnion<
		[
			import('astro/zod').ZodLiteral<'png'>,
			import('astro/zod').ZodLiteral<'jpg'>,
			import('astro/zod').ZodLiteral<'jpeg'>,
			import('astro/zod').ZodLiteral<'tiff'>,
			import('astro/zod').ZodLiteral<'webp'>,
			import('astro/zod').ZodLiteral<'gif'>,
			import('astro/zod').ZodLiteral<'svg'>,
			import('astro/zod').ZodLiteral<'avif'>,
		]
	>;
}>;

// @ts-ignore
type BaseSchemaWithoutEffects =
	| import('astro/zod').AnyZodObject
	| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
	| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
	| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

type BaseSchema =
	| BaseSchemaWithoutEffects
	| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

export type SchemaContext = { image: ImageFunction };

export type ContentLayerConfig<
	S extends BaseSchema,
	TData extends { id: string } = { id: string },
> = {
	type?: 'content_layer';
	schema?: S | ((context: SchemaContext) => S);
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
	schema?: S | ((context: SchemaContext) => S);
};

type ContentCollectionConfig<S extends BaseSchema> = {
	type?: 'content';
	schema?: S | ((context: SchemaContext) => S);
	loader?: never;
};

export type CollectionConfig<S extends BaseSchema> =
	| ContentCollectionConfig<S>
	| DataCollectionConfig<S>
	| ContentLayerConfig<S>;

export type LoaderCollectionOpts = {
	/**
	 * The URL of your Ghost CMS instance
	 *
	 * @example
	 * 'https://demo.ghost.io'
	 *
	 */
	ghostUrl: string;
	/**
	 * The version of the Ghost Content API to use
	 *
	 * @example
	 * 'v5.0'
	 *
	 * @default 'v5.0'
	 */
	apiVersion?: `v5.${string}`;
	/**
	 * DO NOT USE THIS, THIS IS UNSAFE AND MEANT FOR INTERNAL USE ONLY/TESTING
	 *
	 * Set your api key in your .env file as `GHOST_CONTENT_API_KEY`
	 */
	__DO_NOT_USE_TESTING_ONLY__GHOST_CONTENT_API_KEY?: string;
};

export type LoaderCollection = {
	ghostAuthors: CollectionConfig<typeof authorsSchema>;
	ghostPages: CollectionConfig<typeof pagesSchema>;
	ghostPosts: CollectionConfig<typeof postsSchema>;
	ghostSettings: CollectionConfig<typeof loaderSettingsSchema>;
	ghostTags: CollectionConfig<typeof tagsSchema>;
	ghostTiers: CollectionConfig<typeof tiersSchema>;
};
