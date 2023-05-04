import { HolCharacter } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RoundState } from "../../fight/RoundState";
import { RegisterBuff } from "../../fight/buff/BuffEnum";
import { BuffMetaState } from "../../fight/buff/BuffMetaState";
import { BuffState } from "../../fight/buff/BuffState";
import { CharacterState } from "../../fight/character/CharacterState";

// 流血的配置
export type BleedOption = {
    // 每回合扣多少血
    roundReduceBleed?: number
}

@RegisterBuff({id: "bleed"})
export class BleedBuff extends BuffMetaState {
    
    // 眩晕buff
    name: string = "流血"

    isDeBuff: boolean = true

    introduce: string = "每回合开始造成指定伤害"

    buffIcon: string = "game/fight_entity/buff/bleed/spriteFrame"

    GetOnCreate(): (self: BuffState, option: BleedOption) => Promise<void> {
        return async (self: BuffState, option: BleedOption) => {
            option = option || {}
            self.state.set("roundReduceBleed" , option.roundReduceBleed || 0)
        }
    }

    // 回合开始扣血
    GetOnRoundBegan(): (self: BuffState, roundState: RoundState, fightMap: FightMap) => Promise<void> {
        return async (self: BuffState, roundState: RoundState, fightMap: FightMap) => {
            const hurt = Math.ceil(self.state.get("roundReduceBleed") || 1)
            self.character.hp -= hurt
            // 输出扣血动画
            if (fightMap.isPlayAnimation) {
                await self.character.component.showString("流血" + "-" + hurt)
                await self.character.component.updateUi()
            }
        }
    }
}