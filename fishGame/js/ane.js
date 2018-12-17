/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 17:30:12 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-17 11:45:52
 */
/* 绘制海葵 */
var aneObj = function () {
  this.x = []; //位置
  this.len = []; //高度
}
aneObj.prototype.num = 80;
aneObj.prototype.init = function () {
  /* 初始化，确定海葵的位置 */
  for (let i = 0; i < this.num; i++) {
    this.x[i] = i * 10 + Math.random() * 9; //位置随机
    this.len[i] = 200 + Math.random() * 50; //高度随机
  }
}
aneObj.prototype.draw = function () {
  /* 绘制 - canvas绘制 */
  ctx2.save();
  ctx2.globalAlpha = 0.6;
  ctx2.lineWidth = 10;
  ctx2.lineCap = 'round';
  ctx2.strokeStyle = '#3b154e';
  for (let i = 0; i < this.num; i++) {
    ctx2.beginPath();
    ctx2.moveTo(this.x[i], canH);
    ctx2.lineTo(this.x[i], canH - this.len[i]);
    ctx2.stroke();
  }
  ctx2.restore();
}