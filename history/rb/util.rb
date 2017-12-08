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


$year_re = "(c. *)?\\d{1,4}s?(bc|ad)?"
$sep_re = " *(:|-|\\u2013|\\u2014)? *" # \u2013 is en dash, \u2014 is figure dash
$start_with_year_range_re = Regexp.new("^" + $year_re + $sep_re + $year_re + $sep_re)
$start_with_year_re = Regexp.new("^" + $year_re + $sep_re)
# $t = "1350 — "
def year_at_start(text)
	return nil unless text
	text = text.downcase

	# check for ranges like 1990-2000 first
	match = $start_with_year_range_re.match(text)
	return match[0] if (match)

	# check for just year (without range)
	match = $start_with_year_re.match(text)
	return match[0] if (match)

	return nil
end

def remove_chars_from_potential_year(text)
	text = text.downcase
	# if (text.end_with("century"))
	text = text.gsub(/c. /, "")
	text = text.gsub(/[, (bc)(ad)(bce)s]+/, "") # remove bc, ad, comma, s
	return text
end