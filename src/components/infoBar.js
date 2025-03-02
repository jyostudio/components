import overload from "@jyostudio/overload";
import Enum from "@jyostudio/enum";
import Component from "./component.js";
import { genBooleanGetterAndSetter, genEnumGetterAndSetter } from "../libs/utils.js";
import "./hyperlinkButton.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

class InfoBarSeverity extends Enum {
    static {
        this.set({
            informational: 0,
            success: 1,
            warning: 2,
            error: 3
        });
    }
}

const STYLES = `
:host {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 42px;
    margin: var(--spacingVerticalXS) 0;
    padding: var(--spacingHorizontalXS) var(--spacingVerticalXS);
    border: 1px solid var(--colorNeutralShadowAmbient);
    border-radius: var(--borderRadiusMedium);
    font-size: var(--fontSizeBase500);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightRegular);
    color: var(--colorNeutralForeground2);
    word-break: break-word;
    contain: paint;
    overflow: hidden;
}

.background {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: var(--mix-colorNeutralBackground1);
}

:host([severity="success"]) .background {
    background-color: var(--mix-colorStatusSuccessBackground2);
}

:host([severity="warning"]) .background {
    background-color: var(--mix-colorStatusWarningBackground2);
}

:host([severity="error"]) .background {
    background-color: var(--mix-colorStatusDangerBackground2);
}

@container (style(--theme: dark) or style(--theme: highContrast)) {
    :host([severity="success"]) .background {
        filter: contrast(0.5) brightness(0.8);
        background-color: var(--mix-colorStatusSuccessForeground3);
    }

    :host([severity="warning"]) .background {
        filter: contrast(0.5) brightness(0.8);
        background-color: var(--mix-colorStatusWarningForeground3);
    }

    :host([severity="error"]) .background {
        filter: contrast(0.5) brightness(0.8);
        background-color: var(--mix-colorStatusDangerForeground3);
    }
}

:host([is-open="false"]) {
    display: none;
}

.contentArea {
    display: inline-flex;
    align-items: center;
    flex: 1;
}

.contentArea .icon {
    width: 20px;
    height: 20px;
    background-image: var(attr(icon-source));
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-inline-end: var(--spacingHorizontalS);
}

:host([is-icon-visible="false"]) .contentArea .icon {
    display: none;
}

.contentArea .icon .iconInternal {
    font-family: "FluentSystemIcons-Resizable";
    color: var(--colorCompoundBrandBackground);
}

:host([severity="success"]) .contentArea .icon .iconInternal {
    color: var(--colorStatusSuccessForeground1);

    @container (style(--theme: dark) or style(--theme: highContrast)) {
        color: var(--colorPaletteGreenBackground2);    
    }
}

:host([severity="warning"]) .contentArea .icon .iconInternal {
    color: var(--colorStatusWarningForeground1);

    @container (style(--theme: dark) or style(--theme: highContrast)) {
        color: var(--colorPaletteYellowBackground3);    
    }
}

:host([severity="error"]) .contentArea .icon .iconInternal {
    color: var(--colorStatusDangerForeground1);

    @container (style(--theme: dark) or style(--theme: highContrast)) {
        color: var(--colorPaletteBerryBackground2);    
    }
}

:host([icon-source]) .contentArea .icon .iconInternal {
    display: none;
}

.contentArea .message {
    display: block;
    font-size: var(--fontSizeBase300);
    vertical-align: middle;
}

.functionArea {
    display: inline-flex;
    margin-inline-start: var(--spacingHorizontalS);
    align-items: center;
}

.functionArea .actions {
    font-size: var(--fontSizeBase300);
}

.functionArea .close {
    position: relative;
    width: 20px;
    height: 20px;
    font-family: "FluentSystemIcons-Resizable";
    margin-inline-start: var(--spacingHorizontalXS);
    color: var(--colorNeutralForeground2);
}

:host([is-closable="false"]) .functionArea .close {
    display: none;
}
`;

const HTML = `
<div class="background"></div>
<div class="contentArea">
    <div class="icon">
        <span class="iconInternal">\ue78a</span>
    </div>
    <div class="message"><slot></slot></div>
</div>
<div class="functionArea">
    <div class="actions">
        <slot name="actions"></slot>
    </div>
    <jyo-hyperlink-button class="close">\ue5fd</jyo-hyperlink-button>
</div>
`;

export default class InfoBar extends Component {
    /**
     * 信息栏严重性
     * @returns {Enum}
     */
    static get InfoBarSeveity() {
        return InfoBarSeverity;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "is-open", "severity", "is-icon-visible", "is-closable"];
    }

    /**
     * 内置图标元素
     * @type {HTMLElement}
     */
    #iconInternalEl;

    /**
     * 关闭元素
     * @type {HTMLElement}
     */
    #closeEl;

    static [CONSTRUCTOR_SYMBOL](...params) {
        InfoBar[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#iconInternalEl = this.shadow.querySelector(".iconInternal");
            this.#closeEl = this.shadow.querySelector(".close");
        });

        return InfoBar[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            severity: genEnumGetterAndSetter(this, {
                attrName: "severity",
                enumClass: InfoBarSeverity,
                defaultValue: "informational",
                fn: () => {
                    let icon = "";
                    switch (this.severity) {
                        case InfoBarSeverity.informational:
                            icon = "\ue78a";
                            break;
                        case InfoBarSeverity.success:
                            icon = "\ue3e9";
                            break;
                        case InfoBarSeverity.warning:
                            icon = "\ue78a";
                            break;
                        case InfoBarSeverity.error:
                            icon = "\ue5fe";
                            break;
                        default:
                            icon = "\ue78a";
                            break;
                    }
                    this.#iconInternalEl.textContent = icon;
                }
            }),
            isOpen: genBooleanGetterAndSetter(this, { attrName: "is-open", defaultValue: true, setValueDontRemove: true }),
            isIconVisible: genBooleanGetterAndSetter(this, { attrName: "is-icon-visible", defaultValue: true, setValueDontRemove: true }),
            isClosable: genBooleanGetterAndSetter(this, { attrName: "is-closable", defaultValue: true, setValueDontRemove: true })
        });

        return InfoBar[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        this.#closeEl.addEventListener("click", () => {
            if (!this.dispatchCustomEvent("closing")) return;
            this.dispatchCustomEvent("closed", { cancelable: false });
            this.isOpen = false;
        });
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