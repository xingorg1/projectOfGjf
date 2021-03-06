/*
 * @Author: @Guojufeng 
 * @Date: 2018-11-05 09:35:14 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-11-30 19:49:42
 */

/* global $ */
import {
  utils
} from './utils';
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function (callback, element) {
      return window.setTimeout(callback, 1000 / 60); //1000ms/60.最佳循环间隔
    };
})();
import filter from './plugings/filter.json';
import question from './plugings/question.json';
import result from './plugings/result.json';
let VConsole = require('../../node_modules/vconsole/dist/vconsole.min');//路径根据项目自己找
let vConsole = new VConsole();
$(function () {
  console.log('缓存这么严重吗？？/*  */')
  /* 判断并提示微信环境打开 */
  if (!window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger') {
    alert('添加微信观看提示');
  }
  /* begin 预加载 */
  var deBug = false, //是否是开发时快速查看测试的效果
    links = 'https://xingorg1.github.io/projectOfGjf/zhihuYoung/dist/images/',
    canvas1Img = [],//绘制首页的canvas
    timer1 = null,//以备停止 - 绘制首页的canvas
    musicAss = [],//音乐资源 - 放musicArr缓存的音乐资源
    /* 
      'click': 0
      'choose': 1
      'walk': 2
      'cat': 3
      'fly': 4
      'bird': 5
      'car': 6
      'bicycle': 7
      'stage': 8
      'train': 9
    */
    page3Obj = { // 第三页人物运动所需资料
      img1: null,
      img2: null,
      timer: null,
      context2: null,
      bgTarget: [0,1500,3434,5150,6330,7600],
      startTarget: [0,-1440,-3400,-5100,-6200],//从哪个点开始走
      walkTarget: [
        {
          x: 0,
          y: -600
        },{
          x: 0,
          y: -2000
        },{
          x: -125,
          y: -4000
        },{
          x: -280,
          y: -5700
        },{
          x: 20,
          y: -6900
        }
      ]//走到哪个目标点
    },
    questionL = [],//用户选择答案
    questionNum = 0,//当前题号
    questionLen = question.data.length,//题目个数
    userSex = 0, //用户选择性别，0男1女
    userName = '', //用户姓名
    userImg = new Image(), //用户所选任务形象图
    canvas3Img = [];//画第三个canvas需要准备的序列图
  function filterFun(value) {
    //遍历敏感词数组filter.data
    let len = filter.data.length;
    for (var i = 0; i < len; i++) {
      //判断内容中是否包括敏感词
      if (value.indexOf(filter.data[i]) != -1) {
        return value; //value为传入的input的value值，如果这个值是敏感词，直接返回这个敏感词，以备后用。
      }
    }
    //如果不是敏感词，默认函数不返回值（即undefined），最后判断函数执行的返回值即可。
  }
  if (!deBug) {
    initPreLoad();
    $('.page2').hide();
  } else {
    /* 制作环境 */
    $('.loading').hide();
    $('.video1').hide();
    $('.loading-end-btn').show();
    let imgUrl = links + 'begin/bg/',
      imgArr = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147];
    canvas1Img = utils.prestrain(imgArr, imgUrl, 'jpg', function () {});
    $('.title').addClass('show');
    $('.page1').hide();
    $('.page1 .txt').addClass('show');
    $('.page2').show();
    // $('.page3').remove();
    // $('.page4').addClass('show');
    userImg = new Image();
    userImg.src = links + 'choose/boy_0.png';
    function getRandom(){
      return parseInt(Math.random() * 3);
    }
    var canImgArr = ['save_bg.jpg','bg/'+ getRandom() +'.png','animal/'+getRandom()+'.png','music/'+getRandom()+'.png','tips.jpg','activity.jpg','btn_entry.png','btn_replay.png'],
        canImgArrLen = canImgArr.length;
    for (let i = 0; i < canImgArrLen; i++) {
      canvas3Img[i] = new Image();
      canvas3Img[i].src = links + 'result/' + canImgArr[i];
    }
    userName = '郭菊锋_xing.org1^';
    // setTimeout(function(){
    //   drawCan3()
    // }, 3000);

  }

  function initPreLoad() {
    /* 使用javascript对图片进行预加载 */
    let num = 0,
      progress = 0; //预备变量、预加载page1所需的图片
    let imgUrl = links + 'begin/bg/',
      imgArr = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147],
      musicUrl = links + 'assets/',
      musicArr = ['click', 'choose', 'walk', 'cat', 'fly', 'bird', 'car', 'bicycle', 'stage', 'train', 'bg'],
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
    /* 预加载图片资源 */
    canvas1Img = utils.prestrain(imgArr, imgUrl, 'jpg', function () {
      num++;
      loadAni(num);
    });
    /* 预加载音乐资源 */
    musicAss = utils.prestrain(musicArr, musicUrl, 'mp3', function (a) {
      console.log(a)
      num++;
      console.log('audio',num,'总数',countNum)
      loadAni(num);
    });
  }

  /* 视频开始按钮 */
  $('.loading-end-btn').on('click', function () {
    let myVideo = document.getElementById('myVideo');
    $('.loading').fadeOut();
    /* 预加载做题动画所需图片
      // 后来考虑到，预加载只是前边的图片就行了，后边这些其实在css里边可以正常加载了，播放视频的时候再加载还不如跟着css一起，在开始时加载。
      // 但是后来发现，因为默认类名male的原因，男孩儿们的图片早就跟随css而加载了，但是女孩们的图片没有，而是当用户手动选择性别为女时，类名被切换为female，女孩们的图片才开始加载。所以关于女孩的图片还是要做预加载的。怪不得我用手机看的时候发现，女孩的图片反应慢。会看见半块头慢慢增加到脚的情况。
      let chooseImg = ['arrow','bg','bg_0','boy','boy_shadow','btn_repeat','btn_success','girl','girl_shadow','sex_box'];
      let chooseBoy = [];
      */
     
    /* 插入video并开始播放 */
    console.log(myVideo,myVideo.readyState)
    if (myVideo && myVideo.readyState) {      
      myVideo.play(); //开始播放、paused暂停播放
    } else {
      /* 视频下载0失败，执行重新加载 */
    }
    /* 预加载page2的长屏幕动画所需图 */
    /* 加载第二部分10个女孩子的正面图片 */
    for (let i = 0; i < 10; i++) {
      let img = new Image();
      img.src = links + 'choose/girl_' + i + '.png'
    }
    /* 加载第三部分需要的图片 */
    let imgArr3_jpg = ['bg_0', 'bg_1', 'bg_2', 'bg_3', 'bg_4'];
    let imgArr3_png = ['bicycle_0', 'bird_0', 'bird_1', 'buildingFix_0', 'buildingFix_1', 'buildingFix_2', 'buildingFix_3', 'bus', 'car', 'cat_1', 'cat_1_flash', 'moon', 'train', 'wire_2'];
    let imgArr3_gif = ['bird_2', 'bird_3', 'cat_0', 'guitar', 'lamp_0', 'lamp_1', 'leaflet', 'liu', 'signal', 'stage', 'zoo'];
    preLoad(imgArr3_jpg, 'jpg');
    preLoad(imgArr3_png, 'png');
    preLoad(imgArr3_gif, 'gif');

    function preLoad(arr, format) {
      let imgUrl3 = links + 'scene/';
      let len = arr.length;
      for (let i = 0; i < len; i++) {
        var img = new Image();
        img.src = `${imgUrl3}${arr[i]}.${format}`
      }
    }
  });
  $('.video1').on('canplay', function () {
    alert('canplay')
  });
  $('.video1').on('error', function () {
    alert('视频加载失败，请刷新重试')
  });

  /* 视频结束 */
  $('.video1').on('ended', function () {
    console.log('音乐资源',musicAss);
    $(this).fadeOut();
    $('.page1').fadeIn();
    $('.page1 .title').addClass('show');
    $('.page1 .txt').addClass('show');
    $('.music-btn').removeClass('hide');
    musicAss[10].play();
    musicAss[10].loop = true;
    /* canvas序列帧技术绘制page1的背景 - 需优化定时器*/
    let canvas1 = document.getElementById('canvas1');
    canvas1 && utils.canvasWH(canvas1);
    let context1 = canvas1.getContext('2d'),
      _i = 0;
    context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
    /*  使用requestAnimFrame制作序列帧动画
    function frameAni(){
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
    /* 使用定时器制作canvas序列帧动画 */
    let canvasImgLen = canvas1Img.length;
    timer1 = setInterval(() => {
      _i++;
      if (_i >= canvasImgLen) {
        _i = 0;
      }
      context1.clearRect(0, 0, utils.oW, utils.oH);
      // context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
      context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
      console.log(canvas1Img[_i]);
    }, 100);
  });
  /* 背景音乐控制 */

  $('.music-btn').on('click',function(){
    if(musicAss[10].paused){
      $('.music-btn').removeClass('off');
      musicAss[10].play();
    }else{
      $('.music-btn').addClass('off');
      musicAss[10].pause();
    }
  });
  $('.page1 .txt').on('click', () => {
    /* 销毁page1、canvas1、动画定时器、视频等 */
    $('.loading').remove();
    $('.video1').remove();
    clearInterval(timer1);
    timer1 = null;
    $('.page1').remove();
    $('.page2').show();
  });
  /* 选性别 */
  $('.main').on('click', '.sex-box li', function () {
    console.log(musicAss[0])
    musicAss[0] && musicAss[0].play();
    if ($(this)[0].className == "female") {
      userSex = 1;
      $('.choose-scroll .user-list').removeClass('male').addClass('female')
    }
    $(this).addClass('cur');
    setTimeout(() => {
      $('.choose-sex').fadeOut();
      $('.choose-person').fadeIn();
    }, 500);
    /* 调用下一页的滚动事件 - 这样保证每次点击都能重新调用，为下一次的选择性别做铺垫 */
    touchToBottom('.choose-scroll');
  });
  /* 绑定事件模拟滚动效果 - 仅适用于从上往下起始的滚动 */
  function touchToBottom(target) {
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
    var lastY = 0,
      transY = 0;
    $('.main').on('touchstart', target, function (e) {
      let y = e.originalEvent.touches[0].pageY;
      lastY = y;
    });
    $('.main').on('touchmove', target, function (e) {
      let y = e.originalEvent.touches[0].pageY,
        moveY = y - lastY;
      transY += moveY;
      if (moveY > 0 && transY > 0) {
        /* 鼠标向下移动，对应元素向上回看 */
        transY = 0; //到顶
      } else {
        /* 鼠标向上移动，对应元素向下翻看 */
        if (Math.abs(transY) >= e.currentTarget.clientHeight - utils.oH) { //触底
          transY = -(e.currentTarget.clientHeight - utils.oH) + 1;
        }
      }
      lastY = y;
      $(this).css('transform', `translate(0px, ${transY}px)`);
    });
    /* 滚轮事件 */
    $('.main').on("mousewheel", target, function (e, delta) {
      let y = e.originalEvent.deltaY;
      if (y > 0) {
        /* 向下翻滚轮 wheelDeltaY的值与之相反*/
        transY -= 100;
        if (Math.abs(transY - 100) >= e.currentTarget.clientHeight - utils.oH) { //触底
          transY = -(e.currentTarget.clientHeight - utils.oH) + 1;
        }
      } else {
        /* 向上翻滚轮*/
        transY += 100;
        if (Math.abs(transY) - 100 <= 0) {
          transY = 0; //到顶
        }
      }
      $(this).css('transform', `translate(0px, ${transY}px)`);
    });
  }
  /* 选人物 - 点击后出现追光、输入框等 */
  $('.main').on('click', '.user-list li', function (e) {
    musicAss[1] && musicAss[1].play();
    // 预加载走动人物的背影
    var _index = $(this).attr('data-id');
    var imgUrl = links + 'choose/'
    page3Obj.img1 = new Image();
    page3Obj.img2 = new Image();
    if (userSex == 0) {
      // 男
      page3Obj.img1.src = imgUrl + 'boy/' + _index + '/0.png';
      page3Obj.img2.src = imgUrl + 'boy/' + _index + '/1.png';
    } else {
      // 女
      page3Obj.img1.src = imgUrl + 'girl/' + _index + '/0.png';
      page3Obj.img2.src = imgUrl + 'girl/' + _index + '/1.png';
    }
    /* 存入结构页面绘制canvas时的人物形象图 */
    userImg.src = links + `choose/${userSex==0?'boy':'girl'}_${_index}.png`;
    console.log('人物形象图',userImg)
    // 清空上一次填过的内容
    $('.choose-input').find('input').val("");
    // 追光动画等
    let t = $(this)[0],
      mark = $('.spotlight')[0];
    $(this).addClass('cur').siblings('li').removeClass('cur');
    var a = t.offsetTop + t.clientHeight / 2 - mark.clientHeight / 2;
    var b = t.offsetLeft + t.clientWidth / 2 - mark.clientWidth / 2;
    $('.spotlight').addClass('show').css('transform', `translate3d(${b}px, ${a}px, 0)`);
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
  $('.main').on('touchstart touchmove mousewheel','.spotlight', function (e) {
    return false;
  });
  /* 重新选择 */
  $('.main').on('click','.choose-btn1', function () {
    $('.spotlight').removeClass('show').css('transform', `translate3d(0,0,0)`); //归零 - 优化原作露怯的地方
    $('.choose-scroll .user-list li').removeClass('cur');
    $('.choose-tip').fadeIn();
    $('.choose-fill-form').removeClass('show');
    $('.choose-scroll').removeClass('no-move');
  });
  /* 确定人名输入 */
  function inputEvent(){
    var name = $('.choose-input').find('input').val();
    if (name) {
      // if(filter.data.indexOf(name) > -1){//不能检测敏感词2这样的
      //   alert('含有非法敏感词，请重新输入。');
      //   $('.choose-input').find('input').val('');
      if (filterFun(name)) {
        alert('含有非法敏感词，请重新输入。');
        $('.choose-input').find('input').val('');
      } else {
        /* 存入名字 */
        userName = name;
        console.log('userName: '+userName);
        /* 进入下一环节 */
        page3();
      }
    } else {
      alert('请输入你的名字！');
    }
  }
  $('.main').on('click','.choose-btn2', inputEvent);
  $('.main').on('keypress','.choose-input input', function(){
     if(event.keyCode == 13){
       inputEvent();
     }
  });
  /* page3的自动上滑 */
  function page3() {
    /* 加载第三部分 */
    $('.page2').remove();
    $('.page3').fadeIn();
    var str = `<section class="page3"><div class="page3-ani"><div class="bg"><div class="bg0"></div><div class="bg1"></div><div class="bg2"></div><div class="bg3"></div><div class="bg4"></div></div><div class="you"><canvas id="canvas2">您的浏览器不支持canvas</canvas></div><div class="telegraph"></div><div class="birds"></div><div class="busker"></div><div class="traffic-light"></div><div class="cat1"></div><div class="zoo"></div><div class="bus"></div><div class="bus-house"></div><div class="pigeon1"></div><div class="bear"></div><div class="traffic-light1"></div><div class="pigeon1-2"></div><div class="traffic-light2"></div><div class="car1"></div><div class="car2"></div><div class="meijia"></div><div class="pigeon2"></div><div class="pig"></div><div class="biycle"></div><div class="biycle-house"></div><div class="cat2"></div><div class="stage"></div><div class="moon"></div><div class="mountain"></div><div class="train"></div></div><div class="page3-question"><div class="question"><h3>${question.data[0].title}</h3><ul class="question-list"><li>${question.data[0].option[0]}</li><li>${question.data[0].option[1]}</li><li>${question.data[0].option[2]}</li><li>${question.data[0].option[3]}</li></ul></div></div></section>`
    $('.main').append(str);
    /* 人物上行 */
    // 1. 根据用户选择绘制任务行走动画
    let Iw = page3Obj.img1.width,
        Ih = page3Obj.img1.height;
    $('.you').css({
      'width':  Iw+ 'px',
      'height':  Ih+ 'px'
    });
    let canvas2 = document.getElementById('canvas2');
    page3Obj.context2 = canvas2.getContext('2d');
    canvas2.width = Iw;
    canvas2.height = Ih;
    // 2.人物行走
    walk(page3Obj.context2,Iw,Ih);
    upup(page3Obj.startTarget[questionNum],page3Obj.walkTarget[questionNum]);
    musicAss[5] && musicAss[5].play();
    /* 预加载截图canvas要用的图片 */
    function getRandom(){
      return parseInt(Math.random() * 3);
    }
    var canImgArr = ['save_bg.jpg','bg/'+ getRandom() +'.png','animal/'+getRandom()+'.png','music/'+getRandom()+'.png','tips.jpg','activity.jpg','btn_entry.png','btn_replay.png'],
        canImgArrLen = canImgArr.length;
    for (let i = 0; i < canImgArrLen; i++) {
      // let img = new Image();
      // img.src = links + 'result' + canImgArr[i]
      // canvas3Img.push(img)
      canvas3Img[i] = new Image();
      canvas3Img[i].src = links + 'result/' + canImgArr[i];
    }
  }
  /* 人物原地行走 */
  function walk(context2,Iw,Ih) {
    /* 播放走路声音 */
    musicAss[2] && musicAss[2].play();
    /* 绘制走路动画 */
    let w = true;
    page3Obj.timer = setInterval(function () {
      context2.clearRect(0, 0, utils.oW, utils.oH);
      if (w) {
        context2.drawImage(page3Obj.img1, 0, 0, Iw, Ih);
        w = false;
      } else {
        context2.drawImage(page3Obj.img2, 0, 0, Iw, Ih);
        w = true;
      }
    }, 500);
  }
  /* 递归实现人物上行 */
  function upup(start,target){
    console.log('从 ' + start + ' 到 ' + target.y)
    if(start <= target.y){
      /* 停止走路动画 */
      clearInterval(page3Obj.timer);
      /* 要把走路的声音停止、重置 */
      musicAss[2] && musicAss[2].pause();//停止脚步声音
      musicAss[2].currentTime = 0.0;//声音进度归零
      /* 出现问题对话框 */
      $('.page3-question').addClass('show');
    }else{
      start -= 20;
      $('.you').css('transform',`matrix(1, 0, 0, 1, ${target.x}, ${start})`);
        setTimeout(function(){
          upup(start,target);
        },120);//120走的速度刚好，嫌慢改成了50
      }
  }
  
  /* 做题 */
  $('.main').on('click','.question-list li',function(){
    $(this).addClass('cur').siblings('li').removeClass('cur');
    questionL.push($(this).text().substring(0,1));
    $('.page3-question').removeClass('show');
    /* 题号加一 */
    questionNum ++;
    setTimeout(function(){
      screenToTop();
    },1000)
  });
  /* 镜头上移 */
  function screenToTop(){
    /* 镜头上移 */
    $('.page3-ani').css('transform','translateY('+ page3Obj.bgTarget[questionNum] +'px)');
    if(questionNum < questionLen){
      /* 题目修改 */
      let ques = question.data[questionNum],//当前题目
          optLen = ques.option.length,//题目个数
          str = '<ul class="question-list">';
      $('.question').find('h3').text(ques.title);
      $('.question-list').detach('');
      for(let i = 0; i < optLen; i++){
        str += `<li>${ques.option[i]}</li>`;
      }
      str += '</ul>';
      $('.question').append(str);
    }
    /* 镜头停止后要走的动画 */
      if(questionNum == 1){
        setTimeout(()=>{
          //播放猫的叫声
         musicAss[3] && musicAss[3].play();
        },500);
      }else if(questionNum == 2){
        setTimeout(()=>{
          //播放鸟振翅
          musicAss[4] && musicAss[4].play();
        },1000);
      }else if(questionNum == 3){
        //展开第3个动画,第一个汽车立马动起来
        $('.page3 .car1').addClass('ani');
        musicAss[6] && musicAss[6].play();
      }else if(questionNum == 4){
        setTimeout(()=>{
          //展开第4个动画,播放自行车
          $('.page3 .biycle').addClass('ani');
          musicAss[7] && musicAss[7].play();
        },100);
      }else if(questionNum == 5){
        setTimeout(()=>{
          //展开第5个动画
          $('.page3 .train').addClass('ani');
          $('.page3 .moon').addClass('ani');
          musicAss[9] && musicAss[9].play();
        }, 1000);
      }
    setTimeout(()=>{
      walk(page3Obj.context2,page3Obj.img1.width,page3Obj.img1.height);
      if(questionNum <= page3Obj.startTarget.length){
        if(questionNum == 2){
          //展开第二个动画,运动bus，
          $('.page3 .bus').addClass('ani');
          setTimeout(function(){
            upup(page3Obj.startTarget[questionNum],page3Obj.walkTarget[questionNum]);
          },500);
        }else if(questionNum == 3){
          //展开第3个动画,播放两个汽车
          $('.page3 .car2').addClass('ani');
          musicAss[6] && musicAss[6].play();
          setTimeout(function(){
            upup(page3Obj.startTarget[questionNum],page3Obj.walkTarget[questionNum]);
          },1500)
        }else if(questionNum == 4){
          //展开第4个动画,播放自行车
          musicAss[8] && musicAss[8].play();
          setTimeout(function(){
            upup(page3Obj.startTarget[questionNum],page3Obj.walkTarget[questionNum]);
          },500)
        }else if(questionNum == 5){
          //封镜
          // $('.page3 .train').addClass('ani');
          // $('.page3 .moon').addClass('ani');
          // musicAss[9].play();
          $('.main').append('<video class="video video2" id="myVideo2" src="../images/assets/run.mp4" x5-video-player-type="h5" x-webkit-airplay="true" airplay="allow" playsinline="" webkit-playsinline="" >您的浏览器不支持video标签</video>');
          setTimeout(function(){
            // 播放第二段视频
            $('.page3').addClass('remove');
            setTimeout(()=>{
              $('.video2').addClass('show');
              let myVideo2 = document.getElementById('myVideo2');
              if (myVideo2 && myVideo2.readyState) {
                myVideo2.play(); //开始播放、paused暂停播放
                $('.main').append('<section class="page4"><div class="page4-main"><div class="card"><canvas id="canvas3" class="canvas3">您的浏览器不支持canvas</canvas></div><div class="page4-btns"><div class="reload">重回平行世界</div><div class="about">新知青年说</div></div></div></section>');
              }
              /* 计算做题结果 - 随便random吧 */
              // 画canvas
              drawCan3();
            },500)
            $('.video').on('ended', function () {
              /* run.mp4播放完毕 */
              $('.page3').remove();
              $('.video2').remove();
              $('.page4').addClass('show');
              // 执行canvas画图
            });
          },2500);
        }else{
          upup(page3Obj.startTarget[questionNum],page3Obj.walkTarget[questionNum]);
        }
      }
    },2000)
  }
  
  function drawCan3(){
    let canvas3 = document.getElementById('canvas3'),
        newCan = document.createElement('canvas'),
        scale = 2, //定义任意放大倍数 支持小数
        can3Ow = 640,
        can3Oh = 1138,
        userImgOw = userImg.width,
        userImgOh = userImg.height,
        context3 = canvas3.getContext('2d'),
        newCanCont = newCan.getContext('2d');
    // canvas3.style.width = can3Ow// * scale + "px";
    // canvas3.style.height = can3Oh// * scale + "px";
    canvas3.width = can3Ow// * scale; //定义canvas3 宽度
    canvas3.height = can3Oh// * scale; //定义canvas3高度
    newCan.style.width = can3Ow + "px";
    newCan.style.height = can3Oh + "px";
    newCan.width = can3Ow;
    newCan.height = can3Oh;
    /* 连续绘制底图 */
    for (let i = 0; i < 4; i++) {
      context3.drawImage(canvas3Img[i], 0, 0, can3Ow, can3Oh);
      newCanCont.drawImage(canvas3Img[i], 0, 0, can3Ow, can3Oh);
    }
    newCanCont.drawImage(userImg, can3Ow / 2 - userImgOw / 2, can3Oh / 2 - userImgOh / 2 - 90, userImgOw, userImgOh);
    context3.drawImage(userImg, can3Ow / 2 - userImgOw / 2, can3Oh / 2 - userImgOh / 2 - 90, userImgOw, userImgOh);

    /* 绘制文案 */
    let txtNum = result['question_'+parseInt(Math.random() * 4)][parseInt(Math.random() * 3)]
    console.log(txtNum)
    drawName(context3);
    drawName(newCanCont);
    function drawName(canvas){
      // 绘制姓名
      canvas.fillStyle = "#6e737b";
      canvas.save();
      canvas.font="600 40px Arial";
      canvas.fillText(userName, 48*2, 60*2);
      canvas.restore();
      // 绘制总结语言
      canvas.font="24px Arial";
      canvas.textAlign="center";
      canvas.fillStyle = "#2B333D";
      canvas.fillText(txtNum[0], can3Ow / 2, 12 * 2 + 430 * 2);
      canvas.fillText(txtNum[1], can3Ow / 2, 12 * 5.5 + 430 * 2);
      canvas.fillText(txtNum[2], can3Ow / 2, 12 * 9 + 430 * 2);
    }
    
    /* 长按保存图片绘制 */
    context3.drawImage(canvas3Img[4], 0, can3Oh - canvas3Img[4].height, canvas3Img[4].width, canvas3Img[4].height);
    /* 图片base64 */
    var img = new Image();
    img.src = newCan.toDataURL(['jpg', 0.9]);
    $('.card').append(img);

    /* 按钮点击 */
    $('.about').on('click',function(){
      let str = '<section class="page5"></section>'
      $('.main').append(str);
      $('.page5').addClass('show');
    });
    /* 重回平行世界 */
    $('.reload').on('click',function(){
      /* 重置结构 */
      let str = '<section class="page2"><div class="choose-sex"><p class="h1">请选择你的性别</p><ul class="sex-box"><li class="male"><div class="bg"></div><div class="icon"></div></li><li class="female"><div class="bg"></div><div class="icon"></div></li></ul></div><div class="choose-person"><div class="choose-scroll"><div class="bg"></div><ul class="user-list male"><li class="user-list0"data-id="0"></li><li class="user-list1"data-id="1"></li><li class="user-list2"data-id="2"></li><li class="user-list3"data-id="3"></li><li class="user-list4"data-id="4"></li><li class="user-list5"data-id="5"></li><li class="user-list6"data-id="6"></li><li class="user-list7"data-id="7"></li><li class="user-list8"data-id="8"></li><li class="user-list9"data-id="9"></li></ul><div class="spotlight"></div></div><div class="choose-tip">上滑选择你的人物</div><div class="choose-fill-form"><div class="choose-input"><input type="text"placeholder="请填写你的名字"maxlength="10"value=""></div><div class="choose-btn"><div class="choose-btn1">重新选择</div><div class="choose-btn2">确定</div></div></div></div></section>'
      $('.main').append(str);
      $('.page4').remove();
      /* 重置数据 */
      userSex = 0;
      questionL = [];//用户选择答案
      questionNum = 0;//当前题号
    })
  }
});