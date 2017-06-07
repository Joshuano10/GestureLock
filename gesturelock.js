var circlePos = [];//记录圆心位置
var correctPwd = [];//记录正确密码
var yourPwd = [];//当前输入密码
var tmp = null;//第一次设置的密码
var cxt;
var cw;//canvas宽度
var r = 60;//园的半径
var ls = window.localStorage;//localStorage

window.onload = function(){
    var myCanvas = document.getElementById("myCanvas");
    cxt = myCanvas.getContext("2d");
    cw = document.body.clientWidth
    myCanvas.width = cw;
    myCanvas.height = cw;
    drawCircle();
    touch();
}

//画圆
function drawCircle(){
    var circleX = (cw-(4*r))/4;//两个圆之间的距离，通过页面宽度算出，
    var circleTop = circleX;//圆心横坐标
    var circleLeft = circleX;//圆心距纵坐标
    for(i = 0;i<3;i++){
        for(j = 0;j<3;j++){ //画一行的三个圆
            cxt.strokeStyle = "orange";
            cxt.fillStyle = "#FFFFFF";
            cxt.lineWidth = 10;
            cxt.beginPath();
            cxt.arc(circleLeft, circleTop, r, 0, Math.PI*2, false);
            cxt.closePath();
            cxt.stroke();
            cxt.fill();
            circlePos.push([circleLeft,circleTop]);
            circleLeft += 2*r+circleX;
        }
        circleLeft = circleX; //横坐标重置
        circleTop += 2*r+circleX; //纵坐标变大
    }
}

//触屏
function touch(){
    var touches;
    myCanvas.addEventListener("touchstart",function(event){
        touches = event.touches[0];
        isPointSelect(touches);
    },false);

    myCanvas.addEventListener("touchmove",function(event){
        event.preventDefault();
        touches = event.touches[0];
        isPointSelect(touches);
        cxt.clearRect(0,0,cw,cw);
        drawCircle();
        drawLine(touches);
    },false);

    myCanvas.addEventListener("touchend",function(event){
        toggle();
    },false);
}

//画线
function drawLine(touches){
    if(yourPwd.length>0){
        //两点间连线
        cxt.beginPath();
        for(var i = 0;i<yourPwd.length;i++){
            var pointIndex = yourPwd[i];
            //console.log(pointIndex);
            cxt.lineTo(circlePos[pointIndex][0],circlePos[pointIndex][1]);
        }
        cxt.lineWidth = 8;
        cxt.strokeStyle = "#FA800E";
        cxt.stroke();
        cxt.closePath();

        //在被选中的点内画圆
        for(var i = 0;i<yourPwd.length;i++){
            cxt.beginPath();
            cxt.arc(circlePos[yourPwd[i]][0], circlePos[yourPwd[i]][1], r-25, 0, Math.PI*2, false);
            cxt.fillStyle = "#FA800E";
            cxt.fill();
            cxt.closePath();
        }

        //直线跟随
        if (touches!=null) {
            var startPoint = yourPwd[yourPwd.length-1];
            cxt.beginPath();
            cxt.moveTo(circlePos[startPoint][0],circlePos[startPoint][1] );
            cxt.lineTo(touches.clientX,touches.clientY);
            cxt.strokeStyle = "#FA800E";
            cxt.stroke();
            cxt.closePath();
        };
    }
}

//检查点是否被选中
function isPointSelect(touches){
    for(var i = 0;i<circlePos.length;i++){
        var diffX = Math.abs(touches.clientX-circlePos[i][0]);
        var diffY = Math.abs(touches.clientY-circlePos[i][1]);
        var dir = Math.pow((diffX*diffX+diffY*diffY),0.5);//计算距离
        if(dir<r){
            if(yourPwd.indexOf(i)<0){
                yourPwd.push(i);
            }
            break;
        }
    }
}

//切换设置，验证
function toggle(){
    var radio = document.getElementsByName("toggle");
    var tip = document.getElementById("tip");
    var selectval;//选择功能
    for (var i = 0; i<radio.length; i++) {
        if (radio[i].checked) {
            selectval = radio[i].value;
            break;
        };
    };

    if(selectval == "set"){//设置密码
        if(!tmp){
            if(yourPwd.length<5){
                tip.innerText = "请设置长度大于等于5位的密码";
                setTimeout("tip.innerHTML = '<br />'",1500);
            }else{
                tmp = yourPwd;
                tip.innerText = "请再输入一遍密码";
                setTimeout("tip.innerHTML = '<br />'",1500);
            }
            setTimeout("cxt.clearRect(0,0,cw,cw)",300);
            yourPwd = [];
            setTimeout("drawCircle(cxt,cw)",300);
        }else{
            if(yourPwd.toString() == tmp.toString()){
                correctPwd = yourPwd;
                ls.correctPwd = correctPwd;
                tip.innerText = "设置成功";
                setTimeout("tip.innerHTML = '<br />'",1500);
                tmp = null;
            }else{
                tip.innerText = "两次密码不一致，请重新设置";
                setTimeout("tip.innerHTML = '<br />'",1500);
                tmp = null;
            }
            setTimeout("cxt.clearRect(0,0,cw,cw)",300);
            yourPwd = [];
            setTimeout("drawCircle(cxt,cw)",300);
        }
    }

    else{//验证密码
        if (ls.correctPwd == null) {
            tip.innerText = "还未设置密码";
            setTimeout("tip.innerHTML = '<br />'",1500);
        };
        if(yourPwd.toString() == ls.correctPwd.toString()){
            tip.innerText = "密码正确";
            setTimeout("tip.innerHTML = '<br />'",1500);
        }else{
            tip.innerText = "密码错误，请重新输入";
            setTimeout("tip.innerHTML = '<br />'",1500);
        }
        setTimeout("cxt.clearRect(0,0,cw,cw)",300);
        yourPwd = [];
        setTimeout("drawCircle(cxt,cw)",300);
    }
}