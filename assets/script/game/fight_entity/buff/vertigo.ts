import { HolCharacter } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RegisterBuff } from "../../fight/buff/BuffEnum";
import { BuffMetaState } from "../../fight/buff/BuffMetaState";
import { BuffState } from "../../fight/buff/BuffState";
import { CharacterState } from "../../fight/character/CharacterState";

@RegisterBuff({id: "vertigo"})
export class VertigoBuff extends BuffMetaState {
    
    // 眩晕buff
    name: string = "眩晕"

    // buff 类型
    isDeBuff: boolean = true

    introduce: string = "眩晕后无法行动"

    buffIcon: string = "game/fight_entity/buff/vertigo/spriteFrame"

    GetBeforeAction(): (self: BasicState<any>, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: BuffState , actionState: ActionState, fightMap: FightMap) => {
            // 输出文字
            if (fightMap.isPlayAnimation) await self.character.component.showString("眩晕")
            // 拒绝行动
            actionState.canAction = false
        }
    }

}