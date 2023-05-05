import { _decorator, Component, math, Node, NodeEventType, Prefab, Sprite, SpriteFrame } from 'cc';
import { util } from '../../../util/util';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolNumber } from '../../../prefab/HolNumber';
import { RoundState } from '../../../game/fight/RoundState';
import { common } from '../../../common/common/common';
import { HolPreLoad } from '../../../prefab/HolPreLoad';
const { ccclass, property } = _decorator;

@ccclass('FightMap')
export class FightMap extends Component {

    // 当前回合数
    currentRound: number = 1

    // 是否播放动画
    isPlayAnimation: boolean = true

    // 所有回合任务
    allRoundQueue: Map<number , Function[]> = new Map

    // 所有存活的角色
    allLiveCharacter: HolCharacter[] = []

    // 所有死亡的角色
    allDeadCharacter: HolCharacter[] = []

    // 行动等待队列，若队列有未完成任务则等待完成后进入下一个角色行动
    actionAwaitQueue: Promise<any>[] = []

    protected async start() {
        // HolPreLoad 预加载进度条
        const holPreLoad = this.node.parent.getChildByName("HolPreLoad").getComponent(HolPreLoad)
        holPreLoad.setTips([
            "提示\n不同阵营之间相互克制，巧用阵营可以出奇制胜" ,
        ])
        holPreLoad.setProcess(20)
        // 随机地图
        const images = await util.bundle.loadDir("image/fightMap" , SpriteFrame)
        this.node.getComponent(Sprite).spriteFrame = images[Math.floor(math.randomRange(0,images.length))]
        holPreLoad.setProcess(50)
        // 当前进度
        let process = 50
        // 设置角色
        for (const character of common.leftCharacter) {
            await this.setCharacter(character[1] , "left" , character[0])
            holPreLoad.setProcess(process = process + 20 / common.leftCharacter.size)
        }
        for (const character of common.rightCharacter) {
            await this.setCharacter(character[1] , "right" , character[0])
            holPreLoad.setProcess(process = process + 20 / common.rightCharacter.size)
        }
        // 监听进度条完成函数
        holPreLoad.listenComplete(async () => {
            await new Promise(res => setTimeout(res, 500))
            // 战斗开始
            const result = await this.fightStart()
            // 战斗胜利结算
            if (result) this.fightSuccess()
            // 战斗失败结算
            else this.fightEnd()
        })
        // 设置 100%
        holPreLoad.setProcess(100)
    }

    // 监听回合函数
    public listenRoundEvent(round: number , call: Function) {
        let roundEvents = this.allRoundQueue.get(this.currentRound + round + 1)
        if (!roundEvents) 
            return this.allRoundQueue.set(this.currentRound + round + 1 , roundEvents = [call])
        roundEvents.push(call)
    }

    // 战斗开始
    private async fightStart(): Promise<boolean> {
        // 调用战斗开始回调
        for (const character of this.allLiveCharacter) {
            for (const buff of character.state.buff) 
                await buff.OnFightBegan(buff , this)
            for (const equipment of character.state.equipment) 
                await equipment.OnFightBegan(equipment , this)
            await character.state.OnFightBegan(character.state , this)
        }
        // 回合开始
        while(this.currentRound <= 150) {
            const roundState = new RoundState
            const allLiveCharacter = [].concat(this.allLiveCharacter).sort((a , b) => 
                b.state.speed - a.state.speed
            )
            // 调用回合任务
            for (const task of this.allRoundQueue.get(this.currentRound) || []) await task()
            // 调用回合开始回调
            for (const character of allLiveCharacter) {
                if (this.allLiveCharacter.indexOf(character) === -1) break
                for (const buff of character.state.buff) 
                    await buff.OnRoundBegan(buff , roundState , this)
                for (const equipment of character.state.equipment) 
                    await equipment.OnRoundBegan(equipment , roundState , this)
                await character.state.OnRoundBegan(character.state , roundState , this)
            }
            // 角色行动
            for (const character of allLiveCharacter) {
                if (this.allLiveCharacter.indexOf(character) === -1) continue
                await character.action()
                // 等待行动队列清空
                await Promise.all(this.actionAwaitQueue)
                this.actionAwaitQueue = []
                // 判断是否结束
                if (this.allLiveCharacter.filter(c => c.direction === "left").length <= 0) return false
                else if (this.allLiveCharacter.filter(c => c.direction === "right").length <= 0) return true
            }
            // 调用回合结束回调
            for (const character of allLiveCharacter) {
                if (this.allLiveCharacter.indexOf(character) === -1) break
                for (const buff of character.state.buff) 
                    await buff.OnRoundEnd(buff , roundState , this)
                for (const equipment of character.state.equipment) 
                    await equipment.OnRoundEnd(equipment , roundState , this)
                await character.state.OnRoundEnd(character.state , roundState , this)
            }
            this.currentRound++
            // 等待
            if (this.isPlayAnimation) await new Promise(res => setTimeout(res, 300))
            // 判断是否结束
            if (this.allLiveCharacter.filter(c => c.direction === "left").length <= 0) return false
            else if (this.allLiveCharacter.filter(c => c.direction === "right").length <= 0) return true
        }
        return false
    }

    // 设置角色
    private async setCharacter(create: CharacterStateCreate , direct: "left"|"right" , coordinate: {row: number , col: number}) {
        const nodePool = util.resource.getNodePool(await util.bundle.load("prefab/HolCharacter"))
        const character = nodePool.get()
        this.node.addChild(character)
        const holCharacter = character.getComponent(HolCharacter)
        await holCharacter.initCharacter(
            create , direct , coordinate , this
        )
        this.node.on(NodeEventType.NODE_DESTROYED , () => {
            nodePool.put(character)
        })
        this.allLiveCharacter.push(holCharacter)
    }

    // 战斗胜利
    private fightSuccess() {
        this.node.parent.getChildByName("FightFailure").active = false
        this.node.parent.getChildByName("FightSuccess").active = true
    }

    // 战斗失败
    private fightEnd() {
        this.node.parent.getChildByName("FightFailure").active = true
        this.node.parent.getChildByName("FightSuccess").active = false
    }
}

