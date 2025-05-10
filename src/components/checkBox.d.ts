import Component from "./component.d.ts";

/**
 * 复选框组件
 */
export default class CheckBox extends Component {
    /**
     * 获取说明文字
     */
    get content(): string;

    /**
     * 设置说明文字
     */
    set content(value: string);

    /**
     * 获取是否三态
     */
    get isThreeState(): boolean;

    /**
     * 设置是否三态
     */
    set isThreeState(value: boolean);

    /**
     * 获取是否选中
     */
    get isChecked(): boolean | null;

    /**
     * 设置是否选中
     */
    set isChecked(value: boolean | null);
}