import Enum from "@jyostudio/enum";
import overload from "@jyostudio/overload";
import { genEnumGetterAndSetter, waitDefine } from "../libs/utils.js";
import Component from "./component.js";
import "./tooltip.js";

/**
 * 刻度位置
 * @extends {Enum}
 */
class TickPlacement extends Enum {
    static {
        this.set({
            none: 0, // 无
            topLeft: 1, // 左/上
            bottomRight: 2, // 右/下
            outside: 3, // 外部
            inline: 4 // 内部
        });
    }
}

/**
 * 滑块对齐方式
 * @extends {Enum}
 */
class SliderSnapsTo extends Enum {
    static {
        this.set({
            stepValues: 0, // 步长值
            ticks: 1 // 刻度
        });
    }
}

/**
 * 方向
 * @extends {Enum}
 */
class Orientation extends Enum {
    static {
        this.set({
            horizontal: 0, // 水平
            vertical: 1 // 垂直
        });
    }
}

/**
 * 新增一个 Paint Worklet，用于绘制滑块的占位符
 */
CSS?.paintWorklet?.addModule?.(function () {
    const code = /* js */`registerPaint("jyo-slider-placeholder", class JyoSliderPlaceholder {
    static get contextOptions() {
        return { alpha: true };
    }

    static get inputProperties() {
        return [
            "--thumb-size",
            "--slider-direction",
            "--tick-frequency",
            "--tick-placement",
            "--tick-placement-color",
            "--minimum",
            "--maximum",
            "--inline"
        ];
    }

    /**
     * 解析并验证输入属性
     */
    _parseProps(properties) {
        const parseProp = key => parseFloat(properties.get(key));

        // 数值型参数解析
        const thumbSize = parseProp("--thumb-size");
        const minVal = parseProp("--minimum");
        const maxVal = parseProp("--maximum");
        const tickFrequency = parseProp("--tick-frequency");
        const isInline = Boolean(parseProp("--inline"));

        // 方向参数处理
        const direction = properties.get("--slider-direction").toString();
        const isHorizontal = direction === "90deg";

        // 有效范围计算
        const [minimum, maximum] = [Math.min(minVal, maxVal), Math.max(minVal, maxVal)];
        const range = maximum - minimum;
        if (range <= 0) return null; // 无效范围不绘制

        // 刻度参数处理
        const tickPlacement = properties.get("--tick-placement").toString();
        const tickColor = properties.get("--tick-placement-color");

        return {
            thumbSize,
            isHorizontal,
            isInline,
            minimum,
            maximum,
            range,
            tickFrequency,
            tickPlacement,
            tickColor
        };
    }

    /**
     * 计算轨道区域
     */
    _calculateTrackRect(size, thumbSize, isInline, isHorizontal) {
        if (isInline) {
            return isHorizontal ? {
                x: 0,
                y: (size.height - thumbSize) / 2,
                width: size.width,
                height: thumbSize
            } : {
                x: (size.width - thumbSize) / 2,
                y: 0,
                width: thumbSize,
                height: size.height
            };
        }

        return isHorizontal ? {
            x: thumbSize / 2,
            y: (size.height - thumbSize) / 2,
            width: size.width - thumbSize,
            height: thumbSize
        } : {
            x: (size.width - thumbSize) / 2,
            y: thumbSize / 2,
            width: thumbSize,
            height: size.height - thumbSize
        };
    }

    paint(ctx, size, properties) {
        // 参数解析与验证
        const params = this._parseProps(properties);
        if (!params) return;
        const {
            thumbSize, isHorizontal, isInline,
            minimum, maximum, range,
            tickFrequency, tickPlacement, tickColor
        } = params;

        // 刻度配置判断
        if (tickPlacement === "none" ||
            (isInline && tickPlacement !== "inline") ||
            (!isInline && tickPlacement === "inline")
        ) return;

        // 轨道区域计算
        const trackRect = this._calculateTrackRect(size, thumbSize, isInline, isHorizontal);
        const MIN_TICK_SPACING = 5; // 最小刻度间距（像素）

        // 准备绘制参数
        ctx.strokeStyle = tickColor;
        ctx.lineWidth = 1;

        // 预计算绘制方向
        const drawTopLeft = ["topLeft", "outside"].includes(tickPlacement);
        const drawBottomRight = ["bottomRight", "outside"].includes(tickPlacement);
        const drawInline = isInline;

        // 准备路径收集器
        const inlineLines = [];
        const topLeftLines = [];
        const bottomRightLines = [];
        const axis = isHorizontal ? "x" : "y";
        const trackLength = trackRect[isHorizontal ? "width" : "height"];

        // 计算有效刻度步长（基于像素间距）
        const pixelStep = Math.max(MIN_TICK_SPACING, trackLength * (tickFrequency / range));
        const valueStep = (pixelStep / trackLength) * range;
        const totalSteps = Math.ceil(range / valueStep);

        // 生成刻度路径
        let lastPos = -Infinity;
        for (let step = 0; step <= totalSteps; step++) {
            const value = minimum + step * valueStep;
            const clampedValue = Math.min(value, maximum);
            const percent = (clampedValue - minimum) / range;
            const position = trackRect[axis] + trackLength * percent;

            // 密度过滤
            if (Math.abs(position - lastPos) < MIN_TICK_SPACING) continue;
            lastPos = position;

            // 收集inline刻度
            if (drawInline) {
                if (isHorizontal) {
                    inlineLines.push([position, 0, position, trackRect.height]);
                } else {
                    inlineLines.push([0, position, trackRect.width, position]);
                }
            }

            // 收集top/left刻度
            if (drawTopLeft) {
                if (isHorizontal) {
                    topLeftLines.push([position, trackRect.y, position, trackRect.y + trackRect.height / 4]);
                } else {
                    topLeftLines.push([trackRect.x, position, trackRect.x + trackRect.width / 4, position]);
                }
            }

            // 收集bottom/right刻度
            if (drawBottomRight) {
                if (isHorizontal) {
                    bottomRightLines.push([position, trackRect.y + trackRect.height * 3 / 4, position, trackRect.y + trackRect.height]);
                } else {
                    bottomRightLines.push([trackRect.x + trackRect.width * 3 / 4, position, trackRect.x + trackRect.width, position]);
                }
            }
        }

        // 批量绘制路径
        const drawLines = lines => {
            if (!lines.length) return;
            ctx.beginPath();
            lines.forEach(([x1, y1, x2, y2]) => {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            });
            ctx.stroke();
        };

        drawLines(inlineLines);
        drawLines(topLeftLines);
        drawLines(bottomRightLines);
    }
});`;
    const worklet = new Blob([code], { type: "text/javascript" });
    return URL.createObjectURL(worklet);
}());

