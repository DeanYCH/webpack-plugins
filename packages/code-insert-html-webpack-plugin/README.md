# `code-insert-html-webpack-plugin`

> TODO: description

## Usage

> 该插件用于向html-webpack-plugin生成的html文件中插入代码片段，
```
const codeInsertPlugin = require('code-insert-html-webpack-plugin');

new CodeInsertPlugin({
    sourcePath: './add.html.js',
    defaultAnchor: '</head>',
})

```
> sourcePath： 指向承载 代码片段 的 【代码片段配置文件】的位置路径，该路径为相对于项目根目录的相对路径
> defaultAnchor： 是默认的代码片段【插入位置】
> 插入位置： 字符串或正则表达式，指将制定的代码片段插入某个位置之前，当为正则表达式时，则会插入到全部匹配到的位置之前
```
<html>
    <head>
    <-- something inserted -->
    </head>
    <body>
    </body>
</html>

```
> 代码片段配置文件：支持commonJS、ESM两种风格，以cjs风格为例，文件导出一个键值对对象，该对象为文件属性的键名为 html-webpack-plugin 生成的 index 文件名（或匹配文件名的正则表达式，优先以字符串类型解释键名），键值为待插入匹配的html文件的多个代码片段形成的对象，其中，’before‘ ’after‘表示插入时机（ html-webpack-plugin的两个hook：html-webpack-plugin-before-html-processing、html-webpack-plugin-after-html-processing ），每个html文件可插入若干代码片段，每段代码片段对应一个【代码片段对象】，【代码片段对象】详见下文
```
// 该模块在执行时可获得 webpack 配置对象，process对象，可调用require导入文件模块
const { mode, entry } = global.webpack;
const { defaultEnv } = require('./config/constant.js');

const AMap = mode !== defaultEnv
    ? '' : `<script type="text/javascript" src="//webapi.amap.com/maps"></script>`;

const env = `<script>
  +function (g) {
    var GLOBAL_CONFIG = {
      ENV: ${mode}
    }

    g.__ENV__ = {
      get: function (gN) {
        return GLOBAL_CONFIG[gN];
      }
    }
  }(window);
</script>`;


module.exports = {
    // 通过entry做默认设置
    ...Object.keys(entry).reduce((res, entryName) => {
        res[entryName] = {
            before: [{
                scripts: [AMap],
                anchor: '</head>',
            },],
            after: [{
                scripts: [env],
                anchor: '</body>',
            },],
        }
        return res;
    }, {}),
    // 具名页面的方式覆盖上述的默认设置中的某些特殊页面
    'from-one': {
        before: [{
            scripts: [env, AMap],
            anchor: '</head>',
        },],
    },
    'from-two': {
        before: [{
            scripts: [env],
            anchor: '</head>',
        }, {
            scripts: [AMap],
            anchor: '</body>',
        },],
    },
}

```
> 代码片段对象：具有两个属性，scripts是代码片段字符串形成的数组，anchor为为该代码片段数组单独设定的【插入位置】
> 代码片段：要插入的代码字符串
> 导出的对象的属性名（例如’from-two‘）：会被解释为文件名（要对应的html文件的文件名）和正则表达式的字面量字符串，当某html文件名与导出对象的某个属性名相同，则插入这个属性名所对应的的代码片段，否则则用html文件名去匹配正则表达式，首先被匹配到的导出对象的属性名所对应的代码片段将被插入html文件中，匹配顺序为按照导出文件属性名的排列顺序自上而下