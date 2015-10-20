setInterval(function () {
	if (framework.getCurrentApp() == 'system' && framework.getCurrCtxtId() == 'Applications') {
		$('#myMainBtnDiv').fadeIn();
	} else {
		$('#myMainBtnDiv').css({'display' : 'none'});
		if(enableSpeedometer){
			$('#speedometerContainer').css({'display' : 'none'});
		}
		if(enablePlayer){
			$('#myVideoContainer').css({'display' : 'none'});
			if(playbackStatus){
				myVideoStop();
			}
		}
	}
}, 1000);
