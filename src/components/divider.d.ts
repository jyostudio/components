import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";

/**
 * 内容对其方式
 */
declare class AlignContent extends Enum {
    /**
     * 开始
     */
    static readonly start: AlignContent;

    /**
     * 居中
     */
    static readonly center: AlignContent;

    /**
     * 结束
     */
    static readonly end: AlignContent;
}

/**
 * 方向
 */
declare class Orientation extends Enum {
    /**
     * 水平
     */
    static readonly horizontal: Orientation;

    /**
     * 垂直
     */
    static readonly vertical: Orientation;
}

/**
 * 分割线组件
 */
export default class Divider extends Component {
    /**
     * 内容对其方式
     */
    static get AlignContent(): typeof AlignContent;

    /**
     * 方向
     */
    static get Orientation(): typeof Orientation;

    /**
     * 获取内容对其方式
     */
    get alignContent(): AlignContent;

    /**
     * 设置内容对其方式
     * @param value - 内容对其方式
     */
    set alignContent(value: AlignContent);

    /**
     * 获取方向
     */
    get orientation(): Orientation;

    /**
     * 设置方向
     * @param value - 方向
     */
    set orientation(value: Orientation);
}