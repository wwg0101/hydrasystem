import { GameLinkMatchData } from "../../../scripts/app/models/linkMatch/GameLinkMatchProxy";
import { HuoDong, HuoDongMainData, LimitActivityPindex } from "../ActivityModule/ActivityHeadFile";
import { ActivityType } from "../AppConstants";
import HDebug from "../HDebug";
import { HydraProxy } from "../HydraProxyMgr";

declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class LimitActivityProxyAdaptor {

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

    public getHuodongByPindex(pindex: LimitActivityPindex):HuoDong{
        return init.activityProxy.getHuodongByPindex(pindex);
    }

    public getHuoDongMainDataByPindex(pindex: LimitActivityPindex): HuoDongMainData {
        switch(pindex) {
            case init.activityProxy.ID_LINK_MATCH: 
                return HydraProxy.GetData(GameLinkMatchData).getMainData();
            default: HDebug.Error("未注册的活动类型：" + pindex);
        }
    }

    public sendReqActivityInfo(callback, id, type?: ActivityType): void {
        init.activityProxy.sendReqActivityInfo(callback, id, type);
    }

    public setActHDTime(actID: number, sTime: number, showTime: number, eTime: number){
        init.activityProxy.setActHDTime(actID, sTime, showTime, eTime);
    }
}