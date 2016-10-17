
export let id = function id(input) {
	return input.trim().replace(/\s{1,}/g, "-").toLowerCase();
}

export let keys = function keys(obj) {
	let arr = [];

	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			arr.push(i);
		}
	}

	return arr;
}

export let dice = function dice(stat, skill) {
	let total = Math.max(stat, skill);
	let upgrade = Math.min(stat, skill);
	let symbols = [];

	for(let j = 0; j < upgrade; ++j) {
		symbols.push(diceMap["proficiency"]);
	}

	for(let j = upgrade; j < total; ++j) {
		symbols.push(diceMap["ability"]);
	}

	return { __html: symbols.join("") };
}

export let symbolise = function symbolise(text) {
	keys(diceMap).forEach(k => {
		let reg = new RegExp(`:${k}:`, "g");

		text = text.replace(reg, diceMap[k]);
	});

	return { __html: text };
}

let diceMap = {
	// dice
	"boost": "<span class='icon boost shadowed'>b</span>",
	"proficiency": "<span class='icon proficiency shadowed'>c</span>",
	"ability": "<span class='icon ability shadowed'>d</span>",
	"setback": "<span class='icon setback shadowed'>b</span>",
	"challenge": "<span class='icon challenge shadowed'>c</span>",
	"difficulty": "<span class='icon difficulty shadowed'>d</span>",

	// outcomes
	"advantage": "<span class='icon advantage'>a</span>",
	"failure": "<span class='icon failure'>f</span>",
	"success": "<span class='icon success'>s</span>",
	"threat": "<span class='icon threat'>t</span>",
	"triumph": "<span class='icon triumph'>x</span>",
	"despair": "<span class='icon despair'>y</span>",

	// force
	"lightside": "<span class='icon lightside'>Z</span>",
	"darkside": "<span class='icon darkside'>z</span>",

	// difficulty levels
	"easy": "<strong>Easy</strong> (<span class='icon difficulty shadowed'>d</span>)",
	"average": "<strong>Average</strong> (<span class='icon difficulty shadowed'>dd</span>)",
	"hard": "<strong>Hard</strong> (<span class='icon difficulty shadowed'>ddd</span>)",
	"daunting": "<strong>Daunting</strong> (<span class='icon difficulty shadowed'>dddd</span>)",
	"formidable": "<strong>Formidable</strong> (<span class='icon difficulty shadowed'>ddddd</span>)",
};
