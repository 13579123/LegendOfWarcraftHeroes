import { Prefab, find , Node} from "cc";
import { getNodePool } from "../resource/getNodePool";
import { ContentOption } from "../../prefab/HolConfirmMessage";
import { HolIntroduceMessage, HolIntroduceOption } from "../../prefab/HolIntroduceMessage";
import { load } from "../bundle/load";

export async function preloadIntroduce() {
    const nodePool = getNodePool(await load("prefab/HolIntroduceMessage" , Prefab))
        const node = nodePool.get()
        nodePool.put(node)
}

// 弹出消息 返回一个Promise 确认的话返回 true 否则返回 false
export async function introduce(co: HolIntroduceOption , parent: Node = find("Canvas")): Promise<boolean> {
    const nodePool = getNodePool(await load("prefab/HolIntroduceMessage" , Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    const holConfirmMessage = node.getComponent(HolIntroduceMessage)
    return new Promise(res => {
        holConfirmMessage.setContent(co)
        holConfirmMessage.listen("close" , () => nodePool.put(node))
    })
}