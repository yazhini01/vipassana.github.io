var defaultValue = "4 times\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\ntam , tam , ,  , dim , dim , ,  , tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\nta jam , jam  , , ta ki ta  jam ,  ,\nta dim , dim  , , ta ki ta dim ,  ,\nta tom , tom  , , ta ki ta\n\nta jam , ta ki ta\nta nam , ta ki ta\nta rum , ta ki ta\nta ta , di di , tom tom , ta din gi na tom ,\nta ta , di di , tom tom , ta din gi na tom ,\nta ta , di di , tom tom , ta din gi na tom\n\n2 times\nta , m ta , m di , m di , m tom , tom , ta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n2 times\nta ki ta tom , ta ta ki ta tom , ta di mi ki ta\n\n";


$(document.body).ready(function() {
	$('#input').val(defaultValue);

	$('.btn_notate').bind('click', function() {
		try {
			var parsed = parseInput($('#input').val());
			var output = notate(parsed);
			print_output(output);
		} catch(e) {
			console.error(e);
			var $error = $("<pre></pre>");
			$error.text(JSON.stringify(e, null, ' '));
			$('#output').append($error);
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

function notate(input) {
	var header = [];
	for (var i = 0; i < 16; i++) header.push("" + (i+1));
	for (var i = 0; i < 8; i++) header.push("" + (i+1));
	for (var i = 0; i < 8; i++) header.push("" + (i+1));

	input = header.concat(input.split(" "));

	var output = [];

	input.each_slice(32, function(avartanam) {
		if (avartanam.length < 32) {
			output.push("Left over (" + avartanam.length + " matras): " + avartanam.join(' '));
			return;
		}
		output.push([avartanam.slice(0, 16), avartanam.slice(16, 24), avartanam.slice(24, 32)]);
	});
	return output;
}

function print_output(output) {
	var $output = $('#output');
	$output.empty();
	$(output).each(function(_, avartanam) {
		var $avartanam = $("<div class='avartanam'></div>");
		if (typeof avartanam === "string") {
			$avartanam.text(avartanam);
			$output.append($avartanam);
			return;
		}

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
				$matra.text(matra);
				$angam.append($matra);
			});
			$avartanam.append($angam);
		});

		$output.append($avartanam);
	});
}

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