const STYLES = /* css */`
:host {
    --slider-thumb: 0%;
    --slider-progress: 0%;
    --thumb-size: 20px;
    --track-margin-inline: calc(var(--thumb-size) / 2);
    --track-size: 4px;
    --track-overhang: calc(var(--track-size) / -2);
    --rail-color: var(--colorCompoundBrandBackground);
    --track-color: var(--colorNeutralStrokeAccessible);
    --slider-direction: 90deg;
    --border-radius: var(--borderRadiusMedium);
    --step-marker-inset: var(--track-overhang) -1px;
    --tick-placement-color: var(--colorNeutralStroke1);
    --tick-placement: none;
    --tick-frequency: 0;
    --minimum: 0;
    --maximum: 100;
    --inline: 0;
    position: relative;
    display: inline-grid;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    touch-action: none;
    min-width: 120px;
    min-height: 32px;
    grid-template-rows: 1fr var(--thumb-size) 1fr;
    grid-template-columns: var(--track-margin-inline) 1fr var(--track-margin-inline);
    vertical-align: middle;
    background-image: paint(jyo-slider-placeholder);
}

:host::after {
    height: var(--track-size);
    width: 100%;
    background-image: linear-gradient(var(--slider-direction), var(--rail-color) 0%, var(--rail-color) 50%, var(--track-color) 50.1%, var(--track-color) 100%);
    border-radius: var(--border-radius);
    content: "";
    grid-area: 1 / 1 / -1 / -1;
}

:host([orientation="vertical"]) {
    --slider-direction: 0deg;
    --step-marker-inset: -1px var(--track-overhang);
    min-height: 120px;
    grid-template-rows: var(--track-margin-inline) 1fr var(--track-margin-inline);
    grid-template-columns: 1fr var(--thumb-size) 1fr;
    width: unset;
    min-width: 32px;
    justify-items: center;
}

:host([tick-placement="inline"]) {
    --tick-placement-color: var(--colorNeutralBackground1);
}

:host(:hover) {
    --rail-color: var(--colorCompoundBrandBackgroundHover);
}

:host(:active) {
    --rail-color: var(--colorCompoundBrandBackgroundPressed);
}

.track {
    --inline: 1;
    position: relative;
    height: var(--track-size);
    width: 100%;
    background-color: var(--track-color);
    grid-area: 2 / 2 / 2 / 2;
    forced-color-adjust: none;
    contain: paint;
    overflow: hidden;
    background-image: paint(jyo-slider-placeholder);
}

:host([orientation="vertical"]) .track {
    top: var(--track-overhang);
    bottom: var(--track-overhang);
}

.track::before {
    content: "";
    position: absolute;
    height: 100%;
    border-radius: inherit;
    inset-inline-start: 0px;
    width: var(--slider-progress);
    background-color: var(--rail-color);
}

.track::after {
    --inline: 1;
    content: "";
    position: absolute;
    height: 100%;
    border-radius: inherit;
    inset-inline-start: 0px;
    width: 100%;
    background-image: paint(jyo-slider-placeholder);
}

:host([orientation="vertical"])::after,
:host([orientation="vertical"]) .track {
    height: 100%;
    width: var(--track-size);
}

:host([orientation="vertical"]) .track::before {
    bottom: 0;
    width: 100%;
    height: var(--slider-progress);
}

.thumb {
    position: absolute;
    width: var(--thumb-size);
    height: var(--thumb-size);
    grid-area: 2 / 2 / 2 / 2;
    transform: translateX(-50%);
    left: var(--slider-thumb);
    border-radius: var(--borderRadiusCircular);
    background-color: var(--colorNeutralBackground1);
    border: solid 1px var(--colorNeutralStroke1);
}

:host([orientation="vertical"]) .thumb {
    transform: translateY(50%);
    left: unset;
    bottom: var(--slider-thumb);
}

.thumb::before {
    position: absolute;
    content: "";
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--thumb-size)* 0.5);
    height: calc(var(--thumb-size)* 0.5);
    border-radius: var(--borderRadiusCircular);
    background-color: var(--rail-color);
    transition-duration: var(--durationFaster);
    transition-property: background, border, color, width, height;
    transition-timing-function: var(--curveEasyEase);
}

:host(:hover) .thumb::before {
    width: calc(var(--thumb-size)* 0.6);
    height: calc(var(--thumb-size)* 0.6);
}

:host(:active) .thumb::before {
    width: calc(var(--thumb-size)* 0.5);
    height: calc(var(--thumb-size)* 0.5);
}

:host(:not(:active)) :is(.thumb-container) {
    transition: 0.2s;
}

:host(:focus-visible) {
    border-color: var(--colorTransparentStroke);
    outline: var(--strokeWidthThick) solid var(--colorTransparentStroke);
    box-shadow: var(--shadow4), 0 0 0 2px var(--colorStrokeFocus2);
}

:host(:disabled), :host([disabled]) {
    --rail-color: var(--colorNeutralForegroundDisabled) !important;
    --track-color: var(--colorNeutralBackgroundDisabled) !important;
    --tick-placement-color: var(--colorNeutralBackgroundDisabled) !important;
    color: var(--colorNeutralForegroundDisabled) !important;
    box-shadow: none !important;
    outline: none !important;
    pointer-events: none !important;
}

:host(:disabled) .track::before, :host([disabled]) .track::before {
    --tick-placement-color: var(--colorNeutralBackgroundDisabled) !important;
}

:host(:disabled) .track::after, :host([disabled]) .track::after {
    --tick-placement-color: var(--colorNeutralBackground1) !important;
}
`;

