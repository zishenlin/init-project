console.log(process.env.NODE_ENV);
const path = require('path');
const envMode = process.env.NODE_ENV || 'development';
const devMode = envMode !== 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
console.log(envMode);

module.exports = {
	entry: './src/index.tsx',             // 進入點，js 的話 './src/index.js'
	output: {
		path: path.join(__dirname, 'dist'), // 打包輸出後的檔案放的位置
		filename: 'js/bundle.[hash].js',    // 打包輸出後的檔案(檔名)
		// 將這隻 bundle.js 引入至 index.html
		// 為了避免打包出來的 bundle.js 被瀏覽器 cache 住，檔名加入 hash 防止 cache
		// html-webpack-plugin，此 plugin 可以自動幫我們生成 html 的檔案
		clean: true,                        // 清除 dist 資料夾
	},
	mode: envMode,
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},
	devtool: 'source-map',                // 幫助 webpack 輸出檔案 debug
	devServer: {                          // devServer 的設定
		port: 9000,                         // 指定開啟 port 為 9000
		open: true,                         // 自動打開頁面
		hot: true,                         // hot-module-replacement( HMR ) 只會更新chunk
    liveReload: true,                   // 當檢測到文件更改時，開發服務器將重新加載/刷新頁面，但 hot 一定要為 false，又或是設置 watchFiles
		watchFiles: ['src'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,     // 用哪一種檔案，$ 代表是用哪一種副檔名結尾
				exclude: /node_modules/,        // 排除，因 node_modules 資料夾底下的應該都轉譯過了，這樣要花很久時間，所以先排除掉
				use: [
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.less$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'less-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'img/[name].[ext]',
							limit: 10000,
							// limit 內的會交由 url-loader 處理，超過 limit 的資源則會 fallback 給 file-loader 進行處理
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'font/[name].[ext]',
						},
					},
				],
			},
		],
	},
	// 同一個 plugin 可以被重複使用，一次在使用 plugin 時，需要在前方加上 new，以確保每次使用的都是獨立的 instance。
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html', 
      // 在自動生成 html 檔案時，以主目錄的 index 為範本
			// 並且把 webpack 打包好的檔案以 <script> 注入，
			// 如果你有使用 mini-css-extract-plugin 來產生 CSS 檔，此 Plugin 也會將 CSS 檔以 <link> 注入
		}),
		new MiniCssExtractPlugin({
			filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
			chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
		}),
	],
};