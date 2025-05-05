import overload from "@jyostudio/overload";
import Enum from "@jyostudio/enum";
import { hexColorsFromPalette, hex_to_LCH as hexToLCH } from "./colors/index.js";
import createDarkColor from "./theme/createDarkColor.js";
import createLightColor from "./theme/createLightColor.js";
import createHighContrastColor from "./theme/createHighContrastColor.js";

/**
 * 主题枚举
 * @enum {Theme}
 */
class Themes extends Enum {
    static {
        this.set({
            light: "light", // 亮色
            dark: "dark", // 暗色
            highContrast: "highContrast" // 高对比度
        });
    }
}

const BASIC_STYLES = /* css */`
--borderRadiusNone: 0;
--borderRadiusSmall: 2px;
--borderRadiusMedium: 4px;
--borderRadiusLarge: 6px;
--borderRadiusXLarge: 8px;
--borderRadiusCircular: 10000px;
--fontSizeBase100: 10px;
--fontSizeBase200: 12px;
--fontSizeBase300: 14px;
--fontSizeBase400: 16px;
--fontSizeBase500: 20px;
--fontSizeBase600: 24px;
--fontSizeHero700: 28px;
--fontSizeHero800: 32px;
--fontSizeHero900: 40px;
--fontSizeHero1000: 68px;
--lineHeightBase100: 14px;
--lineHeightBase200: 16px;
--lineHeightBase300: 20px;
--lineHeightBase400: 22px;
--lineHeightBase500: 28px;
--lineHeightBase600: 32px;
--lineHeightHero700: 36px;
--lineHeightHero800: 40px;
--lineHeightHero900: 52px;
--lineHeightHero1000: 92px;
--fontFamilyBase: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
    "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
--fontFamilyMonospace: Consolas, "Courier New", Courier, monospace;
--fontFamilyNumeric: Bahnschrift, "Segoe UI", "Segoe UI Web (West European)",
    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
--fontWeightRegular: 400;
--fontWeightMedium: 500;
--fontWeightSemibold: 600;
--fontWeightBold: 700;
--strokeWidthThin: 1px;
--strokeWidthThick: 2px;
--strokeWidthThicker: 3px;
--strokeWidthThickest: 4px;
--spacingHorizontalNone: 0;
--spacingHorizontalXXS: 2px;
--spacingHorizontalXS: 4px;
--spacingHorizontalSNudge: 6px;
--spacingHorizontalS: 8px;
--spacingHorizontalMNudge: 10px;
--spacingHorizontalM: 12px;
--spacingHorizontalL: 16px;
--spacingHorizontalXL: 20px;
--spacingHorizontalXXL: 24px;
--spacingHorizontalXXXL: 32px;
--spacingVerticalNone: 0;
--spacingVerticalXXS: 2px;
--spacingVerticalXS: 4px;
--spacingVerticalSNudge: 6px;
--spacingVerticalS: 8px;
--spacingVerticalMNudge: 10px;
--spacingVerticalM: 12px;
--spacingVerticalL: 16px;
--spacingVerticalXL: 20px;
--spacingVerticalXXL: 24px;
--spacingVerticalXXXL: 32px;
--durationUltraFast: 50ms;
--durationFaster: 100ms;
--durationFast: 150ms;
--durationNormal: 200ms;
--durationGentle: 250ms;
--durationSlow: 300ms;
--durationSlower: 400ms;
--durationUltraSlow: 500ms;
--curveAccelerateMax: cubic-bezier(0.9, 0.1, 1, 0.2);
--curveAccelerateMid: cubic-bezier(1, 0, 1, 1);
--curveAccelerateMin: cubic-bezier(0.8, 0, 0.78, 1);
--curveDecelerateMax: cubic-bezier(0.1, 0.9, 0.2, 1);
--curveDecelerateMid: cubic-bezier(0, 0, 0, 1);
--curveDecelerateMin: cubic-bezier(0.33, 0, 0.1, 1);
--curveEasyEaseMax: cubic-bezier(0.8, 0, 0.2, 1);
--curveEasyEase: cubic-bezier(0.33, 0, 0.67, 1);
--curveLinear: cubic-bezier(0, 0, 1, 1);
--colorPaletteRedBackground1: #fdf6f6;
--colorPaletteRedBackground2: #f1bbbc;
--colorPaletteRedBackground3: #d13438;
--colorPaletteRedForeground1: #bc2f32;
--colorPaletteRedForeground2: #751d1f;
--colorPaletteRedForeground3: #d13438;
--colorPaletteRedBorderActive: #d13438;
--colorPaletteRedBorder1: #f1bbbc;
--colorPaletteRedBorder2: #d13438;
--colorPaletteGreenBackground1: #f1faf1;
--colorPaletteGreenBackground2: #9fd89f;
--colorPaletteGreenBackground3: #107c10;
--colorPaletteGreenForeground1: #0e700e;
--colorPaletteGreenForeground2: #094509;
--colorPaletteGreenForeground3: #107c10;
--colorPaletteGreenBorderActive: #107c10;
--colorPaletteGreenBorder1: #9fd89f;
--colorPaletteGreenBorder2: #107c10;
--colorPaletteDarkOrangeBackground1: #fdf6f3;
--colorPaletteDarkOrangeBackground2: #f4bfab;
--colorPaletteDarkOrangeBackground3: #da3b01;
--colorPaletteDarkOrangeForeground1: #c43501;
--colorPaletteDarkOrangeForeground2: #7a2101;
--colorPaletteDarkOrangeForeground3: #da3b01;
--colorPaletteDarkOrangeBorderActive: #da3b01;
--colorPaletteDarkOrangeBorder1: #f4bfab;
--colorPaletteDarkOrangeBorder2: #da3b01;
--colorPaletteYellowBackground1: #fffef5;
--colorPaletteYellowBackground2: #fef7b2;
--colorPaletteYellowBackground3: #fde300;
--colorPaletteYellowForeground1: #817400;
--colorPaletteYellowForeground2: #817400;
--colorPaletteYellowForeground3: #fde300;
--colorPaletteYellowBorderActive: #fde300;
--colorPaletteYellowBorder1: #fef7b2;
--colorPaletteYellowBorder2: #fde300;
--colorPaletteBerryBackground1: #fdf5fc;
--colorPaletteBerryBackground2: #edbbe7;
--colorPaletteBerryBackground3: #c239b3;
--colorPaletteBerryForeground1: #af33a1;
--colorPaletteBerryForeground2: #6d2064;
--colorPaletteBerryForeground3: #c239b3;
--colorPaletteBerryBorderActive: #c239b3;
--colorPaletteBerryBorder1: #edbbe7;
--colorPaletteBerryBorder2: #c239b3;
--colorPaletteLightGreenBackground1: #f2fbf2;
--colorPaletteLightGreenBackground2: #a7e3a5;
--colorPaletteLightGreenBackground3: #13a10e;
--colorPaletteLightGreenForeground1: #11910d;
--colorPaletteLightGreenForeground2: #0b5a08;
--colorPaletteLightGreenForeground3: #13a10e;
--colorPaletteLightGreenBorderActive: #13a10e;
--colorPaletteLightGreenBorder1: #a7e3a5;
--colorPaletteLightGreenBorder2: #13a10e;
--colorPaletteMarigoldBackground1: #fefbf4;
--colorPaletteMarigoldBackground2: #f9e2ae;
--colorPaletteMarigoldBackground3: #eaa300;
--colorPaletteMarigoldForeground1: #d39300;
--colorPaletteMarigoldForeground2: #835b00;
--colorPaletteMarigoldForeground3: #eaa300;
--colorPaletteMarigoldBorderActive: #eaa300;
--colorPaletteMarigoldBorder1: #f9e2ae;
--colorPaletteMarigoldBorder2: #eaa300;
--colorPaletteRedForegroundInverted: #dc5e62;
--colorPaletteGreenForegroundInverted: #359b35;
--colorPaletteYellowForegroundInverted: #fef7b2;
--colorPaletteDarkRedBackground2: #d69ca5;
--colorPaletteDarkRedForeground2: #420610;
--colorPaletteDarkRedBorderActive: #750b1c;
--colorPaletteCranberryBackground2: #eeacb2;
--colorPaletteCranberryForeground2: #6e0811;
--colorPaletteCranberryBorderActive: #c50f1f;
--colorPalettePumpkinBackground2: #efc4ad;
--colorPalettePumpkinForeground2: #712d09;
--colorPalettePumpkinBorderActive: #ca5010;
--colorPalettePeachBackground2: #ffddb3;
--colorPalettePeachForeground2: #8f4e00;
--colorPalettePeachBorderActive: #ff8c00;
--colorPaletteGoldBackground2: #ecdfa5;
--colorPaletteGoldForeground2: #6c5700;
--colorPaletteGoldBorderActive: #c19c00;
--colorPaletteBrassBackground2: #e0cea2;
--colorPaletteBrassForeground2: #553e06;
--colorPaletteBrassBorderActive: #986f0b;
--colorPaletteBrownBackground2: #ddc3b0;
--colorPaletteBrownForeground2: #50301a;
--colorPaletteBrownBorderActive: #8e562e;
--colorPaletteForestBackground2: #bdd99b;
--colorPaletteForestForeground2: #294903;
--colorPaletteForestBorderActive: #498205;
--colorPaletteSeafoamBackground2: #a8f0cd;
--colorPaletteSeafoamForeground2: #00723b;
--colorPaletteSeafoamBorderActive: #00cc6a;
--colorPaletteDarkGreenBackground2: #9ad29a;
--colorPaletteDarkGreenForeground2: #063b06;
--colorPaletteDarkGreenBorderActive: #0b6a0b;
--colorPaletteLightTealBackground2: #a6e9ed;
--colorPaletteLightTealForeground2: #00666d;
--colorPaletteLightTealBorderActive: #00b7c3;
--colorPaletteTealBackground2: #9bd9db;
--colorPaletteTealForeground2: #02494c;
--colorPaletteTealBorderActive: #038387;
--colorPaletteSteelBackground2: #94c8d4;
--colorPaletteSteelForeground2: #00333f;
--colorPaletteSteelBorderActive: #005b70;
--colorPaletteBlueBackground2: #a9d3f2;
--colorPaletteBlueForeground2: #004377;
--colorPaletteBlueBorderActive: #0078d4;
--colorPaletteRoyalBlueBackground2: #9abfdc;
--colorPaletteRoyalBlueForeground2: #002c4e;
--colorPaletteRoyalBlueBorderActive: #004e8c;
--colorPaletteCornflowerBackground2: #c8d1fa;
--colorPaletteCornflowerForeground2: #2c3c85;
--colorPaletteCornflowerBorderActive: #4f6bed;
--colorPaletteNavyBackground2: #a3b2e8;
--colorPaletteNavyForeground2: #001665;
--colorPaletteNavyBorderActive: #0027b4;
--colorPaletteLavenderBackground2: #d2ccf8;
--colorPaletteLavenderForeground2: #3f3682;
--colorPaletteLavenderBorderActive: #7160e8;
--colorPalettePurpleBackground2: #c6b1de;
--colorPalettePurpleForeground2: #341a51;
--colorPalettePurpleBorderActive: #5c2e91;
--colorPaletteGrapeBackground2: #d9a7e0;
--colorPaletteGrapeForeground2: #4c0d55;
--colorPaletteGrapeBorderActive: #881798;
--colorPaletteLilacBackground2: #e6bfed;
--colorPaletteLilacForeground2: #63276d;
--colorPaletteLilacBorderActive: #b146c2;
--colorPalettePinkBackground2: #f7c0e3;
--colorPalettePinkForeground2: #80215d;
--colorPalettePinkBorderActive: #e43ba6;
--colorPaletteMagentaBackground2: #eca5d1;
--colorPaletteMagentaForeground2: #6b0043;
--colorPaletteMagentaBorderActive: #bf0077;
--colorPalettePlumBackground2: #d696c0;
--colorPalettePlumForeground2: #43002b;
--colorPalettePlumBorderActive: #77004d;
--colorPaletteBeigeBackground2: #d7d4d4;
--colorPaletteBeigeForeground2: #444241;
--colorPaletteBeigeBorderActive: #7a7574;
--colorPaletteMinkBackground2: #cecccb;
--colorPaletteMinkForeground2: #343231;
--colorPaletteMinkBorderActive: #5d5a58;
--colorPalettePlatinumBackground2: #cdd6d8;
--colorPalettePlatinumForeground2: #3b4447;
--colorPalettePlatinumBorderActive: #69797e;
--colorPaletteAnchorBackground2: #bcc3c7;
--colorPaletteAnchorForeground2: #202427;
--colorPaletteAnchorBorderActive: #394146;
--colorStatusSuccessBackground1: #f1faf1;
--colorStatusSuccessBackground2: #9fd89f;
--colorStatusSuccessBackground3: #107c10;
--colorStatusSuccessForeground1: #0e700e;
--colorStatusSuccessForeground2: #094509;
--colorStatusSuccessForeground3: #107c10;
--colorStatusSuccessForegroundInverted: #54b054;
--colorStatusSuccessBorderActive: #107c10;
--colorStatusSuccessBorder1: #9fd89f;
--colorStatusSuccessBorder2: #107c10;
--colorStatusWarningBackground1: #fff9f5;
--colorStatusWarningBackground2: #fdcfb4;
--colorStatusWarningBackground3: #f7630c;
--colorStatusWarningForeground1: #bc4b09;
--colorStatusWarningForeground2: #8a3707;
--colorStatusWarningForeground3: #bc4b09;
--colorStatusWarningForegroundInverted: #faa06b;
--colorStatusWarningBorderActive: #f7630c;
--colorStatusWarningBorder1: #fdcfb4;
--colorStatusWarningBorder2: #bc4b09;
--colorStatusDangerBackground1: #fdf3f4;
--colorStatusDangerBackground2: #eeacb2;
--colorStatusDangerBackground3: #c50f1f;
--colorStatusDangerForeground1: #b10e1c;
--colorStatusDangerForeground2: #6e0811;
--colorStatusDangerForeground3: #c50f1f;
--colorStatusDangerForegroundInverted: #dc626d;
--colorStatusDangerBorderActive: #c50f1f;
--colorStatusDangerBorder1: #eeacb2;
--colorStatusDangerBorder2: #c50f1f;
--colorStatusDangerBackground3Hover: #b10e1c;
--colorStatusDangerBackground3Pressed: #960b18;
--shadow2: 0 0 2px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.28);
--shadow4: 0 0 2px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.28);
--shadow8: 0 0 2px rgba(0, 0, 0, 0.24), 0 4px 8px rgba(0, 0, 0, 0.28);
--shadow16: 0 0 2px rgba(0, 0, 0, 0.24), 0 8px 16px rgba(0, 0, 0, 0.28);
--shadow28: 0 0 8px rgba(0, 0, 0, 0.24), 0 14px 28px rgba(0, 0, 0, 0.28);
--shadow64: 0 0 8px rgba(0, 0, 0, 0.24), 0 32px 64px rgba(0, 0, 0, 0.28);
--shadow2Brand: 0 0 2px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.25);
--shadow4Brand: 0 0 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.25);
--shadow8Brand: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.25);
--shadow16Brand: 0 0 2px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.25);
--shadow28Brand: 0 0 8px rgba(0, 0, 0, 0.3), 0 14px 28px rgba(0, 0, 0, 0.25);
--shadow64Brand: 0 0 8px rgba(0, 0, 0, 0.3), 0 32px 64px rgba(0, 0, 0, 0.25);
`;

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 主题管理器
 * @class
 */
