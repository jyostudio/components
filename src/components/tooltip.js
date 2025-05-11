import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genCSSNumberGetterAndSetter, genEnumGetterAndSetter } from "../libs/utils.js";
import Flyout, { FlyoutStyle } from "./flyout.js";

/**
 * 触发模式
 * @extends {Enum}
 */
class Mode extends Enum {
    static {
        this.set({
            auto: 0, // 自动
            manual: 1 // 手动
        });
    }
}

const STYLES = /* css */`${FlyoutStyle}
:host {
    --block-offset: var(--spacingVerticalXS);
    --inline-offset: var(--spacingHorizontalXS);
    --vertical-offset: 0;
    --horizontal-offset: 0;
    transform: translate(var(--horizontal-offset), var(--vertical-offset));
    box-sizing: border-box;
    display: inline-flex;
    color: var(--colorNeutralForeground1);
    filter: drop-shadow(0 0 2px var(--colorNeutralShadowAmbient)) drop-shadow(0 4px 8px var(--colorNeutralShadowKey));
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    inset: unset;
    line-height: var(--lineHeightBase200);
    margin: unset;
    max-width: 240px;
    overflow: visible;
    padding: 4px var(--spacingHorizontalMNudge) 6px;
    width: auto;
    pointer-events: none;
}

.content {
    position: relative;
}
`;

const HTML = /* html */`
<div id="content">
    <slot></slot>
</div>
`;

/**
 * 工具提示组件
 * @class
 * @extends {Flyout}
 */
export default class Tooltip extends Flyout {
    /**
     * 定位
     * @extends {Flyout.Positioning}
     */
    static get Positioning() {
        return Flyout.Positioning;
    }

    /**
     * 触发模式
     * @extends {Mode}
     */
    static get Mode() {
        return Mode;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "delay", "mode", "vertical-offset", "horizontal-offset"];
    }

    /**
     * 事件中止控制器
     */
    #eventAbortController = new AbortController();

    constructor() {
        super();

        Object.defineProperties(this, {
            delay: {
                get: () => this.getAttribute("delay") || 300,
                set: overload([Number], value => {
                    this.lock("delay", () => {
                        this.setAttribute("delay", value);
                    });
                }).any(() => this.delay = 300)
            },
            mode: genEnumGetterAndSetter(this, {
                attrName: "mode",
                enumClass: Mode,
                defaultValue: "auto"
            }),
            verticalOffset: genCSSNumberGetterAndSetter(this, {
                attrName: "verticalOffset",
                defaultValue: "0",
                isSetCssVar: true
            }),
            horizontalOffset: genCSSNumberGetterAndSetter(this, {
                attrName: "horizontalOffset",
                defaultValue: "0",
                isSetCssVar: true
            })
        });
    }

    /**
     * 重新绑定
     * @param {HTMLElement} el - 绑定元素
     */
    #rebind(el) {
        this.#eventAbortController.abort();
        this.#eventAbortController = new AbortController();

        if (el && this.mode === Mode.auto) {
            const signal = this.#eventAbortController.signal;
            let timer;

            const showEvents = ["pointerenter", "touchstart"];
            const hideEvents = ["pointerleave", "touchend", "pointerdown"];

            showEvents.forEach(eventName => {
                el.addEventListener(eventName, () => {
                    clearTimeout(timer);
                    timer = setTimeout(() => this.showPopover(), this.delay);
                }, { signal });
            });

            hideEvents.forEach(eventName => {
                el.addEventListener(eventName, () => {
                    clearTimeout(timer);
                    this.hidePopover();
                }, { signal });
            });
        }
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("rebind", e => {
            this.#rebind(e.detail.newBindEl);
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        // 添加无障碍属性
        this.setAttribute("role", "tooltip");

        this.#initEvents();
    }

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback(...params) {
        this.#eventAbortController.abort();

        super.disconnectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}