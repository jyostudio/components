import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genBooleanGetterAndSetter } from "../libs/utils.js";
import "./acrylic.js";
import Component from "./component.js";

const STYLES = /* css */`
:host {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    max-width: 100%;
    max-height: 100%;
    min-width: 200px;
    min-height: 50px;
}

:host([maximized]),
:host([native]) {
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
}

:host([transition]) {
    transition-duration: var(--durationFaster);
    transition-property: left, top, scale, width, height;
    transition-timing-function: var(--curveEasyEase);
}

.window {
    --titleBarHeight: 32px;
    --titleBarHeightLarge: 48px;
    --borderColor: var(--colorNeutralStrokeDisabled);
    position: relative;
    width: 100%;
    height: 100%;
    border: var(--strokeWidthThin) solid var(--colorNeutralStrokeDisabled);
    border-radius: var(--borderRadiusXLarge);
    box-shadow: var(--shadow64);
    color: var(--colorNeutralForeground1);
    font-family: var(----fontFamilyBase);
    contain: paint;
    overflow: hidden;
    transition-duration: var(--durationFaster);
    transition-property: scale, opacity;
    transition-timing-function: var(--curveEasyEase);
    touch-action: none;
}

.window[closing] {
    opacity: 0;
    pointer-events: none;
    scale: 0.9;
}

:host([maximized]) .window,
:host([native]) .window {
    border-radius: 0;
    border: none;
}

:host([active]) .window {
    --borderColor: var(--colorCompoundBrandStroke);
    border-color: var(--colorCompoundBrandStroke);
}

.window .titleBar {
    position: relative;
    width: 100%;
    height: var(--titleBarHeight);
    display: flex;
    white-space: nowrap;
    word-break: keep-all;
}

.window .titleBar .moveArea {
    position: absolute;
    inset: 0;
}

:host([can-move="false"]) .window .titleBar .moveArea {
    pointer-events: none;
}

:host([native]) .window .titleBar .moveArea {
    app-region: drag;
    user-select: none;
}

:host([custom-title-bar]) .window .titleBar {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    app-region: no-drag;
}

:host([custom-title-bar]) .window .titleBar,
:host([show-btn-back]) .window .titleBar {
    height: var(--titleBarHeightLarge);
}

:host([hide-title-bar]) .window .titleBar {
    display: none;
}

.window .titleBar .titleContentFrame {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    pointer-events: none;
    contain: paint;
    overflow: hidden;
    z-index: 1;
}

.window .titleBar .titleContentFrame .titleContent {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
}

:host([custom-title-bar]) .window .titleBar .titleContentFrame .titleContent {
    display: none;
}

.window .titleBar .titleContentFrame .titleContent * {
    app-region: no-drag;
}

.window .titleBar .titleContentFrame .titleContent .btn {
    display: none;
    width: 40px;
    height: 36px;
    min-width: 40px;
    min-height: 36px;
    line-height: 36px;
    text-align: center;
    margin-inline-start: var(--spacingHorizontalXS);
    font-family: "FluentSystemIcons-Resizable";
    font-size: 12px;
    border-radius: var(--borderRadiusMedium);
    pointer-events: auto;
}

:host([can-back]) .window .titleBar .titleContentFrame .titleContent .btn:hover {
    background-color: var(--colorNeutralBackground2Hover);
    color: var(--colorNeutralForeground2Hover);
    border-color: var(--colorNeutralStroke2Hover);
}

:host([can-back]) .window .titleBar .titleContentFrame .titleContent .btn:hover:active {
    background-color: var(--colorNeutralBackground2Pressed);
    border-color: var(--colorNeutralStroke2Pressed);
    color: var(--colorNeutralForeground2Pressed);
}

:host([show-btn-back]) .window .titleBar .titleContentFrame .titleContent .btnBack {
    display: inline-block;
    color: var(--colorNeutralForegroundDisabled);
}

:host([can-back]) .window .titleBar .titleContentFrame .titleContent .btnBack {
    color: var(--colorNeutralForeground1);
}

.window .titleBar .titleContentFrame .titleContent .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-inline-start: var(--spacingHorizontalL);
    font-family: "FluentSystemIcons-Resizable";
    font-size: 16px;
}

:host([show-btn-back]) .window .titleBar .titleContentFrame .titleContent .icon {
    margin-inline-start: var(--spacingHorizontalXS);
}

.window .titleBar .titleContentFrame .titleContent .icon img,
.window .titleBar .titleContentFrame .titleContent .icon svg,
.window .titleBar .titleContentFrame .titleContent .icon picture {
    width: 100%;
    height: 100%;
}

.window .titleBar .titleContentFrame .titleContent .title {
    display: inline-block;
    margin-inline-start: var(--spacingHorizontalL);
    font-size: 12px;
}

.window .titleBar .titleActions {
    padding-inline-start: var(--spacingHorizontalL);
    font-size: 0;
    pointer-events: none;
    z-index: 1;
}

.window .titleBar .titleActions * {
    app-region: no-drag;
}

.window .titleBar .titleActions .action {
    width: 46px;
    height: 100%;
    font-family: "FluentSystemIcons-Resizable";
    font-size: 12px;
    color: var(--colorNeutralForeground3);
    pointer-events: auto;
}

.window .titleBar .titleActions .action:hover {
    background-color: var(--borderColor);
    color: var(--colorNeutralForeground3Hover);
}

.window .titleBar .titleActions .action:hover:active {
    background-color: var(--borderColor) !important;
}

:host([active]) .window .titleBar .titleActions .action {
    color: var(--colorNeutralForeground1);
}

:host([active]) .window .titleBar .titleActions .action:hover {
    background-color: var(--colorCompoundBrandStrokeHover);
    color: var(--colorBrandBackgroundInverted);
}

.window .titleBar .titleActions .action.actionRestore {
    display: none;
}

:host([maximized]) .window .titleBar .titleActions .action.actionRestore {
    display: inline-block;
}

:host([maximized]) .window .titleBar .titleActions .action.actionMax,
:host([can-maximize="false"]) .window .titleBar .titleActions .action.actionMax,
:host([can-maximize="false"]) .window .titleBar .titleActions .action.actionRestore {
    display: none;
}

:host([can-minimize="false"]) .window .titleBar .titleActions .action.actionMin {
    display: none;
}

:host([can-close="false"]) .window .titleBar .titleActions .action.actionClose {
    display: none;
}

.window .titleBar .titleActions .action.actionClose:hover {
    background-color: var(--colorStatusDangerBackground3Hover) !important;
}

.window .titleBar .titleActions .action.actionClose:hover:active {
    background-color: var(--colorStatusDangerBackground3Pressed) !important;
}

.window .content {
    position: relative;
    width: 100%;
    height: calc(100% - var(--titleBarHeight));
    box-sizing: border-box;
    overflow: auto;
    touch-action: pan-x pan-y;
}

:host([custom-title-bar]) .window .content {
    position: absolute;
    height: 100%;
}

.resizeHandleFrame {
    pointer-events: none;
}

:host([maximized]) .resizeHandleFrame,
:host([minimized]) .resizeHandleFrame,
:host([can-resizable="false"]) .resizeHandleFrame,
:host([native]) .resizeHandleFrame {
    display: none !important;
}

.resizeHandle {
    position: absolute;
    pointer-events: auto;
    touch-action: none;
}

.resizeHandle.left {
    left: -8px;
    top: 0;
    width: 10px;
    height: 100%;
    cursor: w-resize;
}

.resizeHandle.right {
    left: calc(100% - 2px);
    top: 0;
    width: 10px;
    height: 100%;
    cursor: e-resize;
}

.resizeHandle.top {
    left: 0;
    top: -8px;
    width: 100%;
    height: 10px;
    cursor: n-resize;
}

.resizeHandle.bottom {
    left: 0;
    top: calc(100% - 2px);
    width: 100%;
    height: 10px;
    cursor: s-resize;
}

.resizeHandle.leftTop {
    left: -8px;
    top: -8px;
    width: 10px;
    height: 10px;
    cursor: nw-resize;
}

.resizeHandle.rightTop {
    left: calc(100% - 2px);
    top: -8px;
    width: 10px;
    height: 10px;
    cursor: ne-resize;
}

.resizeHandle.leftBottom {
    left: -8px;
    top: calc(100% - 2px);
    width: 10px;
    height: 10px;
    cursor: sw-resize;
}

.resizeHandle.rightBottom {
    left: calc(100% - 2px);
    top: calc(100% - 2px);
    width: 10px;
    height: 10px;
    cursor: se-resize;
}
`;

