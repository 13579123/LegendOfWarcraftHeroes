import { _decorator, AudioClip, AudioSource, Component, instantiate, Node, Prefab } from 'cc';
import { util } from '../../util/util';
import { getConfig } from '../../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('FightCanvas')
export class FightCanvas extends Component {
    
    protected async start() {
        // 初始化音乐
        const config = getConfig()
        // 音乐们
        const musics = await util.bundle.loadDir<AudioClip>("sound/fight/back" , AudioClip)
        const music = musics[Math.floor(musics.length * Math.random())]
        const audioSource = this.node.getComponent(AudioSource)
        audioSource.clip = music
        audioSource.volume = config.volume * config.volumeDetail.home
        audioSource.play()
    }

}

