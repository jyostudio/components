import overload from "@jyostudio/overload";

/**
 * 从属性名获取 DOM 属性名
 * @param {String} attrName - 属性名
 * @returns {String} - DOM 属性名
 */
function getDomAttrName(attrName) {
    return attrName.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * 生成枚举属性的获取器和设置器
 * @param {HTMLElement} self - 自身元素
 * @param {Object} params - 参数
 * @param {String} params.attrName - 属性名
 * @param {Enum} params.enumClass - 枚举类
 * @param {String} params.defaultValue - 默认名称
 * @param {Boolean?} params.isSetCssVar - 是否设置 CSS 变量
 * @param {Function?} params.fn - 处理函数
 * @returns {Object} - 获取器和设置器
 */
export function genEnumGetterAndSetter(self, { attrName, enumClass, defaultValue, isSetCssVar = false, fn } = {}) {
    const domAttrName = getDomAttrName(attrName);
    return {
        get: () => enumClass.getByDescription(self.getAttribute(domAttrName) || enumClass[defaultValue].description),
        set: overload()
            .add([String], function (value) {
                self.lock(attrName, () => {
                    const tryName = value.replace(/-(\w)/g, (_, c) => c.toUpperCase());
                    let hasSet = false;
                    [value, tryName].forEach((value) => {
                        if (enumClass.getByDescription(value)) {
                            self.setAttribute(domAttrName, value);
                            isSetCssVar && self.style.setProperty(`--${domAttrName}`, value);
                            fn && fn(domAttrName, value);
                            hasSet = true;
                        }
                    });
                    if (!hasSet) {
                        requestAnimationFrame(() => {
                            self.removeAttribute(domAttrName);
                            isSetCssVar && self.style.removeProperty(`--${domAttrName}`);
                            fn && fn(null);
                        });
                    }
                });
            })
            .add([enumClass], function (value) {
                self[attrName] = value.description;
            })
            .add([Number], function (value) {
                self[attrName] = (enumClass.getByValue(value) || enumClass[defaultValue]).description;
            })
            .any(() => self[attrName] = enumClass[defaultValue].description)
    };
}

/**
 * 生成 CSS 数值属性的获取器和设置器
 * @param {HTMLElement} self - 自身元素
 * @param {Object} params - 参数
 * @param {String} params.attrName - 属性名
 * @param {String} params.defaultValue - 默认值
 * @param {Boolean?} params.isSetCssVar - 是否设置 CSS 变量
 * @param {Function?} params.fn - 处理函数
 * @returns {Object} - 获取器和设置器
 */
export function genCSSNumberGetterAndSetter(self, { attrName, defaultValue = "0", isSetCssVar = false, fn } = {}) {
    const domAttrName = getDomAttrName(attrName);
    return {
        get: () => self.getAttribute(domAttrName),
        set: overload()
            .add([String], value => {
                self.lock(attrName, () => {
                    if (!/\d+(px|pt|pc|cm|mm|in|rem|em|ex|vmin|vmax|fr|vw|vh|%)$/.test(value)) {
                        const numValue = parseFloat(value);
                        value = isNaN(numValue) ? defaultValue : `${numValue}px`;
                    }
                    self.setAttribute(domAttrName, value);
                    isSetCssVar && self.style.setProperty(`--${domAttrName}`, value);
                    fn && fn(domAttrName, value);
                });
            })
            .add([Number], value => self[attrName] = `${value}px`)
            .any(() => self[attrName] = "0")
    };
}

/**
 * 生成布尔属性的获取器和设置器
 * @param {HTMLElement} self - 自身元素
 * @param {Object} params - 参数
 * @param {String} params.attrName - 属性名
 * @param {Boolean} params.defaultValue - 默认值
 * @param {Boolean} params.setValueDontRemove - 设置值时不移除属性
 * @param {Function?} params.fn - 处理函数
 * @returns {Object} - 获取器和设置器
 */
export function genBooleanGetterAndSetter(self, { attrName, setValueDontRemove = false, defaultValue = false, fn } = {}) {
    const domAttrName = getDomAttrName(attrName);
    return {
        get: () => self.hasAttribute(domAttrName) && self.getAttribute(domAttrName) !== "false",
        set: overload()
            .add([Boolean], value => {
                self.lock(attrName, () => {
                    if (value) {
                        self.setAttribute(domAttrName, "true");
                    } else {
                        setValueDontRemove ? self.setAttribute(domAttrName, "false") : self.removeAttribute(domAttrName);
                    }
                    fn && fn(domAttrName, value);
                });
            })
            .add([[Number, String]], () => self[attrName] = true)
            .any(() => self[attrName] = defaultValue)
    };
}