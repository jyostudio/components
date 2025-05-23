/**
 * 注册组件选项
 */
interface RegisterOptions {
    /**
     * 样式代码
     */
    css?: string;
    /**
     * HTML
     */
    html?: string;
}

/**
 * 组件基类
 */
export default class Component extends HTMLElement {
    /**
     * 观察属性
     */
    static get observedAttributes(): string[];

    /**
     * 是否支持 form 关联
     */
    static get formAssociated(): boolean;

    /**
     * 获取组件 ID
     * @returns {string} 组件 ID
     */
    get componentId(): string;

    /**
     * 获取是否已初始化
     */
    get hasInit(): boolean;

    /**
     * 注册组件
     */
    static registerComponent(options: RegisterOptions): void;

    /**
     * 获取内部部件
     */
    get internals(): ElementInternals;

    /**
     * 获取取消控制器
     */
    get abortController(): AbortController;

    // /**
    //  * 销毁组件
    //  */
    // [Symbol.dispose]() : void;

    /**
     * 元素被添加到 DOM 树中时调用
     */
    connectedCallback(): void;

    /**
     * DOM 元素被移动到新文档时调用
     */
    adoptedCallback(): void;

    /**
     * DOM 元素属性更改时调用
     * @param name - 属性名称
     * @param oldValue - 旧值
     * @param newValue - 新值
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;

    /**
     * DOM 元素从文档中断开时调用
     */
    disconnectedCallback(): void;

    /**
     * 触发自定义事件
     * @param type - 事件类型
     * @returns 是否成功触发
     */
    dispatchCustomEvent(type: string): boolean;

    /**
     * 触发自定义事件
     * @param type - 事件类型
     * @param eventInitDict - 事件初始化字典
     * @returns 是否成功触发
     */
    dispatchCustomEvent(type: string, eventInitDict: CustomEventInit<any>): boolean;

    /**
     * 调用锁
     * @param name - 名称
     * @param callback - 回调函数
     */
    lock(name: string, callback: () => any): void;

    /**
     * 根据 TAG_NAME 获取最近的父元素
     * @param tagName - 标签名
     * @returns 如果找到则返回元素，否则返回 null
     */
    getClosestByTagName(tagName: string): HTMLElement | null;

    /**
     * 等待父元素定义
     * @param callback - 当父元素定义后调用的回调函数
     * @returns 返回一个 Promise 对象，内容为回调函数的返回值
     */
    thenParentDefined(callback: () => any): Promise<any>;
}