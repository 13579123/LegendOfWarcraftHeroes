import { BasicMetaState } from "../BasicMetaState";
import { BuffState } from "./BuffState";

export class BuffMetaState extends BasicMetaState {

    // buff 图标路径
    buffIcon: string = ""
    
    // 是否是减益buff
    isDeBuff: boolean = true

    /**
     * 创建时的函数
     */
    GetOnCreate(): (self: BuffState , option: any) => Promise<void> {
        return async (self: BuffState , option: any) => {}
    }

    /** 
     * 添加到角色时的函数 有 HolCharacter 组件调用
     * self 当前buff
     */
    GetOnAddToCharacter(): (self: BuffState) => Promise<void> {
        return async (self: BuffState) => {}
    }

    /** 
     * buff从角色中删除时 有 HolCharacter 组件调用
     * self 当前buff
     */
    GetOnDeleteFromCharacter(): (self: BuffState) => Promise<void> {
        return async (self: BuffState) => {}
    }
}