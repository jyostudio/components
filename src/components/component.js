import overload from "@jyostudio/overload";
import themeManager from "../libs/themeManager/themeManager.js";

const OPTIONS_SYMBOL = Symbol("options");

/**
 * 创建样式表
 * @param {String} css - CSS
 * @returns {CSSStyleSheet} 样式表
 */
function createStyleSheet(css) {
    try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        return sheet;
    } catch (e) {
        console.error("创建样式表失败", e);
        return null;
    }
}

/**
 * 共享样式
 * @type {CSSStyleSheet}
 */
const SHARED_STYLE = createStyleSheet(themeManager.enhanceToHDR(/* css */`
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

/**
 * 组件基类
 * @class
 * @extends {HTMLElement}
 */
export default class Component extends HTMLElement {
    /**
     * 全局属性
     * @type {Array<String>}
     */
    static #GLOBAL_ATTRIBUTES = [
        "accesskey", "autocapitalize", "autofocus", "class", "contenteditable", "dir", "draggable", "enterkeyhint", "exportparts", "hidden", "id", "inert", "inputmode", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "nonce", "part", "popover", "role", "slot", "spellcheck", "style", "tabindex", "title", "translate", "virtualkeyboardpolicy"
    ];

    /**
     * 计数器
     * @type {Number}
     */
    static #counter = 0n;

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [];
    }

    /**
     * 是否支持 form 关联
     * @returns {Boolean}
     */
    static get formAssociated() {
        return false;
    }

    /**
     * 组件 ID
     * @type {String}
     */
    #componentId = `${this.tagName}-${++Component.#counter}`;

    /**
     * 是否已初始化
     * @type {Boolean}
     */
    #hasInit = false;

    /**
     * 内部元素
     * @type {ElementInternals?}
     */
    #internals = null;

    /**
     * 中止控制器
     * @type {AbortController?}
     */
    #abortController = null;

    /**
     * 节流函数名称集合
     * @type {Set<string>}
     */
    #lockNameSet = new Set();

    /**
     * 获取组件 ID
     * @returns {String} 组件 ID
     */
    get componentId() {
        return this.#componentId;
    }

    /**
     * 是否已初始化
     * @returns {Boolean}
     */
    get hasInit() {
        return this.#hasInit;
    }

    /**
     * 检查观察属性合法性
     * @param {Function} classFn - 类函数
     * @throws {Error} 如果属性不合法则抛出错误
     */
    static #checkObservedAttributes(classFn) {
        for (const attr of classFn.observedAttributes) {
            if (this.#GLOBAL_ATTRIBUTES.includes(attr)) {
                throw new Error(`在 ${classFn.name} 中不允许观察全局属性: ${attr}`);
            }

            if (attr.indexOf("aria-") === 0) {
                throw new Error(`在 ${classFn.name} 中不允许观察 aria- 前缀的属性: ${attr}`);
            }

            if (attr.indexOf("data-") === 0) {
                throw new Error(`在 ${classFn.name} 中不允许观察 data- 前缀的属性: ${attr}`);
            }

            if (attr.indexOf("on") === 0) {
                console.warn(`在 ${classFn.name} 中 on 作为前缀会导致框架兼容性问题，如需要定义事件，请使用 event 作为前缀: ${attr}`);
            }
        }
    }

    static registerComponent(...params) {
        Component.registerComponent = overload([Object],
            /**
             * 注册组件
             * @param {Object} options - 选项
             * @param {String?} options.name - 组件名称
             * @param {String?} options.css - 样式表
             * @param {String?} options.html - HTML
             */
            function (options) {
                Component.#checkObservedAttributes(this);
                const registerName = this.name.replace(/([A-Z])/g, "-$1").toLowerCase();
                this[OPTIONS_SYMBOL] = options;
                customElements.define(options.name ?? `jyo${registerName}`, this);
            });

        return Component.registerComponent.apply(this, params);
    }

    constructor() {
        super();

        Object.defineProperties(this, {
            internals: {
                get: () => this.#internals
            },
            abortController: {
                get: () => this.#abortController
            }
        });

        this.#initShadowDOM();
    }

    [Symbol.dispose](...params) {
        Component.prototype[Symbol.dispose] = overload([], function () {
            this.#internals = null;

            this.dispatchCustomEvent("dispose", { cancelable: false });
        });

        return Component.prototype[Symbol.dispose].apply(this, params);
    }

    /**
     * 初始化 Shadow DOM
     */
    #initShadowDOM() {
        this.#createShadowRoot();
        this.#applyTemplate();
        this.#applyStyles();
    }

    /**
     * 创建 Shadow DOM
     */
    #createShadowRoot() {
        this.#internals = this.attachInternals?.();
        if (!this.#internals?.shadowRoot && !this.shadowRoot) {
            try {
                this.attachShadow({ mode: "open" });
            } catch (e) {
                console.error("创建 Shadow DOM 失败", e);
            }
        }
    }

    /**
     * 应用模板
     */
    #applyTemplate() {
        const { html } = this.constructor[OPTIONS_SYMBOL] || {};

        if (html && !this.shadowRoot.querySelector("template")) {
            const template = document.createElement("template");
            template.innerHTML = html;
            const fragment = template.content.cloneNode(true);
            while (this.shadowRoot.firstChild) {
                this.shadowRoot.removeChild(this.shadowRoot.firstChild);
            }
            this.shadowRoot.appendChild(fragment);
        }
    }

    /**
     * 应用样式
     */
    #applyStyles() {
        const { css } = this.constructor[OPTIONS_SYMBOL] || {};

        const styleSheets = new Set([SHARED_STYLE, ...this.shadowRoot.adoptedStyleSheets]);
        if (css) {
            const normalizedCSS = css instanceof CSSStyleSheet ?
                themeManager.enhanceToHDR(css) :
                createStyleSheet(themeManager.enhanceToHDR(css));

            if (normalizedCSS && !styleSheets.has(normalizedCSS)) {
                styleSheets.add(normalizedCSS);
            }
        }
        this.shadowRoot.adoptedStyleSheets = Array.from(styleSheets);
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
        if (!this.#abortController) {
            this.#abortController = new AbortController();
            this.#initEvents();
        }

        themeManager.link(this.shadowRoot);

        if (!this.shadowRoot.host.getAttribute("tabindex")) {
            this.shadowRoot.host.tabIndex = 0;
        }

        requestAnimationFrame(() => {
            this.#hasInit = true;
            this.dispatchCustomEvent("connected")
        });
    }

    /**
     * DOM 元素被移动到新文档时调用
     */
    adoptedCallback() {
        requestAnimationFrame(() => this.dispatchCustomEvent("adopted"));
    }

    /**
     * DOM 元素属性更改时调用
     * @param {String} name - 属性名称
     * @param {String} oldValue - 旧值
     * @param {String} newValue - 新值
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        const propName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (propName in this) {
            this[propName] = newValue;
        } else {
            console.warn(`未定义的观察属性: ${propName}`);
        }
        requestAnimationFrame(() => this.dispatchCustomEvent("attributeChanged", { detail: { name, oldValue, newValue } }));
    }

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback() {
        if (this.#abortController) {
            this.#abortController.abort();
            this.#abortController = null;
        }

        themeManager.unlink(this.shadowRoot);

        requestAnimationFrame(() => this.dispatchCustomEvent("disconnected"));
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
                 * @param {CustomEventInit<any>} [eventInitDict] - 事件初始化字典
                 * @returns {Boolean} 是否成功触发
                 */
                function (type, eventInitDict) {
                    return this.dispatchEvent(new CustomEvent(type, {
                        bubbles: false,
                        composed: true,
                        cancelable: true,
                        ...eventInitDict
                    }));
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

    getClosestByTagName() {
        Component.prototype.getClosestByTagName = overload(
            [String],
            /**
             * 根据TAG_NAME获取最近的父元素
             * @param {String} tagName - 标签名
             * @returns {HTMLElement?} 元素
             */
            function (tagName) {
                let parent = this;
                while (parent) {
                    parent = parent.getRootNode()?.host;
                    if (parent?.tagName === tagName.toUpperCase()) {
                        return parent;
                    }
                }
                return null;
            }
        );

        return Component.prototype.getClosestByTagName.apply(this, arguments);
    }

    thenParentDefined(...params) {
        Component.prototype.thenParentDefined = overload(
            [Function],
            /**
             * 等待父元素定义
             * @param {Function} callback - 回调
             */
            async function (callback) {
                await new Promise((resolve, reject) => {
                    const TAG_NAME = this.shadowRoot.host?.parentElement?.tagName?.toLowerCase?.() ?? "";
                    if (customElements.get(TAG_NAME) || !TAG_NAME.includes("-")) {
                        resolve();
                    } else {
                        let hasTimeout = false;
                        const timeout = setTimeout(() => {
                            hasTimeout = true;
                            reject(new Error("等待父级超时"))
                        }, 5000);
                        customElements.whenDefined(TAG_NAME).then(() => {
                            if (hasTimeout) return;
                            clearTimeout(timeout);
                            resolve();
                        });
                    }
                });
                return callback();
            }
        );

        return Component.prototype.thenParentDefined.apply(this, params);
    }
}