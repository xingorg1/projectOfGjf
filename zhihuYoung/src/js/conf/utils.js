export let utils = {
  oW: document.documentElement.clientWidth,
  oH: document.documentElement.clientHeight,
  myRequestAnimFrame: function(){
    console.log(1)
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
  },
  canvasWH: function(canvas){
    canvas.width = this.oW;
    canvas.height = this.oH;
    canvas.style.width = this.oW + "px";
    canvas.style.height = this.oH + "px";
  },
  drawCanvas: function(){

  },
  prestrain: function(imgArr,imgUrl,format,callback){
    /* 图片预加载 */
    let assetsArr = [],promiseArr = [],count=0,len = imgArr.length;
    for(let i = 0; i < len; i++){
      // 这里有疑问，怎么使用promise实现加载完毕执行resolve而不是回调函数实现？是不是必须放到数组中再遍历每一个promise？
      // promiseArr.push(new Promise((resolve,reject)=>{
        if(format == "mp3"){
          assetsArr[i] = new Audio();
          assetsArr[i].src = `${imgUrl}${imgArr[i]}.${format}`;
          // assetsArr[i].onload  = function(){// *这里，音频文件使用onload不能监听
          //   console.log(assetsArr[i])
          // }
          // assetsArr[i].addEventListener("loadedmetadata",function(){
          //   console.log(assetsArr[i].readyState,'readyState标号')
          // },false)
          // assetsArr[i].addEventListener('canplay',function(){
          //   console.log('canplayyyyyyyyy')
          // },false)
          // assetsArr[i].oncanplay  = function(){
          //   console.log('ooooooooooooooncanplay')
          // }
          // assetsArr[i].addEventListener('load',function(){
          //   console.log('loadddddddddd')
          // },false)
          // assetsArr[i].addEventListener("canplaythrough",function() {
          // 　console.log('canplaythroughhhhhhhhhhhhh')
          // },
          // false);
          // callback('音频资源回调');
          assetsArr[i].oncanplaythrough  = function(){
            // *这里，音频文件使用onload不能监听,但是不兼容移动端,放到手机不执行这段
            //对于video或者audio等媒体元素，有一些方法，常用的有play(),pause();也有一些事件，如'loadstart','canplay','canplaythrough','ended','timeupdate'…..等等。
            // 在移动端有一些坑需要注意，不要轻易使用媒体元素的除’ended’,’timeupdate’以外event事件，在不同的机子上可能有不同的情况产生，例如：
            // ios下监听'canplay'和'canplaythrough'（是否已缓冲了足够的数据可以流畅播放）,当加载时是不会触发的，即使preload=”auto”也没用，但在pc的chrome调试器下和android下，是会在加载阶段就触发。ios需要播放后才会触发。
            // 总之就是现在的视频标准还不尽完善，有很多坑要注意，要使用前最好自己亲测一遍。
            console.log(assetsArr[i])
            count++;
            callback('音频资源回调');
          }
        }else{
          assetsArr[i] = new Image();
          assetsArr[i].src = `${imgUrl}${imgArr[i]}.${format}`;
          assetsArr[i].onload = function(){
            //   resolve(1);
            count++;
            callback();
          }
        }
        assetsArr[i].onerror = function(){
          count++;
          console.log("加载失败：",assetsArr[i])
          callback();
        }
      // }));
    }
    return assetsArr;
    // return promiseArr;
  },
  
}