/*
 * @Author: @Guojufeng 
 * @Date: 2018-11-05 09:35:14 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-11-05 17:32:53
 */

/* global $ */
import {
  utils
} from './utils';
$(function () {
  /* 判断并提示微信环境打开 */
  if (!window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger') {
    alert('添加微信观看提示');
  }
  /* begin 预加载 */
  var deBug = true, //是否是开发时快速查看测试的效果
    canvas1Img = [],
    timer1 = null;
  if (!deBug) {
    initPreLoad();
  } else {
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
      console.log('视频准备就绪');
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
    /* canvas绘制page1的背景 */
    let canvas1 = document.getElementById('canvas1');
    canvas1 && utils.canvasWH(canvas1);
    let context1 = canvas1.getContext('2d'),
      _i = 0;
    context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
    timer1 = setInterval(() => {
      _i++;
      if (_i >= canvas1Img.length) {
        _i = 0;
      }
      context1.clearRect(0, 0, utils.oW, utils.oH);
      context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
      console.log(canvas1Img[_i])
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
  $('.sex-box li').on('click',function(){
    $(this).addClass('cur');
    setTimeout(()=>{
      $('.choose-sex').fadeOut();
      $('.choose-person').fadeIn();
    },500);
  })
});