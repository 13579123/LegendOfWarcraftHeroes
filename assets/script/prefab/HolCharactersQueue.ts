import { _decorator, Button, Component, Node, Prefab } from 'cc';
import { CharacterStateCreate } from '../game/fight/character/CharacterState';
import { util } from '../util/util';
import { HolCharacterAvatar } from './HolCharacterAvatar';
const { ccclass, property } = _decorator;

@ccclass('HolCharactersQueue')
export class HolCharactersQueue extends Component {
    // 内容节点
    @property(Node)
    ContentNode: Node

    // 渲染函数
    async render(characters: CharacterStateCreate[] , clickFun?: (characters: CharacterStateCreate , node: Node) => any) {
        const nodePool = util.resource.getNodePool(
            await util.bundle.load("prefab/HolCharacterAvatar" , Prefab)
        )
        const childrens = [...this.ContentNode.children]
        for (let i = 0; i < childrens.length; i++) {
            const node = childrens[i];
            node.off("click")
            node.getComponent(Button).transition = 0
            nodePool.put(node)
        }
        for (const character of characters) {
            const node = nodePool.get()
            const characterAvatar = node.getComponent(HolCharacterAvatar)
            characterAvatar.setCharacter(character)
            node.getComponent(Button).transition = 3
            node.getComponent(Button).zoomScale = 0.9
            this.ContentNode.addChild(node)
            // 绑定事件
            node.on("click" , () => {if (clickFun) clickFun(character , node)})
            continue
        }
        return
    }
}

