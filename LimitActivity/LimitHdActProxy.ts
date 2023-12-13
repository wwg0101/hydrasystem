import { Feature } from "../Feature";
// import { List } from "../../../framework/HydraCommon";
import { IProxyData, ProxyBase, Request } from "../HydraProxy";
import { HydraProxy } from "../HydraProxyMgr";
import NetManager from "../NetManager";
// import { UIControlManager } from "../../../framework/UIControlManager";
// import { RedDotEvent } from "../../AppConstants";
// import RedDot from "../../component/RedDot";
// import AppUtils from "../../utils/AppUtils";
import HDebug from "../HDebug";
// import { GuideManager } from "../../views/guide/GuideManager";
// import { GuideType } from "../../views/guide/IGuide";
import { NetworkDetailInfoFeature } from "../ActivityModule/ActivityFeature";
import { HuoDong, IUIActGetGift, IUIActGiftMission, LimitActivityPindex, IActivity } from "../ActivityModule/ActivityHeadFile";
import { ActivityMgr } from "../ActivityModule/ActivityModule";
// import { RichBaseInfoFeature } from "../Rich/RichActFeature";
import { ActGetGiftInfo, ActGiftMissionData, HdActList, IActProxyComp, MyGift, NetActGift } from "./LimitActivityHeadFile";




declare let proto_sc, proto_cs;

// export class HdActGiftMissionData extends Feature<IUIActGiftMission> implements IProxyData {
//     private nowTaskList: List<ActGiftMissionData> = new List<ActGiftMissionData>();
//     public getTaskMissionList(): List<ActGiftMissionData> {
//         return this.nowTaskList;
//     }
//     private onGetData(list: MyGift[]) {
//         this.nowTaskList.Clear();
//         for (let i = 0; i < list.length; i++) {
//             this.nowTaskList.Add(new ActGiftMissionData(list[i]));
//         }
//         this.checkRedDot();
//     }
//     private checkRedDot() {
//         let canGet = false;
//         for (let i = 0; i < this.nowTaskList.length; i++) {
//             canGet = this.nowTaskList[i].canGetReward();
//             if (canGet) break;
//         }
//         RedDot.change(RedDotEvent.GiftMissionRewardCanGet, canGet);
//     }

//     //赠礼人领取赠礼进度奖励
//     public reqGetGiftReward(pindex: number, giftId: number) {
//         HydraProxy.Send(LimitHdActProxy, ReqActiveHDGiftProgressRwd, pindex, giftId).SucCallBack((msg) => {
//             let rewardItems = AppUtils.getMsgwinItems(msg)
//             this.InvokeAll("onRespGetGiftReward", giftId, rewardItems);
//         });
//     }

//     Init() {}
//     OnUserLogin() {}
//     OnUserLogout() {}
//     Clear() {}
//     Update(netData : any) {
//         this.onGetData(netData);
//     }
// }

// export class ReqActiveHDGiftList extends Request {
//     constructor() {
//         super(proto_cs.huodong.getActiveHDGiftList);
//     }
// }

// export class ReqActiveHDGiftProgressRwd extends Request {
//     constructor() {
//         super(proto_cs.huodong.getActiveHDGiftProgressRwd);
//     }

//     CreateParam(...params) {
//         return {
//             pindex: params[0],
//             giftId: params[1],
//         };
//     }
// }

// //获得赠礼模块
// export class HdActGetGiftData extends Feature<IUIActGetGift> implements IActProxyComp, IProxyData {
//     private _giftList: List<ActGetGiftInfo> = new List<ActGetGiftInfo>();
//     private onGetGift(datas: NetActGift[]) {
//         for (let i = 0; i < datas.length; i++) {
//             let data = datas[i];
//             this._giftList.Add(new ActGetGiftInfo(data));
//         }
//     }
//     public checkCanJump(): boolean {
//         return !GuideManager.Instance().IsOnGuide(GuideType.StrongGuide)
//             && UIControlManager.Instance().GetStackEmptyManager().GetIsEmpty();
//     }
//     public checkCanJumpWithoutPan(): boolean {
//         return !GuideManager.Instance().IsOnGuide(GuideType.StrongGuide);
//     }

//     //----------UI用--------------
//     public haveGift(): boolean {
//         return this._giftList.length > 0
//     }

//     public allList(): List<ActGetGiftInfo> {
//         //有必要去除一些过时的赠礼
//         return this._giftList;
//     }

//     public clearList() {
//         this._giftList.Clear();
//     }

