import Component from "./component.js";
import Flyout from "./flyout.js";
import "./menuFlyout.js";

const STYLES = /* css */`
:host {
    position: relative;
    display: inline-block;
    font-family: var(--fontFamilyBase);
    font-size: var(--fontSizeBase200);
    border-radius: var(--borderRadiusMedium);
    padding: 4px 8px;
    margin-inline-end: 4px;
}

:host(:last-child) {
    margin-inline-end: 0;
}

:host(:hover) {
    background-color: var(--mix-colorNeutralBackground1Hover);
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
`;

const HTML = /* html */`
<slot></slot>
`;

/**
 * 菜单栏项组件
 * @class
 * @extends {Component}
 */
export default class MenuBarItem extends Component {
    /**
     * 是否显示菜单
     * @type {Boolean}
     */
    get #isVisibleMenuFlyout() {
        return this.hasAttribute("flyout-visible");
    }

    /**
     * 飞出菜单定位
     * @type {Flyout.Positioning}
     */
    get flyoutPositioning() {
        return Flyout.Positioning.belowStart;
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("click", () => {
            this.#toggleMenuFlyout();
        }, { signal });

        this.addEventListener("pointerenter", () => {
            let canShow = false;
            this.parentElement.querySelectorAll("jyo-menu-bar-item").forEach(
                /**
                 * @param {MenuBarItem} item
                 */
                item => {
                    if (item.#isVisibleMenuFlyout) {
                        item.#hideMenuFlyout();
                        canShow = true;
                    }
                });
            if (canShow) this.#showMenuFlyout();
        }, { signal });
    }

    /**
     * 隐藏菜单
     */
    #hideMenuFlyout() {
        const menuFlyout = this.querySelector("jyo-menu-flyout");
        if (!menuFlyout) return;
        menuFlyout.hidePopover();
    }

    /**
     * 显示菜单
     */
    #showMenuFlyout() {
        const menuFlyout = this.querySelector("jyo-menu-flyout");
        if (!menuFlyout) return;
        menuFlyout.showPopover();
    }

    /**
     * 切换菜单显示隐藏
     */
    #toggleMenuFlyout() {
        const menuFlyout = this.querySelector("jyo-menu-flyout");
        if (!menuFlyout) return;
        if (menuFlyout.isOpen) {
            menuFlyout.hidePopover();
        } else {
            menuFlyout.showPopover();
        }
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
            name: "jyo-menu-bar-item",
            html: HTML,
            css: STYLES
        });
    }
}