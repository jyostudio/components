import Component from "./component.d.ts";
import Flyout from "./flyout.d.ts";

/**
 * 可切换的分割按钮组件
 */
export default class ToggleSplitButton extends Component {
    /**
     * 飞出菜单定位
     */
    get flyoutPositioning() {
        return Flyout.Positioning.belowStart;
    }

    /**
     * 获取切换按钮的状态
     */
    get checked(): boolean;

    /**
     * 设置切换按钮的状态
     * @param {boolean} value - 切换按钮的状态
     */
    set checked(value: boolean);
}