import overload from "@jyostudio/overload";
import Component from "./component.js";
import themeManager from "../libs/themeManager/themeManager.js";
import { genBooleanGetterAndSetter } from "../libs/utils.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

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

:host([theme="light"]) {
    .input-wrapper:has(input:focus) {
        background-color: var(--mix-colorNeutralBackground1);
    }
}

input {
    flex: 1;
    width: 100%;
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
</div>
`;

export default class TextBox extends Component {
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
        return [...super.observedAttributes, "value", "placeholder", "disabled", "readonly", "maxlength"];
    }

    #inputWrapper;

    /**
     * 输入框元素
     * @type {HTMLInputElement}
     */
    #inputEl;

    static [CONSTRUCTOR_SYMBOL](...params) {
        TextBox[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#inputWrapper = this.shadow.querySelector(".input-wrapper");
            this.#inputEl = this.shadow.querySelector("input");
        });

        return TextBox[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            value: {
                get: () => this.#inputEl.value,
                set: overload([String], value => {
                    this.lock("value", () => {
                        this.#inputEl.value = value;
                        this.setAttribute("value", value);
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
            }
        });

        return TextBox[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 检查主题配置
     */
    #checkThemeConfig() {
        this.setAttribute("theme", themeManager.currentTheme.valString);
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.#inputWrapper.addEventListener("click", () => this.#inputEl.focus(), { signal });

        // 输入事件处理
        this.#inputEl.addEventListener("input", () => {
            this.value = this.#inputEl.value;
            this.dispatchCustomEvent("input");
        }, { signal });

        // 失焦事件处理
        this.#inputEl.addEventListener("change", () => {
            this.dispatchCustomEvent("change");
        }, { signal });

        themeManager.addEventListener("update", () => this.#checkThemeConfig(), { signal });
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