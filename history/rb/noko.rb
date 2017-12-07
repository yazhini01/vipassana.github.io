require 'nokogiri'
require 'pp'
require 'json'
require './util.rb'
require './input.rb'

MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

def fetch_wiki_page_save_and_parse(title) # doesn't refetch
	file = nil
	begin
		file = open("#{$wiki_folder}/#{title}.html")
	rescue
		sleep(5)
		`wget https://en.wikipedia.org/wiki/#{title} -O #{$wiki_folder}/#{title}.html`
		file = open("#{$wiki_folder}/#{title}.html")
	end
	page = Nokogiri::HTML(file)
	page = page.css('#mw-content-text')
	page.css('#toc').remove # toc is table of contents
	page.css('.reflist').remove
	# page.css('#Further_reading')[0].next_element.remove
	# page.css('#See_also')[0].next_element.remove
	return page
end


def get_events_from_lis(orig_title, page)
	events = []
	lis = page.css('li')
	lis.each {|li|
		year = year_at_start(li.text)
		if (year)
			events << {
				'date' => "",
				'year' => year,
				'text' => li.text[year.length..li.text.length-1],
				'source' => orig_title.gsub(/Timeline of/, "")
			}
		else
			puts "==#{orig_title}=="
			puts li.text
		end
	}
	return events
end

def get_events_from_tables(orig_title, page)
	errors = ""
	tables = page.css('table')
	last_used_year = nil # year, we always need
	last_used_date = "" # date is optional
	events = []
	tables.each {|table|
		next unless (table.css('th').text == "YearDateEvent")
		table.css('tr').each {|tr|
			next if (tr.text.gsub(/\n/, "") == "YearDateEvent")

			text = tr.text
			tds = tr.css('td').map {|td| td.text.strip }

			if (tds[0] && is_year(tds[0]))
				last_used_year = tds[0]
				last_used_date = ""
				text = tds[1..tds.length-1].join(" ")
			end

			if (is_month_and_date(tds[1]))
				last_used_date = tds[1]
				text = tds[2..tds.length-1].join(" ")
			end

			if (is_month_and_date(tds[0]))
				last_used_date = tds[0]
				text = tds[1..tds.length-1].join(" ")
			end

			if (text != nil && text.length > 0 && last_used_year != nil)
				event = {
					'date' => "#{last_used_date}".strip,
					'year' => last_used_year,
					'text' => text,
					'source' => orig_title.gsub(/Timeline of/, "")
				}
				events << event
			else
				error = "==Problem in #{orig_title}==\n"
				error += "text=#{text}\n"
				error += "last_used_date=#{last_used_date}\n"
				error += "last_used_year=#{last_used_year}\n"
				error += "tr=#{tr.text}\n"
				error += "\n"
				errors += error
			end
		}
	}
	File.open("#{$error_file}", "a") do |f|
		f.puts errors
	end
	return events
end

def main()
	events = []
	File.open("#{$error_file}", "w") {|f| f.puts ""}

	$titles.each do|orig_title|
		title = orig_title.gsub(/ /, '_')
		page = fetch_wiki_page_save_and_parse(title)
		events += get_events_from_tables(orig_title, page)
		events += get_events_from_lis(orig_title, page)
	end

	File.open($output_file, "w") do |f|
		f.puts "var GLOB_EVENTS="
		f.puts JSON.pretty_generate(events)
		f.puts ";"
	end
end


main()