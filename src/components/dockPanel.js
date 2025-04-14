import Component from "./component.js";
import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genBooleanGetterAndSetter, genEnumGetterAndSetter } from "../libs/utils.js";

/**
 * 面板位置枚举
 * @extends {Enum}
 */
class Position extends Enum {
    static {
        this.set({
            left: 0,
            right: 1,
            top: 2,
            bottom: 3,
            center: 4
        });
    }
}

const STYLES = /* css */`
:host {
    position: relative;
    display: grid;
    grid-template-areas: 
        "left top right"
        "left center right"
        "left bottom right";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--colorNeutralBackground1);
    color: var(--colorNeutralForeground1);
    font-family: var(--fontFamilyBase);
    contain: layout;
}

.panel-container {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 20px;
    min-height: 20px;
}

.panel-container[data-position="left"] {
    grid-area: left;
    border-right: var(--strokeWidthThin) solid var(--colorNeutralStroke2);
    width: var(--left-width, 200px);
}

.panel-container[data-position="right"] {
    grid-area: right;
    border-left: var(--strokeWidthThin) solid var(--colorNeutralStroke2);
    width: var(--right-width, 200px);
}

.panel-container[data-position="top"] {
    grid-area: top;
    border-bottom: var(--strokeWidthThin) solid var(--colorNeutralStroke2);
    height: var(--top-height, 200px);
}

.panel-container[data-position="bottom"] {
    grid-area: bottom;
    border-top: var(--strokeWidthThin) solid var(--colorNeutralStroke2);
    height: var(--bottom-height, 200px);
}

.panel-container[data-position="center"] {
    grid-area: center;
}

.panel-container[data-hidden="true"] {
    display: none;
}

.panel-header {
    display: flex;
    align-items: center;
    padding: var(--spacingHorizontalS);
    background-color: var(--colorNeutralBackground2);
    border-bottom: var(--strokeWidthThin) solid var(--colorNeutralStroke2);
    min-height: 32px;
}

.panel-title {
    flex-grow: 1;
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.panel-actions {
    display: flex;
    gap: var(--spacingHorizontalXS);
}

.panel-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--borderRadiusMedium);
    background: transparent;
    border: none;
    color: var(--colorNeutralForeground2);
    cursor: pointer;
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase200);
}

.panel-button:hover {
    background-color: var(--colorNeutralBackground3Hover);
    color: var(--colorNeutralForeground2Hover);
}

.panel-button:active {
    background-color: var(--colorNeutralBackground3Pressed);
    color: var(--colorNeutralForeground2Pressed);
}

.panel-content {
    flex: 1;
    overflow: auto;
    padding: var(--spacingVerticalS) var(--spacingHorizontalS);
}

.splitter {
    position: absolute;
    background-color: transparent;
    z-index: 1;
}

.splitter:hover {
    background-color: var(--colorNeutralStroke1Hover);
}

.splitter[data-position="left"] {
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    cursor: e-resize;
}

.splitter[data-position="right"] {
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    cursor: w-resize;
}

.splitter[data-position="top"] {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
    cursor: s-resize;
}

.splitter[data-position="bottom"] {
    left: 0;
    top: 0;
    width: 100%;
    height: 4px;
    cursor: n-resize;
}

.panel-container[data-collapsed="true"] {
    display: none;
}
`;

const HTML = /* html */`
<div class="panel-container" data-position="left">
    <slot name="left"></slot>
    <div class="splitter" data-position="left"></div>
</div>
<div class="panel-container" data-position="right">
    <slot name="right"></slot>
    <div class="splitter" data-position="right"></div>
</div>
<div class="panel-container" data-position="top">
    <slot name="top"></slot>
    <div class="splitter" data-position="top"></div>
</div>
<div class="panel-container" data-position="bottom">
    <slot name="bottom"></slot>
    <div class="splitter" data-position="bottom"></div>
</div>
<div class="panel-container" data-position="center">
    <slot name="center"></slot>
</div>
`;

export default class DockPanel extends Component {
    /**
     * 面板位置
     * @type {Position}
     */
    static get Position() {
        return Position;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [
            "left-width", "right-width", "top-height", "bottom-height",
            "left-visible", "right-visible", "top-visible", "bottom-visible"
        ];
    }

    /**
     * 动画帧ID
     * @type {number|null}
     */
    #animationFrameId = null;

    /**
     * 面板容器元素映射
     * @type {Map<Position, HTMLElement>}
     */
    #panelContainers = new Map();

    /**
     * 分割线元素映射
     * @type {Map<Position, HTMLElement>}
     */
    #splitters = new Map();

    /**
     * 当前正在拖动的分隔线
     * @type {HTMLElement|null}
     */
    #activeSplitter = null;

    /**
     * 初始拖动位置
     */
    #dragStart = { x: 0, y: 0 };

    /**
     * 初始面板大小
     */
    #initialSize = { width: 0, height: 0 };

