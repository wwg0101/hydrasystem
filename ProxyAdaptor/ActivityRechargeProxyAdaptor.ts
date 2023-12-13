
declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class ActivityRechargeProxyAdaptor {

    constructor() {
    }

    ctor() {

    }

    clearData(isInit: boolean = false) {

    }

    public sendFerrisWheelData(actId: number, cb?) {
        init.rechargeProxy.sendFerrisWheelData(actId, cb);
    }

    public sendFerrisWheelUnlock(id: number, actId: number) {
        init.rechargeProxy.sendFerrisWheelUnlock(id, actId);
    }

    public sendFerrisWheelGetRwd(actId: number) {
        init.rechargeProxy.sendFerrisWheelGetRwd(actId);
    }
}