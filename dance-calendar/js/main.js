var VIEWS = ["regular", "calendar"];
var selectedView = VIEWS[0];

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

function printCalendarEvents(events) {
	$('#calendar_events').empty();

	var yrs = {};
	$(events).each(function(i, event) {
		var m = moment(event.when);
		var yr = m.year(), wk = m.isoWeek();
		yrs[yr] = yrs[yr] || {};
		yrs[yr][wk] = yrs[yr][wk] || [];
		yrs[yr][wk].push(event);
	});

	var dummyDate = new moment();

	for (var yr in yrs) {
		for (var wk in yrs[yr]) {
			var writtenDays = false;

			var $week = $($('#sample_calendar_week_wrapper').html());
			$week.attr('week', wk);
			$week.attr('year', yr);
			$('#calendar_events').append($week);

			for(var i = 0; i < 7; i = i+1) {
				var $day = $($('#sample_weekday_wrapper').html());
				$day.attr('weekday', i+1);
				$('.date', $day).text("some day");

				$week.append($day);
			}
			console.log("rendering week " + wk);
			$(yrs[yr][wk]).each(function(i, event) {
				var $eventWrapper = $($('#sample_calendar_event_wrapper').html());
				populateEventForCalendar($eventWrapper, event);
				var m = new moment(event.when);
				var $day = $('.day[weekday="' + m.isoWeekday() + '"]', $week);
				$('.day_events', $day).append($eventWrapper);

				if (!writtenDays) {
					for (var i = 1; i <= 7; i=i+1) {
						var mm = m;
						if (m.isoWeekday() > i) mm = m.subtract(m.isoWeekday() - i, "days");
						if (m.isoWeekday() < i) mm = m.add(i - m.isoWeekday(), "days");
						$('.day[weekday="' + i + '"] .date', $week).text(mm.format("ddd, MMM D"));
					}
					writtenDays = true;
				}

			});

		}
	}
	console.log(yrs);
}

function populateEvent($wrapper, event) {
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
	// $('.what', $wrapper).text(event.info);
	$('.who', $wrapper).text(artist.name);
	$('.where', $wrapper).text(venue.name);

	var date = moment(event.when);
	$('.when', $wrapper).text(date.format('llll'));
}

function populateEventForCalendar($wrapper, event) {
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
	var date = moment(event.when);
	$('.who', $wrapper).text(date.format('LT') + ", " + artist.name + " @ " + venue.name);
}

function printEvents(events) {

	$('#events').empty();
	var html = $('#sample_event_wrapper').html();

	// add header
	if (events.length > 0) {
		var $div = $(html);
		$div.addClass('odd');
		$div.addClass('header');
		$('#events').append($div);

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
		$('#events').append($div);
		populateEvent($div, event);
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
	var events = filter(null, userInputAsArray('.whereButton'), userInputAsArray('.whoButton'));
	events = sortEvents(events, "when");

	printEvents(events);
	printCalendarEvents(events);

	$("#viewForm :input").change(function() {
	    console.log("clicked ", $(this).attr('selectedView'));

	    if ($(this).attr('selectedView') == "list") {
	    	$('#calendar_events').hide();
	    	$('#events').show();
	    } else {
	    	$('#events').hide();
	    	$('#calendar_events').show();
	    }
	});

	$('#calendar_events').hide();
	$('#events').show();

});


function userInputAsArray(cssSel) {
	if ($(cssSel).length == 0) return [];
	if ($(cssSel).val() == "") return [];
	return $(cssSel).val().split(',')
}