import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 刻度位置
 */
declare class TickPlacement extends Enum {
    /**
     * 无
     */
    static readonly none: TickPlacement;

    /**
     * 左/上
     */
    static readonly topLeft: TickPlacement;

    /**
     * 右/下
     */
    static readonly bottomRight: TickPlacement;

    /**
     * 外部
     */
    static readonly outside: TickPlacement;

    /**
     * 内部
     */
    static readonly inline: TickPlacement;
}

/**
 * 滑块对齐方式
 */
declare class SliderSnapsTo extends Enum {
    /**
     * 步长值
     */
    static readonly stepValues: SliderSnapsTo;

    /**
     * 刻度
     */
    static readonly ticks: SliderSnapsTo;
}

/**
 * 方向
 */
declare class Orientation extends Enum {
    /**
     * 水平
     */
    static readonly horizontal: Orientation;

    /**
     * 垂直
     */
    static readonly vertical: Orientation;
}

/**
 * 滑块组件
 */
export default class Slider extends Component {
    /**
     * 刻度位置
     */
    static TickPlacement(): typeof TickPlacement;

    /**
     * 滑块对齐方式
     */
    static SliderSnapsTo(): typeof SliderSnapsTo;

    /**
     * 方向
     */
    static Orientation(): typeof Orientation;

    /**
     * 获取最小值
     */
    get minimum(): number;

    /**
     * 设置最小值
     * @param value - 最小值
     */
    set minimum(value: number);

    /**
     * 获取最大值
     */
    get maximum(): number;

    /**
     * 设置最大值
     * @param value - 最大值
     */
    set maximum(value: number);

    /**
     * 获取当前值
     */
    get value(): number;

    /**
     * 设置当前值
     * @param value - 当前值
     */
    set value(value: number);

    /**
     * 获取刻度频率
     */
    get tickFrequency(): number;

    /**
     * 设置刻度频率
     * @param value - 刻度频率
     */
    set tickFrequency(value: number);

    /**
     * 获取刻度位置
     */
    get tickPlacement(): TickPlacement;

    /**
     * 设置刻度位置
     * @param value - 刻度位置
     */
    set tickPlacement(value: TickPlacement);

    /**
     * 获取滑块对齐方式
     */
    get snapsTo(): SliderSnapsTo;

    /**
     * 设置滑块对齐方式
     * @param value - 滑块对齐方式
     */
    set snapsTo(value: SliderSnapsTo);

    /**
     * 获取方向
     */
    get orientation(): Orientation;

    /**
     * 设置方向
     * @param value - 方向
     */
    set orientation(value: Orientation);
}