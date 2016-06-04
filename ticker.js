
function setTimeoutBasedChapuTicker(name, onTick, beforeStartTick, afterStopTick) {
	return {
		times: [],
		currentTimeIndex: 0,
		ticking: false,
		timeoutRef: null,
		tick: function() {
			onTick();

			this.timeoutRef = setTimeout(this.tick.bind(this, null), this.times[this.currentTimeIndex]);
			console.log(name + ": next tick after " + this.times[this.currentTimeIndex] + "ms");
			this.currentTimeIndex = (this.currentTimeIndex + 1) % this.times.length;
		},
		startTicking: function (times) {
			this.currentTimeIndex = 0;

	  		beforeStartTick();
			this.times = times;
		  	this.ticking = true;
		  	this.tick();
		},
		stopTicking: function() {
			if (this.timeoutRef) clearTimeout(this.timeoutRef);
			this.ticking = false;
			afterStopTick();
		},
		toggleTicking: function(times) {
			this.ticking ? this.stopTicking() : this.startTicking(times);
		}
	};
}

function ticker(onTick, beforeStartTick, afterStopTick) {
	return {
		interval: null,
		ticking: false,
		startTicking: function (bpm) {
			var intervalInMills = 1000 * 60 / bpm;
		  	if (!intervalInMills) return;

	  		beforeStartTick();
		  	this.ticking = true;
	  		this.interval = setInterval(function() {
	  			onTick();
	  		}, intervalInMills);
		  	onTick();
		},
		stopTicking: function() {
			if (this.interval) clearInterval(this.interval);
			this.ticking = false;
			afterStopTick();
		},
		toggleTicking: function(bpm) {
			this.ticking ? this.stopTicking() : this.startTicking(bpm);
		}
	};
};