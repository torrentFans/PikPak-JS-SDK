import { terser } from 'rollup-plugin-terser';
import less from 'rollup-plugin-less';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
				globals: {
					'qrcode': 'qrcode',
				},
			}
		],	
		plugins: [
			less(),
			nodePolyfills(),
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
			terser(),
		],
		external: ['QRCode'],
	}
]