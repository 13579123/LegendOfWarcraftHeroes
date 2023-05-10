import { _decorator, Component, EventHandheld, Label, Node, Toggle } from 'cc';
const { ccclass, property } = _decorator;

// 内容选项
export type ContentOption = {
    title?: string // 标题
    message: string // 内容
    selectBoxMessage?: string // 选择框内容
    selectBoxCallback?: (t: boolean) => any // 选择框
    sureQueue? :(() => any)[] // 确定的回调
    cancelQueue? :(() => any)[] // 取消的回调
    closeQueue? :(() => any)[] // 关闭的回调
}

@ccclass('HolConfirmMessage')
export class HolConfirmMessage extends Component {

    // 内容节点
    @property(Node)
    ContentNode: Node

    /** 
     * 所有确定时的回调 
     * 两个按钮并不会有任何行为，但是可以绑定对应的行为
     */
    private $sureQueue: (() => any)[] = []

    /** 
     * 所有确定时的回调 
     * 两个按钮并不会有任何行为，但是可以绑定对应的行为
     */
    private $cancelQueue: (() => any)[] = []
    
    /** 
     * 所有关闭时的回调 
     * 本质上关闭不会进行任何操作
     * 可以设置关闭回调来指定关闭时的行为
     */
    private $closeQueue: (() => any)[] = []

    /** 
     * 设置确认框内容
     * 具体参数信息可以参考ContentOption类型
     */
    setContent(co: ContentOption) {
        // 标题
        this.node.getChildByName("Title").getComponent(Label).string = co.title || "标题"
        // 清空空格
        co.message = co.message.replace(/ /ig , "")
        co.message = co.message.replace(/&nbsp;/ig , " ")
        // 内容
        this.ContentNode.getComponent(Label).string = co.message
        // 选择框内容
        if (co.selectBoxMessage) {
            const radioNode = this.node.getChildByName("Radio")
            radioNode.active = true
            radioNode.getChildByName("RadioMessage").getComponent(Label).string = 
                co.selectBoxMessage
            radioNode.on("click" , () => { co.selectBoxCallback && co.selectBoxCallback(radioNode.getComponent(Toggle).isChecked) })
        }
        // 事件
        this.$sureQueue.concat(Array.from(co.sureQueue || []))
        this.$cancelQueue.concat(Array.from(co.cancelQueue || []))
        this.$closeQueue.concat(Array.from(co.closeQueue || []))
    }

    /** 
     * 绑定事件到对应的回调队列
     * sure 绑定确定的回调
     * cancel 绑定取消的回调
     * close 绑定关闭的回调
     */
    listen(event: "sure"|"cancel"|"close" , callback: () => any) {
        if (event === "sure") return this.$sureQueue.push(callback)
        if (event === "cancel") return this.$cancelQueue.push(callback)
        if (event === "close") return this.$closeQueue.push(callback)
    }

    /** 
     * 确认按钮点击事件
     */
    sure() { this.$sureQueue.forEach(c => c()) }

    /** 
     * 取消按钮点击事件
     */
    cancel() { this.$cancelQueue.forEach(c => c()) }

    /** 
     * 关闭本界面
     */
    closeConfirm() { this.$closeQueue.forEach(c => c()) }
}

