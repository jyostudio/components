import Enum from "@jyostudio/enum";
import Component from "./component.js";
import { genEnumGetterAndSetter } from "../libs/utils.js";

/**
 * 按钮类型
 * @extends {Enum}
 */
class Type extends Enum {
    static {
        this.set({
            submit: 0,
            reset: 1,
            button: 2
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
    background-color: var(--colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);
    padding: 0 var(--spacingHorizontalM);
    border-radius: var(--borderRadiusMedium);
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

:host(:hover) {
    background-color: var(--colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--colorNeutralStroke1Hover);
}

:host(:hover:active), :host([flyout-visible]) {
    background-color: var(--colorNeutralBackground1Pressed);
    border-color: var(--colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
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
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.addEventListener("click", () => {
            switch (this.type) {
                case "submit":
                    this.internals?.form?.requestSubmit();
                    break;
                case "reset":
                    this.internals?.form?.reset();
                    break;
            }
        }, { signal: this.abortController.signal });
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}