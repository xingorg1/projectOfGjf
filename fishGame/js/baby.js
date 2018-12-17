/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 19:11:41 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-17 11:59:12
 */
/* 绘制小鱼 */
var babyObj = function(){
  this.x;
  this.y;
  this.angle;
  // this.babyEye = new Image();
  this.babyBody = new Image();
  // this.babyTail = new Image();//尾巴
  this.babyTailTimer = 0;//计时器
  this.babyTailCount = 0;//记录循环到哪一帧
  this.babyEyeTimer = 0;//计时器
  this.babyEyeCount = 0;//记录循环到哪一帧
  this.babyEyeInterval = 1000;
  this.babyBodyTimer = 0;//计时器
  this.babyBodyCount = 0;//记录循环到哪一帧
}
babyObj.prototype.init = function(){
  this.x = canW * 0.5 - 50;
  this.y = canH * 0.5 + 50;
  this.angle = 0;
  // this.babyEye.src = './images/babyEye0.png';
  this.babyBody.src = './images/babyFade0.png';
  // this.babyTail.src = './images/babyTail0.png';
}
babyObj.prototype.draw = function(){
  /* 趋向于大鱼的坐标值 跟随大鱼移动*/
  this.x  = lerpDistance(mom.x,this.x,0.98);
  this.y  = lerpDistance(mom.y,this.y,0.98);
  /* 旋转角度 */
  var deltaY = mom.y - this.y;
  var deltaX = mom.x - this.x;
  var beta  = Math.atan2(deltaY,deltaX) + Math.PI;
  this.angle = lerpAngle(beta,this.angle, 0.6);
  /* 小鱼摇尾巴 - canvas序列帧：每隔一段时间重新绘制一张新图  定时器刷新数组*/
  this.babyTailTimer += deltaTime;// 计数
  if(this.babyTailTimer > 50){
    this.babyTailCount = (this.babyTailCount + 1) % 8;//因为不希望超过1，所以对8取模，这样得到的都是0-7！
    this.babyTailTimer %= 50;
  }
  var babyTailCount = this.babyTailCount;
  // 鱼眼眨
  this.babyEyeTimer += deltaTime;
  if(this.babyEyeTimer > this.babyEyeInterval){
    this.babyEyeCount = (this.babyEyeCount + 1) % 2;
    this.babyEyeTimer %= this.babyEyeInterval;
    if(this.babyEyeCount == 0){
      this.babyEyeInterval = Math.random() * 1500 + 2000; // [2000,3500)睁眼随机时间
    }else{
      this.babyEyeInterval = 200;//闭眼两秒
    }

  }
  var babyEyeCount = this.babyEyeCount;
  /* 小鱼身体变白 */
  this.babyBodyTimer += deltaTime;// 计数器存储时间
  if(this.babyBodyTimer > 300){
    this.babyBodyCount ++;
    this.babyBodyTimer %= 300;//小鱼身体变白一次后，计数器归零，重新开始计算是否>300，取模很好用
    if(this.babyBodyCount > 19){
      this.babyBodyCount = 19;
      //小鱼饿死，game over 
    }
  }
  var babyBodyCount = this.babyBodyCount;
  /* 绘制鱼 */
  ctx1.save();
  ctx1.translate(this.x,this.y);//修改原点的坐标
  ctx1.rotate(this.angle);//得到了角度值别忘了旋转才行
  // console.log(babyTailCount,babyTail[babyTailCount],babyTail)
  /* 注意绘制顺序 */
  ctx1.drawImage(babyTail[babyTailCount],-babyTail[babyTailCount].width * 0.5 + 23, -babyTail[babyTailCount].height * 0.5);
  ctx1.drawImage(babyBody[babyBodyCount],-babyBody[babyBodyCount].width * 0.5,-babyBody[babyBodyCount].height * 0.5);
  ctx1.drawImage(babyEye[babyEyeCount],-babyEye[babyEyeCount].width * 0.5,-babyEye[babyEyeCount].height * 0.5);
  ctx1.restore();

}