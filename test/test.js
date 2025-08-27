import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import SmartWizard from '../src/js/vanillajs.smartWizard';

// Configurar el entorno de JSDOM
const dom = new JSDOM(`
  <html>
  <body>
    <div id="smartwizard">
      <ul class="nav">
        <li><a class="nav-link" href="#step-1">Step 1</a></li>
        <li><a class="nav-link" href="#step-2">Step 2</a></li>
        <li><a class="nav-link" href="#step-3">Step 3</a></li>
      </ul>
      <div class="tab-content">
        <div id="step-1" class="tab-pane">Step 1 Content</div>
        <div id="step-2" class="tab-pane">Step 2 Content</div>
        <div id="step-3" class="tab-pane">Step 3 Content</div>
      </div>
    </div>
  </body>
  </html>
`);

// Simular el entorno del navegador
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Reemplazar jQuery con vanilla JS
global.window.$ = (selector) => {
    const el = document.querySelector(selector);
    return {
        on: (event, handler) => el.addEventListener(event, handler),
        find: (s) => document.querySelector(selector).querySelector(s),
        remove: () => el.remove(),
        get: () => el,
        toHaveClass: (cls) => {
            return el.classList.contains(cls);
        },
        toExist: () => {
            return !!el;
        }
    };
};

describe('SmartWizard Default Options', () => {
    let sw;
    let mainEl;

    beforeEach(() => {
        // Reiniciar el DOM antes de cada prueba
        document.body.innerHTML = `
            <div id="smartwizard">
              <ul class="nav">
                <li><a class="nav-link" href="#step-1">Step 1</a></li>
                <li><a class="nav-link" href="#step-2">Step 2</a></li>
                <li><a class="nav-link" href="#step-3">Step 3</a></li>
              </ul>
              <div class="tab-content">
                <div id="step-1" class="tab-pane">Step 1 Content</div>
                <div id="step-2" class="tab-pane">Step 2 Content</div>
                <div id="step-3" class="tab-pane">Step 3 Content</div>
              </div>
            </div>
        `;
        mainEl = document.querySelector('#smartwizard');
        sw = new SmartWizard(mainEl);
    });

    afterEach(() => {
        // Limpiar después de cada prueba
        mainEl.remove();
        sw = null;
    });

    it('should add default class to the element', () => {
        expect(mainEl.classList.contains("sw")).toBe(true);
    });

    it('should add default theme to the element', () => {
        expect(mainEl.classList.contains("sw-theme-basic")).toBe(true);
    });

    it('should add toolbar elements', () => {
        const toolbar = mainEl.querySelector('.toolbar');
        expect(toolbar).not.toBe(null);
        expect(toolbar.querySelector('.sw-btn-next')).not.toBe(null);
        expect(toolbar.querySelector('.sw-btn-prev')).not.toBe(null);
    });

    it('should trigger "initialized" event', () => {
        // Crear un mock para el evento "initialized"
        const initializedEventSpy = vi.fn();
        mainEl = document.querySelector('#smartwizard');    
        mainEl.addEventListener('initialized', initializedEventSpy);

        // Instanciar SmartWizard
        const el = new SmartWizard(mainEl);

        // Verificar que el evento fue llamado
        expect(initializedEventSpy).toHaveBeenCalled();
    });
});