const HTML = /* html */`
<div class="window">
    <slot name="background" aria-hidden="true">
        <jyo-acrylic></jyo-acrylic>
    </slot>
    <div class="titleBar">
        <div class="moveArea"></div>
        <div class="titleContentFrame">
            <div class="titleContent">
                <button type="button" title="返回" class="btn btnBack">\ue0f5</button>
                <div class="icon">
                    <slot name="icon">\ue25f</slot>
                </div>
                <div class="title">
                    <slot name="title"></slot>
                </div>
            </div>
        </div>
        <div class="titleActions">
            <button type="button" title="最小化" class="action actionMin">\uea01</button>
            <button type="button" title="最大化" class="action actionMax">\ueac1</button>
            <button type="button" title="还原" class="action actionRestore">\uef3f</button>
            <button type="button" title="关闭" class="action actionClose">\ue5fd</button>
        </div>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>
<div class="resizeHandleFrame"></div>
`;

/**
 * 窗口状态枚举
 * @extends {Enum}
 */
class WindowState extends Enum {
    static {
        this.set({
            normal: 0, // 正常
            maximized: 1, // 最大化
            minimized: 2 // 最小化
        });
    }
}

/**
 * 窗口组件
 * @class
 * @extends {Component}
 */
export default class Window extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "left", "top", "location", "width", "height", "size", "can-move", "z-index", "minimize-target", "can-back", "topmost"];
    }

    /**
     * 已打开的窗口
     * @type {Array<Window>}
     */
    static #openWindows = [];

    /**
     * 普通窗口
     * @type {Array<Window>}
     */
    static #normalWindows = [];

    /**
     * 最顶层窗口
     * @type {Array<Window>}
     */
    static #topmostWindows = [];

    /**
     * 焦点窗口
     * @type {Window?}
     */
    static #activeWindow = null;

    /**
     * 最后一次移动位置
     * @type {{x:number,y:number}?}
     */
    static #movingLastLocation = null;

    /**
     * 尺寸调整函数
     * @type {Function?}
     */
    static #resizeFn = null;

    /**
     * 计数器
     * @type {Number}
     */
    static #counter = 0;

    /**
     * 窗口起始深度
     * @type {Number}
     */
    static #startZIndex = 1000000;

    /**
     * 根ID
     */
    #rootId = Symbol();

    /**
     * 窗口当前位置
     * @type {{x:number,y:number}?}
     */
    #currentLocation = { x: 0, y: 0 };

    /**
     * 是否可移动
     * @type {Boolean}
     */
    #canMove = true;

    /**
     * 窗口深度
     * @type {Number}
     */
    #zIndex = 0;

    /**
     * 标题栏元素
     * @type {HTMLElement}
     */
    #titleBarEl = null;

    /**
     * 移动区域元素
     * @type {HTMLElement}
     */
    #moveAreaEl = null;

    /**
     * 最小化目标
     * @type {HTMLElement}
     */
    #minimizeTarget = null;

    /**
     * 动态样式表
     * @type {CSSStyleSheet}
     */
    #dynamicStyle = new CSSStyleSheet();

    /**
     * 获取父元素
     * @type {HTMLElement}
     */
    get #parent() {
        return this.parentElement;
    }

    /**
     * 获取当前是否为激活窗口
     * @type {Boolean}
     */
    get isActive() {
        return this === Window.#activeWindow;
    }

    /**
     * 获取当前窗口状态
     * @type {WindowState}
     */
    get windowState() {
        return this.hasAttribute("maximized")
            ? WindowState.maximized
            : this.hasAttribute("minimized")
                ? WindowState.minimized
                : WindowState.normal;
    }

    /**
     * 获取当前是否在 Native 环境中
     * @type {Boolean}
     */
    get isNative() {
        return this.getAttribute("native") !== null;
    }

    /**
     * 获取是否显示返回按钮
     * @type {Boolean}
     */
    get showBtnBack() {
        return this.getAttribute("show-btn-back") !== null;
    }

    /**
     * 获取是否可返回
     * @type {Boolean}
     */
    get canBack() {
        return this.getAttribute("can-back") !== null;
    }

    /**
     * 获取是否为自定义标题栏
     * @type {Boolean}
     */
    get customTitle() {
        return this.getAttribute("custom-title-bar") !== null;
    }

    /**
     * 获取是否隐藏标题栏
     * @type {Boolean}
     */
    get hideTitleBar() {
        return this.getAttribute("hide-title-bar") !== null;
    }

    /**
     * 获取是否可调整大小
     * @type {Boolean}
     */
    get canResizable() {
        return this.getAttribute("can-resizable") !== "false";
    }

    /**
     * 获取是否可最大化
     * @type {Boolean}
     */
    get canMaximize() {
        return this.getAttribute("can-maximize") !== "false";
    }

    /**
     * 获取是否可最小化
     * @type {Boolean}
     */
    get canMinimize() {
        return this.getAttribute("can-minimize") !== "false";
    }

    /**
     * 获取是否可关闭
     * @type {Boolean}
     */
    get canClose() {
        return this.getAttribute("can-close") !== "false";
    }

    /**
     * 重排窗口
     */
    static #resort() {
        // 分别对普通窗口和置顶窗口进行排序
        const baseSort = (a, b) => {
            const [aZIndex, bZIndex] = [a.zIndex, b.zIndex];
            if (a === Window.#activeWindow) return 1;
            if (b === Window.#activeWindow) return -1;
            if (aZIndex > bZIndex) return 1;
            if (aZIndex < bZIndex) return -1;
            return 0;
        };

        Window.#normalWindows.sort(baseSort);
        Window.#topmostWindows.sort(baseSort);

        // 合并数组并设置层级（置顶窗口始终在上层）
        const merged = [...Window.#normalWindows, ...Window.#topmostWindows];
        merged.forEach((win, index) => win.zIndex = index);
    }

    constructor() {
        super();

        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, this.#dynamicStyle];
        this.#titleBarEl = this.shadowRoot.querySelector(".titleBar");
        this.#moveAreaEl = this.#titleBarEl.querySelector(".moveArea");

        this.#initResizeHandle();

        Object.defineProperties(this, {
            left: {
                get: () => this.#currentLocation.x,
                set: overload()
                    .add([Number], async function (value) {
                        this.lock("left", () => {
                            this.#currentLocation.x = value;
                            this.style.left = `${value}px`;
                            this.#convergeLocation();
                            this.setAttribute("left", value);
                        });
                    })
                    .add(
                        [String],
                        /**
                         * @this {Window} 
                         */
                        async function (value) {
                            const realParent = this.#parent;
                            if (value === "center") {
                                this.left = (realParent.clientWidth - this.width) / 2;
                            } else {
                                this.left = parseInt(value);
                            }
                        }
                    )
                    .add([null], () => this.left = 0)
            },
            top: {
                get: () => this.#currentLocation.y,
                set: overload()
                    .add([Number], async function (value) {
                        this.lock("top", () => {
                            this.#currentLocation.y = value;
                            this.style.top = `${value}px`;
                            this.#convergeLocation();
                            this.setAttribute("top", value);
                        });
                    })
                    .add(
                        [String],
                        /**
                         * @this {Window} 
                         */
                        async function (value) {
                            const realParent = this.#parent;
                            if (value === "center") {
                                this.top = (realParent.clientHeight - this.height) / 2;
                            } else {
                                this.top = parseInt(value);
                            }
                        }
                    )
                    .add([null], () => this.top = 0)
            },
            location: {
                get: () => ({ x: this.left, y: this.top }),
                set: overload()
                    .add(
                        [String],
                        /**
                         * @this {Window} 
                         */
                        function (value) {
                            try {
                                this.location = (0, eval)(`(${value})`);
                            } catch {
                                if (value === "") {
                                    this.location = { x: 0, y: 0 };
                                } else if (value === "center") {
                                    this.left = "center";
                                    this.top = "center";
                                }
                            }
                            this.removeAttribute("location");
                        }
                    )
                    .add([null], () => { })
                    .add(
                        [Object],
                        /**
                         * @this {Window} 
                         */
                        function (value) {
                            this.left = value.x ?? 0;
                            this.top = value.y ?? 0;
                            this.removeAttribute("location");
                        }
                    )
                    .any(() => { })
            },
            width: {
                get: () => this.offsetWidth,
                set: overload()
                    .add([Number], function (value) {
                        this.lock("width", () => {
                            this.style.width = `${value}px`;
                            this.setAttribute("width", value);
                        });
                    })
                    .add([String], function (value) {
                        try {
                            this.width = parseInt(value);
                        } catch {
                            console.error("Window.width: Invalid value.");
                        }
                    })
                    .add([null], () => this.width = 640)
            },
            height: {
                get: () => this.offsetHeight,
                set: overload()
                    .add([Number], function (value) {
                        this.lock("height", () => {
                            this.style.height = `${value}px`;
                            this.setAttribute("height", value);
                        });
                    })
                    .add([String], function (value) {
                        try {
                            this.height = parseInt(value);
                        } catch {
                            console.error("Window.height: Invalid value.");
                        }
                    })
                    .add([null], () => this.height = 480)
            },
            size: {
                get: () => ({ width: this.width, height: this.height }),
                set: overload()
                    .add([String], function (value) {
                        try {
                            this.size = (0, eval)(`(${value})`);
                        } catch {
                            console.error("Window.size: Invalid value.");
                        }
                    })
                    .add([null], () => { })
                    .add(
                        [Object],
                        /**
                         * @this {Window} 
                         */
                        function (value) {
                            this.width = value.width ?? 640;
                            this.height = value.height ?? 480;
                            this.removeAttribute("size");
                        }
                    )
                    .any(() => { })
            },
            canMove: {
                get: () => this.#canMove,
                set: overload([Boolean], function (value) {
                    this.lock("canMove", () => {
                        this.#canMove = value;
                        this.setAttribute("can-move", value);
                    });
                }).any(() => {
                    this.lock("canMove", () => {
                        this.#canMove = true;
                        this.removeAttribute("can-move");
                    });
                })
            },
            zIndex: {
                get: () => this.#zIndex,
                set: overload([Number], function (value) {
                    this.lock("zIndex", () => {
                        this.#zIndex = value;
                        this.style.zIndex = Window.#startZIndex + this.zIndex;
                        Window.#resort();
                        this.setAttribute("z-index", this.style.zIndex);
                    });
                }).any(() => { })
            },
            minimizeTarget: {
                get: () => this.#minimizeTarget || this.#parent,
                set: overload()
                    .add([[HTMLElement, null]], function (value) {
                        this.lock("minimizeTarget", () => {
                            this.#minimizeTarget = value;
                            if (!value) {
                                this.removeAttribute("minimize-target");
                            } else {
                                this.setAttribute("minimize-target", value?.selector ?? "[Anonymous Element]");
                            }
                        });
                    })
                    .add([String], function (value) {
                        this.lock("minimizeTarget", () => {
                            if (value === "") {
                                this.#minimizeTarget = null;
                                this.removeAttribute("minimize-target");
                                return;
                            }
                            this.#minimizeTarget = document.querySelector(value);
                            if (!this.#minimizeTarget) {
                                this.removeAttribute("minimize-target");
                            } else {
                                this.setAttribute("minimize-target", value);
                            }
                        });
                    })
            },
            topmost: genBooleanGetterAndSetter(this, {
                attrName: "topmost",
                fn: (domAttrName, value) => this.#setTopmost(value)
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.shadowRoot.querySelector(".actionMin").addEventListener("click", this.minimize.bind(this), { signal });
        this.shadowRoot.querySelector(".actionMax").addEventListener("click", this.maximize.bind(this), { signal });
        this.shadowRoot.querySelector(".actionRestore").addEventListener("click", this.restore.bind(this), { signal });
        this.shadowRoot.querySelector(".actionClose").addEventListener("click", this.close.bind(this), { signal });
        this.shadowRoot.querySelectorAll(".btn").forEach(btn => {
            btn.addEventListener("dblclick", e => e.stopPropagation(), { signal });
            btn.addEventListener("pointerdown", e => {
                e.stopPropagation();
                this.active();
            }, { signal });
        });
        this.shadowRoot.querySelector(".btnBack").addEventListener("click", () => {
            if (!this.canBack) return;
            this.active();
            this.dispatchCustomEvent("back", {
                cancelable: false
            });
        }, { signal });

        this.addEventListener("pointerdown", (e) => {
            this.active();
            e.stopPropagation();
        }, { signal });

        this.#moveAreaEl.addEventListener("pointerdown", this.moveBegin.bind(this), { signal });

        this.#titleBarEl.addEventListener("dblclick", e => {
            if (e.target.closest(".action")) return;
            if (!this.canMaximize) return;
            this.windowState === WindowState.maximized ? this.restore() : this.maximize();
        }, { signal });
    }

    /**
     * 初始化调整大小句柄
     */
    #initResizeHandle() {
        const leftRegx = /^left/i;
        const rightRegx = /^right/i;
        const topRegx = /top$/i;
        const bottomRegx = /bottom$/i;
        ["left", "top", "right", "bottom", "leftTop", "rightTop", "leftBottom", "rightBottom"].forEach(name => {
            const resizeHandle = document.createElement("div");
            resizeHandle.classList.add("resizeHandle");
            resizeHandle.classList.add(name);
            resizeHandle[this.#rootId] = (x, y) => {
                const clientRect = this.getBoundingClientRect();
                const winOffsetWidth = this.width;
                const winOffsetHeight = this.height;

                let newLeft = this.left;
                let newTop = this.top;
                let newWidth = winOffsetWidth;
                let newHeight = winOffsetHeight;

                if (leftRegx.test(name)) {
                    const ox = Math.floor(x - clientRect.left);
                    newLeft += ox;
                    newWidth -= ox;
                    if (newLeft < 0) {
                        newWidth = this.width;
                    }
                }

                if (rightRegx.test(name)) {
                    newWidth = Math.floor(clientRect.width + x - clientRect.right);
                }

                if (topRegx.test(name)) {
                    const oy = Math.floor(y - clientRect.top);
                    newTop += oy;
                    newHeight -= oy;
                    if (newTop < 0) {
                        newHeight = this.height;
                    }
                }

                if (bottomRegx.test(name)) {
                    newHeight = Math.floor(clientRect.height + y - clientRect.bottom);
                }

                this.width = newWidth;
                this.height = newHeight;

                if (newWidth > 0 && this.width !== winOffsetWidth) this.left = newLeft;
                if (newHeight > 0 && this.height !== winOffsetHeight) this.top = newTop;

                if (this.width !== winOffsetWidth || this.height !== winOffsetHeight) {
                    this.dispatchCustomEvent("resize");
                }
            };
            resizeHandle.addEventListener("pointerdown", e => {
                if ((e.buttons & 1) !== 1) return;
                this.active();
                Window.#resizeFn = e.target[this.#rootId].bind(this);
                document.body.style.pointerEvents = "none";
                document.documentElement.style.cursor = document.defaultView.getComputedStyle(e.target).cursor;
                this.dispatchCustomEvent("resizebegin");
            });
            this.shadowRoot.querySelector(".resizeHandleFrame").appendChild(resizeHandle);
        });
    }

    /**
     * 设置窗口置顶
     * @param {Boolean} isTopmost - 是否置顶
     */
    #setTopmost(isTopmost) {
        const normalIndex = Window.#normalWindows.indexOf(this);
        const topmostIndex = Window.#topmostWindows.indexOf(this);

        if (isTopmost) {
            if (normalIndex > -1) {
                Window.#normalWindows.splice(normalIndex, 1);
                Window.#topmostWindows.push(this);
            }
        } else {
            if (topmostIndex > -1) {
                Window.#topmostWindows.splice(topmostIndex, 1);
                Window.#normalWindows.push(this);
            }
        }
        Window.#resort();
        this.dispatchCustomEvent("topmostchange", { detail: { topmost: isTopmost } });
    }

    /**
     * 收敛位置
     */
    #convergeLocation() {
        const realParent = this.#parent;
        const minSpaceX = 200;
        const titleHeight = this.#titleBarEl.clientHeight;

        const newLeft = Math.max(-this.width + minSpaceX, Math.min(this.left, realParent.clientWidth - minSpaceX));
        const newTop = Math.max(0, Math.min(this.top, realParent.clientHeight - titleHeight));

        if (this.left !== newLeft) this.left = newLeft;
        if (this.top !== newTop) this.top = newTop;
    }

    /**
     * 过渡效果
     */
    #transition() {
        const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            requestAnimationFrame(() => this.dispatchCustomEvent("transitionend"));
            return;
        }
        this.setAttribute("transition", "");
        this.addEventListener("transitionend", () => {
            this.removeAttribute("transition");
        }, { once: true });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback() {
        super.connectedCallback?.();

        if (!this.hasInit) {
            this.size = { width: 640, height: 480 };
            const index = (Window.#counter++ - 1) % 9;
            this.left = 33 + index * 26;
            this.top = 26 + index * 26;
        }

        this.setAttribute("role", "window");

        this.#initEvents();

        Window.#openWindows.push(this);
        if (!this.topmost) Window.#normalWindows.push(this);
        else Window.#topmostWindows.push(this);
        Window.#resort();
        this.active();
    }

    /**
     * 元素在 DOM 树中被删除时调用
     */
    disconnectedCallback() {
        /**
         * 从打开窗口列表中移除
         */
        const index = Window.#openWindows.indexOf(this);
        if (index > -1) Window.#openWindows.splice(index, 1);
        if (Window.#activeWindow === this) Window.#activeWindow = null;

        this.close();

        super.disconnectedCallback?.();
    }

    /**
     * 最小化
     */
    minimize(...params) {
        Window.prototype.minimize = overload(["..."], function (e) {
            e?.stopPropagation?.();
            if (!this.canMinimize || !this.dispatchCustomEvent("minimize")) return;
            if (!this.isNative) {
                this.#transition();
                const targetRect = this.minimizeTarget.getBoundingClientRect();
                const left = targetRect.left + (targetRect.width - this.width) / 2;
                const top = targetRect.top + (targetRect.height - this.height) / 2;
                this.#dynamicStyle.replaceSync(`
                :host([minimized]) {
                    scale: 0 !important;
                    left: ${left}px !important;
                    top: ${top}px !important;
                }
            `);
            }
            this.setAttribute("minimized", "");
        });

        Window.prototype.minimize.call(this, ...params);
    }

    /**
     * 最大化 
     */
    maximize(...params) {
        Window.prototype.maximize = overload(["..."], function (e) {
            e?.stopPropagation?.();
            if (!this.canMaximize || !this.dispatchCustomEvent("maximize")) return;
            this.#transition();
            this.setAttribute("maximized", "");
        });

        Window.prototype.maximize.call(this, ...params);
    }

    /**
     * 还原
     */
    restore(...params) {
        Window.prototype.restore = overload(["..."], function (e) {
            e?.stopPropagation?.();
            if (!this.dispatchCustomEvent("restore")) return;
            this.#transition();
            this.#dynamicStyle.replaceSync("");
            this.removeAttribute("minimized");
            this.removeAttribute("maximized");
            this.#convergeLocation();
        });

        Window.prototype.restore.call(this, ...params);
    }

    /**
     * 关闭
     */
    close(...params) {
        Window.prototype.close = overload(["..."], function (e) {
            e?.stopPropagation?.();

            const normalIndex = Window.#normalWindows.indexOf(this);
            const topmostIndex = Window.#topmostWindows.indexOf(this);
            if (normalIndex > -1) Window.#normalWindows.splice(normalIndex, 1);
            if (topmostIndex > -1) Window.#topmostWindows.splice(topmostIndex, 1);

            if (Window.#openWindows.indexOf(this) < 0) return;
            if (!this.dispatchCustomEvent("closing")) return;
            if (this.isNative) {
                this.dispatchCustomEvent("closed", { cancelable: false });
                return;
            }
            this.#transition();
            const windowEl = this.shadowRoot.querySelector(".window");
            const activeFn = () => {
                const win = Window.#topmostWindows[Window.#topmostWindows.length - 1];
                if (win) {
                    win?.active();
                } else {
                    Window.#normalWindows[Window.#normalWindows.length - 1]?.active();
                }
            };
            const removeFn = () => {
                Window.#openWindows.splice(Window.#openWindows.indexOf(this), 1);
                this.dispatchCustomEvent("closed", { cancelable: false });
                this.remove();
                activeFn();
            };
            if (this.isConnected) {
                windowEl.setAttribute("closing", "");
                windowEl.addEventListener("transitionend", removeFn, { once: true });
            } else {
                removeFn();
            }
        });

        Window.prototype.close.call(this, ...params);
    }

    /**
     * 开始移动窗口
     */
    moveBegin(...params) {
        Window.prototype.moveBegin = overload([PointerEvent], function (e) {
            if (this.isNative) return;
            e?.preventDefault?.();
            const isMaximized = this.windowState === WindowState.maximized;
            const isLeftButton = (e.buttons & 1) === 1;
            const isAction = e.target.closest(".action");
            if (!this.canMove || isMaximized || !isLeftButton || isAction) return;
            Window.#movingLastLocation = { x: e.clientX, y: e.clientY };
            this.dispatchCustomEvent("movebegin");
        });

        Window.prototype.moveBegin.call(this, ...params);
    }

    /**
     * 激活窗口
     */
    active(...params) {
        Window.prototype.active = overload(["..."], function () {
            Window.#activeWindow?.deactive();
            Window.#activeWindow = this;
            this.setAttribute("active", "");
            Window.#resort();
            this.dispatchCustomEvent("active");
        });

        Window.prototype.active.call(this, ...params);
    }

    /**
     * 失去焦点
     */
    deactive(...params) {
        Window.prototype.deactive = overload(["..."], function () {
            if (this !== Window.#activeWindow) return;
            Window.#activeWindow = null;
            this.removeAttribute("active");
            this.dispatchCustomEvent("deactive");
        });

        Window.prototype.deactive.call(this, ...params);
    }

    static {
        this.registerComponent({
            name: "jyo-window",
            html: HTML,
            css: STYLES
        });

        // 自动设置位置和尺寸
        globalThis.addEventListener("resize", () => Window.#openWindows.forEach(window => window.#convergeLocation()));

        // 指针移动处理函数
        document.addEventListener(
            "pointermove",
            e => {
                using window = Window.#activeWindow;
                if (!window) return;

                const { clientWidth, clientHeight } = document.body;
                const { clientX, clientY } = e;
                if (clientX < 0 || clientY < 0 || clientX >= clientWidth || clientY >= clientHeight) return;

                /**
                 * 处理窗口移动
                 */
                if (Window.#movingLastLocation) {
                    document.body.style.pointerEvents = "none";
                    const newX = Math.floor(clientX - Window.#movingLastLocation.x);
                    const newY = Math.floor(clientY - Window.#movingLastLocation.y);
                    Window.#movingLastLocation.x = Math.floor(clientX);
                    Window.#movingLastLocation.y = Math.floor(clientY);
                    window.left += newX;
                    window.top += newY;
                    Window.#activeWindow?.dispatchCustomEvent("moving");
                }

                /**
                 * 处理窗口尺寸改变
                 */
                Window.#resizeFn && Window.#resizeFn(clientX, clientY);
            },
            { passive: true }
        );

        // 指针抬起处理函数
        const pointerup = (() => {
            if (Window.#movingLastLocation) {
                Window.#movingLastLocation = null;
                Window.#activeWindow?.dispatchCustomEvent("moveend");
            }
            if (Window.#resizeFn) {
                Window.#resizeFn = null;
                Window.#activeWindow?.dispatchCustomEvent("resizeend");
            }
            document.body.style.pointerEvents = "";
            document.documentElement.style.cursor = "";
        }).bind(this);

        // 窗口移动结束
        document.addEventListener("pointerup", pointerup, { passive: true });

        // 窗口移动取消
        document.addEventListener("pointercancel", pointerup, { passive: true });

        Object.defineProperties(Window, {
            startZIndex: {
                get: () => Window.#startZIndex,
                set: overload([Number], value => {
                    Window.#startZIndex = value;
                    Window.#resort();
                })
            }
        });
    }
}