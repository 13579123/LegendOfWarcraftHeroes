import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { util } from '../../../util/util';
import { HolAnimation } from '../../../prefab/HolAnimation';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
import { HeroCharacterDetailPorperty } from './CharacterDetail/HeroCharacterDetailPorperty';
import { HeroAllHeros } from './HeroAllHeros';
import { getConfig } from '../../../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('HeroCharacterDetail')
export class HeroCharacterDetail extends Component {

    // 所有角色的节点
    @property(Node)
    HeroAllHeroNode: Node

    // 返回
    async goBack() {
        this.node.active = false
        const config = getConfig()
        const close = await util.message.load()
        const cahracterQueue = []
        config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) cahracterQueue.push(c) }))
        await this.HeroAllHeroNode.getComponent(HeroAllHeros).render([].concat(cahracterQueue , config.userData.characters) , async (c , n) => {
            const characterDetail = this.node.parent.getChildByName("CharacterDetail")
            characterDetail.active = true
            await characterDetail.getComponent(HeroCharacterDetail).setCharacter(c)
        })
        close()
    }

    // 上一次的角色动画
    private $lastaNimation: Node
    // 设置角色
    async setCharacter(create: CharacterStateCreate) {
        const propertyNode = this.node.getChildByName("Property")
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
        await propertyNode.getComponent(HeroCharacterDetailPorperty).renderProperty(create)
        close()
        setTimeout(async () => {
                holAnimationNode.active = true
                holAnimationNode.getComponent(HolAnimation).playAnimation("rebirth" , 1 , "rest")
            } , 50
        )
        return
    }


}

