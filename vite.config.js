// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Configuración para el empaquetado de la librería
  build: {
    // La entrada principal de tu librería.
    lib: {
      entry: 'src/js/vanillajs.smartWizard.js',
      name: 'SmartWizard',
      // Genera una salida para cada formato especificado
      formats: ['es', 'umd'],
      // Esto genera los archivos .js con la estructura de carpetas 'js/'
      fileName: (format) => `js/vanillajs.smartWizard.${format}.min.js`
    },
    // Vacia el directorio de salida antes de la construcción
    emptyOutDir: true,
    // Opciones de Rollup
    rollupOptions: {
      output: {
        // Mueve los archivos CSS a la carpeta dist/css
        assetFileNames: 'css/vanillajs.smartWizard.min.css',
        dir: 'dist',
        globals: {
          // Si tienes dependencias, decláralas aquí
        }
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
