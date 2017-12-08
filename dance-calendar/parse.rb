require 'pp'
require 'json'
require 'date'

text =  File.read("/Users/yazhini/bn/yazhini01.github.io/dance-calendar/schedules.txt")
lines = text.split("\n")
events = []
day = ""
time = ""
timeRegEx = /^\d{1,2} *(:\d{1,2})* *(am|pm|AM|PM)$/
dateRegEx = /^\d{1,2}\/\d{1,2}\/\d{1,2}$/
lines.each_with_index do |line, lineNo|
	line = line.strip
	next if line.length == 0
	day = line if (line.end_with?("2018") || line.end_with?("2017"))
	begin
		day = Date.strptime(line, "%m/%d/%y") if (dateRegEx.match(line))
	rescue
		puts "===="
		puts "this matched date: #{line}"
	end

	time = line if (timeRegEx.match(line))


	if line.include?("*")
		begin
			parts = line.split("*")
			who = []
			parts[1].split(',').each do|whoPart|
				who << whoPart.strip.split(" ").map {|namePart| namePart.capitalize}.join(" ")
			end
			events << {
				'where' => parts[0].strip.downcase,
				'who' => who,
				'info' => parts.length > 2 ? parts[2..parts.length-1].join(",").strip : "",
				'lineNo' => lineNo,
				'when' =>  DateTime.parse("#{day} #{time} +530").to_time.to_i * 1000
			}
		rescue
			puts "==ERROR=="
			puts line
		end
	end
end
File.open("js/schedules-parsed.js", "w") do |f|
	f.puts "var globEvents="
	f.puts JSON.pretty_generate(events)
  	f.puts ";"
end