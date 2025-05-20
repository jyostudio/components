import "./button.js";
import Component from "./component.js";
import Flyout from "./flyout.js";

const STYLES = /* css */`
:host {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    justify-content: center;
    contain: paint;
    overflow: hidden;
    min-width: 32px;
    min-height: 32px;
    padding: 0 var(--spacingHorizontalM);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom-color: var(--mix-colorNeutralStroke1Hover);
    border-radius: var(--borderRadiusMedium);
    outline-style: none;
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    text-align: center;
    text-decoration-line: none;
    color: var(--colorNeutralForeground1);
    background-color: var(--mix-colorNeutralBackground1);
    transition: background-color var(--durationFaster) var(--curveEasyEase),
                border-color var(--durationFaster) var(--curveEasyEase),
                color var(--durationFaster) var(--curveEasyEase);
    user-select: none;
}

.dropdown {
    margin-inline-start: 8px;
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
    vertical-align: middle;
}

:host(:hover) {
    background-color: var(--mix-colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
}

:host(:hover:active),
:host([flyout-visible]) {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
}

:host(:disabled),
:host([disabled]) {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = /* html */`
<slot>Button</slot>
<span class="dropdown">\ue40c</span>
<slot name="flyout"></slot>
`;

/**
 * 下拉按钮组件
 * @class
 * @extends {Component}
 */
export default class DropDownButton extends Component {
    /**
     * 飞出菜单定位
     * @type {Flyout.Positioning}
     */
    get flyoutPositioning() {
        return Flyout.Positioning.belowStart;
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        Flyout.slotBinding(this);
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
            name: "jyo-drop-down-button",
            html: HTML,
            css: STYLES
        });
    }
}