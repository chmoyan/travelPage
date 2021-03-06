$('#confirmOrderPage').bind('pageshow',function(event, ui){
	setGuideInfo();//设置讲解员信息返回讲解费
	setOrderInfo();//设置预约信息
	
	$("#gopay").bind("click",function(){
		putOrder();
	});
});
//获取session值
function setOrderInfo()
{
	var visitTime = getSession(sessionStorage.directVisitTime);
	var visitNum = getSession(sessionStorage.directVisitNum);
	$(".orderTime").html(visitTime);
	$(".visitorCount").html(visitNum);
}
function setChargeInfo(guideMoney)
{
	$(".guideMoney").html(guideMoney);
	var pur = GetUrlem("purchaseTicket");
	var TicketM = 0;
	var ticm = "<br/>";
	
		var half = GetUrlem("halfPrice");
		var disc = GetUrlem("discoutPrice");
		var full = GetUrlem("fullPrice");
		
	var secnicNo = getSession(sessionStorage.scenicNo);
	if(!secnicNo)
	{
		return false;
	}
	var url = HOST+"/geTicketsByScenicNo.do";
	$.ajax({
		type:"post",
		url:url,
		async:true,
		data:{"scenicNo":secnicNo},
		datatype:"JSON",
		error:function()
		{
			alert("获取门票费用Request error!");
			return false;
		},
		success:function(data)
		{
		//alert(JSON.stringify(data));
		if(pur==1){

		if(full!=0)
		{
			ticm +="<p>全价票"+full+"*"+data.fullPrice+"元</p>";
		}
		if(half!=0)
		{
			ticm+="<p>半价票"+half+"*"+data.halfPrice+"元</p>";
		}
		if(disc!=0)
		{
			ticm += "<p>折扣票"+disc+"*"+data.discoutPrice+"元</p>";
		}
	}
		if(pur==1)
		{	
			TicketM = parseInt(full) * parseInt(data.fullPrice) + parseInt(half) * parseInt(data.halfPrice)+parseInt(disc)*parseInt(data.discoutPrice);
		}
		$("#setsumMoney").html(TicketM+parseInt(guideMoney));
		$("#setticketMoney").html(ticm);
		}
	});
}
//http://127.0.0.1:8020/travelPage/chen/orderFormPage.html?phone=13165662195&purchaseTicket=1&halfPrice=1&discoutPrice=3&fullPrice=2
function setGuideInfo()//设置讲解员信息返回讲解费
{
	var phone = GetUrlem("phone");
	var Url = HOST+"/getDetailGuideInfoByPhone.do";
	$.ajax({
		type:"post",
		url:Url,
		async:true,
		data:{"guidePhone":phone},
		datatype:"JSON",
		error:function()
		{
			alert("导游详细信息Request error!");
		},
		success:function(data)
		{
			//alert("导游详细信息success!");
			$.each(data, function(i,item) {
				$(".ui-page-active").find("#name").html(item.name);
				$(".ui-page-active").find("#sex").html(item.sex);
				$(".ui-page-active").find("#age").html(item.age);			
				/*$("#guide_img").attr("src","img/1.jpg");
				$("#guide_starlevel").html(item.guideLevel);
				$("#guide_Visitors").html(item.historyNum);
				$("#guide_fee").html(item.guideFee+"元");
				$("#guide_self_intro").html(item.selfIntro);
				$("#guide_phone").html(item.phone);*/	
				var language=getLanguage(item.language);
				$(".ui-page-active").find("#language").html(language);
				$("#setguideMoney").html(item.guideFee);
				setChargeInfo(item.guideFee);//设置门票信息
			});
		}
	});
}


function putOrder(){
	var secnicNo = getSession(sessionStorage.scenicNo);
	var pur = GetUrlem("purchaseTicket");
	var half = GetUrlem("halfPrice");
	var disc = GetUrlem("discoutPrice");
	var full = GetUrlem("fullPrice");
	var visitTime = getSession(sessionStorage.directVisitTime);
	var visitNum = getSession(sessionStorage.directVisitNum);
	
	var guidephone = GetUrlem("phone");
	var postData =
	{
		'scenicID':secnicNo,
		'visitNum':visitNum,
		'visitTime':visitTime,
		'visitorPhone':"13589678945",
		'guidePhone':guidephone,
		'purchaseTicket':pur,
		'halfPrice':half,
		'discoutPrice':disc,
		'fullPrice':full,
	};
	var Url = HOST+"/BookOrderWithGuide.do";
	//alert(JSON.stringify(postData));
	$.ajax({
		type:"post",
		url:Url,
		async:true,
		data:postData,
		datatype:"JSON",
		error:function()
		{
			alert("提交订单失败！");
			return false;
		},
		success:function(data)
		{	
			if(data==1)
			{
				alert("提交订单成功！");
			}else{
				alert("提交订单失败！");
			}
		}		
	});
}

