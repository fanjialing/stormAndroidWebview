var paperId = Number(getQueryString("paperId")==null?"-1":getQueryString("paperId"));
var paperResultId = Number(getQueryString("paperResultId")==null?"-1":getQueryString("paperResultId"));
var employeeId = getQueryString("employeeId")==null?"":getQueryString("employeeId");//做题人ID
var Name = getQueryString("Name")==null?"":getQueryString("Name");
var Company = getQueryString("Company")==null?"":getQueryString("Company");
var loginStatus = Number(getQueryString("loginStatus")==null?"0":getQueryString("loginStatus"));
var CompanyId = getQueryString("CompanyId")==null?"":getQueryString("CompanyId");
var parAllNoId = '?loginStatus='+loginStatus+'&CompanyId='+CompanyId + '&employeeId=' + employeeId+'&Name='+Name+'&Company='+Company+'&paperId='+paperId;
var parAll = parAllNoId+'&paperResultId='+paperResultId;
var reList = [] ;//答题卡答案
$(function(){
	if(employeeId == '' || Name == '' || Company == '')
	{
		confirm_dialog("#confirm","温馨提示","请登记考试信息或者登陆!","","<a href=index.html>确定</a>");
	}
	 ajaxSubmit('paperresults/' + paperResultId+ '?excludeItems=false',{},'get', function (data) {
         $("#paper_score").html(data.score);//考试分数
         var beginTime = new Date(data.startTime);
         var endTime = new Date(data.endTime);
         var useTime = parseInt((endTime.getTime() - beginTime.getTime()) / 1000);
         var useMin = parseInt(useTime / 60);
         var useSec = (useTime % 60).toString();
         $("#paper_useTime").html(useMin + '分' + (useSec.length == 1 ? '0' + useSec : useSec) + '秒');//使用时间
         $("#paper_rank").html(data.rank);//排名
         reList = data.itemResults;
     });
	 
	 $("#exit").click(function(){
		 	confirm_dialog("#confirm","温馨提示","是否确认退出本次考试？","取消","<a href=#>确定</a>",function(result){
		 		if(result){
		 			window.location.href = "channel.html" +  parAll;
		 		}
		 	});	
	 });
	
	 $("#reset").click(function(){
		 	confirm_dialog("#confirm","温馨提示","是否确认重新开始考试？","取消","<a href=#>确定</a>",function(result){
		 		if(result){
            		var nowTime = Date.now().valueOf();
                    var postData = [{
                        employeeId: employeeId,
                        paperId: paperId,
                        startTime: nowTime,
                        endTime: nowTime,
                        score: 0,
                        isValid:0,
                        userName:Name,
                        company:Company,
                        itemResults: []
                    }];
                    ajaxSubmit('paperresults/jsonArray',JSON.stringify(postData), 'post', function (data) {
                    	if(data.length>0){
                    		window.location.href = 'start.html'+parAllNoId + '&a=1&paperResultId='+data[0].id;	
                    	}
                    	else{
                    		confirm_dialog2("#confirm","温馨提示","创建考试失败,已达到该试卷的最大考试次数,无法重新考试","确定","<a href=#>确定</a>") ;
                    	} 
                    });
            	}
		 	});	
	 });
	 
	$("#dtk_but").click(function(){
		$("html,body").css("overflow","hidden");
		$("html,body").css("height","100%");
		$('html,body').animate({scrollTop: '0px'}, 100);
		$("#mask").show();
		$('#mask').on("touchmove",function(e){  
			e.stopPropagation();
		});
		
		initAnswerPage();
		
		$("#dtklist li").each(function(){
			var id = $(this).children("a").attr("value") ;
			var flag =false ;
			for (var i = 0; i < reList.length; i++) {
				flag = false ;
				if(i==id){
					//已答题
					if(reList[i].answer.length>0 && reList[i].answer!="0"){
						flag = true ;
						$(this).removeClass() ;
						$(this).addClass("green") ;
						//对错
						if(reList[i].score > 0){
							$(this).children("div").addClass("right") ;
						}else{
							if(reList[i].answer.length>0){
								$(this).removeClass("green") ;
								$(this).addClass("red") ;
								$(this).children("div").addClass("error") ;
								
							}
						}
					}
					//是否标记
					if(reList[i].isMark==1){
						$(this).children("div").removeClass() ;
						if(flag){
							$(this).children("div").addClass("biaoji") ;
						}else{
							$(this).children("div").addClass("biaoji-grey") ;
						}
					}
				}
			}
		}) ;
	});
	//查看试卷
	$("#look_paper").click(function(){
		window.location.href = "start.html"+parAll ;
	}) ;
	
	//排行榜
	$("#sort_but").click(function(){
		window.location.href = "sort.html"+parAll +'&r=1';
	})
	
	//关闭答题卡
	$("#close").click(function(){
		$("body").css("overflow","scroll");
		$("#mask").hide();
	});
	//初始化答题卡
	function initAnswerPage(){
		var str = '' ;
		for (var i = 0; i < reList.length; i++) {
			str += '<li class="grey"><div></div><a href="javascript:void(0)"  value='+i+'>'+(i+1)+'</a></li>' 
		}
		$("#dtklist").html(str) ;
	}
	
})