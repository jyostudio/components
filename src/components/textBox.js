import overload from "@jyostudio/overload";
import Enum from "@jyostudio/enum";
import Component from "./component.js";
import themeManager from "../libs/themeManager/themeManager.js";
import "./hyperlinkButton.js";
import { genBooleanGetterAndSetter, genEnumGetterAndSetter } from "../libs/utils.js";

/**
 * 输入框模式
 * @extends {Enum}
 */
class Mode extends Enum {
    static {
        this.set({
            text: 0,
            email: 1,
            url: 2,
            tel: 3,
            search: 4
        });
    }
}

const STYLES = `
:host {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    min-width: 120px;
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase300);
    color: var(--colorNeutralForeground1);
    contain: paint;
    outline: none;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 32px;
    background-color: var(--mix-colorNeutralBackground1);
    border: 1px solid var(--mix-colorNeutralStroke2);
    border-bottom: 2px solid var(--mix-colorNeutralStroke1);
    border-radius: var(--borderRadiusMedium);
    transition: all var(--durationFaster) var(--curveEasyEase);
    padding: var(--spacingVerticalXS) var(--spacingHorizontalSNudge);
}

.input-wrapper:hover {
    background-color: var(--mix-colorNeutralBackground1Hover);
}

.input-wrapper:has(input:focus) {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-bottom-color: var(--colorCompoundBrandBackground);
}

.input-wrapper[theme="light"]:has(input:focus) {
    background-color: var(--mix-colorNeutralBackground1);
}

input {
    flex: 1;
    max-width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    color: inherit;
    font: inherit;
    padding: 0;
    margin: 0;
    cursor: text;
}

input::placeholder {
    color: var(--colorNeutralForeground3);
    opacity: 1;
}

.end {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.end .search,
.end .close {
    position: relative;
    display: none;
    width: 16px;
    height: 20px;
    min-width: auto;
    min-height: auto;
    font-family: "FluentSystemIcons-Resizable";
    margin-inline-start: var(--spacingHorizontalXS);
    color: var(--colorNeutralForeground2);
}

:host([disabled]) .input-wrapper {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}

:host([disabled]) input {
    color: var(--colorNeutralForegroundDisabled);
    cursor: not-allowed;
}

:host([readonly]) .input-wrapper {
    background-color: var(--colorNeutralBackground2);
    border-color: var(--colorNeutralStroke2);
}
`;

const HTML = `
<div class="input-wrapper">
    <input type="text" autocomplete="off" />
    <div class="end">
        <jyo-hyperlink-button class="search">\uee11</jyo-hyperlink-button>
        <jyo-hyperlink-button class="close">\ue5fd</jyo-hyperlink-button>
    </div>
</div>
`;

export default class TextBox extends Component {
    /**
     * 输入框模式
     * @returns {Mode}
     */
    static get Mode() {
        return Mode;
    }

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
        return [...super.observedAttributes, "value", "placeholder", "disabled", "readonly", "maxlength", "mode"];
    }

    /**
     * 输入框包装元素
     * @type {HTMLElement}
     */
    #inputWrapper;

    /**
     * 输入框元素
     * @type {HTMLInputElement}
     */
    #inputEl;

    /**
     * 搜索元素
     * @type {HTMLElement}
     */
    #searchEl;

    /**
     * 关闭元素
     * @type {HTMLElement}
     */
    #closeEl;

    constructor() {
        super();

        this.#inputWrapper = this.shadowRoot.querySelector(".input-wrapper");
        this.#inputEl = this.shadowRoot.querySelector("input");
        this.#searchEl = this.shadowRoot.querySelector(".search");
        this.#closeEl = this.shadowRoot.querySelector(".close");

        Object.defineProperties(this, {
            value: {
                get: () => this.#inputEl.value,
                set: overload([String], value => {
                    this.lock("value", () => {
                        this.#inputEl.value = value;
                        this.setAttribute("value", value);
                        this.#checkShowSearch();
                    });
                }).any(() => this.value = "")
            },
            placeholder: {
                get: () => this.#inputEl.placeholder,
                set: overload([String], value => {
                    this.lock("placeholder", () => {
                        this.#inputEl.placeholder = value;
                        this.setAttribute("placeholder", value);
                    });
                }).any(() => this.placeholder = "")
            },
            readonly: genBooleanGetterAndSetter(this, {
                attrName: "readonly", defaultValue: false, fn: (attrName, value) => {
                    if (value) {
                        this.#inputEl.setAttribute("readonly", "");
                    } else {
                        this.#inputEl.removeAttribute("readonly");
                    }
                }
            }),
            maxlength: {
                get: () => this.#inputEl.maxLength,
                set: overload()
                    .add([Number], value => {
                        this.lock("maxlength", () => {
                            if (value < 0) {
                                this.#inputEl.removeAttribute("maxlength");
                                this.removeAttribute("maxlength");
                            } else {
                                this.#inputEl.maxLength = value;
                                this.setAttribute("maxlength", value);
                            }
                        });
                    })
                    .add([String], value => {
                        value = parseInt(value);
                        if (isNaN(value)) value = -1;
                        this.maxlength = value;
                    })
                    .any(() => this.maxlength = -1)
            },
            mode: genEnumGetterAndSetter(this, {
                attrName: "mode",
                enumClass: Mode,
                defaultValue: "text",
                fn: () => {
                    this.#inputEl.type = this.mode.valString;
                    this.#inputEl.inputMode = this.mode.valString;
                    this.#checkShowSearch();
                }
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        // 输入框包装元素点击事件处理
        this.#inputWrapper.addEventListener("click", () => this.#inputEl.focus(), { signal });

        // 输入事件处理
        this.#inputEl.addEventListener("input", () => {
            this.value = this.#inputEl.value;
            if (this.#inputEl.offsetWidth < this.#inputEl.scrollWidth) {
                this.#closeEl.style.display = "inline-flex";
            } else {
                this.#closeEl.style.display = "none";
            }
            this.dispatchCustomEvent("input");
        }, { signal });

        // 关闭按钮按下事件处理
        this.#closeEl.addEventListener("pointerdown", e => {
            e.preventDefault();
            this.#inputEl.focus();
        }, { signal });

        // 搜索按钮按下事件处理
        this.#searchEl.addEventListener("pointerdown", e => {
            e.preventDefault();
            this.#inputEl.focus();
        }, { signal });

        // 搜索按钮点击事件处理
        this.#searchEl.addEventListener("click", () => {
            this.dispatchCustomEvent("search", { detail: this.value });
        }, { signal });

        // 关闭按钮点击事件处理
        this.#closeEl.addEventListener("click", () => {
            this.value = "";
            this.#closeEl.style.display = "none";
            this.dispatchCustomEvent("clear");
        }, { signal });

        // 主题变更事件处理
        themeManager.addEventListener("update", () => this.#checkThemeConfig(), { signal });
    }

    /**
     * 检查是否显示搜索按钮
     */
    #checkShowSearch() {
        this.#searchEl.style.display = this.mode === Mode.search && this.value.length ? "inline-flex" : "none";
    }

    /**
     * 检查主题配置
     */
    #checkThemeConfig() {
        this.#inputWrapper.setAttribute("theme", themeManager.currentTheme.valString);
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        this.#initEvents();

        this.#checkThemeConfig();

        super.connectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}