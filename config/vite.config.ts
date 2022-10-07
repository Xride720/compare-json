import path from 'path';
import { UserConfigFn } from 'vite';
import react from '@vitejs/plugin-react';

const config: UserConfigFn = ({ mode, command }) => {
  if (command === 'serve' && mode === 'production') {
    //
  }
  return {
    root: path.resolve(__dirname, '../src'),
    build: {
      outDir: path.resolve(__dirname, '../dist')
    },
    server: {
      port: 3500,
      https: false
    },
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@components', replacement: path.resolve(process.cwd() + '/src/components') },
        { find: '@types', replacement: path.resolve(process.cwd() + '/src/types') },
        { find: '@', replacement: path.resolve(process.cwd() + '/src') }
      ]
    },
    test: {
      globals: true
    },
    publicDir: path.resolve(__dirname, '../public')
  };
};

export default config;
