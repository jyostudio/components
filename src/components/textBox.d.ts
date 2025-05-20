import Enum from "@jyostudio/enum";
import themeManager from "../libs/themeManager/themeManager.d.ts";
import Component from "./component.d.ts";

/**
 * 输入框模式
 */
declare class Mode extends Enum {
    /**
     * 文本
     */
    static readonly text: Mode;

    /**
     * 电子邮件
     */
    static readonly email: Mode;

    /**
     * 网址
     */
    static readonly url: Mode;

    /**
     * 电话
     */
    static readonly tel: Mode;

    /**
     * 搜索
     */
    static readonly search: Mode;
}

/**
 * 输入框组件
 */
export default class TextBox extends Component {
    /**
     * 输入框模式
     */
    static get Mode(): typeof Mode;

    /**
     * 获取输入框的值
     */
    get value(): string;

    /**
     * 设置输入框的值
     * @param value - 输入框的值
     */
    set value(value: string);

    /**
     * 获取输入框的占位符
     */
    get placeholder(): string;

    /**
     * 设置输入框的占位符
     * @param value - 输入框的占位符
     */
    set placeholder(value: string);

    /**
     * 获取输入框是否只读
     */
    get readonly(): boolean;

    /**
     * 设置输入框是否只读
     * @param value - 输入框是否只读
     */
    set readonly(value: boolean);

    /**
     * 获取输入框的最大长度
     */
    get maxlength(): number;

    /**
     * 设置输入框的最大长度
     * @param value - 输入框的最大长度
     */
    set maxlength(value: number);

    /**
     * 获取输入框的模式
     */
    get mode(): Mode;

    /**
     * 设置输入框的模式
     * @param value - 输入框的模式
     */
    set mode(value: Mode);

    /**
     * 禁用功能区
     */
    get disableFunction(): boolean;

    /**
     * 设置禁用功能区
     * @param value - 禁用功能区
     */
    set disableFunction(value: boolean);
}