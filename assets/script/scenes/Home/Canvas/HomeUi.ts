import { _decorator, Component, director, Node } from 'cc';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('HomeUi')
export class HomeUi extends Component {

    // 打开背包
    async OpenHero() {
        const close = await util.message.load()
        director.preloadScene("Hero" , () => {
            close()
        })
        director.loadScene("Hero")
    }

}

