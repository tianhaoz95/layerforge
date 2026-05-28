import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/sandbox': {
                target: 'http://localhost:3001',
                rewrite: function (path) { return path.replace(/^\/api\/sandbox/, ''); },
                changeOrigin: true,
            },
        },
    },
});
