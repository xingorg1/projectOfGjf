/*
 * @Author: @Guojufeng 
 * @Date: 2018-11-05 09:35:14 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-11-15 18:46:53
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
    userSex = 0,//0男1女
    userName = '';//用户姓名
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
    $('.page1').hide();
    $('.page2').hide();
    $('.page3').show();
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
    $('.page1 .title').addClass('show');
    $('.page1 .txt').addClass('show');
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
  /* 绑定事件模拟滚动效果 - 仅适用于从上往下起始的滚动 */
  touchToBottom('.choose-scroll');
  function touchToBottom(target){
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
    $(target).on('touchstart',function(e){
      let y = e.originalEvent.touches[0].pageY;
      lastY = y;
    });
    $(target).on('touchmove',function(e){
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
    $(target).on("mousewheel",function(e,delta){
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
  }
  /* 选人物 - 点击后出现追光、输入框等 */
  $('.choose-scroll .user-list li').on('click',function(e){
    // 清空上一次填过的内容
    $('.choose-input').find('input').val("");
    // 追光动画等
    let t = $(this)[0],mark = $('.spotlight')[0];
    $(this).addClass('cur').siblings('li').removeClass('cur');
    var a = t.offsetTop + t.clientHeight/2 - mark.clientHeight/2;
    var b = t.offsetLeft + t.clientWidth/2  - mark.clientWidth/2;
    $('.spotlight').addClass('show').css('transform',`translate3d(${b}px, ${a}px, 0)`);
    /* 
      原理就是让spotlight的中心点等于当前元素（装着每一个小人全身像的li元素）所在父元素位置的中心点。
      当前元素的中心点计算：
      首先需要知道offsetTop在没有定位父元素时候，其距离的计算是相对于html来说的。
      这里offsetTop是一个元素（小人li）的最上边到父元素最顶边的距离，offsetLeft是一个元素的最上边到父元素最左边的距离。也就是左上角那个点。
      现在我们找到了他的左上角，再想向右偏移到中心点，只需要加上可视区域宽高的一半即可（看图assets文件夹）
      而设置蒙层的translate，他的xy的计算值也是自己元素的左上角的偏移量。（这里不用js的话可以css设置transform-origin的偏移中心点）
      也就是到目前分析为止，若直接让translate的xy值分别等于刚刚计算的小人中心点的坐标值，那么蒙层的左上角刚好在小人像的中心点（看图assets文件夹）
      与上边偏移目标不同的是，上边需要偏移中心点向右移动，而这次我们需要偏移蒙层自身，让其translate的点像左偏移，即整个图像向左偏移，所以需要减掉自身可视区域宽高的一半。 
    */
    $('.choose-tip').fadeOut();
    $('.choose-fill-form').addClass('show');
  });
  
  /* 出现追光后，阻止滚轮和鼠标移动事件 */
  $('.spotlight').on('touchstart touchmove mousewheel',function(e){
    return false;
  });
  /* 重新选择 */
  $('.choose-btn1').on('click',function(){
    $('.spotlight').removeClass('show').css('transform',`translate3d(0,0,0)`);//归零 - 优化原作露怯的地方
    $('.choose-scroll .user-list li').removeClass('cur');
    $('.choose-tip').fadeIn();
    $('.choose-fill-form').removeClass('show');
    $('.choose-scroll').removeClass('no-move');
  });
  $('.choose-btn2').on('click',function(){
    var name = $('.choose-input').find('input').val();
    console.log(name)
    if(name){
      /* 存入名字 */
      userName = name;
      /* 进入下一环节 */
      $('.page2').remove();
      $('.page3').fadeIn();
    }else{
      alert('请输入你的名字！')
    }
  });
  /* page3的自动上滑 */
  
  // $('.page3 .bg').css('translateY','100px');
});