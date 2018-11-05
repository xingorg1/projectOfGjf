export let utils = {
  oW: document.documentElement.clientWidth,
  oH: document.documentElement.clientHeight,
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
    let assetsArr = [],promiseArr = [],count=0;
    for(let i = 0; i < imgArr.length; i++){
      // 这里有疑问，怎么使用promise实现加载完毕执行resolve而不是回调函数实现？是不是必须放到数组中再遍历每一个promise？
      // promiseArr.push(new Promise((resolve,reject)=>{
        if(format == "mp3"){
          assetsArr[i] = new Audio();
          assetsArr[i].src = `${imgUrl}${imgArr[i]}.${format}`;
          assetsArr[i].oncanplaythrough  = function(){// *这里，音频文件使用onload不能监听
            count++;
            callback();
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