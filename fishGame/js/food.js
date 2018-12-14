/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 17:54:34 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-14 19:26:08
 */
/* 绘制食物 */
var foodObj = function () {
  this.alive = []; //是否活着
  this.x = [];
  this.y = [];
  this.len = []; // 图片长度
  this.spd = []; ///成长速度和上浮速度
  this.foodType = []; //类型
  this.orange = new Image();
  this.blue = new Image();
}
foodObj.prototype.num = 30;
foodObj.prototype.init = function () {
  for (let i = 0; i < this.num; i++) {
    this.alive[i] = false;
    this.x[i] = 0;
    this.y[i] = 0;
    this.spd[i] = Math.random() * 0.017 + 0.003; //[0.003,0.02)
    this.born(i);
  }
  this.orange.src = './images/fruit.png';
  this.blue.src = './images/blue.png';
}
foodObj.prototype.draw = function () {
  /* 食物绘制和长大 */
  for (let i = 0; i < this.num; i++) {
    if (this.alive[i]) {
      /* 动态修改类型 */
      if(this.foodType[i] == 'blue'){
        var pic = this.blue;
      }else{
        var pic = this.orange;
      }
      /* 控制成长的大小 */
      if (this.len[i] <= 14) {
        this.len[i] += this.spd[i] * deltaTime;
      } else {
        /* 成熟后，y轴减小，果实上漂 */
        this.y[i] -= this.spd[i] * 7 * deltaTime;
      }
      // 因为绘制是从0，0点开始的，所以减去图片宽高一般以调整位置。
      // ctx2.drawImage(this.orange,this.x[i] - this.orange.width * 0.5,this.y[i] - this.orange.height * 0.5);
      ctx2.drawImage(pic, this.x[i] - this.len[i] * 0.5, this.y[i] - this.len[i] * 0.5, this.len[i], this.len[i]);
      /* 飘出去后重生 */
      if (this.y[i] < 10) {
        this.alive[i] = false;
      }
    }
  }
}
foodObj.prototype.born = function (i) {
  var aneID = Math.floor(Math.random() * ane.num);
  this.x[i] = ane.x[aneID];
  this.y[i] = canH - ane.len[aneID];
  this.len[i] = 0;
  this.alive[i] = true;
  // 随机修改果实的类型
  var ran = Math.random();
  if(ran < 0.73){
    this.foodType[i] = 'orange';
  }else{
    this.foodType[i] = 'blue';
  }
}
foodObj.prototype.update = function () {
  var num = 0;
  for (let i = 0; i < this.num; i++) {
    if (this.alive[i]) {
      num++;
    }

  }
}

function foodMonitor() {
  /* 一开始需要15个果实且屏幕上要一直有果实 */
  var num = 0;
  for (let i = 0; i < food.num; i++) {
    if (food.alive[i]) {
      num++;
    }
  }
  if (num < 15) {
    sendFood();
    return;
  }
}

function sendFood(i) {
  for (let i = 0; i < food.num; i++) {
    if (!food.alive[i]) {
      food.born(i);
      return;
    }
  }
}
/* 果实被迟到 */
foodObj.prototype.dead = function(i){
  this.alive[i] = false;
}