const HTML = /* html */`
<div class="track"></div>
<div class="thumb"></div>
<jyo-tooltip horizontal-offset="-10px" vertical-offset="-10px" mode="manual">0</jyo-tooltip>
`;

/**
 * 滑块组件
 * @class
 * @extends {Component}
 */
export default class Slider extends Component {
    /**
     * 刻度位置
     * @returns {TickPlacement}
     */
    static TickPlacement() {
        return TickPlacement;
    }

    /**
     * 滑块对齐方式
     * @returns {SliderSnapsTo}
     */
    static SliderSnapsTo() {
        return SliderSnapsTo;
    }

    /**
     * 方向
     * @returns {Orientation}
     */
    static Orientation() {
        return Orientation;
    }

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
        return [...super.observedAttributes, "value", "minimum", "maximum", "snaps-to", "tick-frequency", "tick-placement", "orientation"];
    }

    /**
     * 轨道元素
     * @type {HTMLElement}
     */
    #trackEl;

    /**
     * 滑块元素
     * @type {HTMLElement}
     */
    #thumbEl;

    /**
     * 提示元素
     * @type {HTMLElement}
     */
    #tooltipEl;

    /**
     * 轨道宽度
     * @type {Number}
     */
    #trackWidth;

    /**
     * 轨道最小宽度
     * @type {Number}
     */
    #trackMinWidth;

    /**
     * 轨道高度
     * @type {Number}
     */
    #trackHeight;

    /**
     * 轨道最小高度
     * @type {Number}
     */
    #trackMinHeight;

    /**
     * 轨道左侧距离
     * @type {Number}
     */
    #trackLeft;

    /**
     * 百分比值
     * @type {Number}
     */
    #percentValue = 0;

    /**
     * 小数位数
     * @type {Number}
     */
    #decimalPlaces = 0;

    /**
     * 值范围
     * @type {Number}
     */
    get #valueRange() {
        return Math.max(1, this.maximum - this.minimum);
    }

    constructor() {
        super();

        this.#trackEl = this.shadowRoot.querySelector(".track");
        this.#thumbEl = this.shadowRoot.querySelector(".thumb");
        this.#tooltipEl = this.shadowRoot.querySelector("jyo-tooltip");
        waitDefine("jyo-tooltip").then(() => {
            this.#tooltipEl.anchor = this.#thumbEl;
        });

        Object.defineProperties(this, {
            minimum: {
                get: () => parseFloat(this.getAttribute("minimum") || 0),
                set: overload()
                    .add(
                        [Number],
                        /**
                         * @this {Slider}
                         */
                        function (value) {
                            this.lock("minimum", () => {
                                if (isNaN(value)) value = 0;
                                if (value > this.maximum) value = this.maximum;
                                this.style.setProperty("--minimum", value);
                                this.setAttribute("minimum", value);
                                this.#calculateDecimalPlaces();
                            });
                            this.value = this.value;
                        }
                    )
                    .add([String], function (value) {
                        value = parseInt(value);
                        if (isNaN(value)) value = 0;
                        this.minimum = value;
                    })
                    .any(() => this.minimum = 0)
            },
            maximum: {
                get: () => parseFloat(this.getAttribute("maximum") || 100),
                set: overload()
                    .add(
                        [Number],
                        /**
                         * @this {Slider}
                         */
                        function (value) {
                            this.lock("maximum", () => {
                                if (isNaN(value)) value = 0;
                                if (value < this.minimum) value = this.minimum;
                                this.style.setProperty("--maximum", value);
                                this.setAttribute("maximum", value);
                                this.#calculateDecimalPlaces();
                            });

                            this.value = this.value;
                        }
                    )
                    .add([String], function (value) {
                        value = parseInt(value);
                        if (isNaN(value)) value = 0;
                        this.maximum = value;
                    })
                    .any(() => this.maximum = 100)
            },
            value: {
                get: () => parseFloat(this.getAttribute("value") || 0),
                set: overload()
                    .add([Number], function (value) {
                        this.lock("value", () => {
                            if (isNaN(value)) value = 0;
                            value = Math.max(this.minimum, Math.min(this.maximum, value));
                            this.#setPercentValue((value - this.minimum) / this.#valueRange * 100);
                            this.setAttribute("value", value);
                            if (this.snapsTo === SliderSnapsTo.ticks) {
                                this.#tooltipEl.textContent = this.#calculateTicksValue();
                            } else {
                                this.#tooltipEl.textContent = parseFloat(value.toFixed(this.#decimalPlaces));
                            }
                        });
                    })
                    .add([String], function (value) {
                        value = parseInt(value);
                        if (isNaN(value)) value = 0;
                        this.value = value;
                    })
                    .any(() => this.value = 0)
            },
            tickFrequency: {
                get: () => {
                    const num = parseFloat(this.getAttribute("tick-frequency"));
                    if (isNaN(num) || num < 0) {
                        return 0;
                    }
                    return num;
                },
                set: overload()
                    .add([Number], function (value) {
                        this.lock("tickFrequency", () => {
                            value = Math.max(0, value);
                            this.style.setProperty("--tick-frequency", value);
                            this.setAttribute("tick-frequency", value);
                            this.#calculateDecimalPlaces();
                        });
                    })
                    .add([String], function (value) {
                        value = parseFloat(value);
                        if (isNaN(value) || value < 0) value = 0;
                        this.tickFrequency = value;
                    })
                    .any(() => this.tickFrequency = 0)
            },
            tickPlacement: genEnumGetterAndSetter(this, {
                attrName: "tickPlacement",
                enumClass: TickPlacement,
                defaultValue: "none",
                isSetCssVar: true
            }),
            snapsTo: genEnumGetterAndSetter(this, {
                attrName: "snapsTo",
                enumClass: SliderSnapsTo,
                defaultValue: "stepValues"
            }),
            orientation: genEnumGetterAndSetter(this, {
                attrName: "orientation",
                enumClass: Orientation,
                defaultValue: "horizontal",
                isSetCssVar: true,
                fn: (attrName, value) => {
                    if (!attrName) return;
                    switch (value) {
                        case "vertical":
                            this.#tooltipEl.positioning = "before";
                            this.#tooltipEl.style.setProperty("--horizontal-offset", "-50%");
                            this.#tooltipEl.style.setProperty("--vertical-offset", "50%");
                            break;
                        case "horizontal":
                            this.#tooltipEl.positioning = "above";
                            this.#tooltipEl.style.setProperty("--horizontal-offset", "-50%");
                            this.#tooltipEl.style.setProperty("--vertical-offset", "-50%");
                            break;
                    }
                }
            })
        });
    }

    /**
     * 初始化事件
     */
    #initEvents() {
        const signal = this.abortController.signal;

        this.addEventListener("pointerdown", this.#onPointerDown, { signal });
        this.addEventListener("pointerup", this.#onPointerUp, { signal });
        this.addEventListener("pointercancel", this.#onPointerUp, { signal });
        this.addEventListener("pointermove", this.#onPointerMove, { signal });

        [this.#trackEl, this.#thumbEl].forEach(el => {
            ["pointerdown", "pointerenter"].forEach(eventName => {
                el.addEventListener(eventName, this.#showTooltip.bind(this), { signal });
            });
            ["pointerleave", "pointerout"].forEach(eventName => {
                el.addEventListener(eventName, this.#hideTooltip.bind(this), { signal });
            });
        });
    }

    /**
     * 指针按下事件
     * @param {PointerEvent} event - 事件
     */
    #onPointerDown(event) {
        this.setPointerCapture(event.pointerId);
        this.#onPointerMove(event);
        this.#showTooltip();
    }

    /**
     * 指针抬起事件
     * @param {PointerEvent} event - 事件
     */
    #onPointerUp(event) {
        this.releasePointerCapture(event.pointerId);
        if (this.snapsTo === SliderSnapsTo.ticks) {
            this.#snapToTicks();
        }
        this.#hideTooltip();
    }

    /**
     * 指针移动事件
     * @param {PointerEvent} event - 事件
     */
    #onPointerMove(event) {
        requestAnimationFrame(() => {
            if (this.hasPointerCapture(event.pointerId)) {
                const sourceEvent = globalThis.TouchEvent && event instanceof TouchEvent ? event.touches[0] : event;
                const eventValue = this.getAttribute("orientation") === "vertical"
                    ? sourceEvent.pageY - document.documentElement.scrollTop
                    : sourceEvent.pageX - document.documentElement.scrollLeft - this.#trackLeft;
                this.#calculateNewValue(eventValue);

                const rect = this.getBoundingClientRect();
                const value = (event.clientX - rect.left) / rect.width;
                this.style.setProperty("--slider-thumb", `${value * 100}%`);
                this.style.setProperty("--slider-progress", `${value * 100}%`);
            }
        });
    }

    /**
     * 计算小数位数
     */
    #calculateDecimalPlaces() {
        const fn = value => {
            const parts = value.toString().split(".");
            return parts.length > 1 ? parts[1].length : 0;
        };
        let maxDecimalPlaces = 0;
        [this.minimum, this.maximum, this.tickFrequency].forEach(value => {
            maxDecimalPlaces = Math.max(maxDecimalPlaces, fn(value));
        });
        this.#decimalPlaces = maxDecimalPlaces;
    }

    /**
     * 计算新值
     * @param {Number} rawValue - 原始值
     */
    #calculateNewValue(rawValue) {
        this.#setupTrackConstraints();

        const isVertical = this.getAttribute("orientation") === "vertical";

        let percentValue = 0;
        if (!isVertical) {
            percentValue = 1 - (rawValue - this.#trackWidth) / (this.#trackMinWidth - this.#trackWidth);
        } else {
            percentValue = 1 - (rawValue - this.#trackHeight) / (this.#trackMinHeight - this.#trackHeight);
        }

        if (isNaN(percentValue)) return;

        this.#setPercentValue(percentValue * 100);

        [this.#thumbEl, this.#trackEl].forEach((el) => {
            el.style.setProperty("--slider-thumb", `${this.#percentValue}%`);
            el.style.setProperty("--slider-progress", `${this.#percentValue}%`);
        });

        const newValue = this.minimum + this.#valueRange * this.#percentValue / 100;
        if (isNaN(newValue)) {
            this.value = 0;
        } else {
            this.value = newValue;
        }
    }

    /**
     * 计算刻度值
     */
    #calculateTicksValue() {
        const tickFrequency = this.tickFrequency;
        if (tickFrequency <= 0) return;
        const percentValue = (this.value - this.minimum) / this.#valueRange * 100;
        const tickValue = Math.round(percentValue / 100 * this.#valueRange / tickFrequency) * tickFrequency + this.minimum;
        return tickValue;
    }

    /**
     * 贴合到刻度
     */
    #snapToTicks() {
        const tickValue = this.#calculateTicksValue();
        if (this.value === tickValue) return;
        this.#percentValue = (tickValue - this.minimum) / this.#valueRange * 100;
        this.value = tickValue;
        [this.#thumbEl, this.#trackEl].forEach((el) => {
            el.style.setProperty("--slider-thumb", `${this.#percentValue}%`);
            el.style.setProperty("--slider-progress", `${this.#percentValue}%`);
        });
    }

    /**
     * 设置百分比值
     * @param {Number} value - 百分比值
     */
    #setPercentValue(value) {
        this.#percentValue = Math.min(100, Math.max(0, value));
        this.style.setProperty("--slider-thumb", `${value}%`);
        this.style.setProperty("--slider-progress", `${value}%`);
    }

    /**
     * 设置轨道约束
     */
    #setupTrackConstraints() {
        const clientRect = this.#trackEl.getBoundingClientRect();
        this.#trackWidth = clientRect.width;
        this.#trackMinWidth = this.#trackEl.clientLeft;
        this.#trackHeight = clientRect.top;
        this.#trackMinHeight = clientRect.bottom;
        this.#trackLeft = this.getBoundingClientRect().left;
        if (this.#trackWidth === 0) this.#trackWidth = 1;
        if (this.#trackHeight === 0) this.#trackHeight = 1;
    };

    /**
     * 显示提示
     */
    #showTooltip() {
        this.#tooltipEl.showPopover();
    }

    /**
     * 隐藏提示
     * @param {PointerEvent} event - 事件
     */
    #hideTooltip(event) {
        if (this.hasPointerCapture(event?.pointerId)) return;
        this.#tooltipEl.hidePopover();
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
            html: HTML,
            css: STYLES
        });
    }
}