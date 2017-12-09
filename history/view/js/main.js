var selectedSources = {};

var debouncedUpdateEvents = _.debounce(function() {
	$events = $("#events");
	var count = 0;
	$(GLOB_EVENTS).each(function(i, event) {
		try {
			if (selectedSources[event.source]) {
				var $event = $($('#sample_event').html());

				$('.date', $event).text([event.date, event.year].join(" "));
				$('.source', $event).text(event.source);
				$('.text', $event).text(event.text);
				$event.attr('source', event.source);
				$event.attr('eventid', event.id);
				if (count%2) $event.addClass('odd');
				count++;
				$events.append($event);
			}
		} catch(e) {
			console.error(e);
		}
	});
	$('#loading').hide();
}, 20);

$(document.body).ready(function() {
	$('#last_modified_time').text(new moment(document.lastModified).format('llll'));

	$('.event_source').bind('click', function() {
		var source = $(this).attr('source');
		console.log(source + " clicked");

		if ($(this).hasClass('selected')) {
			delete selectedSources[source];
		} else {
			selectedSources[source] = 1;
		}
		$(this).toggleClass('selected');

		$('#events').empty();
		$('#loading').show();
		debouncedUpdateEvents();
	});

	$('#loading').hide();
});

sources = {};

$(GLOB_EVENTS).each(function(i, event) {
	event.moment = new moment(event.date + " " + event.year); // TODO: sort glob_events
	if (!sources[event.source]) {
		var $source = $($('#sample_event_source').html());
		$source.text(event.source);
		$source.attr('source', event.source);
		$('#sources').append($source);

		sources[event.source] = [];
	}
	sources[event.source].push(event);
});

GLOB_EVENTS = GLOB_EVENTS.sort(function(a,b) {
	if (a.moment < b.moment) return -1;
	if (a.moment > b.moment) return 1;
	return 0;
});