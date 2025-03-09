import overload from "@jyostudio/overload";
import Component from "./component.js";
import "./button.js";
import "./divider.js";

const STYLES = `
@keyframes fade-in {
    0% {
        opacity: 0;
        display: none;
    }
    100% {
        opacity: 1;
        display: flex;
    }
}

@keyframes fade-out {
    0% {
        opacity: 1;
        display: flex;
    }
    100% {
        opacity: 0;
        display: none;
    }
}

@keyframes dialog-show {
    0% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes dialog-hide {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.1);
    }
}

:host(:not([open])) {
    animation: fade-out var(--durationFaster) var(--curveEasyEase) forwards;
}

:host([open]) {
    display: flex;
    animation: fade-in var(--durationFaster) var(--curveEasyEase) forwards;
}

:host {
    position: fixed;
    inset: 0;
    background-color: var(--colorNeutralShadowAmbientDarker);
    z-index: 2147483647;
    opacity: 0;
    display: none;
    justify-content: center;
    align-items: center;
}

.dialog {
    position: relative;
    min-width: 320px;
    max-width: 100%;
    width: fit-content;
    background-color: var(--colorNeutralBackground1);
    border: var(--strokeWidthThin) solid var(--colorNeutralStrokeDisabled);
    border-radius: var(--borderRadiusXLarge);
    box-shadow: var(--shadow64);
    color: var(--colorNeutralForeground1);
    font-family: var(----fontFamilyBase);
    font-size: var(--fontSizeBase300);
    line-height: var(--lineHeightBase300);
    padding: var(--spacingHorizontalXL) 0;
    contain: paint;
    overflow: hidden;
    transition-duration: var(--durationFaster);
    transition-property: scale, opacity;
    transition-timing-function: var(--curveEasyEase);
    touch-action: none;
}

:host(:not([open])) .dialog {
    animation: dialog-hide var(--durationFaster) var(--curveEasyEase) forwards;
}

:host([open]) .dialog {
    animation: dialog-show var(--durationFaster) var(--curveEasyEase) forwards;
}

.title {
    font-size: var(--fontSizeBase500);
    line-height: var(--lineHeightBase500);
    font-weight: bold;
    margin-bottom: var(--spacingVerticalXS);
    padding: 0 var(--spacingHorizontalXL);
}

.title:empty {
    display: none;
}

.content {
    padding: 0 var(--spacingHorizontalXL);
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacingHorizontalXS);
    margin-top: var(--spacingVerticalXL);
    background-color: var(--colorNeutralBackground2);
    border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
    padding: var(--spacingVerticalL) var(--spacingHorizontalXL);
    margin-bottom: calc(0px - var(--spacingVerticalXL));
}

.actions:empty {
    display: none;
}
`;

const HTML = `
<div class="dialog">
    <div class="title"></div>
    <div class="content">
        <slot></slot>
    </div>
    <div class="actions">
        <slot name="actions">
            <jyo-button class="btnDefault" style="min-width: 72px;">确定</jyo-button>
        </slot>
    </div>
</div>
`;

export default class Dialog extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "title-text"];
    }

    /**
     * 标题元素
     * @type {HTMLElement}
     */
    #titleEl;

    /**
     * 是否可见
     * @type {Boolean}
     */
    #isVisible = false;

    /**
     * 是否可见
     * @type {Boolean}
     */
    get isVisible() {
        return this.#isVisible;
    }

    constructor() {
        super();

        this.#titleEl = this.shadowRoot.querySelector(".title");

        Object.defineProperties(this, {
            titleText: {
                get: () => this.#titleEl.textContent,
                set: overload([String], value => {
                    this.lock("titleText", () => {
                        this.#titleEl.textContent = value;
                        this.setAttribute("title-text", value);
                    });
                }).any(() => this.titleText = "")
            },
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.shadowRoot.querySelector(".btnDefault")?.addEventListener("click", () => {
            this.close();
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        this.#initEvents();

        super.connectedCallback?.call(this, ...params);
    }

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback(...params) {
        super.disconnectedCallback?.call(this, ...params);
    }

    /**
     * 显示
     */
    open() {
        this.setAttribute("open", "");
        this.#isVisible = true;
        this.dispatchCustomEvent("open");
    }

    /**
     * 关闭
     */
    close() {
        this.removeAttribute("open");
        this.#isVisible = false;
        this.dispatchCustomEvent("close");
    }

    /**
     * 切换显示状态
     */
    toggle() {
        if (this.#isVisible) {
            this.open();
        } else {
            this.close();
        }
        this.dispatchCustomEvent("toggle", { newState: this.#isVisible ? "open" : "close" });
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}

export const FlyoutStyle = STYLES;