import Enum from "@jyostudio/enum";
import themeManager from "../libs/themeManager/themeManager.d.ts";
import Component from "./component.d.ts";

/**
 * 密码显示行为
 */
declare class PasswordRevealMode extends Enum {
    /**
     * 密码显示按钮可见，密码始终被掩盖
     * @type {Number}
     */
    static readonly peed: PasswordRevealMode;

    /**
     * 密码显示按钮不可见，密码始终被掩盖
     * @type {Number}
     */
    static readonly hidden: PasswordRevealMode;

    /**
     * 密码显示按钮不可见，密码不会被掩盖
     * @type {Number}
     */
    static readonly visible: PasswordRevealMode;
}

/**
 * 密码输入框组件
 */
export default class PasswordBox extends Component {
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
     * 获取密码显示模式
     */
    get passwordRevealMode(): PasswordRevealMode;

    /**
     * 设置密码显示模式
     * @param value - 密码显示模式
     */
    set passwordRevealMode(value: PasswordRevealMode);
}