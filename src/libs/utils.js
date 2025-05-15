import overload from "@jyostudio/overload";

const CAMEL_TO_KEBAB_REGEX = /([A-Z])/g;

/**
 * 获取 DOM 属性名称
 * @param {String} attrName - 属性名称
 * @return {String} - 转换后的属性名称
 */
function getDomAttrName(attrName) {
    return attrName.replace(CAMEL_TO_KEBAB_REGEX, "-$1").toLowerCase();
}

/**
 * 设置 CSS 变量
 * @param {HTMLElement} self - 元素
 * @param {String} domAttrName - 属性名称
 * @param {String} value - 值
 */
function setCssVar(self, domAttrName, value) {
    if (value !== null) {
        self.style.setProperty(`--${domAttrName}`, value);
    } else {
        self.style.removeProperty(`--${domAttrName}`);
    }
}

/**
 * 操作锁
 * @param {HTMLElement} self - 元素
 * @param {String} attrName - 属性名称
 * @param {Function} callback - 回调函数
 */
function withLock(self, attrName, callback) {
    self.lock(attrName, callback);
}

/**
 * 生成枚举类型的 getter 和 setter
 * @param {HTMLElement} self - 元素
 * @param {Object} options - 选项
 * @param {String} options.attrName - 属性名称
 * @param {Object} options.enumClass - 枚举类
 * @param {String} options.defaultValue - 默认值
 * @param {Boolean} options.isSetCssVar - 是否设置 CSS 变量
 * @param {Function} options.fn - 回调函数
 * @return {Object} - 包含 getter 和 setter 的对象
 */
export function genEnumGetterAndSetter(self, { attrName, enumClass, defaultValue, isSetCssVar = false, fn } = {}) {
    const domAttrName = getDomAttrName(attrName);
    return {
        get: () => enumClass.getByDescription(self.getAttribute(domAttrName) || enumClass[defaultValue].description),
        set: overload()
            .add([String], function (value) {
                withLock(self, attrName, () => {
                    const tryName = value.replace(/-(\w)/g, (_, c) => c.toUpperCase());
                    const validValue = [value, tryName].find(v => enumClass.getByDescription(v));
                    if (validValue) {
                        self.setAttribute(domAttrName, validValue);
                        isSetCssVar && setCssVar(self, domAttrName, validValue);
                        fn && fn(domAttrName, validValue);
                    } else {
                        requestAnimationFrame(() => {
                            self.removeAttribute(domAttrName);
                            isSetCssVar && setCssVar(self, domAttrName, null);
                            fn && fn(null);
                        });
                    }
                });
            })
            .add([enumClass], value => self[attrName] = value.description)
            .add([Number], value => self[attrName] = (enumClass.getByValue(value) || enumClass[defaultValue]).description)
            .any(() => self[attrName] = enumClass[defaultValue].description)
    };
}

/**
 * 生成 CSS 数值类型的 getter 和 setter
 * @param {HTMLElement} self - 元素
 * @param {Object} options - 选项
 * @param {String} options.attrName - 属性名称
 * @param {String} options.defaultValue - 默认值
 * @param {Boolean} options.isSetCssVar - 是否设置 CSS 变量
 * @param {Function} options.fn - 回调函数
 * @return {Object} - 包含 getter 和 setter 的对象
 */
export function genCSSNumberGetterAndSetter(self, { attrName, defaultValue = "0", isSetCssVar = false, fn } = {}) {
    const domAttrName = getDomAttrName(attrName);
    return {
        get: () => self.getAttribute(domAttrName),
        set: overload()
            .add([String], value => {
                withLock(self, attrName, () => {
                    if (!/\d+(px|pt|pc|cm|mm|in|rem|em|ex|vmin|vmax|fr|vw|vh|%)$/.test(value)) {
                        const numValue = parseFloat(value);
                        value = isNaN(numValue) ? defaultValue : `${numValue}px`;
                    }
                    self.setAttribute(domAttrName, value);
                    isSetCssVar && setCssVar(self, domAttrName, value);
                    fn && fn(domAttrName, value);
                });
            })
            .add([Number], value => self[attrName] = `${value}px`)
            .any(() => self[attrName] = defaultValue)
    };
}

/**
 * 生成布尔类型的 getter 和 setter
 * @param {HTMLElement} self - 元素
 * @param {Object} options - 选项
 * @param {String} options.attrName - 属性名称
 * @param {Boolean} options.preserveFalseValue - 是否设置值但不移除属性
 * @param {Boolean} options.defaultValue - 默认值
 * @param {Function} options.fn - 回调函数
 * @return {Object} - 包含 getter 和 setter 的对象
 */
export function genBooleanGetterAndSetter(self, { attrName, preserveFalseValue = false, defaultValue = false, fn } = {}) {
    const domAttrName = getDomAttrName(attrName);
    return {
        get: () => self.hasAttribute(domAttrName) && self.getAttribute(domAttrName) !== "false",
        set: overload()
            .add([Boolean], value => {
                withLock(self, attrName, () => {
                    if (value) {
                        self.setAttribute(domAttrName, "true");
                    } else {
                        preserveFalseValue ? self.setAttribute(domAttrName, "false") : self.removeAttribute(domAttrName);
                    }
                    fn && fn(domAttrName, value);
                });
            })
            .add([[Number, String]], () => self[attrName] = true)
            .any(() => self[attrName] = defaultValue)
    };
}

/**
 * 等待自定义元素定义完成
 * @param {String} tagName - 自定义元素名称
 * @return {Promise} - Promise 对象
 */
export function waitDefine(tagName, timeout = Infinity) {
    return new Promise((resolve, reject) => {
        if (customElements.get(tagName)) {
            return resolve();
        }
        let hasTimeout = false;
        let timer;
        if (timeout !== Infinity) {
            timer = setTimeout(() => {
                hasTimeout = true;
                reject(new Error(`等待组件定义超时: ${tagName}`));
            }, timeout);
        }
        customElements.whenDefined(tagName).then(() => {
            if (hasTimeout) return;
            clearTimeout(timer);
            resolve();
        });
    });
}