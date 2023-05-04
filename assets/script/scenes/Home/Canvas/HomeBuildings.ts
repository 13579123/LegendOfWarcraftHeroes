import { _decorator, AudioClip, AudioSource, Component, EventTouch, math, Node, screen } from 'cc';
import { util } from '../../../util/util';
import { getConfig } from '../../../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('HomeBuildings')
export class HomeBuildings extends Component {
    protected async start() {
        const config = getConfig()
        // 触摸事件开始
        this.node.on(Node.EventType.TOUCH_MOVE , this.onNodeTouchMove , this)
        this.node.on(Node.EventType.TOUCH_END , this.onNodeTouchEnd , this)
        // 初始化宽度
        this.$FrameSize = screen.windowSize
    }

    protected onDestroy(): void {
        // 触摸事件销毁
        this.node.off(Node.EventType.TOUCH_MOVE , this.onNodeTouchMove , this)
        this.node.off(Node.EventType.TOUCH_END , this.onNodeTouchEnd , this)
    }

    private $FrameSize: math.Size

    // 触摸移动场景
    private $lastPositionX = -1
    private onNodeTouchMove(event: EventTouch) {
        const currentPositionX = event.touch.getLocationX()
        if (this.$lastPositionX !== -1) {
            const positionX = this.node.position.x + (currentPositionX - this.$lastPositionX) * 0.9
            if (Math.abs(positionX) <= (1826 - this.$FrameSize.width) / 2)
                this.node.setPosition(
                    positionX ,
                    this.node.position.y ,
                    this.node.position.z
                )
        }
        this.$lastPositionX = currentPositionX
        return
    }
    private onNodeTouchEnd() {
        this.$lastPositionX = -1
    }

    // 打开关卡选择场景
    public async OpenLevelMap() {
    }

    // 打开商店场景
    public async OpenShopMap() {
    }

    // 打开勇气试炼
    public async OpenCourageMap() {
    }

    // 打开抽卡界面
    public async OpenDrawCard() {
    }

    // 打开征服之塔
    public async OpenConquer() {
    }
}

