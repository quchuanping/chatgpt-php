/*发送消息*/
function send(headSrc,str){
	var html="<div class='send'><div class='msg'><img src="+headSrc+" />"+
	"<p><i class='msg_input'></i>"+str+"</p></div></div>";
	upView(html);
}
/*接受消息*/
function show(headSrc,str){
	var html="<div class='show'><div class='msg'><img src="+headSrc+" />"+
	"<p><i class='msg_input'></i>"+str+"</p></div></div>";
	upView(html);
}
/*更新视图*/
function upView(html){
	$('.message').append(html);
	$('body').animate({scrollTop:$('.message').outerHeight()-window.innerHeight},200)
}
function sj(){
	return parseInt(Math.random()*10)
}
var sendTime = 0;
var isClick = false;
var questionContentArr = [];


$(function(){
	$('.footer').on('keyup','input',function(){
		if($(this).val().length>0){
			$(this).next().css('background','#114F8E').prop('disabled',true);
		}else{
			$(this).next().css('background','#ddd').prop('disabled',false);
		}
	})
	$('.footer p').click(function(){
		if (isClick){
			return;
		}
		isClick = true

		show("./images/touxiangm.png",$(this).prev().val());
		// test();
		let msgVal = $(this).prev().val();
		if(msgVal == ""){
			return;
		}

		let timestamp = Date.parse(new Date()) /1000;
		if((timestamp - sendTime ) < 5){
			send("images/touxiang.png","提问间隔小于5秒，请稍后重试！")
		}
		sendTime = timestamp
		$(this).prev().val("");

		$(".tit").html("回答中...");
		post(msgVal);
	})
})


/*测试数据*/
var arr=['你好啊，我可以回答你的提问！',];
var imgarr=['images/touxiang.png','images/touxiangm.png']
test()
function test(){
	$(arr).each(function(i){
		setTimeout(function(){
			send("images/touxiang.png",arr[i])
		},sj()*500)
	})
}


function post(msgData){
		questionContentArr.push({
			"role":"user",
			"content":msgData,
		})
		axios.post('/api/api.php', {
					body:questionContentArr,
				}, {
					headers: { 'content-type': 'application/json' }
				}).then(res => {
					console.log(res);
					let text = res.data.choices[0].message.content.replace("openai:", "").replace("openai：", "").replace(/^\n|\n$/g, "")
				    	questionContentArr.push({
							"role":res.data.choices[0].message.role,
							"content":text,
						})
					   send("images/touxiang.png",text);
					   $(".tit").html("ChatGpt");
					   isClick = false;
				}).catch(error => {
					console.log('error', error);
					console.log(error.code);
					send("images/touxiang.png","服务器太火爆，请刷新重试！")
					$(".tit").html("ChatGpt");
					isClick = false;
				})

					
					
}