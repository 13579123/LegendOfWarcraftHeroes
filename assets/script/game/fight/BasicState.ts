import { FightMap,  } from "../../scenes/Fight/Canvas/FightMap"
import { ActionState } from "./ActionState"
import { BasicMetaState } from "./BasicMetaState"
import { OnBeTarget } from "./OnBeTarget"
import { RoundState } from "./RoundState"

// 状态基类
export class BasicState<T extends BasicMetaState> {
    // id
    id: string
    // 名称
    name: string
    // 元数据
    meta: T
    // 构造器
    constructor(meta: T) {
        this.meta = meta
        this.id = meta.id
        this.name = meta.name
        this.OnFightBegan = meta.GetOnFightBegan()
        this.OnRoundBegan = meta.GetOnRoundBegan()
        this.OnRoundEnd = meta.GetOnRoundEnd()
        this.OnBeHurt = meta.GetOnBeHurt()
        this.OnBeCure = meta.GetOnBeCure()
        this.OnBuff = meta.GetOnBuff()
        this.BeforeAction = meta.GetBeforeAction()
        this.AfterAction = meta.GetAfterAction()
        this.OnAttack = meta.GetOnAttack()
        this.OnSkill = meta.GetOnSkill()
        this.OnDead = meta.GetOnDead()
        this.onReBirth = meta.GetonReBirth()
    }
    // 战斗开始函数
    OnFightBegan: (self: this , fightMap: FightMap) => Promise<void>
    // 回合结束函数
    OnRoundEnd: (self: this , roundState: RoundState , fightMap: FightMap) => Promise<void>
    // 回合开始函数
    OnRoundBegan: (self: this , roundState: RoundState , fightMap: FightMap) => Promise<void>
    // 被伤害时的函数
    OnBeHurt: (self: this , onBeTarget: OnBeTarget , fightMap: FightMap) => Promise<void>
    // 被治疗时的函数
    OnBeCure: (self: this , onBeTarget: OnBeTarget , fightMap: FightMap) => Promise<void>
    // 被添加buff时的函数
    OnBuff: (self: this , onBeTarget: OnBeTarget , fightMap: FightMap) => Promise<void>
    // 行动之前的函数
    BeforeAction: (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => Promise<any>
    // 行动之后的函数
    AfterAction: (self: BasicState<any> , fightMap: FightMap) => Promise<any>
    // 普通攻击的函数
    OnAttack: (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => Promise<any>
    // 技能攻击的函数
    OnSkill: (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => Promise<any>
    // 死亡时的函数
    OnDead: (self: BasicState<any> , fightMap: FightMap) => Promise<any>
    // 重生时的函数
    onReBirth: (self: BasicState<any> , fightMap: FightMap) => Promise<any>
}