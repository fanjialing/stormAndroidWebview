// JavaScript Document

$(function(){
	var html = '<div id="BgDiv1"></div><div class="DialogDiv"  id="DialogDiv" style="display:none"><div class="U-guodu-box"><div><table width="100%" cellpadding="0" cellspacing="0" border="0" ><tr><td  align="center"><img src="load/img/loading.gif"></td></tr><tr><td  valign="middle" align="center" >加载中，请稍后！</td></tr></table></div></div></div>' ;
	
	$("#load").html(html);;
})

function loadShow(){
	 $("#BgDiv1").css({
			display : "block",
			height : $(document).height() - 65 
		});
		var yscroll = document.documentElement.scrollTop;
		var screenx = $(window).width();
		var screeny = $(window).height();
		$(".DialogDiv").css("display", "block");
		$(".DialogDiv").css("top", yscroll + "px");
		var DialogDiv_width = $(".DialogDiv").width();
		var DialogDiv_height = $(".DialogDiv").height();
		$(".DialogDiv").css("left", (screenx / 2 - DialogDiv_width / 2) + "px") ;
		$(".DialogDiv").css("top", (screeny / 2 - DialogDiv_height / 2) + "px") ;
		$("body").css("overflow", "hidden"); 
	
 }

function loadHide(){
	$("#BgDiv1").hide() ;
	$("#DialogDiv").hide();
}
