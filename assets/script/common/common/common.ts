import {CharacterStateCreate} from "./../../game/fight/character/CharacterState"

class Common {
    // 左侧队伍
    leftCharacter: Map<{row: number , col: number} , CharacterStateCreate> = new Map()
    // 右侧队伍
    rightCharacter: Map<{row: number , col: number} , CharacterStateCreate> = new Map()
}

// 公共内存
export const common = new Common

common.leftCharacter.set({row: 2 , col: 3} , {
    id: "fearOfDemons" ,
    lv: 100 ,
    star: 5 ,
    equipment: []
})
common.rightCharacter.set({row: 2 , col: 2} , {
    id: "sunwukong" ,
    lv: 100 ,
    star: 5 ,
    equipment: []
})