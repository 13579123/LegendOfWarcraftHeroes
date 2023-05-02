import { Node, Vec2, math } from "cc";

type Coordinate = {
    x:number ,
    y: number
}

type CurveFuncOption = {
    // 总动画次数
    timesAmount: number ,
    // 当前动画次数
    times: number ,
    // 最开始的位置
    originPosition: Coordinate ,
    // 目标坐标
    targtePosition: Coordinate ,
    // 当前坐标
    currentPosition: Coordinate ,
}

export type MoveNodeToPositionOption = {

    // 移动目标方位
    targetPosition: Coordinate ,

    // 曲率函数用于计算每一帧的落点 默认为直线
    curveFunc?: (option: CurveFuncOption) => Coordinate ,
    
    // 禁用节点旋转 默认true
    forbidRotation?: boolean ,

    // 是否移动曲线 默认 false
    moveCurve?: boolean ,

    // 移动速度 默认 1
    moveTimeScale?: number
}

/** 
 * 将某个节点移动到某个坐标
 * @param node 要移动的节点
 * @param option 移动配置
 */
export async function moveNodeToPosition(node: Node, option: MoveNodeToPositionOption) {
    option.moveCurve = option.moveCurve || false
    option.forbidRotation = option.forbidRotation || true
    option.moveTimeScale = option.moveTimeScale || 1
    const originPosition = {x: node.position.x , y: node.position.y}
    option.curveFunc = option.curveFunc || ((option: CurveFuncOption) => {
        const moveX = (option.targtePosition.x - originPosition.x) / option.timesAmount
        const moveY = (option.targtePosition.y - originPosition.y) / option.timesAmount
        return {x: option.currentPosition.x + moveX , y: option.currentPosition.y + moveY}
    })
    return new Promise<void>(res => {
        // 不使用曲线
        if (!option.moveCurve) {
            node.setPosition(
                option.targetPosition.x ,
                option.targetPosition.y ,
                node.position.z
            )
            return res()
        }
        let times = 0
        let nextPosition: {x:number , y: number} = {
            x: node.position.x ,
            y: node.position.y
        }
        // 使用曲线
        const inter = setInterval(() => {
            const timesAmount = 25
            if (times >= timesAmount) {
                clearInterval(inter)
                return res()
            }
            // 设置相对于下上一帧进行旋转
            if (!option.forbidRotation)
                node.angle = Math.atan((nextPosition.x - node.position.x) / (nextPosition.y - node.position.y))
            // 设置位置
            node.setPosition(nextPosition.x , nextPosition.y)
            // 次数加一
            times++
            // 计算下一帧的位置
            nextPosition = option.curveFunc({
                times ,
                timesAmount ,
                originPosition: originPosition ,
                targtePosition: option.targetPosition ,
                currentPosition: {x: node.position.x , y: node.position.y} ,
            })
        } , 16 / option.moveTimeScale)
    })
}