lines = File.read('input.txt').split("\n")
lines.each do |line|
	w = line.split(" ")
	`wget #{w[0]} -O html/#{w[1]}.html`
end