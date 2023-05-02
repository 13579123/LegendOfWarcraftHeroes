import { FightMap,  } from "../../scenes/Fight/Canvas/FightMap"
import { ActionState } from "./ActionState"
import { BasicState } from "./BasicState"
import { OnBeTarget } from "./OnBeTarget"
import { RoundState } from "./RoundState"

// 状态元基类
export class BasicMetaState {
    
    // 创建基类对象
    static getMetaInstance(id: string) {
        const instance = new this()
        instance.id = id
        return instance
    }

    // id
    id: string
    // 名称
    name: string
    // 简介
    introduce: string

    /** 
     * 创建时的函数 该函数在创建本状态对象时调用
     * self 当前状态对象
     */
    OnCreateState(self: BasicState<any>) {}

    /** 
     * 获取战斗开始函数 该函数由FigtMap组件调用
     * self 当前状态对象
     * fightMap 战斗场景对象
     */
    GetOnFightBegan(): (self: BasicState<any> , fightMap: FightMap) => Promise<void> {
        return async (self: BasicState<any> , fightMap: FightMap) => {}
    }

    /** 
     * 获取回合开始函数 该函数由FigtMap组件调用
     * self 当前状态对象
     * roundState 回合状态函数
     * fightMap 战斗场景对象
     */
    GetOnRoundBegan(): (self: BasicState<any> , roundState: RoundState , fightMap: FightMap) => Promise<void> {
        return async (self: BasicState<any> , roundState: RoundState , fightMap: FightMap) => {}
    }

    /**
     * 获取回合结束函数 该函数由FightMap组件调用
     * self 当前状态对象
     * roundState 回合状态函数
     * fightMap 战斗场景对象
     */
    GetOnRoundEnd(): (self: BasicState<any> , roundState: RoundState , fightMap: FightMap) => Promise<void> {
        return async (self: BasicState<any> , roundState: RoundState , fightMap: FightMap) => {}
    }

    /** 
     * 获取被伤害时的函数
     * self 当前状态对象
     * onBeTarget 结算事件对象
     * fightMap 战斗场景对象
     */
    GetOnBeHurt(): (self: BasicState<any> , onBeTarget: OnBeTarget , fightMap: FightMap) => Promise<void> {
        return async (self: BasicState<any> , onBeTarget: OnBeTarget , fightMap: FightMap) => {}
    }

    /** 
     * 获取被治疗时的函数
     * self 当前状态对象
     * onBeTarget 结算事件对象
     * fightMap 战斗场景对象
     */
    GetOnBeCure(): (self: BasicState<any> , onBeTarget: OnBeTarget , fightMap: FightMap) => Promise<void> {
        return async (self: BasicState<any> , onBeTarget: OnBeTarget , fightMap: FightMap) => {}
    }

    /** 
     * 获取被添加buff时的函数
     * self 当前状态对象
     * onBeTarget 结算事件对象
     * fightMap 战斗场景对象
     */
    GetOnBuff(): (self: BasicState<any> , onBeTarget: OnBeTarget , fightMap: FightMap) => Promise<void> {
        return async (self: BasicState<any> , onBeTarget: OnBeTarget , fightMap: FightMap) => {}
    }

    /** 
     * 行动之前的函数
     * self 当前状态对象
     * actionState 行动对象
     * fightMap 战斗场景对象
     */
    GetBeforeAction(): (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => Promise<any> {
        return async (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => {}
    }

    /** 
     * 行动之后的函数
     * self 当前状态对象
     * actionState 行动对象
     * fightMap 战斗场景对象
     */
    GetAfterAction(): (self: BasicState<any> , fightMap: FightMap) => Promise<any> {
        return async (self: BasicState<any> , fightMap: FightMap) => {}
    }

    /** 
     * 普通攻击的函数
     * self 当前状态对象
     * fightMap 战斗场景对象
     */
    GetOnAttack(): (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => Promise<any> {
        return async (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => {}
    }

    /** 
     * 技能攻击的函数
     * self 当前状态对象
     * fightMap 战斗场景对象
     */
    GetOnSkill(): (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => Promise<any> {
        return async (self: BasicState<any> , actionState: ActionState , fightMap: FightMap) => {}
    }

    /** 
     * 死亡时的函数
     * self 当前状态对象
     * fightMap 战斗场景对象
     */
    GetOnDead(): (self: BasicState<any> , fightMap: FightMap) => Promise<any> {
        return async (self: BasicState<any> , fightMap: FightMap) => {}
    }

    /** 
     * 获取重生时的函数
     * self 当前状态对象
     * fightMap 战斗场景对象
     */
    GetonReBirth(): (self: BasicState<any> , fightMap: FightMap) => Promise<any> {
        return async (self: BasicState<any> , fightMap: FightMap) => {}
    }
}