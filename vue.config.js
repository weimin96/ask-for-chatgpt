const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// 页面文件
const pages = {};
// 配置 popup.html 页面
const chromeName = ["popup"];

chromeName.forEach(name => {
    pages[name] = {
        entry: `src/${name}/main.js`,
        template: `src/${name}/index.html`,
        filename: `${name}.html`
    };
});

module.exports = {
    pages,
    productionSourceMap: false,

    // 配置 content.js background.js
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': path.resolve('src')
            }
        },
        entry: {
            background: "./src/background/main.js",
            content: "./src/content/main.js"
        },
        output: {
            filename: "js/[name].js"
        },
        // 复制插件
        plugins: [
            // 复制文件到指定目录
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve("src/plugins/manifest.json"),
                        to: `${path.resolve("dist")}/manifest.json`
                    },
                    {
                        from: path.resolve("src/assets"),
                        to: path.resolve("dist/assets")
                    },
                    {
                        from: path.resolve("src/plugins/inject.js"),
                        to: path.resolve("dist/js")
                    }
                ]
            })
        ],
        optimization: {
            minimize: false
        },

    },

    css: {
        extract: {
            filename: "css/[name].css"
        }
    },

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: []
        }
    }
}

