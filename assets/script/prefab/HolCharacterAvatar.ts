import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { CharacterStateCreate } from '../game/fight/character/CharacterState';
import { util } from '../util/util';
import { CharacterEnum } from '../game/fight/character/CharacterEnum';
const { ccclass, property } = _decorator;

@ccclass('HolCharacterAvatar')
export class HolCharacterAvatar extends Component {

    @property(Node)
    AvatarNode: Node

    @property(Node)
    LegendBorderNode: Node

    @property(Node)
    BorderNode: Node
    
    @property(Node)
    CampNode: Node

    @property(Node)
    LvNode: Node
    
    async setCharacter(create: CharacterStateCreate) {
        const meta = CharacterEnum[create.id]
        this.AvatarNode.getComponent(Sprite).spriteFrame = 
            await util.bundle.load(meta.AvatarPath , SpriteFrame)
        if (meta.CharacterQuality < 5) this.LegendBorderNode.active = false
        this.BorderNode.getComponent(Sprite).spriteFrame = 
            await util.bundle.load(`image/quality_border/${meta.CharacterQuality}/spriteFrame` , SpriteFrame)
        this.CampNode.getComponent(Sprite).spriteFrame = 
            await util.bundle.load(`image/camp_icon/${meta.CharacterCamp}/spriteFrame` , SpriteFrame)
        this.LvNode.getComponent(Label).string = 'Lv: ' + create.lv
    }

}

