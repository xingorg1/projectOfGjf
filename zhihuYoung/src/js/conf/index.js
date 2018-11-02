/* global $ */
$(function () {
  // 判断并提示微信环境打开
  console.log(window.navigator.userAgent.toLowerCase())
  if (!window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
    console.log(1)
  }
  // 预加载
  var num = 0;
  function moni() {
    setTimeout(() => {
      num++;
      if(num<=100){
        moni()
      }else{
        $('.loading-text').css('display',`none`);
        $('.loading-end-btn').css('display',`block`);
      }
    }, 50);
    $('.loading-progress-number').text(`${num}%`);
    $('.loading-progress-width').css('width',`${num}%`);
  }
  setTimeout(()=>{
    moni();
  },500);
  // 开始按钮
  var myVideo = document.getElementById('myVideo');
  $('.loading-end-btn').on('click', function () {
    $('.loading').fadeOut();
    // 插入video并开始播放
    if(myVideo.readyState){
      console.log("视频准备就绪")
      myVideo.play();//开始播放、paused暂停播放
    }else{
      // 重新加载
    }
    console.log(myVideo.currentTime);//资源当前播放时间
    console.log(myVideo.duration);//资源时长
  })
  $('.video').on('ended',function(){
    console.log("播放完毕");
  })
})