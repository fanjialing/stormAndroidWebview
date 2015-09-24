//参数获取
var paperId = Number(getQueryString("paperId") == null ? "-1"
		: getQueryString("paperId"));// 试卷ID
var employeeId = getQueryString("employeeId") == null ? ""
		: getQueryString("employeeId");// 做题人ID
var Name = getQueryString("Name") == null ? "" : getQueryString("Name");
var Company = getQueryString("Company") == null ? ""
		: getQueryString("Company");
var loginStatus = Number(getQueryString("loginStatus") == null ? "0"
		: getQueryString("loginStatus"));
var CompanyId = getQueryString("CompanyId") == null ? ""
		: getQueryString("CompanyId");
var parAllNoId = '?loginStatus=' + loginStatus + '&CompanyId=' + CompanyId
		+ '&employeeId=' + employeeId + '&Name=' + Name + '&Company=' + Company;
var parAll = parAllNoId + '&paperId=' + paperId;
var jsonobj = {
	json : JSON.stringify({
		"paperId" : paperId,
		"employeeId" : employeeId
	}),
	excludeItems : true
};
$(function() {
	// 判断登录信息

	if (employeeId == '' || Name == '' || Company == '') {
		confirm_dialog2("#confirm", "温馨提示", "请登记考试信息或者登陆!", "<a href=#>确定</a>",
				function(result) {
					if (result) {
						window.location.href = 'index.html';
					}
				});
	}

	// 获取试卷基本信息
	ajaxSubmit('papers/' + paperId + '?excludeItems=true', {}, 'get',
			function(data) {
				$("#paper_title").html(data.title);// 标题
				var endTime = new Date(data.endTime);
				var startTime = new Date(data.startTime);
				var state = "start";
				var now = Date.now();
				if (startTime > now) {
					state = 'nostart';
					confirm_dialog2("#confirm", "温馨提示", "当前试卷未开始,无法开始答题",
							"<a href=#>确定</a>", function(result) {
								if (result) {
									window.location.href = 'list.html'
											+ parAllNoId;
								}
							});
					$("#btn_begin").attr("disabled", "true");
				} else {
					if (endTime < now) {
						state = 'stop';
						confirm_dialog2("#confirm", "温馨提示", "当前试卷已结束,无法开始答题",
								"<a href=#>确定</a>", function(result) {
									if (result) {
										window.location.href = 'list.html'
												+ parAllNoId;
									}
								});
						$("#btn_begin").attr("disabled", "true");
					}
				}
				$("#paper_state").addClass(state);// 是否在进行中
				$("#paper_type").html(data.paperType);// 试卷类型
				$("#paper_joinNum").html(data.totalCandidatesCount);// 参考人数
				$("#paper_qCount").html(data.totalItemsCount);// 总题数
				$("#paper_qScore").html(data.totalScore);// 总分数
				$("#paper_qTime").html(data.timeLimit);// 答题时间
				$("#paper_po1").text(data.policy);// 规则
			});
	// 获取考生考试信息
	ajaxSubmit('paperresults', {
		json : JSON.stringify({
			"paperId" : paperId,
			"employeeId" : employeeId
		}),
		excludeItems : true
	}, 'get', function(data) {
		console.log(data)
		
		if (data.length > 0 && data[0].isValid == "1") {
			$("#isPaper1").html(
					'亲~您的历史最高分是：<b class="c03">&nbsp;'
							+ data[0].historyBestScore
							+ '&nbsp;</b>分，排名第<b class="c08">&nbsp;'
							+ data[0].historyBestRank
							+ '&nbsp;</b>位，赶快来"<a href="start.html' + parAll
							+ '&paperResultId=' + data[0].id
							+ '" style="color:red;">温习</a>"一下吧!');
			$("#btn_begin").text("重新考试");
		} else {
			$("#isPaper1").html('您还未参与该试卷,点击下面的"开始答题"按钮参与考试吧。');
		}
	});

	// 点击开始答题
	$("#btn_begin").click(
			function() {
				var nowTime = Date.now().valueOf();
				var postData = [ {
					employeeId : employeeId,
					paperId : paperId,
					startTime : nowTime,
					endTime : nowTime,
					score : 0,
					isValid : 0,
					userName : Name,
					company : Company,
					itemResults : []
				} ];
				// 获取答题状态
				ajaxSubmit('paperresults/jsonArray', JSON.stringify(postData),
						'post', function(data) {
							if (data.length > 0) {
								location = 'start.html' + parAll
										+ '&a=1&paperResultId=' + data[0].id;
							} else {
								confirm_dialog2("#confirm","温馨提示","创建考试失败,已达到该试卷的最大考试次数,无法重新考试","确定","<a href=#>确定</a>") ;
							}
						});

			})

	// 排行榜
	$("#sort_but").click(function() {
		window.location.href = "sort.html" + parAll;
	})
})