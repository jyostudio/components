import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 类型
 */
class Type extends Enum {
    /**
     * 默认
     */
    static readonly default: Type;

    /**
     * 单选
     */
    static readonly radio: Type;

    /**
     * 复选
     */
    static readonly checkbox: Type;
}

/**
 * 飞出菜单项组件
 */
export default class MenuFlyoutItem extends Component {
    /**
     * 类型
     */
    static get Type(): typeof Type;

    /**
     * 获取选中状态
     */
    get checked(): boolean;

    /**
     * 设置选中状态
     * @param value - 选中状态
     */
    set checked(value: boolean);

    /**
     * 获取类型
     */
    get type(): Type;

    /**
     * 设置类型
     * @param value - 类型
     */
    set type(value: Type);
}