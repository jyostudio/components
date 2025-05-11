import overload from "@jyostudio/overload";
import Component from "./component.js";

/**
 * TODO:
 * 需要定义options的样式
 * 需要定义下拉框的样式
 * 需要定义下拉框的选中状态
 * 需要定义下拉框的禁用状态
 */

const STYLES = /* css */`
:host {
    position: relative;
    display: inline-grid;
    vertical-align: middle;
    align-items: center;
    justify-content: center;
    contain: paint;
    overflow: hidden;
    min-width: 32px;
    min-height: 32px;
    border: var(--strokeWidthThin) solid var(--mix-colorNeutralStroke1);
    border-bottom-color: var(--mix-colorNeutralStroke1Hover);
    border-radius: var(--borderRadiusMedium);
    outline-style: none;
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    text-align: center;
    text-decoration-line: none;
    color: var(--colorNeutralForeground1);
    background-color: var(--mix-colorNeutralBackground1);
    transition: background-color var(--durationFaster) var(--curveEasyEase),
                border-color var(--durationFaster) var(--curveEasyEase),
                color var(--durationFaster) var(--curveEasyEase);
    user-select: none;
}

.dropdown {
    position: absolute;
    top: 50%;
    right: var(--spacingHorizontalXS);
    width: 30px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    transform: translateY(-50%);
    font-family: "FluentSystemIcons-Resizable";
    font-size: var(--fontSizeBase100);
    vertical-align: middle;
    pointer-events: none;
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0 var(--spacingHorizontalM);
    padding-inline-end: calc(var(--spacingHorizontalXL) + 18px);
    height: 100%;
    border: none;
    background-color: transparent;
    color: inherit;
}

option {
    background-color: var(--mix-colorNeutralBackground1);
}

option::checkmark {
    order: 1;
    content: "e";
}

select:active,
select:focus {
    outline: none;
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

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
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
<select>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
</select>
<span class="dropdown">\ue40c</span>
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
        return [...super.observedAttributes, "属性"];
    }

    /**
     * 选择框元素
     * @type {HTMLSelectElement}
     */
    #selectEl;

    constructor() {
        super();

        this.#selectEl = this.shadowRoot.querySelector("select");

        Object.defineProperties(this, {
            属性: {
                get: () => this.hasAttribute("属性"),
                set: overload()
                    .add([String], value => {
                        this.lock("属性", () => {
                            if (value) this.setAttribute("属性", "");
                            else this.removeAttribute("属性");
                        });
                    })
                    .any(() => this.属性 = false)
            }
        });
    }

    /**
     * 绑定事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("click", () => {
            this.#selectEl.click();
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback() {
        super.connectedCallback?.();

        // 在这里进行初始化和设置

        this.#initEvents();
    }

    /**
     * 元素从 DOM 中移除时调用
     */
    disconnectedCallback() {
        // 在这里清理事件监听器和其他资源

        super.disconnectedCallback?.();
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}