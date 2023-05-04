import { BasicMetaState } from "../BasicMetaState";
import { BasicState } from "../BasicState";
import { CharacterState } from "../character/CharacterState";
import { BuffEnum } from "./BuffEnum";
import { BuffMetaState } from "./BuffMetaState";

export type BuffStateCreate = {
    // id
    id: string
}

export class BuffState extends BasicState<BuffMetaState> {

    // 对应的角色
    character: CharacterState = null

    // 存储状态
    state: Map<string , any> = new Map

    // 构造器
    constructor(create: BuffStateCreate , option?: any) {
        const meta = BuffEnum[create.id]
        super(meta)

        this.OnCreate = meta.GetOnCreate()
        this.OnAddToCharacter = meta.GetOnAddToCharacter()
        this.OnDeleteFromCharacter = meta.GetOnDeleteFromCharacter()

        this.OnCreate(this , option)
    }

    // 创建时的函数
    OnCreate: (self: BuffState , option: any) => Promise<void> 
    // 添加到角色时的回调
    OnAddToCharacter: (self: BuffState) => Promise<void>
    // buff从角色中移除的回调
    OnDeleteFromCharacter:  (self: BuffState) => Promise<void>
}