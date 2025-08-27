// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Configuración para el empaquetado de la librería
  build: {
    // La entrada principal de tu librería.
    lib: {
      entry: {
        smartWizardJS: 'src/js/vanillajs.smartWizard.js',
        smartWizardCSS: 'src/scss/smart_wizard_all.scss'
      },
      name: 'SmartWizard',
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    // Vacia el directorio de salida antes de la construcción
    emptyOutDir: true,
    // Opciones de Rollup
    rollupOptions: {
      // Configura las salidas
      output: {
        // Mueve los archivos CSS a la carpeta dist/css
        assetFileNames: 'css/vanillajs.smartWizard.min.css',
        format: 'es', // Formato de módulo de ES
        entryFileNames: `js/vanillajs.smartWizard.min.js`,
        dir: 'dist'
      }
    },
    // Habilitar la minificación
    minify: 'esbuild'
  },
  // Opciones del servidor de desarrollo de Vite
  server: {
    // Sirve los archivos desde las carpetas 'examples' y 'dist'
    host: 'localhost',
    port: 3000,
    open: '/examples-dev/index.html',
    // Permite que el servidor sirva archivos de la carpeta 'dist'
    fs: {
      allow: ['..']
    }
  },
  test: {
    // Configura el entorno de prueba para simular un navegador
    environment: 'jsdom',
    // Define el patrón de los archivos de prueba
    include: ['test/**/*.js'],
    // Configura la base de importación para que Vitest encuentre tus archivos
    alias: {
      '@': path.resolve(__dirname, './src') // Asegúrate de tener 'path' importado
    }
  }  
});
