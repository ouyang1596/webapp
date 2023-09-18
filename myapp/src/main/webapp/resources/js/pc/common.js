var global = {collectflag: false, logged:false};
$(document).ready(function(){
	
	$("input, textarea").keyup(function(){
		$(".warn").html("");
	});
	footerPosition();
	setTimeout(footerPosition, 500);
    $(window).resize(footerPosition);
	
});
//footer固定在底部
function footerPosition(){
    $(".footer").removeClass("foot_fixed_bottom");
    var contentHeight = document.body.scrollHeight,//网页正文全文高度
        winHeight = $(window).height();//可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $(".footer").addClass("foot_fixed_bottom");
    } else {
        $(".footer").removeClass("foot_fixed_bottom");
    }
}

//设置颜色
function getColor(type, $dom, attr){
	var color=["#207AB6", "#E64C3B", "#996600", "#449D44", "#FF7F00"];
	if(type == "one"){
		color=["#207AB6", "#E64C3B", "#996600", "#449D44", "#FF7F00"];
	}else if(type == "two"){
		color=["#4DCCF6", "#FF9999", "#999933", "#009999", "#FF9900"];
	}
	$dom.each(function(i){
		$(this).css(attr,color[i%5]);
	});
}

//收藏提示
function showAlertMsg(msg){
	$("#alertMsg").html(msg);
	$("#alertMsg").animate({left:'45%'},0);
	$("#alertMsg").animate({opacity:'0.8'},800);
	$("#alertMsg").animate({opacity:'0'},400);
	$("#alertMsg").animate({left:'-100%'},0);
}
function showAlertMsgWithTime(msg, opacity, show, hide){
	$("#alertMsg").html(msg);
	$("#alertMsg").animate({left:'45%'},0);
	$("#alertMsg").animate({opacity: opacity},show);
	$("#alertMsg").animate({opacity:'0'},hide);
	$("#alertMsg").animate({left:'-100%'},0);
}
function goback(){
	window.history.back(); 
}

function RegexPwd(pwd) {
    var reg = /^[A-Za-z0-9_-]{3,50}$/;
    return reg.test(pwd);
}
 
function RegexMobile(mobile) {
    var reg = /^1[34578][0-9]{9}$/;
    return reg.test(mobile);
}
function RegexEmail(email) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    return reg.test(email);
}
