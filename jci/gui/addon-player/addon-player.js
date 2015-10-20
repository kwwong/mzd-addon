var myVideoList = null;
var playbackOption = null;
var playbackRepeat;
var playbackStatus = false;

$(document).ready(function(){
	$("#myMainBtnDiv").append('<img src="addon-player/myVideoBtn.png" id="myVideoBtnDiv"><img src="addon-player/rebootBtn.png" id="rebootBtnDiv">');
	
	$('#myVideoContainer').css({'display' : 'none'});
	$('#myVideoBtnDiv').click(function(){
		getMyVideoPlaybackOption();
		$('#myVideoContainer').fadeIn();
	});
	$('#myVideoPlayAllBtn').click(function(){
		setMyVideoPlaybackOption('playall');
	});
	$('#myVideoRepeatBtn').click(function(){
		setMyVideoPlaybackOption('repeat');
	});
	$('#myVideoBackBtn').click(function(){
		if(playbackStatus){
			myVideoStop();
		}
		$('#myVideoContainer').fadeOut();
	});
	$('#myVideoStopBtn').click(function(){
		myVideoStop();
	});
	$('#myVideoMovieBtn').click(function(){
		myVideoProcessList();
	});
	$('#myVideoList').html(myVideoList);
	$('#myVideoList').on("click", "li", function() {
		myVideoPlay($(this));
	});
	
	$('#rebootBtnDiv').click(function(){
		rebootSystem();
	});
	
	function rebootSystem(){
		$.ajax({
			url: 'http://127.0.0.1:54321/?v=reboot-system',
			async: true
		});
	}
	function myVideoPlaybackManage(obj){
		if(playbackStatus){
			$.get('addon-player/playbackStatus', function (data) {
				if(data.length > 2){
					$('#myVideoStatus').html('Playing...');
					playbackRepeat = setTimeout(function(){
						myVideoPlaybackManage(obj);
					}, 3000);
				} else {
					clearTimeout(playbackRepeat);
					$('#myVideoStatus').html('Stopped');
					if(playbackOption.playall == 'yes'){
						var nextObj = obj.next('li');
						if(nextObj.length === 0){
							nextObj = obj.closest('ul').find('li').first();
						}
						obj = nextObj;
					}
					if(playbackOption.repeat == 'yes'){
						myVideoPlay(obj);
					} else {
						playbackStatus = false;
					}
				}
			});
		} else {
			clearTimeout(playbackRepeat);
		}
	}
	function myVideoPlay(obj){
		playbackStatus = true;
		$('#myVideoStatus').html('Preparing...');
		var videoToPlay = obj.attr('data');
		var vtp = 'start-playback&' + videoToPlay + '&';
		$.ajax({
			url: 'http://127.0.0.1:54321/?v=' + vtp,
			async: true,
			complete: function(){
				setTimeout(function(){
					myVideoPlaybackManage(obj);
				}, 3000);
			}
		});	
	}
	function myVideoStop(){
		clearTimeout(playbackRepeat);
		$.ajax({
			url: 'http://127.0.0.1:54321/?v=stop-playback',
			async: true,
			complete: function(){
				if(playbackStatus){
					playbackStatus = false;
					$('#myVideoStatus').html('Stopped');
				}
			}
		});
	}
	function myVideoProcessList(){
		$('#myVideoList').html("<img id='ajaxLoader' src='addon-player/ajax-loader.gif'>");
		$.ajax({
			url: 'http://127.0.0.1:54321/?v=get-video-list',
			timeout: 1000,
			async: true,
			complete: function(){
				setTimeout(function(){
					myVideoLoadList();
				}, 3000);
			}
		});
	}
	function myVideoLoadList(){
		$.get('addon-player/myVideoList', function (data) {
			if(data.length < 2){
				data = 'No videos found<br/><br/>Tap <img src="addon-player/myVideoMovieBtn.png" /> to search again';
			}
			myVideoList = data;
			$('#myVideoList').html(myVideoList);
			$('#myVideoListUl').slimScroll({
				size: '60px',
				color: '#666666',
				width: '700px',
				height: 'auto',
				alwaysVisible: true
			});
		});
	}
	function getMyVideoPlaybackOption(){
		$.get('addon-player/playbackOption', function (data) {
			playbackOption = jQuery.parseJSON(data);
			if(playbackOption.playall == 'yes'){
				$('#myVideoPlayAllBtn').css({'background-image' : 'url(addon-player/myVideoCheckedBox.png)'});
			} else {
				$('#myVideoPlayAllBtn').css({'background-image' : 'url(addon-player/myVideoUncheckBox.png)'});
			}
			if(playbackOption.repeat == 'yes'){
				$('#myVideoRepeatBtn').css({'background-image' : 'url(addon-player/myVideoCheckedBox.png)'});
			} else {
				$('#myVideoRepeatBtn').css({'background-image' : 'url(addon-player/myVideoUncheckBox.png)'});
			}
		});
	}
	function setMyVideoPlaybackOption(option){
		if(option == 'playall'){
			if(playbackOption.playall == 'yes'){
				playbackOption.playall = 'no';
				$('#myVideoPlayAllBtn').css({'background-image' : 'url(addon-player/myVideoUncheckBox.png)'});
			} else {
				playbackOption.playall = 'yes';
				$('#myVideoPlayAllBtn').css({'background-image' : 'url(addon-player/myVideoCheckedBox.png)'});
			}
		}
		if(option == 'repeat'){
			if(playbackOption.repeat == 'yes'){
				playbackOption.repeat = 'no';
				$('#myVideoRepeatBtn').css({'background-image' : 'url(addon-player/myVideoUncheckBox.png)'});
			} else {
				playbackOption.repeat = 'yes';
				$('#myVideoRepeatBtn').css({'background-image' : 'url(addon-player/myVideoCheckedBox.png)'});
			}
		}
		var spo = 'set-playback-option&playall=' + playbackOption.playall + '&repeat=' + playbackOption.repeat + '&';
		$.ajax({
			url: 'http://127.0.0.1:54321/?v=' + spo,
			async: true
		});
	}
});