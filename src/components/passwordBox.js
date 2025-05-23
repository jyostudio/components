import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import themeManager from "../libs/themeManager/themeManager.js";
import { genBooleanGetterAndSetter, genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import "./hyperlinkButton.js";

/**
 * 密码显示行为
 * @extends {Enum}
 */
class PasswordRevealMode extends Enum {
    static {
        this.set({
            peed: 0, // 密码显示按钮可见，密码始终被掩盖
            hidden: 1, // 密码显示按钮不可见，密码始终被掩盖
            visible: 2 // 密码显示按钮不可见，密码不会被掩盖
        });
    }
}

const STYLES = /* css */`
:host {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    min-width: 120px;
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
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
    max-width: calc(100% - 40px);
    height: 100%;
    border: none;
    outline: none;
    background: none;
    color: inherit;
    font: inherit;
    padding: 0;
    margin: 0;
    cursor: text;
    ime-mode: disabled !important;
}

input::-ms-reveal,
input::-ms-clear {
    display: none;
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

.end .visible {
    position: relative;
    display: none;
    width: 16px;
    height: 20px;
    min-width: fit-content;
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

const HTML = /* html */`
<div class="input-wrapper">
    <input type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false" inputmode="none" />
    <div class="end">
        <jyo-hyperlink-button class="visible">\ue795</jyo-hyperlink-button>
    </div>
</div>
`;

/**
 * 密码输入框组件
 * @class
 * @extends {Component}
 */
export default class PasswordBox extends Component {
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
        return [...super.observedAttributes, "value", "placeholder", "disabled", "readonly", "maxlength", "password-reveal-mode", "disable-function"];
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
     * 显示密码按钮元素
     * @type {HTMLElement}
     */
    #visibleEl;

    /**
     * 是否显示密码
     * @type {Boolean}
     */
    #isVisiblePassword = false;

    constructor() {
        super();

        this.#inputWrapper = this.shadowRoot.querySelector(".input-wrapper");
        this.#inputEl = this.shadowRoot.querySelector("input");
        this.#visibleEl = this.shadowRoot.querySelector(".visible");

        Object.defineProperties(this, {
            value: {
                get: () => this.#inputEl.value,
                set: overload([String], value => {
                    this.lock("value", () => {
                        this.#inputEl.value = value;
                        this.#handleInput();
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
            passwordRevealMode: genEnumGetterAndSetter(this, {
                attrName: "passwordRevealMode",
                enumClass: PasswordRevealMode,
                defaultValue: "peed",
                fn: () => this.#handleInput()
            }),
            disableFunction: genBooleanGetterAndSetter(this, { attrName: "disableFunction", defaultValue: false, fn: () => this.#handleInput() }),
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        // 输入框包装元素点击事件处理
        this.#inputWrapper.addEventListener("click", () => this.#inputEl.focus(), { signal });

        this.#inputEl.addEventListener("compositionstart", e => {
            e.preventDefault();
            e.stopPropagation();
        }, { signal });

        this.#inputEl.addEventListener("compositionupdate", e => {
            e.preventDefault();
            e.stopPropagation();
        }, { signal });

        // 输入事件处理
        this.#inputEl.addEventListener("input", () => {
            this.#handleInput();
            this.dispatchCustomEvent("input");
        }, { signal });

        // 密码显示按钮事件处理
        this.#visibleEl.addEventListener("pointerdown", e => {
            e.preventDefault();
            this.#isVisiblePassword = true;
            this.#handleInput();
        }, { signal });

        ["pointerup", "pointerleave", "pointercancel"].forEach(eventName => {
            this.#visibleEl.addEventListener(eventName, () => {
                this.#isVisiblePassword = false;
                this.#handleInput();
            }, { signal });
        });

        // 主题变更事件处理
        themeManager.addEventListener("update", () => this.#checkThemeConfig(), { signal });
    }

    /**
     * 检查主题配置
     */
    #checkThemeConfig() {
        this.#inputWrapper.setAttribute("theme", themeManager.currentTheme.valString);
    }

    /**
     * 处理输入显示
     */
    #handleInput() {
        const revealMode = this.passwordRevealMode;
        if (revealMode === PasswordRevealMode.peed) {
            const needShow = this.#inputEl.value.length > 0;
            this.#visibleEl.style.display = needShow ? 'inline-flex' : 'none';
            this.#inputEl.style.maxWidth = needShow ? "calc(100% - 40px)" : "100%";
        } else if (revealMode === PasswordRevealMode.hidden) {
            this.#visibleEl.style.display = 'none';
            this.#inputEl.style.maxWidth = "100%";
            this.#isVisiblePassword = false;
        } else if (revealMode === PasswordRevealMode.visible) {
            this.#visibleEl.style.display = 'none';
            this.#inputEl.style.maxWidth = "100%";
            this.#isVisiblePassword = true;
        }

        if (this.disableFunction) {
            this.#visibleEl.style.display = 'none';
            this.#inputEl.style.maxWidth = "100%";
        }

        if (this.#isVisiblePassword) {
            this.#inputEl.type = "text";
        } else {
            this.#inputEl.type = "password";
        }

        requestAnimationFrame(() => {
            this.#inputEl.setSelectionRange(this.#inputEl.value.length, this.#inputEl.value.length);
        });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();
        this.#checkThemeConfig();
        this.#handleInput();
    }

    static {
        this.registerComponent({
            name: "jyo-password-box",
            html: HTML,
            css: STYLES
        });
    }
}