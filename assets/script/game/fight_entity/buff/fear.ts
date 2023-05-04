import { HolCharacter } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RoundState } from "../../fight/RoundState";
import { RegisterBuff } from "../../fight/buff/BuffEnum";
import { BuffMetaState } from "../../fight/buff/BuffMetaState";
import { BuffState } from "../../fight/buff/BuffState";
import { CharacterState } from "../../fight/character/CharacterState";

@RegisterBuff({id: "fear"})
export class BleedBuff extends BuffMetaState {
    
    // 眩晕buff
    name: string = "恐惧"

    isDeBuff: boolean = true

    introduce: string = "每回合有80%的概率无法行动"

    buffIcon: string = "game/fight_entity/buff/fear/spriteFrame"

    GetBeforeAction(): (self: BuffState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: BuffState, actionState: ActionState, fightMap: FightMap) => {
            if (Math.random() < 0.8) {
                // 输出文字
                if (fightMap.isPlayAnimation) await self.character.component.showString("害怕")
                // 拒绝行动
                actionState.canAction = false
            }
        }
    }
}