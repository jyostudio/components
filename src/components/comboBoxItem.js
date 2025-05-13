import Component from "./component.js";

const STYLES = /* css */`
:host {
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

:host([selected]) {
    background: var(--mix-colorNeutralBackground1Hover) !important;
    color: var(--colorNeutralForeground2Hover) !important;
}

:host([selected])::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 3px;
    height: 50%;
    transform: translateY(-50%);
    background-color: var(--colorCompoundBrandBackground);
    border-radius: var(--borderRadiusMedium);
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

:host(:focus-visible) {
    border-radius: var(--borderRadiusMedium);
    outline: 2px solid var(--mix-colorStrokeFocus2);
}

.content {
    white-space: nowrap;
    flex-grow: 1;
    padding: 0 2px;
}

::slotted([slot="end"]) {
    color: var(--colorNeutralForeground3);
    font: var(--fontWeightRegular) var(--fontSizeBase200) /
        var(--lineHeightBase200) var(--fontFamilyBase);
    white-space: nowrap;
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
<slot name="start"></slot>
<div part="content" class="content">
    <slot></slot>
</div>
<slot name="end"></slot>
`;

/**
 * 组合框项
 * @class
 * @extends {Component}
 */
export default class ComboBoxItem extends Component {
    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}