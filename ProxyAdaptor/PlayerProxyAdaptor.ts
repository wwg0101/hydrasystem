declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class PlayerProxyAdaptor {

    ctor() {
    }

    constructor() {
    }

    clearData(isInit: boolean = false) {
    }

    public getVipLevel(): number {
        let userData = init.playerProxy.userData;
        return null != userData ? userData.vip : 0;
    }

    public getUID(): number {
        return init.playerProxy.getUID();
    }

    public getName(): string {
        return init.playerProxy.getName();
    }
}