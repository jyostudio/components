import Enum from "@jyostudio/enum";
import Component from "./component.d.ts";
import TreeViewItem from "./treeViewItem.d.ts";

/**
 * 树视图选择模式
 */
declare class TreeViewSelectionMode extends Enum {
    /**
     * 不可选择
     */
    static readonly none: TreeViewSelectionMode;

    /**
     * 单选
     */
    static readonly single: TreeViewSelectionMode;

    /**
     * 多选
     */
    static readonly multiple: TreeViewSelectionMode;
}

/**
 * 树视图组件
 */
export default class TreeView extends Component {
    /**
     * 获取选择的项目
     */
    get selectedItems(): TreeViewItem[];

    /**
     * 获取选择模式
     */
    get treeViewSelectionMode(): TreeViewSelectionMode;

    /**
     * 设置选择模式
     * @param value 选择模式
     */
    set treeViewSelectionMode(value: TreeViewSelectionMode);
}