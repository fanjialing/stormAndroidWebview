var paperId = Number(getQueryString("paperId")==null?"-1":getQueryString("paperId"));
var paperResultId = Number(getQueryString("paperResultId")==null?"-1":getQueryString("paperResultId"));
var employeeId = getQueryString("employeeId")==null?"":getQueryString("employeeId");//做题人ID
var Name = getQueryString("Name")==null?"":getQueryString("Name");
var Company = getQueryString("Company")==null?"":getQueryString("Company");
var CompanyId = getQueryString("CompanyId")==null?"":getQueryString("CompanyId");
var loginStatus = Number(getQueryString("loginStatus")==null?"0":getQueryString("loginStatus"));
var baseBavkUrl = '?loginStatus='+loginStatus+'&paperId='+paperId+'&employeeId='+employeeId+'&CompanyId='+CompanyId;
var backUrl = getQueryString("r") == 1 ? ('end.html'+baseBavkUrl+'&paperResultId='+paperResultId) : ('channel.html'+baseBavkUrl);
$(function(){
	
	if(employeeId == '' || Name == '' || Company == '')
	{
		confirm_dialog("#confirm","温馨提示","请登记考试信息或者登陆!","","<a href=index.html>确定</a>");
	}
	
	$("#break").click(function(){
		window.location.href = backUrl+'&Name='+Name+'&Company='+Company;
	}) ;
	
	var jsonobj ={ json:JSON.stringify({"paperId":paperId,"employeeId":employeeId}),excludeItems:true};
    ajaxSubmit('paperresults',jsonobj,'get', function (data) {
    	if(data.length>0)
        {
        	$("#paper_rank").html(data[0].historyBestRank);//排名
        	$("#paper_score").html(data[0].historyBestScore); //分数
        }else{
        	$("#sort h4").text("该试卷您未参考过,暂无排名！");
        }
    }) ;
    
    ajaxSubmit('papers/' + paperId + '?excludeItems=false',{},'get', function (data) {
           $("#paper_title").html(data.title);//标题
    });
    
    var jsonobj2 ={ json:JSON.stringify({"paperId":paperId}),excludeItems:true};
    ajaxSubmit('paperresults',jsonobj2,'get', function (data) {
    	var rankList = '';
		var isMobile = /^1[3-8][0-9]\d{4,8}$/; //手机号码验证规则
		var trueName = "";
        $.each(data,function(index,obj){
			trueName = (obj.userName!=null?obj.userName:"");
			trueName = trueName.length>8?trueName.substring(0,6)+"..":trueName;
        	rankList+='<li>';
        	rankList+='<a href="#">';
        	rankList+='<div class="icon"><span>'+(index+1)+'</span></div>';
        	rankList+='<div class="img"><img src="images/img.jpg"></div>';
        	rankList+='<div class="right">';
        	rankList+='<p><span class="fc-green f18">'+trueName+'</span><span class="fc-title-grey f18 pl10">'+(obj.company!=null?obj.company:'')+'</span></p>';
        	rankList+='<p class="pt5">'+obj.score +'  '+setUseTime(obj) +'</p>';
        	rankList+='</div>';
        	rankList+='</a>';
        	rankList+='</li>';
		});
        if(rankList == ''){
        	rankList = '<li>还没有用户参考该试卷!</li>' ;
        }
        $("#sortlist").html(rankList) ;
    })
    
    function setUseTime(data){
        var beginTime = new Date(data.startTime);
        var endTime = new Date(data.endTime);
        var useTime = parseInt((endTime.getTime() - beginTime.getTime()) / 1000);
        var useMin = parseInt(useTime / 60);
        var useSec = (useTime % 60).toString();
        return useMin+'分'+useSec+'秒';
    }
})