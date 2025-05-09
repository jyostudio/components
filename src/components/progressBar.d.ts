import overload from "@jyostudio/overload";
import Component from "./component.d.ts";

/**
 * 进度条组件
 */
export default class ProgressBar extends Component {
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
     * 获取进度条值
     */
    get value(): Number;

    /**
     * 设置进度条值
     * @param value - 进度条值
     */
    set value(value: Number);

    /**
     * 获取进度条最大值
     */
    get max(): Number;

    /**
     * 设置进度条最大值
     * @param value - 进度条最大值
     */
    set max(value: Number);

    /**
     * 获取进度条最小值
     */
    get min(): Number;

    /**
     * 设置进度条最小值
     * @param value - 进度条最小值
     */
    set min(value: Number);
}