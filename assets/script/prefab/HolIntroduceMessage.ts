import { _decorator, Component, Event, find, Label, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

export type HolIntroduceOption = {
    // 内容
    message: string ,
    // 按钮一
    buttonOne?: {
        message: string ,
        callback: any
    } ,
    // 按钮二
    buttonTwo?: {
        message: string ,
        callback: any
    } ,
}

@ccclass('HolIntroduceMessage')
export class HolIntroduceMessage extends Component {

    @property(Node)
    ContentNode: Node

    private $closeQueue: Function[] = []

    listen(e: "close" , fn: Function) {
        if (e === "close") this.$closeQueue.push(fn)
    }

    // 设置内容
    public setContent(option: HolIntroduceOption) {
        this.ContentNode.getComponent(Label).string = option.message
        const introduceNode = this.node.getChildByName("Introduce")
        if (option.buttonOne) {
            const buttonOne = introduceNode.getChildByName("ButtonOne")
            buttonOne.getChildByName("Value").getComponent(Label).string = option.buttonOne.message
            buttonOne.active = true
            buttonOne.on("click" , async () => {
                await option.buttonOne.callback()
                this.closeNode()
            })
        }
        if (option.buttonTwo) {
            const buttonTwo = introduceNode.getChildByName("ButtonTwo")
            buttonTwo.getChildByName("Value").getComponent(Label).string = option.buttonTwo.message
            buttonTwo.active = true
            buttonTwo.on("click" , async () => {
                await option.buttonTwo.callback()
                this.closeNode()
            })
        }
    }
    
    // 关闭函数
    public closeNode() {
        const introduceNode = this.node.getChildByName("Introduce")
        introduceNode.getChildByName("ButtonOne").off("click")
        introduceNode.getChildByName("ButtonTwo").off("click")
        for (const close of this.$closeQueue) close()
    }

}

