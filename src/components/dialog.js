import overload from "@jyostudio/overload";
import Component from "./component.js";
import "./button.js";
import "./divider.js";

const STYLES = /* css */`
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

:host(:not([is-open])) {
    animation: fade-out var(--durationFaster) var(--curveEasyEase) forwards;
}

:host([is-open]) {
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
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    line-height: var(--lineHeightBase200);
    padding: var(--spacingHorizontalXL) 0;
    contain: paint;
    overflow: hidden;
    transition-duration: var(--durationFaster);
    transition-property: transform, scale, opacity;
    transition-timing-function: var(--curveEasyEase);
    touch-action: none;
}

:host(:not([is-open])) .dialog {
    animation: dialog-hide var(--durationFaster) var(--curveEasyEase) forwards;
}

:host([is-open]) .dialog {
    animation: dialog-show var(--durationFaster) var(--curveEasyEase) forwards;
}

.title {
    font-size: var(--fontSizeBase400);
    line-height: var(--lineHeightBase400);
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

const HTML = /* html */`
<div class="dialog">
    <div class="title">
        <slot name="title"></slot>
    </div>
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

/**
 * 对话框组件
 * @class
 * @extends {Component}
 */
export default class Dialog extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "is-open"];
    }

    constructor() {
        super();

        Object.defineProperties(this, {
            isOpen: {
                get: () => Boolean(this.hasAttribute("is-open")) || false,
                set: overload()
                    .add([String], value => {
                        this.isOpen = Boolean(value);
                    })
                    .add([Boolean], function (value) {
                        this.lock("isOpen", () => {
                            if (value) {
                                this.open();
                                this.setAttribute("is-open", "");
                            } else {
                                this.close();
                                this.removeAttribute("is-open");
                            }
                        });
                    })
                    .any(() => this.isOpen = false)
            }
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
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();
    }

    /**
     * 打开
     */
    open() {
        this.isOpen = true;
        this.dispatchCustomEvent("open");
    }

    /**
     * 关闭
     */
    close() {
        this.isOpen = false;
        this.dispatchCustomEvent("close");
    }

    /**
     * 切换打开状态
     */
    toggle() {
        this.isOpen = !this.isOpen;
        this.dispatchCustomEvent("toggle", { newState: this.isOpen ? "open" : "close" });
    }

    static {
        this.registerComponent({
            name: "jyo-dialog",
            html: HTML,
            css: STYLES
        });
    }
}