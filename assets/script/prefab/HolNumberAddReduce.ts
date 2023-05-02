import { _decorator, Component, EditBox, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HolNumberAddReduce')
export class HolNumberAddReduce extends Component {

    // 加减框数据展示
    @property(Node)
    NumberValueNode: Node

    // 数字
    private $number = 0

    // 获取数字
    public get number(): number {
        return this.$number
    }

    // 设置数字
    public set number(v: number) {
        this.NumberValueNode.getComponent(EditBox).string = v + ''
    }

    // 所有改变时队列函数
    private changeQueue: ((o: number , n: number) => boolean)[] = []

    // 监听
    listen(event: "change" , call: any) {
        if (event === "change") 
            this.changeQueue.push(call)
    }

    // 增加函数
    add() {
        for (const iterator of this.changeQueue)
            if (!iterator(this.$number , this.$number + 1)) return
        this.$number++
        this.number = this.$number
    }

    // 减少函数
    reduce() {
        for (const iterator of this.changeQueue)
            if (!iterator(this.$number , this.$number - 1)) return
        this.$number--
        this.number = this.$number
    }
}

