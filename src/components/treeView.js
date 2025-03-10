import Enum from "@jyostudio/enum";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import "./treeViewItem.js";

// TODO

const STYLES = `
:host {
    position: relative;
    display: block;
    min-width: 200px;
    width: fit-content;
    min-height: 100px;
    background-color: var(--mix-colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom: var(--strokeWidthThick) solid var(--mix-colorNeutralStroke1Hover);
    padding: var(--spacingVerticalM) var(--spacingHorizontalXS);
    font-size: var(--fontSizeBase300);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase300);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
    user-select: none;
    overflow-y: auto;
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
`;

const HTML = `
<slot>Button</slot>
`;

export default class TreeView extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "type"];
    }

    constructor() {
        super();

        Object.defineProperties(this, {
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;
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