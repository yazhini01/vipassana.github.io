var defaultValue = "4 times\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\ntam , tam , ,  , dim , dim , ,  , tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\nta jam , jam  , , ta ki ta  jam ,  ,\nta dim , dim  , , ta ki ta dim ,  ,\nta tom , tom  , , ta ki ta\n\nta jam , ta ki ta\nta nam , ta ki ta\nta rum , ta ki ta\nta ta , di di , tom tom , ta din gi na tom ,\nta ta , di di , tom tom , ta din gi na tom ,\nta ta , di di , tom tom , ta din gi na tom\n\n2 times\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\nta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n";

var selectedTalam, selectedJaathi, selectedGati;
var intervalInMills = 1000, metIntervalReference = null, ticking = false;
var notatedSong = [], totalNotatedMatraCount = 0;
var $kriyas, $kriyas;
function readTalamInput() {
	selectedTalam = $('select#talam :selected').attr('value');
	selectedJaathi = $('select#jaathi :selected').attr('value');
	selectedGati = $('select#gati :selected').attr('value');
}

function isChapu() {
	return selectedTalam.endsWith("chapu");
}

$(document.body).ready(function() {
	$kriyas = $('#kriyas');
	$output = $('#output');

	$('#input').val(defaultValue);

	$('.btn_notate').bind('click', function() {
		readTalamInput();
		print_info();
		notatedSong = notate(parseInput($('#input').val()));
		print_output(notatedSong);
	});

	$('select#talam').change(function() {
		readTalamInput();
		var chapu = isChapu();

		$('select#jaathi').prop('disabled', chapu);
		$('select#gati').prop('disabled', chapu);
		$('#metronome')[chapu ? 'hide' : 'show']();

		displayKriyasForMet(talams[selectedTalam], selectedJaathi);
	});
	$('select#jaathi').change(function() {
		readTalamInput();
		displayKriyasForMet(talams[selectedTalam], selectedJaathi);
	});
	$('select#gati').change(function() {
		readTalamInput();
		displayKriyasForMet(talams[selectedTalam], selectedJaathi);
	});


	var currentSongIndex = 0;
	var songTicker = new ticker(function() {
		$('.matra', $output).removeClass('current');
		var $currentKriya = $('.matra[data_matra_index=' + currentSongIndex + ']', $output);
		$currentKriya.addClass('current');
		currentSongIndex = (currentSongIndex + 1) % totalNotatedMatraCount;
	}, function() {
		readTalamInput();
		currentSongIndex = 0;
		$(".btn_play").attr('value', "Stop");
	}, function() {
		$(".btn_play").attr('value', "Play");
	});
	$('.btn_play').bind('click', function() {
		$('.btn_notate').trigger('click');
		songTicker.toggleTicking($('#bpm').val() * selectedGati);
	});

	var currentTalamAksharaSounds = [], currentTalamAksharaSoundsIndex = 0;
	var talamTicker = new ticker(function() {
		var file = currentTalamAksharaSounds[currentTalamAksharaSoundsIndex];
		if (file) {
			$('.kriya', $kriyas).removeClass('current');
			var $currentKriya = $('.kriya[data_akshara_index=' + currentTalamAksharaSoundsIndex + ']', $kriyas);
			$currentKriya.addClass('current');

	  		new Howl({urls: [file] }).play();
			currentTalamAksharaSoundsIndex = (currentTalamAksharaSoundsIndex + 1) % currentTalamAksharaSounds.length;
		} else {
			console.error("No metronome sound file given");
		}
	}, function() {
		readTalamInput();
		displayKriyasForMet(talams[selectedTalam], selectedJaathi);
		currentTalamAksharaSounds = talamToAksharaSoundFiles(talams[selectedTalam], selectedJaathi);
		currentTalamAksharaSoundsIndex = 0;
		$(".btn_tick").attr('value', "Stop");
	}, function() {
		$(".btn_tick").attr('value', "Tick in this talam");
	});

	$(".btn_tick").bind('click', function() {
		readTalamInput();
		if (isChapu()) {
			$('#only_suladi').show();
			talamTicker.stopTicking();
		} else {
			$('#only_suladi').hide();
			talamTicker.toggleTicking($('#bpm').val());
		}
	});
});


function ticker(onTick, beforeStartTick, afterStopTick) {
	return {
		metIntervalReference: null,
		ticking: false,
		startTicking: function (bpm) {
			var intervalInMills = 1000 * 60 / bpm;
		  	if (!intervalInMills) {
		  		return;
		  	}

	  		beforeStartTick();
		  	this.ticking = true;
	  		this.metIntervalReference = setInterval(function() {
	  			onTick();
	  		}, intervalInMills);
		  	onTick();
		},
		stopTicking: function() {
			if (this.metIntervalReference) clearInterval(this.metIntervalReference);
			this.ticking = false;
			afterStopTick();
		},
		toggleTicking: function(bpm) {
			this.ticking ? this.stopTicking() : this.startTicking(bpm);
		}
	};
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
	if (angam === "O") {
		return ["beat", "wave"];
	}
	if (angam === "U") {
		return ["beat"];
	}
	return [];
}

function displayKriyasForMet(talaAngas, jaati) {
	$kriyas.empty();
	if (isChapu()) {
		$kriyas.hide();
		return;
	}
	var kriyas = talamToKriyas(talaAngas, jaati);
	$(kriyas).each(function(index, kriya) {
		var $span = $("<span class='kriya'></span>");
		$span.text(kriya);
		$span.attr('data_akshara_index', index);
		$kriyas.append($span);
	});
	$kriyas.show();
}

