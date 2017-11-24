function strSort(aa, bb) {
	if (aa < bb) return -1;
	if (aa > bb) return 1;
	return 0;
}
function sortEvents(events, by) {
	return events.sort(function(a, b) {
		if (by == "when") return a.when - b.when;
		if (by == "who") return strSort(a.who.sort()[0], bb = b.who.sort()[0]);
		if (by == "where") return strSort(
			venues[a.where] ? venues[a.where].name : a.where,
			venues[b.where] ? venues[b.where].name : b.where);
	});
}
var showingEvents = [];

function printEvents(events) {

	$('.filtered_events').empty();
	var html = $('#sample_filtered_event_wrapper').html();

	// add header
	if (events.length > 0) {
		var $div = $(html);
		$div.addClass('odd');
		$div.addClass('header');
		$('.filtered_events').append($div);

		$('.who', $div).text("Who (click to sort)");
		$('.who', $div).bind('click', function() {
			printEvents(sortEvents(showingEvents, "who"));
		});
		$('.where', $div).text("Where (click to sort)");
		$('.where', $div).bind('click', function() {
			printEvents(sortEvents(showingEvents, "where"));
		});
		$('.when', $div).text("When (click to sort)");
		$('.when', $div).bind('click', function() {
			printEvents(sortEvents(showingEvents, "when"));
		});

		// $('.what', $div).text("Info");
	}


	$(events).each(function(i, event) {
		var $div = $(html);
		$('.filtered_events').append($div);

		var artist = artists.placeholder;
		if (event.who != null) {
			if (artists[event.who]) artist = artists[event.who];
			else artist.name = event.who;
		}

		var venue = venues.placeholder;
		if (event.where != null) {
			if (venues[event.where]) venue = venues[event.where];
			else venue.name = event.where;
		}
		// $('.what', $div).text(event.info);
		$('.who', $div).text(artist.name);
		$('.where', $div).text(venue.name);

		var date = moment(event.when);
		$('.when', $div).text(date.format('llll'));

		if (i%2 == 1) $div.addClass('odd');
	});

	showingEvents = events;
}

function filter(filterWhen, filterWhere, filterWho) {
	var result = [];
	$(globEvents).each(function(i, event) {
		if (filterWhen != null &&
			(event.when < filterWhen.start || event.when > filterWhen.end)) return;
		if (filterWho.length != 0 &&
			$(event.who).filter(filterWho).length == 0) return;
		if (filterWhere.length != 0 &&
			$.inArray(event.where, filterWhere) == -1) return;
		result.push(event);
	});
	return result;
}

$(document.body).ready(function() {
	// $('.filterButton').click(function() {
		var events = filter(
						null,
						userInputAsArray('.whereButton'),
						userInputAsArray('.whoButton'))
		.sort(function(a, b) {
			return a.when < b.when;
		});

		printEvents(events);
	// });
	// $('.filterButton').click();
});


function userInputAsArray(cssSel) {
	if ($(cssSel).val() == "") return [];
	return $(cssSel).val().split(',')
}