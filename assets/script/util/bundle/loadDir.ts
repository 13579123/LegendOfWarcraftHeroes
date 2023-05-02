import { AssetManager, resources } from "cc";
import { error } from "../out/error";

// 缓存
const cachMap = new Map<AssetManager.Bundle , Map<string , any>>()

// 加载资源
export async function loadDir<T>(path: string , type?: new (...a: any[]) => T , assetsBundle?: AssetManager.Bundle): Promise<T[]> {
    assetsBundle = assetsBundle || resources
    let bundleCacheMap = cachMap.get(assetsBundle)
    if (!bundleCacheMap) cachMap.set(assetsBundle , bundleCacheMap = new Map)
    let result = bundleCacheMap.get(path)
    if (result) return result
    return new Promise<T[]>(res => {
        assetsBundle.loadDir(path , type as any , (err , data) => {
            if (err) {
                error(err)
                return res(null)
            }
            bundleCacheMap.set(path , data)
            return res(data as any)
        })
    })
}