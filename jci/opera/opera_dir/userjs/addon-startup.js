var enableSpeedometer = true;
var enablePlayer = true;


// try not to make changes to the lines below
function addonInit(){
	$.ajax({
		url: 'addon-common/addon-common.html',
		success: function (data) {
			$("body").append(data);
			
			if(enableSpeedometer){
				$.ajax({
					url: 'addon-speedometer/addon-speedometer.html',
					success: function (data) {
						$("body").append(data);
					}
				});
			}
			
			if(enablePlayer){
				$.ajax({
					url: 'addon-player/addon-player.html',
					success: function (data) {
						$("body").append(data);
					}
				});
			}
		}
	});
}

(function () {
	window.opera.addEventListener("AfterEvent.load", function (e) {
		if (!document.getElementById("jquery-script")) {
			var docBody = document.getElementsByTagName("body")[0];
			if (docBody) {
				var script = document.createElement("script");
				script.setAttribute("id", "jquery-script");
				script.setAttribute("src", "addon-common/jquery.min.js");
				script.addEventListener('load', function () {
					addonInit();
				}, false);
				docBody.appendChild(script);
			}
		}
	});
})();