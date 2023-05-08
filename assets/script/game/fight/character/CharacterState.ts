import { Component } from "cc";
import { BasicState } from "../BasicState";
import { CharacterMetaState } from "./CharacterMetaState";
import { BuffState } from "../buff/BuffState";
import { CharacterEnum } from "./CharacterEnum";
import { EquipmentState, EquipmentStateCreate } from "../equipment/EquipmentState";
import { HolCharacter } from "../../../prefab/HolCharacter";
import { util } from "../../../util/util";

export type CharacterStateCreate = {
    // id
    id: string
    // uuid
    uuid?: number
    // 等级
    lv: number
    // 星级
    star: number
    // 拥有装备
    equipment: EquipmentStateCreate[]
}

export class CharacterState extends BasicState<CharacterMetaState> {

    /**
     * 所属组件
     * 一般来说是 HolCharacter 对象
     */
    component: HolCharacter

    // 名称
    name: string
    // 等级
    lv: number
    // 角色星级
    star: number
    // 所属create
    create: CharacterStateCreate

    // 生命值
    hp: number
    // 最大生命值
    maxHp: number
    // 能量值
    energy: number
    // 最大能量值
    maxEnergy: number
    // 攻击力
    attack: number
    // 防御力
    defence: number
    // 速度
    speed: number
    // 穿透
    pierce: number
    // 治疗效率
    curePercent: number = 1.0
    // 伤害率
    hurtPercent: number = 1.0
    // 免伤率
    FreeInjuryPercent: number = 0.0
    // 暴击
    critical: number
    // 格挡
    block: number = 5

    // 所有buff
    buff: BuffState[] = []
    // 所有装备
    equipment: EquipmentState[] = []

    /** 
     * 构造器
     * component 是所属组件
     */
    constructor(create: CharacterStateCreate , component: HolCharacter) {
        const meta: CharacterMetaState = CharacterEnum[create.id]
        super(meta)
        this.lv = create.lv
        this.star = create.star
        this.name = meta.name
        this.component = component
        this.create = create

        this.maxEnergy = meta.Energy
        this.maxHp = create.lv * meta.HpGrowth * ((create.star - 1) * 0.15 + 1) * (create.lv / 80 + 0.8)
        this.attack = create.lv * meta.AttackGrowth * ((create.star - 1) * 0.15 + 1) * (create.lv / 80 + 0.8)
        this.defence = create.lv * meta.DefenceGrowth * ((create.star - 1) * 0.15 + 1) * (create.lv / 80 + 0.8)
        this.speed = create.lv * meta.SpeedGrowth * ((create.star - 1) * 0.15 + 1) * (create.lv / 80 + 0.8)
        this.pierce = create.lv * meta.PierceGrowth * ((create.star - 1) * 0.15 + 1) * (create.lv / 80 + 0.8)
        this.critical = meta.Critical
        this.block = meta.Block

        create.equipment.forEach(ec => this.addEquipment(ec))
        meta.OnCreateState(this)

        this.hp = this.maxHp
        this.energy = 20
    }

    // 合理化数据
    reasonableData() {
        if (this.hp > this.maxHp) this.hp = this.maxHp
        if (this.energy > this.maxEnergy) this.energy = this.maxEnergy
        if (this.hp < 0) this.hp = 0
        if (this.energy < 0) this.energy = 0
    }
    
    /** 
     * 添加装备函数
     * 在构造时调用会将装备所添加的属性加到该对象上
     */
    private addEquipment(equipment: EquipmentStateCreate) {
        const equipmentState = new EquipmentState(equipment , this)
        this.equipment.push(equipmentState)
        equipmentState.AddPropertyToCharacter(equipmentState)
    }
}