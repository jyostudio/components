import Enum from "@jyostudio/enum";
import Flyout, { FlyoutStyle } from "./flyout.d.ts";

/**
 * 触发模式
 */
declare class Mode extends Enum {
    /**
     * 自动模式
     */
    static readonly auto: Mode;

    /**
     * 手动模式
     */
    static readonly manual: Mode;
}

/**
 * 工具提示组件
 */
export default class Tooltip extends Flyout {
    /**
     * 定位
     */
    static get Positioning(): typeof Flyout.Positioning;

    /**
     * 触发模式
     */
    static get Mode(): typeof Mode;

    /**
     * 获取触发延迟
     */
    get delay(): number;

    /**
     * 设置触发延迟
     * @param value - 触发延迟
     */
    set delay(value: number);

    /**
     * 获取触发模式
     */
    get mode(): Mode;

    /**
     * 设置触发模式
     * @param value - 触发模式
     */
    set mode(value: Mode);

    /**
     * 获取垂直偏移量
     */
    get verticalOffset(): number;

    /**
     * 设置垂直偏移量
     * @param value - 垂直偏移量
     */
    set verticalOffset(value: number);

    /**
     * 获取水平偏移量
     */
    get horizontalOffset(): number;

    /**
     * 设置水平偏移量
     * @param value - 水平偏移量
     */
    set horizontalOffset(value: number);
}