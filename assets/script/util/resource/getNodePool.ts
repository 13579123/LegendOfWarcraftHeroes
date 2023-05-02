import { Node, NodePool, Prefab, instantiate } from "cc";

class PrefabNodePool {
    // 节点预制体
    private $prefab: Prefab

    // 节点池
    private $nodePool: NodePool

    // 获取节点数量
    public get size() { return this.$nodePool.size }

    // 节点池构造器
    constructor(p: Prefab) {
        this.$prefab = p
        this.$nodePool = new NodePool
        for (let i = 0; i < 5; i++) this,this.$nodePool.put(instantiate(p))
    }

    // 获取节点
    public get(): Node {
        if (this.$nodePool.size() <= 0) return instantiate(this.$prefab)
        return this.$nodePool.get()
    }

    // 返回节点
    public put(node: Node) {
        return this.$nodePool.put(node)
    }
}

// 缓存
const cach = new Map<Prefab , PrefabNodePool>()

// 获取一个节点池
export function getNodePool(prefab: Prefab): PrefabNodePool {
    let nodePool = cach.get(prefab)
    if (nodePool) return nodePool
    nodePool = new PrefabNodePool(prefab)
    cach.set(prefab , nodePool)
    return nodePool
}