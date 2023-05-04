import { BasicMetaState } from "../BasicMetaState";
import { EquipmentState } from "./EquipmentState";

export class EquipmentMetaState extends BasicMetaState{

    // 角色生命成长属性 30 ~ 100
    HpGrowth: number = 100

    // 角色攻击成长属性 5 ~ 50
    AttackGrowth: number = 50

    // 角色防御成长属性 1 ~ 40
    DefenceGrowth: number = 40

    // 角色速度成长属性 10 ~ 30
    SpeedGrowth: number = 30

    // 角色治疗率 
    CurePercent: number = 1.0

    // 角色伤害率
    HurtPercent: number = 1.0

    // 格挡原型 1 ~ 100
    Block: number = 5

    // 暴击原型 1 ~ 100
    Critical: number = 5

    /** 
     * 获取添加属性到角色的函数
     * 所有属性的增加的操作在这里进行
     */
    GetAddPropertyToCharacter(): (self: EquipmentState) => Promise<any> {
        return async (self: EquipmentState) => {
            self.character.maxHp += self.maxHp
            self.character.attack += self.attack
            self.character.defence += self.defence
            self.character.speed += self.speed
            self.character.curePercent += self.curePercent
            self.character.hurtPercent += self.hurtPercent
            self.character.critical += self.critical
            self.character.block += self.block
        }
    }

}