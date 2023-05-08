import { _decorator, Component, director, EventMouse, Node } from 'cc';
import { util } from '../../../util/util';
import { getConfig } from '../../../common/config/config';
import { HeroAllHeros } from './HeroAllHeros';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
const { ccclass, property } = _decorator;

@ccclass('HeroUi')
export class HeroUi extends Component {
    
    // 回到主页
    async GoBack() {
        const close = await util.message.load()
        director.preloadScene("Home" , () => close())
        director.loadScene("Home")
    }

    // 当前过滤阵容
    private $currentCamp: string = ""
    // 阵容过滤
    async filterByCamp(e: EventMouse , camp: string) {
        const allHeros = this.node.parent.getChildByName("AllHeros").getComponent(HeroAllHeros)
        let cahracterQueue: CharacterStateCreate[] = []
        this.node.children.forEach(node => {
            const lightNode = node.getChildByName("Light")
            if (lightNode) lightNode.active = false
        })
        if (this.$currentCamp === camp) {
            const config = getConfig()
            const close = await util.message.load()
            config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) cahracterQueue.push(c) }))
            cahracterQueue = cahracterQueue.concat(config.userData.characters)
            await allHeros.render(cahracterQueue)
            close()
            this.$currentCamp = ""
        } else {
            this.$currentCamp = camp
            const config = getConfig()
            const close = await util.message.load()
            config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) cahracterQueue.push(c) }))
            cahracterQueue = cahracterQueue.concat(config.userData.characters)
            cahracterQueue = cahracterQueue.filter(c => CharacterEnum[c.id].CharacterCamp === camp)
            await allHeros.render(cahracterQueue)
            close()
            e.target.getChildByName("Light").active = true
        }
    }
}

