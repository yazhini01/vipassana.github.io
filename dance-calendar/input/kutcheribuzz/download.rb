File.read("links.txt").split("\n").each do|line|
	parts = line.split(" ")
	`wget #{parts[0]} -O #{parts[1..parts.length-1].join("_")}.pdf`
end