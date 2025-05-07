import Component from "./component.d.ts";

/**
 * 亚克力效果组件
 */
export default class Acrylic extends Component {
    /**
     * 获取色调颜色
     */
    get tintColor(): String;

    /**
     * 设置色调颜色
     * @param value - 色调颜色，可以是十六进制颜色值或 RGB/RGBA 值
     */
    set tintColor(value: String);

    /**
     * 获取色调不透明度
     */
    get tintOpacity(): Number;

    /**
     * 设置色调不透明度
     * @param value - 色调不透明度，范围为 0 到 1
     */
    set tintOpacity(value: Number | String);

    /**
     * 获取回退颜色
     */
    get fallbackColor(): String;

    /**
     * 设置回退颜色
     * @param value - 回退颜色，可以是十六进制颜色值或 RGB/RGBA 值
     */
    set fallbackColor(value: String);

    /**
     * 获取是否失焦
     */
    get deactive(): Boolean;

    /**
     * 设置是否失焦
     * @param value - 是否失焦
     */
    set deactive(value: Boolean);
}