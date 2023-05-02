import { _decorator, Component, director, Node } from 'cc';
import { HolPreLoad } from '../../prefab/HolPreLoad';
import { util } from '../../util/util';
const { ccclass, property } = _decorator;

@ccclass('PreloadCanvas')
export class PreloadCanvas extends Component {
    // 预加载
    async start() {
        director.preloadScene("Home")
        // HolPreLoad
        const holPreLoad = this.node.getChildByName("HolPreLoad").getComponent(HolPreLoad)
        holPreLoad.setProcess(20)

        await util.message.preloadConfirm()
        holPreLoad.setProcess(30)
        await util.message.preloadPrompt()
        holPreLoad.setProcess(40)

        holPreLoad.setProcess(100)

        // 监听进度条完成函数
        holPreLoad.listenComplete(() => director.loadScene("Home"))
    }
}

