import { math } from "cc";
import { GetCharacterCoordinatePosition, HolCharacter } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { util } from "../../../util/util";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { BuffState } from "../../fight/buff/BuffState";
import { RegisterCharacter } from "../../fight/character/CharacterEnum";
import { CharacterMetaState } from "../../fight/character/CharacterMetaState";
import { CharacterState } from "../../fight/character/CharacterState";

@RegisterCharacter({id: "sunwukong"})
class Character extends CharacterMetaState {

    name: string = "孙悟空"

    AnimationDir: string = "game/fight_entity/character/sunwukong"

    AnimationType: "DrangonBones" | "Spine" = "Spine"

    AvatarPath: string = "game/fight_entity/character/sunwukong/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "nature" | "abyss" | "dark" | "machine"|"sacred" = "sacred"

    CharacterQuality: number = 5

    AnimationScale: number = 0.7

    HpGrowth: number = 70

    AttackGrowth: number = 25

    DefenceGrowth: number = 20

    PierceGrowth: number = 10

    SpeedGrowth: number = 15

    Energy: number = 100

    PassiveIntroduceOne: string = `
    
    额外获得 20% 速度
    额外获得 20% 攻击力
    额外获得 20% 护甲穿透
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    
    额外获得 20% 生命值
    额外获得 20% 攻击力
    每次攻击后有 20% 概率再次出手
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    
    对一排敌人造成150%攻击力的伤害
    并且眩晕敌人2回合
    `.replace(/ /ig , "")

    OnCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.speed *= 1.2
            self.attack *= 1.2
            self.pierce *= 1.2
        }
        if (self.star >= 4) {
            self.maxHp *= 1.2
            self.attack *= 1.2
        }
    }

    GetOnAttack(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            const selfComponent = self.component
            // 获取敌人
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)
                .sort((a , b) => a.coordinate.col - b.coordinate.col)
            const enemy = enemys[0]
            if (!enemy) return
            actionState.targets.push(enemy.state)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                // 移动过去
                await util.sundry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        enemy.direction , 
                        enemy.coordinate.row ,
                        enemy.coordinate.col ,
                        "attack"
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
                await selfComponent.holAnimation.playAnimation("attack" , 1 , selfComponent.defaultState)
            }
            // 造成伤害
            for (const target of actionState.targets)
                await selfComponent.attack(self.attack * 1.0 , target.component)
            // 回到原位
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        selfComponent.direction , 
                        selfComponent.coordinate.row ,
                        selfComponent.coordinate.col ,
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
            }
            // 再次出手 20% 概率
            if ( self.star >= 4 && Math.random() < 0.2 ) {
                if (fightMap.isPlayAnimation) await self.component.showString("再次出手")
                await self.component.action()
            }
            return
        }
    }

    GetOnSkill(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            const selfComponent = self.component
            // 获取敌人
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)
                .sort((a , b) => a.coordinate.col - b.coordinate.col)
            const enemy = enemys[0]
            if (!enemy) return
            actionState.targets.push(enemy.state)
            enemys.forEach((e , i) => {
                if (i === 0) return
                if (e.coordinate.row === enemy.coordinate.row)
                    actionState.targets.push(e.state)
            })
            // 播放动画
            if (fightMap.isPlayAnimation) {
                // 移动过去
                await util.sundry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        enemy.direction , 
                        enemy.coordinate.row ,
                        enemy.coordinate.col ,
                        "attack"
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
                await selfComponent.holAnimation.playAnimation("skill" , 1)
                selfComponent.holAnimation.playAnimation(selfComponent.defaultState)
            }
            // 造成伤害 ...
            for (const target of actionState.targets) {
                // 添加眩晕状态
                const vertigo = new BuffState({id: "vertigo"})
                target.component.addBuff(selfComponent , vertigo)
                // 两回合后去掉
                fightMap.listenRoundEvent(2 , () => target.component.deleteBuff(vertigo) )
                // 攻击
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * 1.5 , target.component)
                )
            }
            // 回到原位
            if (fightMap.isPlayAnimation) 
                await util.sundry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        selfComponent.direction , 
                        selfComponent.coordinate.row ,
                        selfComponent.coordinate.col ,
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
            return
        }
    }
}