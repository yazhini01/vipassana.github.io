var defaultBpm = 120;
function talamTicker() {
	return {
		kriyas: [],
		kriyaIndex: 0,
		rootDiv: null,
		btnLabel: null,
		onTalamTick: function() {
			$('.kriya', this.rootDiv).removeClass('current');
			$('.kriya[data_akshara_index=' + this.kriyaIndex + ']', this.rootDiv).addClass('current');

			var file = kriyaToSoundFile[this.kriyas[this.kriyaIndex].split(" ")[0]];
			if (file) new Howl({urls: [file] }).play();

			this.kriyaIndex = (this.kriyaIndex + 1) % this.kriyas.length;
		},
		onBeforeTalamStart: function() {
			this.kriyaIndex = 0;
			$('.btn_tick', this.rootDiv).attr('value', "Stop");
			if (this.onStart) {
				this.onStart();
			}
		},
		onAfterTalamEnd: function() {
			this.stop();
			if (this.onStop) {
				this.onStop();
			}
		},
		displayKriyasForMet: function() {
			var self = this;
			$('.kriya', self.rootDiv).remove();
			$(this.kriyas).each(function(index, kriya) {
				var $span = $("<div class='kriya'></div>");
				$span.text(kriya);
				$span.attr('data_akshara_index', index);
				$('.kriyas', self.rootDiv).append($span);
			});
			this.rootDiv[this.kriyas.length ? "show" : "hide"]();
		},
		setup: function(kriyas, isChapu, kriyaToSoundFile, rootDiv, btnLabel, onStart, onStop) {
			this.kriyas = kriyas; //talamToKriyas(talams[selectedTalam], selectedJaathi);
			this.kriyaToSoundFile = kriyaToSoundFile;
			this.rootDiv = rootDiv;
			this.btnLabel = btnLabel || "Tick in this talam";
			this.onStart = onStart;
			this.onStop = onStop;
			this.bpm = $('.bpm', this.rootDiv).val();
			this.isChapu = isChapu;

			// setup the view
			if (rootDiv[0].childElementCount == 0) {
				this.rootDiv.append($($("#sample_talam_ticker_wrapper").html()));
			}
			this.displayKriyasForMet();
			$('.chapu', this.rootDiv)[isChapu ? 'show' : 'hide']();
			$('.suladi', this.rootDiv)[isChapu ? 'hide' : 'show']();
			$('.kriyas', this.rootDiv).show();
			$('.btn_tick', this.rootDiv).attr('value', this.btnLabel);

			if (!this.suladiTalamTicker) {
				this.suladiTalamTicker = new ticker(this.onTalamTick.bind(this, null), this.onBeforeTalamStart.bind(this, null), this.onAfterTalamEnd.bind(this, null));
				this.chapuTalamTicker = new setTimeoutBasedChapuTicker("talam", this.onTalamTick.bind(this, null), this.onBeforeTalamStart.bind(this, null), this.onAfterTalamEnd.bind(this, null));
			}
			$('.btn_tick', this.rootDiv).bind('click', this.toggle.bind(this));
		},
		toggle: function() {
			if (this.isChapu) {
				this.chapuTalamTicker.toggleTicking(getChapuIntervalInput());
			} else {
				this.bpm = $('.bpm', this.rootDiv).val();
				this.suladiTalamTicker.toggleTicking(this.bpm);
			}
		},
		stop: function() {
			if (!this.chapuTalamTicker.ticking && !this.suladiTalamTicker.ticking) return;

			this.suladiTalamTicker.stopTicking();
			this.chapuTalamTicker.stopTicking();
			$('.btn_tick', this.rootDiv).attr('value', this.btnLabel);
		},
		getBpm: function() {
			return this.bpm;
		},
		ticking: function() {
			return this.chapuTalamTicker.ticking || this.suladiTalamTicker.ticking;
		},
		setCallbacks(onStart, onStop) {
			this.onStart = onStart;
			this.onStop = onStop;
		}
	};
}

var howl;
function setupSongWithTicker(someTicker, file) {
	if (howl) howl.stop();
	howl = new Howl({
		urls: [file],
		onend: function() {
			someTicker.stop();
		}
	});
	someTicker.setCallbacks(
		function() {
			howl.play();
		}, function() {
			howl.stop();
		});
}