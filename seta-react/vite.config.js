/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// Checker plugin options for production build
/** @type {Parameters<import('vite-plugin-checker').checker>[0]} */
const checkerProd = {
  typescript: true
}

// Checker plugin options for development
/** @type {Parameters<import('vite-plugin-checker').checker>[0]} */
const checkerDev = {
  typescript: true,
  eslint: {
    lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
    dev: {
      logLevel: ['error']
    }
  }
}

export default defineConfig(({ mode }) => {
  const isBuild = mode === 'production'
  const isDev = mode === 'development'

  return {
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),

      checker(isBuild ? checkerProd : checkerDev)
    ],
    define: isDev
      ? {
          // Some libraries use the global object, even though it doesn't exist in the browser.
          // Alternatively, we could add `<script>window.global = window;</script>` to index.html.
          // https://github.com/vitejs/vite/discussions/5912
          global: {}
        }
      : null,
    server: {
      host: 'localhost',
      port: 3000,
      // Uncomment the line below to open the page automatically when running the server locally
      // open: 'http://localhost:3000/'
      strictPort: true,
      hmr: {
        clientPort: 3000
      }
    },

    build: {
      outDir: 'build'
    },

    esbuild: {
      drop: isBuild ? ['console', 'debugger'] : []
    }
  }
})
