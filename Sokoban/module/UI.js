import * as map from "./map.js";

export const divContaner = document.getElementById("game");
const piceWidth = 50;
const piceHeight = 50;

/**
 * 设置游戏界面的宽高
 */
function setDivContainer() {
    divContaner.style.width = map.colNumber * piceWidth + 'px';
    divContaner.style.height = map.rowNumber * piceHeight + "px";
}

function isCorrectPosition(row, col) {
    return map.content[guankaNum].correct.find(p => p.row === row && p.col === col) != undefined;
}
/**
 * 根据行和列创建一个div加入到容器
 * @param {*} row 行
 * @param {*} col 列
 */
console.log(window.guankaNum)
function setOnePice(row, col) {
    var value = map.content[guankaNum].uiMap[row][col];
    var div = document.createElement("div");
    div.className = "item";
    div.style.left = col * piceWidth + "px";
    div.style.top = row * piceHeight + "px";
    //如果value是玩家
    if (value === map.player) {
        div.classList.add("player");
    }
    //如果value是墙
    else if (value === map.wall) {
        div.classList.add("wall");
    }
    //如果value是箱子
    else if (value === map.box) {
        //是否在正确位置上
        if (isCorrectPosition(row, col)) {
            div.classList.add("correct-box");
        } else {
            div.classList.add("box");
        }
    }
    //如果value是空白
    else if (value === map.space) {
        //是否是正确位置
        if (isCorrectPosition(row, col)) {
            div.classList.add("correct");
        } else {
            return;
        }
    }
    divContaner.appendChild(div);
}

/**
 * 根据地图上具体的信息加入div
 */
function setContent() {
    divContaner.innerHTML = "";
    for (let row = 0; row < map.rowNumber; row++) {
        for (let col = 0; col < map.colNumber; col++) {
            setOnePice(row, col);
        }
    }

}

export function showUI() {
    //设置游戏界面的宽高
    setDivContainer();
    //根据地图上具体的信息加入div
    setContent()
}