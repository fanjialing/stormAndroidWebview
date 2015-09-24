var Toast = function() {
};

Toast.prototype.longToast = function(message) {
	message = (message == null || message == undefined) ? '' : message;
	return cordova.exec(null, null, 'Toast', 'longToast', [message], false);
};

Toast.prototype.shortToast = function(message){
	message = (message == null || message == undefined) ? '' : message;
	cordova.exec(function(datas){
		alert('error:'+datas);
	}, function(d){
		alert('success:'+d);
	}, 'Toast', 'shortToast', [message], true);
	
};
if (!window.plugins) {
	window.plugins = {};
}

if (!window.plugins.toast) {
	window.plugins.toast = new Toast();

}

//cordova.addConstructor ???