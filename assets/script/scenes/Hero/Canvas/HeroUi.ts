import { _decorator, Component, director, Node } from 'cc';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('HeroUi')
export class HeroUi extends Component {
    
    async GoBack() {
        const close = await util.message.load()
        director.preloadScene("Home" , () => close())
        director.loadScene("Home")
    }

}

