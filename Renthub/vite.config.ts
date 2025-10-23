import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// Spark removed for production build
// import sparkPlugin from "@github/spark/spark-vite-plugin";
// import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Spark disabled - using direct icon imports
    // createIconImportProxy() as PluginOption,
    // sparkPlugin() as PluginOption,
    
    // Compression pentru assets
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // doar fișiere > 10kb
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    
    // Bundle analyzer pentru a vedea ce ocupă spațiu
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
  },
  build: {
    // Minify pentru producție
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Elimină console.log în producție
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Elimină specific logging
        passes: 3, // Trei passes pentru compresie mai agresivă
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        dead_code: true,
        booleans_as_integers: true,
      },
      mangle: {
        safari10: true, // Safari 10+ support
        toplevel: true,
      },
      format: {
        comments: false, // Elimină toate comentariile
      },
    },
    // CSS optimizations
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    // Optimizare chunk splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - librării mari separate
          if (id.includes('node_modules')) {
            // React - păstrează împreună core + dom pentru context
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // UI frameworks - radix componente
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // Animations
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Icons - separat pentru a fi cache-able
            if (id.includes('lucide-react') || id.includes('@phosphor-icons') || id.includes('@heroicons')) {
              return 'ui-icons';
            }
            // Charts - doar pentru dashboard/analytics
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts';
            }
            // Utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            if (id.includes('axios') || id.includes('zod')) {
              return 'utils';
            }
            // Restul vendor libraries
            return 'vendor';
          }
        },
        // Nume descriptive pentru chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Praguri pentru warning
    chunkSizeWarningLimit: 600, // Reduce warning threshold
    // Source maps doar pentru debugging
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
    // Target modern browsers pentru bundle mai mic
    target: 'es2020',
  },
  // Optimizare dependențe
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
});
