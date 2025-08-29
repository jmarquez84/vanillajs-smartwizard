# VanillaJS Smart Wizard

### The awesome step wizard plugin for VanillaJS

[![npm version](https://badge.fury.io/js/vanillajs-smartwizard.svg)](https://www.npmjs.com/package/vanillajs-smartwizard)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/vanillajs-smartwizard/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vanillajs-smartwizard)
[![Npm Downloads](https://badgen.net/npm/dm/vanillajs-smartwizard?icon=npm)](https://www.npmjs.com/package/vanillajs-smartwizard)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/jmarquez84/vanillajs-smartwizard/master/LICENSE)
[![GitHub Repo](https://badgen.net/badge/icon/vanillajs-smartwizard?icon=github\&label=\&color=0da4d3)](https://github.com/jmarquez84/vanillajs-smartwizard)
[![Donate on Paypal](https://img.shields.io/badge/PayPal-jmarquezgomez84-blue.svg)](https://www.paypal.me/jmarquezgomez84)

If you want to contribute to the original author click here: [Original project](https://github.com/techlab/jquery-smartwizard)

**VanillaJS Smart Wizard** is a step wizard plugin that does not require jQuery and is written in pure JavaScript. Its purpose is to provide a clean, elegant, and functional user interface for processes such as forms, checkouts, and registrations.

The project has been completely rewritten to remove the jQuery dependency, making it lighter, faster, and more modern. It supports **ESM** and **CommonJS** and works in all modern browsers. Additionally, it is designed with a responsive approach and is compatible with **Bootstrap**.

---

### **Main Features**

* **No jQuery**: Works with pure JavaScript, making it faster and lighter.
* **Easy to Implement**: Requires minimal HTML to work.
* **Responsive Design**: Adapts to all devices and is compatible with Bootstrap.
* **Field Validation**: Allows validating required fields when moving between steps, with the option for custom events and error handling functions.
* **Transitions**: Includes transition animations like `fade`, `slideHorizontal`, `slideVertical`, and `slideSwing`.
* **CSS Animation Support**: Easily extendable with custom animations and compatible with libraries like Animate.css.
* **Dynamic Content**: Allows integration of content through Ajax.
* **Customizable Controls**: Includes a built-in toolbar, progress bar, and loader.
* **RTL Support**: Ready for right-to-left languages.
* **Accessibility**: Provides accessible controls for a better user experience.

---

### **Installation & Usage**

The plugin is compatible with the main JavaScript module systems, making it easy to integrate into any modern project. Below are initialization examples for **ESM** (ECMAScript Modules) and **CommonJS**.

#### **Initialization with ES Modules (ESM)**

For projects using a *bundler* like **Vite**, **Webpack**, or **Rollup**, the **ESM** approach is the most common. First, make sure the plugin is installed in your project.

```javascript
import SmartWizard from 'vanillajs-smartwizard';

// Wizard initialization
const wizard = new SmartWizard('#smartwizard', {
    selected: 0,
    theme: 'arrows', // Example custom theme
    toolbar: {
        position: 'bottom',
    },
    // Other options...
});

// Example of using a public method
document.getElementById('nextButton').addEventListener('click', () => {
    wizard.next();
});

/** Common JS **/
const SmartWizard = require('vanillajs-smartwizard');

// Make sure the HTML is loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Wizard initialization
    const wizard = new SmartWizard('#smartwizard', {
        selected: 0,
        theme: 'arrows',
    });

    // Example of use
    document.getElementById('prevButton').addEventListener('click', () => {
        wizard.prev();
    });
});
```

---

### **Configuration Options**

| Option                  | Type      | Default Value   | Description                                                                                                                          |
| :---------------------- | :-------- | :-------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **`debug`**             | `boolean` | `false`         | Enables debug messages in the console.                                                                                               |
| **`initAtCreated`**     | `boolean` | `true`          | Whether the wizard initializes automatically when created.                                                                           |
| **`selected`**          | `number`  | `0`             | The index of the step selected at start.                                                                                             |
| **`theme`**             | `string`  | `'basic'`       | The wizard theme (e.g., `'basic'`).                                                                                                  |
| **`justified`**         | `boolean` | `true`          | Whether navigation steps are justified to take full width.                                                                           |
| **`autoAdjustHeight`**  | `boolean` | `true`          | Whether the wizard auto-adjusts its height to the content.                                                                           |
| **`backButtonSupport`** | `boolean` | `true`          | Enables browser back button navigation.                                                                                              |
| **`enableUrlHash`**     | `boolean` | `true`          | Enables using the URL hash for step navigation.                                                                                      |
| **`transition`**        | `object`  | See source code | Transition animation settings. Includes `animation` (e.g., `'fade'`) and `speed` (ms).                                               |
| **`toolbar`**           | `object`  | See source code | Toolbar settings. Includes `position` (`'top'`, `'bottom'`, `'both'`), `showNextButton`, and `showPreviousButton`.                   |
| **`keyboard`**          | `object`  | See source code | Keyboard navigation settings. Includes `keyNavigation`, `keyLeft`, and `keyRight`.                                                   |
| **`lang`**              | `object`  | See source code | Allows customizing button texts.                                                                                                     |
| **`style`**             | `object`  | See source code | Defines CSS classes for wizard elements.                                                                                             |
| **`disabledSteps`**     | `array`   | `[]`            | Array of step indices to disable.                                                                                                    |
| **`errorSteps`**        | `array`   | `[]`            | Array of step indices marked with an error state.                                                                                    |
| **`hiddenSteps`**       | `array`   | `[]`            | Array of step indices to hide.                                                                                                       |
| **`requiredField`**     | `object`  | See source code | Options for required field validation. Includes `active`, `checkOnSubmitForm`, `controls`, `classInvalid`, and `functionToValidate`. |

---

### **Public Methods (API)**

| Method                             | Description                                                                                                       |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **`goToStep(stepIndex, force)`**   | Navigates to the specified step by `stepIndex`. The optional `force` parameter forces navigation.                 |
| **`next()`**                       | Navigates to the next available step.                                                                             |
| **`prev()`**                       | Navigates to the previous available step.                                                                         |
| **`reset()`**                      | Resets the wizard to its initial state.                                                                           |
| **`setState(stepArray, state)`**   | Sets a state (e.g., `'error'`, `'done'`) for the specified steps.                                                 |
| **`unsetState(stepArray, state)`** | Removes a state from the specified steps.                                                                         |
| **`unsetErrors(idx)`**             | Removes the error state of a specific step.                                                                       |
| **`setOptions(options)`**          | Updates the wizard configuration with the provided options.                                                       |
| **`getOptions()`**                 | Returns the current wizard configuration.                                                                         |
| **`getStepInfo()`**                | Returns an object with current state info, including current step (`currentStep`) and total steps (`totalSteps`). |
| **`loader(state)`**                | Shows or hides the wizard loader. The `state` can be `'show'` or `'hide'`.                                        |
| **`fixHeight()`**                  | Forces the container to readjust its height.                                                                      |
| **`init()`**                       | Initializes the wizard if `initAtCreated` is `false`.                                                             |
| **`checkStepRequired(step)`**      | Validates required fields of a specific step. Returns `true` if there are errors, `false` otherwise.              |
| **`checkFormRequireds()`**         | Validates all required fields in the form. Returns `true` if there are errors.                                    |
| **`destroy()`**                    | Removes all events and configuration, destroying the wizard instance.                                             |

## License

[MIT License](https://github.com/jmarquez84/vanillajs-smartwizard/blob/master/LICENSE)
