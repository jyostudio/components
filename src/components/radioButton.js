import overload from "@jyostudio/overload";
import Component from "./component.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

const STYLES = `
:host {
    position: relative;
    vertical-align: middle;
    display: inline-block;
    text-decoration-line: none;
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
    contain: paint;
    overflow: hidden;
}

span {
    --size: 20px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: var(--size);
    height: var(--size);
    border-radius: var(--borderRadiusCircular);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStrokeAccessible);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
}

span::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1 / 1;
    border-radius: var(--borderRadiusCircular);
    color: var(--colorNeutralForegroundInverted);
    width: calc(var(--size)* 0.5);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color, width, height;
    transition-timing-function: var(--curveEasyEase);
}

:host(:hover) span {
    border-color: var(--mix-colorNeutralStrokeAccessibleHover);
}

:host([is-checked]) span {
    background-color: var(--colorCompoundBrandBackground);
    border-color: var(--mix-colorCompoundBrandBackground);
}

:host([is-checked]) span::before {
    background-color: var(--colorNeutralForegroundInverted);
}

:host([is-checked]:hover) span::before {
    width: calc(var(--size)* 0.6);
}

:host([is-checked]:active) span::before {
    width: calc(var(--size)* 0.5);
}

label {
    display: inline-block;
    vertical-align: middle;
    margin-inline-start: var(--spacingHorizontalXS);
}

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2);
}

:host(:disabled), :host([disabled]) {
    color: var(--mix-colorNeutralForegroundDisabled) !important;
    pointer-events: none !important;
}

:host(:not([is-checked]):disabled) span, :host(:not([is-checked])[disabled]) span {
    background-color: unset !important;
    border-color: var(--mix-colorNeutralForegroundDisabled) !important;
}

:host([is-checked]:disabled) span, :host([is-checked][disabled]) span {
    background-color: var(--mix-colorNeutralForegroundDisabled) !important;
    border-color: var(--mix-colorNeutralForegroundDisabled) !important;
}

:host([is-checked]:disabled) span::before, :host([is-checked][disabled]) span::before {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralBackgroundDisabled) !important;
}
`;

const HTML = `
    <span></span>
    <label></label>
`;

export default class RadioButton extends Component {
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
        return [...super.observedAttributes, "value", "content", "is-checked"];
    }

    /**
     * 标签元素
     * @type {HTMLElement}
     */
    #labelEl;

    /**
     * 值
     * @type {String?}
     */
    #value = null;

    static [CONSTRUCTOR_SYMBOL](...params) {
        RadioButton[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#labelEl = this.shadow.querySelector("label");
        });

        return RadioButton[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            value: {
                get: () => this.#value,
                set: overload([String], value => {
                    this.lock("value", () => {
                        this.#value = value;
                        this.setAttribute("value", value);
                    });
                }).any(() => this.value = "")
            },
            content: {
                get: () => this.#labelEl.textContent,
                set: overload([String], value => {
                    this.lock("content", () => {
                        this.#labelEl.textContent = value;
                        this.setAttribute("content", value);
                    });
                }).any(() => this.content = "")
            },
            isChecked: {
                get: () => this.hasAttribute("is-checked"),
                set: overload()
                    .add([Boolean], value => {
                        if (value) {
                            if (!this.isChecked) {
                                this.parentElement.querySelectorAll("jyo-radio-button").forEach(radioButton => {
                                    radioButton.isChecked = false;
                                });
                                this.setAttribute("is-checked", "");
                                this.dispatchCustomEvent("checked");
                            }
                        } else {
                            this.removeAttribute("is-checked");
                        }
                    })
                    .add([Number], value => this.isChecked = !!value)
                    .add([String], () => this.isChecked = true)
                    .any(() => this.isChecked = false)
            }
        });

        return RadioButton[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.addEventListener("click", () => {
            this.isChecked = true;
        }, { signal: this.abortController.signal });
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}