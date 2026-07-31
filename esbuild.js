const esbuild = require("esbuild");

const watch = process.argv.includes('--watch');

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		outfile: 'dist/extension.js',
		bundle: true,
		format: 'cjs',
		minify: !watch,
		sourcemap: watch,
		sourcesContent: false,
		platform: 'node',
		target: 'node22',
		external: ['vscode'],
		logLevel: 'error'
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
