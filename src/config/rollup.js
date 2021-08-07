import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';

export default [{
	input: 'src/pci/js/index.js',
	output: {
		file: 'pci/js/environment.js',
		format: 'iife'
	},
	plugins: [
		resolve(),
		commonjs(),
		cleanup()
	]
}];
