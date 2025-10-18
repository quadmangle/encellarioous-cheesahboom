import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const shouldProxy = !env.VITE_API_BASE_URL;
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:3001';

  return defineConfig({
    plugins: [react()],
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || ''),
    },
    server: {
      proxy: shouldProxy
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  });
};
