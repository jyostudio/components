import Component from "./component.d.ts";

/**
 * 开关按钮组件
 */
export default class ToggleButton extends Component {
    /**
     * 获取开关状态
     */
    get checked(): boolean;

    /**
     * 设置开关状态
     * @param value - 开关状态
     */
    set checked(value: boolean);
}