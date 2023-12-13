
declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class UnionProxyAdaptor {

    ctor() {
    }

    constructor() {
    }

    clearData(isInit: boolean = false) {
    }

    public getIsHaveClub(): boolean {
        return init.unionProxy.getIsHaveClub();
    }
    
    public getIsMyClub(clubid: number): boolean {
        return init.unionProxy.getIsMyClub(clubid);
    }
    
}