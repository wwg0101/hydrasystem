const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectComponent extends cc.Component {
    @property(cc.Animation)
    animationComp: cc.Animation = null;

    @property(cc.ParticleSystem)
    particleSystemLists: cc.ParticleSystem[] = [];

    _finishCB = null;

    public playEffectAtInit(finishCB?) {
        this.setNodeActived(true);
        if (null != this.animationComp) {
            this.clearFinishCB();
            this._finishCB = finishCB;

            //传一个null播默认的动画
            this.animationComp.play(null, 0);
            if (null != finishCB) {
                this.animationComp.on('finished', () => {
                    if (null != finishCB) {
                        finishCB();
                        this._finishCB = null;
                    }
                }, this);
            }
        }
        this.resetParticalSys();
    }

    public resetParticalSys(){
        let particleCount = this.particleSystemLists.length;
        for (let index = 0; index < particleCount; ++index) {
            let particalSys = this.particleSystemLists[index];
            if (null != particalSys) {
                particalSys.stopSystem();
                particalSys.resetSystem();
            }
        }
    }

    /**
     * 开关特效节点 如果是关，会把回调清掉
     * @param actived 
     */
    public setNodeActived(actived: boolean) {
        this.node.active = actived;
        if(!actived){
            this.clearFinishCB();
        }
    }

    public clearFinishCB() {
        if (null != this.animationComp) {
            this.animationComp.off('finished');
        }
        this._finishCB = null;
    }
}
