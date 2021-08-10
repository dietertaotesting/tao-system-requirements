import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';

export default [{
	input: 'src/pci/js/index.js',
	output: {
		file: 'src/pci/runtime/js/rollup-renderer.amd.js',
		format: 'amd'
	},
	plugins: [
		resolve(),
		commonjs(),
		cleanup()
	]
}];
