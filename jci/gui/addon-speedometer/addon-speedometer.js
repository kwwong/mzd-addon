var isMph = false;
var speedometerFont = false;

// try not to make changes to the lines below

var speedCurrent = 0;
var speedSumTotal = 0;
var speedTop = 0;
var speedAvg = 0;
var speedValue = 0;
var speedometerFlotData = [];
var speedometerFlotPlot = '';
var totalTripSeconds = 0;
var totalIdleSeconds = 0;
var totalMoveSeconds = 0;

$(document).ready(function(){
	$("#myMainBtnDiv").append('<img src="addon-speedometer/speedometerBtn.png" id="speedometerBtnDiv">');
	
	if(isMph){
		$('#speedBarKphContainer').css({'display' : 'none'});
	} else {
		$('#speedBarMphContainer').css({'display' : 'none'});
		
	}
	
	$('#speedometerBtnDiv').click(function(){
		$('#speedometerContainer').fadeIn();
	});
	$('#speedometerContainer').click(function(){
		$('#speedometerContainer').fadeOut();
	});
	
	function updateSpeedAvg(speed){
		totalMoveSeconds++;
		speedSumTotal += speed;
		var avgSpeed = Math.ceil(speedSumTotal / totalMoveSeconds);
		if(speedAvg != avgSpeed){
			$('#speedAvgValue').html(avgSpeed);
			if(speedometerFont){
				Cufon.replace('#speedAvgValue');
			}
		}
	}
	function updateSpeedTop(speed){
		if(speed > speedTop){
			speedTop = speed;
			$('#speedTopValue').html(speedTop);
			if(speedometerFont){
				Cufon.replace('#speedTopValue');
			}
		}
	}
	function updateSpeedBar(speed){
		if(!isMph){
			for(var i = 190; i >= 110; i -= 20){
				var barClassName = '.speedBarKph_' + i;
				if(speed >= i){
					switch(i){
						case 190:	var backgroundColor = '#FF0000';	break;
						case 170:	var backgroundColor = '#FE2E2E';	break;
						case 150:	var backgroundColor = '#FE642E';	break;
						case 130:	var backgroundColor = '#FE9A2E';	break;
						case 110:	var backgroundColor = '#FACC2E';	break;
					}
					$(barClassName).css({'background-color' : backgroundColor});
				} else {
					$(barClassName).css({'background-color' : 'transparent'});
				}
			}
			for(var i = 110; i >= 30; i -= 10){
				var barClassName = '.speedBarKph_' + i;
				if(speed >= i){
					switch(i){
						case 100:	var backgroundColor = '#F7FE2E';	break;
						case 90:	var backgroundColor = '#C8FE2E';	break;
						case 80:	var backgroundColor = '#9AFE2E';	break;
						case 70:	var backgroundColor = '#64FE2E';	break;
						case 60:	var backgroundColor = '#2EFE2E';	break;
						case 50:	var backgroundColor = '#2EFE64';	break;
						case 40:	var backgroundColor = '#2EFE9A';	break;
						case 30:	var backgroundColor = '#58FAD0';	break;
					}
					$(barClassName).css({'background-color' : backgroundColor});
				} else {
					$(barClassName).css({'background-color' : 'transparent'});
				}
			}
			for(var i = 25; i >= 5; i -= 5){
				var barClassName = '.speedBarKph_' + i;
				if(speed >= i){
					switch(i){
						case 25:	var backgroundColor = '#81F7D8';	break;
						case 20:	var backgroundColor = '#A9F5E1';	break;
						case 15:	var backgroundColor = '#CEF6EC';	break;
						case 10:	var backgroundColor = '#E0F8F1';	break;
						case 5:		var backgroundColor = '#EFFBF8';	break;
					}
					$(barClassName).css({'background-color' : backgroundColor});
				} else {
					$(barClassName).css({'background-color' : 'transparent'});
				}
			}
		} 
		
		if(isMph){
			for(var i = 130; i >= 110; i -= 20){
				var barClassName = '.speedBarMph_' + i;
				if(speed >= i){
					switch(i){
						case 130:	var backgroundColor = '#FF0000';	break;
						case 110:	var backgroundColor = '#FE2E2E';	break;
					}
					$(barClassName).css({'background-color' : backgroundColor});
				} else {
					$(barClassName).css({'background-color' : 'transparent'});
				}
			}
			for(var i = 100; i >= 60; i -= 10){
				var barClassName = '.speedBarMph_' + i;
				if(speed >= i){
					switch(i){
						case 100:	var backgroundColor = '#FE642E';	break;
						case 90:	var backgroundColor = '#FE9A2E';	break;
						case 80:	var backgroundColor = '#FACC2E';	break;
						case 70:	var backgroundColor = '#F7FE2E';	break;
						case 60:	var backgroundColor = '#C8FE2E';	break;
					}
					$(barClassName).css({'background-color' : backgroundColor});
				} else {
					$(barClassName).css({'background-color' : 'transparent'});
				}
			}
			for(var i = 55; i >= 5; i -= 5){
				var barClassName = '.speedBarMph_' + i;
				if(speed >= i){
					switch(i){
						case 55:	var backgroundColor = '#9AFE2E';	break;
						case 50:	var backgroundColor = '#64FE2E';	break;
						case 45:	var backgroundColor = '#2EFE2E';	break;
						case 40:	var backgroundColor = '#2EFE64';	break;
						case 35:	var backgroundColor = '#2EFE9A';	break;
						case 30:	var backgroundColor = '#58FAD0';	break;
						case 25:	var backgroundColor = '#81F7D8';	break;
						case 20:	var backgroundColor = '#A9F5E1';	break;
						case 15:	var backgroundColor = '#CEF6EC';	break;
						case 10:	var backgroundColor = '#E0F8F1';	break;
						case 5:		var backgroundColor = '#EFFBF8';	break;
					}
					$(barClassName).css({'background-color' : backgroundColor});
				} else {
					$(barClassName).css({'background-color' : 'transparent'});
				}
			}
		} 
	}
	function updateTripTime(){
		totalTripSeconds++;
		var hours   = Math.floor(totalTripSeconds / 3600);
		var minutes = Math.floor((totalTripSeconds - (hours * 3600)) / 60);
		var seconds = totalTripSeconds - (hours * 3600) - (minutes * 60);
	
		if (hours > 0 && minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		if(hours > 0){
			$('#tripTimeValue').text(hours+':'+minutes+':'+seconds);
		} else {
			$('#tripTimeValue').text(minutes+':'+seconds);
		}
		if(speedometerFont){
			Cufon.replace('#tripTimeValue');
		}
	}
	function updateIdleTime(){
		if(speedCurrent == 0){
			totalIdleSeconds++;
			var hours   = Math.floor(totalIdleSeconds / 3600);
			var minutes = Math.floor((totalIdleSeconds - (hours * 3600)) / 60);
			var seconds = totalIdleSeconds - (hours * 3600) - (minutes * 60);
		
			if (hours > 0 && minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			if(hours > 0){
				$('#idleTimeValue').text(hours+':'+minutes+':'+seconds);
			} else {
				$('#idleTimeValue').text(minutes+':'+seconds);
			}
			if(speedometerFont){
				Cufon.replace('#idleTimeValue');
			}
		}
	}
	function updateSpeedAll() {
		$.get('addon-speedometer/speedCurrent', function (data) {
			data = $.trim(data);
			if ($.isNumeric(data) && data != speedValue) {
				speedValue = data;
				if(isMph){
					var speedTemp = Math.ceil(data * 0.621);
				} else {
					var speedTemp = Math.ceil(data);
				}
				if(speedTemp > 0){
					updateSpeedTop(speedTemp);
					updateSpeedAvg(speedTemp);
				}
				$('#speedCurrent').each(function () {
					var $this = $(this);
					$({Counter: $this.text()}).animate({Counter: speedValue}, {
						duration: 950,
						easing: 'linear',
						step: function (now) {
							if(isMph){
								$this.text(Math.ceil(now * 0.621));
							} else {
								$this.text(Math.ceil(now));
							}
							speedCurrent = $this.text();
							if(speedometerFont){
								Cufon.replace('#speedCurrent');
							}
							updateSpeedBar(speedCurrent);
						},
						complete: function () {
							if(speedometerFont){
								Cufon.replace('#speedCurrent');
							}
						}
					});
				});
			}
		});
	}
	function initSpeedometerFlot(){
		var _maxSpeed = 200;
		var _tickSize = 20;
		if(isMph){
			_maxSpeed = 140;
			_tickSize = 12;
		}
		speedometerFlotPlot = $.plot("#speedometerFlotPlotDiv", [ getSpeedometerFlotData(0) ], {
			series: {
				shadowSize: 0
			},
			yaxis: {
				min: 0,
				max: _maxSpeed,
				tickSize: _tickSize,
				tickColor: "#666666"
			},
			xaxis: {
				show: false
			},
			lines: { fill: true }
		});
	}
	function updateSpeedometerFlotData() {
		speedometerFlotPlot.setData([getSpeedometerFlotData(speedCurrent)]);
		speedometerFlotPlot.draw();
	}
	function getSpeedometerFlotData(speed){
		if (speedometerFlotData.length > 0){
			speedometerFlotData = speedometerFlotData.slice(1);
		}
		while (speedometerFlotData.length < 480) {
			if(speed > 200){
				speed = 200;
			}
			speedometerFlotData.push(speed);
		}
		var res = [];
		for (var i = 0; i < speedometerFlotData.length; ++i) {
			res.push([i, speedometerFlotData[i]]);
		}
		return res;
	}
	
	initSpeedometerFlot();
	
	setInterval(function () {
		updateSpeedAll();
		updateTripTime();
		updateIdleTime();
		updateSpeedometerFlotData();
	}, 1000);
	
	// this must only be run after plot render properly
	$('#speedometerContainer').css({'display' : 'none'});
});