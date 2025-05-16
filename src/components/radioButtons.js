import overload from "@jyostudio/overload";
import Component from "./component.js";
import "./radioButton.js";

const STYLES = /* css */`
:host {
    position: relative;
    vertical-align: middle;
    display: inline-grid;
    text-decoration-line: none;
    gap: var(--spacingHorizontalM);
    outline-style: none;
    color: var(--colorNeutralForeground1);
    font-size: var(--fontSizeBase200);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
    user-select: none;
}

:host(:focus-visible) {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2);
}

:host(:disabled), :host([disabled]) {
    color: var(--colorNeutralForegroundDisabled) !important;
    pointer-events: none !important;
}
`;

const HTML = /* html */`
<header></header>
<slot></slot>
`;

/**
 * 单选按钮组组件
 * @class
 * @extends {Component}
 */
export default class RadioButtons extends Component {
    /**
     * 是否支持 form 关联
     * @returns {Boolean}
     */
    static get formAssociated() {
        return true;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "header", "selected-index", "selected-item", "disabled"];
    }

    /**
     * 头部元素
     * @type {HTMLElement}
     */
    #headerEl;

    /**
     * 绑定元素
     * @type {Array<RadioButton>}
     */
    #bindEls = [];

    /**
     * 观察者
     * @type {MutationObserver}
     */
    #observer;

    /**
     * 选中事件
     * @type {Function}
     */
    #checkedBindFn;

    constructor() {
        super();

        this.#headerEl = this.shadowRoot.querySelector("header");
        this.#checkedBindFn = this.#checkedFn.bind(this);

        Object.defineProperties(this, {
            header: {
                get: () => this.#headerEl.textContent,
                set: overload([String], value => this.#headerEl.textContent = value).any(() => this.header = "")
            },
            selectedIndex: {
                get: () => Array.from(this.querySelectorAll("jyo-radio-button")).findIndex(el => el.isChecked),
                set: overload()
                    .add([String], value => {
                        this.selectedIndex = Number(value);
                    })
                    .add([Number], index => {
                        this.lock("selectedIndex", () => {
                            using el = Array.from(this.querySelectorAll("jyo-radio-button"))[index];

                            if (el) {
                                el.isChecked = true;
                                this.setAttribute("selected-index", index);
                                return;
                            }

                            this.setAttribute("selected-index", "-1");
                        });
                    })
                    .any(() => {
                        Array.from(this.querySelectorAll("jyo-radio-button")).forEach(el => el.isChecked = false);
                        this.setAttribute("selected-index", "-1");
                    })
            },
            selectedItem: {
                get: () => Array.from(this.querySelectorAll("jyo-radio-button")).find(el => el.isChecked) ?? null,
                set: overload([Object], value => {
                    using el = Array.from(this.querySelectorAll("jyo-radio-button")).find(el => el === value);

                    if (el) {
                        el.isChecked = true;
                    }
                    this.selectedIndex = this.selectedIndex;
                }).any(() => {
                    Array.from(this.querySelectorAll("jyo-radio-button")).forEach(el => el.isChecked = false);
                    this.selectedIndex = this.selectedIndex;
                })
            },
            disabled: {
                get: () => this.hasAttribute("disabled"),
                set: overload([null], () => this.#bindEls.forEach(el => el.removeAttribute("disabled")))
                    .any(() => this.#bindEls.forEach(el => el.setAttribute("disabled", "")))
            }
        });
    }

    /**
     * 状态变化时调用
     */
    #checkedFn() {
        this.selectedIndex = this.selectedIndex;
        this.dispatchCustomEvent("selectionchanged");
    }

    /**
     * 检查元素
     */
    #checkEls() {
        if (!this?.querySelectorAll) return;

        const els = Array.from(this.querySelectorAll("jyo-radio-button"));

        for (using el of els) {
            if (!this.#bindEls.includes(el)) {
                this.#bindEls.push(el);
                el.addEventListener("checked", this.#checkedBindFn);
            }
        }

        for (using el of this.#bindEls) {
            if (!els.includes(el)) {
                el.removeEventListener("checked", this.#checkedBindFn);
                this.#bindEls.splice(this.#bindEls.indexOf(el), 1);
            }
        }

        this.#bindEls.sort((a, b) => {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1;
        });

        this.selectedIndex = this.selectedIndex;
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        if (!this.#observer) {
            this.#observer = new MutationObserver(this.#checkEls);
            this.#observer.observe(this, { childList: true });
        }

        this.#checkEls();
    }

    /**
     * 元素从 DOM 树中移除时调用
     */
    disconnectedCallback(...params) {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = null;
        }

        this.#bindEls.forEach(el => el.removeEventListener("checked", this.#checkedBindFn));
        this.#bindEls.length = 0;

        super.disconnectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            name: "jyo-radio-buttons",
            html: HTML,
            css: STYLES
        });
    }
}