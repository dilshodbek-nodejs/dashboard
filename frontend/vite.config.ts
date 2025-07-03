import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const isProd=true




export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        proxy: {
            ...(isProd
                ? {
                    '/api': 'http://15.235.141.2:5000',
                    '/uploads': 'http://15.235.141.2:5000'
                }
                : {
                    '/api': 'http://localhost:5000',
                    '/uploads': 'http://localhost:5000'
                }
            )
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: '',
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
})