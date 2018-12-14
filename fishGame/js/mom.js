/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 18:36:58 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-14 19:21:27
 */
/* 绘制大鱼 */
var momObj = function(){
  this.x;
  this.y;
  this.angle;//鱼旋转角度
  this.bigEye = new Image();
  this.bigBody = new Image();
  this.bigTail = new Image();//尾巴

}
momObj.prototype.init = function(){
  this.x = canW * 0.5;//获取宽度的一半
  this.y = canH * 0.5;
  this.angle = 0;
  this.bigEye.src = './images/bigEye0.png';
  this.bigBody.src = './images/bigSwim0.png';
  this.bigTail.src = './images/bigTail0.png';
}
momObj.prototype.draw = function(){
  /* 大鱼跟随鼠标 - lerp - 让一个值无限取向与另一个值 用pluging的lerpDistance */
  this.x  = lerpDistance(mx,this.x,0.9);
  this.y  = lerpDistance(my,this.y,0.9);

  /* 大鱼旋转方向 - 利用二者坐标差，计算鱼和鼠标之间的角度 */
  var deltaY = my - this.y;
  var deltaX = mx - this.x;
  var beta  = Math.atan2(deltaY,deltaX) + Math.PI;
  this.angle = lerpAngle(beta,this.angle, 0.6);

  /* 绘制鱼 */
  ctx1.save();
  ctx1.translate(this.x,this.y);//修改原点的坐标
  ctx1.rotate(this.angle);
  ctx1.drawImage(this.bigTail,-this.bigTail.width * 0.5 + 30,-this.bigTail.height * 0.5)
  ctx1.drawImage(this.bigBody,-this.bigBody.width * 0.5,-this.bigBody.height * 0.5)
  ctx1.drawImage(this.bigEye,-this.bigEye.width * 0.5,-this.bigEye.height * 0.5)
  ctx1.restore();
  
}