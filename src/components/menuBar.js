import Component from "./component.js";

const STYLES = /* css */`
:host {
    position: relative;
    display: flex;
    width: 100%;
    padding: 0 4px;
    contain: content;
    overflow: hidden;
    font-size: 0;
    color: var(--colorNeutralForeground2);
    justify-content: space-between;
}

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}
`;

const HTML = /* html */`
<div class="start">
    <slot></slot>
</div>
<div class="end">
    <slot name="end"></slot>
</div>
`;

/**
 * 菜单栏组件
 * @class
 * @extends {Component}
 */
export default class MenuBar extends Component {
    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}