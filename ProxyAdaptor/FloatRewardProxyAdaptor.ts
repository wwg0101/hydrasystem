
declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class FloatRewardProxyAdaptor {

    constructor() {
    }

    ctor() {

    }

    clearData(isInit: boolean = false) {

    }

    private RegistRedDot() {
        // RedDotUpdateSys.Instance().Register(RedDotEvent.Bag_Other_Can_HeCheng, this.checkCanOtherHeCheng.bind(this));
        // RedDotUpdateSys.Instance().Register(RedDotEvent.ShanHaiPetCanExchange, this.checkShanHaiPetExchange.bind(this));
    }

    private DeregistRedDot() {
        // RedDotUpdateSys.Instance().Deregister(RedDotEvent.Bag_Other_Can_HeCheng);
        // RedDotUpdateSys.Instance().Deregister(RedDotEvent.ShanHaiPetCanExchange);
    }

    public getFloatReward() {
        return init.floatRewardProxy.getFloatReward();
    }

    public clearFloatReward(){
        init.floatRewardProxy.clearFloatReward();
    }

    public floatReward(isNoAlert?, isNoShow?, param?, playsound?, rwds?: any[]) {
        init.floatRewardProxy.floatReward(isNoAlert, isNoShow, param, playsound, rwds);
    }


}
