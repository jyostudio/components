import themeManager from "../libs/themeManager/themeManager.d.ts";
import Component from "./component.d.ts";

/**
 * 开关组件
 */
export default class ToggleSwitch extends Component {
    /**
     * 获取头部文本
     */
    get header(): string;

    /**
     * 设置头部文本
     * @param value - 头部文本
     */
    set header(value: string);

    /**
     * 获取关闭时的文本
     */
    get contentOff(): string;

    /**
     * 设置关闭时的文本
     * @param value - 关闭时的文本
     */
    set contentOff(value: string);

    /**
     * 获取打开时的文本
     */
    get contentOn(): string;

    /**
     * 设置打开时的文本
     * @param value - 打开时的文本
     */
    set contentOn(value: string);

    /**
     * 获取开关状态
     */
    get isOn(): boolean;

    /**
     * 设置开关状态
     * @param value - 开关状态
     */
    set isOn(value: boolean);
}