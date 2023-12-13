declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class PurchaseProxy {

    ctor() {
    }

    constructor() {
    }

    clearData(isInit: boolean = false) {
    }

    public sendRecharge(rechargeData: any, actID: number, cb: Function): boolean {
        return init.purchaseProxy.sendRecharge(rechargeData, actID, (success)=>{
            cb && cb();
        })
    }
    
}