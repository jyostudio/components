import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 窗口状态枚举
 */
declare class WindowState extends Enum {
    /**
     * 正常
     */
    static readonly normal: WindowState;

    /**
     * 最大化
     */
    static readonly maximized: WindowState;

    /**
     * 最小化
     */
    static readonly minimized: WindowState;
}

/**
 * 窗口位置
 */
declare interface IWindowLocation {
    /**
     * x 坐标
     */
    x: number;

    /**
     * y 坐标
     */
    y: number;
}

/**
 * 窗口尺寸
 */
declare interface IWindowSize {
    /**
     * 宽度
     */
    width: number;

    /**
     * 高度
     */
    height: number;
}

/**
 * 窗口组件
 */
export default class Window extends Component {
    /**
     * 起始 z-index
     */
    static startZIndex: Number;

    /**
     * 是否为激活窗口
     */
    get isActive(): Boolean;

    /**
     * 窗口状态
     */
    get windowState(): WindowState;

    /**
     * 是否在 Native 环境中（如 Electron、Tauri）
     */
    get isNative(): Boolean;

    /**
     * 是否显示返回按钮
     */
    get showBtnBack(): Boolean;

    /**
     * 是否可返回
     */
    get canBack(): Boolean;

    /**
     * 是否为自定义标题栏
     */
    get customTitle(): Boolean;

    /**
     * 是否隐藏标题栏
     */
    get hideTitleBar(): Boolean;

    /**
     * 是否可调整大小
     */
    get canResizable(): Boolean;

    /**
     * 是否可最大化
     */
    get canMaximize(): Boolean;

    /**
     * 是否可最小化
     */
    get canMinimize(): Boolean;

    /**
     * 是否可关闭
     */
    get canClose(): Boolean;

    /**
     * 获取距离父元素的左边距
     */
    get left(): Number;

    /**
     * 设置距离父元素的左边距
     * @param value 左边距
     */
    set left(value: Number | String);

    /**
     * 获取距离父元素的上边距
     */
    get top(): Number;

    /**
     * 设置距离父元素的上边距
     * @param value 上边距
     */
    set top(value: Number | String);

    /**
     * 获取窗口位置
     */
    get location(): IWindowLocation;

    /**
     * 设置窗口位置
     * @param value 窗口位置
     */
    set location(value: IWindowLocation | String);

    /**
     * 获取窗口宽度
     */
    get width(): Number;

    /**
     * 设置窗口宽度
     * @param value 窗口宽度
     */
    set width(value: Number | String);

    /**
     * 获取窗口高度
     */
    get height(): Number;

    /**
     * 设置窗口高度
     * @param value 窗口高度
     */
    set height(value: Number | String);

    /**
     * 获取窗口尺寸
     */
    get size(): IWindowSize;

    /**
     * 设置窗口尺寸
     * @param value 窗口尺寸
     */
    set size(value: IWindowSize | String);

    /**
     * 获取窗口是否可移动
     */
    get canMove(): Boolean;

    /**
     * 设置窗口是否可移动
     * @param value 是否可移动
     */
    set canMove(value: Boolean);

    /**
     * 获取窗口 z-index
     */
    get zIndex(): Number;

    /**
     * 设置窗口 z-index
     * @param value z-index
     */
    set zIndex(value: Number);

    /**
     * 获取窗口最小化目标元素
     */
    get minimizeTarget(): HTMLElement | null;

    /**
     * 设置窗口最小化目标元素
     * @param value 最小化目标元素
     */
    set minimizeTarget(value: HTMLElement | String | null);

    /**
     * 获取窗口是否置顶
     */
    get topmost(): Boolean;

    /**
     * 设置窗口是否置顶
     * @param value 是否置顶
     */
    set topmost(value: Boolean);

    /**
     * 最小化窗口
     */
    minimize(): void;

    /**
     * 最小化窗口
     * @param e 事件对象
     */
    minimize(e: Event): void;

    /**
     * 最大化窗口
     */
    maximize(): void;

    /**
     * 最大化窗口
     * @param e 事件对象
     */
    maximize(e: Event): void;

    /**
     * 还原窗口
     */
    restore(): void;

    /**
     * 还原窗口
     * @param e 事件对象
     */
    restore(e: Event): void;

    /**
     * 关闭窗口
     */
    close(): void;

    /**
     * 关闭窗口
     * @param e 事件对象
     */
    close(e: Event): void;

    /**
     * 开始移动窗口
     * @param e 事件对象
     */
    moveBegin(e: PointerEvent): void;

    /**
     * 激活窗口
     */
    active(): void;

    /**
     * 激活窗口
     * @param e 事件对象
     */
    active(e:Event): void;

    /**
     * 失去焦点
     */
    deactive(): void;

    /**
     * 失去焦点
     * @param e 事件对象
     */
    deactive(e: Event): void;
}