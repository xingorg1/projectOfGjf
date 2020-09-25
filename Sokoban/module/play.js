import * as map from "./map.js"

/**
 * 获取玩家所在位置
 */
function getPlayerPoint() {
    for (let row = 0; row < map.rowNumber; row++) {
        for (let col = 0; col < map.colNumber; col++) {
            if (map.content[guankaNum].uiMap[row][col] === map.player) {
                return {
                    row,
                    col
                }
            }
        }
    }
    throw new Error("没有找到玩家")
}


/**
 * 获取下一个位置信息
 * @param {*} row 行
 * @param {*} col 列
 * @param {*} direction 方向
 */
function getNextPoint(row, col, direction) {
    if (direction === "left") {
        return {
            row: row,
            col: col - 1,
            value: map.content[guankaNum].uiMap[row][col - 1]
        }
    } else if (direction === "right") {
        return {
            row: row,
            col: col + 1,
            value: map.content[guankaNum].uiMap[row][col + 1]
        }
    } else if (direction === "up") {
        return {
            row: row - 1,
            col: col,
            value: map.content[guankaNum].uiMap[row - 1][col]
        }
    } else if (direction === "down") {
        return {
            row: row + 1,
            col: col,
            value: map.content[guankaNum].uiMap[row + 1][col]
        }
    }
}

/**
 * 交换位置
 * @param {*} point1 位置1
 * @param {*} point2 位置2
 */
function exchange(point1, point2) {
    let tmp = map.content[guankaNum].uiMap[point1.row][point1.col];
    map.content[guankaNum].uiMap[point1.row][point1.col] = map.content[guankaNum].uiMap[point2.row][point2.col];
    map.content[guankaNum].uiMap[point2.row][point2.col] = tmp;
}

/**
 * 是否游戏胜利
 */
export function isWin() {
    for (let i = 0; i < map.content[guankaNum].correct.length; i++) {
        const point = map.content[guankaNum].correct[i];
        if (map.content[guankaNum].uiMap[point.row][point.col] !== map.box) {
            return false;
        }

    }
    return true;
}

/**
 * 按照指定的方向让玩家移动一步
 * @param {*} direction left,right,up,dowm
 */
export function playerMove(direction) {
    var playerPoint = getPlayerPoint();
    var playerNextPoint = getNextPoint(playerPoint.row, playerPoint.col, direction)
        //不能移动的情况
    if (playerNextPoint.value === map.wall) {
        return false;
    }
    //能移动的情况
    if (playerNextPoint.value === map.space) {
        exchange(playerPoint, playerNextPoint);
        return true;
    } else {
        //下一个位置是箱子
        //获取箱子的下一个位置
        var boxNextPoint = getNextPoint(playerNextPoint.row, playerNextPoint.col, direction);
        //箱子的下一个位置是空白
        if (boxNextPoint.value === map.space) {
            exchange(boxNextPoint, playerNextPoint);
            exchange(playerPoint, playerNextPoint);
            return true;
        }
        return false;
    }
}