var VIEWS = ["list", "calendar"];
var selectedView = VIEWS[0];
var showSelectedArtists = false;

function sortEvents(events, by) {
	return events.sort(function(a, b) {
		if (by == "when") return a.when - b.when;
		if (by == "who") {
			var aa = a.who.sort()[0], bb = b.who.sort()[0];
			if (aa < bb) return -1;
			if (aa > bb) return 1;
			return a.when - b.when;
		}
		if (by == "where") {
			var aa = venues[a.where] ? venues[a.where].name : a.where;
			var bb = venues[b.where] ? venues[b.where].name : b.where;
			if (aa < bb) return -1;
			if (aa > bb) return 1;
			return a.when - b.when;
		}
	});
}
var showingEvents = [];

function printCalendarEvents() {
	$('#calendar_events').empty();

	var yrs = {};
	$(showingEvents).each(function(i, event) {
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
			$(yrs[yr][wk]).each(function(i, event) {
				var $eventWrapper = $($('#sample_calendar_event_wrapper').html());
				populateEventForCalendar($eventWrapper, event);
				var m = new moment(event.when);
				var $day = $('.day[weekday="' + m.isoWeekday() + '"]', $week);
				$('.day_events', $day).append($eventWrapper);
				$('.noEvent', $day).remove();

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
	var venue = venues.placeholder;
	if (event.where != null) {
		if (venues[event.where]) venue = venues[event.where];
		else venue.name = event.where;
	}
	// $('.what', $wrapper).text(event.info);
	$('.who', $wrapper).text(event.who.join(" & "));
	$('.where', $wrapper).text(venue.name);

	var date = moment(event.when);
	$('.when', $wrapper).text(date.format('llll'));
	if ($(event.who).filter(selectedArtists).length > 0) {
		$wrapper.addClass('selected_artist');
	}
}

function populateEventForCalendar($wrapper, event) {
	var venue = venues.placeholder;
	if (event.where != null) {
		if (venues[event.where]) venue = venues[event.where];
		else venue.name = event.where;
	}
	var date = moment(event.when);
	$('.who', $wrapper).text(date.format('LT') + ", " + event.who.join(" & ") + " @ " + venue.name);
	if ($(event.who).filter(selectedArtists).length > 0) {
		$wrapper.addClass('selected_artist');
	}
}

function printListEvents() {
	$('#events').empty();
	var html = $('#sample_event_wrapper').html();

	// add header
	if (showingEvents.length > 0) {
		var $div = $(html);
		$div.addClass('header');
		$('#events').append($div);

		$('.who', $div).text("Who (click to sort)");
		$('.who', $div).bind('click', function() {
			printListEvents(sortEvents(showingEvents, "who"));
		});
		$('.where', $div).text("Where (click to sort)");
		$('.where', $div).bind('click', function() {
			printListEvents(sortEvents(showingEvents, "where"));
		});
		$('.when', $div).text("When (click to sort)");
		$('.when', $div).bind('click', function() {
			printListEvents(sortEvents(showingEvents, "when"));
		});
		// $('.what', $div).text("Info");
	}

	$(showingEvents).each(function(i, event) {
		var $div = $(html);
		$('#events').append($div);
		populateEvent($div, event);
	});
}

function filter(events, filterWhen, filterWhere, filterWho) {
	var result = [];
	$(events).each(function(i, event) {
		if (filterWhen != null && (event.when < filterWhen.start || event.when > filterWhen.end)) return;
		if (filterWho.length != 0 && $(event.who).filter(filterWho).length == 0) return;
		if (filterWhere.length != 0 && $.inArray(event.where, filterWhere) == -1) return;
		result.push(event);
	});
	return result;
}

function printEvents(events, filterWhen, filterWhere, filterWho) {
	showingEvents = sortEvents(filter(events, filterWhen, filterWhere, filterWho), "when");
	printListEvents();
	printCalendarEvents();
	showChosenView();
}

function showChosenView() {
	if (selectedView == "list") {
    	$('#calendar_events').hide();
    	$('#events').show();
    } else {
    	$('#events').hide();
    	$('#calendar_events').show();
    }
}

$(document.body).ready(function() {
	$('#last_modified_time').text(new moment(document.lastModified).fromNow());

	$("#viewForm :input").change(function() {
		selectedView = $(this).attr('selectedView');
		showChosenView();
	});
	printEvents(globEvents, null, [], []);

	$("#artistsForm :input").change(function() {
	    if ($(this).attr('selectedArtists') == "selected") {
	    	printEvents(globEvents, null, [], selectedArtists);
	    } else {
			printEvents(globEvents, null, [], []);
	    }
	});
});

function userInputAsArray(cssSel) {
	if ($(cssSel).length == 0) return [];
	if ($(cssSel).val() == "") return [];
	return $(cssSel).val().split(',')
}