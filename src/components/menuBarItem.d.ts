import Component from "./component.d.ts";
import Flyout from "./flyout.d.ts";

/**
 * 菜单栏项组件
 */
export default class MenuBarItem extends Component {
    /**
     * 飞出菜单定位
     */
    get flyoutPositioning() {
        return Flyout.Positioning.belowStart;
    }
}