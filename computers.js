const renderer = require("./renderer.js");
const changeContext = renderer.changeContext;
const contexts = renderer.contexts;
const data = renderer.data;

console.log(renderer[0]);

contexts["computers"]= {
	template: "computers.pug"
};

contexts["computer"] = {
	template: "computer.pug"
};

class Computer
{
	name;
	dir;
	extraOptions;
	os;

	constructor()
	{
		this.extraOptions = {};
	}
}

function editComputer(computer)
{
	changeContext(contexts.computer, {
		data    : data,
		computer: JSON.parse(computer)
	});
	console.log("Editing computer> " + JSON.stringify(computer));
}