function talamToKriyas(talaAngas, jaati) {
	var kriyas = [];
	for (var i = 0; i < talaAngas.length; i++) {
		kriyas = kriyas.concat(angamToKriyas(talaAngas[i], jaati));
	}
	return kriyas;
}

function talamToAksharaSoundFiles(talaAngas, jaati) {
	var kriyas = talamToKriyas(talaAngas, jaati), aksharaSounds = [];
	for (var i = 0; i < kriyas.length; i++) {
		var soundFile = kriyaToSoundFile[kriyas[i]];
		if (!soundFile) {
			console.log("No sound file found for " + kriyas[i] + ", Using default.");
		}
		aksharaSounds.push(soundFile || "count.mp3");
	}
	console.log(aksharaSounds);
	return aksharaSounds;
}

function parseInput(input) {
	var outputLines = [];
	$(input.trim().split("\n\n")).each(function(_, chunk) {
		var lines = chunk.split("\n");
		if (!lines[0].endsWith("times")) {
			lines.unshift("1 times");
		}
		var times = parseInt(lines[0].split(" ")[0]);
		lines.splice(0, 1);

		var nonComments = [];
		$(lines).each(function(_, line) {
			if (!line.trim().startsWith("//")) {
				nonComments.push(line);
			}
		});
		lines = nonComments;

		while(times--) {
			outputLines = outputLines.concat(lines);
		}
	});

	return outputLines.join(" ").replace(/\s+/g, ' ');
}

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

function getAngaAksharaCount(angam, jaathi) {
	var matras = 0;
	if (angam == 'U') return 1;
	else if (angam == 'O') return 2;
	else if (angam == 'l') return jaathi;

	return matras;
}

function parseTalam(talam, jaathi, gati) {
	var angams = talams[talam], angaMatras = [], avartanamMatras = 0, header = [];
	for (var i = 0; i < angams.length; i++) {
		var matras = 0;
		if (talam.endsWith("chapu")) {
			matras = parseInt(angams[i]);
		}
		else {
			matras = getAngaAksharaCount(angams[i], jaathi) * gati;
		}
		angaMatras.push(matras);
		avartanamMatras += matras;
		for(var j = 1; j <= matras; j++) header.push("" + j);
	}
	return {
		angaMatras: angaMatras,
		avartanamMatras: avartanamMatras,
		header: header
	};
}

function print_info() {
	var talam = parseTalam(selectedTalam, selectedJaathi, selectedGati);
	var $info = $('#info');

	if (talam.avartanamMatras <= 0) {
		$info.text("Sorry, something went wrong");
		return;
	}
	var msg = "";
	if (!selectedTalam.endsWith("chapu")) {
		msg = $('select#talam :selected').text() + " = " + talams[selectedTalam] + ".";
	 	msg += " With " + selectedJaathi + " jaathi and " + selectedGati + " gati, it has ";

	 	var msg1 = "", msg2 = "";
		for (var i = 0; i < talams[selectedTalam].length; i++) {
			if (i) msg1 += "+", msg2 += "+";
			var aksharas = getAngaAksharaCount(talams[selectedTalam][i], selectedJaathi);
			msg1 += aksharas;
			msg2 += aksharas + "x" + selectedGati;
		}
		msg1 += " = " + (talam.avartanamMatras / parseInt(selectedGati)) + " aksharas";
		msg2 += " = " + (talam.avartanamMatras) + " matras";

		msg += msg1 + " and " + msg2 + " in an avartanam.";
	} else {
		if (selectedTalam == "misrachapu") {
			msg = $('select#talam :selected').text() + " has 7 counts (takita taka dimi) in an avartanam.";
		} else if (selectedTalam == "kandachapu") {
			msg = $('select#talam :selected').text() + " has 5 counts (taka takita) in an avartanam.";
		}
	}
	$info.show();
	$info.text(msg);
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

function print_output(output) {
	$output.empty();
	totalNotatedMatraCount = 0;
	$(output).each(function(avartanamIndex, avartanam) {
		var $avartanam = $("<div class='avartanam'></div>");
		if (typeof avartanam === "string") {
			$('#error').show();
			$('#error').text(avartanam);
			return;
		}
		$('#error').hide();

		var separatedAvartanam = [["||"]];
		$(avartanam).each(function(i, angam) {
			separatedAvartanam.push(angam);
			if (i < avartanam.length-1) separatedAvartanam.push([["|"]]);
		});
		separatedAvartanam.push([["||"]]);

		avartanam = separatedAvartanam;


		$(avartanam).each(function(_, angam) {
			var $angam = $("<div class='angam'></div>")
			$(angam).each(function(_, matra) {
				var $matra = $("<div class='matra'></div>")

				var dataMatraIndex = (avartanamIndex == 0 || matra == "||" || matra == "|") ? "" : totalNotatedMatraCount++;
				$matra.attr('data_matra_index', dataMatraIndex);
				$matra.text(matra);
				$angam.append($matra);
			});
			$avartanam.append($angam);
		});

		$output.append($avartanam);
	});
}

// methods that IE doesn't have
Array.prototype.each_slice = function (size, callback){
	// http://stackoverflow.com/a/10249772
	for (var i = 0, l = this.length; i < l; i += size){
		callback.call(this, this.slice(i, i + size));
	}
};

String.prototype.endsWith = function(pattern) {
  var d = this.length - pattern.length;
  return d >= 0 && this.lastIndexOf(pattern) === d;
};

String.prototype.startsWith = function(searchString, position) {
	position = position || 0;
	return this.indexOf(searchString, position) === position;
};
