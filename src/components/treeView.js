import Enum from "@jyostudio/enum";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";
import TreeViewItem from "./treeViewItem.js";

/**
 * 树视图选择模式
 * @extends {Enum}
 */
class TreeViewSelectionMode extends Enum {
    static {
        this.set({
            none: 0,
            single: 1,
            multiple: 2
        });
    }
}

const STYLES = /* css */`
:host {
    position: relative;
    display: block;
    min-width: 200px;
    width: fit-content;
    min-height: 100px;
    background-color: var(--mix-colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom: var(--strokeWidthThick) solid var(--mix-colorNeutralStroke1Hover);
    padding: var(--spacingVerticalM) var(--spacingHorizontalSNudge);
    font-size: var(--fontSizeBase200);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
    user-select: none;
    overflow-y: auto;
}

:host(:disabled), :host([disabled]) {
    background-color: var(--mix-colorNeutralBackgroundDisabled) !important;
    border-color: var(--mix-colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = /* html */`
<slot></slot>
`;

export default class TreeView extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "tree-view-selection-mode"];
    }

    /**
     * 选择的列表
     * @type {Set}
     */
    #activeList = new Set();

    /**
     * 获取选择的项目
     * @returns {Array<TreeViewItem>}
     */
    get selectedItems() {
        return Array.from(this.#activeList);
    }

    constructor() {
        super();

        Object.defineProperties(this, {
            treeViewSelectionMode: genEnumGetterAndSetter(this, {
                attrName: "treeViewSelectionMode",
                enumClass: TreeViewSelectionMode,
                defaultValue: TreeViewSelectionMode.single,
                fn: (attrName, value) => {
                    this.#changeTreeViewItem(value, this.shadowRoot.querySelector("slot"));
                    this.#activeList.forEach(item => item.internals.states.delete("active"));
                    this.#activeList.clear();
                }
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("activeSingle", event => {
            event.stopPropagation();
            if (this.treeViewSelectionMode !== TreeViewSelectionMode.single) {
                return;
            }
            event.target.dispatchEvent(new CustomEvent("active", { bubbles: true }));
        }, { signal });

        this.addEventListener("active", event => {
            event.stopPropagation();
            if (this.treeViewSelectionMode === TreeViewSelectionMode.none) {
                return;
            }
            if (this.treeViewSelectionMode === TreeViewSelectionMode.single) {
                this.#activeList.forEach(item => {
                    if (item !== event.target) {
                        item.dispatchEvent(new CustomEvent("inactive", { bubbles: true }));
                    }
                });
            }
            event.target.internals.states.add("active");
            this.#activeList.add(event.target);
        }, { signal });

        this.addEventListener("inactive", event => {
            event.stopPropagation();
            event.target.internals.states.delete("active");
            this.#activeList.delete(event.target);
        }, { signal });
    }

    /**
     * 改变树视图项目
     * @param {String} value - 选择模式
     * @param {HTMLSlotElement} slot - 插槽元素
     */
    #changeTreeViewItem(value, slot) {
        const children = slot.assignedElements({ flatten: true });
        children.forEach(child => {
            if (child instanceof TreeViewItem) {
                if (value !== TreeViewSelectionMode.multiple.description) {
                    child.internals.states.delete("show-checkbox");
                } else {
                    child.internals.states.add("show-checkbox");
                }
            }

            const slot = child.shadowRoot.querySelector("slot");
            if (slot) {
                this.#changeTreeViewItem(value, slot);
            }
        });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();
    }

    static {
        this.registerComponent({
            name: "jyo-tree-view",
            html: HTML,
            css: STYLES
        });
    }
}