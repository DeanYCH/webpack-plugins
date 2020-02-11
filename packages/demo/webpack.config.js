
const path =require('path');
const fs = require('fs-extra');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CodeInsertPlugin = require('code-insert-html-webpack-plugin');


const entryGlob = new glob.Glob(
    `${__dirname}/src/page/*.js`,
    { nonull: true, sync: true },
);

const entry = entryGlob.found.reduce((res, filedir) => {
    const filename = filedir.split('/').pop().split('.')[0]
    res[filename] = filedir;
    return res;
}, {});

const htmlPlugins = Object.keys(entry).map((name) => {
    const filename = `${name}.html`;
    const template = `${__dirname}/src/__html__.tpl`;
    const chunks = [name];

    return new HtmlWebpackPlugin({
        filename,
        template,
        chunks,
        inject: 'body',
        inlineSource: '.css',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
        }
    })
});

fs.emptyDirSync('./dist');

module.exports = {
    target: 'web',
    entry,
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].[hash:7].js',
    },
    mode: 'production',
    devServer: {
        contentBase: 'dist',
        disableHostCheck: true,
        historyApiFallback: true,
        host: '0.0.0.0',
        port: 8080,
        inline: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /(j|t)sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            }
        ]
    },
    plugins:[
        ...htmlPlugins, 
        new CodeInsertPlugin({
            sourcePath: './add.html.js',
            defaultAnchor: '</head>',
        }),
    ],
    resolve:{
        mainFields: ['main','module'],
    },
};
