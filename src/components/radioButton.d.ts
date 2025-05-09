import overload from "@jyostudio/overload";
import Component from "./component.d.ts";

/**
 * 单选按钮组件
 */
export default class RadioButton extends Component {
    /**
     * 获取单选按钮值
     */
    get value(): String;

    /**
     * 设置单选按钮值
     * @param value - 单选按钮值
     */
    set value(value: String);

    /**
     * 获取单选按钮文本内容
     */
    get content(): String;

    /**
     * 设置单选按钮文本内容
     * @param value - 单选按钮文本内容
     */
    set content(value: String);

    /**
     * 获取单选按钮是否被选中
     */
    get isChecked(): Boolean;

    /**
     * 设置单选按钮是否被选中
     * @param value - 单选按钮是否被选中
     */
    set isChecked(value: Boolean);
}