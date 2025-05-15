import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 信息栏严重性
 */
declare class InfoBarSeverity extends Enum {
    /**
     * 信息
     */
    static readonly informational: InfoBarSeverity;

    /**
     * 成功
     */
    static readonly success: InfoBarSeverity;

    /**
     * 警告
     */
    static readonly warning: InfoBarSeverity;

    /**
     * 错误
     */
    static readonly error: InfoBarSeverity;
}

/**
 * 信息栏组件
 */
export default class InfoBar extends Component {
    /**
     * 信息栏严重性
     */
    static get InfoBarSeveity(): typeof InfoBarSeverity;

    /**
     * 获取信息栏严重性
     */
    get severity(): InfoBarSeverity;

    /**
     * 设置信息栏严重性
     * @param value - 信息栏严重性
     */
    set severity(value: InfoBarSeverity);

    /**
     * 获取是否打开
     */
    get isOpen(): boolean;

    /**
     * 设置是否打开
     * @param value - 是否打开
     */
    set isOpen(value: boolean);

    /**
     * 获取是否可见图标
     */
    get isIconVisible(): boolean;

    /**
     * 设置是否可见图标
     * @param value - 是否可见图标
     */
    set isIconVisible(value: boolean);

    /**
     * 获取是否可关闭
     */
    get isClosable(): boolean;

    /**
     * 设置是否可关闭
     * @param value - 是否可关闭
     */
    set isClosable(value: boolean);
}