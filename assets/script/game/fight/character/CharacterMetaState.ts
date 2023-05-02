import { Asset, AssetManager, resources } from "cc";
import { BasicMetaState } from "../BasicMetaState";
import { CharacterState } from "./CharacterState";

export class CharacterMetaState extends BasicMetaState {

    // 动画所处文件夹
    AnimationDir: string

    // 动画缩放
    AnimationScale: number = 1.0

    // 动画方向 1 为右边 -1为左边
    AnimationForward: number = 1

    // 动画类型
    AnimationType: "DrangonBones" | "Spine" = "Spine"

    // 动画bundle
    AnimationBundle: AssetManager.Bundle = resources

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

    // 角色治疗率 
    CurePercent: number = 1.0

    // 角色伤害率
    HurtPercent: number = 1.0

    // 格挡原型 1 ~ 100
    Block: number = 5

    // 暴击原型 1 ~ 100
    Critical: number = 5

    // 闪避原型 1 ~ 100
    Miss: number = 5

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
}