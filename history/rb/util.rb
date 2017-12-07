def is_num(text)
	return text && text.to_i.to_s == text
end

def is_year(text)
	text = remove_chars_from_potential_year(text)
	return true if (is_num(text)) # 1930AD, 1429
	if (text.split("-").length == 2) # 1000 - 2000
		p = text.split("-")
		return true if (is_num(p[0]) && is_num(p[1]))
	end
	return false
end

def is_month_and_date(text)
	return false unless text
	parts = text.split(" ")
	MONTHS.each do|month|
		return true if (text.downcase.start_with?(month) && text.length < 12) # random hacky number
		return true if (parts[0] && parts[0].downcase.start_with?(month) && parts[1].to_i.to_s == parts[1])
		return true if (parts[1] && parts[1].downcase.start_with?(month) && parts[0].to_i.to_s == parts[0])
	end
	return false
end

def year_at_start(text)
	match = /^\d{1,4}s?(bc|ad)?/.match(text.downcase)
	return match ? match[0] : nil
end

def remove_chars_from_potential_year(text)
	text = text.downcase
	# if (text.end_with("century"))
	text = text.gsub(/c. /, "")
	text = text.gsub(/[, (bc)(ad)(bce)s]+/, "") # remove bc, ad, comma, s
	return text
end