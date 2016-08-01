var talams = {
	"dhruva": "lOll",
	"matya": "lOl",
	"rupaka": "Ol",
	"jhampa": "lUO",
	"triputa": "lOO",
	"ata": "llOO",
	"eka": "l",

	"misrachapu": "322",
	"kandachapu": "23"
};
var kriyaToSoundFile = {
	"beat": "sounds/2.wav",
	"wave": "sounds/1.wav",
	"count": "sounds/1.wav",

	"bheem": "sounds/mridangam/bheem-dsh.wav",
	"cha": "sounds/mridangam/cha-dsh.wav",
	"dheem": "sounds/mridangam/dheem-dsh.wav",
	"dhin": "sounds/mridangam/dhin-dsh.wav",
	"num": "sounds/mridangam/num-dsh.wav",
	"ta": "sounds/mridangam/ta-dsh.wav",
	"tha": "sounds/mridangam/tha-dsh2.wav",
	"tham": "sounds/mridangam/tham-dsh.wav",
	"thi": "sounds/mridangam/thi-dsh.wav",
	"thom": "sounds/mridangam/thom-dsh1.wav"
};


var mridangamWords = {
	"bheem": {
		readable: ["bheem", ",", ",", ","],
		playable: ["bheem", ",", ",", ","]
	},
	"cha": {
		readable: ["cha", ",", ",", ","],
		playable: ["cha", ",", ",", ","]
	},
	"dheem": {
		readable: ["dheem", ",", ",", ","],
		playable: ["dheem", ",", ",", ","]
	},
	"dhin": {
		readable: ["dhin", ",", ",", ","],
		playable: ["dhin", ",", ",", ","]
	},
	"num": {
		readable: ["num", ",", ",", ","],
		playable: ["num", ",", ",", ","]
	},
	"ta": {
		readable: ["ta", ",", ",", ","],
		playable: ["ta", ",", ",", ","]
	},
	"tha": {
		readable: ["tha", ",", ",", ","],
		playable: ["tha", ",", ",", ","]
	},
	"tham": {
		readable: ["tham", ",", ",", ","],
		playable: ["tham", ",", ",", ","]
	},
	"thi": {
		readable: ["thi", ",", ",", ","],
		playable: ["thi", ",", ",", ","]
	},
	"thom": {
		readable: ["thom", ",", ",", ","],
		playable: ["thom", ",", ",", ","]
	},
	"takadimi": {
		readable: ["thi", ",", ",", ",", "ta", ",", ",", ",", "tha", ",", ",", ",", "thi", ",", ",", ","],
		playable: ["thi", ",", ",", ",", "ta", ",", ",", ",", "tha", ",", ",", ",", "thi", ",", ",", ","] // FIXME: this is kitataka actually
	},
	"takita": {
		readable: ["tha", ",", ",", ",", "thi", ",", ",", ",", "ta", ",", ",", ","],
		playable: ["tha", ",", ",", ",", "thi", ",", ",", ",", "ta", ",", ",", ","]
	},
	"taka": {
		readable: ["ta", ",", ",", ",", "tha", ",", ",", ","],
		playable: ["ta", ",", ",", ",", "tha", ",", ",", ","]
	},
	",": {
		readable: [",", ",", ",", ","],
		playable: [",", ",", ",", ","]
	},
	"$": {
		readable: ["thi", "ta", "tha", "ta", "cha", "ta", "thi", "ta", "thom", ",", ",", ","],
		playable: ["thi", "ta", "tha", "ta", "cha", "ta", "thi", "ta", "thom", ",", ",", ","]
	},
	"tttt": {
		readable: ["cha", ",", ",", ",", "tha", ",", ",", ",", "tha", ",", ",", ",", "dhin", ",", ",", ",", "cha", ",", ",", ",", "tha", ",", ",", ",", "tha", ",", ",", ",", "dhin", ",", ",", ","],
		playable: ["cha", ",", ",", ",", "tha", ",", ",", ",", "tha", ",", ",", ",", "dhin", ",", ",", ",", "cha", ",", ",", ",", "tha", ",", ",", ",", "tha", ",", ",", ",", "dhin", ",", ",", ","]
	},
	"taihataihi": {
		readable: ["thom", ",", ",", ",", "cha", ",", ",", ",", "thom", ",", ",", ",", "cha", ",", ",", ","],
		playable: ["thom", ",", ",", ",", "cha", ",", ",", ",", "thom", ",", ",", ",", "cha", ",", ",", ","]
	},
	"ddt": {
		readable: ["dhin", ",", "dhin", ",", "num", ",", ",", ","],
		playable: ["dhin", ",", "dhin", ",", "num", ",", ",", ","]
	},
	"tddt": {
		readable: ["dheem", ",", ",", ",", "dhin", ",", "dhin", ",", "tha", ",", ",", ","],
		playable: ["dheem", ",", ",", ",", "dhin", ",", "dhin", ",", "tha", ",", ",", ","]
	},
	"ttddt": {
		readable: ["dheem", ",", ",", ",", "dheem", ",", ",", ",", "dhin", ",", "dhin", ",", "tha", ",", ",", ","],
		playable: ["dheem", ",", ",", ",", "dheem", ",", ",", ",", "dhin", ",", "dhin", ",", "tha", ",", ",", ","]
	},
	"tttddt": {
		readable: ["dheem", ",", ",", ",", "dheem", ",", ",", ",", "dheem", ",", ",", ",", "dhin", ",", "dhin", ",", "tha", ",", ",", ","],
		playable: ["dheem", ",", ",", ",", "dheem", ",", ",", ",", "dheem", ",", ",", ",", "dhin", ",", "dhin", ",", "tha", ",", ",", ","]
	}
}

