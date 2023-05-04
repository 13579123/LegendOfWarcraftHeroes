import { Prefab, find , Node} from "cc";
import { load as bundleLoad } from "../bundle/load";
import { getNodePool } from "../resource/getNodePool";
import { HolLoadMessage, LoadMessageOption } from "../../prefab/HolLoadMessage";

export async function preloadLoad() {
    const nodePool = getNodePool(await bundleLoad("prefab/HolLoadMessage" , Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

// 加载中
export async function load(co?: LoadMessageOption , parent: Node = find("Canvas")): Promise<Function> {
    const nodePool = getNodePool(await bundleLoad("prefab/HolLoadMessage" , Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    const holLoadMessage = node.getComponent(HolLoadMessage)
    holLoadMessage.listen("close" , () => nodePool.put(node))
    return () => holLoadMessage.closeLoad()
}