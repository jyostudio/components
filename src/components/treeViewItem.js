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

.arrow {
    position: relative;
    display: inline-flex;
    justify-content: center;
    width: 24px;
    min-width: 24px;
    height: 100%;
}

.arrow::before {
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
    vertical-align: middle;
    text-align: center;
    transform: rotate(-90deg);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color, transform;
    transition-timing-function: var(--curveEasyEase);
}

:host(:state(has-children)) .arrow::before {
    content: "\ue40c";
}

.children {
    display: none;
}

:host([is-expanded]) .arrow::before {
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

.item[draggable="true"] {
    cursor: grab;
}

.item.dragging {
    opacity: 0.5;
    cursor: grabbing;
}

.drop-insert-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--colorCompoundBrandBackground);
    pointer-events: none;
    display: none;
}

.drop-insert-line.visible {
    display: block;
}
`;

const HTML = /* html */`
<div class="item">
    <div class="drop-insert-line"></div>
    <div class="content">
        <jyo-check-box class="checkbox"></jyo-check-box>
        <div class="arrow"></div>
        <div class="title"></div>
    </div>
</div>
<div class="children">
    <slot id="children"></slot>
</div>
`;

export default class TreeViewItem extends Component {
    /**
     * 引用 Symbol
     * @type {Symbol}
     */
    static #refSymbol = Symbol("ref");

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "text", "is-expanded"];
    }

    /**
     * 被拖动的项
     * @type {TreeViewItem}
     */
    static #draggedItem;

    /**
     * 项元素
     * @type {HTMLElement}
     */
    #itemEl;

    /**
     * 拖拽插入线元素
     * @type {HTMLElement}
     */
    #dropLineEl;

    /**
     * 复选框元素
     * @type {HTMLElement}
     */
    #checkboxEl;

    /**
     * 箭头元素
     * @type {HTMLElement}
     */
    #arrowEl;

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

    /**
     * 所有子树视图项
     * @returns {TreeViewItem}
     */
    get #allChildTreeViewItems() {
        return this.#childrenSlotEl.assignedElements({ flatten: true }).filter(item => item instanceof TreeViewItem);
    }

    constructor() {
        super();

        this.#itemEl = this.shadowRoot.querySelector(".item");
        this.#dropLineEl = this.shadowRoot.querySelector(".drop-insert-line");
        this.#checkboxEl = this.shadowRoot.querySelector(".checkbox");
        this.#arrowEl = this.shadowRoot.querySelector(".arrow");
        this.#titleEl = this.shadowRoot.querySelector(".title");
        this.#childrenEl = this.shadowRoot.querySelector(".children");
        this.#childrenSlotEl = this.shadowRoot.querySelector("#children");

        this.shadowRoot.querySelectorAll("*").forEach(el => {
            el[TreeViewItem.#refSymbol] = this;
        });

        this.#itemEl.draggable = true; // 启用拖拽

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

        this.#arrowEl.addEventListener("click", event => {
            event.stopPropagation();
            if (this.internals.states.has("has-children")) {
                this.isExpanded = !this.isExpanded;
            }
        }, { signal });

        this.#checkboxEl.addEventListener("checked", () => {
            this.#updateParentCheckboxState();
            if (this.internals.states.has("has-children")) {
                this.#allChildTreeViewItems.forEach(child => {
                    child.#checkboxEl.isChecked = true;
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
                this.#allChildTreeViewItems.forEach(child => {
                    child.#checkboxEl.isChecked = false;
                });
            }
            this.dispatchCustomEvent("inactive", { bubbles: true });
        }, { signal });

        this.#initDragEvents();
    }

    /**
     * 初始化拖拽事件
     */
    #initDragEvents() {
        const signal = this.abortController.signal;

        // 拖拽开始
        this.#itemEl.addEventListener("dragstart", e => {
            TreeViewItem.#draggedItem = this;
            e.dataTransfer.setData("text/plain", this.dataset.id || this.text);
            this.#itemEl.classList.add("dragging");
            this.dispatchCustomEvent("dragstart", { detail: this });
        }, { signal });

        // 拖拽结束
        this.#itemEl.addEventListener("dragend", () => {
            this.#itemEl.classList.remove("dragging");
            this.#dropLineEl.classList.remove("visible");
            this.dispatchCustomEvent("dragend");
            TreeViewItem.#draggedItem = null;
        }, { signal });

        // 拖拽进入
        this.#itemEl.addEventListener("dragover", e => {
            e.preventDefault();
            if (!this.#isValidDropTarget(e)) return;

            const { position, offsetY } = this.#calcDropPosition(e);
            this.#showDropIndicator(position, offsetY);
        }, { signal });

        // 拖拽离开
        this.#itemEl.addEventListener("dragleave", () => {
            this.#dropLineEl.classList.remove("visible");
        }, { signal });

        // 放置处理
        this.#itemEl.addEventListener("drop", e => {
            e.preventDefault();
            const draggedItem = TreeViewItem.#draggedItem; // 获取被拖动的元素

            if (!this.#isValidDropTarget(e)) return;

            this.#handleDrop(draggedItem, e);
            this.#dropLineEl.classList.remove("visible");
        }, { signal });
    }

    /**
     * 判断目标元素是否是当前元素的子代
     * @param {TreeViewItem} parent 父元素
     * @param {TreeViewItem} child 子元素
     * @returns {boolean}
     */
    #isDescendant(parent, child) {
        let node = child;
        while (node) {
            node = node.parentElement?.closest?.("jyo-tree-view-item");
            if (node === parent) return true;
            if (!node) break;
        }
        return false;
    }

    /**
     * 判断是否是有效放置目标
     */
    #isValidDropTarget() {
        const draggedItem = TreeViewItem.#draggedItem;
        if (!draggedItem || draggedItem === this) return false;
        return !this.#isDescendant(draggedItem, this);
    }

    /**
     * 计算放置位置
     */
    #calcDropPosition(e) {
        const rect = this.#itemEl.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const threshold = rect.height / 3;

        return {
            position: offsetY < threshold ? "before" :
                offsetY > rect.height - threshold ? "after" : "inside",
            offsetY
        };
    }

    /**
     * 显示放置指示线
     */
    #showDropIndicator(position, offsetY) {
        this.#dropLineEl.style.transform = `translateY(${offsetY}px)`;
        this.#dropLineEl.classList.toggle("visible", position !== "inside");
    }

    /**
     * 处理放置操作
     */
    #handleDrop(draggedItem, e) {
        const { position } = this.#calcDropPosition(e);
        const originalParent = draggedItem.parentElement?.closest("jyo-tree-view-item");

        if (position === "before" || position === "after") {
            this.#moveSibling(draggedItem, position);
        } else if (position === "inside") {
            this.#moveToChildren(draggedItem);
        }

        // 更新所有相关节点的状态
        originalParent?.#updateNodeState();
        this.#updateNodeState();
        draggedItem.#updateNodeState();
        this.#childrenSlotEl.assignedElements({ flatten: true })
            .filter(item => item instanceof TreeViewItem)
            .forEach(item => item.#updateNodeState());

        this.dispatchCustomEvent("drop", {
            detail: {
                draggedItem,
                target: this,
                position
            },
            bubbles: true
        });
    }

    /**
       * 移动为兄弟节点
       */
    #moveSibling(draggedItem, position) {
        const referenceNode = position === "before" ? this : this.nextElementSibling;
        this.parentElement.insertBefore(draggedItem, referenceNode);
    }

    /**
     * 移动为子节点
     */
    #moveToChildren(draggedItem) {
        if (!this.isExpanded) this.isExpanded = true;
        this.#childrenSlotEl.appendChild(draggedItem);
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

        // 更新子节点状态
        const hasChildren = this.#childrenSlotEl.assignedElements().length > 0;
        if (hasChildren) {
            this.internals.states.add("has-children");
        } else {
            this.internals.states.delete("has-children");
        }
        this.#updateParentCheckboxState();
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback.call(this, ...params);

        this.#initEvents();

        this.#updateNodeState();
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}