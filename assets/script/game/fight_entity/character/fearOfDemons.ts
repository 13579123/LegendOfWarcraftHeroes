import { GetCharacterCoordinatePosition } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { util } from "../../../util/util";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { RegisterCharacter } from "../../fight/character/CharacterEnum";
import { CharacterMetaState } from "../../fight/character/CharacterMetaState";
import { CharacterState } from "../../fight/character/CharacterState";


@RegisterCharacter({id: "fearOfDemons"})
export class Character extends CharacterMetaState {

    AnimationDir: string = "game/fight_entity/character/fearOfDemons"

    AnimationType: "DrangonBones" | "Spine" = "Spine"

    AnimationScale: number = 0.7

    Energy: number = 100

    GetOnAttack(): (self: BasicState<any>, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            let enemies = self.component.getEnimies(fightMap.allLiveCharacter)
            if (enemies.length <= 0) return
            enemies = enemies.sort((a , b) => a.coordinate.col - b.coordinate.col)
            actionState.targets.push(enemies[0].state)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            actionState.targets[0].component.direction ,
                            actionState.targets[0].component.coordinate.row , 
                            actionState.targets[0].component.coordinate.col ,
                            "attack"
                        ) ,
                        moveCurve: true ,
                        moveTimeScale: actionState.targets[0].component.holAnimation.timeScale
                    }
                )
                await self.component.holAnimation.playAnimation("attack" , 1 , self.component.defaultState)
            }
            // 结算
            for (const state of actionState.targets) 
                await self.component.attack(self.attack * 1.0 , state.component)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            self.component.direction ,
                            self.component.coordinate.row , 
                            self.component.coordinate.col ,
                            "ordinary"
                        ) ,
                        moveCurve: true ,
                        moveTimeScale: self.component.holAnimation.timeScale
                    }
                )
            }
        }
    }

    GetOnSkill(): (self: BasicState<any>, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            let enemies = self.component.getEnimies(fightMap.allLiveCharacter)
            if (enemies.length <= 0) return
            enemies = enemies.sort((a , b) => a.coordinate.col - b.coordinate.col)
            actionState.targets.push(enemies[0].state)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            actionState.targets[0].component.direction ,
                            actionState.targets[0].component.coordinate.row , 
                            actionState.targets[0].component.coordinate.col ,
                            "attack"
                        ) ,
                        moveCurve: false ,
                        moveTimeScale: actionState.targets[0].component.holAnimation.timeScale
                    }
                )
                await self.component.holAnimation.playAnimation("skill" , 1 , self.component.defaultState)
            }
            // 结算
            for (const state of actionState.targets) 
                await self.component.attack(self.attack * 1.0 , state.component)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.sundry.moveNodeToPosition(
                    self.component.node ,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            self.component.direction ,
                            self.component.coordinate.row , 
                            self.component.coordinate.col ,
                            "ordinary"
                        ) ,
                        moveCurve: true ,
                        moveTimeScale: self.component.holAnimation.timeScale
                    }
                )
            }
        }
    }
}