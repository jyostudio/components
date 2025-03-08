import overload from "@jyostudio/overload";
import themeManager from "../libs/themeManager/themeManager.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");
const OPTIONS_SYMBOL = Symbol("options");

/**
 * 创建样式表
 * @param {String} css - CSS
 * @returns {CSSStyleSheet} 样式表
 */
function createStyleSheet(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    return sheet;
}

/**
 * 共享样式
 * @type {CSSStyleSheet}
 */
const SHARED_STYLE = createStyleSheet(themeManager.supportToHDR(`
* {
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    user-select: none;
    cursor: default;
}

*, *::before, *::after {
    box-sizing: border-box;
}

:host {
    box-sizing: border-box;
}

:host([hidden]) {
  display: none !important;
}

button, [type="button"], [type="reset"], [type="submit"] {
    appearance: none;
    border: none;
    outline: none;
    background: none;
    margin: 0;
    padding: 0;
}

input[type="search"], input[type="text"] {
    appearance: none;
    border-radius: 0;
}

:host(:focus-visible) {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

@media (prefers-reduced-motion: reduce) {
    * {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        scroll-behavior: auto !important;
    }
}
`));

export default class Component extends HTMLElement {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [];
    }

    /**
     * 内部元素
     * @type {ElementInternals?}
     */
    #internals = null;

    /**
     * 中止控制器
     * @type {AbortController}
     */
    #abortController = new AbortController();

    /**
     * 节流函数名称集合
     * @type {Set<string>}
     */
    #lockNameSet = new Set();

    /**
     * 注册组件
     * @param {Object} options - 选项
     * @param {String?} options.css - 样式表
     * @param {String?} options.html - HTML
     */
    static registerComponent(...params) {
        Component.registerComponent = overload([Object], function (options) {
            const registerName = this.name.replace(/([A-Z])/g, "-$1").toLowerCase();
            this[OPTIONS_SYMBOL] = options;
            customElements.define(`jyo${registerName}`, this);
        });

        return Component.registerComponent.apply(this, params);
    }

    static [CONSTRUCTOR_SYMBOL](...params) {
        Component[CONSTRUCTOR_SYMBOL] = overload([], function () {
            const { css, html } = this.constructor[OPTIONS_SYMBOL] || {};

            this.#internals = this.attachInternals?.();
            if (!this.#internals?.shadowRoot) {
                this.attachShadow({ mode: "open" });
                if (html) {
                    const template = document.createElement("template");
                    template.innerHTML = html;
                    const fragment = template.content.cloneNode(true);
                    while (this.shadowRoot.firstChild) {
                        this.shadowRoot.removeChild(this.shadowRoot.firstChild);
                    }
                    this.shadowRoot.appendChild(fragment);
                }
            }

            const styleSheets = new Set([...this.shadowRoot.adoptedStyleSheets, SHARED_STYLE]);
            if (css) {
                const normalizedCSS = css instanceof CSSStyleSheet ?
                    themeManager.supportToHDR(css) :
                    createStyleSheet(themeManager.supportToHDR(css));

                styleSheets.add(normalizedCSS);
            }
            this.shadowRoot.adoptedStyleSheets = Array.from(styleSheets);
        });

        return Component[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            internals: {
                get: () => this.#internals
            },
            abortController: {
                get: () => this.#abortController
            }
        });

        return Component[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    [Symbol.dispose](...params) {
        Component.prototype[Symbol.dispose] = overload([], function () {
            this.#internals = null;

            this.dispatchCustomEvent("dispose", { cancelable: false });
        });

        return Component.prototype[Symbol.dispose].apply(this, params);
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.#abortController.signal;

        this.addEventListener("keypress", e => {
            if (document.activeElement !== this) return;
            if (e.key === "Enter" || e.key === " ") {
                this.click();
            }
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback() {
        themeManager.link(this.shadowRoot);

        if (!this.shadowRoot.host.getAttribute("tabindex")) {
            this.shadowRoot.host.tabIndex = 0;
        }

        this.#abortController ||= new AbortController();

        this.#initEvents();

        this.dispatchCustomEvent("connected");
    }

    /**
     * DOM 元素被移动到新文档时调用
     */
    adoptedCallback() {
        this.dispatchCustomEvent("adopted");
    }

    /**
     * DOM 元素属性更改时调用
     * @param {String} name - 属性名称
     * @param {String} oldValue - 旧值
     * @param {String} newValue - 新值
     */
    attributeChangedCallback(name, oldValue, newValue) {
        const propName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (propName in this) {
            this[propName] = newValue; // 触发setter
        } else {
            console.warn(`未定义的观察属性: ${propName}`);
        }
        this.dispatchCustomEvent("attributeChanged", { detail: { name, oldValue, newValue } });
    }

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback() {
        this.#abortController?.abort?.();
        this.#abortController = null;

        themeManager.unlink(this.shadowRoot);

        this.dispatchCustomEvent("disconnected");
    }

    dispatchCustomEvent(...params) {
        Component.prototype.dispatchCustomEvent = overload()
            /**
             * 分发自定义事件
             * @param {String} type - 类型
             * @returns {Boolean} 是否成功触发
             */
            .add([String], function (type) {
                return this.dispatchCustomEvent(type, {});
            })
            .add(
                [String, Object],
                /**
                 * 分发自定义事件
                 * @param {String} type - 类型
                 * @param {Object} [eventInitDict] - 事件初始化字典
                 * @returns {Boolean} 是否成功触发
                 */
                function (type, eventInitDict) {
                    const event = new CustomEvent(type, {
                        bubbles: false,
                        composed: true,
                        cancelable: true,
                        ...eventInitDict
                    });
                    return this.dispatchEvent(event);
                }
            );

        return Component.prototype.dispatchCustomEvent.apply(this, params);
    }

    lock(...params) {
        Component.prototype.lock = overload(
            [String, Function],
            /**
             * 锁定
             * @param {String} name - 名称
             * @param {Function} callback - 回调
             */
            function (name, callback) {
                if (this.#lockNameSet.has(name)) return;
                this.#lockNameSet.add(name);
                callback();
                this.#lockNameSet.delete(name);
            }
        );

        return Component.prototype.lock.apply(this, params);
    }

    thenParentDefined(...params) {
        Component.prototype.thenParentDefined = overload(
            [Function],
            /**
             * 等待父元素定义
             * @param {Function} callback - 回调
             */
            async function (callback) {
                await new Promise(resolve => {
                    const TAG_NAME = this.shadowRoot.host?.parentElement?.tagName?.toLowerCase?.() ?? "";
                    if (customElements.get(TAG_NAME) || !TAG_NAME.includes("-")) {
                        resolve();
                    } else {
                        customElements.whenDefined(TAG_NAME).then(resolve);
                    }
                });
                return callback();
            }
        );

        return Component.prototype.thenParentDefined.apply(this, params);
    }
}