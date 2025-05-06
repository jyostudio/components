import Component from "./component.d.ts";

/**
 * 复选框组件
 */
export default class CheckBox extends Component {
    /**
     * 获取说明文字
     */
    get content(): String;

    /**
     * 设置说明文字
     */
    set content(value: String);

    /**
     * 获取是否三态
     */
    get isThreeState(): Boolean;

    /**
     * 设置是否三态
     */
    set isThreeState(value: Boolean);

    /**
     * 获取是否选中
     */
    get isChecked(): Boolean | null;

    /**
     * 设置是否选中
     */
    set isChecked(value: Boolean | null);
}