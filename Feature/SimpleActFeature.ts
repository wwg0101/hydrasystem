import { IFeatureCB } from "../Feature";
import { ActViewCfg } from "../LimitActivity/LimitActivityHeadFile";
import { ErrFuncProto, Proto } from "../HydraCommon";
import { ConfigFinder } from "../HydraConfigFinder";
// import EventManager from "../../../../fromework/EventManager";
// import { ActivityType, RedDotEvent } from "../../../AppConstants";
import { Cfg_activeHDGift } from "../CfgConstants";
// import RedDot from "../../../component/RedDot";
// import EventConstants from "../../../EventConstants";
// import ProxyManager from "../../../ProxyManager";
// import AppUtils from "../../../utils/AppUtils";
import HDebug from "../HDebug";
// import { HDActGetRewardFeature, HdActTaskFeature } from "../../ActivityModule/ActivityFeature";
import { ActFeature, HuoDong } from "../ActivityModule/ActivityHeadFile";
import { MainFeature } from "./MainFeature";
import { ISimpleAct_Join, SimpleActInfo } from "./SimpleActHeadFile";
import { GuardUtil } from "../GuardUtil";

declare let proto_cs, localdb;

export class SimpleActInfoFeature extends MainFeature<IFeatureCB> {
    private _data: SimpleActInfo = null;

    private m_bIsInit = false;              //是否获得过活动基础数据
    public onGetNetBaseData(data: HuoDong) {
        super.onGetNetBaseData(data);
        this.checkRedDot();
        if (!this.m_bIsInit) {
            new Proto(proto_cs.huodong.hdInfo)
                .DParam({ pindex: this.m_activity.GetActID() })
                .Send();
            this.m_bIsInit = true;
        }
    }
    
    public onGetDetailData(data: SimpleActInfo) {
        this._data = data;
        //todo
        //this.m_activity.GetFeature(HdActTaskFeature).onGetData(data.taskGet);
        //this.m_activity.GetFeature(HDActGetRewardFeature).onGetData(data.rwdGot, data.num, data.rwdInfo);
        this.checkRedDot();
    }

    public GetInfo(): SimpleActInfo {
        return this._data;
    }

    GetViewData(): ActViewCfg {
        let item = ConfigFinder.Find<ActViewCfg>(localdb.table_actView, this.m_activity.GetActID());
        HDebug.Assert(item != null, "actView，无法找到对应配置 pindex[" + this.m_activity.GetActID() + "]");
        return item;
    }

    Init() {
        super.Init();
        //todo
        //EventManager.getInstance().on(
        //    EventConstants.BAGPROXY_UPDATE_BAG_ITEM,
        //    this.checkRedDot.bind(this)
        //    , this
        //);
    }

    OnDestroy() {
        super.OnDestroy();
        //todo
       // EventManager.getInstance().offTarget(this);
    }
    

    private getCostId(): number {
        let HDGiftItem = ConfigFinder.Find<Cfg_activeHDGift>(localdb.table_activeHDGift, this.m_activity.GetActID());
        HDebug.Assert(null != HDGiftItem, "[StarView_Join]Cfg_activeHDGift is null, plz check" + this.m_activity.GetActID());
        return HDGiftItem.wishItemId;
    }

    public checkRedDot() {
        //todo
        // RedDot.change(RedDotEvent.Simple_play + this.m_activity.GetActID(),
        //     ProxyManager.getInstance().bagProxy.getItemCount(this.getCostId()) > 0
        // );

     }
}

export class SimpleActJoinFeature extends ActFeature<ISimpleAct_Join> {
    reqJoin() {
        new ErrFuncProto(proto_cs.huodong.activeHDAction).DParam({
            pindex: this.m_activity.GetActID()
        }).Callback(
            (msg, errorInfo) => {
                if (null == errorInfo) {
                    let msgItem = GuardUtil.SafeReturn(msg, "a.msgwin.items");
                    this.onRespJoin(msgItem);
                }
            }
        ).Send();
    }
    private onRespJoin(items: any[]) {
        this.InvokeAll("onRespJoin", items);
    }
}