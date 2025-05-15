/**
 * 主题枚举
 */
declare class Themes extends Enum {
    /**
     * 亮色主题
     */
    static readonly light: Themes;

    /**
     * 暗色主题
     */
    static readonly dark: Themes;

    /**
     * 浅色主题
     */
    static readonly highContrast: Themes;
}

/**
 * 主题管理器
 */
export default new class ThemeManager extends EventTarget {
    /**
     * 主题枚举
     */
    get Themes(): typeof Themes;

    /**
     * 获取当前主题
     */
    get currentTheme(): Themes;

    /**
     * 获取全局样式代码
     */
    get styles(): String;

    /**
     * 获取全局样式对象
     */
    get styleSheet(): CSSStyleSheet;

    /**
     * 获取当前是否支持 HDR
     */
    get supportHDR(): Boolean;

    /**
     * 获取当前是否支持 P3
     */
    get supportP3(): Boolean;

    /**
     * 获取主色
     */
    get mainColor(): String;

    /**
     * 设置主色
     */
    set mainColor(value: String);

    /**
     * 获取色调扭曲
     */
    get hueTorsion(): Number;

    /**
     * 设置色调扭曲
     */
    set hueTorsion(value: Number);

    /**
     * 获取色彩活力度
     */
    get vibrancy(): Number;

    /**
     * 设置色彩活力度
     */
    set vibrancy(value: Number);

    /**
     * 获取是否启用透明度
     */
    get enableAlpha(): Boolean;

    /**
     * 设置是否启用透明度
     */
    set enableAlpha(value: Boolean);

    /**
     * 获取当前是否为自动主题
     */
    get isAutoTheme(): Boolean;

    /**
     * 设置当前是否为自动主题
     */
    set isAutoTheme(value: Boolean);

    /**
     * 转换颜色到P3色彩空间
     * @param red - 红色
     * @param green - 绿色
     * @param blue - 蓝色
     * @returns 转换后的颜色文本
     */
    rgbaToP3(red: Number, green: Number, blue: Number): String;

    /**
     * 转换颜色到P3色彩空间
     * @param red - 红色
     * @param green - 绿色
     * @param blue - 蓝色
     * @param alpha - 透明度
     * @returns 转换后的颜色文本
     */
    rgbaToP3(red: Number, green: Number, blue: Number, alpha: Number): String;

    /**
     * 转换颜色到P3色彩空间
     * @param colorText - 颜色文本(支持 rgba()、#rgb、#rgba、#rrggbb、#rrggbbaa)
     * @returns 转换后的颜色文本
     */
    convertToP3(colorText: String): String;

    /**
     * 上升支持到HDR色彩空间
     * @param styleText - 原始样式文本
     * @returns 上升支持到HDR色彩空间后的样式文本
     * @description 仅在支持HDR和P3色彩空间时生效
     */
    enhanceToHDR(styleText: String): String;

    /**
     * 应用主题
     * @param theme - 主题
     */
    applyTheme(theme: Themes): void;

    /**
     * 链接到文档
     */
    link(): void;

    /**
     * 链接到文档
     * @param root - 文档、ShadowRoot或元素
     */
    link(root: Document | ShadowRoot | HTMLElement): void;

    /**
     * 从文档中断开
     */
    unlink(): void;

    /**
     * 从文档中断开
     * @param root - 文档、ShadowRoot或元素
     */
    unlink(root: Document | ShadowRoot | HTMLElement): void;

    /**
     * 断开所有链接
     */
    unlinkAll(): void;
}