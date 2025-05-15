import Component from "./component.d.ts";

/**
 * 树视图项组件
 */
export default class TreeViewItem extends Component {
    /**
     * 获取项文本
     */
    get text(): string;

    /**
     * 设置项文本
     * @param value 文本内容
     */
    set text(value: string);

    /**
     * 获取是否展开
     */
    get isExpanded(): boolean;

    /**
     * 设置是否展开
     * @param value 是否展开
     */
    set isExpanded(value: boolean);
}