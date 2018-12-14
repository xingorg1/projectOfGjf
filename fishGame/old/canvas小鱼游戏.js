var cav1 = document.getElementById('canvas1'),
    ctx1 = cav1.getContext('2d'),
    cav2 = document.getElementById('canvas2'),
    ctx2 = cav2.getContext('2d'),
    wWidth = 800,
    wHeight = 600;
cav1.width = cav2.width = wWidth;
cav1.height = cav2.height = wHeight;
console.log(ctx1);
fishFun.drawBg();
fishFun.drawGrass();
/* 画果实 */
// 画鱼的序列帧
  /* requestAnimFrame(gameloop) */