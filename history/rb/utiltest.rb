require 'minitest/autorun'
require_relative 'util.rb'

class UtilTest < MiniTest::Test
  def test_year_at_start
  	[
  		["c. 1350:The Norse Western Settlement", "c. 1350:"],
  		["c. 1583: Galileo Galilei of Pisa", "c. 1583: "],

		["1500:First portable watch.", "1500:"],
		["1500: First portable watch.", "1500: "],

		["1500s:First portable watch.", "1500s:"],
		["1500s: First portable watch.", "1500s: "],

		["c. 1350-The Norse Western Settlement", "c. 1350-"],
  		["c. 1583- Galileo Galilei of Pisa", "c. 1583- "],

		["1500-First portable watch.", "1500-"],
		["1500- First portable watch.", "1500- "],

		["1500s-First portable watch.", "1500s-"],
		["1500s- First portable watch.", "1500s- "],

		["1613-1617: Polish–Lithuanian Commonwealth is invaded", "1613-1617: "],

		["c.1450-1480s:[1] The Norse Eastern Settlement in Greenland was abandoned", "c.1450-1480s:"],

		["1206-Genghis Khan is declared Great Khan of the Mongols.", "1206-"],
		["1206- Genghis Khan is declared Great Khan of the Mongols.", "1206- "],


		# until here, only simple hyphen is used
		["1410–1413: Foundation of St Andrews University in Scotland.", "1410–1413: "], # has en dash aka U+2013

		["1350 — Hayam Wuruk, styled Sri Rajasanagara, succeeds Tribhuwana Wijayatunggadewi as ruler of Majapahit", "1350 — "],


	].each do|o|
    	assert_equal(year_at_start(o[0]), o[1]);
    end
  end
end