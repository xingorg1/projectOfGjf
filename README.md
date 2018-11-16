# 【专栏】站在巨人的肩膀上看世界 — — 仿做高级的h5项目
#### 原作传送门：

[《平行世界的你》](http://static.adcode.cn/20180508-zhihu-young/index.html?from=singlemessage&isappinstalled=0)

#### 我的demo地址：

[《project from xing.org1^》](https://xingorg1.github.io/projectOfGjf/)

# 以下总结要解决的问题(自己需要学习的知识点)
## 移动端适配方案（rem写法及转换）
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

## 检测是不是手机看，让其横屏
    
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
       

## 检测是不是微信环境看，不是的话不让看
此问题我的解决思路是利用ua判断微信环境即可，具体的关键知识点如：
```js
  window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger'
```


## 预加载、懒加载和进度条
  这三个配合起来，就是目前这种动画的优化处理方式
### 1.预加载图片等资源
预期效果：loading的时候加载视频和部分图片，等到看第2页的时候加载第三页的效果。

实现思路：多个图片地址拼成数组，new Image并设置src实现预加载
    
```js
  let musicArr = ['bicycle', 'bird', 'car', 'cat', 'choose', 'click', 'fly', 'stage', 'train', 'walk'],
      newArr = [];

  musicArr.forEach((ele)=>{
    var img = new Image();
    img.src = ele;
    <!-- newArr.push(img); -->
  })
```

### 2.预加载时展示的进度条效果
预期效果： 加载图片的进度以进度条甚至百分比文案的方式展示给用户，防止用户跳出

实现思路：css动画监听进度条的宽度。js监听资源的onload、onerror事件、complete属性，并记录总数。

基本实现代码：index.js中的```initPreLoad()```方法，配合抽离出来的utils.js中的```prestrain()```方法。

```onload```：监听本图片加载成功，则已加载（确切的说被处理）的图片数目+1，所有被处理图片的总数+1；

```error```：监听本图片加载失败，则加载失败（确切的说被处理）的图片数目+1，所有被处理图片的总数+1；

```complete```：监听本缓存图片准备完毕，也是加载成功的一种，则已加载（确切的说被处理）的图片数目+1，所有被处理图片的总数+1；

记录数目为了后边的进度条计算百分比使用。

进度条计算百分比的js算法：当前加载进度 = parseInt(所有被处理图片总数/需要加载图片总数 * 100)

文字逐增变化的css动画实现：配合jq的```animate()方法```，
  
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
}
```


### 3.懒加载 **(未解决)**
不属于本次项目所有效果

### 什么情况下要做预加载？尤其当图片是用背景图制作的时候
如果一个元素是display:none;的时候，这个元素的背景图会不会一开始就加载？
如果这个元素的某一个类名是背景图，当这个元素还没这个类名，但是背景图的样式提前在css中时，那么是否只有js动态给这个元素加上对应类名时，对应的图片才会加载？
如果一个元素根本就不存在dom中，但是背景图的样式提前在css中，是css加载时图片就被加载还是只有当dom被append到body时图片才会加载？
## video的各种问题
### video常用的属性和方法（w3c的video标签）
方法：

1. play() chick事件（或其他条件）执行播放功能

2. pause() chick事件（或其他条件）暂停视频播放

* 这俩方法使用jq的```$('.video')```不起作用，但是改成````document.getElementById('myVideo');```就可以了

属性：

1. currentTime 资源当前播放时间

2. duration 资源时长

可监听的事件：

1. canplaythrough && readyState==3 加载完成

2. canplay  && readyState==2 可以播放 

3. error 下载错误/失败 abort 下载中断

4. load 加载完成（可能被废弃，请用第一个）

5. play 开始播放触发

5. pause 暂停播放触发

5. ended 监听视频播放完毕（zei好用）

### 隐藏video控件的解决方法（尤其是在安卓机）
* 在ios和浏览器模拟器中，不写属性controls就不会有播放控件

* 在安卓中，可以使用canvas的drawImage()方法绘制视频，虽然不如原生视频的效果流畅，但是终究能够解决不要控件的这个硬性问题。毕竟这种一镜到底的动画，当用户暂停了视频，后边的工作就白做了。

## music的各种问题
### 背景音乐的init预加载和后期多段交互音乐的预加载
    他这个找不到音乐资源的加载，但是按开关还能暂停/播放音乐。不知如何处理的？
### 背景音乐的播放控制

## 动画问题：
###  "即将进入平行世界"文案后边的“...”动画
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

### css里的缓动动画 - 符合运动规律的动画【贝塞尔曲线】

### 火车、小汽车、自行车等运动的动画
### 由汽车动画引发的切图技巧问题
  从房子后边出来的汽车，需要房子的遮盖，这涉及到前期切图时的技巧。

  因为车子是在马路上的， 而房子需要挡住车子的出发点。我切图的时候，可能会把房子和马路切开来。但是本项目中，原作做法是房子马路当背景，另扣一套和车子有折叠的房子出来定位到对应位置。

  这么做好处就是有参照点，只要对齐就行

  坏处就是，经常性的对不齐，上下左右任何一个方向错一像素都有可能被提bug。

  而我平时的分开切图的方法是，能够快速解决层级问题，而不用特别精确的定位。

  但是缺点不知道文件体积会不会变大,也就是房子有可能加载慢，只能看到光秃秃的马路和汽车。

## canvas序列帧制作动画
【动画就是将物体的运动以每秒24格的时间分格法逐一分解、绘制并拍摄记录成序列图片，再以每秒24格的播放速度播放出来，利用人的“视觉暂留”原理产生连续运动的视觉效果】

简单来说，就是通过一直切换一张一张不同的序列图片连续交替出现，让静止的图像看上去像是播放的动态影像。

### 实现关键：就是定时器```setInterval```和```setTimeout```或者更强大的```window.requestAnimationFrame```
推荐两篇偶像的深入剖析文：[定时器](https://www.cnblogs.com/xiaohuochai/p/5773183.html)和[requestAnimationFrame](https://www.cnblogs.com/xiaohuochai/p/5777186.html)

### 封装的requestAnimationFrame：
```js
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback,element) {
			return window.setTimeout(callback, 1000 / 60);//1000ms/60.最佳循环间隔
		};
})();
```

那每一次定时器我们要做什么呢？就是切换并重新绘制图片。
### canvas.drawImage()方法绘制图像
[这一页就够用了](http://www.w3school.com.cn/html5/canvas_drawimage.asp)

### 思路代码：
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
### 序列帧优化（雪碧图）
  因为需要切换多张不同的图片达到序列帧效果，那势必要多次去请求图像。为了优化，当图像尺寸比较小时可以考虑制作成雪碧图样式。

  那样每次重新drawImage的时候，只需要改变开始绘制的坐标值就行了，而不是直接替换图片链接。

### 行走的人
在canvas序列帧实现的基础上，交替更新两张图，分别是任务迈左腿和迈右腿的图。

需要任务站立停止时，让canvas的序列帧停止。

## css里某些效果的特殊处理思路

### 1、**display: -webkit-box;-webkit-box-orient: vertical**
选择性别处元素在垂直方向自适应效果

### 2、**alternate-reverse**
两个性别的闪光特效，是交替间隔的
### 3、**radial-gradient**
闪光灯效果用css3的景象渐变+动画（和追光的渐变样式制作差不多）
### 4、**transform: matrix(1, 0, 0, 1, -43.3594, -1216.41);**
制作行走的人时，改变人物的位置通过css3的位移改变的，这一点可以考虑到。

但是原作用的这个属性matrix需要学习。

### filter属性 [文档看这里，我就不搬过来了](http://www.runoob.com/cssref/css3-pr-filter.html)
**grayscale(0-100%)**: 灰度图片。

0为纯灰色，100%为纯灰色。当然也可以是0-1的小数。

有点设计学里边，将图像颜色的饱和度降值的意思。

兼容性上，ie不支持。用在移动端可以放心一点了。


**brightness(50%)**：改变图片的明暗效果

这个效果在项目中，多用在颜色比较暗的文字上，用了比较暗的颜色值，但是用了这个属性颜色值提亮了。我想这不是原作为了用而用，设计稿上应该就是这个颜色值然后添加了提亮度的蒙版吧。

只想说，学过设计的再来了解这个函数的各个属性值，真的好easy，甚至连效果都不用做都能想象出来长啥样。我想也是因为css的魔性，我才从设计转到前端的吧。只想玩视觉上的东西，而代码改变的视觉又有崇高的魔力。

这段时间听施展讲武则天的历史，一句话让我很是深刻，当你忘了你要去往何方，那就回头看看来时的路。再来走一遍。学前端学到迷茫，项目都能做，但是问我问题就是不能达到理想。想放弃，现在学到这里，又想到了为什么走到这里。或许喜欢前端是始于颜值（css）但是现在陷在js的才华和魔力里无法自拔。因为太累，拔不动了哈哈哈哈哈哈哈哈哈哈

言归正传，filter还有好多属性啊：

**blur** 管模糊效果的，以实现摘了眼镜看世界的你看到的画面

**opacity** 透明度

**hue-rotate** 跟色相有关

**saturate** 调颜色饱和度，比如让红色更红，会让浅粉色变成纯红那样

记个大概，知道有这么个东西，少占点大脑内存，用到的时候再过来找。

### calc属性值实现元素的高随着手机响应

## 模拟滚动效果（选择喜欢的角色处）(待写)
### 思路
#### 监听触摸事件(监听鼠标事件同理)

  start时、鼠标按下记录当前鼠标的x y位置（这个效果特殊，只需要监听y轴位置即可）

  move时、鼠标移动获取新的y值，如果大于start的y值就是向下移动(元素的scrolltop/offsetTop增加),反之向上(元素scrolltop/offsetTop减少)【实验时企图设置$(this)[0].offsetTop失败，说是可读属性不能赋值】

  [借助原著的启发，最后利用css3的translate属性对元素进行上下移动]

#### 问题亮点：

  拿目标元素的位置scrollTop

  拿事件的鼠标位置touches【jq on绑定的时候，e返回的不是事件event，而是目标元素$(this)】

  注意碰撞检测
### 1、移动端使用的touch事件

### 2、pc端的mousewheel事件

### 3、核心是让长图滚动的值scrollTop=角色所在的offsetTop值



## 追光灯效果的实现【背景透明度的径向渐变+translate的位移】
### 1、css-实现聚焦效果
### 2、js-控制translate位移实现灯光追踪效果







## get到的兼容适配问题

  1. 安卓中隐藏视频控件使用canvas

## 原作中关于性能优化的问题及解决方法：
1、 资源的预加载（给个进度条让人稍等）

2、 但又不是全部加载完，而是一小块一小块section的结构加载（如何解决）

3、 并且在展示本section的时候，加载以准备下一段section的资源。（如何解决）

4、 长图切成好几块

5、 人物走路的合成图也是，点击选择了人物才加载指定人物的背影图

## 拥有很多名单的json文件
这个是一个过滤清单，在这个清单里，是用户不能输入的文案。在用户输入名字的地方使用。
具体用法就是拿到用户输入的名字信息，去json文件中进行查找，如果找到了就提示含有敏感词，并将input输入框清空让其重新输入。
初步做法，我是用的arr.indexOf(内容) > -1
但是我做测试时，输入json中有的关键字确实可以屏蔽
但是我加一个数字或其他的字，又跳过了屏蔽。这就很尴尬
比如“数组”是敏感词，但是我输入“数组1”就不算敏感词了，显然这种判断是不行的。（因为indexOf使用===严格等于）

# 最后提炼原作的js，研究大神的处理方式，对比与自己不同的地方，总结优缺点、拓宽新思路和新编程风格。

# 接下来还有的任务大致步骤
改bug，首页btn延迟出现
视频1播放时 第二阶段图片预加载
点击人物追光时，加载行走人物背影图
确定按钮做敏感词判断（重做名字输入时的敏感词判断）
有规律的分屏上移动画（以点击屏幕为触发事件）
分屏中汽车等动的动画执行
分屏中人物上移动画
人物移动完毕的题目加载
点击题目切屏
最后一题完毕切换video播放（音乐预加载在选好人物开始做题时）
加载总的背景音乐
切屏加载音效
视频2播放，计算结果、加载html2canvas所需图片
制作结果页面
html2canvas转成图片效果