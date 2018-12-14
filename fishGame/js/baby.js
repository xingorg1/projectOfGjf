/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 19:11:41 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-14 19:23:20
 */
/* 绘制小鱼 */
var babyObj = function(){
  this.x;
  this.y;
  this.angle;
  this.babyEye = new Image();
  this.babyBody = new Image();
  this.babyTail = new Image();//尾巴
}
babyObj.prototype.init = function(){
  this.x = canW * 0.5 - 50;
  this.y = canH * 0.5 + 50;
  this.angle = 0;
  this.babyEye.src = './images/babyEye0.png';
  this.babyBody.src = './images/babyFade0.png';
  this.babyTail.src = './images/babyTail0.png';
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
  /* 绘制鱼 */
  ctx1.save();
  ctx1.translate(this.x,this.y);//修改原点的坐标
  ctx1.rotate(this.angle);//得到了角度值别忘了旋转才行
  /* 注意绘制顺序 */
  ctx1.drawImage(this.babyTail,- this.babyTail.width * 0.5 + 23, -this.babyTail.height * 0.5);
  ctx1.drawImage(this.babyBody,-this.babyBody.width * 0.5,-this.babyBody.height * 0.5);
  ctx1.drawImage(this.babyEye,-this.babyEye.width * 0.5,-this.babyEye.height * 0.5);
  ctx1.restore();
}