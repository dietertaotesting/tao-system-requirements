import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';

export default [{
	input: 'src/pci/information-gatherer-esm/env.js',
	output: {
		file: 'src/pci/taoEnvInteraction/runtime/information-gatherer.js',
		format: 'amd'
	},
	plugins: [
		resolve(),
		commonjs(),
		cleanup()
	]
}];
