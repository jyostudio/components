import Component from "./component.js";

const STYLES = `
:host {
    position: relative;
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration-line: none;
    text-align: center;
    min-width: 32px;
    min-height: 32px;
    outline-style: none;
    background-color: var(--colorSubtleBackground);
    color: var(--colorCompoundBrandForeground1);
    border-color: transparent;
    padding: 0 var(--spacingHorizontalM);
    border-radius: var(--borderRadiusMedium);
    font-size: var(--fontSizeBase300);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase300);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color;
    transition-timing-function: var(--curveEasyEase);
    user-select: none;
    contain: paint;
    overflow: hidden;
}

:host::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
}

:host(:hover) {
    background-color: var(--colorSubtleBackgroundHover);
    color: var(--colorBrandForegroundLinkHover);
    border-color: transparent;
}

:host(:hover:active) {
    background-color: var(--colorSubtleBackgroundPressed);
    color: var(--colorBrandForegroundLinkPressed);
    border-color: transparent;
}

:host(:focus-visible) {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2);
}

:host(:disabled), :host([disabled]) {
    background-color: var(--colorNeutralBackgroundDisabled);
    border-color: var(--colorNeutralStrokeDisabled);
    color: var(--colorNeutralForegroundDisabled);
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = `
<slot>Button</slot>
`;

export default class HyperlinkButton extends Component {
    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        this.shadow.host.addEventListener("click", () => {
            const href = this.shadow.host.getAttribute("href");
            href && globalThis.open(href, "_blank");
        }, { signal: this.abortController.signal });
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}