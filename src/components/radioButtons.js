import overload from "@jyostudio/overload";
import Component from "./component.js";
import "./radioButton.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

const STYLES = `
:host {
    position: relative;
    vertical-align: middle;
    display: inline-grid;
    text-decoration-line: none;
    gap: var(--spacingHorizontalM);
    outline-style: none;
    color: var(--colorNeutralForeground1);
    font-size: var(--fontSizeBase300);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase300);
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

const HTML = `
<header></header>
<slot></slot>
`;

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

    static [CONSTRUCTOR_SYMBOL](...params) {
        RadioButtons[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#headerEl = this.shadowRoot.querySelector("header");
            this.#checkedBindFn = this.#checkedFn.bind(this);
        });

        return RadioButtons[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            header: {
                get: () => this.#headerEl.textContent,
                set: overload([String], value => this.#headerEl.textContent = value).any(() => this.header = "")
            },
            selectedIndex: {
                get: () => {
                    const els = Array.from(this.querySelectorAll("jyo-radio-button"));
                    return els.findIndex(el => el.isChecked);
                },
                set: overload()
                    .add([String], value => {
                        this.selectedIndex = Number(value);
                    })
                    .add([Number], index => {
                        this.lock("selectedIndex", () => {
                            const els = Array.from(this.querySelectorAll("jyo-radio-button"));
                            const el = els[index];

                            if (el) {
                                el.isChecked = true;
                                this.setAttribute("selected-index", index);
                                return;
                            }

                            this.setAttribute("selected-index", "-1");
                        });
                    })
                    .any(() => {
                        const els = Array.from(this.querySelectorAll("jyo-radio-button"));
                        els.forEach(el => el.isChecked = false);
                        this.setAttribute("selected-index", "-1");
                    })
            },
            selectedItem: {
                get: () => {
                    const els = Array.from(this.querySelectorAll("jyo-radio-button"));
                    return els.find(el => el.isChecked) ?? null;
                },
                set: overload([Object], value => {
                    const els = Array.from(this.querySelectorAll("jyo-radio-button"));
                    const el = els.find(el => el === value);

                    if (el) {
                        el.isChecked = true;
                    }
                    this.selectedIndex = this.selectedIndex;
                }).any(() => {
                    const els = Array.from(this.querySelectorAll("jyo-radio-button"));
                    els.forEach(el => el.isChecked = false);
                    this.selectedIndex = this.selectedIndex;
                })
            },
            disabled: {
                get: () => this.hasAttribute("disabled"),
                set: overload([null], () => this.#bindEls.forEach(el => el.removeAttribute("disabled")))
                    .any(() => this.#bindEls.forEach(el => el.setAttribute("disabled", "")))
            }
        });

        return RadioButtons[CONSTRUCTOR_SYMBOL].apply(this, params);
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

        for (const el of els) {
            if (!this.#bindEls.includes(el)) {
                this.#bindEls.push(el);
                el.addEventListener("checked", this.#checkedBindFn);
            }
        }

        for (const el of this.#bindEls) {
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
        super.disconnectedCallback?.call(this, ...params);

        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = null;
        }

        this.#bindEls.forEach(el => el.removeEventListener("checked", this.#checkedBindFn));
        this.#bindEls = [];
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}