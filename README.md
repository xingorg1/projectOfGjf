# 【专栏】站在巨人的肩膀上看世界 — — 仿做高级的h5项目
#### 原作传送门：
[《平行世界的你》](http://static.adcode.cn/20180508-zhihu-young/index.html?from=singlemessage&isappinstalled=0)
#### 我的demo地址：
[《project from xing.org1^》](https://xingorg1.github.io/projectOfGjf/)

# 以下总结要解决的问题(自己需要学习的知识点)
## 移动端适配方案（rem写法及转换）
  html:
  ```html
    <meta http-equiv="Expires" content="0" />
    <meta http-equiv="Cache-Control" content="no-cache" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta name="wap-font-scale" content="no" />
    <meta name="applicable-device" content="mobile" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
  ```
  js:
  ```js
  <script>
    (function () {
      var b = document.createElement("meta");
      b.setAttribute("name", "viewport");
      var c = window.devicePixelRatio,
        a = c ? 1 / c : 1;
      window.screen.availWidth == document.documentElement.offsetWidth && (c = a = 1);
      document.documentElement.setAttribute("data-dpr", c || 1);
      window.navigator.userAgent.match(/android/i) ? b.setAttribute("content", "width=device-width, initial-scale=" +
        a +
        ", maximum-scale=" + a + ", minimum-scale=" + a + ", user-scalable=no") : b.setAttribute("content",
        "initial-scale=" + a + ", maximum-scale=" + a + ", minimum-scale=" + a + ", user-scalable=no");
      document.head.appendChild(b)
    })();
    var dpr = document.documentElement.getAttribute("data-dpr") || 1,
      width = document.documentElement.offsetWidth,
      fontSize = 100 / 750 * width;
    document.querySelector("html").style.fontSize = fontSize + "px";
    window.addEventListener("resize", function () {
      var a = 100 / 750 * document.querySelector("html").offsetWidth;
      document.querySelector("html").style.fontSize = a + "px"
    });
  </script>
  ```

## 检测
  ### 一、检测是不是手机看,并添加横屏or竖屏观看监听
      
  这个的止步点在于，什么时候检测分辨率？

  我发现我开关控制台左上角的模拟器按钮，在不用刷新页面的情况下他都能检测的到不是竖屏观看，然后就提醒我横屏手机。

  难道是开了定时器？不应该

  是不是有什么事件可以监听window的屏宽？

  有没有可能是用的css的@media！！某个分辨率下让其显示？

  这种猜测倒果然没错，跑回去看人家的效果，果然就是用的@media哈哈好开心。

  虽然media的原理被我想到了，但是他的处理方法还是不太一样：

  他用了这个：
  ```css
  @media (orientation: landscape)
  ```
  结果一百度，w3c还在真有这个东西的介绍：

  orientation(方向，定向): 监听输出设备的可是宽度是否大于或等于高度；

  两个参数：

      portrait(肖像/描写)：高度 >= 宽度

      landscape(风景画/景色/山水画)： 除protrait之外的所有情况都是这个

  所以，当他设置orientation：landscape时，就是只要宽度大于高度就会起作用！比自己设置一个定死的值还要好用！
  ### 二、检测是否微信环境
  此问题我的解决思路是利用ua判断微信环境即可，具体的关键知识点如：
  ```js
    window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger'
  ```


## 预加载、懒加载和进度条
  这三个配合起来，就是目前这种动画的优化处理方式
  ### 1、预加载图片等资源
  **预期效果：** loading的时候加载视频和部分图片，等到看第2页的时候加载第三页的效果。

  **实现思路：**多个图片地址拼成数组，new Image并设置src实现预加载
      
  ```js
    let musicArr = ['bicycle', 'bird', 'car', 'cat', 'choose', 'click', 'fly', 'stage', 'train', 'walk'],
        newArr = [];

    musicArr.forEach((ele)=>{
      var img = new Image();
      img.src = ele;
      <!-- newArr.push(img); -->
    })
  ```

  ### 2、预加载时展示的进度条效果
  **预期效果：** 加载图片的进度以进度条甚至百分比文案的方式展示给用户，防止用户跳出

  **实现思路：**css动画监听进度条的宽度。js监听资源的onload、onerror事件、complete属性，并记录总数。

  **基本实现代码：**详情见：index.js中的```initPreLoad()```方法，配合抽离出来的utils.js中的```prestrain()```方法。

      ```onload```：监听本图片加载成功，则已加载（确切的说被处理）的图片数目+1，所有被处理图片的总数+1；

      ```error```：监听本图片加载失败，则加载失败（确切的说被处理）的图片数目+1，所有被处理图片的总数+1；

      ```complete```：监听本缓存图片准备完毕，也是加载成功的一种，则已加载（确切的说被处理）的图片数目+1，所有被处理图片的总数+1；

      记录数目为了后边的进度条计算百分比使用。

    进度条计算百分比的js算法：当前加载进度 = parseInt(所有被处理图片总数/需要加载图片总数 * 100)

  **文字逐增变化的css动画实现：**

    配合jq的```animate()方法```，
    
    1、设置第一个参数的count为计算得来的当前加载进度，

    2、step方法中做极值的处理。

  ```js
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

  ```


  ### 3、懒加载 **(未解决)**
  不属于本次项目所有效果

  ### 4、思考：什么情况下要做预加载？尤其当图片是用背景图制作的时候
  如果一个元素是display:none;的时候，这个元素的背景图会不会一开始就加载？

  如果这个元素的某一个类名是背景图，当这个元素还没这个类名，但是背景图的样式提前在css中时，那么是否只有js动态给这个元素加上对应类名时，对应的图片才会加载？

  如果一个元素根本就不存在dom中，但是背景图的样式提前在css中，是css加载时图片就被加载还是只有当dom被append到body时图片才会加载？

## video 的各种问题
  ### 1、video常用的属性和方法（w3c的video标签）
  **方法：**

  1. play() chick事件（或其他条件）执行播放功能

  2. pause() chick事件（或其他条件）暂停视频播放

  * 这俩方法使用jq的```$('.video')```不起作用，但是改成````document.getElementById('myVideo');```就可以了

  **属性：**

  1. currentTime 资源当前播放时间

  2. duration 资源时长

  **可监听的事件：**

  1. canplaythrough && readyState==3 加载完成

  2. canplay  && readyState==2 可以播放 

  3. error 下载错误/失败 abort 下载中断

  4. load 加载完成（可能被废弃，请用第一个）

  5. play 开始播放触发

  5. pause 暂停播放触发

  5. ended 监听视频播放完毕（zei好用）

  ### 2、如何隐藏video控件的解决方法（尤其是在安卓机）
  * 在ios和浏览器模拟器中，不写属性controls就不会有播放控件

  * 在安卓中，可以使用canvas的drawImage()方法绘制视频，虽然不如原生视频的效果流畅，但是终究能够解决不要控件的这个硬性问题。毕竟这种一镜到底的动画，当用户暂停了视频，后边的工作就白做了。

  ### 3、视频标签video不支持时换成canvas播放
  大致同上边第2条。普遍用于安卓里隐藏控件。真要不支持video，那canvas也不一定支持。

## music 的各种问题
  ### 背景音乐的init预加载和后期多段交互音乐的预加载
  我这里预加载用了js的new Audio()方法建立了多段音频对象：

  ```js
  assetsArr[i] = new Audio();
  assetsArr[i].src = `${imgUrl}${imgArr[i]}.${format}`;
  assetsArr[i].oncanplaythrough  = function(){
    // *这里，音频文件使用onload不能监听
    callback();
  }
  return assetsArr;//最后抛出去音频对象集合
  ```
  ### 背景音乐的播放控制
  开始播放：```play()```;
  
  暂停播放： ```pause()```;

  **注意1：** play()和pause()是dom的方法，不是jq的方法。如果使用jq获取的audio DOM对象，需要转化成js对象才能控制：
  
  ```js
  $('audio')[0].play()//或pause();
  ```

  **注意2：** play()或pause()之前，最好判断下音频是否准备完毕：

  利用Audio对象的redystate这个属性：

  ```js
  if(musicAss[2].readyState == 4){
    musicAss[2].play()
  }
  ```
  ### audio的音频资源暂停后重新```从头```开始播放
  问题描述：人物走路的背景音乐。

  每次人物开始走动播放音乐，停止走动暂停音乐。因为走路的音乐只有几秒，且被重复使用，导致第二次开始走路时，音乐接上一次暂停处开始播放，进而出现人走一半还没停音乐就没有的情况：

  所以需要解决的是：每次人物走路，音乐要重新从头开始播放，而不是接着上一次的播放。

  **解决方案：**

  每次暂停调音乐后，利用currentTime（已经播放的秒数）这个属性，将已经播放的秒数设置为0。相当于将音乐播放进度条拖回到0。再次播放就是正常的了。

  ```js
    musicAss[2] && musicAss[2].pause();//停止脚步声音
    musicAss[2] && musicAss[2].currentTime = 0.0;//声音进度归零
  ```
  ### js里new 的Audio对象，怎么设置成重复循环播放的？
  ```loop```属性，是个布尔值，默认是false，不重复播放的。设置为true即可。
## 动画 的各种问题
  ### 1、"即将进入平行世界" 文案后边的  “...”  动画
  首先，我能理解他后边点点是通过animation制作的帧动画，对应关键帧上边让伪类的内容展示对应个数的点：
    ```css
      @keyframes ellipseAni{
          0%,100%{
              content: "";
          }
          25%{
              content: ".";
          }
          50%{
              content: "..";
          }
          75%{
              content: "...";
          }
      }
    ```
    但是我不能理解他下边这段的处理，在加载完毕需要隐藏这句文案的时候，他是一行一行的注释加上去的，感觉像js控制注释的而不是通过类名切换隐藏的。
    ```html
      <!-- <div class="loadingtxt"> -->
          <!-- <span>即</span> -->
          <!-- <span>将</span> -->
          <!-- <span>进</span> -->
          <!-- <span>入</span> -->
          <!-- <span>平</span> -->
          <!-- <span>行</span> -->
          <!-- <span>界</span> -->
          <!-- <span>世</span> -->
      <!-- </div> -->
    ```

  ### 2、css里的缓动动画 - 符合运动规律的动画【贝塞尔曲线】

  ### 3、火车、小汽车、自行车等运动的动画
  简单的animation动画而已，比如火车的：
  ```css
    .train {
      position: absolute;
      width: 12rem;
      height: 8.4rem;
      background: url(#{$scene}train.png) no-repeat;
      background-size: 100% 100%;
      transform: rotate(-4deg);
      &.ani {
        animation: train 4s;
        animation-fill-mode: forwards;
      }

      @keyframes train {
        from {
          top: 918px;
          left: -970.1px;
        }

        to {
          top: 1358px;
          left: -125px;
        }
      }
    }
  ```
  ### 4、由汽车动画引发的切图技巧问题
    从房子后边出来的汽车，需要房子的遮盖，这涉及到前期切图时的技巧。

    因为车子是在马路上的， 而房子需要挡住车子的出发点。我切图的时候，可能会把房子和马路切开来。但是本项目中，原作做法是房子马路当背景，另扣一套和车子有折叠的房子出来定位到对应位置。

    这么做好处就是有参照点，只要对齐就行

    坏处就是，经常性的对不齐，上下左右任何一个方向错一像素都有可能被提bug。

    而我平时的分开切图的方法是，能够快速解决层级问题，而不用特别精确的定位。

    但是缺点不知道文件体积会不会变大,也就是房子有可能加载慢，只能看到光秃秃的马路和汽车。
  ### 5、怎么监听css里animation的动画结束？
  不能全部用setTimeout设置定时器触发动画结束后的程序吧。

  两种写法，原理都是监听animationend事件：

  ```js
  $('.page3 .bus').on('animationend',function(){
    console.log('动画完毕')
  })
  var bus = document.getElementsByClassName('bus')[0];
  bus.addEventListener('animationend',function(){
    console.log(this)
  })
  ```
  然后比较low一点的方法，就是setTimeout设置定时器。

  但是这种方法比较好点的地方就是，可以设置的时间是早于动画或者动画播完后等一会再执行的。


## canvas 的各种问题

  ### 1、css设置居中不起作用
  ```css
  .canvas2{
    width: 6.4rem;
    height: 100%;
    margin: 0 auto;//没起作用
    background: #fff;
  }
  ```
  ### 2、canvas序列帧制作动画
  【动画就是将物体的运动以每秒24格的时间分格法逐一分解、绘制并拍摄记录成序列图片，再以每秒24格的播放速度播放出来，利用人的“视觉暂留”原理产生连续运动的视觉效果】

  简单来说，就是通过一直切换一张一张不同的序列图片连续交替出现，让静止的图像看上去像是播放的动态影像。

  **实现关键：** 就是定时器```setInterval```和```setTimeout```或者更强大的```window.requestAnimationFrame```

  **推荐**：两篇偶像的深入剖析文：[定时器](https://www.cnblogs.com/xiaohuochai/p/5773183.html)和[requestAnimationFrame](https://www.cnblogs.com/xiaohuochai/p/5777186.html)

  #### 新API```requestAnimationFrame```
  封装代码：
  ```js
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function(callback,element) {
        return window.setTimeout(callback, 1000 / 60);//1000ms/60.最佳循环间隔
      };
  })();
  ```

  那每一次定时器我们要做什么呢？就是切换并重新绘制图片。

  ### 3、绘制图像 - canvas.drawImage()方法
  [看这一页api就够用了](http://www.w3school.com.cn/html5/canvas_drawimage.asp)

  **思路代码：**
  ```js
    var canvas1Img = [],
      timer1 = null,
      canvas1 = document.getElementById('canvas1'),
      context1 = canvas1.getContext('2d'),
      _i = 0;
    /* canvas序列帧技术绘制page1的背景 - 需优化定时器*/
    canvas1 && utils.canvasWH(canvas1);
    context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
    /* 使用requestAnimationFrame的写法，这里进行过封装
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
    timer1 = setInterval(() => {
      _i++;
      if (_i >= canvas1Img.length) {//canvas1Img是预加载时存放的所有图片对象的数组
        _i = 0;
      }
      context1.clearRect(0, 0, utils.oW, utils.oH);//再次绘制时要把上次绘制的清除，就像要擦黑板一样。
      context1.drawImage(canvas1Img[_i], 0, 0, utils.oW, utils.oH);
      console.log(canvas1Img[_i]);
    }, 100);
  ```

  ### 4、序列帧优化（雪碧图）
    因为需要切换多张不同的图片达到序列帧效果，那势必要多次去请求图像。为了优化，当图像尺寸比较小时可以考虑制作成雪碧图样式。

    那样每次重新drawImage的时候，只需要改变开始绘制的坐标值就行了，而不是直接替换图片链接。

  ### 5、行走的人动画
  **1、人物原地踏步**

  在canvas序列帧实现的基础上，交替更新两张图，分别是任务迈左腿和迈右腿的图。

  需要任务站立停止时，让canvas的序列帧停止。

  **2、人物上行**

  这里，原作使用```transform：matrix()```改变最后两个参数实现的。主要原理就是```translateX```和```translateY```的位移。

  但是我用递归实现不了，一开始是不小心写死循环，后来是实现了位移但是人物图像却没有了。

  实际人物上移和镜头上移，都使用了js的逐渐趋近计算（专业名词要看慕课网《大鱼成长》游戏）。

  ### 6、原生canvas实现截图
  以前用html2canvas的时候，截图出来文字糊，可以新建canvas放大两倍再当参数穿进去，

  现在截图的话，直接用canvas画布怎么处理？

  ### 7、API之 context.drawImage()
  #### a. 一个报错现象引发的坑点：
  ```
  Uncaught TypeError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The provided value is not of type '(CSSImageValue or HTMLImageElement or SVGImageElement or HTMLVideoElement or HTMLCanvasElement or ImageBitmap or OffscreenCanvas)'
  ```
  原因是传入的第一个参数不是image对象。因为用了arr[0],但是此时调试模式，将很多代码关掉了，导致arr还是个空数组，所以传入的是undefined而不是存了多个img图像的

  #### b. 截图空白
  还是因为测试的原因，（因为正常流程会做图片预加载，）测试时将图片加载和canvas画图流程凑到了一起，绘制图片时图片还没加载完毕，导致绘制图片空白。

  改成img.loaded后再绘图就好了。所以切记，绘图前一定要确保图片加载完了。

  ---两种解决方案---

      1是dom中插入隐藏的img标签，然后window.onload后画图就没问题

      2是监听图片的load事件。

  #### c. 连续绘制的坑
  canvas连续draw图片的时候,需要一定间隔,这个问题是在IOS发现的,使用Android没有问题,IOS有时会出现之后draw没有绘制成功的问题,加间隔后解决

  ### 8、API之 canvas.toDataURL() 
  注意：

  a. 书写方式，大写，最后三个字母是大写。

  b. 参数：第一个为图片格式-字符串格式。第二个为图片质量-数字格式。

  ### 9、末尾截图的“偷梁换柱”功能：

  **功能描述**：

  看上去的canvas里边有“长按存图”的文案，但是实际截图出来的没有那句话。

  **实现效果分析**：

  那句话是一个图片盖住了话后边的二维码，整个的还是一个canvas。

  我猜测他是截图时过滤掉写着“长按存图”的图片，进而截出最终效果。

  但具体怎么执行toDataURL的时候，隐藏/过滤其中一个drawImage呢？


  **解决方案**：
  后来想到一个方法，虽然dom结构中看上去只有一个canvas

  但是js中可以新建一个canvas，然后处理这个canvas成为base后的图片啊！

  最后实现代码：
  ```js
  var newCan = document.createElement('canvas'),
          newCanCont = newCan.getContext('2d');
      newCan.style.width = can3Ow// * scale + "px";
      newCan.style.height = can3Oh// * scale + "px";
      newCan.width = can3Ow// * scale; //定义canvas3 宽度
      newCan.height = can3Oh// * scale; //定义canvas3高度
      newCanCont.drawImage(canvas3Img[0], 0, 0, can3Ow, can3Oh);

      var img = new Image();
      img.src = newCan.toDataURL(['jpg', 0.9]);
      $('.card').append(img)
  ```
  就是两套canvas，然后第二套不放到dom中，而是js动态的```createElement```

  ### 10、canvas字体绘制

  #### a. 特殊字体： content.[font](http://www.w3school.com.cn/html5/canvas_font.asp)属性
  普通电脑自带的字体这样设置：加粗、字号、字体。
  ```js
  context.font = "600 40px Arial";
  ```
  特殊字体怎么设置？
  （见下边特殊字体篇章）。

  #### b. 文字绘制： content.[fillText()](http://www.w3school.com.cn/html5/canvas_filltext.asp)方法
  api:
  ```js
  context.fillText('文案',x,y,maxwidth)
  ```
  #### c. 文字颜色修改 content.fillStyle
  ```js
  context3.fillStyle = "#2B333D";
  ```

  ### 11、长按存图 - 并且存的是另一张图片：
  另一张图的绘制见上边第9条。

  结构上，需要保存的另一张图片置顶，盖在可视canvas的上边，透明度为0就可以了。

  (可以设置为0.01,设置为0时在有些机器下有bug)[微信中如何长按图片保存的是另一张图片](https://blog.csdn.net/w20101310/article/details/60580241)



## 特殊字体的各种问题
  特殊字体文件的预加载

  css中应用特殊字体

  canvas中应用特殊字体

## 各种css特殊效果处理思路

  ### 1、**display: -webkit-box;-webkit-box-orient: vertical**
  选择性别处元素在垂直方向自适应效果

  ### 2、**alternate-reverse**
  两个性别的闪光特效，是交替间隔的
  ### 3、**radial-gradient**
  闪光灯效果用css3的景象渐变+动画（和追光的渐变样式制作差不多）
  ### 4、**transform: matrix(1, 0, 0, 1, -43.3594, -1216.41);**
  制作行走的人时，改变人物的位置通过css3的位移改变的，这一点可以考虑到。

  但是原作用的这个属性matrix需要学习。

  ### 5、filter属性 

  [文档看这里，我就不搬过来了](http://www.runoob.com/cssref/css3-pr-filter.html)
  a. **grayscale(0-100%)**: 灰度图片。

      0为纯灰色，100%为纯灰色。当然也可以是0-1的小数。

      有点设计学里边，将图像颜色的饱和度降值的意思。

      兼容性上，ie不支持。用在移动端可以放心一点了。

  b. **brightness(50%)**：改变图片的明暗效果

      这个效果在项目中，多用在颜色比较暗的文字上，用了比较暗的颜色值，但是用了这个属性颜色值提亮了。我想这不是原作为了用而用，设计稿上应该就是这个颜色值然后添加了提亮度的蒙版吧。

      只想说，学过设计的再来了解这个函数的各个属性值，真的好easy，甚至连效果都不用做都能想象出来长啥样。我想也是因为css的魔性，我才从设计转到前端的吧。只想玩视觉上的东西，而代码改变的视觉又有崇高的魔力。

  这段时间听施展讲武则天的历史，一句话让我很是深刻，当你忘了你要去往何方，那就回头看看来时的路。再来走一遍。学前端学到迷茫，项目都能做，但是问我问题就是不能达到理想。想放弃，现在学到这里，又想到了为什么走到这里。或许喜欢前端是始于颜值（css）但是现在陷在js的才华和魔力里无法自拔。因为太累，拔不动了哈哈哈哈哈哈哈哈哈哈

  言归正传，filter还有好多属性啊：

  c. **blur** 管模糊效果的，以实现摘了眼镜看世界的你看到的画面

  d. **opacity** 透明度

  e. **hue-rotate** 跟色相有关

  f. **saturate** 调颜色饱和度，比如让红色更红，会让浅粉色变成纯红那样

  记个大概，知道有这么个东西，少占点大脑内存，用到的时候再过来找。

  ### 6、calc属性
  设置的高度值可以实现元素的高随着手机响应

  ### 7、追光灯效果的实现
  a. **思路**：

  背景透明度的径向渐变+translate的位移

  b. **css-实现聚焦效果**：

  c. **js-控制translate位移实现灯光追踪效果**：

## 各种js交互效果
  ### js模拟页面滚动效果
  （选择喜欢的角色处）(待写)

  可以应用到移动端弹层滚动上，解决滚动穿透的问题。。

  #### a、思路：

  监听触摸事件(监听鼠标事件同理):

      start时、鼠标按下记录当前鼠标的x y位置（这个效果特殊，只需要监听y轴位置即可）

      move时、鼠标移动获取新的y值，如果大于start的y值就是向下移动(元素的scrolltop/offsetTop增加),反之向上(元素scrolltop/offsetTop减少)【实验时企图设置$(this)[0].offsetTop失败，说是可读属性不能赋值】

  [借助原著的启发，最后利用css3的translate属性对元素进行上下移动]

  #### b、问题亮点：

    * 拿目标元素的位置scrollTop

    * 拿事件的鼠标位置touches【jq on绑定的时候，e返回的不是事件event，而是目标元素$(this)】

    * 注意碰撞检测
  #### c、移动端使用的touch事件

  #### d、pc端的mousewheel事件

  #### e、总结：

  核心是让长图滚动的值scrollTop=角色所在的offsetTop值

  ### input输入框监听页面的回车事件
  事件绑定到input上
  然后事件回调中，监听event.keyCode是否等于13，因为回车键的键码就是13。


## 兼容适配的各种问题

  1. 安卓中隐藏视频控件使用canvas

## 性能优化的各种问题：
  原作中关于性能优化的问题及解决方法：

  1、 资源的预加载（给个进度条让人稍等）

  2、 但又不是全部加载完，而是一小块一小块section的结构加载（如何解决）

  3、 并且在展示本section的时候，加载以准备下一段section的资源。（如何解决）

  4、 长图切成好几块

  5、 人物走路的合成图也是，点击选择了人物才加载指定人物的背影图

## 拥有很多名单的json文件【敏感词库】
  这个是一个过滤清单，在这个清单里，是用户不能输入的文案。在用户输入名字的地方使用。

  具体用法就是拿到用户输入的名字信息，去json文件中进行查找，如果找到了就提示含有敏感词，并将input输入框清空让其重新输入。

  初步做法，我是用的arr.indexOf(内容) > -1进行判断是否有敏感词。

  但是我做测试时，输入json中有的关键字确实可以屏蔽，
  但是我加一个数字或其他的字，又跳过了屏蔽。

  比如“数组”是敏感词，但是我输入“数组1”就不算敏感词了，显然这种判断是不行的。（因为indexOf使用===严格等于）

  这就很尴尬。。


# 站到巨人肩膀上
  最后 -提炼原作的js，研究大神的处理方式，对比与自己不同的地方，总结优缺点、拓宽新思路和新编程风格。

## js源码中很多值得学习的思路,一定要研究
  ### 对于视频的预加载和控制 封装
  ### 对于音频的预加载和控制 封装
  ### hm.gif文件是啥？
    链接为“https://hm.baidu.com/hm.gif?”的hm.gif文件是啥？

    完整链接[点击查看](https://hm.baidu.com/hm.gif?cc=0&ck=1&cl=24-bit&ds=375x667&vl=667&et=0&ja=0&ln=zh-cn&lo=0&lt=1543370299&rnd=1798447143&si=2462e2d1c4859883c428e8da7b3b4b18&su=http%3A%2F%2Fstatic.adcode.cn%2F20180508-zhihu-young%2Findex.html%3Ffrom%3Dsinglemessage%26isappinstalled%3D0&v=1.2.34&lv=3&api=4_0&ct=!!&u=http%3A%2F%2Fstatic.adcode.cn%2Fscene&tt=平行世界的你&sn=6339)

## 第三部分选题时，动态填充结构的原因

  ### 从浏览器的渲染机制理解js填充dom的原因
    学了浏览器里边的页面渲染顺序，你看看能不能理解他们用js填充dom结构的思路了？

  ### 不是动态填充而是加载html页面？ 

    通过network面板观察，像page3这样的section结构不是js动态填充的，而是一个类似scene.html的页面：
    [scene.html的页面](http://static.adcode.cn/20180508-zhihu-young/asset/tpl/scene.html)。
    
    打开看源码便知。不是普通的html页面，因为没有doctype等标签。但是是什么技术加载到主页面中的呢？
  ### 动态结构的事件委托
    因为后边重回平行世界是动态填充的结构回页面，之前绑定的事件就需要事件委托。


# 接下来还有的任务大致步骤
  ## 流程
  【X】改bug，首页btn延迟出现

  【X】视频1播放时 第二阶段图片预加载(预加载可以不做了，因为css提前做了)

  【x】但是第二阶段的女孩子图片，因为是添加类名后才会有背景图样式加载，也就是背景图才会加载，所以也需要预加载。

  【x】点击人物追光时，加载行走人物背影图

  【X】第三部分图片预加载

  【X】确定按钮做敏感词判断（重做名字输入时的敏感词判断）

  【X】有规律的分屏上移动画（以点击屏幕为触发事件）

  【X】分屏中汽车等动的动画执行

  【X】分屏中人物上移动画

  【X】人物移动完毕的题目加载

  【X】点击题目切屏

  【X】最后一题完毕切换video播放（音乐预加载在选好人物开始做题时）

  【X】视频2播放，

  【X】加载html2canvas所需图片

  【X】制作结果页面

  【X】计算做题结果,绘制结果页canvas - 本来需要算法、通过不同的选择得到不同的答案，这里偷懒用了随机数随机出现文案吧。

  【X】html2canvas转成图片效果(这里作者直接画的canvas，然后base成图片的)。

  【X】加载总的背景音乐

  【X】背景音乐播放、开关控制、重复播放

  【X】切屏加载音效

  【】特殊字体


  ## 待处理的适配问题
  【】video不支持时换成canvas播放
  【】安卓端/其他手机端，适配问题+page3里边人物变小的问题（总结就是canvas在大屏手机里要放大一倍的问题。）

  ## 待优化的功能
  【X】输入名字支持按回车，执行确定功能
  【X】火车和月亮升起到canvas绘制那里不连贯（是一个bug，run.mp4视频没有播放）


  #### 最后的最后，从设计绘画，到视频制作，再到音频调配，从静态页面，到前端动画与交互，再到后端部署与上线。终于可以提供一条龙服务了。呼哈哈哈，我都开始有点佩服自己了^_^!!!

  # flag 下一个动画 - canvas深交互的。