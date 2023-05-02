import { load } from "./bundle/load";
import { loadDir } from "./bundle/loadDir";
import { error } from "./out/error";
import { log } from "./out/log";
import { confirm, preloadConfirm } from "./message/confirm"
import { preloadPrompt, prompt } from "./message/prompt"
import { getNodePool } from "./resource/getNodePool";
import { moveNodeToPosition } from "./sundry/moveNodeToPosition";

// 根据对象
export const util = {
    // 输出对象
    out: {
        log , // 默认输出
        error , // 错误输出
    } ,
    // bundle 资源
    bundle: {
        load , // 加载数据
        loadDir , // 加载文件夹
    } ,
    // 节点等资源
    resource: {
        getNodePool , // 获取一个节点池
    } ,
    // 消息提示 弹框等资源
    message: {
        prompt , // 提示框
        preloadPrompt ,
        confirm , // 确认框
        preloadConfirm ,
    } ,
    // 杂项功能
    sundry: {
        moveNodeToPosition , // 节点移动函数
    }
}