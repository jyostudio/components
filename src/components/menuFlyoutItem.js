import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import "./menuFlyout.js";

/**
 * 类型
 * @extends {Enum}
 */
class Type extends Enum {
    static {
        this.set({
            default: 0, // 默认
            radio: 1, // 单选
            checkbox: 2 // 复选
        });
    }
}

const STYLES = /* css */`
:host {
    --indent: 0;
    position: relative;
    display: flex;
    gap: 2px;
    min-width: 60px;
    align-items: center;
    padding: 0px 8px;
    height: 32px;
    flex-shrink: 0;
    border-radius: var(--borderRadiusMedium);
    color: var(--colorNeutralForeground2);
    contain: layout;
    overflow: visible;
    font: var(--fontWeightRegular) var(--fontSizeBase200) / var(--lineHeightBase200) var(--fontFamilyBase);
    transition-duration: var(--durationFaster);
    transition-property: opacity;
    transition-timing-function: var(--curveEasyEase);
}

:host(:hover) {
    background: var(--mix-colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground2Hover);
}

:host(:active) {
    background-color: var(--mix-colorNeutralBackground1Selected);
    color: var(--colorNeutralForeground2Pressed);
}

:host([flyout-visible]) {
    background-color: var(--mix-colorNeutralBackground1Selected) !important;
    color: var(--colorNeutralForeground2Pressed) !important;
}

:host(:disabled), :host([disabled]) {
    pointer-events: none;
    background-color: var(--mix-colorNeutralBackgroundDisabled);
    color: var(--colorNeutralForegroundDisabled);
}

:host(:disabled) ::slotted([slot="start"]), :host([disabled]) ::slotted([slot="start"]),
:host(:disabled) ::slotted([slot="end"]), :host([disabled]) ::slotted([slot="end"]) {
    color: var(--colorNeutralForegroundDisabled);
}

:host([data-indent="1"]) {
    --indent: 1;
    padding-inline-start: 24px;
}

:host([data-indent="2"]) {
    --indent: 2;
    padding-inline-start: 48px;
}

.content {
    white-space: nowrap;
    flex-grow: 1;
    padding: 0 2px;
}

:host(:not([checked])) .indicator,
:host(:not([checked])) ::slotted([slot="indicator"]),
:host(:not(:state(flyout))) .flyout-glyph,
:host(:not(:state(flyout))) ::slotted([slot="flyout-glyph"]) {
    display: none;
}

::slotted([slot="end"]) {
    color: var(--colorNeutralForeground3);
    font: var(--fontWeightRegular) var(--fontSizeBase200) /
        var(--lineHeightBase200) var(--fontFamilyBase);
    white-space: nowrap;
}

.indicator,
::slotted([slot="indicator"]) {
    pointer-events: none;
    font-family: "FluentSystemIcons-Resizable";
    width: 20px;
    height: 20px;
    line-height: var(--lineHeightBase100);
    text-align: center;
    margin-inline-start: calc(var(--indent) * -22px);
    margin-inline-end: calc((var(--indent) - 1) * 22px);
    vertical-align: middle;
}

::slotted([slot="start"]) {
    pointer-events: none;
    font-family: "FluentSystemIcons-Resizable";
    display: inline-flex;
    width: 20px;
    line-height: var(--lineHeightBase100);
    text-align: center;
    margin-inline-start: -22px;
    vertical-align: middle;
}

::slotted([slot="end"]) {
    font-family: "FluentSystemIcons-Resizable";
    justify-self: end;
    vertical-align: middle;
}

.flyout-glyph,
::slotted([slot="flyout-glyph"]) {
    font-family: "FluentSystemIcons-Resizable";
    justify-self: end;
    vertical-align: middle;
}

@layer popover {
    :host {
        anchor-name: --menu-trigger;
        position: relative;
    }

    ::slotted([popover]) {
        margin: 0;
        max-height: var(--menu-max-height, auto);
        position: absolute;
        position-anchor: --menu-trigger;
        position-area: inline-end span-block-end;
        position-try-fallbacks: flip-inline;
        z-index: 1;
    }

    ::slotted([popover]:not(:popover-open)) {
        display: none;
    }

    ::slotted([popover]:popover-open) {
        inset: unset;
    }

    /* Fallback for no anchor-positioning */
    @supports not (anchor-name: --menu-trigger) {
        ::slotted([popover]) {
            align-self: start;
        }
    }
}
`;

