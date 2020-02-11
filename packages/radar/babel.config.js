module.exports = {
    "presets": [
        [ 
            "@babel/preset-env",
            {
                "targets": {
                    // "node": "current",
                    // "esmodules": true,
                    browsers: "> .5% or last 2 versions"
                }
            }
        ],
    ],
    "plugins": [
        "@babel/plugin-external-helpers",
        //编译成AMD
        // "@babel/plugin-transform-modules-amd",
        //编译成cjs
        // "@babel/plugin-transform-modules-commonjs",
        //编译成UMD
        // [
        //     "@babel/plugin-transform-modules-umd", 
        //     {
        //         "globals": {
        //             "es6-promise": "Promise",
        //         },
        //         "exactGlobals": true
        //     }
        // ],
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3,
                "absoluteRuntime": true,
                "regenerator": true
            }
        ],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import",
        [
            "babel-plugin-rewrite-require",
            {
                "throwForNonStringLiteral": true
            }
        ],
    ]
}