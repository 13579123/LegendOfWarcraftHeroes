import { _decorator, Component, math, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('HolNumber')
export class HolNumber extends Component {

    // 颜色
    private $color: math.Color = new math.Color(255,255,255,255)
    public get color() {
        return this.$color
    }
    public set color(n: math.Color) {
        this.$color = n
        this.node.children.forEach(c => {
            c.getComponent(Sprite).color = this.$color
        })
    }

    // 设置数字
    private $number: number = 0
    public get number() {
        return this.$number
    }
    public set number(n: number) {
        this.$number = Math.ceil(n)
        this.renderNumber(this.$number , this.frontSize).then()
    }

    // 字体大小
    private $frontSize: number = 28
    public get frontSize() {
        return this.$frontSize
    }
    public set frontSize(n: number) {
        this.$frontSize = n
    }

    // 渲染函数
    private async renderNumber(n: number , size: number) {
        this.node.removeAllChildren()
        const abs = ((n > 0 ? "+" : "-") + n + "").replace("--" , "-")
        const half = Math.floor(abs.length / 2)
        const numbers = await util.bundle.loadDir("image/number" , SpriteFrame)
        for (let i = 0; i < abs.length; i++) {
            const node = new Node
            this.node.addChild(node)
            const s = node.addComponent(Sprite)
            s.spriteFrame = numbers.filter(s => s.name === abs.charAt(i))[0]
            if (abs.charAt(i) !== "-") s.getComponent(UITransform).setContentSize(new math.Size(size , size))
            const distance = size - size * 0.3
            if (i < half) {
                node.setPosition(-distance * (half - i) , 0 , node.position.z)
            } else {
                node.setPosition(distance * (i - half) , 0 , node.position.z)
            }
            node.getComponent(Sprite).color = this.$color
        }
        return
    }
}

