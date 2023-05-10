import { _decorator, Component, Label, Node } from 'cc';
import { util } from '../util/util';
import { getConfig } from '../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('HolUserResource')
export class HolUserResource extends Component {

    protected start(): void {
        this.render()
    }

    public render() {
        const config = getConfig()
        this.node.getChildByName("Gold").getChildByName("Value").getComponent(Label).string = 
        util.sundry.formateNumber(config.userData.gold)
        this.node.getChildByName("Diamond").getChildByName("Value").getComponent(Label).string = 
        util.sundry.formateNumber(config.userData.diamond)
        this.node.getChildByName("Soul").getChildByName("Value").getComponent(Label).string = 
        util.sundry.formateNumber(config.userData.soul)
    }

}

