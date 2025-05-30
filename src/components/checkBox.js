import overload from "@jyostudio/overload";
import { genBooleanGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";

const STYLES = /* css */`
:host {
    --size: 18px;
    position: relative;
    min-width: var(--size);
    min-height: var(--size);
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
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

span {
    display: inline-block;
    background-color: var(--mix-colorNeutralBackground1);
    border-radius: var(--borderRadiusSmall);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStrokeAccessible);
    color: var(--colorNeutralForegroundInverted);
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
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
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
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

:host(:disabled) span, :host([disabled]) span {
    background-color: var(--mix-colorNeutralBackgroundDisabled);
    border-color: var(--mix-colorNeutralStrokeDisabled);
    color: var(--colorNeutralStrokeDisabled);
}
`;

const HTML = /* html */`
<span></span>
<label></label>
`;

/**
 * 复选框组件
 * @class
 * @extends {Component}
 */
export default class CheckBox extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "content", "is-three-state", "is-checked"];
    }

    /**
     * 是否支持 form 关联
     * @returns {Boolean}
     */
    static get formAssociated() {
        return true;
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
                attrName: "isThreeState",
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
                        this.lock("isChecked", () => {
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
                        });
                    })
                    .add([null], () => this.isChecked = "null")
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
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();
    }

    static {
        this.registerComponent({
            name: "jyo-check-box",
            html: HTML,
            css: STYLES
        });
    }
}