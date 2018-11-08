/*
 * @Author: @Guojufeng 
 * @Date: 2018-11-05 09:35:14 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-11-07 15:13:56
 */

/* global $ */
import {
  utils
} from './utils';
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback,element) {
			return window.setTimeout(callback, 1000 / 60);//1000ms/60.最佳循环间隔
		};
})();
$(function () {
  /* 判断并提示微信环境打开 */
  if (!window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger') {
    alert('添加微信观看提示');
  }
  /* begin 预加载 */
  var deBug = true, //是否是开发时快速查看测试的效果
    canvas1Img = [],
    timer1 = null,
    userSex = 0;//0男1女
  if (!deBug) {
    initPreLoad();
    $('.page2').hide();
  } else {
    $('.loading').hide();
    $('video').hide();
    $('.loading-end-btn').show();
    let imgUrl = '../../images/begin/bg/',
      imgArr = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147];
    canvas1Img = utils.prestrain(imgArr, imgUrl, 'jpg', function () {});
    $('.title').addClass('show');
  }

  function initPreLoad() {
    /* 使用javascript对图片进行预加载 */
    let num = 0,
      progress = 0; //预备变量、预加载page1所需的图片
    let imgUrl = '../../images/begin/bg/',
      imgArr = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147],
      musicUrl = '../../images/assets/',
      musicArr = ['bicycle', 'bird', 'car', 'cat', 'choose', 'click', 'fly', 'stage', 'train', 'walk'],
      countNum = musicArr.length + imgArr.length;

    function loadAni(num) {
      /* 加载进度条的动画 */
      progress = parseInt(num / countNum * 100);
      $('.loading-progress-number').animate({
        count: progress
      }, {
        duration: 150,
        step: function () {
          if (isNaN(this.count)) {
            this.count = 0;
            return;
          }
          let boxText = Math.ceil(Number(this.count));
          if (boxText >= 100) {
            boxText = 100;
            $('.loading-text').css('display', 'none');
            $('.loading-end-btn').css('display', 'block');
          }
          $('.loading-progress-number').text(`${boxText}%`);
          $('.loading-progress-width').css('width', `${boxText}%`);
        }
      })
    }
    canvas1Img = utils.prestrain(imgArr, imgUrl, 'jpg', function () {
      num++;
      loadAni(num);
    });
    utils.prestrain(musicArr, musicUrl, 'mp3', function () {
      num++;
      loadAni(num);
    });
  }

  /* 视频开始按钮 */
  $('.loading-end-btn').on('click', function () {
    let myVideo = document.getElementById('myVideo');
    $('.loading').fadeOut();
    /* 插入video并开始播放 */
    if (myVideo && myVideo.readyState) {
      myVideo.play(); //开始播放、paused暂停播放
    } else {
      /* 视频下载失败，执行重新加载 */
    }

  });

  $('.video').on('error', function () {
    alert('视频加载失败，请刷新重试')
  });
 
  /* 视频结束 */
  $('.video').on('ended', function () {
    $(this).fadeOut();
    $('.page1').fadeIn();
    $('.title').addClass('show');
    $('.music-btn').removeClass('hide');
    /* canvas序列帧技术绘制page1的背景 - 需优化定时器*/
    let canvas1 = document.getElementById('canvas1');
    canvas1 && utils.canvasWH(canvas1);
    let context1 = canvas1.getContext('2d'),
      _i = 0;
    context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
    /* function frameAni(){
      _i++;
      if (_i >= canvas1Img.length) {
        _i = 0;
      }
      context1.clearRect(0, 0, utils.oW, utils.oH);
      context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
      console.log(canvas1Img[_i]);
      window.requestAnimFrame(frameAni);
    }
    frameAni(); */
    timer1 = setInterval(() => {
      _i++;
      if (_i >= canvas1Img.length) {
        _i = 0;
      }
      context1.clearRect(0, 0, utils.oW, utils.oH);
      context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
      console.log(canvas1Img[_i]);
    }, 100);
    /* 预加载page2的长屏幕动画所需图 */
  });
  $('.page1 .txt').on('click', () => {
    /* 销毁page1、canvas1、动画定时器、视频等 */
    $('.loading').remove();
    $('.video').remove();
    clearInterval(timer1);
    timer1 = null;
    $('.page1').remove();
    $('.page2').show();
  });
  /* 选性别 */
  $('.sex-box li').on('click',function(){
    if($(this)[0].className == "female"){
      userSex = 1;
      $('.choose-scroll .user-list').removeClass('male').addClass('female')
    }
    $(this).addClass('cur');
    setTimeout(()=>{
      $('.choose-sex').fadeOut();
      $('.choose-person').fadeIn();
    },500);
  });
  /* 绑定事件模拟滚动效果 */
  /* 思路
    监听触摸事件
    start时、鼠标按下记录当前鼠标的x y位置（这个效果特殊，只需要监听y轴位置即可）
    move时、鼠标移动获取新的y值，如果大于start的y值就是向下移动(元素的scrolltop/offsetTop增加),反之向上(元素的scrolltop/offsetTop减少)【实验时企图设置$(this)[0].offsetTop失败，说是可读属性不能赋值】
    [借助原著的启发，最后利用css3的translate属性对元素进行上下移动]
      问题亮点
        拿目标元素的位置scrollTop
        拿事件的鼠标位置touches【jq on绑定的时候，e返回的不是事件event，而是目标元素$(this)】
    监听鼠标事件同理
      但是同样要注意碰撞检测
   */
  var lastY = 0,transY = 0;
  $('.choose-scroll').on('touchstart',function(e){
    let y = e.originalEvent.touches[0].pageY;
    lastY = y;
  });
  $('.choose-scroll').on('touchmove',function(e){
    let y = e.originalEvent.touches[0].pageY,
      moveY = y - lastY;
    transY += moveY;
    if(moveY > 0 && transY > 0){
      /* 鼠标向下移动，对应元素向上回看 */
        transY = 0;//到顶
    }else{
      /* 鼠标向上移动，对应元素向下翻看 */
      if(Math.abs(transY) >= e.currentTarget.clientHeight - utils.oH){//触底
        transY = -(e.currentTarget.clientHeight - utils.oH) + 1;
      }
    }
    lastY = y;
    $(this).css('transform',`translate(0px, ${transY}px)`);
  });
  /* 滚轮事件 */
  $('.choose-scroll').on("mousewheel",function(e,delta){
    let y = e.originalEvent.deltaY;
    if(y > 0){
      /* 向下翻滚轮 wheelDeltaY的值与之相反*/
      transY -= 100;
      if(Math.abs(transY-100) >= e.currentTarget.clientHeight - utils.oH){//触底
        transY = -(e.currentTarget.clientHeight - utils.oH) + 1;
      }
    }else{
      /* 向上翻滚轮*/
      transY += 100;
      if(Math.abs(transY)-100 <= 0){
        transY = 0;//到顶
      }
    }
    $(this).css('transform',`translate(0px, ${transY}px)`);
  });
  /* 选人物 */
  $('.choose-scroll .user-list li').on('click',function(){
    console.log($(this)[0].className);
    var num = $(this).index();
    var a = $(this)[0].offsetTop;
    var b = $(this)[0].offsetLeft;
    console.log(a,b)
    $('.spotlight').addClass('show spot'+num).css('transform',`translate3d(-${b}px, -${a}px, 0)`);
    $('.choose-tip').fadeOut();
    $('.choose-fill-form').addClass('show');
  });
  
  /* 阻止滚轮和鼠标移动事件 */
  $('.spotlight').on('touchstart touchmove mousewheel',function(e){
    return false;
  });
  /* 重新选择 */
  $('.choose-btn1').on('click',function(){
    $('.spotlight').removeClass('show').css('transform','translate3d(0, 0, 0)');
    $('.choose-tip').fadeIn();
    $('.choose-fill-form').removeClass('show');
    $('.choose-scroll').removeClass('no-move');
  });
});