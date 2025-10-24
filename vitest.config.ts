import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

/**
 * Vitest Configuration
 * 
 * Configuration for Vitest testing framework with React support.
 * Includes code coverage settings and threshold requirements.
 */
export default defineConfig({
  plugins: [react()],
  
  test: {
    // Enable global test APIs (describe, it, expect) without imports
    globals: true,
    
    // Use jsdom for DOM testing environment
    environment: 'jsdom',
    
    // Setup file to run before tests
    setupFiles: './src/test/setup.ts',
    
    // Code coverage configuration
    coverage: {
      // Use v8 coverage provider for better performance
      provider: 'v8',
      
      // Coverage reporters - generate multiple formats
      reporter: ['text', 'json', 'html', 'lcov'],
      
      // Output directory for coverage reports
      reportsDirectory: './reports/coverage',
      
      // Exclude patterns from coverage
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/__tests__/**',
        '**/test/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      
      // Coverage thresholds - fail if coverage is below these values
      thresholds: {
        lines: 80,       // 80% of lines must be covered
        functions: 80,   // 80% of functions must be covered
        branches: 80,    // 80% of branches must be covered
        statements: 80,  // 80% of statements must be covered
      },
    },
    
    // Test timeout (5 seconds)
    testTimeout: 5000,
    
    // Hook timeout (2 seconds)
    hookTimeout: 2000,
    
    // Include test files matching these patterns
    include: [
      '**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
      '**/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    
    // Exclude these directories
    exclude: [
      'node_modules',
      'dist',
      'build',
      '.cache',
      '.vite',
    ],
  },
  
  // Path resolution for imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
