import overload from "@jyostudio/overload";
import { genBooleanGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import "./checkBox.js";

const STYLES = /* css */`
:host {
    --deep: 0;
    --has-children: 0;
}

.item {
    position: relative;
    padding-inline-start: calc(14px * var(--deep));
    height: 100%;
    margin: var(--spacingVerticalXS) 0;
    border-radius: var(--borderRadiusMedium);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
    contain: paint;
    overflow: hidden;
}

.item:hover, :host(:state(active)) .item {
    background-color: var(--mix-colorNeutralBackground1Hover);
    color: var(--colorNeutralForeground1Hover);
    border-color: var(--mix-colorNeutralStroke1Hover);
}

:host(:state(active)) .item:hover {
    background-color: var(--mix-colorNeutralBackground1Selected);
}

:host(:state(active)) .item:hover:active, .item:hover:active, .item[flyout-visible] {
    background-color: var(--mix-colorNeutralBackground1Pressed);
    border-color: var(--mix-colorNeutralStroke1Pressed);
    color: var(--colorNeutralForeground1Pressed);
    outline-style: none;
}

:host(:state(active):not(:state(show-checkbox))) .item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 15%;
    width: 3px;
    height: 70%;
    border-radius: var(--borderRadiusCircular);
    background-color: var(--colorCompoundBrandBackground);
}

.content {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 24px;
    white-space: nowrap;
    word-break: break-all;
}

.checkbox {
    margin-inline-start: var(--spacingHorizontalSNudge);
    display: none;
}

:host(:state(show-checkbox)) .checkbox {
    display: inline-block;
}

.dropdown {
    position: relative;
    display: inline-flex;
    justify-content: center;
    width: 24px;
    min-width: 24px;
    height: 100%;
}

.dropdown::before {
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
    vertical-align: middle;
    text-align: center;
    transform: rotate(-90deg);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color, transform;
    transition-timing-function: var(--curveEasyEase);
}

:host(:state(has-children)) .dropdown::before {
    content: "\ue40c";
}

.children {
    display: none;
}

:host([is-expanded]) .dropdown::before {
    transform: rotate(0);
}

:host(:focus-visible) .item {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

:host(:disabled) .item, :host([disabled]) .item {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = /* html */`
<div class="item">
    <div class="content">
        <jyo-check-box class="checkbox"></jyo-check-box>
        <div class="dropdown"></div>
        <div class="title"></div>
    </div>
</div>
<div class="children">
    <slot id="children"></slot>
</div>
`;

export default class TreeViewItem extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "text", "is-expanded"];
    }

    /**
     * 项元素
     * @type {HTMLElement}
     */
    #itemEl;

    /**
     * 复选框元素
     * @type {HTMLElement}
     */
    #checkboxEl;

    /**
     * 下拉元素
     * @type {HTMLElement}
     */
    #dropdownEl;

    /**
     * 标题元素
     * @type {HTMLElement}
     */
    #titleEl;

    /**
     * 子项元素
     * @type {HTMLElement}
     */
    #childrenEl;

    /**
     * 子项插槽元素
     * @type {HTMLSlotElement}
     */
    #childrenSlotEl;

    constructor() {
        super();

        this.#itemEl = this.shadowRoot.querySelector(".item");
        this.#checkboxEl = this.shadowRoot.querySelector(".checkbox");
        this.#dropdownEl = this.shadowRoot.querySelector(".dropdown");
        this.#titleEl = this.shadowRoot.querySelector(".title");
        this.#childrenEl = this.shadowRoot.querySelector(".children");
        this.#childrenSlotEl = this.shadowRoot.querySelector("#children");

        Object.defineProperties(this, {
            text: {
                get: () => this.#titleEl.textContent,
                set: overload([String], value => {
                    this.lock("text", () => {
                        this.#titleEl.textContent = value;
                        this.setAttribute("text", value);
                    });
                }).any(() => this.text = "")
            },
            isExpanded: genBooleanGetterAndSetter(this, {
                attrName: "is-expanded",
                fn: (attrName, value) => {
                    if (value) {
                        this.#childrenEl.style.display = "block";
                    } else {
                        this.#childrenEl.style.display = "none";
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

        this.#itemEl.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("activeSingle", { bubbles: true }));
        }, { signal });

        this.#childrenSlotEl.addEventListener('slotchange', () => this.#updateNodeState(), { signal });

        this.#checkboxEl.addEventListener("click", event => {
            event.stopPropagation();
        });

        this.#dropdownEl.addEventListener("click", event => {
            event.stopPropagation();
            if (this.internals.states.has("has-children")) {
                this.isExpanded = !this.isExpanded;
            }
        }, { signal });

        this.#checkboxEl.addEventListener("checked", () => {
            this.#updateParentCheckboxState();
            if (this.internals.states.has("has-children")) {
                this.#childrenSlotEl.assignedElements({ flatten: true }).forEach(child => {
                    if (child instanceof TreeViewItem) {
                        child.#checkboxEl.isChecked = true;
                    }
                });
            }
            this.dispatchCustomEvent("active", { bubbles: true });
        }, { signal });

        this.#checkboxEl.addEventListener("indeterminate", () => {
            this.#updateParentCheckboxState();
            this.#checkboxEl.isChecked = false;
            this.dispatchCustomEvent("inactive", { bubbles: true });
        }, { signal });

        this.#checkboxEl.addEventListener("unchecked", () => {
            this.#updateParentCheckboxState();
            if (this.internals.states.has("has-children")) {
                this.#childrenSlotEl.assignedElements({ flatten: true }).forEach(child => {
                    if (child instanceof TreeViewItem) {
                        child.#checkboxEl.isChecked = false;
                    }
                });
            }
            this.dispatchCustomEvent("inactive", { bubbles: true });
        }, { signal });
    }

    /**
     * 更新父复选框状态
     */
    #updateParentCheckboxState() {
        /**
         * @type {TreeViewItem | null}
         */
        const parentElement = this.parentElement?.closest?.("jyo-tree-view-item");
        if (!parentElement || !(parentElement instanceof TreeViewItem)) return;
        const allTreeViewItems = parentElement.#childrenSlotEl.assignedElements({ flatten: true }).filter(child => child instanceof TreeViewItem);
        let checkedCount = 0;
        let indeterminateCount = 0;
        allTreeViewItems.forEach(child => {
            if (child.#checkboxEl.isChecked) {
                checkedCount++;
            } else if (child.#checkboxEl.isChecked === null) {
                indeterminateCount++;
            }
        });
        if (indeterminateCount > 0 || checkedCount > 0 && checkedCount < allTreeViewItems.length) {
            parentElement.#checkboxEl.isChecked = null;
        } else if (checkedCount === allTreeViewItems.length) {
            parentElement.#checkboxEl.isChecked = true;
        } else {
            parentElement.#checkboxEl.isChecked = false;
        }
    }

    /**
     * 更新节点状态
     */
    #updateNodeState() {
        let deep = 0;
        let el = this;
        while (el.parentElement) {
            if (el.parentElement instanceof TreeViewItem) {
                deep++;
                el = el.parentElement;
            } else {
                break;
            }
        }
        this.shadowRoot.host.style.setProperty("--deep", deep);

        if (this.#childrenSlotEl.assignedElements().length) {
            this.internals.states.add("has-children");
        } else {
            this.internals.states.delete("has-children");
        }
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        this.#initEvents();

        this.#updateNodeState();

        super.connectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}