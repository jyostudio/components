import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 按钮类型
 */
declare class Type extends Enum {
    /**
     * 提交按钮
     */
    static readonly submit: Type;

    /**
     * 重置按钮
     */
    static readonly reset: Type;

    /**
     * 普通按钮
     */
    static readonly button: Type;
}

/**
 * 按钮组件
 */
export default class Button extends Component {
    /**
     * 按钮类型
     */
    static get Type(): typeof Type;

    /**
     * 获取按钮类型
     */
    get type(): Type;

    /**
     * 设置按钮类型
     * @param value - 按钮类型
     */
    set type(value: Type | "submit" | "reset" | "button");
}