//     public popGiftInfo(): ActGetGiftInfo {
//         return this._giftList.pop();
//     }

//     public ReqGetGift(pindex: number, giftId: number) {
//         // 玩家领取赠礼奖励
//         HydraProxy.Send(LimitHdActProxy, ReqActiveHDGift, pindex, giftId).SucCallBack((msg) => {
//             this.InvokeAll("onRespGetGift", AppUtils.getMsgwinItems(msg));
//         });
//     }

//     Init() {}
//     public OnUserLogin() {}
//     public OnUserLogout() {}
//     Clear() {}
//     Update(netData : any) {
//         this.onGetGift(netData);
//     }
// }

// export class ReqActiveHDGift extends Request {
//     constructor() {
//         super(proto_cs.huodong.getActiveHDGift);
//     }

//     CreateParam(...params) {
//         return {
//             pindex: params[0],
//             giftId: params[1],
//         };
//     }
// }

//用於活動的處理，後面可改成活動模塊
export class LimitHdActProxy extends ProxyBase {
    Init() {
        //HydraProxy.Register(this, HdActGiftMissionData, proto_sc.ActiveHuoDong.myGiftList);

        NetManager.getInstance().subscribe(proto_sc.ActiveHuoDong.ActList, this.onGetActInfo.bind(this), this);
        //NetManager.getInstance().subscribe(proto_sc.actOS.data, this.onGetDiscountData.bind(this), this);
        //NetManager.getInstance().subscribe(proto_sc.CBHuoDong.CBHD_700, this.onGetRichActInfo.bind(this), this);
    }

    public OnGetInfoBase(datas: HuoDong[]) {
        let actMgr = ActivityMgr.Instance();
        for (let i = 0; i < datas.length; ++i) {
            let actData = datas[i];
            let pindex = Number(actData.pindex);
            actMgr.OnGetActivityData(pindex, actData);
            this.findCache(pindex);
        }
    }

    private onGetActInfo(datas: HdActList) {
        this.actualHandleOnGetActInfo(datas);
    }

    //private onGetDiscountData(singleActInfo: any) {
    //    const pindex = 111;
    //    let actMgr = ActivityMgr.Instance();
    //    let activity = actMgr.Get(pindex);
    //    if (null != activity) {
    //        this.processGetData(activity, singleActInfo);
    //    }
    //    else {
    //        HDebug.Error("[LimitHdActProxy]未創建對應活動數據，進行緩存，" + pindex);
    //        this._cacheMap.set(pindex, singleActInfo);
    //    }
    //}

    private actualHandleOnGetActInfo(datas: HdActList) {
        let actMgr = ActivityMgr.Instance();
        for (let key in datas) {
            let singleActInfo = datas[key];
            HDebug.Assert(key.includes("huodong_"), "[LimitHdActProxy]此字段有问题，请检查" + key);
            let pindex = Number(key.replace("huodong_", ""));
            HDebug.Assert(!isNaN(Number(pindex)), "[LimitHdActProxy]pindex is NaN, " + key);

            let activity = actMgr.Get(pindex);
            if (null != activity) {
                this.processGetData(activity, singleActInfo);
            }
            else {
                HDebug.Error("[LimitHdActProxy]未創建對應活動數據，進行緩存，" + pindex);
                this._cacheMap.set(pindex, singleActInfo);
            }
        }
    }

    private processGetData(activity: IActivity, singleActInfo) {
        if (activity.GetFeature(NetworkDetailInfoFeature)) {
            activity.GetFeature(NetworkDetailInfoFeature).onGetDetailData(singleActInfo);
        }
        else {
            HDebug.Error("[LimitHdActProxy]processGetData 未處理pindex，" + activity.GetActID());
        }
    }

    private _cacheMap: Map<LimitActivityPindex, any> = new Map<LimitActivityPindex, any>();
    private findCache(pindex: LimitActivityPindex) {
        let data = this._cacheMap.get(pindex);
        if (null != data) {
            HDebug.Error("[LimitHdActProxy]緩存數據設置" + pindex);
            this.processGetData(ActivityMgr.Instance().Get(pindex), data);
            this._cacheMap.delete(pindex);
        }
    }

    ////冲榜信息
    ////TODO
    //private onGetRichActInfo(datas) {
    //    let actMgr = ActivityMgr.Instance();
    //    actMgr.Get(LimitActivityPindex.RichActivity).GetFeature(RichBaseInfoFeature).OnRespGetInfo(datas);
    //}
}