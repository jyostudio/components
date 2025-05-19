import overload from "@jyostudio/overload";
import Component from "./component.js";
import MenuFlyout from "./menuFlyout.js";
import ComboBoxItem from "./comboBoxItem.js";

const STYLES = /* css */`
:host {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    justify-content: space-between;
    contain: paint;
    overflow: hidden;
    min-width: 80px;
    min-height: 32px;
    padding: 0 var(--spacingHorizontalM);
    padding-inline-end: var(--spacingHorizontalXS);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom-color: var(--mix-colorNeutralStroke1Hover);
    border-radius: var(--borderRadiusMedium);
    outline-style: none;
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    text-decoration-line: none;
    color: var(--colorNeutralForeground1);
    background-color: var(--mix-colorNeutralBackground1);
    transition: background-color var(--durationFaster) var(--curveEasyEase),
                border-color var(--durationFaster) var(--curveEasyEase),
                color var(--durationFaster) var(--curveEasyEase);
    user-select: none;
}

.hiddenContent, .content {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hiddenContent {
    opacity: 0;
}

.content {
    position: absolute;
    top: 50%;
    left: var(--spacingHorizontalM);
    width: calc(100% - var(--spacingHorizontalM) - 42px);
    transform: translateY(-50%);
}

.dropdown {
    margin-inline-start: var(--spacingHorizontalS);
    min-width: 30px;
    width: 30px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
    vertical-align: middle;
    border-radius: var(--borderRadiusMedium);
    pointer-events: none;
}

.anchor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

:host(:hover) {
    background-color: var(--mix-colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
}

:host(:hover:active),
:host([flyout-visible]) {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
}

:host(:disabled),
:host([disabled]) {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = /* html */`
<div class="hiddenContent"></div>
<div class="content"></div>
<span class="dropdown">\ue40c</span>
<div class="anchor">
    <jyo-menu-flyout positioning="belowStart">
        <slot></slot>
    </jyo-menu-flyout>
</div>
`;

/**
 * 下拉框组件
 * @class
 * @extends {Component}
 */
export default class ComboBox extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "selected-index", "selected-item", "is-editable"];
    }

    /**
     * 隐藏内容元素
     * @type {HTMLElement}
     */
    #hiddenContentEl;

    /**
     * 内容元素
     * @type {HTMLElement}
     */
    #contentEl;

    /**
     * 锚点元素
     * @type {HTMLElement}
     */
    #anchorEl;

    /**
     * 菜单飞出元素
     * @type {MenuFlyout}
     */
    #menuFlyoutEl;

    /**
     * 插槽的中止控制器
     * @type {AbortController}
     */
    #slotAbortController;

    /**
     * 选中的项
     * @type {ComboBoxItem}
     */
    #selectedItem = null;

    /**
     * 选中的索引
     * @type {Number}
     */
    #selectedIndex = -1;

    constructor() {
        super();

        this.#hiddenContentEl = this.shadowRoot.querySelector(".hiddenContent");
        this.#contentEl = this.shadowRoot.querySelector(".content");
        this.#anchorEl = this.shadowRoot.querySelector(".anchor");
        this.#menuFlyoutEl = this.shadowRoot.querySelector("jyo-menu-flyout");
        this.#menuFlyoutEl.anchor = this.shadowRoot.querySelector(".anchor");

        Object.defineProperties(this, {
            selectedItem: {
                get: () => this.#selectedItem,
                set: overload()
                    .add([[ComboBoxItem, null]], value => {
                        if (value === this.#selectedItem) return;
                        const oldItem = this.#selectedItem;
                        this.#selectedItem?.removeAttribute("selected");
                        this.#selectedItem = value;
                        this.#selectedItem?.setAttribute("selected", "");
                        this.#selectedIndex = Array.from(this.children).indexOf(value);
                        this.#contentEl.textContent = value?.textContent ?? "";
                        this.dispatchCustomEvent("selectionchanged", {
                            detail: {
                                oldItem,
                                newItem: value
                            }
                        });
                    })
                    .any(() => this.#selectedItem = null)
            },
            selectedIndex: {
                get: () => this.#selectedIndex,
                set: overload()
                    .add([Number], value => {
                        if (value === this.#selectedIndex) return;
                        this.#selectedIndex = value;
                        const items = Array.from(this.children);
                        if (value < 0 || value >= items.length) {
                            this.selectedItem = null;
                            return
                        }
                        this.selectedItem = items[value];
                    })
                    .any(() => this.selectedItem = null)
            }
        });
    }

    /**
     * 绑定事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", () => {
            this.#slotAbortController?.abort();
            this.#slotAbortController = new AbortController();
            const els = slot.assignedElements().filter(el => el instanceof ComboBoxItem);

            if (!els.length) {
                this.selectedItem = null;
                return;
            }

            let hasNowSelected = false;
            let maxLenStr = "";
            els.forEach(el => {
                const currentSelected = el === this.selectedItem;
                hasNowSelected ||= currentSelected;
                if (currentSelected) {
                    el.setAttribute("selected", "");
                } else {
                    el.removeAttribute("selected");
                }
                el.addEventListener("click", () => {
                    el.setAttribute("selected", "");
                    this.selectedItem = el;
                    this.#menuFlyoutEl.close();
                }, { signal: this.#slotAbortController.signal });

                const text = el.textContent;
                if (text.length > maxLenStr.length) {
                    maxLenStr = text;
                }
            });

            this.#hiddenContentEl.textContent = maxLenStr;
            if (!hasNowSelected) {
                els[0].click();
            }
        }, { signal });

        this.#menuFlyoutEl.addEventListener("toggle", e => {
            if (e.newState === "open") {
                this.#menuFlyoutEl.style.minWidth = `${this.#anchorEl.offsetWidth}px`;
                this.setAttribute("flyout-visible", "");
                this.dispatchCustomEvent("dropdownopened");
            } else {
                this.removeAttribute("flyout-visible");
                this.dispatchCustomEvent("dropdownclosed");
            }
        }, { signal });

        this.addEventListener("click", () => {
            this.#menuFlyoutEl.toggle();
        }, { signal });

        this.addEventListener("keydown", e => {
            const index = this.selectedIndex;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                this.selectedIndex = index + 1;
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                this.selectedIndex = index - 1;
            }

            if (!this.selectedItem) {
                this.selectedIndex = index;
            }
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback() {
        super.connectedCallback?.();

        this.#initEvents();
    }

    /**
     * 元素从 DOM 中移除时调用
     */
    disconnectedCallback() {
        this.#slotAbortController?.abort();
        this.#slotAbortController = null;

        super.disconnectedCallback?.();
    }

    static {
        this.registerComponent({
            name: "jyo-combo-box",
            html: HTML,
            css: STYLES
        });
    }
}