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

	"tha": "sounds/mridangam/tha-dsh3.wav",
	"thi": "sounds/mridangam/thi-dsh2.wav",
	"thom": "sounds/mridangam/thom-dsh1.wav",
	"num": "sounds/mridangam/num-dsh.wav",
	"ta": "sounds/mridangam/ta-dsh.wav",
	"cha": "sounds/mridangam/cha-dsh.wav",
	"dhin": "sounds/mridangam/dhin-dsh.wav",
	"dheem": "sounds/mridangam/dheem-dsh.wav",
	"tham": "sounds/mridangam/tham-dsh.wav",
	"bheem": "sounds/mridangam/bheem-dsh.wav"
};

function inputToMridangamSyllables(input) {
	input = parseInput(input).split(" ");
	var playable = [],
		readable = [];
	$(input).each(function(_, inputWord) {
		if (inputWord == ",") {
			playable.push(",");
			readable.push(",");
		}
		for (var sound in kriyaToSoundFile) {
			if (sound == inputWord) {
				playable = playable.concat(sound);
				readable = readable.concat(sound);
			}
		}
		$(mridangamWords).each(function(_, word) { // FIXME: sort in decreasing length
			if (word.readable == inputWord) {
				playable = playable.concat(word.playable.replace(semicolon, ', , ,').split(" "));
				readable = readable.concat(word.notated_readable.replace(semicolon, ', , ,').split(" "));
				return;
			}
		});
	});

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
	// input = talam.header.concat(input.split(" ")); // do this if you want 1, 2, 3... as header
	input = input.split(" ");

	input.each_slice(talam.avartanamMatras, function(avartanam) {
		if (avartanam.length < talam.avartanamMatras) {
			var msg = "Need " + (talam.avartanamMatras - avartanam.length) + " more matras. ";
			msg += "The total matra count should be a multiple of " + talam.avartanamMatras + ".";
			output.push(msg);

			var gaps = talam.avartanamMatras - avartanam.length;
			while (gaps--) avartanam.push("_");
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