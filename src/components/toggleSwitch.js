import overload from "@jyostudio/overload";
import themeManager from "../libs/themeManager/themeManager.js";
import { genBooleanGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";

const STYLES = /* css */`
:host {
    position: relative;
    vertical-align: middle;
    display: inline-block;
    text-decoration-line: none;
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
    contain: paint;
    overflow: hidden;
}

:host([header]) header {
    margin-bottom: var(--spacingVerticalXS);
}

#switch {
    appearance: none;
    display: inline-flex;
    box-sizing: border-box;
    align-items: center;
    flex-direction: row;
    outline: none;
    user-select: none;
    contain: content;
    vertical-align: middle;
    padding: 0 var(--spacingHorizontalXXS);
    margin: 0;
    width: 40px;
    height: 20px;
    background-color: var(--colorTransparentBackground);
    border: 1px solid var(--colorNeutralStrokeAccessible);
    border-radius: var(--borderRadiusCircular);
}

#switch::after {
    content: "";
    position: relative;
    display: inline-block;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    margin-inline-start: 0px;
    background-color: var(--colorNeutralForeground3);
    transition-duration: var(--durationNormal);
    transition-timing-function: var(--curveEasyEase);
    transition-property: margin-inline-start;
}

#switch:hover {
    background: none;
    border-color: var(--colorNeutralStrokeAccessibleHover);
}

#switch:hover::after {
    background-color: var(--colorNeutralForeground3Hover);
}

#switch:active {
    border-color: var(--colorNeutralStrokeAccessiblePressed);
}

#switch:active::after {
    background-color: var(--colorNeutralForeground3Pressed);
}

#switch[theme="highContrast"]:hover::after,
#switch[theme="highContrast"]:active::after {
    background-color: var(--colorNeutralForeground3);
}

#switch[theme="highContrast"]:checked::after {
    background-color: var(--colorNeutralForegroundInverted);
}

#switch:checked {
    background: var(--colorCompoundBrandBackground);
    border-color: var(--colorCompoundBrandBackground);
}

#switch:checked::after {
    background-color: var(--colorNeutralForegroundInverted);
    margin-inline-start: calc(100% - 14px);
}

#switch:checked:hover {
    background: var(--colorCompoundBrandBackgroundHover);
    border-color: var(--colorCompoundBrandBackgroundHover);
}

#switch:checked:hover::after {
    background: var(--colorNeutralForegroundInvertedHover);
}

#switch:checked:active {
    background: var(--colorCompoundBrandBackgroundPressed);
    border-color: var(--colorCompoundBrandBackgroundPressed);
}

#switch:checked:active::after {
    background: var(--colorNeutralForegroundInvertedPressed);
}

:host([disabled]) #switch {
    border: 1px solid var(--colorNeutralStrokeDisabled);
}

:host([disabled]) #switch::after {
    background: var(--colorNeutralForegroundDisabled);
}

:host([disabled]) #switch:checked {
    background: var(--colorNeutralBackgroundDisabled) !important;
    border-color: var(--colorNeutralStrokeDisabled) !important;
}

:host([disabled]) #switch:checked::after {
    background: var(--colorNeutralForegroundDisabled) !important;
}

#switch:focus-visible {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

.lblOn, .lblOff {
    vertical-align: middle;
}

:host([content-on]) .lblOn {
    margin-inline-start: var(--spacingHorizontalXS);
}

:host([content-off]) .lblOff {
    margin-inline-start: var(--spacingHorizontalXS);
}

:host([is-on]) .lblOn {
    display: inline-block;
}

:host([is-on]) .lblOff {
    display: none;
}

:host(:not([is-on])) .lblOn {
    display: none;
}

:host(:not([is-on])) .lblOff {
    display: inline-block;
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
<div>
    <input id="switch" type="checkbox" />
    <label class="lblOn" for="switch"></label>
    <label class="lblOff" for="switch"></label>
</div>
`;

/**
 * 开关组件
 * @class
 * @extends {Component}
 */
export default class ToggleSwitch extends Component {
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
        return [...super.observedAttributes, "header", "content-off", "content-on", "is-on"];
    }

    /**
     * 头部元素
     * @type {HTMLElement}
     */
    #headerEl;

    /**
     * 开启内容元素
     * @type {HTMLElement}
     */
    #lblOnEl;

    /**
     * 关闭内容元素
     * @type {HTMLElement}
     */
    #lblOffEl;

    /**
     * 开关元素
     * @type {HTMLElement}
     */
    #switchEl;

    constructor() {
        super();

        this.#headerEl = this.shadowRoot.querySelector("header");
        this.#lblOnEl = this.shadowRoot.querySelector(".lblOn");
        this.#lblOffEl = this.shadowRoot.querySelector(".lblOff");
        this.#switchEl = this.shadowRoot.querySelector("#switch");

        Object.defineProperties(this, {
            header: {
                get: () => this.#headerEl.textContent,
                set: overload([String], value => {
                    this.lock("header", () => {
                        this.#headerEl.textContent = value;
                        this.setAttribute("header", value);
                    });
                }).any(() => this.header = "")
            },
            contentOff: {
                get: () => this.#lblOffEl.textContent,
                set: overload([String], value => {
                    this.lock("contentOff", () => {
                        this.#lblOffEl.textContent = value;
                        this.setAttribute("content-off", value);
                    });
                }).any(() => this.contentOff = "")
            },
            contentOn: {
                get: () => this.#lblOnEl.textContent,
                set: overload([String], value => {
                    this.lock("contentOn", () => {
                        this.#lblOnEl.textContent = value;
                        this.setAttribute("content-on", value);
                    });
                }).any(() => this.contentOn = "")
            },
            isOn: genBooleanGetterAndSetter(this, {
                attrName: "isOn",
                fn: (domAttrName, val) => {
                    this.#switchEl.checked = val;
                }
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.#switchEl.addEventListener("change", () => {
            this.isOn = this.#switchEl.checked;
        }, { signal });

        themeManager.addEventListener("update", () => this.#checkThemeConfig(), { signal });
    }

    /**
     * 检查主题配置
     */
    #checkThemeConfig() {
        this.#switchEl.setAttribute("theme", themeManager.currentTheme.valString);
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();

        this.#checkThemeConfig();
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}