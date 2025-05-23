import { genBooleanGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import Flyout from "./flyout.js";

const STYLES = /* css */`
:host {
    position: relative;
    vertical-align: middle;
    display: inline-grid;
    grid-template-columns: auto 1px 32px;
    align-items: center;
    justify-content: center;
    text-decoration-line: none;
    text-align: center;
    min-width: 32px;
    min-height: 32px;
    outline-style: none;
    background-color: var(--mix-colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom-color: var(--mix-colorNeutralStroke1Hover);
    border-radius: var(--borderRadiusMedium);
    font-size: var(--fontSizeBase200);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    user-select: none;
    contain: paint;
    overflow: hidden;
}

.fnArea {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.start {
    min-width: 32px;
    padding: 0 var(--spacingHorizontalSNudge);
}

.divider {
    width: var(--strokeWidthThin);
    height: 100%;
    background-color: var(--mix-colorNeutralStroke1);
}

.end {
    width: 32px;
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
    vertical-align: middle;
    text-align: center;
}

:host, .fnArea, .divider {
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
}

.fnArea:hover {
    background-color: var(--mix-colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
}

.fnArea:hover:active,
:host([flyout-visible]) .fnArea.end {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

.fnArea:hover:active,
:host([checked][flyout-visible]) .fnArea.end {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

:host([checked]) {
    border-color: var(--mix-colorCompoundBrandBackgroundPressed);
}

:host([checked]) .fnArea {
    background-color: var(--colorCompoundBrandBackgroundPressed);
    color: var(--colorNeutralForegroundInvertedPressed);
    border-color: var(--mix-colorCompoundBrandBackgroundPressed);
}

:host([checked]) .fnArea:hover {
    border-color: var(--mix-colorCompoundBrandBackgroundHover);
    background-color: var(--colorCompoundBrandBackgroundHover);
}

:host([checked]) .fnArea:hover:active,
:host([checked][flyout-visible]) .fnArea.end {
    border-color: var(--mix-colorCompoundBrandBackgroundPressed);
    background-color: var(--colorCompoundBrandBackgroundPressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

:host([checked]) .divider {
    background-color: var(--mix-colorNeutralForegroundInvertedPressed);
}

:host(:disabled), :host([disabled]) {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}

:host(:disabled[checked]), :host([disabled][checked]) {
    border-color: transparent !important;
}
`;

const HTML = /* html */`
<div class="fnArea start">
    <span>
        <slot></slot>
    </span>
</div>
<div class="divider"></div>
<div class="fnArea end">
    <span>\ue40c</span>
    <slot name="flyout"></slot>
</div>
`;

/**
 * 可切换的分割按钮组件
 * @class
 * @extends {Component}
 */
export default class ToggleSplitButton extends Component {
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
        return [...super.observedAttributes, "checked"];
    }

    /**
     * 开始元素
     * @type {HTMLElement}
     */
    #startEl;

    /**
     * 结束元素
     * @type {HTMLElement}
     */
    #endEl;

    /**
     * 飞出菜单定位
     * @type {Flyout.Positioning}
     */
    get flyoutPositioning() {
        return Flyout.Positioning.belowStart;
    }

    constructor() {
        super();

        this.#startEl = this.shadowRoot.querySelector(".start");
        this.#endEl = this.shadowRoot.querySelector(".end");

        Object.defineProperties(this, {
            checked: genBooleanGetterAndSetter(this, { attrName: "checked" })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.#startEl.addEventListener("click", () => {
            this.shadowRoot.host.toggleAttribute("checked");
        }, { signal });

        this.#endEl.addEventListener("click", (e) => {
            e.stopPropagation();
        }, { signal });

        [this.#startEl, this.#endEl].forEach(el => {
            el.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") {
                    el.click();
                }
            }, { signal });
        });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();

        Flyout.slotBinding(this, this.#endEl);
    }

    /**
     * 元素从 DOM 中删除时调用
     */
    disconnectedCallback(...params) {
        Flyout.slotBinding(this, null);

        super.disconnectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            name: "jyo-toggle-split-button",
            html: HTML,
            css: STYLES
        });
    }
}