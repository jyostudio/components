import overload from "@jyostudio/overload";
import Component from "./component.js";

const STYLES = /* css */`
@keyframes rotator {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(270deg);
    }
}

@keyframes dash {
    0% {
        stroke-dashoffset: 187;
    }

    50% {
        stroke-dashoffset: 46.75;
        transform: rotate(135deg);
    }

    95% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        stroke-dashoffset: 187;
        transform: rotate(450deg);
    }
}

:host {
    display: block;
    width: 60px;
    height: 60px;
    contain: paint;
    overflow: hidden;
    contain: content;
}

:host([is-indeterminate]) {
    animation: rotator 1.4s linear infinite;
}

.ring {
    transform: rotate(-90deg);
}

.bg {
    stroke-dasharray: 190;
    stroke-dashoffset: 0;
    transform-origin: center;
}

.fill {
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    stroke: var(--colorCompoundBrandBackground);
    transform-origin: center;
}

:host([is-indeterminate]) .fill {
    animation: dash 1.4s ease-in-out infinite;
}

/*
:host(:disabled), :host([disabled]) {
    background-color: var(--colorNeutralBackgroundDisabled) !important;
    border-color: var(--colorNeutralStrokeDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}
*/
`;

const HTML = /* html */`
<svg class="ring" width="100%" height="100%" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle class="bg" cx="33" cy="33" r="30" fill="none" stroke-width="5"></circle>
    <circle class="fill" cx="33" cy="33" r="30" fill="none" stroke-width="5" stroke-linecap="round"></circle>
</svg>
`;

export default class ProgressRing extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "background", "is-indeterminate", "value", "max", "min"];
    }

    /**
     * 背景元素
     * @type {HTMLElement}
     */
    #bgEl = null;

    /**
     * 填充元素
     * @type {HTMLElement}
     */
    #fillEl;

    constructor() {
        super();

        this.#bgEl = this.shadowRoot.querySelector(".bg");
        this.#fillEl = this.shadowRoot.querySelector(".fill");

        Object.defineProperties(this, {
            background: {
                get: () => this.#bgEl.style.stroke,
                set: overload()
                    .add([String], value => this.#bgEl.style.stroke = value)
                    .any(() => this.#bgEl.style.stroke = "transparent")
            },
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
                            this.#fillEl.style.strokeDashoffset = "";
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
                            this.#fillEl.style.strokeDashoffset = `${(this.max - value) / (this.max - this.min) * 187}`;
                            this.#fillEl.style.opacity = value ? 1 : 0;
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
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}