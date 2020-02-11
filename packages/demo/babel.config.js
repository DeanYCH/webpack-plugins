module.exports = {
    babelrc: false,
    presets: [
        [
            "@babel/preset-env",
            {
                modules: false,
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: 2,
                absoluteRuntime: true,
                regenerator: true,
                useESModules: true,
            }
        ],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import"
    ]
}