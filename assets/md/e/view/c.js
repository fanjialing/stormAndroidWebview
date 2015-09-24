
var url_ip_port = 'http://'+ip+':'+port;
//获取jpg的wadoUrl
var wadoImgUrl = url_ip_port+'/wado?requestType=WADO';
//获取序列的wadoUrl
var wadoUrl = url_ip_port+'/wado?requestType=WADO';	
//获取第一张图片显示的wadoUrl
var wadoUrl_f = url_ip_port+'/wado?requestType=WADO';
var length;
var num;
var count = 0;
var showNum = 0;

/*
$(function(){
	
	//请求 patients 获取 检查ID
	$.ajax(
	{
		type     : 'GET',
		url      : url_ip_port+'/patients/'+pid,
		async    : false,
		cache    : false,
		dataType : 'json',
		success  : OnPatientsJson_Success,
		error    : OnError
	});

	
	// 获取每个序列ID
	$("ul li").click(function(){
		  count = 0;
		OnInstancesJson_Success($(this).next().val(),count);
		$("#left-panel" ).popup('close');
	});
	


	
});
*/




function start(){
	goView("http://192.168.0.11:8080/dicom3.0/dcm/CT.dcm");
}


//相应事件 通过 检查ID 获取 序列ID
  function OnPatientsJson_Success(data){
    
    	wadoUrl_f = wadoUrl_f+'&studyUID=' + data.Studies[0];
    	
    	//请求第一个检查ID的第一个序列的第一张图
  		$.ajax(
		{
			type     : 'GET',
			url      : url_ip_port+'/studies/'+ data.Studies[0],
			async    : false,
			cache    : false,
			dataType : 'json',
			success  : OnStudiesJson_Success_f,
			error    : OnError
		});
  		
  		
  		   
			 for (var i = 0; i < data.Studies.length; i++)
  			 {
				 		GetStudiesJson(data.Studies[i])
			 }
  }
  
  
  
  function GetStudiesJson(Studies)
{
	wadoImgUrl = wadoImgUrl+'&studyUID=' + Studies;
	$.ajax(
	{
		type     : 'GET',
		url      : url_ip_port+'/studies/'+ Studies,
		async    : false,
		cache    : false,
		dataType : 'json',
		success  : OnStudiesJson_Success,
		error    : OnError
		});
}
  

  function OnStudiesJson_Success(data)
{	
	
	for (var i =0 ; i <data.Series.length; i++)
  {		
		var series=data.Series[i]
			$.ajax(
			{
			type     : 'GET',
			url      : url_ip_port+'/series/' + data.Series[i],
			async    : false,
			cache    : false,
			dataType : 'json',
			success  : function(back) { 
			wadoImgUrl=wadoImgUrl+'&seriesUID='+series+'&objectUID='+back["Instances"][0]+'&contentType=image/jpg&columns=50';
					$("#uid").append('<li   data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="a" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-corner-top ui-corner-bottom ui-li-last ui-btn-up-a"><div class="ui-btn-inner ui-li ui-corner-top"><div class="ui-btn-text"><a href="#" class="ui-link-inherit"><img src="'+wadoImgUrl+'" class="ui-li-thumb ui-corner-tl ui-corner-bl"><h2 class="ui-li-heading" >'+series+'</h2><p class="ui-li-desc">count <span style="color:red">'+back["Instances"].length+'</span> page</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
					$("#uid").append('<input type="hidden" value="'+series+'" />');
				
			}
			
			});

		}
	}
	

	
	//第一次加载显示图片
  function OnStudiesJson_Success_f(data)
{	
	$("#dicomImage").remove();
	$("#topleft").remove();
	$("#topleft2").remove();
	$("#topleft3").remove();
	$("#topleft4").remove();
 	$("#topright").remove();
 	$("#topright2").remove();
 	$("#bottomright").remove();
 	$("#bottomleft").remove();
 	$("#bottomleft2").remove();
 	showNum = 0;
			$.ajax(
			{
			type     : 'GET',
			url      : url_ip_port+'/series/' + data.Series[0],
			async    : false,
			cache    : false,
			dataType : 'json',
			success  : function(back) { 
				 num = count+1;
				 length =back["Instances"].length;
			wadoUrl_f=wadoUrl_f+'&seriesUID='+data.Series[0]+'&objectUID='+back["Instances"][count]+'&contentType=application%2Fdicom&transferSyntax=1.2.840.10008.1.2.1';
			$("#viewerPage").append("<div id='dicomImage' style='width:100%;height:100%;top:0px;left:0px; position:absolute'></div>");               

     		
     		//向左滑动 下一张
        	$("#dicomImage").bind("swipeleft",function(){
        	  if(length-1 == count)return;
        		count =count+1;
        		OnInstancesJson_Success(data.Series[0],count);
        	
            });
        	
        	
        	//向右滑动 上一张
        	$("#dicomImage").bind("swiperight",function(){
        		if(count == 0)return;
        		
        		count = count-1;
        		OnInstancesJson_Success(data.Series[0],count);
        	});
     		
     		var element = $('#dicomImage').get(0);
			Hammer.plugins.fakeMultitouch();
      		cornerstone.enable(element);
      		cornerstoneTools.touchInput.enable(element);
     		downloadAndView(wadoUrl_f,element,num,length,data.Series[0]);
     		
			}
		});

	}	
	
	
  function OnInstancesJson_Success(seriesId,count){
  		$.ajax(
			{
			type     : 'GET',
			url      : url_ip_port+'/series/' + seriesId,
			async    : false,
			cache    : false,
			dataType : 'json',
			success  : function(back) { 
					/*				
					for(var i=0;i<back["Instances"].length;i++){
						console.log(wadoUrl+'&studyUID='+back["ParentStudy"]+'&seriesUID='+back["MainDicomTags"].SeriesInstanceUID+'&objectUID='+back["Instances"][i]+'&contentType=application%2Fdicom&transferSyntax=1.2.840.10008.1.2.1');
						goView(wadoUrl+'&studyUID='+back["ParentStudy"]+'&seriesUID='+back["MainDicomTags"].SeriesInstanceUID+'&objectUID='+back["Instances"][i]+'&contentType=application%2Fdicom&transferSyntax=1.2.840.10008.1.2.1')
					}
					*/		
					
					goView(wadoUrl+'&studyUID='+back["ParentStudy"]+'&seriesUID='+back["MainDicomTags"].SeriesInstanceUID+'&objectUID='+back["Instances"][count]+'&contentType=application%2Fdicom&transferSyntax=1.2.840.10008.1.2.1',back["MainDicomTags"].SeriesInstanceUID,back["Instances"].length,count)
			}
			
	});
  }
  
  
  
  
  var Swipeleft  = function(){
	  
  }
  
  var Swiperight  = function(){
	  
  }
  
  
 //显示图片
  function goView(url,seriesId,InstancesLength,count){
	  showNum= 0;
		$("#dicomImage").remove();
		$("#topleft").remove();
		$("#topleft2").remove();
		$("#topleft3").remove();
		$("#topleft4").remove();
	 	$("#topright").remove();
	 	$("#topright2").remove();
	 	$("#bottomright").remove();
	 	$("#bottomleft").remove();
	 	$("#bottomleft2").remove();
      	$("#wwwc").unbind('click');
      	$("#pan").unbind('click');
      	$("#zoom").unbind('click');
      	$("#enableLength").unbind('click');
      	$("#circleroi").unbind('click');
      	$("#Tbtnrotatel").unbind('click');
      	$("#Tbtnrotater").unbind('click');
      	$("#Tbtnfliphori").unbind('click');
      	$("#Tbtnflipver").unbind('click');
      	$("#probe").unbind('click');
      	$("#bone").unbind('click');
      	$("#invert").unbind('click');
      	$("#Reset").unbind('click');
      	$("#show").unbind('click');
		num = count+1;
		length =InstancesLength;
		$("#viewerPage").append("<div id='dicomImage' style='width:100%;height:100%;top:0px;left:0px; position:absolute'></div>");               


    	$("#dicomImage").bind("swipeleft",function(){
    		if(length-1 == count) return;
    		count =count+1;
    		OnInstancesJson_Success(seriesId,count);
        });
    	
    	

    	$("#dicomImage").bind("swiperight",function(){
    		if(count == 0)return;
    			count = count-1;
    			OnInstancesJson_Success(seriesId,count);
    	 });
    	
     	var element = $('#dicomImage').get(0);
     	cornerstone.enable(element);
     	cornerstoneTools.touchInput.enable(element);
     	downloadAndView(url,element,num,length,seriesId);
    	
  }
  

  
  function downloadAndView(path,element,num,length,seriesId)
  {
	 
      cornerstone.loadImage("dicomweb:" + path).then(function(image) {
      cornerstone.displayImage(element, image);
      
      cornerstoneTools.touchInput.enable(element);
      cornerstoneTools.panTouchDrag.enable(element);
      cornerstoneTools.ellipticalroi_Touch.enable(element);
      cornerstoneTools.angleTouch.enable(element);
      cornerstoneTools.rectangleRoiTouch.enable(element);
      cornerstoneTools.lengthTouch.enable(element);
      cornerstoneTools.wwwcTouchDrag.enable(element);
      cornerstoneTools.zoomTouchDrag.enable(element);
      cornerstoneTools.probeTouch.enable(element);
      
      function disableAllTools()
      {
      	$("#dicomImage").unbind("swiperight");
      	$("#dicomImage").unbind("swipeleft");
      cornerstoneTools.panTouchDrag.deactivate(element);
      cornerstoneTools.ellipticalroi_Touch.deactivate(element);
      cornerstoneTools.angleTouch.deactivate(element);
      cornerstoneTools.rectangleRoiTouch.deactivate(element);
      cornerstoneTools.lengthTouch.deactivate(element);
      cornerstoneTools.wwwcTouchDrag.deactivate(element);
      cornerstoneTools.zoomTouchDrag.deactivate(element);
      cornerstoneTools.probeTouch.deactivate(element);
      }


      	
          var viewport = cornerstone.getViewport(element);
          viewport.scale += 0.25;
          cornerstone.setViewport(element, viewport);
          
          
              //窗宽窗位
    $("#wwwc").click(function (e){
   		disableAllTools();
        cornerstoneTools.wwwcTouchDrag.activate(element);
    	$( "#popupPanel" ).popup('close');
    		
    			
});
          

          //移动
          $("#pan").click(function (e){
         					 disableAllTools();
          			cornerstoneTools.panTouchDrag.activate(element);
          			$( "#popupPanel" ).popup('close');
          			
          			
          });
          
          //放大缩小
          $("#zoom").click(function(){
                      disableAllTools();
             			cornerstoneTools.zoomTouchDrag.activate(element);
          			$( "#popupPanel" ).popup('close');
          			
          });
          
          //划直线
         $('#enableLength').click(function() {
              disableAllTools();
             cornerstoneTools.lengthTouch.activate(element);
             $("#popupPanel").popup('close');
          });
          
          //划圆
     		$('#circleroi').click(function() {
              disableAllTools();
              cornerstoneTools.ellipticalroi_Touch.activate(element);
              $("#popupPanel").popup('close');
          });
     		
     		
     		//划方形
   	      $('#rectangleroi').click(function() {
   	            disableAllTools();
   	            cornerstoneTools.rectangleRoiTouch.activate(element);
   	           $( "#popupPanel" ).popup('close');
   	        });
     		
     		//划角
     	      $('#angle').click(function () {
     	            disableAllTools();
     	             cornerstoneTools.angleTouch.activate(element);
     	            $("#popupPanel").popup('close');
     	        });
     		
          //左翻转
          var rNum = 0;
          var hflipBool= 0;
          var vflipBool= 0;
          $("#Tbtnrotatel").click(function(){
              rNum = rNum-90;
              var viewport = cornerstone.getViewport(element);
              viewport.rotation = rNum;
              cornerstone.setViewport(element, viewport);
          	$("#popupPanel").popup('close');
          });
          //右翻转
          $("#Tbtnrotater").click(function(){
              rNum = rNum+90;
              var viewport = cornerstone.getViewport(element);
              viewport.rotation = rNum;
              cornerstone.setViewport(element, viewport);
          	$("#popupPanel").popup('close');
          });
          
          //背面翻转
          $("#Tbtnfliphori").click(function(){
              var viewport = cornerstone.getViewport(element);
               hflipBool++;
          	if(hflipBool%2==0){
          	    viewport.hflip = false;
          	}else{
          	   viewport.hflip = true;
          	}
            
              cornerstone.setViewport(element, viewport);
          	$("#popupPanel").popup('close');
          });
          
          //上下翻转
          $("#Tbtnflipver").click(function(){
               var viewport = cornerstone.getViewport(element);
               vflipBool++;
          	if(vflipBool%2==0){
          	    viewport.vflip = false;
          	}else{
          	   viewport.vflip = true;
          	}
            
              cornerstone.setViewport(element, viewport);
          	$("#popupPanel").popup('close');
          });
          
          //划点
          $('#probe').click(function() {
              disableAllTools();
               cornerstoneTools.probeTouch.activate(element);
               $( "#popupPanel" ).popup('close');
          });
          
          //固定窗宽床位颜色
          $("#bone").click(function(){
          		disableAllTools();
              var viewport = cornerstone.getViewport(element);
              viewport.voi.windowWidth = parseFloat(111);
              viewport.voi.windowCenter = parseFloat(222);
              cornerstone.setViewport(element, viewport);
              
              		cornerstoneTools.wwwcTouchDrag.activate(element);
          			$( "#popupPanel" ).popup('close');
              
          });
     
          //反转
     		$('#invert').click(function (e) {
     		disableAllTools();
              var viewport = cornerstone.getViewport(element);
              if (viewport.invert === true) {
                  viewport.invert = false;
              } else {
                  viewport.invert = true;
              }
              cornerstone.setViewport(element, viewport);
              cornerstoneTools.wwwcTouchDrag.activate(element);
          	$( "#popupPanel" ).popup('close');
          });
     		

     		
     	    //还原
     	$('#Reset').click(function (e) {
     		 disableAllTools();
 	    	activate(this);
 	        cornerstone.fitToWindow(element);
 	        cornerstoneTools.lengthTouch.disable(element);
 	        cornerstoneTools.angleTouch.disable(element);
 	        cornerstoneTools.rectangleRoiTouch.disable(element);
 	        cornerstoneTools.wwwcTouchDrag.disable(element);
 	        cornerstoneTools.zoomTouchDrag.disable(element);
 	        cornerstoneTools.ellipticalroi_Touch.disable(element);
 	        cornerstoneTools.panTouchDrag.disable(element);
 	        cornerstoneTools.probeTouch.disable(element);
 	        
     		//向左滑动 下一张
        	$("#dicomImage").bind("swipeleft",function(){
        	  if(length-1 == count)return;
        		count =count+1;
        		OnInstancesJson_Success(seriesId,count);
             
            });
        	
        	
        	//向右滑动 上一张
        	$("#dicomImage").bind("swiperight",function(){
        		if(count == 0)return;
        		count = count-1;
        		OnInstancesJson_Success(seriesId,count);
        	
        	});
        	$( "#popupPanel" ).popup('close');

     	  });
     	    
     	    //显示标题或隐藏
     	    $("#show").click(function(){
     	    	showNum++;
     	    	if(showNum%2==1){
     	 			$("#topleft").hide();
     	 			$("#topleft2").hide();
     	 			$("#topleft3").hide();
     	 			$("#topleft4").hide();
     	 		 	$("#topright").hide();
     	 		 	$("#topright2").hide();
     	 		 	$("#bottomright").hide();
     	 		 	$("#bottomleft").hide();
     	 		 	$("#bottomleft2").hide();
     	    	}else{
     	 			$("#topleft").show();
     	 			$("#topleft2").show();
     	 			$("#topleft3").show();
     	 			$("#topleft4").show();
     	 		 	$("#topright").show();
     	 		 	$("#topright2").show();
     	 		 	$("#bottomright").show();
     	 		 	$("#bottomleft").show();
     	 		 	$("#bottomleft2").show();
     	    	}
     	    	

     	    });
     	    
     	    $("#close").click(function(){
     	   	$( "#popupPanel" ).popup('close');
     	    });
     	    
            function activate(id)
            {
                $('a').removeClass('active');
                $(id).addClass('active');
            }
     		
    			var viewport = cornerstone.getViewport(element);
    			
    	     	$("#viewerPage").append("<div id='topleft' style='position: absolute;top:50px; left:0px'><span style='color:yellow;font-size:6px;'>Pid:"+viewport.patientId+"</span></div>");               
    	     	$("#viewerPage").append("<div id='topleft2' style='position: absolute;top:70px; left:0px'><span style='color:yellow;font-size:6px;'>Name:"+viewport.patientName+"</span></div>");               
    	     	$("#viewerPage").append("<div id='topleft3' style='position: absolute;top:90px; left:0px'><span style='color:yellow;font-size:6px;'>Sex:"+viewport.patientSex+"</span></div>");               
    	     	$("#viewerPage").append("<div id='topleft4' style='position: absolute;top:110px; left:0px'><span style='color:yellow;font-size:6px;'>Age:"+viewport.patientAge+"</span></div>"); 
    	     	$("#viewerPage").append("<div id='topright' style='position: absolute;top:50px; right:0px'><span style='color:yellow;font-size:6px;'>StudyDate:"+viewport.studydate+"</span></div>");               
    	     	$("#viewerPage").append("<div id='topright2' style='position: absolute;top:70px; right:0px'><span style='color:yellow;font-size:6px;'>Modality:"+viewport.modality+"</span></div>");               
    	     	$("#viewerPage").append("<div id='bottomright' style='position: absolute;bottom:50px; right:0px'><span style='color:yellow;font-size:6px;'>Zoom:"+viewport.studydate+"</span></div>");               
    	     	$("#viewerPage").append("<div id='bottomleft' style='position: absolute;bottom:50px; left:0px'><span style='color:yellow;font-size:6px;'>WW/WC:"+Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter)+"</span></div>");  		   
    	 		$("#viewerPage").append("<div id='bottomleft2' style='position: absolute;bottom:70px; left:0px'><span style='color:yellow;font-size:6px;'>Instances:"+num+"/"+length+"</span></div>"); 	

          });
      

  }
  
  function OnError(data){
    console.log('e'+data)
  }