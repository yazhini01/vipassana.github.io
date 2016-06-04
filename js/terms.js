var pullinVaayBpm = 174; // for the pullin vaay andal thirupaavai song
var terms = {
	"talam": {
		"definition": "A repeating cycle of beats. Songs are usually set to a single talam.",
		"avartanam": "A talam unit. An avartanam is the thing that repeats, in a talam. A song set to a talam is usually made of a number of full avartanams. That is, songs do not end while the talam is in the middle of an avartanam.",
		"akshara": "A talam unit. An avartanam is divided into aksharas.",
		"exercises": {
			"description": "Listen to the first 30 seconds of the Andal Thiruppavai song Pullin Vaay (Atana ragam, Rupaka talam) sung by Subhashree Ramachandran (at " + pullinVaayBpm + " bpm). The beats shown are how you put talam to this song (hopefully :P).",
			"exercise_id": "talam_in_song"
		}
	},
	"Types of Talams":
	{
		"Types": "There are a few types of talams, chiefly 1) Suladi talams and 2) Chapu talams. The suladi sapta talams are classical, traditional talams, and have evenly spaced beats/aksharas. Chapu talams are folk talams and have uneven beats/aksharas.",
		"Suladi Talams": {
			"kriya": "Akshara is a unit/subdivision of an avartanam. Kriya is the action used to indicate the akshara, in a suladi talam. The kriyas used for suladi sapta talams are: beat, wave, count.",
			"angam": {
				"definition": "An angam is defined by a sequence of kriyas. Three angams are used in the suladi talams: laghu, dhrutam, and anudhrutam.",
				"dhrutam": "An angam that is defined by this sequence of kriyas: [beat, wave]. A dhrutam is written with a O.",
				"anudhrutam": "An angam that is defined by this sequence of kriyas: [beat]. An anudhrutam is written with a U.",
				"laghu": {
					"definition": "An angam that is defined by this sequence of kriyas: [beat, count (little finger), count (ring finger), count (middle finger), ...]. Laghus have variable number of kriyas/aksharas. While counting, once the thumb is reached, the counting resumes with the little finger. A laghu is written with a |.",
					"jaathi": "All suladi talams have at least one laghu. Jaathi is the number of aksharas in the laghu. The permitted jaathi values are 3, 4, 5, 7, 9."
				}
			},
			"types of suladi talams": {
				"suladi sapta talams": "Seven classical talam types known as Dhruvam, Matyam, Rupakam, Jhampam, Triputam, Atam, Ekam. Each of the seven talam types is defined by a fixed sequence of angams.",
				"dhruvam": "A suladi sapta talam defined by this sequence of angams: [laghu,dhrutam,laghu,laghu]. Written as |O||.",
				"matyam": "A suladi sapta talam defined by this sequence of angams: [laghu,dhrutam,laghu]. Written as |O|.",
				"rupakam": "A suladi sapta talam defined by this sequence of angams: [dhrutam,laghu]. Written as O|.",
				"jhampam": "A suladi sapta talam defined by this sequence of angams: [laghu,anudhrutam,dhrutam]. Written as |UO.",
				"triputam": "A suladi sapta talam defined by this sequence of angams: [laghu,dhrutam,dhrutam]. Written as |OO.",
				"atam": "A suladi sapta talam defined by this sequence of angams: [laghu,laghu,dhrutam,dhrutam]. Written as ||OO.",
				"ekam": "A suladi sapta talam defined by this sequence of angams: [laghu]. Written as |."
			},
			"matra": "Matra is the smallest unit of division in a suladi talam. An akshara is divided into matras. ",
			"gati": "The number of matras in an akshara, in a given suladi talam. The permitted gati values are 3, 4, 5, 7 and 9."
		},
		"Chapu Talams": {
			"definition": "TODO"
		}
	}
};

function makeTree(root, $root, skipTitles) {
	if (typeof root === "string") {
		var $span = $("<span></span>");
		$span.text(root);
		$root.append($span);
		return;
	}
	$(Object.keys(root)).each(function(_, term) {
		var $div = $("<div class='terms_container'></div>");

		var $term = $("<span class='term'></span>");
		$term.text($.capitalize(term));
		$term.attr('data-term', term);
		if (!skipTitles) $div.append($term);

		var $termsBody = $("<div class='terms_body'></div>");
		$termsBody.attr('data-term', term);
		$termsBody.addClass('togglable_section');
		if (term.toLowerCase().startsWith("exercise_id")) {
			$term.text($.capitalize(term.split("_")[0]));
			showExercise(root[term], $termsBody, skipTitles);
		} else {
			var nextSkipTitles = skipTitles || term.toLowerCase().startsWith("exercise");
			makeTree(root[term], $termsBody, nextSkipTitles);
		}
		$div.append($termsBody);

		$root.append($div);
	});
}

$(document.body).ready(function() {
	makeTree(terms, $('#terms'));
	$('.term').bind('click', function(e) {
		$('.togglable_section[data-term="' + $(e.target).attr('data-term') + '"]').toggle();
	});
	$('[data-term="Types of Talams"]').trigger('click');
});


function showExercise(exID, $exDiv) {
	if (exID === "talam_in_song") {
		var talamTicker1 = new talamTicker();
		var howl = new Howl({
			urls: ["sounds/pullin_vaay__atana__rupakam.mp3"],
			onend: function() {
				talamTicker1.stop();
			}
		});
		talamTicker1.setup(talamToKriyas("rupaka", 4), false, kriyaToSoundFile, $exDiv, "Listen",
			function() {
				howl.play();

			}, function() {
				howl.stop();
			});
		$('.bpm', $exDiv).val("" + pullinVaayBpm);
		$('.input', $exDiv).hide();

	}
}


