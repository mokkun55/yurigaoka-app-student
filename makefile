story:
	pnpm storybook

dev:
	pnpm dev

generate-type:
	pnpm supabase gen types typescript --project-id xlzaxcwjqrgtqhfnhhik > src/utils/supabase/database.types.ts