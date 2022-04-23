const renderer = require("./renderer.js");
const fs = require("fs");
const contexts = renderer.contexts;
const getData = renderer.getData;
const writeData = renderer.writeData;
const changeContext = renderer.changeContext;
const refresh = renderer.refresh;
const currentContext = renderer.currentContext;
const path = require("path");
const utils = require("./utils.js");
const compileAll = utils.compileAll;
const sanitise = utils.sanitise;
const sanitisePath = utils.sanitisePath;
const contract = utils.contract;
const exec = require("child_process").exec;

contexts["profiles"] ={
	template: "profiles.pug"
};

contexts["profile"] ={
	template: "profile.pug"
};

contexts["addProfile"] ={
	template: "profile.pug",
	func    : addProfile
};

class Profile
{
	name;
	sourceport;
	iwad;
	wads;
	autoloadProfile;
	options;

	constructor()
	{
		this.wads = [];
		this.options = [];
	}
}

function doom(profileName)
{
	const data = getData();
	const computer = data.computers[2];
	const dir = path.resolve(computer.dir);
	let profile;

	for( const x in data.profiles )
	{
		const myProfile = data.profiles[x];

		if( myProfile.name === profileName )
		{
			profile = myProfile;
			break;
		}
	}

	if( !profile )
	{
		throw "Could not find profile " + profile;
	}

	if(!path.isAbsolute(dir))
	{
		throw "Error: Base directory 'dir' must be absolute.";
	}

	const sourceport = data.sourceports[profile.sourceport];
	let sourceportPath = sanitisePath(sourceport.paths[computer.os]);

	if(!path.isAbsolute(sourceportPath))
	{
		sourceportPath = path.join(dir, sourceportPath);
	}

	if(!fs.existsSync(sourceportPath))
	{
		throw "Cannot find sourceport at '" + sourceportPath + "'";
	}

	let command = sourceportPath;

	const iwad = sanitise(data.iwads[profile.iwad]);
	const extraOptions = sanitise(computer.extraOptions);
	const pwads = sanitise(profile.wads);
	const profileOptions = sanitise(profile.options);
	const sourceportOptions = sanitise(sourceport.options);

	if(sourceportOptions)
	{
		command += " " + sourceportOptions;
	}

	command += " -iwad " + iwad;

	let files;

	if(profile.autoloadProfile)
	{
		const autoloadProfile = data.autoloadProfiles[profile.autoloadProfile];
		const before = sanitise(autoloadProfile.before);
		const after = sanitise(autoloadProfile.after);

		files = before + " " + pwads + " " + after;
	}
	else
	{
		files = pwads;
	}

	command += " -file " + files;

	if(extraOptions)
	{
		command += " " + extraOptions;
	}

	if(profileOptions)
	{
		command += " " + profileOptions;
	}

	console.log(command);

	exec(command, {cwd: dir}, () =>
	{
		//process.exit(0);
	});
}

function profileForm(form)
{
	const data = getData();
	const name = form["name"].value;
	const sourceport = form["sourceport"].value;
	const iwad = form["iwad"].value;
	const autoloadProfile = form["autoloadProfile"].value;
	let profile;

	for(const i in data.profiles)
	{
		const ele = data.profiles[i];

		if(ele.name === name)
		{
			profile = ele;
			break;
		}
	}

	let newProfile = false;

	if(!profile)
	{
		profile = {};
		data.profiles.push(profile);
		newProfile = true;
	}

	profile.name = name;
	profile.sourceport = sourceport;
	profile.iwad = iwad;
	profile.autoloadProfile = autoloadProfile;

	if(form["options"])
	{
		profile.options = contract(form["options"].value);
	}

	if(form["wads"])
	{
		profile.wads = contract(form["wads"].value);
	}

	console.log(JSON.stringify(profile, null, "\t"));
	writeData();

	/*if(!newProfile)
	{
		alert("Profile Updated!");
	}
	else
	{
		alert("Profile Added!");
	}*/

	changeContext(contexts.profiles);
}

function editProfile(profile)
{
	const data = getData();
	changeContext(contexts.profile, {
		data   : data,
		profile: JSON.parse(profile)
	});
	console.log("Editing profile> " + JSON.stringify(profile));
}

function addProfile()
{
	editProfile("{}");
	const form = document.getElementById("profileForm");
	form["name"].removeAttribute("disabled");
}

function deleteProfile(profile)
{
	const data = getData();
	data.profiles.splice(data.profiles.indexOf(profile));
	writeData();
	refresh();
}

if( !currentContext )
{
	compileAll();
	changeContext(contexts.profiles);
}

module.exports = {
	doom:doom,
	addProfile:addProfile,
	editProfile:editProfile,
	deleteProfile:deleteProfile,
	profileForm: profileForm
};
