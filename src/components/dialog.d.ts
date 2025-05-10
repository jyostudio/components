import Component from "./component.js";

/**
 * 对话框组件
 */
export default class Dialog extends Component {
    /**
     * 获取是否打开
     */
    get isOpen(): boolean;

    /**
     * 设置是否打开
     */
    set isOpen(value: boolean | string);

    /**
     * 打开
     */
    open(): void;

    /**
     * 关闭
     */
    close(): void;

    /**
     * 切换打开状态
     */
    toggle(): void;
}