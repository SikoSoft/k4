import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.BASE_URL || '/',
    envPrefix: 'APP_',
    plugins: [tsconfigPaths()],
  };
});
