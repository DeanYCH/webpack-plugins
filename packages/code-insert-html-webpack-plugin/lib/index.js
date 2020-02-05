
const vm = require('vm');
const path = require('path');
const _ = require('lodash');

const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');

class CodeInsertHtmlWebpackPlugin {
    constructor(opt = {}) {
        this.sanbox = {
            ADD_HTML_PLUGIN: true,
            require,
            env: { ...process.env },
            console: Object.keys(console).reduce((res, funcName) => {
                if(console[funcName] instanceof Function && !/^[A-Z]/.test(funcName)){
                    res[funcName] = function(...args) {
                        console[funcName](...args);
                    }.bind(console);
                }

                return res;
            }, {})
        };
        
        this.checkRegExp = /^\/.*\/[i|g|m]*$/;

        const defaultOpt = {
            sourcePath: './add.html.js',
            context: process.cwd(),
            outputName: 'index.log',
            outputPath: path.resolve(__dirname, '../log'),
            // 设置在什么标签前插入脚本
            defaultAnchor: '</head>',
            // 代码片段文件中导出的对象属性名 与 期望对应的真实文件名的差距，
            // 该前缀将加入到代码片段模块全部的标识html文件名的属性名之前
            htmlNamePrefix: '',
        }

        this.opt = { ...defaultOpt, ...opt };
        this.opt['filePath'] = this.getFilePath();
    }
    apply(compiler) {
        compiler.plugin('make', (compilation, callback) => {
            this.childCompilerPromise = this.compilationFile(compilation, compiler.context)
                .then(({ content }) => {
                    // 回调必须在主compiler的make事件中全部执行完成后，才会将自定义的entry纳入到热更新中
                    callback();

                    if(!content) return;

                    const scripts = this.runModule(content, compiler)

                    this.htmlNameRegs = [];
                    this.htmlNamesRegMap = Object.keys(scripts).reduce((map, htmlName) => {
                        let regexp;

                        try {
                            // 检查字符串符合正则表达式的基本形式
                            if(this.checkRegExp.test(htmlName)){
                                regexp = eval(htmlName);
                            }
                        } catch (e) { }

                        if (regexp) {
                            this.htmlNameRegs.push(regexp);
                            map.set(regexp, scripts[htmlName]);
                        }

                        return map;
                    }, new Map());

                    return scripts;
                });
        });
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin(
                'html-webpack-plugin-before-html-processing',
                (data) => this.childCompilerPromise
                    .then(scripts => scripts && this.equipScript(data, scripts, 'before'))
            );
            compilation.plugin(
                'html-webpack-plugin-after-html-processing',
                (data) => this.childCompilerPromise
                    .then(scripts => scripts && this.equipScript(data, scripts, 'after'))
            );
        })
    }
    runModule(scriptModule, compiler) {
        const vmS = new vm.Script(scriptModule);
        const sanbox = { ...this.sanbox, webpack: { ...compiler.options } };
        const vmC = vm.createContext(sanbox);
        const res = vmS.runInContext(vmC);

        return res;
    }
    compilationFile(fatherCompilation, globalContext) {
        const { context, sourcePath, filePath, outputName, outputPath } = this.opt;
        const outputOptions = {
            filename: outputName,
            publicPath: outputPath,
        };

        const compilerName = this.getCompilerName(context, sourcePath);
        const childCompiler = fatherCompilation.createChildCompiler(compilerName, outputOptions);
        childCompiler.context = globalContext;

        new NodeTemplatePlugin(outputOptions).apply(childCompiler);
        new NodeTargetPlugin().apply(childCompiler);
        new SingleEntryPlugin(globalContext, filePath, undefined).apply(childCompiler);
        new LoaderTargetPlugin('node').apply(childCompiler);

        childCompiler.plugin('compilation', compilation => {
            if (compilation.cache) {
                if (!compilation.cache[compilerName]) {
                    compilation.cache[compilerName] = {};
                }
                compilation.cache = compilation.cache[compilerName];
            }
        });

        return new Promise((resolve, reject) => {
            childCompiler.runAsChild((err, entries, childCompilation) => {
                // Resolve / reject the promise
                if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
                    const errorDetails = childCompilation.errors.map(error => error.message + (error.error ? ':\n' + error.error : '')).join('\n');
                    reject(new Error('Child compilation failed:\n' + errorDetails));
                } else if (err) {
                    reject(err);
                } else {
                    resolve({
                        content: childCompilation.assets[outputName].source()
                    });
                }
            });
        })
            .catch(err => {
                console.error(err);
                return {}
            });
    }
    getFilePath() {
        const { context, sourcePath } = this.opt;
        return path.resolve(context, sourcePath);
    }
    getCompilerName(context, filename) {
        const absolutePath = path.resolve(context, filename);
        const relativePath = path.relative(context, absolutePath);
        return 'code-insert-html-webpack-plugin for "' + (absolutePath.length < relativePath.length ? absolutePath : relativePath) + '"';
    }
    equipScript(root, scripts, time, callback) {
        const { filename: outputName } = root.plugin.options;
        const { htmlNamePrefix } = this.opt;

        let htmlName = outputName.split('.')[0];
        if (htmlName.indexOf(htmlNamePrefix) !== -1) {
            htmlName = htmlName.slice(htmlNamePrefix.length);
        }

        let script = scripts[htmlName];

        // 支持正则表达式的entryName
        if (!script) {
            for(let i = 0; i<this.htmlNameRegs.length; i++){
                if(this.htmlNameRegs[i].test(htmlName)){
                    script = this.htmlNamesRegMap.get(this.htmlNameRegs[i])
                    break;
                }
            }
        }

        let code = script && script[time] || [];

        Array.isArray(code) && code.forEach(htmlConf => {
            const anchor = htmlConf.anchor || this.opt.defaultAnchor;
            root.html = root.html.replace(anchor, (htmlConf.scripts || []).join('') + (anchor instanceof RegExp ? '$&' : anchor));
        })

        callback && callback();
        return root;
    }
}

module.exports = CodeInsertHtmlWebpackPlugin;
