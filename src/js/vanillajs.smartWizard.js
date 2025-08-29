/**
 * SmartWizard v1.0.1 - Vanilla JavaScript Version (Universal Module)
 * The awesome step wizard plugin, converted to pure JavaScript.
 *
 * Based on the original jQuery SmartWizard by Dipu Raj (http://dipu.me)
 * This version removes all external dependencies and adds support for both ES Modules and global usage.
 */
import '../scss/smart_wizard_all.scss';

class SmartWizard {
    static #transitions = {
        fade: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            const hidePromise = elmToHide ? new Promise(resolve => {
                elmToHide.style.transition = `opacity ${wizardObj.options.transition.speed / 1000}s ease`;
                elmToHide.style.opacity = '0';
                elmToHide.addEventListener('transitionend', () => {
                    elmToHide.style.display = 'none';
                    elmToHide.style.transition = '';
                    resolve();
                }, { once: true });
            }) : Promise.resolve();

            hidePromise.then(() => {
                elmToShow.style.transition = `opacity ${wizardObj.options.transition.speed / 1000}s ease`;
                elmToShow.style.opacity = '0';
                elmToShow.style.display = '';
                setTimeout(() => {
                    elmToShow.style.opacity = '1';
                    elmToShow.addEventListener('transitionend', () => {
                        elmToShow.style.transition = '';
                        callback();
                    }, { once: true });
                }, 50); // Small delay to make the transition visible
            });
        },
        css: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            const animFn = (elm, animation, cb) => {
                if (!animation) {
                    cb();
                    return;
                }

                const onAnimationEnd = () => {
                    elm.classList.remove(animation);
                    elm.removeEventListener("animationend", onAnimationEnd);
                    elm.removeEventListener("animationcancel", onAnimationCancel);
                    cb();
                };

                const onAnimationCancel = () => {
                    elm.classList.remove(animation);
                    elm.removeEventListener("animationend", onAnimationEnd);
                    elm.removeEventListener("animationcancel", onAnimationCancel);
                    cb('cancel');
                };

                elm.classList.add(animation);
                elm.addEventListener("animationend", onAnimationEnd);
                elm.addEventListener("animationcancel", onAnimationCancel);
            };

            const showCss = `${wizardObj.options.transition.prefixCss} ${stepDirection === 'backward' ? wizardObj.options.transition.bckShowCss : wizardObj.options.transition.fwdShowCss}`;
            const hideCss = `${wizardObj.options.transition.prefixCss} ${stepDirection === 'backward' ? wizardObj.options.transition.bckHideCss : wizardObj.options.transition.fwdHideCss}`;

            if (elmToHide) {
                animFn(elmToHide, hideCss, () => {
                    elmToHide.style.display = 'none';
                    elmToShow.style.display = '';
                    animFn(elmToShow, showCss, () => {
                        callback();
                    });
                });
            } else {
                elmToShow.style.display = '';
                animFn(elmToShow, showCss, () => {
                    callback();
                });
            }
        }
    };

    constructor(element, options) {
        // Default options
        const defaults = {
            debug: false,
            initAtCreated: true,
            selected: 0,
            theme: 'basic',
            justified: true,
            requiredField: {
                active: true,
                checkOnSubmitForm: true,
                submitEvent: false,
                controls: "input, textarea, select",
                classInvalid: "is-invalid",
                functionToValidate: null
            },
            autoAdjustHeight: true,
            backButtonSupport: true,
            enableUrlHash: true,
            transition: {
                animation: 'fade',
                speed: 400,
                easing: '',
                prefixCss: '',
                fwdShowCss: '',
                fwdHideCss: '',
                bckShowCss: '',
                bckHideCss: '',
            },
            toolbar: {
                position: 'bottom',
                showNextButton: true,
                showPreviousButton: true,
                extraHtml: ''
            },
            anchor: {
                enableNavigation: true,
                enableNavigationAlways: false,
                enableDoneState: true,
                markPreviousStepsAsDone: true,
                unDoneOnBackNavigation: false,
                enableDoneStateNavigation: true
            },
            keyboard: {
                keyNavigation: true,
                keyLeft: [37],
                keyRight: [39]
            },
            lang: {
                next: 'Next',
                previous: 'Previous'
            },
            style: {
                mainCss: 'sw',
                navCss: 'nav',
                navLinkCss: 'nav-link',
                contentCss: 'sw-content',
                contentPanelCss: 'sw-panel',
                themePrefixCss: 'sw-theme-',
                anchorDefaultCss: 'sw-default',
                anchorDoneCss: 'sw-done',
                anchorActiveCss: 'sw-active',
                anchorDisabledCss: 'sw-disabled',
                anchorHiddenCss: 'sw-hidden',
                anchorErrorCss: 'sw-error',
                anchorWarningCss: 'sw-warning',
                justifiedCss: 'sw-justified',
                btnCss: 'sw-btn',
                btnNextCss: 'sw-btn-next',
                btnPrevCss: 'sw-btn-prev',
                loaderCss: 'sw-loading',
                progressCss: 'progress',
                progressBarCss: 'progress-bar',
                toolbarCss: 'toolbar',
                toolbarPrefixCss: 'toolbar-',
            },
            disabledSteps: [],
            errorSteps: [],
            warningSteps: [],
            hiddenSteps: [],
            getContent: null,
        };

        const deepMerge = (target, source) => {
            // Si los dos argumentos son objetos, mezclamos sus propiedades
            if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
                const merged = { ...target };
                for (const key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        // Recursivamente hacemos la copia profunda de propiedades anidadas
                        merged[key] = deepMerge(merged[key], source[key]);
                    }
                }
                return merged;
            }
            // Si no son objetos, simplemente retornamos la fuente
            return source;
        }
        // Merge user options with defaults
        this.options = deepMerge(defaults, options);
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.nav = this.#getFirstDescendant(`.${this.options.style.navCss}`);
        this.container = this.#getFirstDescendant(`.${this.options.style.contentCss}`);
        this.steps = Array.from(this.nav.querySelectorAll(`.${this.options.style.navLinkCss}`));
        this.pages = Array.from(this.container.querySelectorAll(`.${this.options.style.contentPanelCss}`));
        this.progressbar = this.element.querySelector(`.${this.options.style.progressCss}`);
        this.dir = this.#getDir();
        this.current_index = -1;
        this.is_init = false;
        this.searchFormClosest = null;

        if (this.options.initAtCreated)
            this.#init().then(() => {
                this.#load();
            });
    }

    async #init() {
        if (this.options.debug)
            console.debug("Triggered init() method...")

        this.#setElements();
        this.#setToolbar();

        if (this.is_init) return true;

        this.#setEvents();
        this.is_init = true;

        this.#triggerEvent("initialized");
        return true;
    }

    #load() {
        if (this.options.debug)
            console.debug("Triggered load() method...")

        this.pages.forEach(page => page.style.display = 'none');
        this.steps.forEach(step => step.classList.remove(this.options.style.anchorDoneCss, this.options.style.anchorActiveCss));

        this.current_index = -1;

        let idx = this.#getURLHashIndex();
        idx = idx !== false ? idx : this.options.selected;
        const idxShowable = this.#getShowable(idx - 1, 'forward');
        idx = (idxShowable === null && idx > 0) ? this.#getShowable(-1, 'forward') : idxShowable;

        if (idx > 0 && this.options.anchor.enableDoneState && this.options.anchor.markPreviousStepsAsDone) {
            this.steps.slice(0, idx).forEach(step => step.classList.add(this.options.style.anchorDoneCss));
        }

        this.#showStep(idx);
        this.#triggerEvent("loaded");
    }

    #checkRequireds (onStep = false, actualStep = null) {
        if (this.options.requiredField.active){
            let inputs = this.element.querySelectorAll(this.options.requiredField.controls);
            if (onStep){
                if (this.current_index < 0) return false;
               inputs = this.#getStepPage(this.current_index).querySelectorAll(this.options.requiredField.controls);
            }
            if (inputs.length > 0) {
                let targets = [];
                inputs.forEach(e => {
                    let isRequired = e.required || e.classList.contains("required");
                    if (isRequired){
                        if (typeof  this.options.requiredField.functionToValidate === "function"){
                            if (this.options.requiredField.functionToValidate(e)){
                                targets.push(e);
                            }
                        }else{
                            if (e.value === '' || e.value === undefined || e.value === null) {
                                targets.push(e);
                            }
                        }
                    }
                });
                if (targets.length > 0){
                    if (this.options.requiredField.submitEvent){
                        this.#triggerEvent("requiredErrors", targets);
                    }else{
                        targets.forEach((el) => {
                            el.classList.add(this.options.requiredField.classInvalid);
                        });
                    }
                    let step = this.#getStepOfElement(targets[0]);
                    if (step >= 0){
                        this.#changeState(null, "error", true, step);
                        if (actualStep !== step)
                            this.#showStep(step);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    #getStepOfElement(element) {
        for (let i = 0; i < this.pages.length; i++) {
            if (this.pages[i].contains(element)) {
                return i;
            }
        }
        return -1;
    }

    #getFirstDescendant(selector) {
        if (this.options.debug)
            console.debug("Triggered getFirstDescendant() method...")

        let elm = this.element.querySelector(selector);
        if (elm) {
            return elm;
        }
        this.#showError(`Elemento no encontrado: ${selector}`);
        return null;
    }

    #getDir() {
        if (this.options.debug)
            console.debug("Triggered getDir() method...")

        let dir = this.element.getAttribute('dir');
        if (!dir) {
            dir = document.documentElement.getAttribute('dir') || 'ltr';
            this.element.setAttribute('dir', dir);
        }
        return dir;
    }

    #setElements() {
        if (this.options.debug)
            console.debug("Triggered setElements() method...")

        this.element.className = '';
        this.element.classList.add(this.options.style.mainCss, this.options.style.themePrefixCss + this.options.theme);
        this.element.classList.toggle(this.options.style.justifiedCss, this.options.justified);

        if (this.options.anchor.enableNavigationAlways !== true || this.options.anchor.enableNavigation !== true) {
            this.steps.forEach(step => step.classList.add(this.options.style.anchorDefaultCss));
        }

        this.options.disabledSteps.forEach(n => this.steps[n].classList.add(this.options.style.anchorDisabledCss));
        this.options.errorSteps.forEach(n => this.steps[n].classList.add(this.options.style.anchorErrorCss));
        this.options.warningSteps.forEach(n => this.steps[n].classList.add(this.options.style.anchorWarningCss));
        this.options.hiddenSteps.forEach(n => this.steps[n].classList.add(this.options.style.anchorHiddenCss));
    }

    #handleStepClick = (e) => {
        if (this.options.debug)
            console.debug("Click on step " + e.currentTarget + "...");
        e.preventDefault();
        if (this.options.anchor.enableNavigation !== true) {
            return;
        }
        if (this.#isShowable(e.currentTarget)) {
            this.#showStep(Array.from(this.steps).indexOf(e.currentTarget));
        }
    };

    #handleElementClick = (e) => {
        if (this.options.debug)
            console.debug("Click on element...");
        if (e.target.classList.contains(this.options.style.btnNextCss)) {
            e.preventDefault();
            this.#navigate('next');
        } else if (e.target.classList.contains(this.options.style.btnPrevCss)) {
            e.preventDefault();
            this.#navigate('prev');
        }
    };

    #handleKeyUp = (e) => {
        if (this.options.debug)
            console.debug("Keyup triggered...");
        this.#keyNav(e);
    };

    #handleHashChange = (e) => {
        if (this.options.debug)
            console.debug("hashchange triggered...");
        if (this.options.backButtonSupport !== true) {
            return;
        }
        const idx = this.#getURLHashIndex();
        if (idx !== false && this.#isShowable(this.steps[idx])) {
            e.preventDefault();
            this.#showStep(idx);
        }
    };

    #handleResize = () => {
        if (this.options.debug)
            console.debug("Resize triggered...");
        this.#fixHeight(this.current_index);
    };

    #handleFormSubmit = () => {
        if (this.options.debug)
            console.debug("Submit triggered...");
        return this.#checkRequireds();
    };

    #setEvents() {
        if (this.options.debug)
            console.debug("Triggered setEvents() method...")

        this.steps.forEach((elm) => {
            elm.addEventListener("click", this.#handleStepClick);
        });

        this.element.addEventListener("click", this.#handleElementClick);

        document.addEventListener("keyup", this.#handleKeyUp);

        window.addEventListener('hashchange', this.#handleHashChange);

        window.addEventListener('resize', this.#handleResize);

        if (this.options.requiredField.checkOnSubmitForm){
            this.searchFormClosest = this.element.closest("form");
            if (this.searchFormClosest){
                this.searchFormClosest.addEventListener("submit", this.#handleFormSubmit);
            }
        }
    }

    #setToolbar() {
        if (this.options.debug)
            console.debug("Triggered setToolbar() method... type " + this.options.toolbar.position)
        this.element.querySelectorAll(".sw-toolbar-elm").forEach(el => el.remove());

        switch (this.options.toolbar.position){
            case "both":
                this.container.before(this.#createToolbar('top'));
                this.container.after(this.#createToolbar('bottom'));
                break;
            case "top":
                this.container.before(this.#createToolbar('top'));
                break;
            case "bottom":
                this.container.after(this.#createToolbar('bottom'));
                break;
        }
    }

    #createToolbar(position) {
        const toolbar = document.createElement('div');
        toolbar.classList.add('sw-toolbar-elm', this.options.style.toolbarCss, this.options.style.toolbarPrefixCss + position);
        toolbar.setAttribute('role', 'toolbar');

        const btnNext = this.options.toolbar.showNextButton !== false ?
            Object.assign(document.createElement('button'), {
                textContent: this.options.lang.next,
                className: `btn ${this.options.style.btnNextCss} ${this.options.style.btnCss}`,
                type: 'button'
            }) : null;

        const btnPrevious = this.options.toolbar.showPreviousButton !== false ?
            Object.assign(document.createElement('button'), {
                textContent: this.options.lang.previous,
                className: `btn ${this.options.style.btnPrevCss} ${this.options.style.btnCss}`,
                type: 'button'
            }) : null;

        if (btnPrevious) toolbar.appendChild(btnPrevious);
        if (btnNext) toolbar.appendChild(btnNext);
        if (this.options.toolbar.extraHtml) toolbar.innerHTML += this.options.toolbar.extraHtml;
        return toolbar;
    }

    #navigate(dir) {
        this.#showStep(this.#getShowable(this.current_index, dir));
    }

    #showStep(idx) {
        if (this.options.debug)
            console.debug("Triggered showStep() method...")

        if (!this.#checkRequireds(true, idx)){
            if (idx === -1 || idx === null || idx === this.current_index || !this.steps[idx] || !this.#isEnabled(this.steps[idx])) {
                return false;
            }

            const stepDirection = this.#getStepDirection(idx);

            if (this.current_index !== -1) {
                if (!this.#triggerEvent("leaveStep", {
                    stepAnchor: this.#getStepAnchor(this.current_index),
                    stepIndex: this.current_index,
                    stepDirection: stepDirection
                })){
                    return false;
                }
            }

            this.#loadContent(idx, () => {
                const selStep = this.#getStepAnchor(idx);
                this.#setURLHash(selStep.getAttribute("href"));
                this.#setAnchor(idx);

                const curPage = this.#getStepPage(this.current_index);
                const selPage = this.#getStepPage(idx);

                this.#transit(selPage, curPage, stepDirection, () => {
                    this.#fixHeight(idx);
                    this.#triggerEvent("showStep", {
                                selStep: selStep,
                                idx: idx,
                                stepDirection: stepDirection,
                                stepPosition: this.#getStepPosition(idx)
                        }
                    );
                });

                this.current_index = idx;
                this.#setButtons(idx);
                this.#setProgressbar(idx);
            });
        }else{
            return false;
        }
    }

    #getShowable(idx, dir) {
        let si = null;
        let elmList;
        if (dir === 'prev') {
            elmList = this.steps.slice(0, idx).reverse();
        } else {
            elmList = this.steps.slice(idx + 1);
        }

        for (let i = 0; i < elmList.length; i++) {
            const elm = elmList[i];
            if (this.#isEnabled(elm)) {
                si = (dir === 'prev') ? idx - (i + 1) : i + idx + 1;
                break;
            }
        }
        return si;
    }

    #isShowable(elm) {
        if (!this.#isEnabled(elm)) {
            return false;
        }
        const isDone = elm.classList.contains(this.options.style.anchorDoneCss);
        if (this.options.anchor.enableDoneStateNavigation === false && isDone) {
            return false;
        }
        return !(this.options.anchor.enableNavigationAlways === false && !isDone);
    }

    #isEnabled(elm) {
        return !elm.classList.contains(this.options.style.anchorDisabledCss) && !elm.classList.contains(this.options.style.anchorHiddenCss);
    }

    #getStepDirection(idx) {
        return this.current_index < idx ? "forward" : "backward";
    }

    #getStepPosition(idx) {
        if (idx === 0) {
            return 'first';
        } else if (idx === this.steps.length - 1) {
            return 'last';
        }
        return 'middle';
    }

    #getStepAnchor(idx) {
        return (idx === null || idx === -1) ? null : this.steps[idx];
    }

    #getStepPage(idx) {
        return (idx === null || idx === -1) ? null : this.pages[idx];
    }

    #loadContent(idx, callback) {
        if (typeof this.options.getContent !== 'function') {
            callback();
            return;
        }

        const selPage = this.#getStepPage(idx);
        if (!selPage) {
            callback();
            return;
        }

        const stepDirection = this.#getStepDirection(idx);
        const stepPosition = this.#getStepPosition(idx);
        const selStep = this.#getStepAnchor(idx);

        this.options.getContent(idx, stepDirection, stepPosition, selStep, (content) => {
            if (content) selPage.innerHTML = content;
            callback();
        });
    }

    #transit(elmToShow, elmToHide, stepDirection, callback) {
        const transitFn = SmartWizard.#transitions[this.options.transition.animation];
        if (this.options.debug)
            console.debug("Triggered transit() method... " + this.options.transition.animation);
        
        if (typeof transitFn === 'function') {
            transitFn(elmToShow, elmToHide, stepDirection, this, res => {
                this.#fixHeight(this.current_index);

                if (this.options.debug)
                    console.debug("Triggered end animation method... " + this.options.transition.animation);

                if (res === false) {
                    if (elmToHide) elmToHide.style.display = 'none';
                    elmToShow.style.display = '';
                }
                callback();
            });
        } else {
            if (elmToHide) elmToHide.style.display = 'none';
            elmToShow.style.display = '';
            callback();
        }
    }
    
    #fixHeight(idx) {
        if (this.options.autoAdjustHeight === false) return;
        const contentHeight = this.#getStepPage(idx).offsetHeight;
        if (this.options.debug)
            console.debug("Fixed height triggered (Page: " + idx + ") ... " + contentHeight);

        if (contentHeight > 0) {
            this.container.style.height = `${contentHeight}px`;
        } else {
            this.container.style.height = 'auto';
        }
    }

    #setAnchor(idx) {
        if (this.current_index !== null && this.current_index >= 0) {
            const currentStep = this.steps[this.current_index];
            currentStep.classList.remove(this.options.style.anchorActiveCss);
            if (this.options.anchor.enableDoneState !== false) {
                currentStep.classList.add(this.options.style.anchorDoneCss);
                if (this.options.anchor.unDoneOnBackNavigation !== false && this.#getStepDirection(idx) === 'backward') {
                    currentStep.classList.remove(this.options.style.anchorDoneCss);
                }
            }
        }
        this.steps[idx].classList.remove(this.options.style.anchorDoneCss);
        this.steps[idx].classList.add(this.options.style.anchorActiveCss);
    }

    #setButtons(idx) {
        const nextButton = this.element.querySelector(`.${this.options.style.btnNextCss}`);
        const prevButton = this.element.querySelector(`.${this.options.style.btnPrevCss}`);

        if (nextButton)
            nextButton.classList.remove(this.options.style.anchorDisabledCss);
        if (prevButton)
            prevButton.classList.remove(this.options.style.anchorDisabledCss);

        const p = this.#getStepPosition(idx);
        if (p === 'first' || p === 'last') {
            const btn = (p === 'first') ? prevButton : nextButton;
            if (btn) btn.classList.add(this.options.style.anchorDisabledCss);
        } else {
            if (this.#getShowable(idx, 'next') === null) {
                if (nextButton) nextButton.classList.add(this.options.style.anchorDisabledCss);
            }
            if (this.#getShowable(idx, 'prev') === null) {
                if (prevButton) prevButton.classList.add(this.options.style.anchorDisabledCss);
            }
        }
    }

    #setProgressbar(idx) {
        const width = this.nav.offsetWidth;
        const widthPercentage = ((width / this.steps.length) * (idx + 1) / width) * 100;
        document.documentElement.style.setProperty('--sw-progress-width', `${widthPercentage}%`);
        if (this.progressbar) {
            this.progressbar.querySelector(`.${this.options.style.progressBarCss}`).style.width = `${widthPercentage}%`;
        }
    }

    #keyNav(e) {
        if (!this.options.keyboard.keyNavigation) {
            return;
        }
        if (this.options.keyboard.keyLeft.includes(e.which)) {
            this.#navigate('prev');
            e.preventDefault();
        } else if (this.options.keyboard.keyRight.includes(e.which)) {
            this.#navigate('next');
            e.preventDefault();
        }
    }

    #triggerEvent(name, params) {
        if (this.options.debug)
            console.debug("Triggered triggerEvent() method... " + name);

        params = params || {};
        params.wizard= this;

        const event = new CustomEvent(name, {
            detail: params,
            bubbles: true,
            cancelable: true
        });
        this.element.dispatchEvent(event);
        return !event.defaultPrevented;
    }

    #setURLHash(hash) {
        if (this.options.enableUrlHash && window.location.hash !== hash) {
            history.pushState(null, null, hash);
        }
    }

    #getURLHashIndex() {
        if (this.options.enableUrlHash && window.location.hash.length > 0) {
            const elm = this.nav.querySelector(`a[href*='${window.location.hash}']`);
            if (elm) {
                return this.steps.indexOf(elm);
            }
        }
        return false;
    }

    #showError(msg) {
        console.error(msg);
    }

    #changeState(stepArray = null, state, addOrRemove, stepNumber = null) {
        const cssMap = {
            'default': this.options.style.anchorDefaultCss,
            'active': this.options.style.anchorActiveCss,
            'done': this.options.style.anchorDoneCss,
            'disable': this.options.style.anchorDisabledCss,
            'hidden': this.options.style.anchorHiddenCss,
            'error': this.options.style.anchorErrorCss,
            'warning': this.options.style.anchorWarningCss,
        };

        const css = cssMap[state];
        if (!css) return;

        if (stepNumber !== null){
            const step = this.steps[stepNumber] || null;
            if (step){
                if (addOrRemove) {
                    step.classList.add(css);
                } else {
                    step.classList.remove(css);
                }
            }
        }else if(stepArray){
            stepArray.forEach(n => {
                const step = this.steps[n];
                if (addOrRemove) {
                    step.classList.add(css);
                } else {
                    step.classList.remove(css);
                }
            });
        }
    }

    // Public methods
    goToStep(stepIndex, force) {
        force = force !== false;
        if (force !== true && !this.#isShowable(this.steps[stepIndex])) {
            return;
        }

        if (force === true && stepIndex > 0 && this.options.anchor.enableDoneState && this.options.anchor.markPreviousStepsAsDone) {
            this.steps.slice(0, stepIndex).forEach(step => step.classList.add(this.options.style.anchorDoneCss));
        }

        this.#showStep(stepIndex);
    }

    next() {
        this.#navigate('next');
    }

    prev() {
        this.#navigate('prev');
    }

    reset() {
        this.steps.forEach(step => step.classList.remove(
            this.options.style.anchorDoneCss,
            this.options.style.anchorActiveCss,
            this.options.style.anchorErrorCss,
            this.options.style.anchorWarningCss
        ));
        this.#setURLHash('#');
        this.#init().then(() => {
            this.#load();
        });
    }

    setState(stepArray, state) {
        this.#changeState(stepArray, state, true);
    }

    unsetState(stepArray, state) {
        this.#changeState(stepArray, state, false);
    }

    unsetErrors (idx) {
        this.#changeState(null, "error", false, idx);
    }

    setOptions(options) {
        this.options = { ...this.options, ...options };
        this.#init().then();
    }

    getOptions() {
        return this.options;
    }

    getStepInfo() {
        return {
            currentStep: this.current_index !== null ? this.current_index : 0,
            totalSteps: this.steps ? this.steps.length : 0
        };
    }

    loader(state) {
        this.element.classList.toggle(this.options.style.loaderCss, state === "show");
    }

    fixHeight() {
        this.#fixHeight(this.current_index);
    }

    init(){
        this.#init().then(() => {
            this.#load();
        });
    }

    checkStepRequired(step) {
        return this.#checkRequireds(true, step);
    }

    checkFormRequireds() {
        return this.#checkRequireds();
    }

    destroy() {
        this.steps.forEach(elm => {
            elm.removeEventListener("click", this.#handleStepClick);
        });
        this.element.removeEventListener("click", this.#handleElementClick);
        document.removeEventListener("keyup", this.#handleKeyUp);
        window.removeEventListener('hashchange', this.#handleHashChange);
        window.removeEventListener('resize', this.#handleResize);
        if (this.searchFormClosest)
            this.searchFormClosest.removeEventListener("submit", this.#handleFormSubmit);

        if (this.options.debug)
            console.log("Events destroyed. The object is no longer active.");
    }
}

export default SmartWizard;