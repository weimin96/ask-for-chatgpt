const path = require("path");

// Generate pages object
const pages = {};

const chromeName = ["popup", "options", "devtools"];

function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}
chromeName.forEach((name) => {
  const fileExtension = getFileExtension(name);
  const fileName = name.replace("." + fileExtension, "");
  pages[fileName] = {
    entry: `src/entry/${name}/${name}.js`,
    template: "public/index.html",
    filename: `${fileName}.html`
  };
});

const isDevMode = process.env.NODE_ENV === "development";

module.exports = {
  pages,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin("copy").use(require("copy-webpack-plugin"), [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.json`),
            to: `${path.resolve("dist")}/manifest.json`
          },
          {
            from: path.resolve("src/assets"),
            to: path.resolve("dist/assets")
          },
          {
            from: path.resolve("src/_locales"),
            to: path.resolve("dist/_locales")
          }
        ]
      }
    ]);
  },
  configureWebpack: {
    entry: {
      background: "./src/entry/background/background.js",
      content: "./src/entry/content/content.js"
    },
    output: {
      filename: `js/[name].js`,
      chunkFilename: `js/[name].js`
    },
    devtool: isDevMode ? "inline-source-map" : false,
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        "@": path.resolve("src")
      }
    }
  },
  css: {
    extract: false // Make sure the css is the same
  }
};
