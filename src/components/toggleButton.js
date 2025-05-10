import { genBooleanGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";

const STYLES = /* css */`
:host {
    position: relative;
    vertical-align: middle;
    display: inline-flex;
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
    padding: 0 var(--spacingHorizontalM);
    border-radius: var(--borderRadiusMedium);
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

:host(:hover) {
    background-color: var(--mix-colorNeutralBackground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
    color: var(--colorNeutralForeground1Hover);
}

:host(:hover:active) {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

:host([checked]) {
    background-color: var(--colorCompoundBrandBackgroundPressed);
    border-color: var(--mix-colorCompoundBrandBackgroundPressed);
    color: var(--colorNeutralForegroundInvertedPressed);
}

:host([checked]:hover) {
    background-color: var(--colorCompoundBrandBackgroundHover);
    border-color: var(--mix-colorCompoundBrandBackgroundHover);
}

:host([checked]:hover:active) {
    background-color: var(--colorCompoundBrandBackgroundPressed);
    border-color: var(--mix-colorCompoundBrandBackgroundPressed);
}

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
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
<slot>Button</slot>
`;

/**
 * 开关按钮组件
 * @class
 * @extends {Component}
 */
export default class ToggleButton extends Component {
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

    constructor() {
        super();

        Object.defineProperties(this, {
            checked: genBooleanGetterAndSetter(this, { attrName: "checked" })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.shadowRoot.host.addEventListener("click", () => {
            this.shadowRoot.host.toggleAttribute("checked");
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
            html: HTML,
            css: STYLES
        });
    }
}