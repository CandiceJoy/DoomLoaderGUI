const fs = require("fs");
const path = require("path");
const pug = require("pug");
const contexts = require("./renderer.js").contexts;

function escape(htmlStr)
{
	return htmlStr.replace(/&/g, "&amp;")
	              .replace(/</g, "&lt;")
	              .replace(/>/g, "&gt;")
	              .replace(/"/g, "&quot;")
	              .replace(/'/g, "&#39;");

}

function unEscape(htmlStr)
{
	htmlStr = htmlStr.replace(/&lt;/g, "<");
	htmlStr = htmlStr.replace(/&gt;/g, ">");
	htmlStr = htmlStr.replace(/&quot;/g, "\"");
	htmlStr = htmlStr.replace(/&#39;/g, "\'");
	htmlStr = htmlStr.replace(/&amp;/g, "&");
	return htmlStr;
}

function sanitise(str)
{
	if(!str || typeof str !== "string")
	{
		return str;
	}

	str = str.replaceAll(/'/ig, "\\\'");
	str = str.replaceAll(/"/ig, "\\\"");
	return str;
}

function sanitisePath(str)
{
	if(!str)
	{
		return str;
	}

	if(path)
	{
		str = str.replaceAll("/", path.sep);
		str = str.replaceAll("\\", path.sep);
	}

	return str;
}

function expand(str = "")
{
	return str.replaceAll(/(?<!\\|[\+-]\w+) /g, "\n");
}

function countLines(str = "")
{
	str = str.trim();

	if(str.match(/^\s*$/g))
	{
		return 0;
	}
	else
	{
		if(str.match(/\n/g))
		{
			return str.match(/\n/g).length;
		}
		else
		{
			return 1;
		}
	}
}

function contract(str = "")
{
	return str.replaceAll(/\n/g, " ");
}

function sanitiseObject(obj)
{
	if(!obj)
	{
		return obj;
	}

	const keys = Object.keys(obj);

	for(const x in keys)
	{
		const key = keys[x];
		console.log("Trying " + key);
		switch(typeof obj[key])
		{
			case "object":
				console.log("OBJECT");
				obj[key] = sanitiseObject(obj[key]);
				break;
			case "string":
				console.log("STRING");
				obj[key] = sanitise(obj[key]);
				break;
			default:
				//Leave alone
				console.log("OTHER");
				break;
		}
	}

	return obj;
}

function loadFromFile(varName, fileName)
{
	let str = fs.readFileSync(fileName).toString() + " " + varName;
	str = str.replaceAll(/export/ig, "");
	const ret = eval(str);
	return ret;
}

function compileAll()
{
	for(const [key, val] of Object.entries(contexts))
	{
		if(val.pugFunc)
		{
			continue;
		}

		if(!fs.existsSync(val.template))
		{
			console.log("Cannot find " + val.template);
			continue;
		}

		console.log("Compiling " + val.template);
		const pugFunc = pug.compileFile(val.template,{compileDebug:true});

		if(!pugFunc)
		{
			throw "Error during pugFunc creation.";
		}

		val.pugFunc = pugFunc;
	}

	console.log("CONTEXTS: " + JSON.stringify(contexts));
}

module.exports = {
	contract    : contract,
	countLines  : countLines,
	escape      : escape,
	expand      : expand,
	loadFromFile: loadFromFile,
	sanitisePath: sanitisePath,
	sanitise:sanitise,
	sanitiseObject:sanitiseObject,
	unEscape:unEscape,
	compileAll:compileAll
};
