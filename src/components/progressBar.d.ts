import overload from "@jyostudio/overload";
import Component from "./component.d.ts";

/**
 * 进度条组件
 */
export default class ProgressBar extends Component {
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
     * 获取进度条值
     */
    get value(): number;

    /**
     * 设置进度条值
     * @param value - 进度条值
     */
    set value(value: number);

    /**
     * 获取进度条最大值
     */
    get max(): number;

    /**
     * 设置进度条最大值
     * @param value - 进度条最大值
     */
    set max(value: number);

    /**
     * 获取进度条最小值
     */
    get min(): number;

    /**
     * 设置进度条最小值
     * @param value - 进度条最小值
     */
    set min(value: number);
}