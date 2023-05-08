import { _decorator, Component, director, Node, SpriteFrame } from 'cc';
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
        director.preloadScene("Home")
        holPreLoad.setProcess(20)

        await util.message.preloadConfirm()
        holPreLoad.setProcess(30)
        await util.message.preloadPrompt()
        holPreLoad.setProcess(40)
        await util.message.preloadLoad()
        holPreLoad.setProcess(60)
        await util.bundle.loadDir("image/number" , SpriteFrame)
        holPreLoad.setProcess(70)
        util.message.preloadIntroduce()
        holPreLoad.setProcess(80)

        holPreLoad.setProcess(100)

        // 监听进度条完成函数
        holPreLoad.listenComplete(() => director.loadScene("Home"))
    }
}

