var toastButtonHandler = function(e){
	window.plugins.toast.shortToast('Here\'s to you!');
}

var cordovaButtonHandler = function(){
	var message = 'Cordova version: ' + device.cordova;
	message += '\nDevice Model: ' + device.model;
	message += '\nDevice Version (Android): ' + device.version;
	alert(message);
}

var openLink = function(){
	var url = "https://www.baidu.com"
	window.plugins.toast.shortToast("To open link in system browser, try adapting WebIntent plugin")
	window.open(url)
}