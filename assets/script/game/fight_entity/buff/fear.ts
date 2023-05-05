import { math } from "cc";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RegisterBuff } from "../../fight/buff/BuffEnum";
import { BuffMetaState } from "../../fight/buff/BuffMetaState";
import { BuffState } from "../../fight/buff/BuffState";


@RegisterBuff({id: "fear"})
class Fear extends BuffMetaState {
    // 恐惧buff
    name: string = "恐惧"

    // buff 类型
    isDeBuff: boolean = true

    introduce: string = "恐惧后有70%的概率不敢出手"

    buffIcon: string = "game/fight_entity/buff/fear/spriteFrame"

    GetBeforeAction(): (self: BasicState<any>, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: BuffState , actionState: ActionState, fightMap: FightMap) => {
            if (math.randomRange(0 , 100) < 70) {
                // 输出文字
                if (fightMap.isPlayAnimation) await self.character.component.showString("恐惧")
                // 拒绝行动
                actionState.canAction = false
            }
        }
    }
}