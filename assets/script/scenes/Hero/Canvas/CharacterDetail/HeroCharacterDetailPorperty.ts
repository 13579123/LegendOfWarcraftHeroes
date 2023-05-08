import { _decorator, Component, Label, Node, sp } from 'cc';
import { CharacterState, CharacterStateCreate } from '../../../../game/fight/character/CharacterState';
import { util } from '../../../../util/util';
const { ccclass, property } = _decorator;

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
        this.node.getChildByName("Hp").getChildByName("Value").getComponent(Label).string = Math.floor(this.$state.maxHp) + ''
        this.node.getChildByName("Attack").getChildByName("Value").getComponent(Label).string = Math.floor(this.$state.attack) + ''
        this.node.getChildByName("Defence").getChildByName("Value").getComponent(Label).string = Math.floor(this.$state.defence) + ''
        this.node.getChildByName("Speed").getChildByName("Value").getComponent(Label).string = Math.floor(this.$state.speed) + ''
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
        if (this.$answerLevelUp) {
            const result = await util.message.confirm({
                message: "确定要升级吗?" ,
            })
            if (result === false) return
        }
        // 重新渲染
        await this.renderProperty(this.$state.create)
        // 播放动画
        const levelUpEffectSkeleton = this.node.getChildByName("LevelUpEffect").getComponent(sp.Skeleton)
        levelUpEffectSkeleton.node.active = true
        levelUpEffectSkeleton.setAnimation(0 , "animation" , false)
        levelUpEffectSkeleton.setCompleteListener(() => levelUpEffectSkeleton.node.active = false )
    }
}

