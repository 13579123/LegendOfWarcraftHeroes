import { BuffState } from "./buff/BuffState"
import { CharacterState } from "./character/CharacterState"

/** 
 * 无论是 被治疗 被伤害 被攻击 ... 都会有一个该状态被创建
 * 并且会影响之后的行为 用于结算操作
 */
export class OnBeTarget {
    // 被造成的伤害
    hurt: number = 0
    // 被造成的回复
    cure: number = 0
    // 是否格挡
    block: boolean = false
    // 是否暴击
    critical: boolean = false
    // 添加的buff
    buff: BuffState[] = []
    // 谁以你为目标
    origin: CharacterState = null
}