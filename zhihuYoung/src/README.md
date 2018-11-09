# 说明
仿做h5项目 - #[《平行世界的你》](http://static.adcode.cn/20180508-zhihu-young/index.html?from=singlemessage&isappinstalled=0)
# 要解决的问题(自己需要学习的知识点)

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
### 背景音乐的添加
    他这个找不到音乐资源的加载，但是按开关还能暂停/播放音乐。不知如何处理的？
### 音乐的分段加载（每出现一段音乐都可以在media里看到）

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


## canvas序列帧

## css里某些效果的特殊处理思路

### 1、**display: -webkit-box;-webkit-box-orient: vertical**
选择性别处元素在垂直方向自适应效果

### 2、**alternate-reverse**
两个性别的闪光特效，是交替间隔的

### filter属性
**grayscale(100%)**

**brightness(50%)**

### calc属性值
## 模拟超出滚动效果

## 追光灯效果的实现【背景透明度的径向渐变+translate的位移】







## 兼容适配问题

  1. 安卓中隐藏视频控件使用canvas

## 原作中关于性能优化的问题及解决方法：
1、 资源的预加载（给个进度条让人稍等）

2、 但又不是全部加载完，而是一小块一小块section的结构加载（如何解决）

3、 并且在展示本section的时候，加载以准备下一段section的资源。（如何解决）

4、 长图切成好几块

5、 人物走路的合成图也是，点击选择了人物才加载指定人物的背影图

## 拥有很多名单的json文件

