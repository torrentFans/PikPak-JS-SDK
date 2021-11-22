import less from 'rollup-plugin-less';
import babel from '@rollup/plugin-babel';
import server from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';
import liveReload from 'rollup-plugin-livereload';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: './src/index.ts',
		output: [
			{
				file: 'dist/pikpak-sdk.esm.js',
				format: 'esm',
			},
			{
				file: 'dist/pikpak-sdk.umd.js',
				format: 'umd',
				name: 'PikPak',
			}
		],
		plugins: [
			less(),
			typescript({
				exclude: 'node_modules/*',
			}),
			nodeResolve({
				extensions: ['.ts'],
			}),
			commonjs(),
			babel({
				extensions: ['.ts'],
				babelHelpers: 'bundled',
				exclude: 'node_modules/*',
			}),
			liveReload(),
			server({
				open: true,
				port: 8888,
				contentBase: ['demo/', 'dist/'],
			}),
		]
	}
]