# @jyostudio/components

组件库

## 引用

浏览器  

请使用 Chrome 134 或 Edge 134 及以上版本。  
不支持 Firefox 或 Safari，除非他们N年后（极有可能是3年后）支持了异步、同步显示资源释放标准。  

```HTML
<script type="importmap">
  {
    "imports": {
      "@jyostudio/components": "https://esm.sh/@jyostudio/components"
    }
  }
</script>
```

暂不支持 SSR。  

我们已经移除了所有的完全视障无障碍措施，用以减少需要维护的代码和逻辑。  

因为这个 UI 组件库并不是为完全视障人士准备的，相关措施也没有达到我们想要的效果。  

我们将考虑后续推出为完全视障人士专门定制的框架。  

但我们保留了色障、光障相应应对措施的代码。  

## 许可证

MIT License

Copyright (c) 2025 nivk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

另外：部分代码取自 fluentui 项目，其中内容并不适用于本项目主许可证，请参阅相关源码中的许可证信息。