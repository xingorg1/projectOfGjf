var fishFun = {
  drawBgImg: function(){
    // 插入背景图
    var bgImg = new Image();
    bgImg.src = 'images/background.jpg';
     setTimeout(function(){
    /* 方法一、这种使用new Image()创建的图片，需要给图片缓冲的时间。等图片加载成功后才可以进行绘制。所以使用了异步 */
      ctx1.drawImage(bgImg,0,0,wWidth,wHeight);
    },10);
    /* 方法二、使用img的加载事件监听，图片加载成功再执行canvas的绘图效果.并且这种方法靠谱一些。毕竟定时器也不能保证时间到了以后图片已经加载进来了，网不快的话照样挂掉。 */
    /* 步骤1、绘制背景图 */
    bgImg.onload = function(){
      ctx1.drawImage(bgImg,0,0,wWidth,wHeight);
      /* 注意异步任务，等他执行完了再执行其他的 */
      drawGrass();
    }
  },
  drawBg :  function() {
    /* 渐变临摹背景图 */
      var bgGradient = ctx1.createRadialGradient(400,-20,5,380,60,500);
      bgGradient.addColorStop('0','#0072cb');
      bgGradient.addColorStop('1','#01062c');
      ctx1.fillStyle = bgGradient;
      ctx1.fillRect(0,0,wWidth,wHeight);
  },
  drawGrass: function(){
      /* 海葵 */
      ctx1.lineWidth = 6;
      ctx1.lineCap = 'round';
      ctx1.strokeStyle = '#8a0379';
      ctx1.globalAlpha = 0.35;
      ctx1.beginPath();
      for(var i = 0; i < 150; i++){
        var xDis = parseInt(i * 6+ Math.random() * 12);
        //Math.random() * 15 是每条线间距离16像素、再加上随机0-14之间任意一个数字来得到这个线和其他人的随机间距
        // i*lineDistance 得到每条线依次排列时，当前线的起点坐标。
        var lineH = 250 - parseInt(Math.random() * 40);
        // Math.random() * 40得到0-39之间任意一个数字，然后250减去这个数字得到这个线随机的高度
        ctx1.moveTo(xDis, wHeight);//xDis
        ctx1.lineTo(xDis, wHeight-lineH);//画布高度减去线的高度，就是要画到的目标点的y坐标
      }
      ctx1.stroke();
      ctx1.closePath();
    }
}