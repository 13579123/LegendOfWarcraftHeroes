import { Asset, AssetManager, resources } from "cc";
import { BasicMetaState } from "../BasicMetaState";
import { CharacterState } from "./CharacterState";
import { GetCharacterCoordinatePosition } from "../../../prefab/HolCharacter";
import { util } from "../../../util/util";
import { ActionState } from "../ActionState";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";

export type CampType = "ordinary"|"nature"|"abyss"|"dark"|"machine"|"sacred"

// 获取阵营伤害率
export function getCampHurtPercent(self: CampType , targte: CampType): number {
    if (self === "ordinary" || targte === "ordinary") return 1.0
    
    if (self === "machine" && targte === "nature") return 1.2
    if (self === "nature" && targte === "machine") return 0.8

    return 1.0
}

export class CharacterMetaState extends BasicMetaState {

    // 动画所处文件夹
    AnimationDir: string

    // 动画缩放
    AnimationScale: number = 1.0

    // 动画位置
    AnimationPosition: {x: number , y: number} = {x: 0 , y: 0}

    // 动画方向 1 为右边 -1为左边
    AnimationForward: number = 1

    // 动画类型
    AnimationType: "DrangonBones" | "Spine" = "Spine"

    // 动画bundle
    AnimationBundle: AssetManager.Bundle = resources

    // 头像路径
    AvatarPath: string

    // 角色阵营 普通 自然 深渊
    CharacterCamp: CampType = "ordinary"

    // 角色品质 1 普通 2 优秀 3 精良 4 史诗 5 传说
    CharacterQuality: number = 1

    // 角色能量条 10 ~ 200
    Energy: number = 200

    // 角色生命成长属性 30 ~ 100
    HpGrowth: number = 100

    // 角色攻击成长属性 5 ~ 40
    AttackGrowth: number = 40

    // 角色防御成长属性 1 ~ 30
    DefenceGrowth: number = 30

    // 角色速度成长属性 10 ~ 30
    SpeedGrowth: number = 30

    // 角色穿透 10 ~ 20
    PierceGrowth: number = 20

    // 格挡原型 1 ~ 100
    Block: number = 5

    // 暴击原型 1 ~ 100
    Critical: number = 5

    // 攻击描述
    AttackIntroduce: string = `普通攻击

    对一个敌人造成攻击力 100% 的伤害
    `

    // 被动技能一描述
    PassiveIntroduceOne: string = `技能1
    
    无
    `

    // 被动技能二描述
    PassiveIntroduceTwo: string = `技能2
    
    无
    `

    // 技能描述
    SkillIntroduce: string = `普通攻击
    
    对一个敌人造成攻击力 130% 的伤害
    `

    // 默认普通攻击
    GetOnAttack(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
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
            for (const state of actionState.targets) 
                await self.component.attack(self.attack * 1.0 , state.component)
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