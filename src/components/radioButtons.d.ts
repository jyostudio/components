import overload from "@jyostudio/overload";
import Component from "./component.d.ts";
import RadioButton from "./radioButton.d.ts";

/**
 * 单选按钮组组件
 */
export default class RadioButtons extends Component {
    /**
     * 获取标头文本
     */
    get header(): String;

    /**
     * 设置标头文本
     * @param value - 标头文本
     */
    set header(value: String);

    /**
     * 获取选择的单选按钮下标索引
     */
    get selectedIndex(): Number;

    /**
     * 设置选择的单选按钮下标索引
     * @param value - 选择的单选按钮下标索引
     */
    set selectedIndex(value: Number);

    /**
     * 获取选择的单选按钮
     */
    get selectedItem(): RadioButton | null;

    /**
     * 设置选择的单选按钮
     * @param value - 选择的单选按钮
     */
    set selectedItem(value: RadioButton | null);

    /**
     * 设置选择的单选按钮
     * @param value - 选择的单选按钮
     */
    set selectedItem(value: Object);

    /**
     * 获取是否禁用
     */
    get disabled(): Boolean;

    /**
     * 设置是否禁用
     * @param value - 是否禁用
     */
    set disabled(value: Boolean);
}