type BuildConfig = {
	buildDate: string;
	buildId: string;
	branch: string;
}

export const getBuildConfig: () => BuildConfig = () => ({
	buildDate: import.meta.env.VITE_BUILD_DATE || new Date().toISOString(),
	buildId: import.meta.env.VITE_BUILD_ID || 'local',
	branch: import.meta.env.VITE_BRANCH || 'local',
});

