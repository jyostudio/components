import Enum from "@jyostudio/enum";
import { genEnumGetterAndSetter } from "../libs/utils.js";
import Component from "./component.js";

/**
 * 内容对其方式
 * @extends {Enum}
 */
class AlignContent extends Enum {
    static {
        this.set({
            start: 0, // 开始
            center: 1, // 居中
            end: 2 // 结束
        });
    }
}

/**
 * 方向
 * @extends {Enum}
 */
class Orientation extends Enum {
    static {
        this.set({
            horizontal: 0, // 水平
            vertical: 1 // 垂直
        });
    }
}

const STYLES = /* css */`
:host {
    display: flex;
    contain: content;
    font-size: var(--fontSizeBase100);
    font-family: var(--fontFamilyBase);
    font-weight: var(--fontWeightRegular);
    line-height: var(--lineHeightBase100);
    color: var(--colorNeutralForeground2);
    pointer-events: none;
}

:host(:state(vertical)) {
    height: 100%;
    min-height: 84px;
    flex-direction: column;
    align-items: center;
}

:host([inset]) {
    padding: 0 12px;
}

:host::after, :host::before {
    align-self: center;
    background-color: var(--mix-colorNeutralStroke2);
    box-sizing: border-box;
    content: '';
    display: flex;
    flex-grow: 1;
    height: var(--strokeWidthThin);
}

:host(:state(vertical))::before, :host(:state(vertical))::after {
    width: var(--strokeWidthThin);
    min-height: 20px;
    height: 100%;
}

:host([inset]:state(vertical))::before {
    margin-top: 12px;
}

:host([inset]:state(vertical))::after {
    margin-bottom: 12px;
}

:host(:state(align-start))::before, :host(:state(align-end))::after {
    flex-basis: 12px;
    flex-grow: 0;
    flex-shrink: 0;
}

:host(:state(vertical):state(align-start))::before {
    min-height: 8px;
}

:host(:state(vertical):state(align-end))::after {
    min-height: 8px;
}
`;

const HTML = /* html */`
<slot></slot>
`;

export default class Divider extends Component {
    /**
     * 内容对其方式
     * @type {AlignContent}
     */
    static get AlignContent() {
        return AlignContent;
    }

    /**
     * 方向
     * @type {Orientation}
     */
    static get Orientation() {
        return Orientation;
    }

    /**
     * 观察属性
     * @returns {Array<String>}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, "align-content", "orientation"];
    }

    constructor() {
        super();

        this.setAttribute("tabindex", "-1");

        Object.defineProperties(this, {
            alignContent: genEnumGetterAndSetter(this, {
                attrName: "alignContent",
                enumClass: AlignContent,
                defaultValue: "center",
                fn: () => {
                    ["align-start", "align-end"].forEach(v => this.internals.states.delete(v));
                    switch (this.alignContent) {
                        case AlignContent.start: this.internals.states.add("align-start"); break;
                        case AlignContent.end: this.internals.states.add("align-end"); break;
                    }
                }
            }),
            orientation: genEnumGetterAndSetter(this, {
                attrName: "orientation",
                enumClass: Orientation,
                defaultValue: "horizontal",
                fn: () => {
                    if (this.orientation === Orientation.vertical) {
                        this.internals.states.add("vertical");
                    } else {
                        this.internals.states.delete("vertical");
                    }
                }
            })
        });
    }

    static {
        this.registerComponent({
            html: HTML,
            css: STYLES
        });
    }
}