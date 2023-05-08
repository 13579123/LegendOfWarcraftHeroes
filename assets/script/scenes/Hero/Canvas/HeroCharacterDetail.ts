import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { util } from '../../../util/util';
import { HolAnimation } from '../../../prefab/HolAnimation';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
import { HeroCharacterDetailPorperty } from './CharacterDetail/HeroCharacterDetailPorperty';
const { ccclass, property } = _decorator;

@ccclass('HeroCharacterDetail')
export class HeroCharacterDetail extends Component {

    @property(Node)
    PropertyNode: Node

    // 返回
    goBack() {
        this.node.active = false
    }

    // 上一次的角色动画
    private $lastaNimation: Node
    // 设置角色
    async setCharacter(create: CharacterStateCreate) {
        const close = await util.message.load()
        const characterAnimationNode = this.node.getChildByName("CharacterAnimation")
        if (this.$lastaNimation) characterAnimationNode.removeChild(this.$lastaNimation)
        const meta = CharacterEnum[create.id]
        const holAnimationPrefab = await util.bundle.load("prefab/HolAnimation" , Prefab)
        const holAnimationNode = instantiate(holAnimationPrefab)
        characterAnimationNode.addChild(holAnimationNode)
        await holAnimationNode.getComponent(HolAnimation).initBones({
            animationScale: meta.AnimationScale * 1.7 ,
            animationDir: meta.AnimationDir ,
            animationType: meta.AnimationType ,
            animationPosition: meta.AnimationPosition
        })
        characterAnimationNode.addChild(holAnimationNode)
        this.$lastaNimation = holAnimationNode
        holAnimationNode.active = false
        // 设置属性
        await this.PropertyNode.getComponent(HeroCharacterDetailPorperty).renderProperty(create)
        close()
        setTimeout(async () => {
                holAnimationNode.active = true
                holAnimationNode.getComponent(HolAnimation).playAnimation("rebirth" , 1 , "rest")
            } , 50
        )
        return
    }


}

