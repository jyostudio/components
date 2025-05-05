import { DockPanel, themeManager } from "./src/index.js";

console.dir(themeManager.Themes);

customElements.whenDefined("jyo-dock-panel").then(() => {
    /**
     * @type {DockPanel}
     */
    const dockPanel = document.getElementById('myDock');

    // 创建一个新元素
    const newElement = document.createElement('div');
    newElement.textContent = '这是动态添加的面板';

    // 设置面板大小
    // dockPanel.leftWidth = '300px';

    // 隐藏/显示面板
    // dockPanel.bottomVisible = false; // 隐藏底部面板
});