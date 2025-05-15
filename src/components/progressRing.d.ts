import overload from "@jyostudio/overload";
import Component from "./component.d.ts";

/**
 * 进度环组件
 */
export default class ProgressRing extends Component {
    /**
     * 获取进度环背景颜色
     */
    get background(): string;

    /**
     * 设置进度环背景颜色
     * @param value - 进度环背景颜色
     */
    set background(value: string);

    /**
     * 获取是否为不确定状态
     */
    get isIndeterminate(): boolean;

    /**
     * 设置是否为不确定状态
     * @param value - 是否为不确定状态
     */
    set isIndeterminate(value: boolean);

    /**
     * 获取进度环值
     */
    get value(): number;

    /**
     * 设置进度环值
     * @param value - 进度环值
     */
    set value(value: number);

    /**
     * 获取进度环最大值
     */
    get max(): number;

    /**
     * 设置进度环最大值
     * @param value - 进度环最大值
     */
    set max(value: number);

    /**
     * 获取进度环最小值
     */
    get min(): number;

    /**
     * 设置进度环最小值
     * @param value - 进度环最小值
     */
    set min(value: number);
}