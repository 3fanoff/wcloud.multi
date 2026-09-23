const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const basePath = process.env.BASE_PATH ?? '/';

    return {
        entry: {
            index: './src/main.js',
            //index: './src/index.html',
        },
        output: {
            //filename: isProduction ? '[name].[hash:10].js' : 'dev.[name].js',
            filename: (pathData) => {
                return '[name].[hash:8].js';
                //return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
            },
            path: path.resolve(__dirname, 'dist'),
            publicPath: basePath,
            clean: {
                keep: (assetPath) => {
                    if (assetPath.endsWith('.html')) {
                        return true;
                    }
                    return /\.(png|jpe?g|gif|svg|ttf|woff|webp|ico)$/i.test(assetPath);
                }
            },
            environment: {
                arrowFunction: false,
                destructuring: false,
                forOf: false,
                const: false,
            },
        },
        devtool: isProduction ? false : 'source-map',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {
                                        targets: {
                                            browsers: ['ie 11', 'Chrome 49']
                                        }
                                    }]
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.(scss)$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !isProduction,
                                importLoaders: 1,
                            }
                        },
                        // Compiles Sass to CSS
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    quietDeps: true,
                                    silenceDeprecations: [
                                        //'mixed-decls',
                                        'color-functions',
                                        'global-builtin',
                                        'import'
                                    ]
                                }
                            }
                        }
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ttf|woff|webp|ico)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: (pathData) => {
                            const filename = pathData.filename;
                            const relativePath = filename.replace(/^\/?src\//, '').split('/').slice(0, -1).join('/');

                            return relativePath + '/[name][ext]';
                        },
                    },
                }
            ],
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: false,
            port: 2609,
            hot: false,
            liveReload: false,
            watchFiles: ['src/**/*'],
            devMiddleware: {
                writeToDisk: true,
            },
            webSocketServer: "ws",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'WCloud MultiOTP layout',
                template: path.join(__dirname, 'src/index.html'),
                userList: ['administrator', 'user01', 'user02', 'user03', 'vmadmin'],
            }),
            new HtmlWebpackPlugin({
                title: 'Auth to WCloud MultiOTP',
                template: path.join(__dirname, 'src/auth.html'),
                filename: "auth.html"
            }),
        ]
    }
}