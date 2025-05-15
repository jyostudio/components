import Component from "./component.d.ts";
import ComboBoxItem from "./comboBoxItem.d.ts";

/**
 * 下拉框组件
 */
export default class ComboBox extends Component {
    /**
     * 获取当前选择的元素
     */
    get selectedItem(): ComboBoxItem | null;

    /**
     * 设置当前选择的元素
     * @param value 选择的元素
     */
    set selectedItem(value: ComboBoxItem | null);

    /**
     * 获取当前选择的元素索引
     */
    get selectedIndex(): number;

    /**
     * 设置当前选择的元素索引
     * @param value 选择的元素索引
     */
    set selectedIndex(value: number);
}