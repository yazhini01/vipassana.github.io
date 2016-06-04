var defaultValue = "4 times\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\ntam , tam , ,  dim , dim ,  , tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\nta jam , jam  , , ta ki ta  jam ,  ,\nta dim , dim  , , ta ki ta dim ,  ,\nta tom , tom  , , ta ki ta\n\nta jam , ta ki ta\nta nam , ta ki ta\nta rum , ta ki ta\nta ta , di di , tom tom , ta din gi na tom , ,\nta ta , di di , tom tom , ta din gi na tom , ,\nta ta , di di , tom tom , ta din gi na tom , ,\n\n2 times\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\nta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n";
var defaultMisraChapuIntervals = "200,200,200,300,300,300,300";
var defaultKandaChapuIntervals = "300,300,300,300,300";
var selectedTalam, selectedJaathi, selectedGati;
var notatedSong = [], totalNotatedMatraCount = 0;
var $kriyas, $kriyas;
var talamTicker1 = new talamTicker();
function onTalamChange() {
	selectedTalam = $('select#talam :selected').attr('value');
	selectedJaathi = $('select#jaathi :selected').attr('value');
	selectedGati = isChapu() ? 2 : $('select#gati :selected').attr('value'); // sorry
	$('.suladi')[isChapu() ? 'hide' : 'show']();
	$('.chapu')[isChapu() ? 'show' : 'hide']();
	if (!$('#chapu_intervals').val().length) {
		if (selectedTalam == "misrachapu") {
			$('#chapu_intervals').val(defaultMisraChapuIntervals);
		} else if (selectedTalam == "kandachapu") {
			$('#chapu_intervals').val(defaultKandaChapuIntervals);
		}
	}

	talamTicker1.setup(
		talamToKriyas(selectedTalam, selectedJaathi),
		isChapu(),
		kriyaToSoundFile,
		$('#metronome .section_body'),
		"Tick at this talam");
}

function isChapu() {
	return selectedTalam.endsWith("chapu");
}

function getChapuIntervalInput() {
	var intervals = $('#chapu_intervals').val().split(",");
	intervals = $(intervals).map(function(_, i) { return parseInt(i);});
	return intervals;
}

$(document.body).ready(function() {
	$kriyas = $('#kriyas');
	$output = $('#output');
	onTalamChange();

	$('#input').val(defaultValue);

	$('.btn_notate').bind('click', function() {
		onTalamChange();
		print_info();
		notatedSong = notate(parseInput($('#input').val()));
		print_output(notatedSong);
	});

	$('select#talam').change(onTalamChange);
	$('select#jaathi').change(onTalamChange);
	$('select#gati').change(onTalamChange);

	var currentSongIndex = 0;
	var onSongTick = function() {
		$('.matra', $output).removeClass('current');
		var $currentKriya = $('.matra[data_matra_index=' + currentSongIndex + ']', $output);
		$currentKriya.addClass('current');
		currentSongIndex = (currentSongIndex + 1) % totalNotatedMatraCount;
	}, onBeforeSongTickStart = function() {
		onTalamChange();

		currentSongIndex = 0;
		$(".btn_play").attr('value', "Stop");
		talamTicker1.toggle();
	}, onAfterSongTickEnd = function() {
		$(".btn_play").attr('value', "Play");
		talamTicker1.stop();
	};
	var songTicker = new ticker(onSongTick, onBeforeSongTickStart, onAfterSongTickEnd);
	var chapuSongTicker = new setTimeoutBasedChapuTicker("song", onSongTick, onBeforeSongTickStart, onAfterSongTickEnd);

	$('.btn_play').bind('click', function() {
		$('.btn_notate').trigger('click');
		if (isChapu()) {
			// unit is milli seconds (not bpm)
			var intervals = [];
			$(getChapuIntervalInput()).each(function(_,i) {
				i = i / selectedGati;
				for (var j = 0; j < selectedGati; j++) intervals.push(i);
			});
			chapuSongTicker.toggleTicking(intervals);
		} else {
			songTicker.toggleTicking(talamTicker1.getBpm() * selectedGati);
		}
	});
});


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

function parseTalam(talam, jaathi, gati) {
	var angams = talams[talam], angaMatras = [], avartanamMatras = 0, header = [];
	for (var i = 0; i < angams.length; i++) {
		var matras = gati * (talam.endsWith("chapu") ? parseInt(angams[i]) : getAngaAksharaCount(angams[i], jaathi));
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
			msg = $('select#talam :selected').text() + " has 14 counts in an avartanam (I think?).";
		} else if (selectedTalam == "kandachapu") {
			msg = $('select#talam :selected').text() + " has 10 counts in an avartanam (I think?).";
		}
	}
	$info.show();
	$info.text(msg);
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