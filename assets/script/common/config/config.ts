import { CharacterStateCreate } from "../../game/fight/character/CharacterState"
import { EquipmentStateCreate } from "../../game/fight/equipment/EquipmentState"
import { ItemStateCreate } from "../../game/fight/item/ItemState"

export class Resource {
    gold: number = 100000000
    diamond: number = 100000
    soul: number = 100000000
}

class VolumeDetail {
    // 战斗音量
    fight: number = 1
    // 家园音量
    home: number = 1
    // 角色音量
    character: number = 1

    constructor(v?: Partial<VolumeDetail>) {
        if (!v) return
        Object.keys(v).forEach(k => this[k] = v[k])
    }
}

let globalId: number = 1

class UserData extends Resource{

    public lv: number = 1

    public exp: number = 0

    public name: string = "用户12138"

    public backpack: ItemStateCreate[] = []

    public equipments: EquipmentStateCreate[] = []

    public characters: CharacterStateCreate[] = []

    public characterQueue: CharacterStateCreate[][] = [
        [null , null , null] ,
        [null , null , null] ,
        [null , null , null]
    ]

    // 已经收集到的英雄
    public hasCollectCharacterId: string[] = []

    constructor(or?: Partial<UserData>) {
        super()
        // 测试角色
        this.addNewCharacter({
            id: "sunwukong" ,
            lv: 100 ,
            star: 3 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "fearOfDemons" ,
            lv: 90 ,
            star: 1 ,
            equipment: []
        })
        if (!or) { return }
        this.lv = or.lv || 1
        this.exp = or.exp || 1
        this.gold = or.gold || 1000
        this.diamond = or.diamond || 100
        this.soul = or.soul || 1000
        this.hasCollectCharacterId = or.hasCollectCharacterId || []
        // 原有的物品
        ;(or.backpack || []).forEach(i => this.addNewItem(i.id , i.number))
        // 原有角色
        ;(or.characters || []).forEach(c => { this.addNewCharacter(c) })
        // 原有装备
        ;(or.equipments || []).forEach(e => { this.addNewEquipment(e.id , e.lv) })
        // 原有出战角色
        ;or.characterQueue.forEach((cq , i) => cq.forEach((c , j) => this.characterQueue[i][j] = {...c , uuid: ++globalId}))
    }

    // 添加新装备
    public addNewEquipment(id: string , lv?: number , quality?: number) {
        this.equipments.push({
            id ,
            lv: lv || 1 ,
            uuid: ++globalId ,
            quality: quality || 1
        })
    }

    // 添加新角色
    public addNewCharacter(character: CharacterStateCreate) {
        const equipment: EquipmentStateCreate[] = [];
        (character.equipment || []).forEach(e => equipment.push({...e , uuid: ++globalId}))
        this.characters.push({
            ...character ,
            star: character.star || 1 ,
            equipment ,
            uuid: ++globalId
        })
        if (this.hasCollectCharacterId.indexOf(character.id) === -1)
            this.hasCollectCharacterId.push(character.id)
    }

    // 添加新物品
    public addNewItem(id: string , num: number) {
        for (let i = 0; i < this.backpack.length; i++) {
            const item = this.backpack[i];
            if (item.id === id) {
                item.number += num
                return
            }
        }
        this.backpack.push({id , number: num})
    }
}

class Config {

    // 版本
    public version: string = "0.0.1"

    // 总音量
    public volume: number = 0.1

    // 用户数据
    public userData: UserData = new UserData()

    // 详细音量
    public volumeDetail: VolumeDetail = new VolumeDetail()

    constructor(con?: Partial<Config>) {
        if (!con) return
        if (con.version !== this.version) return
        Object.keys(con).forEach(k => this[k] = con[k])
        this.userData = new UserData(con.userData)
        this.volumeDetail = new VolumeDetail(con.volumeDetail)
    }

}

// 如果没有用户数据则创建一个新的数据
let config: Config = null

// 存储config信息
export function stockConfig() {
    config.userData.backpack = config.userData.backpack.filter(i => i.number > 0)
    localStorage.setItem("UserConfigData" , JSON.stringify(config))
}

// 获取config
export function getConfig(): Config {
    if (config) return config
    const configJSON = localStorage.getItem("UserConfigData")
    config = configJSON ? new Config(JSON.parse( configJSON )) : new Config
    return config
}
