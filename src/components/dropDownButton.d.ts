import Component from "./component.d.ts";
import Flyout from "./flyout.d.ts";

/**
 * 下拉按钮组件
 */
export default class DropDownButton extends Component {
    /**
     * 飞出菜单定位
     */
    get flyoutPositioning(): typeof Flyout.Positioning;
}