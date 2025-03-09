import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import "./acrylic.js";
import Component from "./component.js";

/**
 * 定位
 * @extends {Enum}
 */
class Positioning extends Enum {
    static {
        this.set({
            aboveStart: 0, // 上左
            above: 1, // 上
            aboveEnd: 2, // 上右
            belowStart: 3, // 下左
            below: 4, // 下
            belowEnd: 5, // 下右
            beforeTop: 6, // 左上
            before: 7, // 左
            beforeBottom: 8, // 左下
            afterTop: 9, // 右上
            after: 10, // 右
            afterBottom: 11 // 右下
        });
    }
}

/**
 * 默认插槽元素
 * @type {Array<String>}
 */
const DEFALUT_SLOT_ELEMENTS = [
    "JYO-MENU-FLYOUT-ITEM",
    "JYO-DROP-DOWN-BUTTON",
    "JYO-SPLIT-BUTTON",
    "JYO-TOGGLE-SPLIT-BUTTON"
];

const STYLES = `
@keyframes fade-in {
    0% {
        display: initial;
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

:host(:not(:popover-open)) {
    display: none;
}

:host(:popover-open) {
    animation: fade-in var(--durationFaster) var(--curveEasyEase) forwards;
}

:host {
    --position-area: block-start;
    --position-try-options: flip-block;
    position: absolute;
    position-area: var(--position-area);
    background-color: transparent;
    border-radius: var(--borderRadiusMedium);
    border: 1px solid var(--mix-colorTransparentStroke);
    color: var(--colorNeutralForeground1);
    opacity: 0;
    display: none;
}

@supports (inset-area: block-start) {
  :host {
    inset-area: var(--position-area);
    position-try-fallbacks: var(--position-try-options);
  }
}

:host(:is([positioning^='above'], [positioning^='below'], :not([positioning]))) {
  margin-block: var(--block-offset);
}

:host(:is([positioning^='before'], [positioning^='after'])) {
  margin-inline: var(--inline-offset);
  --position-try-options: flip-inline;
}

:host([positioning="aboveStart"]) {
    --position-area: block-start span-inline-end;
}

:host([positioning="above"]) {
    --position-area: block-start;
}

:host([positioning="aboveEnd"]) {
    --position-area: block-start span-inline-start;
}

:host([positioning="beforeTop"]) {
    --position-area: inline-start span-block-end;
}

:host([positioning="before"]) {
    --position-area: inline-start;
}

:host([positioning="beforeBottom"]) {
    --position-area: inline-start span-block-start;
}

:host([positioning="afterTop"]) {
    --position-area: inline-end span-block-end;
}

:host([positioning="after"]) {
    --position-area: inline-end;
}

:host([positioning="afterBottom"]) {
    --position-area: inline-end span-block-start;
}

:host([positioning="belowStart"]) {
    --position-area: block-end span-inline-end;
}

:host([positioning="below"]) {
    --position-area: block-end;
}

:host([positioning="belowEnd"]) {
    --position-area: block-end span-inline-start;
}
`;

const HTML = `
<jyo-acrylic></jyo-acrylic>
<slot></slot>
`;

export default class Flyout extends Component {
    /**
     * 计数器
     * @type {Number}
     */
    static #counter = 0;

