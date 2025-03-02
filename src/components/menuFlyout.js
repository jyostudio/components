import Flyout, { FlyoutStyle } from "./flyout.js";

const STYLES = `${FlyoutStyle}
:host(:popover-open) {
    pointer-events: auto;
}

::slotted([popover]) {
    margin: 0px;
    max-height: var(--menu-max-height, auto);
    position-anchor: --menu-trigger;
    position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block;
    position: absolute;
    z-index: 1;
}

::slotted([popover]:popover-open) {
    inset: unset;
}

:host {
    --block-offset: var(--spacingVerticalXS);
    --inline-offset: var(--spacingHorizontalXS);
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 0 2px var(--colorNeutralShadowAmbient)) drop-shadow(0 4px 8px var(--colorNeutralShadowKey));
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase300);
    inset: unset;
    line-height: var(--lineHeightBase300);
    margin: unset;
    overflow: visible;
    padding: 2px;
    width: auto;
    height: fit-content;
    opacity: 0;
    row-gap: 2px;
    border-radius: var(--borderRadiusMedium);
    contain: paint;
}
`;

const HTML = `
<jyo-acrylic></jyo-acrylic>
<slot></slot>
`;

export default class MenuFlyout extends Flyout {
    /**
     * 事件中止控制器
     */
    #eventAbortController = new AbortController();

    /**
     * 重新绑定
     * @param {HTMLElement} newBindEl - 新的绑定元素
     */
    #rebind(newBindEl) {
        this.#eventAbortController.abort();
        this.#eventAbortController = new AbortController();

        if (newBindEl) {
            const signal = this.#eventAbortController.signal;

            newBindEl.addEventListener("click", e => {
                e.stopPropagation();
                if (this.isVisible && !e.target?.internals?.states?.has("flyout")) {
                    this.hidePopover();
                } else {
                    this.showPopover();
                }
            }, { signal });
        }
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("rebind", e => {
            this.#rebind(e.detail.newBindEl);
        }, { signal: this.abortController.signal });

        this.addEventListener("click", e => {
            if (e.target?.internals?.states?.has("flyout") || e.target?.type?.valNumber !== 0) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                let parent = this.parentElement;
                let lastMenu = this;
                while (parent) {
                    if (parent.hasAttribute("popover")) {
                        lastMenu = parent;
                    }
                    parent = parent.parentElement;
                }
                lastMenu.hidePopover();
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

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback(...params) {
        super.disconnectedCallback?.call(this, ...params);

        this.#eventAbortController.abort();
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}