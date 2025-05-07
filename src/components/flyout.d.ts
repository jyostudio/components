import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 定位
 */
declare class Positioning extends Enum {
    /**
     * 上左
     */
    static readonly aboveStart: Positioning;

    /**
     * 上
     */
    static readonly above: Positioning;

    /**
     * 上右
     */
    static readonly aboveEnd: Positioning;

    /**
     * 下左
     */
    static readonly belowStart: Positioning;

    /**
     * 下
     */
    static readonly below: Positioning;

    /**
     * 下右
     */
    static readonly belowEnd: Positioning;

    /**
     * 左上
     */
    static readonly beforeTop: Positioning;

    /**
     * 左
     */
    static readonly before: Positioning;

    /**
     * 左下
     */
    static readonly beforeBottom: Positioning;

    /**
     * 右上
     */
    static readonly afterTop: Positioning;

    /**
     * 右
     */
    static readonly after: Positioning;

    /**
     * 右下
     */
    static readonly afterBottom: Positioning;
}

/**
 * 飞出菜单组件
 */
export default class Flyout extends Component {
    /**
     * 定位
     */
    static get Positioning(): typeof Positioning;

    /**
     * 将飞出菜单绑定到目标元素
     * @param targetEl - 目标元素/绑定元素
     */
    slotBinding(targetEl: HTMLElement): void;

    /**
     * 将飞出菜单绑定到目标元素
     * @param targetEl - 目标元素
     * @param bindEl - 绑定元素
     */
    slotBinding(targetEl: HTMLElement, bindEl: HTMLElement): void;

    /**
     * 解绑元素
     * @param targetEl - 目标元素
     * @param nullVal - 空值 
     */
    slotBinding(targetEl: HTMLElement, nullVal: null): void;

    /**
     * 获取是否打开
     */
    get isOpen(): Boolean;

    /**
     * 设置是否打开
     * @param value - 是否打开
     */
    set isOpen(value: Boolean | String);

    /**
     * 获取锚点
     */
    get anchor(): String;

    /**
     * 设置锚点
     * @param value - 锚点元素选择前器或元素
     */
    set anchor(value: String | HTMLElement);

    /**
     * 获取定位
     */
    get positioning(): Positioning;

    /**
     * 设置定位
     * @param value - 定位
     */
    set positioning(value: Positioning | String);

    /**
     * 打开
     */
    open(): void;

    /**
     * 关闭
     */
    close(): void;

    /**
     * 切换打开状态
     */
    toggle(): void;
}

/**
 * 飞出菜单公用样式
 */
export const FlyoutStyle: String;