    /**
     * 定位
     * @type {Positioning}
     */
    static get Positioning() {
        return Positioning;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "anchor", "positioning"];
    }

    static slotBinding(...params) {
        const bindingeds = new WeakMap();

        Flyout.slotBinding = overload()
            .add(
                [HTMLElement],
                /**
                 * 绑定元素
                 * @param {HTMLElement} targetEl - 目标元素/绑定元素
                 */
                function (targetEl) {
                    Flyout.slotBinding(targetEl, targetEl);
                }
            )
            .add(
                [HTMLElement, HTMLElement],
                /**
                 * 绑定元素
                 * @param {HTMLElement} targetEl - 目标元素
                 * @param {HTMLElement} bindEl - 绑定元素
                 */
                function (targetEl, bindEl) {
                    const slotEl = targetEl.querySelector("slot[name='flyout']");

                    // 如果已经绑定，则移除监听
                    if (bindingeds.has(targetEl)) {
                        slotEl?.removeEventListener("slotchange", bindingeds.get(targetEl));
                        bindingeds.delete(targetEl);
                    }

                    // 当插槽变化时调用
                    const fn = () => {
                        targetEl.querySelector("[slot='flyout']").dispatchCustomEvent("rebind", {
                            detail: {
                                newBindEl: bindEl
                            }
                        });
                    };

                    // 监听插槽变化
                    slotEl?.addEventListener("slotchange", fn, { signal: targetEl.abortController.signal });

                    // 先调用一次
                    fn();

                    bindingeds.set(targetEl, fn);
                }
            )
            .add([HTMLElement, null],
                /**
                 * 解绑元素
                 * @param {HTMLElement} targetEl - 目标元素
                 * @param {null} nullVal - 空值 
                 */
                function (targetEl) {
                    const slotEl = targetEl.querySelector("slot[name='flyout']");

                    // 如果已经绑定，则移除监听
                    if (bindingeds.has(targetEl)) {
                        slotEl?.removeEventListener("slotchange", bindingeds.get(targetEl));
                        bindingeds.delete(targetEl);
                    }
                }
            );

        return Flyout.slotBinding(...params);
    }

    /**
     * 绑定元素
     * @type {HTMLElement}
     */
    #bindEl = null;

    /**
     * 飞出菜单 ID
     * @type {String}
     */
    #flyoutId = `jyo-flyout-${++Flyout.#counter}`;

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

        Object.defineProperties(this, {
            anchor: {
                get: () => this.getAttribute("anchor") || "",
                set: overload()
                    .add([String], value => {
                        this.lock("anchor", () => {
                            this.setAttribute("anchor", value);
                            this.#rebind();
                        });
                    })
                    .add([HTMLElement], value => {
                        this.lock("anchor", () => {
                            this.setAttribute("anchor", "[Anonymous Element]");
                            this.#rebind(value);
                        });
                    })
                    .any(() => this.anchor = "")
            },
            positioning: genEnumGetterAndSetter(this, {
                attrName: "positioning",
                enumClass: Positioning,
                defaultValue: "above"
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("toggle", e => {
            this.#isVisible = e.newState === "open";
            if (this.#isVisible) {
                this.#bindEl.setAttribute("flyout-visible", "");
            } else {
                this.#bindEl.removeAttribute("flyout-visible");
            }
            this.#bindEl?.dispatchCustomEvent?.("flyoutvisiblechange", { detail: { isVisible: this.#isVisible } });
        }, { signal });
    }

    /**
     * 重新绑定
     * @param {HTMLElement} el - 元素 
     */
    #rebind(el) {
        const oldBindEl = this.#bindEl;
        if (this.#bindEl) {
            this.#bindEl.style.removeProperty("anchor-name");
        }

        this.#bindEl = el ?? this.#bindEl ?? (this.anchor.startsWith("#")
            ? document.querySelector(this.anchor)
            : document.getElementById(this.anchor));
        this.#bindEl?.style?.setProperty?.("anchor-name", `--${this.#flyoutId}`);

        this.dispatchCustomEvent("rebind", { detail: { oldBindEl, newBindEl: this.#bindEl } });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        this.#initEvents();

        this.setAttribute("popover", "auto");
        this.style.setProperty("position-anchor", `--${this.#flyoutId}`);

        const parentEl = this.parentElement;

        /**
         * 如果父级可以有子菜单，则设置插槽为 flyout
         */
        if (DEFALUT_SLOT_ELEMENTS.includes(this.parentElement?.tagName)) {
            this.setAttribute("slot", "flyout");
        } else {
            this.removeAttribute("slot");
        }

        this.anchor ||= parentEl;

        this.thenParentDefined(() => {
            if (parentEl?.flyoutPositioning) {
                this.positioning = parentEl.flyoutPositioning;
            }
        });

        super.connectedCallback?.call(this, ...params);
    }

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback(...params) {
        this.#bindEl?.style?.removeProperty?.("anchor-name");
        this.#bindEl = null;

        super.disconnectedCallback?.call(this, ...params);
    }

    /**
     * 切换显示/隐藏
     */
    togglePopover() {
        if (this.#isVisible) {
            this.hidePopover();
        } else {
            this.showPopover();
        }
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}

export const FlyoutStyle = STYLES;