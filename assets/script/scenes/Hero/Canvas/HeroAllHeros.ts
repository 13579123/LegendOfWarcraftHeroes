import { _decorator, Button, Component, Node, Prefab } from 'cc';
import { util } from '../../../util/util';
import { getConfig } from '../../../common/config/config';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharacterAvatar } from '../../../prefab/HolCharacterAvatar';
import { HolCharactersQueue } from '../../../prefab/HolCharactersQueue';
import { HeroCharacterDetail } from './HeroCharacterDetail';
const { ccclass, property } = _decorator;

@ccclass('HeroAllHeros')
export class HeroAllHeros extends Component {

    // 开始
    protected async start() {
        const config = getConfig()
        const close = await util.message.load()
        const cahracterQueue = []
        config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) cahracterQueue.push(c) }))
        await this.render([].concat(cahracterQueue , config.userData.characters) , async (c , n) => {
            const characterDetail = this.node.parent.getChildByName("CharacterDetail")
            characterDetail.active = true
            await characterDetail.getComponent(HeroCharacterDetail).setCharacter(c)
        })
        close()
    }

    async render(characterQueue: CharacterStateCreate[] , clickFun?: (characters: CharacterStateCreate , node: Node) => any) {
        await this.node.getChildByName("HolCharactersQueue")
        .getComponent(HolCharactersQueue)
        .render(characterQueue , clickFun)
    }
}

