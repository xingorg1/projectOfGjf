/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 19:01:59 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2018-12-14 19:08:40
 */

 /* 鱼和果实的碰撞检测 */
//  判断鱼和活着的果实的距离，小于某个值就栓吃掉了
function monFoodCollision(){
  for (let i = 0; i < food.num; i++) {
    if(food.alive[i]){
      /* 获得大于和果实距离的平方 */
     var len =  calLength2(food.x[i],food.y[i],mom.x,mom.y)
     if(len < 900){
      food.dead(i)
     }
    }
    
  }
}