declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class RankProxyAdaptor {

    ctor() {
    }

    constructor() {
    }

    clearData(isInit: boolean = false) {
    }

    public getRankTypeVal(rankType, val): any {
        return init.rankProxy.getWifeData(rankType, val);
    }

    public getRankTypeName(rankType): any {
        return init.rankProxy.getRankTypeName(rankType);
    }

    public getShowRankType() {
        return init.rankProxy.showRankType;
    }
}