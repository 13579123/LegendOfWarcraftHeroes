import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export type LoadMessageOption = {
    
}

@ccclass('HolLoadMessage')
export class HolLoadMessage extends Component {

    private $event: Map<string , ((...a: any) => any)[]> = new Map

    listen(e: "close" , call: (...a: any) => any) {
        let eventQueue = this.$event.get(e)
        if (!eventQueue) {
            eventQueue = [call]
            return this.$event.set(e , eventQueue)
        }
        eventQueue.push(call)
    }

    closeLoad() {
        if (this.$event)
            this.$event.get("close")?.forEach(c => c())
    }

}

