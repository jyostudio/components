import overload from "@jyostudio/overload";
import Component from "./component.d.ts";

/**
 * 进度环组件
 */
export default class ProgressRing extends Component {
    /**
     * 获取进度环背景颜色
     */
    get background(): String;

    /**
     * 设置进度环背景颜色
     * @param value - 进度环背景颜色
     */
    set background(value: String);

    /**
     * 获取是否为不确定状态
     */
    get isIndeterminate(): Boolean;

    /**
     * 设置是否为不确定状态
     * @param value - 是否为不确定状态
     */
    set isIndeterminate(value: Boolean);

    /**
     * 获取进度环值
     */
    get value(): Number;

    /**
     * 设置进度环值
     * @param value - 进度环值
     */
    set value(value: Number);

    /**
     * 获取进度环最大值
     */
    get max(): Number;

    /**
     * 设置进度环最大值
     * @param value - 进度环最大值
     */
    set max(value: Number);

    /**
     * 获取进度环最小值
     */
    get min(): Number;

    /**
     * 设置进度环最小值
     * @param value - 进度环最小值
     */
    set min(value: Number);
}