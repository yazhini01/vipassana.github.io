var selectedSources = {};

function updateShowingEvents() {
	$events = $("#events");
	$events.empty();
	$(GLOB_EVENTS).each(function(i, event) {
		if (selectedSources[event.source]) {
			var $event = $($('#sample_event').html());
			$('.date', $event).text(event.date);
			$('.source', $event).text(event.source);
			$('.text', $event).text(event.text);
			$event.attr('source', event.source);
			$events.append($event);
		}
	});
/*
	$(sources[source]).each(function(i, event) {

	});
*/
}
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
		updateShowingEvents();
	});
});

sources = {};

$(GLOB_EVENTS).each(function(i, event) {
	event.moment = new moment(event.date); // TODO: sort glob_events

	if (!sources[event.source]) {
		var $source = $($('#sample_event_source').html());
		$source.text(event.source);
		$source.attr('source', event.source);
		$('#sources').append($source);

		sources[event.source] = [];
	}
	sources[event.source].push(event);
});

GLOB_EVENTS.sort(function(a,b) {
  if (a.moment < b.moment)
    return -1;
  if (a.moment > b.moment)
    return 1;
  return 0;
});

// GLOB_EVENTS = {};
