import Enum from "@jyostudio/enum";
import themeManager from "../libs/themeManager/themeManager.js";
import { genBooleanGetterAndSetter, genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import "./hyperlinkButton.js";

/**
 * 信息栏严重性
 * @extends {Enum}
 */
class InfoBarSeverity extends Enum {
    static {
        this.set({
            informational: 0, // 信息
            success: 1, // 成功
            warning: 2, // 警告
            error: 3 // 错误
        });
    }
}

const STYLES = /* css */`
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

:host([severity="success"]) .background[is-dark-or-high-contrast="true"] {
    filter: contrast(0.5) brightness(0.8);
    background-color: var(--mix-colorStatusSuccessForeground3);
}

:host([severity="warning"]) .background[is-dark-or-high-contrast="true"] {
    filter: contrast(0.5) brightness(0.8);
    background-color: var(--mix-colorStatusWarningForeground3);
}

:host([severity="error"]) .background[is-dark-or-high-contrast="true"] {
    filter: contrast(0.5) brightness(0.8);
    background-color: var(--mix-colorStatusDangerForeground3);
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
}

:host([severity="success"]) .contentArea[is-dark-or-high-contrast="true"] .icon .iconInternal {
    color: var(--colorPaletteGreenBackground2);
}

:host([severity="warning"]) .contentArea .icon .iconInternal {
    color: var(--colorStatusWarningForeground1);
}

:host([severity="warning"]) .contentArea[is-dark-or-high-contrast="true"] .icon .iconInternal {
    color: var(--colorPaletteYellowBackground3);
}

:host([severity="error"]) .contentArea .icon .iconInternal {
    color: var(--colorStatusDangerForeground1);
}

:host([severity="error"]) .contentArea[is-dark-or-high-contrast="true"] .icon .iconInternal {
    color: var(--colorPaletteBerryBackground2);
}

:host([icon-source]) .contentArea .icon .iconInternal {
    display: none;
}

.contentArea .message {
    display: block;
    font-size: var(--fontSizeBase200);
    vertical-align: middle;
}

.functionArea {
    display: inline-flex;
    margin-inline-start: var(--spacingHorizontalS);
    align-items: center;
}

.functionArea .actions {
    font-size: var(--fontSizeBase200);
}

.functionArea .close {
    position: relative;
    width: 34px;
    height: 34px;
    font-family: "FluentSystemIcons-Resizable";
    margin-inline-start: var(--spacingHorizontalXS);
    color: var(--colorNeutralForeground2);
}

:host([is-closable="false"]) .functionArea .close {
    display: none;
}
`;

const HTML = /* html */`
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

/**
 * 信息栏组件
 * @class
 * @extends {Component}
 */
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
     * 背景元素
     * @type {HTMLElement}
     */
    #backgroundEl;

    /**
     * 内容区域元素
     * @type {HTMLElement}
     */
    #contentAreaEl;

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

    constructor() {
        super();

        this.#backgroundEl = this.shadowRoot.querySelector(".background");
        this.#contentAreaEl = this.shadowRoot.querySelector(".contentArea");
        this.#iconInternalEl = this.shadowRoot.querySelector(".iconInternal");
        this.#closeEl = this.shadowRoot.querySelector(".close");

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
            isOpen: genBooleanGetterAndSetter(this, { attrName: "isOpen", defaultValue: true, preserveFalseValue: true }),
            isIconVisible: genBooleanGetterAndSetter(this, { attrName: "isIconVisible", defaultValue: true, preserveFalseValue: true }),
            isClosable: genBooleanGetterAndSetter(this, { attrName: "isClosable", defaultValue: true, preserveFalseValue: true })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.#closeEl.addEventListener("click", () => {
            if (!this.dispatchCustomEvent("closing")) return;
            this.dispatchCustomEvent("closed", { cancelable: false });
            this.isOpen = false;
        }, { signal });

        themeManager.addEventListener("update", () => this.#checkThemeConfig(), { signal });
    }

    /**
     * 检查主题配置
     */
    #checkThemeConfig() {
        const isDarkOrHighContrast = themeManager.currentTheme === themeManager.Themes.dark || themeManager.currentTheme === themeManager.Themes.highContrast;
        [this.#backgroundEl, this.#contentAreaEl].forEach(el => el.setAttribute("is-dark-or-high-contrast", isDarkOrHighContrast ? "true" : "false"));
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();

        this.#checkThemeConfig();
    }

    static {
        this.registerComponent({
            name: "jyo-info-bar",
            html: HTML,
            css: STYLES
        });
    }
}