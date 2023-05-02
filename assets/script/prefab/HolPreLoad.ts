import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HolPreLoad')
export class HolPreLoad extends Component {

    @property(Node)
    public ValueNode: Node

    @property(Node)
    public TipNode: Node

    private $tips: string[] = ["提示\n我是一个小提示"]

    private $current: number = 0
    private $process: number = 0

    private $completeQueue: Function[] = []

    setProcess(num: number) {
        this.$process = num
    }

    setTips(tips: string[]) {
        this.$tips = tips
    }

    listenComplete(com: Function) {
        this.$completeQueue.push(com)
    }

    private $currentIndex: number = 0
    private $accumulateTime: number = 0
    protected update(dt: number): void {
        if (this.$current >= 100) {
            this.$completeQueue.forEach(c => c())
            this.node.active = false
            return
        }
        if (this.$current < this.$process) {
            this.$current += dt * 45
            this.ValueNode.setScale(this.$current / 100 , 1 , 1)
        }
        this.$accumulateTime -= dt
        if (this.$accumulateTime <= 0) {
            this.TipNode.getComponent(Label).string = 
                this.$tips[this.$currentIndex]
            this.$currentIndex++
            this.$accumulateTime = 4
            if (this.$currentIndex >= this.$tips.length) this.$currentIndex = 0 
        }
    }
}

