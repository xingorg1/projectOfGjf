/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 17:05:04 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-14 19:12:51
 */

/* 定义 */
var mx,my,//鼠标信息
    can1,
    can2,
    ctx1,
    ctx2,
    canW,
    canH,
    lastTime,
    deltaTime,
    ane,
    food;
console.log(window.requestAnimFrame)
var bgPic = new Image();
/* 执行 */
document.body.onload = game;
function game(){
  init();
  lastTime = Date.now();
  deltaTime = 0;
  gameloop();
}
/* 初始化 */
function init(){
  /* 获取画布对象 */
  can1 = document.getElementById('canvas1');
  ctx1 = can1.getContext('2d');
  can2 = document.getElementById('canvas1');//bg 海葵，food
  ctx2 = can2.getContext('2d');
  bgPic.src = "./images/background.jpg";
  
  /* canvs1+鼠标检测事件 */
  can1.addEventListener('mousemove',onMouseMove,false);

  canW = can1.width;
  canH = can1.height;

  mx = canW * 0.5;
  my = canH * 0.5;
  /* 海葵 */
  ane = new aneObj();
  ane.init();
  /* 食物 */
  food = new foodObj();
  food.init()
   /* 大鱼 */
   mom = new momObj();
   mom.init()
   /* 小鱼 */
   baby = new babyObj();
   baby.init()
}

 /* 绘制背景 */
function drawBackground(){
  ctx2.drawImage(bgPic,0,0,canW,canH)
}
/* 游戏刷新循环 */
function gameloop(){
  window.requestAnimationFrame(gameloop)
  /* 获取两针间隔 */
  var now = Date.now();
  deltaTime = now - lastTime;
  lastTime = now;
  if(deltaTime > 50) deltaTime = 40;//优化果实变大
  /* 绘制背景和素材 */
  drawBackground();
  ane.draw();
  foodMonitor();
  food.draw();
  // ctx1.clearRect(0,0,canW,canH)
  mom.draw();
  baby.draw();
  /* 吃 */
  monFoodCollision();
}

/* 获取鼠标位置 */
function onMouseMove(e){
  if(e.offsetX || e.layerX){
    mx = e.offsetX == undefined ? e.layerX : e.offsetX;
    my = e.offsetY == undefined ? e.layerY : e.offsetY;
  }
}