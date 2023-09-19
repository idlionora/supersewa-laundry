import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(__dirname, path.resolve(__dirname, '')),
			},
			{
				find: '@assets',
				replacement: path.resolve(__dirname, path.resolve(__dirname, 'src/assets')),
			},
			{
				find: '@components',
				replacement: path.resolve(__dirname, path.resolve(__dirname, 'src/components')),
			},
			{
				find: '@lib',
				replacement: path.resolve(__dirname, path.resolve(__dirname, 'src/lib')),
			},
			{
				find: '@pages',
				replacement: path.resolve(__dirname, path.resolve(__dirname, 'src/pages')),
			},
			{
				find: '@stores',
				replacement: path.resolve(__dirname, path.resolve(__dirname, 'src/stores')),
			},
		],
	},
});
