require 'nokogiri'
require 'pp'
require 'json'

allevents = []
titles = ["Timeline of Afghan history", "Timeline of Albanian history", "Timeline of Argentine history", "Timeline of Armenian history", "Timeline of Australian history", "Timeline of Bangladeshi history", "Timeline of Barbadian history", "Timeline of Bhutanese history", "Timeline of Brazilian history", "Timeline of Burmese history", "Timeline of Burundian history", "Timeline of Cambodian history", "Timeline of Canadian history", "Timeline of Chilean history", "Timeline of Chinese history", "Timeline of Colombian history", "Timeline of Croatian history", "Timeline of Cuban history", "Timeline of Cypriot history", "Timeline of English history", "Timeline of French history", "Timeline of Georgian History", "Timeline of German history", "Timeline of modern Greek history", "Timeline of Indian history", "Timeline of Indonesian history", "Timeline of Irish history", "Timeline of Israeli history", "Timeline of Italian history", "Timeline of Japanese history", "Timeline of Korean history", "Timeline of Lebanese history", "Timeline of Maltese history", "Timeline of Mongolian history", "Timeline of New Zealand history", "Timeline of Nigerian history", "Timeline of Pakistani history", "Timeline of Philippine history", "Timeline of Polish history", "Timeline of Portuguese history", "Timeline of Romanian history", "Timeline of Russian history", "Timeline of Rwandan history", "Timeline of Scottish history", "Timeline of Serbian history", "Timeline of Singaporean history", "Timeline of Slovenian history", "Timeline of South African history", "Timeline of Spanish history", "Timeline of Swedish history", "Timeline of Taiwanese history", "Timeline of Tanzanian history", "Timeline of Tongan history", "Timeline of Turkish history", "Timeline of United States history", "Timeline of Vietnamese history"]
titles.each do|orig_title|
	title = orig_title.gsub(/ /, '_')
	events = []
	file = nil
	begin
		file = open("wiki/#{title}.html")
	rescue
		sleep(5)
		`wget https://en.wikipedia.org/wiki/#{title} -O wiki/#{title}.html`
		file = open("wiki/#{title}.html")
	end

	page = Nokogiri::HTML(file)
	tables = page.css('table')
	tables.each {|table|
		next unless (table.css('th').text == "YearDateEvent")
		table.css('tr').each {|tr|
			tds = tr.css('td')
			next unless tds.length == 3
			event = {
				'date' => "#{tds[1].text} #{tds[0].text}".strip,
				'text' => tds[2].text,
				'source' => orig_title.gsub(/Timeline of/, "")
			}
			events << event
			allevents << event
		}
	}
	File.open("wiki-pretty/#{title}.txt","w") do |f|
	  PP.pp(events, f)
	end
end

output_file = "view/js/data.js"
File.open(output_file, "w") do |f|
	f.puts "var GLOB_EVENTS="
	f.puts JSON.pretty_generate(allevents)
	f.puts ";"
end