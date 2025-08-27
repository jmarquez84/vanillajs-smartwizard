/**
 * SmartWizard v1.0.1 - Vanilla JavaScript Version (Universal Module)
 * The awesome step wizard plugin, converted to pure JavaScript.
 *
 * Based on the original jQuery SmartWizard by Dipu Raj (http://dipu.me)
 * This version removes all external dependencies and adds support for both ES Modules and global usage.
 */

(function () {
    "use strict";

    class SmartWizard {
        constructor(element, options) {
            // Default options
            const defaults = {
                selected: 0,
                theme: 'basic',
                justified: true,
                autoAdjustHeight: true,
                backButtonSupport: true,
                enableUrlHash: true,
                transition: {
                    animation: 'none',
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
                    contentCss: 'tab-content',
                    contentPanelCss: 'tab-pane',
                    themePrefixCss: 'sw-theme-',
                    anchorDefaultCss: 'default',
                    anchorDoneCss: 'done',
                    anchorActiveCss: 'active',
                    anchorDisabledCss: 'disabled',
                    anchorHiddenCss: 'hidden',
                    anchorErrorCss: 'error',
                    anchorWarningCss: 'warning',
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

            // Merge user options with defaults
            this.options = { ...defaults, ...options };
            this.element = typeof element === 'string' ? document.querySelector(element) : element;
            this.nav = this._getFirstDescendant(`.${this.options.style.navCss}`);
            this.container = this._getFirstDescendant(`.${this.options.style.contentCss}`);
            this.steps = Array.from(this.nav.querySelectorAll(`.${this.options.style.navLinkCss}`));
            this.pages = Array.from(this.container.querySelectorAll(`.${this.options.style.contentPanelCss}`));
            this.progressbar = this.element.querySelector(`.${this.options.style.progressCss}`);
            this.dir = this._getDir();
            this.current_index = -1;
            this.is_init = false;

            this._init();

            setTimeout(() => {
                this._load();
            }, 0);
        }

        _init() {
            this._setElements();
            this._setToolbar();

            if (this.is_init) return true;

            this._setEvents();
            this.is_init = true;
            this._triggerEvent("initialized");
        }

        _load() {
            this.pages.forEach(page => page.style.display = 'none');
            this.steps.forEach(step => step.classList.remove(this.options.style.anchorDoneCss, this.options.style.anchorActiveCss));

            this.current_index = -1;

            let idx = this._getURLHashIndex();
            idx = idx !== false ? idx : this.options.selected;
            const idxShowable = this._getShowable(idx - 1, 'forward');
            idx = (idxShowable === null && idx > 0) ? this._getShowable(-1, 'forward') : idxShowable;

            if (idx > 0 && this.options.anchor.enableDoneState && this.options.anchor.markPreviousStepsAsDone) {
                this.steps.slice(0, idx).forEach(step => step.classList.add(this.options.style.anchorDoneCss));
            }

            this._showStep(idx);
            this._triggerEvent("loaded");
        }

        _getFirstDescendant(selector) {
            let elm = this.element.querySelector(selector);
            if (elm) {
                return elm;
            }
            this._showError(`Elemento no encontrado: ${selector}`);
            return null;
        }

        _getDir() {
            let dir = this.element.getAttribute('dir');
            if (!dir) {
                dir = document.documentElement.getAttribute('dir') || 'ltr';
                this.element.setAttribute('dir', dir);
            }
            return dir;
        }

        _setElements() {
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

        _setEvents() {
            this.steps.forEach((elm, index) => {
                elm.addEventListener("click", e => {
                    e.preventDefault();
                    if (this.options.anchor.enableNavigation !== true) {
                        return;
                    }
                    if (this._isShowable(elm)) {
                        this._showStep(index);
                    }
                });
            });

            this.element.addEventListener("click", e => {
                if (e.target.classList.contains(this.options.style.btnNextCss)) {
                    e.preventDefault();
                    this._navigate('next');
                } else if (e.target.classList.contains(this.options.style.btnPrevCss)) {
                    e.preventDefault();
                    this._navigate('prev');
                }
            });

            document.addEventListener("keyup", e => {
                this._keyNav(e);
            });

            window.addEventListener('hashchange', e => {
                if (this.options.backButtonSupport !== true) {
                    return;
                }
                const idx = this._getURLHashIndex();
                if (idx !== false && this._isShowable(this.steps[idx])) {
                    e.preventDefault();
                    this._showStep(idx);
                }
            });

            window.addEventListener('resize', () => {
                this._fixHeight(this.current_index);
            });
        }

        _setToolbar() {
            this.element.querySelectorAll(".sw-toolbar-elm").forEach(el => el.remove());

            const toolbarPosition = this.options.toolbar.position;
            if (toolbarPosition === 'none') {
                return;
            } else if (toolbarPosition === 'both') {
                this.container.before(this._createToolbar('top'));
                this.container.after(this._createToolbar('bottom'));
            } else if (toolbarPosition === 'top') {
                this.container.before(this._createToolbar('top'));
            } else {
                this.container.after(this._createToolbar('bottom'));
            }
        }

        _createToolbar(position) {
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

        _navigate(dir) {
            this._showStep(this._getShowable(this.current_index, dir));
        }

        _showStep(idx) {
            if (idx === -1 || idx === null || idx === this.current_index || !this.steps[idx] || !this._isEnabled(this.steps[idx])) {
                return false;
            }

            const stepDirection = this._getStepDirection(idx);

            if (this.current_index !== -1) {
                const leaveEvent = new CustomEvent("leaveStep", {
                    detail: [this._getStepAnchor(this.current_index), this.current_index, idx, stepDirection],
                    cancelable: true
                });
                this.element.dispatchEvent(leaveEvent);
                if (leaveEvent.defaultPrevented) {
                    return false;
                }
            }

            this._loadContent(idx, () => {
                const selStep = this._getStepAnchor(idx);
                this._setURLHash(selStep.getAttribute("href"));
                this._setAnchor(idx);

                const curPage = this._getStepPage(this.current_index);
                const selPage = this._getStepPage(idx);

                this._transit(selPage, curPage, stepDirection, () => {
                    this._fixHeight(idx);
                    this._triggerEvent("showStep", [selStep, idx, stepDirection, this._getStepPosition(idx)]);
                });

                this.current_index = idx;
                this._setButtons(idx);
                this._setProgressbar(idx);
            });
        }

        _getShowable(idx, dir) {
            let si = null;
            let elmList;
            if (dir === 'prev') {
                elmList = this.steps.slice(0, idx).reverse();
            } else {
                elmList = this.steps.slice(idx + 1);
            }

            for (let i = 0; i < elmList.length; i++) {
                const elm = elmList[i];
                if (this._isEnabled(elm)) {
                    si = (dir === 'prev') ? idx - (i + 1) : i + idx + 1;
                    break;
                }
            }
            return si;
        }

        _isShowable(elm) {
            if (!this._isEnabled(elm)) {
                return false;
            }
            const isDone = elm.classList.contains(this.options.style.anchorDoneCss);
            if (this.options.anchor.enableDoneStateNavigation === false && isDone) {
                return false;
            }
            if (this.options.anchor.enableNavigationAlways === false && !isDone) {
                return false;
            }
            return true;
        }

        _isEnabled(elm) {
            return !elm.classList.contains(this.options.style.anchorDisabledCss) && !elm.classList.contains(this.options.style.anchorHiddenCss);
        }

        _getStepDirection(idx) {
            return this.current_index < idx ? "forward" : "backward";
        }

        _getStepPosition(idx) {
            if (idx === 0) {
                return 'first';
            } else if (idx === this.steps.length - 1) {
                return 'last';
            }
            return 'middle';
        }

        _getStepAnchor(idx) {
            return (idx === null || idx === -1) ? null : this.steps[idx];
        }

        _getStepPage(idx) {
            return (idx === null || idx === -1) ? null : this.pages[idx];
        }

        _loadContent(idx, callback) {
            if (typeof this.options.getContent !== 'function') {
                callback();
                return;
            }

            const selPage = this._getStepPage(idx);
            if (!selPage) {
                callback();
                return;
            }

            const stepDirection = this._getStepDirection(idx);
            const stepPosition = this._getStepPosition(idx);
            const selStep = this._getStepAnchor(idx);

            this.options.getContent(idx, stepDirection, stepPosition, selStep, (content) => {
                if (content) selPage.innerHTML = content;
                callback();
            });
        }

        _transit(elmToShow, elmToHide, stepDirection, callback) {
            const transitFn = SmartWizard.transitions[this.options.transition.animation];
            this._stopAnimations();
            if (typeof transitFn === 'function') {
                transitFn(elmToShow, elmToHide, stepDirection, this, res => {
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

        _stopAnimations() {
            // In vanilla JS, there is no direct `stop` function like in jQuery.
            // You can cancel CSS animations.
        }

        _fixHeight(idx) {
            if (this.options.autoAdjustHeight === false) return;
            const contentHeight = this._getStepPage(idx).offsetHeight;
            if (contentHeight > 0) {
                this.container.style.height = `${contentHeight}px`;
            } else {
                this.container.style.height = 'auto';
            }
        }

        _setAnchor(idx) {
            if (this.current_index !== null && this.current_index >= 0) {
                const currentStep = this.steps[this.current_index];
                currentStep.classList.remove(this.options.style.anchorActiveCss);
                if (this.options.anchor.enableDoneState !== false) {
                    currentStep.classList.add(this.options.style.anchorDoneCss);
                    if (this.options.anchor.unDoneOnBackNavigation !== false && this._getStepDirection(idx) === 'backward') {
                        currentStep.classList.remove(this.options.style.anchorDoneCss);
                    }
                }
            }
            this.steps[idx].classList.remove(this.options.style.anchorDoneCss);
            this.steps[idx].classList.add(this.options.style.anchorActiveCss);
        }

        _setButtons(idx) {
            const nextButton = this.element.querySelector(`.${this.options.style.btnNextCss}`);
            const prevButton = this.element.querySelector(`.${this.options.style.btnPrevCss}`);

            nextButton.classList.remove(this.options.style.anchorDisabledCss);
            prevButton.classList.remove(this.options.style.anchorDisabledCss);

            const p = this._getStepPosition(idx);
            if (p === 'first' || p === 'last') {
                const btn = (p === 'first') ? prevButton : nextButton;
                if (btn) btn.classList.add(this.options.style.anchorDisabledCss);
            } else {
                if (this._getShowable(idx, 'next') === null) {
                    if (nextButton) nextButton.classList.add(this.options.style.anchorDisabledCss);
                }
                if (this._getShowable(idx, 'prev') === null) {
                    if (prevButton) prevButton.classList.add(this.options.style.anchorDisabledCss);
                }
            }
        }

        _setProgressbar(idx) {
            const width = this.nav.offsetWidth;
            const widthPercentage = ((width / this.steps.length) * (idx + 1) / width) * 100;
            document.documentElement.style.setProperty('--sw-progress-width', `${widthPercentage}%`);
            if (this.progressbar) {
                this.progressbar.querySelector(`.${this.options.style.progressBarCss}`).style.width = `${widthPercentage}%`;
            }
        }

        _keyNav(e) {
            if (!this.options.keyboard.keyNavigation) {
                return;
            }
            if (this.options.keyboard.keyLeft.includes(e.which)) {
                this._navigate('prev');
                e.preventDefault();
            } else if (this.options.keyboard.keyRight.includes(e.which)) {
                this._navigate('next');
                e.preventDefault();
            }
        }

        _triggerEvent(name, params) {
            const event = new CustomEvent(name, {
                detail: params,
                bubbles: true,
                cancelable: true
            });
            this.element.dispatchEvent(event);
            return !event.defaultPrevented;
        }

        _setURLHash(hash) {
            if (this.options.enableUrlHash && window.location.hash !== hash) {
                history.pushState(null, null, hash);
            }
        }

        _getURLHashIndex() {
            if (this.options.enableUrlHash && window.location.hash.length > 0) {
                const elm = this.nav.querySelector(`a[href*='${window.location.hash}']`);
                if (elm) {
                    return this.steps.indexOf(elm);
                }
            }
            return false;
        }

        _showError(msg) {
            console.error(msg);
        }

        _changeState(stepArray, state, addOrRemove) {
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

            stepArray.forEach(n => {
                const step = this.steps[n];
                if (addOrRemove) {
                    step.classList.add(css);
                } else {
                    step.classList.remove(css);
                }
            });
        }

        // Public methods
        goToStep(stepIndex, force) {
            force = force !== false;
            if (force !== true && !this._isShowable(this.steps[stepIndex])) {
                return;
            }

            if (force === true && stepIndex > 0 && this.options.anchor.enableDoneState && this.options.anchor.markPreviousStepsAsDone) {
                this.steps.slice(0, stepIndex).forEach(step => step.classList.add(this.options.style.anchorDoneCss));
            }

            this._showStep(stepIndex);
        }

        next() {
            this._navigate('next');
        }

        prev() {
            this._navigate('prev');
        }

        reset() {
            this.steps.forEach(step => step.classList.remove(
                this.options.style.anchorDoneCss,
                this.options.style.anchorActiveCss,
                this.options.style.anchorErrorCss,
                this.options.style.anchorWarningCss
            ));
            this._setURLHash('#');
            this._init();
            this._load();
        }

        setState(stepArray, state) {
            this._changeState(stepArray, state, true);
        }

        unsetState(stepArray, state) {
            this._changeState(stepArray, state, false);
        }

        setOptions(options) {
            this.options = { ...this.options, ...options };
            this._init();
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
            this._fixHeight(this.current_index);
        }

        static transitions = {
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
            slideHorizontal: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
                const containerWidth = wizardObj.container.offsetWidth;
                const dirMultiplier = stepDirection === 'backward' ? 1 : -1;

                if (wizardObj.current_index === -1) {
                    wizardObj.container.style.height = `${elmToShow.offsetHeight}px`;
                }

                if (elmToHide) {
                    elmToHide.style.position = 'absolute';
                    elmToHide.style.left = '0';
                    elmToHide.style.transition = `left ${wizardObj.options.transition.speed / 1000}s`;
                    elmToHide.style.left = `${containerWidth * dirMultiplier}px`;
                    elmToHide.addEventListener('transitionend', () => {
                        elmToHide.style.display = 'none';
                        elmToHide.style.position = '';
                        elmToHide.style.left = '';
                        elmToHide.style.transition = '';
                    }, { once: true });
                }

                const initialLeft = containerWidth * (dirMultiplier === 1 ? -1 : 1);
                elmToShow.style.position = 'absolute';
                elmToShow.style.left = `${initialLeft}px`;
                elmToShow.style.display = '';
                elmToShow.style.transition = `left ${wizardObj.options.transition.speed / 1000}s`;

                setTimeout(() => {
                    elmToShow.style.left = '0';
                    elmToShow.addEventListener('transitionend', () => {
                        elmToShow.style.position = '';
                        elmToShow.style.left = '';
                        elmToShow.style.transition = '';
                        callback();
                    }, { once: true });
                }, 50);
            },
            // Other animations like slideVertical, slideSwing, etc. could be added here
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
    }

    // Export the SmartWizard class based on the environment
    if (typeof module === "object" && typeof module.exports === "object") {
        // CommonJS (Node.js) environment
        module.exports = SmartWizard;
    } else if (typeof define === "function" && define.amd) {
        // AMD (Require.js) environment
        define(function() {
            return SmartWizard;
        });
    } else if (typeof window !== "undefined") {
        // Browser environment (global)
        window.SmartWizard = SmartWizard;
    }

})(typeof window !== "undefined" ? window : this);
