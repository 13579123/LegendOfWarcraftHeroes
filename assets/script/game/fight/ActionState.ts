import { CharacterState } from "./character/CharacterState"

/** 
 * 角色行动状态对象
 * 每个角色行动都会创建对应的该对象
 * 修改该对象的值，可以修改角色之后的行动行为
 */
export class ActionState {
    // 是否可以行动 默认可以
    canAction: boolean = true
    // 目标们
    targets: CharacterState[] = []
    // 攻击方式 普通攻击 或者 技能攻击 会在行动开始时被赋值
    actionMethod: "attack"|"skill" = "attack"
}
