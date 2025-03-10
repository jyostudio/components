import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";

// TODO

const STYLES = `
.item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 28px;
    border-radius: var(--borderRadiusMedium);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
    contain: paint;
    overflow: hidden;
}

.item:hover {
    background-color: var(--mix-colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
}

.item:hover:active, .item[flyout-visible] {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

:host(:focus-visible) .item {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

:host(:disabled) .item, :host([disabled]) .item {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = `
<div class="item"></div>
<slot></slot>
`;

export default class TreeViewItem extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "text"];
    }

    /**
     * 项目元素
     * @type {HTMLElement}
     */
    #itemEl;

    constructor() {
        super();

        this.#itemEl = this.shadowRoot.querySelector(".item");

        Object.defineProperties(this, {
            text: {
                get: () => this.#itemEl.textContent,
                set: overload([String], value => {
                    this.lock("text", () => {
                        this.#itemEl.textContent = value;
                        this.setAttribute("text", value);
                    });
                }).any(() => this.text = "")
            }
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