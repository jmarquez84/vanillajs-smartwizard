# VanillaJS Smart Wizard
### The awesome step wizard plugin for VanillaJS

[![npm version](https://badge.fury.io/js/vanillajs-smartwizard.svg)](https://www.npmjs.com/package/vanillajs-smartwizard)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/vanillajs-smartwizard/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vanillajs-smartwizard)
[![Npm Downloadsl](https://badgen.net/npm/dm/vanillajs-smartwizard?icon=npm)](https://www.npmjs.com/package/vanillajs-smartwizard)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/jmarquez84/vanillajs-smartwizard/master/LICENSE)
[![GitHub Repo](https://badgen.net/badge/icon/vanillajs-smartwizard?icon=github&label=&color=0da4d3)](https://github.com/jmarquez84/vanillajs-smartwizard)
[![Donate on Paypal](https://img.shields.io/badge/PayPal-jmarquezgomez84-blue.svg)](https://www.paypal.me/jmarquezgomez84)

If you want to contribute to original author click here: [Original project](https://github.com/techlab/jquery-smartwizard)

**VanillaJS Smart Wizard** es un plugin de asistente de pasos que no requiere jQuery y está escrito en JavaScript puro. Su propósito es proporcionar una interfaz de usuario ordenada, elegante y funcional para procesos como formularios, pantallas de pago y registros.

El proyecto ha sido reescrito por completo para eliminar la dependencia de jQuery, lo que lo hace más ligero, rápido y moderno. Es compatible con **ESM** y **CommonJS** y funciona en todos los navegadores modernos. Además, está diseñado con un enfoque responsive y es compatible con **Bootstrap**.

---

### **Características Principales**

* **Sin jQuery**: Funciona en JavaScript puro, lo que lo hace más rápido y ligero.
* **Fácil de Implementar**: Requiere un HTML mínimo para su funcionamiento.
* **Diseño Responsive**: Se adapta a todos los dispositivos y es compatible con Bootstrap.
* **Validación de Campos**: Permite validar campos obligatorios al moverse entre pasos, con la posibilidad de eventos y funciones personalizadas para los errores.
* **Transiciones**: Incluye animaciones de transición como `fade`, `slideHorizontal`, `slideVertical` y `slideSwing`.
* **Soporte de Animaciones CSS**: Fácil de extender con animaciones personalizadas y es compatible con librerías como Animate.css.
* **Contenido Dinámico**: Permite la integración de contenido a través de Ajax.
* **Control Personalizable**: Incluye una barra de herramientas, barra de progreso y loader integrados.
* **Soporte RTL**: Está preparado para idiomas que se leen de derecha a izquierda.
* **Accesibilidad**: Proporciona controles accesibles para una mejor experiencia de usuario.

---

### **Instalación y Uso**

El plugin es compatible con los principales sistemas de módulos de JavaScript, lo que facilita su integración en cualquier proyecto moderno. A continuación se muestran ejemplos de inicialización para **ESM** (Módulos de ECMAScript) y **CommonJS**.

#### **Inicialización con ES Modules (ESM)**

Para proyectos que utilizan un *bundler* como **Vite**, **Webpack** o **Rollup**, el enfoque **ESM** es el más común. Primero, asegúrate de que el plugin esté instalado en tu proyecto.

```javascript
import SmartWizard from 'vanillajs-smartwizard';

// Inicialización del asistente
const wizard = new SmartWizard('#smartwizard', {
    selected: 0,
    theme: 'arrows', // Ejemplo de tema personalizado
    toolbar: {
        position: 'bottom',
    },
    // Otras opciones...
});

// Ejemplo de uso de un método público
document.getElementById('nextButton').addEventListener('click', () => {
    wizard.next();
});

/** Common JS **/
const SmartWizard = require('vanillajs-smartwizard');

// Asegúrate de que el HTML esté cargado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización del asistente
    const wizard = new SmartWizard('#smartwizard', {
        selected: 0,
        theme: 'arrows',
    });

    // Ejemplo de uso
    document.getElementById('prevButton').addEventListener('click', () => {
        wizard.prev();
    });
});
```

---

### **Opciones de Configuración**

| Opción | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| **`debug`** | `boolean` | `false` | Habilita los mensajes de depuración en la consola. |
| **`initAtCreated`** | `boolean` | `true` | Si el asistente se inicializa automáticamente al crearse. |
| **`selected`** | `number` | `0` | El índice del paso que se seleccionará al inicio. |
| **`theme`** | `string` | `'basic'` | El tema del asistente (por ejemplo, `'basic'`). |
| **`justified`** | `boolean` | `true` | Si los pasos de la navegación se justifican para ocupar todo el ancho. |
| **`autoAdjustHeight`** | `boolean` | `true` | Si el asistente ajusta su altura automáticamente al contenido. |
| **`backButtonSupport`** | `boolean` | `true` | Habilita la navegación con el botón de "atrás" del navegador. |
| **`enableUrlHash`** | `boolean` | `true` | Habilita el uso de la URL hash para la navegación entre pasos. |
| **`transition`** | `object` | Ver código fuente | Configuración de las animaciones de transición. Incluye `animation` (e.g., `'fade'`) y `speed` (ms). |
| **`toolbar`** | `object` | Ver código fuente | Configuración de la barra de herramientas. Incluye `position` (`'top'`, `'bottom'`, `'both'`), `showNextButton` y `showPreviousButton`. |
| **`keyboard`** | `object` | Ver código fuente | Configuración de la navegación por teclado. Incluye `keyNavigation`, `keyLeft` y `keyRight`. |
| **`lang`** | `object` | Ver código fuente | Permite cambiar el texto de los botones. |
| **`style`** | `object` | Ver código fuente | Define las clases CSS para los diferentes elementos del asistente. |
| **`disabledSteps`** | `array` | `[]` | Array de índices de pasos que se desactivarán. |
| **`errorSteps`** | `array` | `[]` | Array de índices de pasos que se marcarán con un estado de error. |
| **`hiddenSteps`** | `array` | `[]` | Array de índices de pasos que se ocultarán. |
| **`requiredField`** | `object` | Ver código fuente | Opciones para la validación de campos obligatorios. Incluye `active`, `checkOnSubmitForm`, `controls`, `classInvalid` y `functionToValidate`. |

---

### **Métodos Públicos (API)**

| Método | Descripción |
| :--- | :--- |
| **`goToStep(stepIndex, force)`** | Navega al paso especificado por `stepIndex`. El parámetro opcional `force` permite forzar la navegación. |
| **`next()`** | Navega al siguiente paso navegable. |
| **`prev()`** | Navega al paso anterior navegable. |
| **`reset()`** | Restablece el asistente a su estado inicial. |
| **`setState(stepArray, state)`** | Establece un estado (e.g., `'error'`, `'done'`) a los pasos especificados en `stepArray`. |
| **`unsetState(stepArray, state)`** | Elimina un estado de los pasos especificados. |
| **`unsetErrors(idx)`** | Elimina el estado de error de un paso específico. |
| **`setOptions(options)`** | Actualiza la configuración del asistente con las opciones proporcionadas. |
| **`getOptions()`** | Devuelve la configuración actual del asistente. |
| **`getStepInfo()`** | Devuelve un objeto con información sobre el estado actual, incluyendo el paso actual (`currentStep`) y el total de pasos (`totalSteps`). |
| **`loader(state)`** | Muestra u oculta el loader del asistente. El parámetro `state` puede ser `'show'` o `'hide'`. |
| **`fixHeight()`** | Fuerza el reajuste de la altura del contenedor. |
| **`init()`** | Inicializa el asistente si `initAtCreated` es `false`. |
| **`checkStepRequired(step)`** | Valida los campos obligatorios de un paso específico. Devuelve `true` si hay errores, `false` en caso contrario. |
| **`checkFormRequireds()`** | Valida todos los campos obligatorios del formulario. Devuelve `true` si hay errores. |
| **`destroy()`** | Elimina todos los eventos y la configuración, destruyendo la instancia del asistente. |

License
----
[MIT License](https://github.com/jmarquez84/vanillajs-smartwizard/blob/master/LICENSE)
