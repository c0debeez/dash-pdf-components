const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const libraryName = "dash_pdf_components";
const pdfjsRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));

const jsxRuntimeExternal = `var (window.ReactJSXRuntime || (window.ReactJSXRuntime = (function (React) {
function jsx(type, config, maybeKey) {
var props = {};
var children = null;
if (config != null) {
if (config.key !== undefined) props.key = '' + config.key;
for (var propName in config) {
if (Object.prototype.hasOwnProperty.call(config, propName) && propName !== 'key' && propName !== '__self' && propName !== '__source') {
if (propName === 'children') children = config[propName]; else props[propName] = config[propName];
}
}
}
if (maybeKey !== undefined) props.key = '' + maybeKey;
if (children === null || children === undefined) return React.createElement(type, props);
return Array.isArray(children) ? React.createElement.apply(React, [type, props].concat(children)) : React.createElement(type, props, children);
}
return {jsx: jsx, jsxs: jsx, jsxDEV: jsx, Fragment: React.Fragment};
})(window.React)))`;

module.exports = (env = {}) => {
    const development = env.development === true || env.development === "true";
    return {
        mode: development ? "development" : "production",
        devtool: development ? "source-map" : false,
        entry: { [libraryName]: path.join(__dirname, "src/index.ts") },
        output: {
            path: path.join(__dirname, libraryName),
            filename: "[name].js",
            assetModuleFilename: "pdfjs/build/[name][ext]",
            library: libraryName,
            libraryTarget: "umd",
            publicPath: "auto",
        },
        target: "web",
        externals: {
            react: { commonjs: "react", commonjs2: "react", amd: "react", umd: "react", root: "React" },
            "react-dom": { commonjs: "react-dom", commonjs2: "react-dom", amd: "react-dom", umd: "react-dom", root: "ReactDOM" },
            "react-dom/client": { commonjs: "react-dom/client", commonjs2: "react-dom/client", amd: "react-dom/client", umd: "react-dom/client", root: "ReactDOM" },
            "react/jsx-runtime": jsxRuntimeExternal,
            "react/jsx-dev-runtime": jsxRuntimeExternal,
        },
        resolve: {
            modules: [path.resolve(__dirname, "src"), "node_modules"],
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
        module: {
            rules: [
                { resourceQuery: /asset/, type: "asset/resource" },
                { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
            ],
        },
        optimization: {
            minimize: !development,
            minimizer: [new TerserPlugin({ parallel: true, extractComments: false })],
        },
        performance: { hints: false },
        plugins: [
            new CopyPlugin({
                patterns: ["cmaps", "standard_fonts", "wasm", "iccs", "web/images"].map((directory) => ({
                    from: path.join(pdfjsRoot, directory),
                    to: `pdfjs/${directory}`,
                })),
            }),
        ],
    };
};
