import { Prefab, find , Node} from "cc";
import { ContentOption, HolConfirmMessage } from "../../prefab/HolConfirmMessage";
import { load } from "../bundle/load";
import { getNodePool } from "../resource/getNodePool";

export async function preloadConfirm() {
    const nodePool = getNodePool(await load("prefab/HolConfirmMessage" , Prefab))
        const node = nodePool.get()
        nodePool.put(node)
}

// 弹出消息 返回一个Promise 确认的话返回 true 否则返回 false
export async function confirm(co: ContentOption , parent: Node = find("Canvas")): Promise<boolean> {
    const nodePool = getNodePool(await load("prefab/HolConfirmMessage" , Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    const holConfirmMessage = node.getComponent(HolConfirmMessage)
    return new Promise(res => {
        holConfirmMessage.setContent(co)
        holConfirmMessage.listen("sure" , () => {
            res(true)
            holConfirmMessage.closeConfirm()
        })
        holConfirmMessage.listen("cancel" , () => {
            res(false)
            holConfirmMessage.closeConfirm()
        })
        holConfirmMessage.listen("close" , () => nodePool.put(node))
    })
}