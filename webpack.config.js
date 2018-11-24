let path = require('path');


module.exports = {
	entry: {
		app: ["./src/index.js"]
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		sourceMapFilename: 'bundle.map'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
			// {
			// 	test: /\.js$/i,
			// 	loader: 'babel',
			// 	query: {
			// 		plugins: ["transform-es2015-modules-commonjs"]
			// 	}
			// }
		]
	},
	
	plugins: [
	]
}
