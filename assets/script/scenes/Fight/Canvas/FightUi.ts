import { _decorator, Component, Event, Label, Node } from 'cc';
import { HolCharacter } from '../../../prefab/HolCharacter';
const { ccclass, property } = _decorator;

@ccclass('FightUi')
export class FightUi extends Component {

    @property(Node)
    FightMapNode: Node

    // 当前倍速
    private timeScale: number = 1

    // 倍速
    setTimeScale(e: Event) {
        this.timeScale++
        if (this.timeScale > 3) this.timeScale = 1
        for (const node of this.FightMapNode.children)
            node.getComponent(HolCharacter).holAnimation.timeScale = this.timeScale 
        e.target.getChildByName("Value").getComponent(Label).string = "x" + this.timeScale
        return
    }

}

