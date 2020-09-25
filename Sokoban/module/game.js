import { playerMove, isWin } from "./play.js"
import { showUI, divContaner } from "./UI.js"
import * as map from "./map.js"

showUI();
export var over = false;
var next = document.createElement("div")
next.className = "next"
next.id = "next"
next.innerHTML = `<span>进入下一关</span>`
// document.addEventListener('click', '.next', function() {
//     console.log(123)
// })
window.onkeydown = function(e) {
    if (over) {
        return
    }
    var result = false;

    if (e.key === "ArrowUp") {
        result = playerMove("up")
    } else if (e.key === "ArrowDown") {
        result = playerMove("down")
    } else if (e.key === "ArrowLeft") {
        result = playerMove("left")
    } else if (e.key === "ArrowRight") {
        result = playerMove("right")
    }
    if (result) {
        showUI();
        if (isWin()) {
            divContaner.appendChild(next);
            next.onclick = function() {
                // 点击，新增关卡
                guankaNum ++;
                showUI();
            }
            over = true;
        }
    }
}
var span = next.getElementsByTagName("span")[0];
span.onclick = function() {
    next.style.display = "none"
}