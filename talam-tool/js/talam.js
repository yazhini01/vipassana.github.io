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
	"count": "sounds/1.wav"
};
function angamToKriyas(angam, jaati) {
	if (angam === "l") {
		var kriyas = ["beat"];
		while(jaati-- > 1) kriyas.push("count");
		return kriyas;
	}
	if (angam === "O") return ["beat", "wave"];
	if (angam === "U") return ["beat"];
	return [];
}

function talamToKriyas(talam, jaati) {
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
			return;
		}
		var avartanamWithAngaMarkers = [], pos = 0;
		$(talam.angaMatras).each(function(_, angaMatras) {
			avartanamWithAngaMarkers.push(avartanam.slice(pos, pos + angaMatras));
			pos += angaMatras;
		});
		output.push(avartanamWithAngaMarkers);
	});
	return output;
}
