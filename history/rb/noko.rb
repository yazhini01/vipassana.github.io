require 'nokogiri'
require 'pp'
require 'json'
require './util.rb'
require './input.rb'



def wiki_title_to_source(title)
	return title.gsub(/Timeline of |Chronology of /i, "")
end

def fetch_wiki_page_save_and_parse(title) # doesn't refetch
	file = nil
	begin
		file = open("#{$wiki_folder}/#{title}.html")
	rescue
		sleep(3)
		`wget https://en.wikipedia.org/wiki/#{title} -O #{$wiki_folder}/#{title}.html`
		file = open("#{$wiki_folder}/#{title}.html")
	end
	page = Nokogiri::HTML(file)
	page = page.css('#mw-content-text')
	page.css('#toc').remove # toc is table of contents
	page.css('.reflist').remove
	page.css('.infobox').remove

	# remove all future siblings that come after ancestor-h2 of See_also span
	page.xpath('//span[@id="See_also"]//ancestor::h2/following-sibling::*').remove

	return page
end

def get_birth_dates_from_365_wiki_pages()
	events = []
	errors = ""
	ALL_DAYS.each do|month, dates|
		dates.each do|day|
			title = "#{month}_#{day}"
			page = fetch_wiki_page_save_and_parse(title)
			['Deaths', 'Births'].each do|eventType|
				# find the first sibling ul following the h2-ancestor of Deaths-span
				ul = page.xpath("//span[@id='#{eventType}']//ancestor::h2/following-sibling::ul")[0].remove
				ul.xpath('li').each {|li|
					begin
						year = year_at_start(li.text)
						event = {
							'date' => "#{month} #{day}",
							'year' => year.to_i,
							'text' => eventType + " of " + li.text[year.length..li.text.length-1],
							'source' => eventType,
							'id' => $eventid
						}
						$eventid = $eventid + 1
						event['raw'] = li.text if ($debug)
						events << event
					rescue
						error = "==Birthdate Parsing: Problem in #{title}==\n"
						error += li.text
						puts error
						errors += error
					end
				}
			end
		end
	end
	add_errors(errors)
	return events
end

def add_errors(errors)
	File.open("#{$error_file}", "a") {|f| f.puts errors }
end

def get_events_from_lis(orig_title, page)
	events = []
	errors = ""
	lis = page.css('li')
	lis.each {|li|
		year = year_at_start(li.text)
		if (year)
			event = {
				'date' => "",
				'year' => year.to_i,
				'text' => li.text[year.length..li.text.length-1],
				'source' => wiki_title_to_source(orig_title),
				'id' => $eventid
			}
			$eventid = $eventid + 1
			event['raw'] = li.text if ($debug)
			events << event
		else
			error = "==li Parsing: Problem in #{orig_title}==\n"
			errors += li.text
		end
	}
	add_errors(errors)
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
					'year' => last_used_year.to_i,
					'text' => text,
					'source' => wiki_title_to_source(orig_title),
					'id' => $eventid
				}
				$eventid = $eventid + 1
				event['raw'] = tr.text if ($debug)
				events << event
			else
				error = "==table Parsing: Problem in #{orig_title}==\n"
				error += "text=#{text}\n"
				error += "last_used_date=#{last_used_date}\n"
				error += "last_used_year=#{last_used_year}\n"
				error += "tr=#{tr.text}\n"
				error += "\n"
				errors += error
			end
		}
	}
	add_errors(errors)
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
	events += get_birth_dates_from_365_wiki_pages()

	File.open($output_file, "w") do |f|
		f.puts "var GLOB_EVENTS="
		f.puts JSON.pretty_generate(events)
		f.puts ";"
	end
end


main()