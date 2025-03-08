import overload from "@jyostudio/overload";
import Component from "./component.js";
import { genBooleanGetterAndSetter } from "../libs/utils.js";

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
    --size: 18px;
    display: inline-block;
    background-color: var(--mix-colorNeutralBackground1);
    border-radius: var(--borderRadiusSmall);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStrokeAccessible);
    color: var(--colorNeutralForegroundInverted);
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase200);
    box-sizing: border-box;
    position: relative;
    text-align: center;
    width: var(--size);
    height: var(--size);
    line-height: var(--size);
    aspect-ratio: 1 / 1;
    vertical-align: middle;
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
}

label {
    display: none;
    vertical-align: middle;
    margin-inline-start: var(--spacingHorizontalXS);
}

:host([content]) label {
    display: inline-block;
}

:host(:hover) span {
    border-color: var(--colorNeutralStrokeAccessibleHover);
}

:host(:active) span {
    border-color: var(--colorNeutralStrokeAccessiblePressed);
}

:host([is-checked]) span {
    border-color: var(--colorCompoundBrandStroke);
    background-color: var(--colorCompoundBrandBackground);
}

:host([is-checked]:hover) span {
    background-color: var(--colorCompoundBrandBackgroundHover);
    border-color: var(--colorCompoundBrandStrokeHover);
}

:host([is-checked]:active) span {
    background-color: var(--colorCompoundBrandBackgroundPressed);
    border-color: var(--colorCompoundBrandStrokePressed);
}

:host(:disabled), :host([disabled]) {
    color: var(--colorNeutralForegroundDisabled) !important;
    pointer-events: none !important;
}

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2);
}

:host(:disabled) span, :host([disabled]) span {
    background-color: var(--mix-colorNeutralBackgroundDisabled);
    border-color: var(--mix-colorNeutralStrokeDisabled);
    color: var(--colorNeutralStrokeDisabled);
}
`;

const HTML = `
<span></span>
<label></label>
`;

export default class CheckBox extends Component {
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
        return [...super.observedAttributes, "content", "is-three-state", "is-checked"];
    }

    /**
     * 开关元素
     * @type {HTMLElement}
     */
    #spanEl;

    /**
     * 标签元素
     * @type {HTMLElement}
     */
    #labelEl;

    constructor() {
        super();

        this.#spanEl = this.shadowRoot.querySelector("span");
        this.#labelEl = this.shadowRoot.querySelector("label");

        Object.defineProperties(this, {
            content: {
                get: () => this.#labelEl.textContent,
                set: overload([String], value => {
                    this.lock("content", () => {
                        this.#labelEl.textContent = value;
                        this.setAttribute("content", value);
                    });
                }).any(() => this.content = "")
            },
            isThreeState: genBooleanGetterAndSetter(this, {
                attrName: "is-three-state",
                fn: () => {
                    if (this.isChecked === null) this.isChecked = true;
                }
            }),
            isChecked: {
                get: () => {
                    if (this.hasAttribute("is-checked")) {
                        if (this.getAttribute("is-checked") === "null") return null;
                        return true;
                    }
                    return false;
                },
                set: overload()
                    .add([Boolean], value => this.isChecked = value ? "true" : "false")
                    .add([String], value => {
                        if (value === "null") {
                            if (this.isChecked !== null) {
                                this.setAttribute("is-checked", "null");
                                this.dispatchCustomEvent("indeterminate");
                            }
                            this.#spanEl.textContent = "\uef91";
                        } else if (value === "true") {
                            if (this.isChecked !== true) {
                                this.setAttribute("is-checked", "true");
                                this.dispatchCustomEvent("checked");
                            }
                            this.#spanEl.textContent = "\ue3e8";
                        } else {
                            if (this.isChecked !== false) {
                                this.removeAttribute("is-checked");
                                this.dispatchCustomEvent("unchecked");
                            }
                            this.#spanEl.innerHTML = "";
                        }
                    })
                    .any(() => this.isChecked = false)
            }
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("click", () => {
            if (this.isThreeState) {
                this.isChecked = this.isChecked === null ? "false" : this.isChecked === true ? "null" : "true";
            } else {
                this.isChecked = !this.isChecked;
            }
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        this.#initEvents();

        super.connectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}