	var paperResultId = Number(getQueryString("paperResultId")==null?"-1":getQueryString("paperResultId"));
	var paperId = Number(getQueryString("paperId")==null?"":getQueryString("paperId"));
	var employeeId = getQueryString("employeeId") == null?"":getQueryString("employeeId");//做题人ID
	var CompanyId = getQueryString("CompanyId")==null?"":getQueryString("CompanyId");
	var isAnswer = getQueryString("a") == 1 ? true : false;//判断当前是否正在答题,通过传递的参数判断
	var isAnswerPage = true//判断当前为答题页
	var q_index = 0;//当前题
	var q_count = 2;//总题数
	var q_time = 10;//考试时间,单位s
	var q_index_id = '#txt_q_index';
	var setTimeInterval = null;//timer Interval
	var qList = [];//题目数组
	var resultList ;//答题数组
	var resultList2 = [];//答题数组
	var isCheckBox = true;//是否多选题
	var isMark = 0;//是否标记
	var onResult = null;//当前的result
	var onResultIndex=0;//当前的result在数组中的位置
	var markOk = '#q_markOk';
	var markCancel = '#q_markCancel';
	var Name = getQueryString("Name")==null?"":getQueryString("Name");
	var Company = getQueryString("Company")==null?"":getQueryString("Company");
	var loginStatus = Number(getQueryString("loginStatus")==null?"0":getQueryString("loginStatus"));
	var loginUrl = '?loginStatus='+loginStatus+'&CompanyId='+CompanyId + '&employeeId=' + employeeId+'&Name='+Name+'&Company='+Company;
	var parAllNoId = '?loginStatus='+loginStatus+'&CompanyId='+CompanyId + '&employeeId=' + employeeId+'&Name='+Name+'&Company='+Company+'&paperId='+paperId;
	var parAll = parAllNoId+'&paperResultId='+paperResultId;
	$(function(){
		if(employeeId == '' || Name == '' || Company == '')
		{
			confirm_dialog("#confirm","温馨提示","请登记考试信息或者登陆!","","<a href=index.html>确定</a>");
			//alert("请登记考试信息或者登陆!");
			//window.location.href = 'index.html'+loginUrl; 
		}
		//获取答题内容
		ajaxSubmit('papers/' + paperId + '?excludeItems=false',{},'get',function(data) {
			qList = data.items;
			q_count = qList.length;
			resultList = new Array(q_count) ;
			q_time = data.timeLimit * 60;
			q_index = 0;
			$("#txt_q_count").html(q_count);//总题目数
			$("#title").html(data.title) ;
			if(qList==0){
				confirm_dialog("#confirm","温馨提示","试卷信息错误，请重新加载...","","<a href=index.html"+loginUrl+">确定</a>");
				//alert("试卷加载错误,请重新加载...") ;
			}
			
			initPage() ;
			
			//计时器
			timer(q_time) ;
			//设置问题
			setNewQuestion(qList[q_index],q_index) ;
			//设置答案选项
			
			setContentClick();
			//初始化标记状态
			initBadge(q_index) ;
			//标记
			setBadge() ;
			//设置按钮
			setButton(q_index,q_count-1) ;
			
			//上一题
			$("#prev").click(function(){
				if(q_index==0){
					return ;
				}
				//提交当前题目答案
				submitAnswer(q_index) ;
				q_index-- ;
				$("#txt_q_index").text(q_index+1) ;
				setNewQuestion(qList[q_index],q_index) ; //设置下一题
				setButton(q_index,q_count-1) ; //设置按钮
				setContentClick() ; //设置选项内容
				getResult(q_index) ; //获取当前题答案
				initBadge(q_index) ; //初始化标记
			})
			//下一题
			$("#next").click(function(){
				if(q_index==q_count-1){
					return ;
				}
				//提交当前题目答案
				submitAnswer(q_index) ;
				q_index++ ;
				$("#txt_q_index").text(q_index+1) ;
				setNewQuestion(qList[q_index],q_index) ; //设置下一题
				setButton(q_index,q_count-1) ; //设置按钮
				setContentClick() ; //设置选项内容
				getResult(q_index) ; //获取当前题答案
				initBadge(q_index) ;//初始化标记
			})
		}) ;
		
		//退出按钮
		$("#exit").click(function(){
			//答题模式
			if(isAnswer){
				$("#jiaojuan").click() ;
			}
			//查看模式
			else
			{
				 confirm_dialog("#confirm","温馨提示","是否确认退出查看试卷？","取消","<a href=#>确定</a>",function(result){
                 	if(result){
     					window.location.href = 'channel.html'+parAll ;
     				}
				 }) ;
			}
			
		})
		
		//答题卡
		$("#dtk_but").click(function(){
			disable_scroll();
			$("html,body").css("overflow","hidden");
			$("html,body").css("height","100%");
			$("#mask").show();
			$('#dtklist').on("touchmove",function(e){  
					 e.stopPropagation();
			});
			
			//初始化答题卡
			initAnswerPage(q_index) ;
			//正在答题
			if(isAnswer){
				$("#dtklist li").each(function(){
					var id = $(this).children("a").attr("value") ;
					var flag =false ;
					for (var i = 0; i < resultList.length; i++) {
						if(!resultList[i]){
							continue ;
						}
						flag = false ;
						var ind =  resultList[i].index ;
						if(ind==id){
							//已答题
							if(resultList[i].chose.length>0){
								flag = true ;
								$(this).removeClass() ;
								$(this).addClass("green") ;
							}
							//是否标记
							if(resultList[i].ismark==1){
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
			}
			//查看状态
			if(!isAnswer){
				$("#dtklist li").each(function(){
					var id = $(this).children("a").attr("value") ;
					var flag =false ;
					for (var i = 0; i < resultList2.length; i++) {
						flag = false ;
						if(i==id){
							//已答题
							if(resultList2[i].answer.length>0 && resultList2[i].answer!="0"){
								flag = true ;
								$(this).removeClass() ;
								$(this).addClass("green") ;
								//对错
								if(resultList2[i].score > 0){
									$(this).children("div").addClass("right") ;
								}else{
									if(resultList2[i].answer.length>0 && resultList2[i].answer){
										$(this).removeClass("green") ;
										$(this).addClass("red") ;
										$(this).children("div").addClass("error") ;
										
									}
								}
							}
							//是否标记
							if(resultList2[i].isMark==1){
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
			}
			toPage() ;
		});
		$("#close").click(function(){
			CloseDiv();
			$("html,body").css("overflow","auto");
			$("html,body").css("height","auto");
			$("#mask").hide();
		});
		
		//答题卡点击题目跳转
		function toPage(){
			$("#dtklist a").click(function(){
				q_index = parseInt($(this).attr("value")) ;
				$("#close").click() ;
				$("#txt_q_index").text(q_index+1) ;
				setNewQuestion(qList[q_index],q_index) ; //设置下一题
				setButton(q_index,q_count-1) ; //设置按钮
				setContentClick() ; //设置选项内容
				getResult(q_index) ; //获取当前题答案
				initBadge(q_index) ;//初始化标记
			})
		}
		
		//交卷
		$("#jiaojuan").click(function(){
			var count = qList.length ;
			if(resultList.length>0){
				for (var i = 0; i < resultList.length; i++) {
					if(resultList[i]){
						if(resultList[i].chose.length>=0){
							count-- ;
						}
					}
				}
			}
			if(q_index==qList.length-1){
				submitAnswer(q_index) ;
			}
			var msg = "" ;
			if(count == 0){
				msg = "是否确认提交答题卡？" ;
			}else{
				msg = "您还有"+count+"道题目未完成！是否确认提交答题卡？" ;
			}
			confirm_dialog("#confirm","温馨提示",msg,"取消","<a href='javascript:void(0)'>确定</a>",function(result){
				if(result){
					var postData=JSON.stringify({"id":paperResultId});
					ajaxSubmit('paperresults/'+paperResultId,postData,'post',function(data){
						window.location.href = 'end.html'+parAll;
					});
				}
			});
		});
		
		if(!isAnswer){
			//获取paperresult
			ajaxSubmit('paperresults/' + paperResultId+ '?excludeItems=false',{},'get',function(data) {
				//如果存在paperresult
				resultList2 = data.itemResults;
			}) ;
			
		}
		
	})
	
	
	//初始化页面信息
	function initPage(){
		if(isAnswer){
			$("#bj").css("display",'inline-block')
			$("#timer").css("display",'block')
		}
	}
	
	
	//初始化答题卡
	function initAnswerPage(index){
		if(qList.length==0){
			return ;
		}
		var str = '' ;
		for (var i = 0; i < qList.length; i++) {
			if(i==index){
				str += '<li class="orange"><div class=""></div><a href="javascript:void(0)"  itemid='+qList[i].id+' value='+i+'>'+(i+1)+'</a></li>' 
			}else{
				str += '<li class="grey"><div></div><a href="javascript:void(0)" itemid='+qList[i].id+'  value='+i+'>'+(i+1)+'</a></li>' 
			}
		}
		$("#dtklist").html(str) ;
	}
	
	//设置内容选项
	function setContentClick(){
		if(!isAnswer){
			for (var i = 0; i < resultList2.length; i++) {
				if(resultList2[i].itemId == qList[q_index].id){
					var q_answer = qList[q_index].answer ;
					var re_answer = resultList2[i].answer ;
					if(isCheckBox){
						q_answer = q_answer,split(",") ;
						for (var j = 0; j < q_answer.length; j++) {
							$("#content li").each(function(){
								if($(this).attr("oid") == q_answer[j]){
									$(this).addClass("right") ;
									$(this).children("div").addClass("right") ;
								}
							});
						}
						for (var x = 0; x < re_answer.length; x++) {
							if($(this).attr("oid") == re_answer[x]){
								if(!$(this).hasClass("right")){
									$(this).addClass("error") ;
									$(this).children("div").addClass("error") ;
									
								}
							}
						}
						
						re_answer = re_answer.split(",")
					}else{
						$("#content li").each(function(){
							if($(this).attr("oid") == q_answer){
								$(this).addClass("right") ;
								$(this).children("div").addClass("right") ;
							}
							if(q_answer != re_answer){
								if($(this).attr("oid") == re_answer){
									$(this).addClass("error") ;
									$(this).children("div").addClass("error") ;
								}
							}
						});
					}
					var dd_class = 'right' ;
					if(q_answer != re_answer ){
						dd_class = 'error' ;
					}
					if(re_answer == "0"){
						re_answer = "" ;
					}
					var str = "<dd>参考答案为   <span class='right'>" +q_answer +"</span></dd>";
					str += "<dd>我的答案为   <span class="+dd_class+">" +re_answer +"</span></dd>";
					$("#content").append(str) ;
				}
			} 
			return ;
		}
		$("#content li").click(function(){
			if(isCheckBox){
				if($(this).hasClass("right")){
					$(this).addClass("right")
				}
			}else{
				$("#content li").each(function(){
					$(this).removeClass('right');
				})
				$(this).addClass("right")
			}
			setResult(q_index) ; //设置当前题目答案
		})
	}
	
	
	
	function timer(intDiff){
		intDiff = intDiff-1 ;
		if(!isAnswer){
			return ;
		}
		window.setInterval(function(){
			var day=0,
				hour=0,
				minute=0,
				second=0;//时间默认值		
			if(intDiff > 0){
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			//$('#day_show').html(day+"天");
			$('#hour_show').html('<s id="h"></s>'+hour+'时');
			$('#minute_show').html('<s></s>'+minute+'分');
			$('#second_show').html('<s></s>'+second+'秒');
			intDiff--;
			if(intDiff == 0){
				//时间到了默认提交
				$("#jiaojuan").click() ;
			}
		}, 1000);
	}
	//设置问题
	function setNewQuestion(question,index){
		var typeTitle = "" ;
		switch (question.itemType.toLowerCase()) {
		case "radio": {
			isCheckBox = false;
			typeTitle = "单选题";
		} ;
			break;
		case "checkbox": {
			isCheckBox = true;
			typeTitle = "多选题";
		} ;
			break;
		case "YesOrNo": {
			isCheckBox = false;
			typeTitle = "判断题";
		} ;
			break;
		default: {
			isCheckBox = false;
			typeTitle = "判断题";
		} ;
			break;
		}
		
		$("#titletype").text(typeTitle+" : ");
		$("#question").text(question.title) ;
		//设置问题答案
		var options = question.itemOptions ;
		var item = '' ;// 问题答案
		var serial = '';//题字母序号
		if(options.length==0){
			items = "<li>抱歉,该题未找到题项！请选择其它题！</li>";
		}
		$.each(options, function(index, data) {
			serial = String.fromCharCode(65 + index);
			item += '<li oid="'+serial+'" itemid='+data.id+'>' ;
			item += '<div></div>'
			item += '<a >' +serial +'. '+ data.content + '</a>' ;
			item += '</li>' ;
		})
		$("#content").html(item) ;
	}
	
	//设置按钮
	function setButton(index,count){
		$("#prev").addClass("enabled") ;
		$("#next").addClass("enabled") ;
		if(index==0){
			$("#prev").removeClass("enabled")
			$("#prev").addClass("disabled")
			$("#prev").attr("disabled","true")
		}
		if(index==count){
			$("#next").removeClass("enabled")
			$("#next").addClass("disabled")
			$("#next").attr("disabled","true")
		}
		//设置交卷按钮
		if(isAnswer){
			$("#jiaojuan").css('display','block') ;
		}
	}
	
	//初始化标记
	function initBadge(index){
		if(!isAnswer){
			return ;
		}
		isMark = 0
		if(resultList[index]){
			isMark = resultList[index].ismark ;
		}
		if(isMark==1){
			$("#bj small").addClass("bj1") ;
			$("#bj small").removeClass("bj0") ;
			$("#bj span").text("取消标记") ;
		}else{
			$("#bj small").addClass("bj0") ;
			$("#bj small").removeClass("bj1") ;
			$("#bj span").text("标记该题") ;
		}
	}
	
	//标记
	function setBadge(){
		if(!isAnswer){
			return ;
		}
		$("#bj").click(function(){
			//设置标记点击事件
			isMark=(isMark==0?1:0);
			if(isMark==1){
				$("#bj small").addClass("bj1") ;
				$("#bj small").removeClass("bj0") ;
				$("#bj span").text("取消标记") ;
			}else{
				$("#bj small").addClass("bj0") ;
				$("#bj small").removeClass("bj1") ;
				$("#bj span").text("标记该题") ;
			}
			setResult(q_index) ;
		})
		
	}
	
	//设置答案结果
	function setResult(index){
		var chose = "" ;
		$("#content li").each(function(){
			if($(this).hasClass("right")){
				chose += $(this).attr("oid")+"," ;
			}
		}) ;
		if(chose.length>0){
			chose = chose.substring(0,chose.length-1) ;
		}
		var result = {'index':index,'chose':chose,'ismark':isMark}
		resultList[index] = result ;
	}
	
	//获取当前答案
	function getResult(index){
		if(resultList.length==0){
			return ;
		}
		//循环该题
		if(!resultList[index]){
			return ;
		}
		if(resultList[index].index == index){
			var chose = resultList[index].chose ;
			var choses = chose.split(",")
			for (var j = 0; j < choses.length; j++) {
				$("#content li").each(function(){
					if($(this).attr("oid") == choses[j])
						$(this).addClass("right") ;
				})
			}
		}
	}
	
	//答案提交
	function submitAnswer(index){
		if(!isAnswer){
			return ;
		}
		if(!resultList[index]){
			return ;
		}
		var onItem = qList[index];//获取当前题
		var itemId = onItem.id ;
		var answer = resultList[index].chose ;
		//如果有答案则提交
		if(!answer){
			answer = "0" ;
		}
		ajaxSubmit('itemresults/'+paperResultId+'/'+itemId+'/'+isMark+'/'+answer,{}, 'put', function(data){})
			
		
	}
	
	
	
	function disable_scroll() {
		$("body").on('touchmove', prevent_default);
	}
		
	function ShowDiv(){
		window.ontouchmove=function(e){
			e.preventDefault && e.preventDefault();
			e.returnValue=false;
			e.stopPropagation && e.stopPropagation();
			return false;
	  }           
	};
	function CloseDiv()
	{
		window.ontouchmove=function(e){
			e.preventDefault && e.preventDefault();
			e.returnValue=true;
			e.stopPropagation && e.stopPropagation();
			return true;
		}

	};
	function prevent_default(e) {
		e.preventDefault();
	}
	