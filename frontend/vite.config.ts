import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://15.235.141.2:4000'
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',  // Terser ishlatamiz
        terserOptions: {
            compress: {
                drop_console: true,  // console.log larni olib tashlaydi
                drop_debugger: true
            }
        }
    }
})