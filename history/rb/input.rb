$titles = ["Timeline of Afghan history", "Timeline of Albanian history", "Timeline of Argentine history", "Timeline of Armenian history", "Timeline of Australian history", "Timeline of Bangladeshi history", "Timeline of Barbadian history", "Timeline of Bhutanese history", "Timeline of Brazilian history", "Timeline of Burmese history", "Timeline of Burundian history", "Timeline of Cambodian history", "Timeline of Canadian history", "Timeline of Chilean history", "Timeline of Chinese history", "Timeline of Colombian history", "Timeline of Croatian history", "Timeline of Cuban history", "Timeline of Cypriot history", "Timeline of English history", "Timeline of French history", "Timeline of Georgian History", "Timeline of German history", "Timeline of modern Greek history", "Timeline of Indian history", "Timeline of Indonesian history", "Timeline of Irish history", "Timeline of Israeli history", "Timeline of Italian history", "Timeline of Japanese history", "Timeline of Korean history", "Timeline of Lebanese history", "Timeline of Maltese history", "Timeline of Mongolian history", "Timeline of New Zealand history", "Timeline of Nigerian history", "Timeline of Pakistani history", "Timeline of Philippine history", "Timeline of Polish history", "Timeline of Portuguese history", "Timeline of Romanian history", "Timeline of Russian history", "Timeline of Rwandan history", "Timeline of Scottish history", "Timeline of Serbian history", "Timeline of Singaporean history", "Timeline of Slovenian history", "Timeline of South African history", "Timeline of Spanish history", "Timeline of Swedish history", "Timeline of Taiwanese history", "Timeline of Tanzanian history", "Timeline of Tongan history", "Timeline of Turkish history", "Timeline of United States history", "Timeline of Vietnamese history"]
$titles += ["Timeline of historical geopolitical changes",
			"Timeline of ancient Greece",
			"Chronology of Western colonialism",
			"Timeline of Roman history",
			"10th century",
			"11th century",
			"12th century",
			"13th century",
			"14th century",
			"15th century",
			"16th century",
			"17th century",
			"18th century",
			"19th century",
			"20th century",
			"21st century"
			]

$root = "/Users/yazhini/bn/yazhini01.github.io/history"
$output_file = "#{$root}/view/js/data.js"
$error_file = "#{$root}/error.txt"
$wiki_folder = "#{$root}/wiki"

$eventid = 0
$debug = true


ALL_DAYS = {
	"January"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	"February"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],
	"March"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	"April"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	"May"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	"June"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	"July"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	"August"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	"September"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	"October"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	"November"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
	"December"=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
}

MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];