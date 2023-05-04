import { _decorator, Button, Component, Node, Prefab } from 'cc';
import { util } from '../../../util/util';
import { getConfig } from '../../../common/config/config';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharacterAvatar } from '../../../prefab/HolCharacterAvatar';
const { ccclass, property } = _decorator;

@ccclass('HeroAllHeros')
export class HeroAllHeros extends Component {

    // 内容节点
    @property(Node)
    ContentNode: Node

    // 开始
    protected async start() {
        const config = getConfig()
        const close = await util.message.load()
        const cahracterQueue = []
        config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) cahracterQueue.push(c) }))
        await this.render([].concat(cahracterQueue , config.userData.characters))
        close()
    }

    // 渲染函数
    async render(characters: CharacterStateCreate[]) {
        const nodePool = util.resource.getNodePool(
            await util.bundle.load("prefab/HolCharacterAvatar" , Prefab)
        )
        this.ContentNode.children.forEach(node => {
            node.off("click")
            node.getComponent(Button).transition = 0
            nodePool.put(node)
        })
        for (const character of characters) {
            const node = nodePool.get()
            const characterAvatar = node.getComponent(HolCharacterAvatar)
            characterAvatar.setCharacter(character)
            node.getComponent(Button).transition = 3
            node.getComponent(Button).zoomScale = 0.9
            this.ContentNode.addChild(node)
            node.on("click" , () => {})
        }
        return
    }
}

