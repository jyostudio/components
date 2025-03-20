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
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
}

:host(:hover:active), :host([flyout-visible]) {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
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

const HTML = /* html */`
<slot>Button</slot>
`;

export default class Button extends Component {
    /**
     * 按钮类型
     * @type {Type}
     */
    static get Type() {
        return Type;
    }

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
        return [...super.observedAttributes, "type"];
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