export default new class ThemeManager extends EventTarget {
    /**
     * 样式
     * @type {String?}
     */
    #styles = null;

    /**
     * 样式表
     * @type {CSSStyleSheet?}
     */
    #styleSheet = null;

    /**
     * 获取是否支持HDR色彩空间
     * @type {Boolean}
     */
    #supportHDR = false;

    /**
     * 获取是否支持P3色彩空间
     * @type {Boolean}
     */
    #supportP3 = false;

    /**
     * 主色
     * @type {String}
     */
    #mainColor = "#2D7D9A";

    /**
     * 色相偏移(-50 至 50)
     * @type {Number}
     */
    #hueTorsion = 0;

    /**
     * 活力值(-50 至 50)
     * @type {Number}
     */
    #vibrancy = 0;

    /**
     * 是否启用透明度
     * @type {Boolean}
     */
    #enableAlpha = true;

    /**
     * 当前主题
     * @type {Theme?}
     */
    #currentTheme = null;

    /**
     * 是否自动设置主题
     * @type {Boolean}
     */
    #isAutoTheme = true;

    /**
     * 自动设置的主题
     * @type {Theme}
     */
    #autoTheme = Themes.light;

    /**
     * 关联的根DOM元素集合
     * @type {Set<HTMLElement>}
     */
    #linkedRoots = new Set();

    /**
     * 防抖定时器
     * @type {Number?}
     */
    #debounceTimer = null;

    get Themes() {
        return Themes;
    }

    /**
     * 获取当前主题
     * @returns {Theme}
     */
    get currentTheme() {
        return this.#currentTheme;
    }

    static [CONSTRUCTOR_SYMBOL](...params) {
        ThemeManager[CONSTRUCTOR_SYMBOL] = overload([], function () {
            if (globalThis?.matchMedia?.("(dynamic-range: high)").matches) {
                this.#supportHDR = true;
            }
            if (globalThis?.matchMedia?.("(color-gamut: p3)").matches) {
                this.#supportP3 = true;
            }

            this.#initAutoSet();
            this.#initTransparencyObserver();
            this.applyTheme(this.#autoTheme || Themes.light);
        });

        return ThemeManager[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        Object.defineProperties(this, {
            styles: {
                get: () => this.#styles
            },
            styleSheet: {
                get: () => this.#styleSheet
            },
            supportHDR: {
                get: () => this.#supportHDR
            },
            supportP3: {
                get: () => this.#supportP3
            },
            mainColor: {
                get: () => this.#mainColor,
                set: overload([String], value => {
                    this.#mainColor = value;
                    this.#generateStyleSheetDebounced();
                })
            },
            hueTorsion: {
                get: () => this.#hueTorsion * 100,
                set: overload([Number], value => {
                    this.#hueTorsion = Math.max(-50, Math.min(50, value)) / 100;
                    this.#generateStyleSheetDebounced();
                })
            },
            vibrancy: {
                get: () => this.#vibrancy * 100,
                set: overload([Number], value => {
                    this.#vibrancy = Math.max(-50, Math.min(50, value)) / 100;
                    this.#generateStyleSheetDebounced();
                })
            },
            enableAlpha: {
                get: () => this.#enableAlpha && this.#currentTheme !== Themes.highContrast,
                set: overload([Boolean], value => {
                    this.#enableAlpha = value;
                    this.#generateStyleSheetDebounced();
                })
            },
            isAutoTheme: {
                get: () => this.#isAutoTheme,
                set: overload([Boolean], value => {
                    if (!("matchMedia" in globalThis)) {
                        value = false;
                    }
                    this.#isAutoTheme = value;
                    if (value) {
                        this.applyTheme(this.#autoTheme);
                    }
                })
            }
        });

        ThemeManager[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 初始化透明度监听
     */
    #initTransparencyObserver() {
        if (typeof globalThis !== "undefined" && !("matchMedia" in globalThis)) {
            this.#enableAlpha = false;
            return;
        }

        const prefersTransparency = globalThis.matchMedia("(prefers-reduced-transparency: reduce)");
        prefersTransparency.addEventListener("change", () => {
            this.#enableAlpha = !prefersTransparency.matches;
            this.#generateStyleSheet();
        });
        this.#enableAlpha = !prefersTransparency.matches;
    }

    /**
     * 初始化自动设置主题
     */
    #initAutoSet() {
        if (typeof globalThis !== "undefined" && !("matchMedia" in globalThis)) {
            this.applyTheme(Themes.light);
            this.#isAutoTheme = false;
            return;
        }

        const checkFn = () => {
            if (!this.#isAutoTheme) return;

            const prefersColorScheme = globalThis.matchMedia("(prefers-color-scheme: dark)");
            const prefersContrast = globalThis.matchMedia("(prefers-contrast: more)");
            if (prefersColorScheme.matches) {
                this.#autoTheme = Themes.dark;
            } else {
                this.#autoTheme = Themes.light;
            }
            if (prefersContrast.matches) {
                this.#autoTheme = Themes.highContrast;
            }
            this.applyTheme(this.#autoTheme);
        };

        const prefersContrast = globalThis.matchMedia("(prefers-contrast: more)");
        prefersContrast.addEventListener("change", checkFn);

        const prefersColorScheme = globalThis.matchMedia("(prefers-color-scheme: dark)");
        prefersColorScheme.addEventListener("change", checkFn);
        checkFn();
    }

    /**
     * 获取当前主题的颜色
     * @returns {Object} - 颜色对象
     */
    #getColors() {
        // const darkCp = 2 / 3;
        // const lightCp = 1 / 3;
        // const hueTorsion = 0;

        const brandPalette = {
            keyColor: hexToLCH(this.#mainColor),
            darkCp: this.#vibrancy,
            lightCp: this.#vibrancy,
            hueTorsion: this.#hueTorsion
        };
        const hexColors = hexColorsFromPalette(this.#mainColor, brandPalette, 16, 1);
        const brandVariants = hexColors.reduce((acc, hexColor, h) => {
            acc[`${(h + 1) * 10}`] = hexColor;
            return acc;
        }, {});

        switch (this.#currentTheme) {
            case Themes.light:
                return createLightColor(brandVariants);
            case Themes.dark:
                const darkTheme = createDarkColor(brandVariants);
                darkTheme.colorBrandForeground1 = brandVariants[110];
                darkTheme.colorBrandForeground2 = brandVariants[120];
                return darkTheme;
            case Themes.highContrast:
                return createHighContrastColor();
            default:
                console.warn("未定义的主题颜色，返回默认配色", this.#currentTheme);
                return createLightColor(brandVariants);
        }
    }

    /**
     * 转换颜色对象为 CSS 变量字符串
     * @param {Object} colors - 颜色对象，键为变量名，值为颜色值
     * @returns {String} - 生成的 CSS 变量字符串
     */
    #convertColorsToCSS(colors) {
        const enableAlpha = this.enableAlpha;
        return Object.entries(colors)
            .map(([key, value]) => {
                const mixValue = enableAlpha ? `color-mix(in srgb, ${value} 50%, var(--mixColor))` : value;
                return `--${key}: ${value};\n--mix-${key}: ${mixValue};`;
            })
            .join("\n");
    }

    /**
     * 生成混合颜色的CSS变量
     * @returns {String} - CSS变量字符串
     */
    #genMixColorsCSS() {
        const enableAlpha = this.enableAlpha;
        const colorRegex = /--([^:]+):\s*(#[0-9a-fA-F]+);/g;
        const cssLines = [];
        let match;

        while ((match = colorRegex.exec(BASIC_STYLES)) !== null) {
            const [, key, value] = match;
            cssLines.push(`--mix-${key}: ${enableAlpha ? `color-mix(in srgb, ${value} 50%, var(--mixColor))` : value
                };`);
        }

        return cssLines.join("\n");
    }

    /**
     * 防抖生成样式表
     */
    #generateStyleSheetDebounced() {
        if (this.#debounceTimer) {
            clearTimeout(this.#debounceTimer);
        }
        this.#debounceTimer = setTimeout(() => {
            this.#generateStyleSheet();
        }, 100);
    }

    /**
     * 生成样式表
     */
    #generateStyleSheet() {
        this.#styleSheet = this.#styleSheet ?? new CSSStyleSheet();
        const themeName = this.#currentTheme.valString;
        const styles = this.enhanceToHDR(/* css */`
            :host {
              --theme: ${themeName};
              --disableAlpha: ${this.enableAlpha ? "1" : "0"};
              --mixColor: rgba(${themeName === "light" ? "255, 255, 255" : "0, 0, 0"}, ${this.enableAlpha ? "0.1" : "1"});
              ${BASIC_STYLES}
              ${this.#genMixColorsCSS()}
              ${this.#convertColorsToCSS(this.#getColors())}
            }

            @media (prefers-reduced-motion: reduce) {
                :host {
                    --durationUltraFast: 0s;
                    --durationFaster: 0s;
                    --durationFast: 0s;
                    --durationNormal: 0s;
                    --durationGentle: 0s;
                    --durationSlow: 0s;
                    --durationSlower: 0s;
                    --durationUltraSlow: 0s;
                }
            }
        `);
        this.#styles = styles;
        this.#styleSheet.replaceSync(styles);
        this.dispatchEvent(new CustomEvent("update"));
    }

    rgbaToP3(...params) {
        ThemeManager.prototype.rgbaToP3 = overload()
            .add(
                [Number, Number, Number],
                /**
                 * RGB颜色转换到P3色彩空间
                 * @param {Number} red - 红色
                 * @param {Number} green - 绿色
                 * @param {Number} blue - 蓝色
                 * @returns {String} 转换后的颜色文本
                 */
                function (red, green, blue) {
                    return this.rgbaToP3(red, green, blue, 1);
                }
            )
            .add(
                [Number, Number, Number, Number],
                /**
                 * RGB颜色转换到P3色彩空间
                 * @param {Number} red - 红色
                 * @param {Number} green - 绿色
                 * @param {Number} blue - 蓝色
                 * @param {Number} alpha - 透明度
                 * @returns {String} 转换后的颜色文本
                 */
                function (red, green, blue, alpha) {
                    return `color(display-p3 ${red / 255} ${green / 255} ${blue / 255} / ${alpha})`;
                }
            );

        return ThemeManager.prototype.rgbaToP3.call(this, ...params);
    }

    convertToP3(...params) {
        ThemeManager.prototype.convertToP3 = overload(
            [String],
            /**
             * 转换颜色到P3色彩空间
             * @param {String} colorText - 颜色文本
             * @returns {String} - 转换后的颜色文本
             */
            function (colorText) {
                if (!this.#supportP3) return colorText;
                colorText = colorText.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([.\d]+))?\s*\)/gi, (match, r, g, b, a) => {
                    return this.rgbaToP3(parseFloat(r), parseFloat(g), parseFloat(b), parseFloat(a ?? 1));
                });
                colorText = colorText.replace(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})/gi, (match, color) => {
                    let r, g, b, a;
                    if (color.length === 3 || color.length === 4) {
                        r = parseInt(color[0] + color[0], 16);
                        g = parseInt(color[1] + color[1], 16);
                        b = parseInt(color[2] + color[2], 16);
                        a = color.length === 4 ? parseInt(color[3] + color[3], 16) / 255 : 1;
                    } else {
                        r = parseInt(color[0] + color[1], 16);
                        g = parseInt(color[2] + color[3], 16);
                        b = parseInt(color[4] + color[5], 16);
                        a = color.length === 8 ? parseInt(color[6] + color[7], 16) / 255 : 1;
                    }
                    return this.rgbaToP3(r, g, b, a);
                });
                return colorText;
            }
        );

        return ThemeManager.prototype.convertToP3.call(this, ...params);
    }

    enhanceToHDR(...params) {
        ThemeManager.prototype.enhanceToHDR = overload(
            [String],
            /**
             * 上升支持到HDR色彩空间
             * @param {String} styleText - 原始样式文本
             * @returns {String} - 上升支持到HDR色彩空间后的样式文本
             */
            function (styleText) {
                if (!this.#supportHDR || !this.#supportP3) return styleText;
                return this.convertToP3(styleText);
            }
        );

        return ThemeManager.prototype.enhanceToHDR.call(this, ...params);
    }

    applyTheme(...params) {
        ThemeManager.prototype.applyTheme = overload()
            .add(
                [Themes],
                /**
                 * 应用主题
                 * @param {Themes} theme - 主题
                 */
                function (theme) {
                    this.#currentTheme = theme;
                    this.#generateStyleSheet();
                    this.dispatchEvent(new CustomEvent("change", {
                        detail: {
                            theme
                        }
                    }));
                }
            );

        return ThemeManager.prototype.applyTheme.apply(this, params);
    }

    link(...params) {
        ThemeManager.prototype.link = overload()
            .add(
                [],
                /**
                 * 链接到文档
                 */
                function () {
                    return this.link(document);
                }
            )
            .add(
                [[Document, ShadowRoot, HTMLElement]],
                /**
                 * 链接到文档
                 * @param {Document|ShadowRoot|HTMLElement} root - 文档、ShadowRoot或元素
                 */
                function (root) {
                    if (this.#linkedRoots.has(root)) {
                        return;
                    }
                    this.#linkedRoots.add(root);
                    if (!root.adoptedStyleSheets.includes(this.#styleSheet)) {
                        root.adoptedStyleSheets = [...root.adoptedStyleSheets, this.#styleSheet];
                    }
                }
            );

        return ThemeManager.prototype.link.apply(this, params);
    }

    unlink(...params) {
        ThemeManager.prototype.unlink = overload()
            .add(
                [],
                /**
                 * 从文档中断开
                 */
                function () {
                    return this.unlink(document);
                }
            )
            .add(
                [[Document, ShadowRoot, HTMLElement]],
                /**
                 * 从文档中断开
                 * @param {Document|ShadowRoot|HTMLElement} root - 文档、ShadowRoot或元素
                 */
                function (root) {
                    if (!this.#linkedRoots.has(root)) {
                        return;
                    }
                    this.#linkedRoots.delete(root);
                    root.adoptedStyleSheets = root.adoptedStyleSheets.filter(styleSheet => styleSheet !== this.#styleSheet);
                }
            );

        return ThemeManager.prototype.unlink.apply(this, params);
    }

    unlinkAll(...params) {
        ThemeManager.prototype.unlinkAll = overload()
            .add(
                [],
                /**
                 * 断开所有链接
                 */
                function () {
                    this.#linkedRoots.forEach(root => {
                        this.unlink(root);
                    });
                    this.#linkedRoots.clear();
                }
            );

        return ThemeManager.prototype.unlinkAll.apply(this, params);
    }
}