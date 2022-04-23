const fs = require("fs");
const root = document.querySelector("div#app");
const dataFile = "data.json";
const contexts = {};
let data;
//refreshData();

contexts.iwads = {
	template: "iwads.pug"
};

contexts.iwad = {
	template: "iwad.pug"
};

contexts.autoloadProfiles = {
	template: "autoloadProfiles.pug"
};

contexts.autoloadProfile = {
	template: "autoloadProfile.pug"
};

contexts.sourceports = {
	template: "sourceports.pug"
};

contexts.sourceport = {
	template: "sourceport.pug"
};

let currentContext;

function changeContext(context, input = null)
{
	console.log("Context change requested!");
	console.log("Current Context: " + JSON.stringify(currentContext));
	console.log("New Context: " + JSON.stringify(context));
	console.log("Input: " + JSON.stringify(input));
	console.log("Contexts: " + JSON.stringify(contexts));
	currentContext = context;
	const func = context.func;
	const pugFunc = context.pugFunc;
	console.log("Func: " + func );
	console.log("pugFunc: " + pugFunc.toString().substring(0,50) );
	console.log("Raw Data: " + JSON.stringify(data) );

	if( !pugFunc )
	{
		throw "Invalid pugFunc for context " + JSON.stringify(context);
	}

	if(!input)
	{
		refreshData();
		input = data;
	}

	if(!input)
	{
		console.log("Data refresh failed");
		return;
	}

	console.log("Data Input: " + JSON.stringify(input));

	const html = pugFunc(input);
	root.innerHTML = html;

	if(func)
	{
		func();
	}
}

function refreshData()
{
	data = JSON.parse(fs.readFileSync(dataFile).toString());
}

function writeData()
{
	fs.writeFileSync(dataFile, JSON.stringify(data));
}

function refresh()
{
	changeContext(currentContext);
}

function getData()
{
	return data;
}

module.exports = {getData:getData,contexts:contexts,changeContext:changeContext,refresh:refresh,writeData:writeData,currentContext:currentContext};
