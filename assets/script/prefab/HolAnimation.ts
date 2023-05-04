import { _decorator, AssetManager, Component, dragonBones, Node, resources, sp } from 'cc';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

// 设置动画配置
export type HolAnimationOption = {
    // 动画文件夹
    animationDir: string
    // 对应的bundle默认resources
    animationBundle?: AssetManager.Bundle
    // 缩放值
    animationScale?: number
    // 动画类型
    animationType: "DrangonBones" | "Spine" 
    // 动画位置
    animationPosition: {x: number , y: number}
}

@ccclass('HolAnimation')
export class HolAnimation extends Component {

    // 动画速度
    public get timeScale() { return this.$animationControl.timeScale }
    public set timeScale(v: number) { this.$animationControl.timeScale = v }

    // 动画控制器
    private $animationControl: sp.Skeleton | dragonBones.ArmatureDisplay

    // 上一个动画
    private $lastAnimationPromiseResFunc: Function = null

    /** 
     * 设置动画
     * 会自动根据参数适应龙骨或Spine动画
     */
    async initBones(animationOption: HolAnimationOption) {
        const animationDir = await util.bundle.loadDir(
            animationOption.animationDir , 
            undefined , 
            animationOption.animationBundle || resources
        )
        // 设置缩放
        this.node.setScale(
            animationOption.animationScale || 1 , 
            animationOption.animationScale || 1 ,
            this.node.position.z
        )
        // 设置位置
        this.node.setPosition(
            this.node.position.x + animationOption.animationPosition.x ,
            this.node.position.y + animationOption.animationPosition.y ,
            this.node.position.z
        )
        // 动画分类
        if (animationOption.animationType === "DrangonBones") 
            this.$animationControl = this.node.addComponent(dragonBones.ArmatureDisplay)
        else if (animationOption.animationType === "Spine") 
            this.$animationControl = this.node.addComponent(sp.Skeleton)
        // 加上控制器
        for (const file of animationDir) {
            if (this.$animationControl instanceof dragonBones.ArmatureDisplay) {
                if (file instanceof dragonBones.DragonBonesAsset)
                    this.$animationControl.dragonAsset = file
                else if (file instanceof dragonBones.DragonBonesAtlasAsset)
                    this.$animationControl.dragonAtlasAsset = file
            } else if (this.$animationControl instanceof sp.Skeleton) {
                if (file instanceof sp.SkeletonData)
                    this.$animationControl.skeletonData = file
            }
        }
        if (this.$animationControl instanceof dragonBones.ArmatureDisplay)
            this.$animationControl.armatureName = 
                JSON.parse(this.$animationControl.dragonAsset?.dragonBonesJson!).armature[0].name;
        return
    }

    /** 
     * name 表示动画名称
     * times 动画播放次数
     * 该函数会等待动画播放完成
     */
    async playAnimation(name: string , times: number = -1 , defaultState?: string) {
        // 如果上一次的动画还没有完成
        if (this.$lastAnimationPromiseResFunc) {
            this.$lastAnimationPromiseResFunc()
            this.$lastAnimationPromiseResFunc = null
        }
        return new Promise<void>(res => {
            if (this.$animationControl instanceof sp.Skeleton) {
                let playTimes = 0
                this.$animationControl.setAnimation(0 , name , false)
                this.$animationControl.setCompleteListener(() => {
                    if (++playTimes >= times && times !== -1) {
                        this.$lastAnimationPromiseResFunc = null
                        res()
                        if(defaultState) this.playAnimation(defaultState)
                        return 
                    }
                    if (this.$animationControl instanceof sp.Skeleton)
                        this.$animationControl.setAnimation(0 , name , false)
                })
            } else if (this.$animationControl instanceof dragonBones.ArmatureDisplay) {
                this.$animationControl.playAnimation(name , times)
                this.$animationControl.on(dragonBones.EventObject.COMPLETE , () => {
                    this.$lastAnimationPromiseResFunc = null
                    res()
                    if(defaultState) this.playAnimation(defaultState)
                } , this)
            }
            this.$lastAnimationPromiseResFunc = res
        })
    }

}

