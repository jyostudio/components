import overload from "@jyostudio/overload";
import Component from "./component.js";
import themeManager from "../libs/themeManager/themeManager.js";
import { genBooleanGetterAndSetter } from "../libs/utils.js";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

const STYLES = `
@keyframes deactive {
    0% {
        display: block;
    }
    99.99% {
        display: block;
    }
    100% {
        display: none;
    }
}

:host {
    --just-show-fallback: 0;
    --deactive: 0;
    --background: var(--colorNeutralBackground5);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
}

.luminosityBlend {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    background-color: var(--background);
}

.mixColor {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.15;
    background-color: var(--colorBrandBackground);
    transition-duration: var(--durationFaster);
    transition-property: background-color;
    transition-timing-function: var(--curveEasyEase);
}

.gaussianBlur {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-backdrop-filter: blur(40px) brightness(1.2);
    backdrop-filter: blur(40px) brightness(1.2);
}

.noiseTexture {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(data:image/png;base64,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);
    opacity: 0.02;
}

.fallback {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: var(--colorNeutralBackground2);
    transition-duration: var(--durationFaster);
    transition-property: opacity, background-color;
    transition-timing-function: var(--curveEasyEase);
}

@container (style(--theme: highContrast)) {
    --just-show-fallback: 1;
}

:host([deactive]),
:host([just-show-fallback]) {
    --just-show-fallback: 1;
}

@container (style(--theme: dark)) {
    .luminosityBlend {
        filter: saturate(0.4);
    }
}

@container (style(--just-show-fallback: 1)) {
    .fallback {
        opacity: 1;
    }

    .luminosityBlend,
    .mixColor,
    .gaussianBlur,
    .noiseTexture {
        animation: deactive var(--durationFaster) var(--curveEasyEase) forwards;
    }
}
`;

const HTML = `
<div class="luminosityBlend"></div>
<div class="mixColor"></div>
<div class="gaussianBlur"></div>
<div class="noiseTexture"></div>
<div class="fallback"></div>
`;

export default class Acrylic extends Component {
    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "tint-color", "tint-opacity", "fallback-color", "deactive", "deactivate"];
    }

    /**
     * 混色层元素
     * @type {HTMLElement}
     */
    #mixColorEl = null;

    /**
     * 回退元素
     * @type {HTMLElement}
     */
    #fallbackEl = null;

    /**
     * 父窗口
     * @type {Window}
     */
    #parentWindow = null;

    static [CONSTRUCTOR_SYMBOL](...params) {
        Acrylic[CONSTRUCTOR_SYMBOL] = overload([], function () {
            this.#mixColorEl = this.querySelector(".mixColor");
            this.#fallbackEl = this.querySelector(".fallback");
        });

        return Acrylic[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            tintColor: {
                get: () => this.getAttribute("tint-color") || "var(--colorBrandBackground)",
                set: overload()
                    .add([String], value => {
                        this.lock("tintColor", () => {
                            this.setAttribute("tint-color", value);
                            this.#mixColorEl.style.backgroundColor = themeManager.supportToHDR(value);
                        });
                    })
                    .any(() => this.tintColor = "var(--colorBrandBackground)")
            },
            tintOpacity: {
                get: () => parseFloat(this.getAttribute("tint-opacity")) || 0.15,
                set: overload()
                    .add([Number], value => {
                        this.lock("tintOpacity", () => {
                            if (isNaN(value) || value < 0 || value > 1) value = 0.15;
                            this.setAttribute("tint-opacity", value);
                            this.#mixColorEl.style.opacity = value;
                        });
                    })
                    .add([String], value => this.tintOpacity = parseFloat(value))
                    .any(() => this.tintOpacity = 0.15)
            },
            fallbackColor: {
                get: () => this.getAttribute("fallback-color") || "var(--colorNeutralBackground2)",
                set: overload()
                    .add([String], value => {
                        this.lock("fallbackColor", () => {
                            this.setAttribute("fallback-color", value);
                            this.#fallbackEl.style.backgroundColor = themeManager.supportToHDR(value);
                        });
                    })
                    .any(() => this.fallbackColor = "var(--colorNeutralBackground2)")
            },
            deactive: genBooleanGetterAndSetter(this, { attrName: "deactive", defaultValue: false }),
        });

        return Acrylic[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    #checkThemeConfig() {
        if (themeManager.enableAlpha) {
            this.removeAttribute("just-show-fallback");
        } else {
            this.setAttribute("just-show-fallback", "");
        }
    }

    #bindEvents() {
        const signal = this.abortController.signal;

        this.#parentWindow?.addEventListener("active", () => this.deactive = false, { signal });
        this.#parentWindow?.addEventListener("deactive", () => this.deactive = true, { signal });

        themeManager.addEventListener("update", () => {
            this.#checkThemeConfig();
        });
    }

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(...params) {
        super.connectedCallback?.call(this, ...params);

        let parentWin = null;
        let parent = null;
        do {
            parent = (parent ?? this)?.getRootNode()?.host;
            if (parent?.tagName === "JYO-WINDOW") {
                parentWin = parent;
            }
        } while (parent);

        this.#parentWindow = parentWin;

        this.#bindEvents();

        this.#checkThemeConfig();
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}