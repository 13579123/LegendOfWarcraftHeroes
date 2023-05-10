import { _decorator, AudioSource, Component, find, Label, Node, sp } from 'cc';
import { CharacterState, CharacterStateCreate } from '../../../../game/fight/character/CharacterState';
import { util } from '../../../../util/util';
import { getConfig } from '../../../../common/config/config';
import { HolUserResource } from '../../../../prefab/HolUserResource';
import { CharacterEnum } from '../../../../game/fight/character/CharacterEnum';
const { ccclass, property } = _decorator;

// 升级所需金币
function levelUpNeedGold(create: CharacterStateCreate): number {
    return Math.ceil(
        CharacterEnum[create.id].CharacterQuality * create.lv * (create.lv / (create.lv + 80) + 1) * 100
    )
}

// 升级所需钻石
function levelUpNeedSoule(create: CharacterStateCreate): number {
    return Math.ceil(
        CharacterEnum[create.id].CharacterQuality * create.lv * (create.lv / (create.lv + 80) + 1) * 100 * 0.5
    )
}

@ccclass('HeroCharacterDetailPorperty')
export class HeroCharacterDetailPorperty extends Component {

    // 角色状态
    private $state: CharacterState

    // 是否询问升级
    private $answerLevelUp: boolean = true

    // 渲染属性
    async renderProperty(create: CharacterStateCreate) {
        this.$state = new CharacterState(create , null)
        this.node.getChildByName("Name").getComponent(Label).string = "名称: " + this.$state.meta.name
        this.node.getChildByName("Lv").getComponent(Label).string = "Lv: " + this.$state.lv
        this.node.getChildByName("Hp").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.maxHp) + ''
        this.node.getChildByName("Attack").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.attack) + ''
        this.node.getChildByName("Defence").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.defence) + ''
        this.node.getChildByName("Speed").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.speed) + ''

        // 渲染星级
        const starNode = this.node.getChildByName("Star")
        starNode.children.forEach(n => n.active = false)
        starNode.children.forEach(n => n.children[0].active = false)
        for (let i = 0; i < CharacterEnum[create.id].CharacterQuality; i++) 
            starNode.children[i].active = true
        for (let i = 0; i < create.star; i++) 
            starNode.children[i].children[0].active = true

        // 是否满级
        if (create.lv >= 100) {
            this.node.getChildByName("LevelUp").active = false
        } else {
            this.node.getChildByName("LevelUp").active = true
            // 升级所需资源
            this.node.getChildByName("LevelUp")
                .getChildByName("LevelUpGold")
                .getChildByName("Value")
                .getComponent(Label).string = util.sundry.formateNumber(levelUpNeedGold(create))
            this.node.getChildByName("LevelUp")
                .getChildByName("LevelUpSoul")
                .getChildByName("Value")
                .getComponent(Label).string = util.sundry.formateNumber(levelUpNeedSoule(create))
        }
    }

    // 显示所有的属性
    async showAllProperty() {
        let message = ``
        message += ` 生命值: ${Math.ceil(this.$state.maxHp)}\n`
        message += ` 攻击力: ${Math.ceil(this.$state.attack)}\n`
        message += ` 防御力: ${Math.ceil(this.$state.defence)}\n`
        message += ` 速度值: ${Math.ceil(this.$state.speed)}\n`
        message += ` 穿透值: ${Math.ceil(this.$state.pierce)}\n`
        message += ` 格挡率: ${Math.ceil(this.$state.block)}%\n`
        message += ` 暴击率: ${Math.ceil(this.$state.critical)}%\n`
        message += ` 免伤率: ${Math.ceil(this.$state.FreeInjuryPercent * 100)}%\n`
        message += ` 最大能量: ${Math.ceil(this.$state.maxEnergy)}\n`
        await util.message.introduce({message})
    }

    // 英雄升级
    async characterLevelUp() {
        const config = getConfig()
        // 是否询问
        if (this.$answerLevelUp) {
            const result = await util.message.confirm({
                message: "确定要升级吗?" ,
                selectBoxMessage: "不再询问" ,
                selectBoxCallback: (b: boolean) => {this.$answerLevelUp = !b}
            })
            // 是否确定
            if (result === false) return
        }
        // 资源不足
        if (
            config.userData.gold < levelUpNeedGold(this.$state.create) 
            || 
            config.userData.soul < levelUpNeedSoule(this.$state.create)
        ) return await util.message.prompt({message: "资源不足"})
        // 资源减少
        config.userData.gold -= levelUpNeedGold(this.$state.create)
        config.userData.soul -= levelUpNeedSoule(this.$state.create)
        // 角色等级提升
        this.$state.create.lv++
        // 重新渲染
        await this.renderProperty(this.$state.create)
        find("Canvas/HolUserResource").getComponent(HolUserResource).render() // 资源渲染
        const levelUpEffectSkeleton = this.node.getChildByName("LevelUp").getChildByName("LevelUpEffect").getComponent(sp.Skeleton)
        //播放声音
        const audioSource = levelUpEffectSkeleton.node.getComponent(AudioSource)
        audioSource.volume = config.volume * config.volumeDetail.character
        audioSource.play()
        // 播放动画
        levelUpEffectSkeleton.node.active = true
        levelUpEffectSkeleton.node.children[0]?.getComponent(sp.Skeleton).setAnimation(0 , "animation" , false)
        levelUpEffectSkeleton.setAnimation(0 , "animation" , false)
        levelUpEffectSkeleton.setCompleteListener(() => levelUpEffectSkeleton.node.active = false)
    }
}

