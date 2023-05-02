import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

// 内容参数
export type PromptMessageOption = {
    // 提示内容
    message: string
    // 内容持续时间 单位 s
    continueTime?: number
}

@ccclass('HolPromptMessage')
export class HolPromptMessage extends Component {

    // 内容状态 0 开始 1 持续 2关闭
    private $state = 0

    // 内容在 1 的持续状态
    private $time = 0

    // 持续时间
    private $continueTime = 1

    // 关闭时的函数
    private $closeQueue: (() => any)[] = []

    // 设置内容
    setContent(option: PromptMessageOption) {
        // 设置游戏内容
        this.node.getChildByName("Message").getComponent(Label).string = option.message
        // 设置状态开始
        this.$state = 0
        // 初始状态
        this.node.setScale(0 , 0 , 0)
        // 持续时间
        this.$continueTime = option.continueTime || 1
    }

    // 帧行动
    protected update(dt: number): void {
        // 渐入
        if (this.$state === 0) {
            if (this.node.scale.x >= 1) {
                this.node.setScale(1,1,1)
                this.$state = 1
                this.$time = 0
            } else 
                this.node.setScale(
                    this.node.scale.x + dt * 10 ,
                    this.node.scale.y + dt * 10 ,
                    this.node.scale.z
                )
        } 
        // 持续
        else if (this.$state === 1) {
            if (this.$time >= this.$continueTime) this.$state = 2
            this.$time += dt
        } 
        // 关闭
        else if (this.$state === 2) {
            this.$closeQueue.forEach(c => c())
        }
        return
    }

    // 监听关闭函数
    listen(event: "close" , call: () => any) {
        if (event === "close") {
            this.$closeQueue.push(call)
        }
    }
}