    constructor() {
        super();

        // 初始化面板容器、分隔线的映射
        ["left", "right", "top", "bottom", "center"].forEach(pos => {
            this.#panelContainers.set(Position[pos], this.shadowRoot.querySelector(`.panel-container[data-position="${pos}"]`));

            if (pos !== "center") {
                this.#splitters.set(Position[pos], this.shadowRoot.querySelector(`.splitter[data-position="${pos}"]`));
            }
        });

        // 使用循环定义尺寸相关属性
        const sizeProps = [
            { name: "leftWidth", cssVar: "--left-width", attr: "left-width" },
            { name: "rightWidth", cssVar: "--right-width", attr: "right-width" },
            { name: "topHeight", cssVar: "--top-height", attr: "top-height" },
            { name: "bottomHeight", cssVar: "--bottom-height", attr: "bottom-height" }
        ];

        sizeProps.forEach(prop => {
            Object.defineProperty(this, prop.name, {
                get: () => this.style.getPropertyValue(prop.cssVar) || "200px",
                set: overload([String], value => {
                    this.lock(prop.name, () => {
                        this.style.setProperty(prop.cssVar, value);
                        this.setAttribute(prop.attr, value);
                    });
                }).add([Number], value => this[prop.name] = `${value}px`)
            });
        });

        // 可见性属性定义
        ["left", "right", "top", "bottom"].forEach(pos => {
            const propName = `${pos}Visible`;
            Object.defineProperty(this, propName,
                genBooleanGetterAndSetter(this, {
                    attrName: `${pos}-visible`,
                    defaultValue: true,
                    fn: () => this.#updatePanelVisibility(Position[pos])
                })
            );
        });
    }

    /**
     * 更新面板可见性
     * @param {Position} position - 面板位置
     */
    #updatePanelVisibility(position) {
        if (!this.#panelContainers.has(position)) return;

        const container = this.#panelContainers.get(position);
        const visible = this[`${position.description}Visible`];

        container.dataset.hidden = (!visible).toString();

        this.dispatchCustomEvent("visibilitychanged", {
            detail: {
                position: position.description,
                visible: visible
            }
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        // 处理分隔线拖动
        this.#splitters.forEach((splitter, position) => {
            splitter.addEventListener("pointerdown", (e) => {
                if ((e.buttons & 1) !== 1) return;
                e.preventDefault();

                this.#activeSplitter = splitter;
                this.#dragStart = { x: e.clientX, y: e.clientY };

                const container = this.#panelContainers.get(position);
                const rect = container.getBoundingClientRect();
                this.#initialSize = { width: rect.width, height: rect.height };

                document.body.style.userSelect = "none";
                document.body.style.pointerEvents = "none";
                document.documentElement.style.cursor = splitter.style.cursor;

                document.addEventListener("pointermove", this.#handlePointerMove, { signal });
                document.addEventListener("pointerup", this.#handlePointerUp, { signal, once: true });

                this.dispatchCustomEvent("resizestart", {
                    detail: { position: position.description }
                });
            }, { signal });
        });

        // 监听面板内容变化
        const slots = this.shadowRoot.querySelectorAll("slot");
        slots.forEach(slot => {
            slot.addEventListener("slotchange", (e) => {
                const slotName = slot.name;
                const assignedNodes = slot.assignedElements();

                this.dispatchCustomEvent("contentchanged", {
                    detail: {
                        position: slotName,
                        content: assignedNodes
                    }
                });

                // 如果没有内容，自动隐藏面板（中心面板除外）
                if (slotName !== "center" && assignedNodes.length === 0) {
                    this[`${slotName}Visible`] = false;
                } else {
                    this[`${slotName}Visible`] = true;
                }
            }, { signal });
        });
    }

    /**
     * 处理指针移动事件
     * @param {PointerEvent} e - 指针事件
     */
    #handlePointerMove = (e) => {
        if (!this.#activeSplitter) return;

        const position = Position.getByDescription(this.#activeSplitter.dataset.position);
        if (!position) return;

        // 使用 requestAnimationFrame 优化拖动性能
        if (this.#animationFrameId) {
            cancelAnimationFrame(this.#animationFrameId);
        }

        this.#animationFrameId = requestAnimationFrame(() => {
            const deltaX = e.clientX - this.#dragStart.x;
            const deltaY = e.clientY - this.#dragStart.y;

            switch (position) {
                case Position.left:
                    this.leftWidth = `${Math.max(10, this.#initialSize.width + deltaX)}px`;
                    break;
                case Position.right:
                    this.rightWidth = `${Math.max(10, this.#initialSize.width - deltaX)}px`;
                    break;
                case Position.top:
                    this.topHeight = `${Math.max(10, this.#initialSize.height + deltaY)}px`;
                    break;
                case Position.bottom:
                    this.bottomHeight = `${Math.max(10, this.#initialSize.height - deltaY)}px`;
                    break;
            }

            this.dispatchCustomEvent("resize", {
                detail: {
                    position: position.description,
                    size: position === Position.left || position === Position.right
                        ? this[`${position.description}Width`]
                        : this[`${position.description}Height`]
                }
            });
        });
    }

    /**
     * 处理指针抬起事件
     */
    #handlePointerUp = () => {
        if (!this.#activeSplitter) return;

        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
        document.documentElement.style.cursor = "";

        const position = Position.getByDescription(this.#activeSplitter.dataset.position);

        this.dispatchCustomEvent("resizeend", {
            detail: {
                position: position.description,
                size: position === Position.left || position === Position.right
                    ? this[`${position.description}Width`]
                    : this[`${position.description}Height`]
            }
        });

        this.#activeSplitter = null;
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.#initEvents();

        // 初始化可见性
        [Position.left, Position.right, Position.top, Position.bottom].forEach(pos => {
            this.#updatePanelVisibility(pos);
        });
    }

    /**
     * 元素从 DOM 树中移除时调用
     */
    disconnectedCallback(...params) {
        // 清理所有动画帧请求
        if (this.#animationFrameId) {
            cancelAnimationFrame(this.#animationFrameId);
        }

        document.removeEventListener("pointermove", this.#handlePointerMove);
        document.removeEventListener("pointerup", this.#handlePointerUp);

        super.disconnectedCallback?.call(this, ...params);
    }

    /**
     * 注册组件
     */
    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}