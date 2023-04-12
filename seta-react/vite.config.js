/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const isBuild = process.env.NODE_ENV === 'production'

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

export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),

    checker(isBuild ? checkerProd : checkerDev)
  ],

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
  }
})
