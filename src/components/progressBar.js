import overload from "@jyostudio/overload";
import Component from "./component.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

const STYLES = `
@keyframes indeterminate {
    0% {
        inset-inline-start: -33%;
    }

    60% {
        inset-inline-start: 100%;
        transform: translateY(0);
    }

    60.0001% {
        inset-inline-start: 100%;
        transform: translateY(100%);
    }

    60.0002% {
        inset-inline-start: -33%;
        transform: translateY(0);
    }

    100% {
        inset-inline-start: 100%;
    }
}

@keyframes fill {
    0% {
        width: 0%;
    }

    100% {
        width: 100%;
    }
}

:host {
    display: block;
    width: 100%;
    height: 4px;
    contain: paint;
    overflow: hidden;
    border-radius: var(--borderRadiusMedium);
    contain: content;
    padding: var(--spacingVerticalS) 0;
}

:host::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
    background-color: var(--mix-colorNeutralBackground6);
}

:host([is-indeterminate])::before,
:host([show-paused])::before,
:host([show-error])::before{
    background-color: var(--colorTransparentBackground);
}

.fill {
    position: absolute;
    left: 0;
    top: 50%;
    background-color: var(--colorCompoundBrandBackground);
    border-radius: inherit;
    width: var(--width, 0%);
    height: 4px;
    transform: translateY(-50%);
    transition-duration: var(--durationNormal) !important;
    transition-property: width !important;
    transition-timing-function: var(--curveEasyEase) !important;
}

:host([is-indeterminate]) .fill {
    width: 33%;
    animation: indeterminate 2s var(--curveEasyEase) infinite !important;
}

:host([show-paused]) .fill {
    animation: fill var(--durationUltraSlow) var(--curveEasyEase) forwards;
    background-color: var(--colorStatusWarningBackground3);
}

:host([show-error]) .fill {
    animation: fill var(--durationUltraSlow) var(--curveEasyEase) forwards;
    background-color: var(--colorStatusDangerBackground3);
}

:host(:focus-visible) {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2) inset;
}

:host(:disabled), :host([disabled]) {
    background-color: var(--colorNeutralBackgroundDisabled) !important;
    border-color: var(--colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
`;

const HTML = `
<div class="fill"></div>
`;

export default class ProgressBar extends Component {
    /**
     * 是否支持 form 关联
     * @returns {Boolean}
     */
    static get formAssociated() {
        return true;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "is-indeterminate", "value", "max", "min", "show-paused", "show-error"];
    }

    /**
     * 填充元素
     * @type {HTMLElement}
     */
    #fillEl;

    static [CONSTRUCTOR_SYMBOL](...params) {
        ProgressBar[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#fillEl = this.shadow.querySelector(".fill");
        });

        return ProgressBar[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            isIndeterminate: {
                get: () => this.hasAttribute("is-indeterminate"),
                set: overload()
                    .add([Boolean], value => {
                        if (value) {
                            this.setAttribute("is-indeterminate", "");
                        } else {
                            this.removeAttribute("is-indeterminate");
                        }
                    })
                    .any(() => {
                        if (this.isIndeterminate) {
                            this.#fillEl.style.cssText += "--width: 0%";
                        } else {
                            this.value = this.value;
                        }
                    })
            },
            value: {
                get: () => Math.max(this.min, parseInt(this.getAttribute("value") ?? 0)),
                set: overload()
                    .add([String], value => {
                        this.lock("value", () => {
                            value = Math.max(this.min, Math.min(this.max, parseInt(value)));
                            if (isNaN(value)) value = 0;
                            if (this.value !== value) this.setAttribute("value", value);
                            this.#fillEl.style.cssText += `--width: ${value}%`;
                        });
                    })
                    .add([Number], value => this.value = `${value}`)
                    .any(() => this.value = "0")
            },
            max: {
                get: () => Math.min(100, Math.max(0, parseInt(this.getAttribute("max") ?? 100))),
                set: overload()
                    .add([String], value => {
                        this.lock("max", () => {
                            value = Math.min(100, Math.max(0, parseInt(value)));
                            if (isNaN(value)) value = 100;
                            if (value <= this.min) value = this.min + 1;
                            if (value <= 0) value = 1;
                            if (this.max !== value) this.setAttribute("max", value);
                            this.value = this.value;
                        });
                    })
                    .add([Number], value => this.max = `${value}`)
                    .any(() => this.max = "100")
            },
            min: {
                get: () => Math.min(99, Math.max(0, parseInt(this.getAttribute("min") ?? 0))),
                set: overload()
                    .add([String], value => {
                        this.lock("min", () => {
                            value = Math.min(99, Math.max(0, parseInt(value)));
                            if (isNaN(value)) value = 0;
                            if (value >= this.max) value = this.max - 1;
                            if (this.min !== value) this.setAttribute("min", value);
                            this.value = this.value;
                        });
                    })
                    .add([Number], value => this.min = `${value}`)
                    .any(() => this.setAttribute("min", 0))
            }
        });

        return ProgressBar[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}