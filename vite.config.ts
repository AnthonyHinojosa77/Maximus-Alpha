import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Maximus-Alpha/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/_px/a': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/_px\/a/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            const sr = res as import('http').ServerResponse
            if (typeof sr.writeHead === 'function' && !sr.headersSent) {
              sr.writeHead(502, { 'Content-Type': 'application/json' })
              sr.end(JSON.stringify({ error: { message: 'Proxy connection failed' } }))
            }
          })
        },
      },
      '/_px/b': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/_px\/b/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            const sr = res as import('http').ServerResponse
            if (typeof sr.writeHead === 'function' && !sr.headersSent) {
              sr.writeHead(502, { 'Content-Type': 'application/json' })
              sr.end(JSON.stringify({ error: { message: 'Proxy connection failed' } }))
            }
          })
        },
      },
      '/_px/c': {
        target: 'https://api.x.ai',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/_px\/c/, ''),
        secure: false,
      },
      '/_px/d': {
        target: 'https://api.moonshot.ai',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/_px\/d/, ''),
        secure: false,
      },
      '/_px/e': {
        target: 'https://openrouter.ai',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/_px\/e/, ''),
        secure: false,
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-crypto': ['tweetnacl', 'tweetnacl-util'],
          'vendor-state': ['zustand', 'idb'],
        },
      },
    },
  },
})
