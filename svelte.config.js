import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		replace: [
			[/process.env.ELO_K/g, parseFloat(process.env.ELO_K ?? "50")],
			[/process.env.API_PROTCOL/g, process.env.API_PROTCOL],
			[/process.env.API_BASE_ORIGIN/g, process.env.API_BASE_ORIGIN],
		]
	}),

	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: true
		}),
		prerender: {
		  default: true
		},
		browser: {
			router: true,
		}
	}
};

export default config;
