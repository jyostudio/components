import Enum from "@jyostudio/enum";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";

/**
 * 按钮类型
 * @extends {Enum}
 */
class Type extends Enum {
    static {
        this.set({
            submit: 0, // 提交
            reset: 1, // 重置
            button: 2 // 按钮
        });
    }
}

const STYLES = /* css */`
:host {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    contain: paint;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    min-height: 32px;
    padding: 0 var(--spacingHorizontalM);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom-color: var(--mix-colorNeutralStroke1Hover);
    border-radius: var(--borderRadiusMedium);
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    text-align: center;
    text-decoration-line: none;
    color: var(--colorNeutralForeground1);
    background-color: var(--mix-colorNeutralBackground1);
    outline-style: none;
    user-select: none;
    transition: background-color var(--durationFaster) var(--curveEasyEase),
                border-color var(--durationFaster) var(--curveEasyEase),
                color var(--durationFaster) var(--curveEasyEase);
}

.content {
    display: inline-block;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
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

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
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
<div class="content">
    <slot>Button</slot>
</div>
`;

/**
 * 按钮组件
 * @class
 * @extends {Component}
 */
export default class Button extends Component {
    /**
     * 按钮类型
     * @type {Type}
     */
    static get Type() {
        return Type;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "type"];
    }

    /**
     * 是否支持 form 关联
     * @returns {Boolean}
     */
    static get formAssociated() {
        return true;
    }

    constructor() {
        super();

        Object.defineProperties(this, {
            type: genEnumGetterAndSetter(this, {
                attrName: "type",
                enumClass: Type,
                defaultValue: "submit"
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("click", () => {
            switch (this.type) {
                case "submit":
                    this.internals?.form?.requestSubmit();
                    break;
                case "reset":
                    this.internals?.form?.reset();
                    break;
            }
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback() {
        super.connectedCallback?.();

        this.#initEvents();
    }

    static {
        this.registerComponent({
            name: "jyo-button",
            html: HTML,
            css: STYLES
        });
    }
}