function inputWordToKriyas(word) {

	if (word === "taka") {
		return ["tha", "ka"];
	}
	if (word === "takita" || word == "3") {
		return {
			word: "takita",
			sounds: ["tha", "ki", "ta"]
		};
	}
	if (word === "ddt") {
		return ["beat", "beat", "gap", "beat", "gap"];
	}
}

function inputToMridangamSyllables(input) {
	input = input.split(" ");
	var playable = [],
		readable = [];
	for (var i = 0; i < input.length; i++) {
		for (var word in mridangamWords) { // FIXME: sort in decreasing length
			if (word == input[i]) {
				playable = playable.concat(mridangamWords[word].playable);
				readable = readable.concat(mridangamWords[word].readable);
				break;
			}
		}
	}

	return {
		readable: readable,
		playable: playable
	}
}


function angamToKriyas(angam, jaati) {
	if (angam === "l") {
		var kriyas = ["beat"];
		while (jaati-- > 1) kriyas.push("count");
		return kriyas;
	}
	if (angam === "O") return ["beat", "wave"];
	if (angam === "U") return ["beat"];
	return [];
}

function talamToKriyas(talam, jaati) {

	/*
		// very musical
		var karvaiReducingPhrase = "7 gggggggg 7 gggggggg " + // 14 + 8 = 22
			"5 gggggg 5 gggggg " + // 10 + 6 = 16
			"4 gggg 4 gggg " +
			"3 gg 3 gg " +
			"2 g ddt g 2 g ddt g ";

		// an interesting conversation, but not very musical
		var phrase2 = "3 gggg t ddt gggg " + // 6
			"4 ggg tt ddt ggg " + // 6
			"5 gg ttt ddt gg " + // 10
			"7 g t ddt tt ddt g "; // + // 14

		// sounds musical, but isn't an interesting conversation
		var phrase1 = "ddt g ddt g " + // 4
			"ddt ddt g tt ddt ddt tt ddt ddt tt ddt g " +
			"3 t ddt 4 tt ddt 5 ttt ddt ";
		// +
		// "t ddt tt ddt t ddt tt ddt ttt ddt "; //  5 + 12

		var convo = [];
		$((karvaiReducingPhrase + phrase2 + phrase1).split(" ")).each(function(_, dialogue) {
			convo = convo.concat(angamToKriyas(dialogue));
		});
		console.log("convo size is " + convo.length);
		return convo;
	*/
	if (talam === "misrachapu") {
		return ["count (ta)", "count (ki)", "silent (ta)", "beat (ta)", "silent (ka)", "beat (di)", "silent (mi)"];
	} else if (talam === "kandachapu") {
		return ["beat (ta)", "silent (ka)", "beat (ta)", "count (ki)", "silent (ta)"];
	}
	var kriyas = [];
	for (var i = 0; i < talams[talam].length; i++) {
		kriyas = kriyas.concat(angamToKriyas(talams[talam][i], jaati));
	}
	return kriyas;
}

function getAngaAksharaCount(angam, jaathi) {
	var matras = 0;
	if (angam == 'U') return 1;
	else if (angam == 'O') return 2;
	else if (angam == 'l') return jaathi;

	return matras;
}

function notate(input) {
	var talam = parseTalam(selectedTalam, selectedJaathi, selectedGati);

	if (talam.avartanamMatras <= 0) {
		return ["Sorry, something went wrong"];
	}

	var output = [];
	input = talam.header.concat(input.split(" "));

	input.each_slice(talam.avartanamMatras, function(avartanam) {
		if (avartanam.length < talam.avartanamMatras) {
			var msg = "Need " + (talam.avartanamMatras - avartanam.length) + " more matras. ";
			msg += "The total matra count should be a multiple of " + talam.avartanamMatras + ".";
			output.push(msg);

			var gaps = talam.avartanamMatras - avartanam.length;
			while (gaps--) avartanam.push(",");
		}
		var avartanamWithAngaMarkers = [],
			pos = 0;
		$(talam.angaMatras).each(function(_, angaMatras) {
			avartanamWithAngaMarkers.push(avartanam.slice(pos, pos + angaMatras));
			pos += angaMatras;
		});
		output.push(avartanamWithAngaMarkers);
	});
	return output;
}