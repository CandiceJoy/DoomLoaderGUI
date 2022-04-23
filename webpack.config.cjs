const path = require("path");
const fs = require("fs");

// Options
const distDir = path.join(__dirname);
const dev = true; // Changes how webpack bundles things; use true for dev or false for production
const plugins = []; // Add any plugins here
// End Options

let dirCont = fs.readdirSync(__dirname);
let files = dirCont.filter(function(elm)
                           {
	                           return elm.match(/.*\.(js)/ig) && !elm.match(/bundle\.js/ig) &&
	                                  !elm.match(/webpack\.config\.js/ig) && !elm.match(/preload\.js/ig) &&
	                                  !elm.match(/main\.js/ig) && !elm.match(/config-to-data\.js/ig) &&
	                                  !elm.match(/.*\.json/ig);
                           }).map(ele => "./" + ele);

const bundle = {
	mode   : dev ? "development" : "production",
	devtool: dev ? "source-map" : "eval",
	entry  : files,
	output : {
		filename: 'bundle.js',
		path    : distDir,
		chunkLoading: 'import'
	},
	plugins: (plugins.length > 0) ? plugins : [],
	target : "electron-renderer",
	module:{
	rules:[
		{
			test: /\.js$/,
			loader: "babel-loader",
			exclude: /(node_modules)/
		}]}
};

console.log(JSON.stringify(bundle));

module.exports = bundle;
