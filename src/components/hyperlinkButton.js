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
    inset: 0;
    cursor: pointer;
}

:host(:hover) {
    background-color: var(--mix-colorSubtleBackgroundHover);
    color: var(--colorBrandForegroundLinkHover);
    border-color: transparent;
}

:host(:hover:active) {
    background-color: var(--mix-colorSubtleBackgroundPressed);
    color: var(--colorBrandForegroundLinkPressed);
    border-color: transparent;
}

:host(:focus-visible) {
    border-color: var(--mix-colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--mix-colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2);
}

:host(:disabled), :host([disabled]) {
    background-color: var(--mix-colorNeutralBackgroundDisabled);
    border-color: var(--mix-colorNeutralStrokeDisabled);
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
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.shadowRoot.host.addEventListener("click", () => {
            const href = this.shadowRoot.host.getAttribute("href");
            href && globalThis.open(href, "_blank");
        }, { signal });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        this.#initEvents();

        super.connectedCallback?.call(this, ...params);
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}