import { math } from "cc";
import { GetCharacterCoordinatePosition } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { util } from "../../../util/util";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RegisterCharacter } from "../../fight/character/CharacterEnum";
import { CharacterMetaState } from "../../fight/character/CharacterMetaState";
import { CharacterState } from "../../fight/character/CharacterState";
import { BuffState } from "../../fight/buff/BuffState";


@RegisterCharacter({id: "fearOfDemons"})
export class Character extends CharacterMetaState {

    name: string = "恐魔"

    AnimationDir: string = "game/fight_entity/character/fearOfDemons"

    AvatarPath: string = "game/fight_entity/character/fearOfDemons/avatar/spriteFrame"

    AnimationType: "DrangonBones" | "Spine" = "Spine"

    AnimationScale: number = 0.65
    
    HpGrowth: number = 45

    AttackGrowth: number = 30

    DefenceGrowth: number = 15

    PierceGrowth: number = 15

    SpeedGrowth: number = 17

    Energy: number = 90

    CharacterCamp: "ordinary" | "nature" | "abyss" | "dark" | "machine" | "sacred" = "dark"

    CharacterQuality: number = 4

    PassiveIntroduceOne: string = `
    
    额外获得 20% 攻击力
    额外获得 20% 护甲穿透
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    
    额外获得 15% 攻击力
    普通攻击有20%的概率会恐惧敌人 持续两回合
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    
    对一个随机敌人造成150%攻击力的伤害
    并且造成 50% 攻击力的流血2回合
    `.replace(/ /ig , "")

    OnCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.attack *= 1.2
            self.pierce *= 1.2
        }
        if (self.star >= 4) {
            self.attack *= 1.15
        }
    }

    GetOnAttack(): (self: BasicState<any>, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            let enemies = self.component.getEnimies(fightMap.allLiveCharacter)
            if (enemies.length <= 0) return
            enemies = enemies.sort((a , b) => a.coordinate.col - b.coordinate.col)
            actionState.targets.push(enemies[0].state)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            actionState.targets[0].component.direction ,
                            actionState.targets[0].component.coordinate.row , 
                            actionState.targets[0].component.coordinate.col ,
                            "attack"
                        ) ,
                        moveCurve: true ,
                        moveTimeScale: actionState.targets[0].component.holAnimation.timeScale
                    }
                )
                await self.component.holAnimation.playAnimation("attack" , 1 , self.component.defaultState)
            }
            // 结算
            for (const target of actionState.targets) {
                // 添加恐惧
                if (self.star >= 4 && Math.random() < 0.2) {
                    const fearBuff = new BuffState({id: "fear"})
                    target.component.addBuff(self.component , fearBuff)
                    fightMap.listenRoundEvent( 2 , () => target.component.deleteBuff(fearBuff))
                }
                // 攻击
                fightMap.actionAwaitQueue.push(
                    self.component.attack(self.attack * 1 , target.component)
                )
            }
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            self.component.direction ,
                            self.component.coordinate.row , 
                            self.component.coordinate.col ,
                            "ordinary"
                        ) ,
                        moveCurve: true ,
                        moveTimeScale: self.component.holAnimation.timeScale
                    }
                )
            }
            return
        }
    }

    GetOnSkill(): (self: BasicState<any>, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            let enemies = self.component.getEnimies(fightMap.allLiveCharacter)
            if (enemies.length <= 0) return
            actionState.targets.push(enemies[Math.floor(enemies.length * Math.random())].state)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            actionState.targets[0].component.direction ,
                            actionState.targets[0].component.coordinate.row , 
                            actionState.targets[0].component.coordinate.col ,
                            "attack"
                        ) ,
                        moveCurve: false ,
                        moveTimeScale: actionState.targets[0].component.holAnimation.timeScale
                    }
                )
                await self.component.holAnimation.playAnimation("skill" , 1 , self.component.defaultState)
            }
            // 结算
            for (const target of actionState.targets) {
                // 添加流血 TODO
                const bleedBuff = new BuffState({id: "bleed"} , {
                    roundReduceBleed: self.attack * 0.5
                })
                target.component.addBuff(self.component , bleedBuff)
                // 两回合后去掉
                fightMap.listenRoundEvent(2 , () => target.component.deleteBuff(bleedBuff) )
                // 攻击
                fightMap.actionAwaitQueue.push(
                    self.component.attack(self.attack * 1.5 , target.component)
                )
            }
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            self.component.direction ,
                            self.component.coordinate.row , 
                            self.component.coordinate.col ,
                            "ordinary"
                        ) ,
                        moveCurve: true ,
                        moveTimeScale: self.component.holAnimation.timeScale
                    }
                )
            }
            return
        }
    }

}