const HTML = /* html */`
<slot name="indicator">
    <span class="indicator">\ue3e8</span>
</slot>
<slot name="start"></slot>
<div part="content" class="content">
    <slot></slot>
</div>
<slot name="end"></slot>
<slot name="flyout-glyph">
    <span class="flyout-glyph">\ue412</span>
</slot>
<slot name="flyout"></slot>
`;

/**
 * 飞出菜单项组件
 * @class
 * @extends {Component}
 */
export default class MenuFlyoutItem extends Component {
    /**
     * 类型
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
        return [...super.observedAttributes, "type", "checked"];
    }

    /**
     * 指示器元素
     * @type {HTMLElement}
     */
    #indicatorEl;

    constructor() {
        super();

        this.#indicatorEl = this.shadowRoot.querySelector(".indicator");

        Object.defineProperties(this, {
            checked: {
                get: () => this.hasAttribute("checked"),
                set: overload()
                    .add([Boolean], value => {
                        if (value) {
                            if (!this.checked) {
                                if (this.type === Type.radio) {
                                    const groupName = this.getAttribute("group-name");
                                    let query = "jyo-menu-flyout-item[type=\"radio\"]";
                                    query += groupName ? `[group-name="${groupName}"]` : ":not([group-name])";
                                    this.parentElement?.querySelectorAll(query).forEach(el => {
                                        el.checked = false;
                                    });
                                }
                                this.setAttribute("checked", "");
                                this.dispatchCustomEvent("checked");
                            }
                        } else {
                            this.removeAttribute("checked");
                        }
                    })
                    .add([Number], value => this.checked = !!value)
                    .add([String], () => this.checked = true)
                    .any(() => this.checked = false)
            },
            type: genEnumGetterAndSetter(this, {
                attrName: "type",
                enumClass: Type,
                defaultValue: "default",
                fn: () => {
                    this.#calcIndent();
                    this.checked = this.checked;
                    switch (this.type) {
                        case Type.radio:
                            this.#indicatorEl.textContent = "\ue42b";
                            break;
                        case Type.checkbox:
                            this.#indicatorEl.textContent = "\ue3e8";
                            break;
                    }
                }
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        // 子菜单变化时调用
        const flyoutSlot = this.shadowRoot.querySelector("slot[name='flyout']");
        flyoutSlot.addEventListener("slotchange", () => {
            const flyout = flyoutSlot.assignedElements()?.[0];
            if (flyout) {
                flyout.setAttribute("positioning", "afterTop");
                flyout.anchor = this;
                this.internals.states.add("flyout");
            } else {
                this.internals.states.delete("flyout");
            }
        }, { signal });

        // 点击时调用
        this.addEventListener("click", e => {
            if (e.target !== this) return e.stopPropagation();
            if (this.type !== Type.default) {
                e.stopPropagation();

                switch (this.type) {
                    case Type.radio:
                        this.checked = true;
                        break;
                    case Type.checkbox:
                        this.checked = !this.checked;
                        break;
                }
            }
        }, { signal });

        // 鼠标进入时调用
        this.addEventListener("pointerenter", () => {
            this.parentElement?.querySelectorAll("jyo-menu-flyout-item").forEach(
                /**
                 * @param {MenuFlyoutItem} item
                 */
                item => {
                    item.#hideFlyout();
                });
            this.#showFlyout();
        }, { signal });
    }

    /**
     * 显示子菜单
     */
    #showFlyout() {
        const flyoutSlot = this.shadowRoot.querySelector("slot[name='flyout']");
        flyoutSlot?.assignedElements()?.[0]?.showPopover();
    }

    /**
     * 隐藏子菜单
     */
    #hideFlyout() {
        const flyoutSlot = this.shadowRoot.querySelector("slot[name='flyout']");
        flyoutSlot?.assignedElements()?.[0]?.hidePopover();
    }

    /**
     * 计算缩进
     */
    #calcIndent() {
        let indent = 0;
        if (this.shadowRoot.querySelector("slot[name='start']")?.assignedElements()?.[0]) indent++;
        if (this.type.valNumber !== 0) indent++;
        this.parentElement?.querySelectorAll("jyo-menu-flyout-item").forEach(item => {
            if (this.parentElement !== item.parentElement) return;
            let elIndent = parseInt(item.getAttribute("data-indent"));
            if (isNaN(elIndent) || elIndent > 2) elIndent = 0;
            item.setAttribute("data-indent", Math.max(elIndent, indent));
        });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();

        this.#calcIndent();
    }

    static {
        this.registerComponent({
            name: "jyo-menu-flyout-item",
            html: HTML,
            css: STYLES
        });
    }
}