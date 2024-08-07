import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteAliases } from "vite-aliases";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteAliases()],
  base: "./",
  resolve: {},
  build: {
    cssCodeSplit: false,
    minify: true,
    outDir: "build",
  },
  css: {
    modules: {
      // include: /\.scss$/,
      localsConvention: "camelCase",
    },
  },
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { ViteAliases } from 'vite-aliases';
// import obfuscator from 'rollup-plugin-obfuscator';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     ViteAliases(),
//     obfuscator({
//       options: {
//         compact: true,
//         controlFlowFlattening: true,
//         controlFlowFlatteningThreshold: 0.75,
//         numbersToExpressions: true,
//         simplify: true,
//         shuffleStringArray: true,
//         splitStrings: true,
//         stringArrayThreshold: 0.75,
//       },
//     }),
//   ],
//   base: './',
//   build: {
//     cssCodeSplit: false,
//     minify: true,
//     outDir: 'build',
//     rollupOptions: {
//       output: {
//         manualChunks: () => 'index', // Forcing all modules to be part of a single chunk named 'index'
//       },
//     },
//   },
//   css: {
//     modules: {
//       // include: /\.scss$/,
//       localsConvention: 'camelCase',
//     },
//   },
// });
