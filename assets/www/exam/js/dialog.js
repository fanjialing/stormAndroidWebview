//仿confirm
var confirm_dialog = function(dom,title,prompt_con,but_title1,but_title2,confirmFun){
	var strhtml='<div class="dialog" id="confirm"><div class="window"><div class="content"><div class="tc fc-000 f18 mt10">'+title+'</div><div class="ov_auto"><p>'+prompt_con+'</p></div></div><div class="but"><div class="quxiao fl img-40">'+but_title1+'</div><div class="quding fr img-40" val="1" >'+but_title2+'</div></div></div></div>';
	$('body').append(strhtml);
	var dom=$(dom);
	var Boo=false;
	dom.find(".quxiao").html(but_title1);
	dom.find(".quding").html(but_title2);
	dom.fadeIn(200);
	dom.find(".xian").text(title);
	dom.find(".ov_auto").children("p").html(prompt_con);
	dom.find(".quxiao").click(function(){
		dom.hide();	
		$('#confirm').remove();
	});
	dom.find(".quding").click(function(){
		
    	var val = Boolean($(".quding").attr('val'));
		if($.isFunction(confirmFun)){
			confirmFun(val);
		}
		dom.hide();	
		$('#confirm').remove();
		
	});
}

var confirm_dialog2 = function(dom,title,prompt_con,but_title,confirmFun){
	var strhtml='<div class="dialog" id="confirm"><div class="window"><div class="content"><div class="tc fc-000 f18 mt10">'+title+'</div><div class="ov_auto"><p>'+prompt_con+'</p></div></div><div class="alert"><div class="quding2 fl img-40">'+but_title+'</div></div></div></div>';
	$('body').append(strhtml);
	var dom=$(dom);
	var Boo=false;
	dom.find(".quding2").html(but_title);
	dom.fadeIn(200);
	dom.find(".xian").text(title);
	dom.find(".ov_auto").children("p").html(prompt_con);
	dom.find(".quding2").click(function(){
    	var val = Boolean($(".quding2").attr('val'));
		if($.isFunction(confirmFun)){
			confirmFun(val);
		}
		dom.hide();	
		$('#confirm').remove();
		
	});
}
