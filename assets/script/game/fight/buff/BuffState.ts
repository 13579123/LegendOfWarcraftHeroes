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

    // 构造器
    constructor(create: BuffStateCreate) {
        const meta = BuffEnum[create.id]
        super(meta)

        this.OnAddToCharacter = meta.GetOnAddToCharacter()
        this.OnDeleteFromCharacter = meta.GetOnDeleteFromCharacter()
    }

    // 添加到角色时的回调
    OnAddToCharacter: (self: BuffState) => Promise<void>
    // buff从角色中移除的回调
    OnDeleteFromCharacter:  (self: BuffState) => Promise<void>
}