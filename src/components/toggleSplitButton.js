import overload from "@jyostudio/overload";
import Component from "./component.js";
import Flyout from "./flyout.js";
import { genBooleanGetterAndSetter } from "../libs/utils.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

const STYLES = `
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
    background-color: var(--colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);
    border-radius: var(--borderRadiusMedium);
    font-size: var(--fontSizeBase300);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase300);
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
    background-color: var(--colorNeutralStroke1);
}

.end {
    width: 32px;
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase200);
    vertical-align: middle;
    text-align: center;
}

:host, .fnArea, .divider {
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
}

.fnArea:hover {
    background-color: var(--colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--colorNeutralStroke1Hover);
}

.fnArea:hover:active,
:host([flyout-visible]) .fnArea.end {
    background-color: var(--colorNeutralBackground1Pressed);
    border-color: var(--colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

.fnArea:hover:active,
:host([checked][flyout-visible]) .fnArea.end {
    background-color: var(--colorNeutralBackground1Pressed);
    border-color: var(--colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

.fnArea:focus-visible {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

:host([checked]) {
    border-color: var(--colorCompoundBrandBackgroundPressed);
}

:host([checked]) .fnArea {
    background-color: var(--colorCompoundBrandBackgroundPressed);
    color: var(--colorNeutralForegroundInvertedPressed);
    border-color: var(--colorCompoundBrandBackgroundPressed);
}

:host([checked]) .fnArea:hover {
    border-color: var(--colorCompoundBrandBackgroundHover);
    background-color: var(--colorCompoundBrandBackgroundHover);
}

:host([checked]) .fnArea:hover:active,
:host([checked][flyout-visible]) .fnArea.end {
    border-color: var(--colorCompoundBrandBackgroundPressed);
    background-color: var(--colorCompoundBrandBackgroundPressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

:host([checked]) .divider {
    background-color: var(--colorNeutralForegroundInvertedPressed);
}

:host(:focus-visible) {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

:host(:disabled), :host([disabled]) {
    background-color: var(--colorNeutralBackgroundDisabled) !important;
    border-color: var(--colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}

:host(:disabled[checked]), :host([disabled][checked]) {
    border-color: transparent !important;
}
`;

const HTML = `
<div class="fnArea start" tabindex="0">
    <span>
        <slot></slot>
    </span>
</div>
<div class="divider"></div>
<div class="fnArea end" tabindex="0">
    <span>\ue40c</span>
    <slot name="flyout"></slot>
</div>
`;

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

    static [CONSTRUCTOR_SYMBOL](...params) {
        ToggleSplitButton[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#startEl = this.shadow.querySelector(".start");
            this.#endEl = this.shadow.querySelector(".end");
        });

        return ToggleSplitButton[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            checked: genBooleanGetterAndSetter(this, { attrName: "checked" })
        });

        return ToggleSplitButton[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.#startEl.addEventListener("click", () => {
            this.shadow.host.toggleAttribute("checked");
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

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}