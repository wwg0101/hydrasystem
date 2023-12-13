import ProxyManager from "../ProxyManager";
import { IFeatureCB } from "../Feature";
import { GuardUtil } from "../GuardUtil";
// import { ErrFuncProto, Proto } from "../../../framework/HydraCommon";
// import { ConfigFinder } from "../../../framework/HydraConfigFinder";
// import NetManager from "../../../framework/NetManager";
import { PanelType } from "../PanelConfig";
// import { OpenRuleManager } from "../../../framework/UIFramework/PanelOpenRule";
// import EventManager from "../../../fromework/EventManager";
// import MaskManager, { NetworkOp } from "../../../fromework/MaskManager";
// import { ActivityType, BaseItemSlot, NewShopItem, RedDotEvent, ServerTaskType } from "../../AppConstants";
// import { Cfg_activeHDGift, Cfg_activeHDRwd, Cfg_activeHDTask, Cfg_hdConf, Cfg_ModuleBoxRwd, Cfg_ModuleFight } from "../../CfgConstants";
// import RedDot from "../../component/RedDot";
// import EventConstants from "../../EventConstants";
// import AppUtils from "../../utils/AppUtils";
// import HDebug from "../../utils/HDebug";
// import UIHelps from "../../utils/UIHelps";
// import { ActInfo, ActItemCfg, ActTotalScoreCfg, ActViewCfg, CBHDInfo, LimitActAwardState, SendUIActData } from "../LimitActivityProxy_new";
// import { ActAchieveNetItem, TaskGet } from "../LimitHDActivity/LimitHDActivityHeadFile";
import { SendUIActData } from "../LimitActivity/LimitActivityHeadFile";
import { ActFeature, HuoDong } from "./ActivityHeadFile";
// import { ActBoxOpenType, ActBoxType, ActFeature, ActivityShowType, ActivityState, ActOneManFightCfg, ActOneManFightData, ActOneManFightRankData, ActOneManFightServantData, ActOneManFightServantData_Net, ActOneManFightType, CommonSelectType, HuoDong, IUIActDailyTask, IUIActGetReward, IUIActSendGift } from "./ActivityHeadFile";
// import { ActivityMgr } from "./ActivityModule";
// import { IActivityNotice, INoticeCheckerHelper, NoticeChecker, NoticePriority } from "./ActivityNotice";
// import { ActivityGoToHelper, RedDotChecker } from "./ActivityNoticeBridge";
// import { ActivityUtils } from "./ActivityUtils";
// import { MainFeature } from "./MainFeature";
// import { ActTimeFeature } from "./TimeFeature";
import { MTBConfigHelper } from "../MTBConfig";
import { ErrFuncProto, Proto } from "../HydraCommon";
import { Cfg_ActivityLeiJiRwd } from "../CfgConstants";
import { List } from "../HydraComponents/HydraList";
import HDebug from "../HDebug";
// import { PanelOpenHelper } from "../../../framework/UIFramework/PanelOpenHelper";
import { BaseItemSlot } from "../AppConstants";
import MaskManager, { NetworkOp } from "../MaskManager";
const Utils = require("../../app/utils/Utils")

declare let proto_sc, proto_cs: any, localcache, localdb, i18n, require;
// //---------------------------示例分割线，上面是框架----------------------------

// export enum ActivityUseType {
//     UseSingle = 1,//使用单次
//     UseMultiple = 2,//使用多次
// }

// //负责网络通讯
// export class MaskProto<T> extends ErrFuncProto<T> {
//     _networkOp: NetworkOp = null;
//     constructor(type: (new () => T), networkOp: NetworkOp, ...params) {
//         super(type);
//         this._networkOp = networkOp;
//     }
//     Send() {
//         let op = this._networkOp;
//         MaskManager.getInstance().ShowMask(op);
//         NetManager.getInstance().postProto(this.m_request, (msg) => {
//             MaskManager.getInstance().HideMask(op);
//             let errorInfo = AppUtils.GetErrorMsg(msg);
//             if (this.m_callBack != null) this.m_callBack(msg, errorInfo);
//         });
//     }
// }

// export class BusinessMaskProto<T> extends MaskProto<T> {
//     constructor(type: (new () => T), ...params) {
//         super(type, NetworkOp.Business_Street);
//     }
// }

// export class ActivityProto<T> extends ErrFuncProto<T>  {
//     _actId: number = 0;
//     BindActivity(num: number) {
//         this._actId = num;
//         return this;
//     }

//     Send() {
//         let nowThis = this;
//         NetManager.getInstance().postProto(this.m_request,
//             function (msg) {
//                 let errorInfo = AppUtils.GetErrorMsg(msg);
//                 //多加一个回调
//                 if (nowThis._actId != 0 && null == errorInfo) {
//                     let ft = ActivityMgr.Instance().Get(nowThis._actId).GetFeature(ActInfoFeature);
//                     if (ft != null) ft.OnGetData(msg);
//                 }
//                 if (nowThis.m_callBack != null) nowThis.m_callBack(msg, errorInfo);
//             });
//     }
// }

export interface IActInfo extends IFeatureCB {
    IActInfo_OnGetInfo(actInfo: SendUIActData);
    IActInfo_OnGetBaseInfo(actInfo: HuoDong);
}
// export class ActInfoFeature extends MainFeature<IActInfo> {
//     _info: ActInfo = null;
//     activityType: ActivityType = ActivityType.FullActivities;

//     onGetNetBaseData(data: HuoDong) {
//         super.onGetNetBaseData(data);
//         this.InvokeAll("IActInfo_OnGetBaseInfo", data);
//     }

//     public enterActivity() {
//         let pindex = this.m_activity.GetActID(); 
//         let limitActivityProxy = ProxyManager.getInstance().limitActivityProxy;
//         if (limitActivityProxy.checkCanOpenFullActivity(pindex, true)) {
//             let proto: any = {};
//             proto.pindex = pindex;
//             new ActivityProto(proto_cs.huodong.hdInfo)
//                 .DParam(proto)
//                 .Callback((msg, errInfo) => {
//                     let info = this.GetData(msg)
//                     this.OnRespGetInfo(info);
//                     if (errInfo == null) {
//                         PanelOpenHelper.JumpToPanel(PanelType.LimitActivityView_Main, {
//                             pindex: pindex
//                         });
//                     }
//                 })
//                 .Send();
//         } else {
//             AlertUtils.Instance().alert(i18n.t("LIMITACTIVITY_ACTIVITY_END"));
//         }
//     }

//     ReqGetInfo(func) {
//         let pindex = this.m_activity.GetActID();

//         let proto: any = {};
//         proto.pindex = pindex;
//         new ActivityProto(proto_cs.huodong.hdInfo)
//             .DParam(proto)
//             .Callback((msg, errInfo) => {
//                 let info = this.GetData(msg)
//                 this.OnRespGetInfo(info);
//                 let sendData: SendUIActData = new SendUIActData(pindex, info);
//                 if (func != null) func(sendData, errInfo);
//             })
//             .Send();
//     }

//     GetInfo(): ActInfo {
//         return this._info;
//     }

//     GetBagInfo(): { id: number, num: number }[] {
//         let dataList: { id: number, num: number }[] = [];
//         for (let i = 0; i < this._info.bag.length; ++i) {
//             if (this._info.bag[i].num != 0) {
//                 dataList.push(this._info.bag[i]);
//             }
//         }
//         return dataList;
//     }

//     /**
//      * 获取活动相关道具数量
//      * @param id 
//      * @returns 
//      */
//     GetActItemNum(id: number): number {
//         if(this._info.bag && this._info.bag.length) {
//             for(let i = 0 ; i < this._info.bag.length; ++i) {
//                 let info = this._info.bag[i];
//                 let actItem: ActItemCfg= localcache.getItem(localdb.table_actItem, info.id);
//                 if(actItem.itemId == id) {
//                     return info.num;
//                 }
//             }
//         }
//         return 0;
//     }

//     OnRespGetInfo(info: ActInfo) {
//         if (this._info != null) {
//             for (let key in info) {
//                 this._info[key] = info[key];
//             }
//         } else {
//             this._info = info;
//         }

//         this.m_activity.GetFeature(ActRankFeature).OnGetRank(this._info);
//         this.m_activity.GetFeature(ActTimeFeature).SetTime();
//         this.m_activity.GetFeature(ActRedFeature).RefreshRedDot();
//         //处理回包数据，获取活动数据
//         let sendData: SendUIActData = new SendUIActData(this.m_activity.GetActID(), this._info);
//         this.InvokeAll("IActInfo_OnGetInfo", sendData);

//         EventManager.getInstance().emit(EventConstants.REFRESH_LIMIT_ACTVITY, {
//             info: this._info,
//             pindex: this.m_activity.GetActID()
//         });
//     }

//     OnGetData(msg) {
//         this.OnRespGetInfo(this.GetData(msg));
//     }

//     private GetData(msg) {
//         let actConfig = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, this.m_activity.GetActID());
//         let type = Number(actConfig.type);
//         let key = ActivityUtils.getKeyByTypePindex(type, this.m_activity.GetActID());
//         return msg["a"][key.key1][key.key2];
//         //return msg["a"]["FullHuoDong"][key];
//     }

//     GetViewData(): ActViewCfg {
//         let item = localcache.getItem(localdb.table_actView, this.m_activity.GetActID());
//         HDebug.Assert(item != null, "actView，无法找到对应配置");
//         return item;
//     }
// }

// export interface IActTotalReward extends IFeatureCB {
//     OnGetReward(info);
// }

// export class ActTotalRewardFeature extends ActFeature<IActTotalReward>  {
//     CanShowTotalReward(): boolean {
//         let list = localcache.getGroup(localdb.table_actTotalScore, "pindex", this.m_activity.GetActID());
//         return null != list && list.length > 0;
//     }
//     GetRankInfo(): any {
//         let info = this.m_activity.GetFeature(ActInfoFeature).GetInfo();
//         if (info != null) {
//             return info.list;
//         } else {
//             return null;
//         }
//     }
//     SendGetReward(id) {
//         let pindex = this.m_activity.GetActID();
//         new ActivityProto(proto_cs.huodong.getActBox)
//             .BindActivity(pindex)
//             .DParam({
//                 id: id,
//                 pindex: pindex,
//             })
//             .Callback(
//                 function (msg, errorInfo) {
//                     if (errorInfo == null)
//                         ProxyManager.getInstance().timeProxy.JustShowAllRewardWithoutClick(
//                             AppUtils.getMsgwinItems(msg)
//                         );
//                 }
//             )
//             .Send();
//     }
// }

// //道具功能 
// //【购买道具】
// //【使用道具】
// export interface IActItem extends IFeatureCB {
//     //购买道具
//     BuyItemSuccess(actItemID: number);
//     BuyItemFailed(actItemID: number);
//     //使用道具
//     UseItemSuccess(actItemID: number, reward: any);
//     UseItemFailed(actItemID: number);
// }
// export class ActItemFeature extends ActFeature<IActItem> {
//     //功能 UI调用
//     //购买道具
//     BuyItem(actItemID: number, num: number) {
//         //协议数据准备 buyActItem 【道具ID id， 活动ID pindex】
//         let pindex = this.m_activity.GetActID();
//         let id = actItemID;

//         let cb = function (msg, errorInfo) {
//             this.OnBuyItem(errorInfo, actItemID);
//             ProxyManager.getInstance().timeProxy.JustShowAllRewardWithoutClick(AppUtils.getMsgwinItems(msg));
//         }.bind(this);
//         new ActivityProto(proto_cs.huodong.buyActItem)
//             .BindActivity(pindex)
//             .DParam({ id: id, pindex: pindex, count: num })
//             .Callback(cb)
//             .Send();
//     }

//     //回调 逻辑调用
//     //购买道具回包
//     OnBuyItem(errorInfo: any, actItemID: number) {
//         //retcode 返回值
//         if (errorInfo == null) {
//             //无错误,回调UI
//             this.InvokeAll("BuyItemSuccess", actItemID);
//         }
//         else {
//             HDebug.Error("购买道具发生错误，错误码为 " + errorInfo, errorInfo);
//             this.InvokeAll("BuyItemFailed", actItemID);
//         }
//     }

//     //使用道具
//     UseItem(actItemId: number, canUseMulti) {
//         //协议数据准备 useActItem 【道具ID id， 活动ID pindex， 使用类型 type】
//         let pindex = this.m_activity.GetActID();
//         let id = actItemId;
//         let useType: ActivityUseType = canUseMulti ? ActivityUseType.UseMultiple : ActivityUseType.UseSingle;
//         let type = useType; //使用类型 1：单次使用 2：多次使用

//         let cb = function (msg, errorInfo) {
//             this.OnItemUse(msg, errorInfo, actItemId);
//         }.bind(this);

//         new ActivityProto(proto_cs.huodong.useActItem)
//             .BindActivity(pindex)
//             .DParam({
//                 id: id,
//                 pindex: pindex,
//                 type: type
//             })
//             .Callback(cb)
//             .Send();
//     }

//     //使用道具回包
//     OnItemUse(msg: any, errorInfo: any, actItemID: number) {
//         //retcode 返回值
//         if (errorInfo == null) {
//             //无错误,回调UI
//             let reward = AppUtils.getMsgwinItems(msg);
//             this.InvokeAll("UseItemSuccess", actItemID, reward);
//             // ProxyManager.getInstance().timeProxy.JustShowAllRewardWithoutClick(AppUtils.getMsgwinItems(msg))
//         }
//         else {
//             HDebug.Error("使用道具发生错误，错误码为 " + errorInfo.msg);
//             this.InvokeAll("UseItemFailed", actItemID);
//         }
//     }
// }

// //排行榜相关
// export interface IActRank extends IFeatureCB {
//     OnRefreshRank(info);
// }
// export class ActRankFeature extends ActFeature<IActRank>  {
//     GetRankInfo(): any {
//         let info = this.m_activity.GetFeature(ActInfoFeature).GetInfo();
//         if (info != null) {
//             return info.list;
//         } else {
//             return null;
//         }

//     }
//     OnGetRank(info) {
//         // this.InvokeAll("");
//     }

//     SendGetRankReward(func, isCoc) {
//         //协议数据准备 exchangeActGoods 【道具ID id， 活动ID pindex】
//         let pindex = this.m_activity.GetActID();
//         let cb = function (msg, errorInfo) {
//             this.OnRespGetRank(msg, errorInfo);
//             if (errorInfo == null) func && func();
//         }.bind(this);
//         if (isCoc) {
//             new ActivityProto(proto_cs.huodong.getActCocAward)
//                 .BindActivity(pindex)
//                 .DParam({
//                     pindex: pindex
//                 })
//                 .Callback(cb)
//                 .Send();
//         }
//         else {
//             new ActivityProto(proto_cs.huodong.getActAward)
//                 .BindActivity(pindex)
//                 .DParam({
//                     pindex: pindex
//                 })
//                 .Callback(cb)
//                 .Send();
//         }
//     }

//     OnRespGetRank(msg, errorInfo) {
//         if (errorInfo != null) return;
//         ProxyManager.getInstance().timeProxy.JustShowAllReward(
//             AppUtils.getMsgwinItems(msg)
//         );
//     }

//     OpenRankUI() {
//         new ActivityProto(proto_cs.huodong.requestRank)
//             .BindActivity(this.m_activity.GetActID())
//             .Send();
//         //OPEN UI
//     }
// }

// //兑换功能
// //【兑换商品】
// export interface IActExchange extends IFeatureCB {
//     //兑换商品
//     OnGetExchangeShopDataSuccess();
//     OnGetExchangeShopDataFailed();
//     OnExchangeItemSuccess(items);
//     RefreshGoodsList(exchangeItemList: NewShopItem);
// }
// export class ActExchangeFeature extends ActFeature<IActExchange> {
//     ReqGetExchangeShop() {
//         MaskManager.getInstance().ShowMask(NetworkOp.ReqExchangeShopData, 5, () => {
//             //如果这里切换了场景，就让它毁灭吧……
//             HDebug.Error("请求兑换商店数据超时");
//             this.InvokeAll("OnGetExchangeShopDataFailed");
//         });
//         let cb = (msg, errorInfo) => {
//             this.OnGetShopData(msg, errorInfo);
//         };
//         new Proto(proto_cs.shop.getExchangeGoodsList)
//             .DParam({ pindex: this.m_activity.GetActID() })
//             .Callback(cb).Send();
//     }

//     private getGoodsList(netData): NewShopItem[] {
//         return GuardUtil.SafeReturn(netData, "a.hdShop.data.list");
//     }
//     private getSingleGood(netData): NewShopItem {
//         return GuardUtil.SafeReturn(netData, "a.hdShop.data.singleGood");
//     }

//     private exchangeItemList: NewShopItem[] = null;
//     GetExchangeItemList(): NewShopItem[] { return this.exchangeItemList; }
//     OnGetShopData(netData: any, errorInfo: any) {
//         MaskManager.getInstance().HideMask(NetworkOp.ReqExchangeShopData);
//         this.exchangeItemList = this.getGoodsList(netData);
//         //retcode 返回值
//         if (errorInfo == null) {
//             this.InvokeAll("OnGetExchangeShopDataSuccess");
//             this.InvokeAll("RefreshGoodsList", this.exchangeItemList);
//         }
//         else {
//             HDebug.Error("使用道具发生错误，错误码为 " + errorInfo, errorInfo);
//             this.InvokeAll("OnGetExchangeShopDataFailed");
//         }
//     }

//     //兑换道具
//     ExchangeGoodsByNum(exchangeId: number, num: number) {
//         //协议数据准备 exchangeActGoods 【道具ID id， 活动ID pindex】
//         let pindex = this.m_activity.GetActID();
//         let id = exchangeId;

//         let cb = (msg, errorInfo) => {
//             this.OnExchangeGoods(msg, errorInfo, id);
//         };

//         new ErrFuncProto(proto_cs.shop.exchangeGoods)
//             .DParam({
//                 id: id,
//                 pindex: pindex,
//                 count: num
//             })
//             .Callback(cb)
//             .Send();
//     }

//     //兑换道具回包
//     OnExchangeGoods(netData: any, errorInfo: any, exchangeId: number) {
//         //retcode 返回值
//         if (errorInfo == null) {
//             //无错误,回调UI
//             this.InvokeAll("OnExchangeItemSuccess", AppUtils.getMsgwinItems(netData));
//             let newGood = this.getSingleGood(netData);
//             if (null != newGood) {
//                 //最好是對比之後有變化的配置
//                 this.updateExchangeItemList(newGood);
//                 EventManager.getInstance().emit(EventConstants.LIMIT_ACT_EXCHANGE_CFG, newGood);
//             }
//         }
//     }

//     updateExchangeItemList(good: NewShopItem) {
//         for (let i = 0; i < this.exchangeItemList.length; i++) {
//             let GoodItem = this.exchangeItemList[i];
//             if (GoodItem.goods_id == good.goods_id) {
//                 this.exchangeItemList[i] = good;
//             }
//         }
//     }
// }
// export enum ActRedEnum {
//     rankReward = "LimitActivity_rankReward_",
//     canGetFreeItem = "LimitActivity_canGetFreeItem_",
//     canUseItem = "LimitActivity_canUseItem_",
//     canGetReward = "LimitActivity_canGetReward_",
// }

// export class ActRedFeature extends ActFeature<IFeatureCB> {
//     RefreshRedDot() {
//         this.RefreshRankRewardRedDot();
//         this.RefreshFreeItem();
//         this.RefreshUseBagRedDot();
//         this.RefreshFullRedDot();
//     }

//     //排行奖励
//     //通过判断奖励状态是否为可领取状态
//     RefreshRankRewardRedDot() {
//         let onShow = this.m_activity.GetFeature(ActTimeFeature).CheckOnShow();

//         let info = this.m_activity.GetFeature(ActInfoFeature).GetInfo();
//         let id = this.m_activity.GetActID();
//         RedDot.change(ActRedEnum.rankReward + id, onShow && (
//             info.awardState == LimitActAwardState.canGet ||
//             info.awardCocState == LimitActAwardState.canGet));
//     }

//     //领取免费物品
//     //通过判断商店是否还能领取免费物品
//     //后台存储我们的购买记录，我们需要通过购买记里的数量和本地配置里购买上限进行比较
//     RefreshFreeItem() {
//         let onPlay = this.m_activity.GetFeature(ActTimeFeature).CheckOnPlay();

//         let info = this.m_activity.GetFeature(ActInfoFeature).GetInfo();
//         let id = this.m_activity.GetActID();

//         let cfgList: ActItemCfg[] = localcache.getGroup(localdb.table_actItem, "pindex", id);

//         let hasFree = false;
//         if (null != cfgList) {
//             for (let i = 0; i < cfgList.length; i++) {
//                 let cfgItem = cfgList[i];
//                 let infoItem = null;
//                 for (let infoIndex = 0; infoIndex < info.item.length; ++infoIndex) {
//                     if (info.item[infoIndex].id == cfgItem.id) {
//                         infoItem = info.item[infoIndex];
//                         break;
//                     }
//                 }

//                 if (cfgItem != null && cfgItem.price == 0) {
//                     hasFree = infoItem == null || cfgItem.limit > infoItem.num;
//                     if (hasFree) break;
//                 }
//             }
//         }
//         RedDot.change(ActRedEnum.canGetFreeItem + id, onPlay && hasFree);
//     }

//     //使用物品
//     //通过背包身上是否还有活动物品进行判断，注意后台背包里有出现数量为0的数据
//     RefreshUseBagRedDot() {
//         let onPlay = this.m_activity.GetFeature(ActTimeFeature).CheckOnPlay();

//         let bagList = this.m_activity.GetFeature(ActInfoFeature).GetBagInfo();
//         let id = this.m_activity.GetActID();
//         let canUse = false;
//         for (let i = 0; i < bagList.length; i++) {
//             if (bagList[i].num > 0) {
//                 canUse = true;
//                 break;
//             }
//         }
//         RedDot.change(ActRedEnum.canUseItem + id, onPlay && canUse);
//     }

//     //获取全服奖励
//     //通过本地配置的排名数据和后台总分以及领取数据进行比较
//     RefreshFullRedDot() {
//         let onPlay = this.m_activity.GetFeature(ActTimeFeature).CheckOnPlay();

//         let hasTotalReward = this.m_activity.GetFeature(ActTotalRewardFeature).CanShowTotalReward()
//         let info = this.m_activity.GetFeature(ActInfoFeature).GetInfo();
//         let id = this.m_activity.GetActID();

//         let canGetFullReward = false;
//         let activityInfo: ActInfo = info;
//         let cfgList: ActTotalScoreCfg[] = ConfigFinder.FindGroupWithKey(localdb.table_actTotalScore, "pindex", id);
//         if(cfgList) {
//             for (let i = 0; i < cfgList.length; i++) {
//                 if (activityInfo.totalScore > cfgList[i].need) {
//                     if (activityInfo.box.indexOf(cfgList[i].id) == -1) {
//                         canGetFullReward = true;
//                         break;
//                     }
//                 }
//             }
//         }
//         RedDot.change(ActRedEnum.canGetReward + id, hasTotalReward && onPlay && canGetFullReward);
//     }
// }

//需要被iconopen控制的活动需要添加这个feature
export class IconOpenFeature extends ActFeature<IFeatureCB> {
    private canOpen: boolean = true;
    public Init() {
        this.canOpen = this.CheckCanOpen();
    }
    public HasOpened(): boolean {
        return this.canOpen;
    }
    public CheckCanOpen(): boolean {
        let p = MTBConfigHelper.GetActivityPanel(this.m_activity.GetActID());
        if (p != PanelType.None) {
            console.error("接入iconOpen功能");
            return true;
            //this.canOpen = OpenRuleManager.Instance().CheckCanOpen(p);
        }
        return this.canOpen;
    }
}

// //每日任务模块
// export class HdActTaskFeature extends ActFeature<IUIActDailyTask> {
//     private _taskList: TaskGet[] = [];
//     private ReddotEnum: string = null;
//     public Init() {
//         super.Init();
//         this.ReddotEnum = RedDotEvent.DailyTaskRed + this.m_activity.GetActID();
//     }

//     public onGetData(taskGet: TaskGet[]) {
//         this._taskList = [];
//         for (let index in taskGet) {
//             this._taskList.push(taskGet[index]);
//         }

//         this.checkRedDot();
//         this.InvokeAll("onGetTaskData");
//     }

//     //4.8新改动 活动结束后展示期内 也要可进任务界面可领奖，所以红点也给
//     public checkRedDot() {
//         let isfind = false;
//         for (let index in this._taskList) {
//             if (this._taskList[index].get == ServerTaskType.CanGet) {
//                 isfind = true;
//             }
//         }
//         RedDot.change(this.ReddotEnum, isfind);
//     }

//     private getPindex() { return this.m_activity.GetActID(); }

//     public GetTaskInfo() {
//         return this._taskList;
//     }

//     public HasRewardByDay(dayindex: number): boolean {
//         if (this._taskList.length == 0) {
//             return false;
//         }
//         for (let taskinfo of this._taskList) {
//             let taskcfg = ConfigFinder.Find<Cfg_activeHDTask>(localdb.table_activeHDTask, taskinfo.id);
//             if (taskcfg.dayId == dayindex && taskinfo.get == ServerTaskType.CanGet) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     public SendGetTaskReward(taskid: number) {
//         new ErrFuncProto(proto_cs.huodong.getActiveHDTask)
//             .DParam({ pindex: this.getPindex(), id: taskid })
//             .Callback((msg, err) => {
//                 if (null == err) {
//                     ProxyManager.getInstance().timeProxy.JustShowAllReward(AppUtils.getMsgwinItems(msg));
//                 }
//             })
//             .Send();
//     }
// }

// //发送赠礼模块
// export class HdActSendGiftFeature extends ActFeature<IUIActSendGift> {
//     readonly maxStrCount: number = 20;

//     private _nowScore: number = 0;
//     private _nowNum: number = 0;
//     private _sendNum: number = 0;
//     private _redEnum: string = null;

//     private s_tarNum: number = 0;
//     private s_tarScore: number = 0;

//     public Init() {
//         super.Init();
//         this.InitParam();
//     }

//     InitParam() {
//         let Pindex = this.m_activity.GetActID();
//         let HDGiftItem = ConfigFinder.Find<Cfg_activeHDGift>(localdb.table_activeHDGift, Pindex);
//         this.s_tarNum = HDGiftItem.conditionNum;
//         this.s_tarScore = HDGiftItem.conditionScore;
//         this._redEnum = RedDotEvent.SendGiftRed + Pindex;
//     }

//     public onGetData(score: number, num: number, giftNum: number) {
//         this._nowScore = score;
//         this._nowNum = num;
//         this._sendNum = giftNum;
//         this.checkRedDot();
//     }

//     public GetSendServerStr(): string[] {
//         return [ProxyManager.getInstance().loginProxy.getPickServer().name];
//     }

//     public GetNowScore(): number {
//         return this._nowScore;
//     }

//     public GetLastSendCount(): number {
//         if(this._nowScore >= this.s_tarScore) {
//             let CanSendNum = Math.floor((this._nowScore - this.s_tarScore) / this.s_tarNum + 1) - this._sendNum;
//             return Math.max(CanSendNum, 0);
//         }
//         else {
//             return 0;
//         }
//     }

//     public GetNextSendScore(): number {
//         let score = this.s_tarScore;
//         while(this._nowScore >= score) {
//             score += this.s_tarNum;
//         }
//         return score;
//     }

//     public ReqSendGift(str: string) {
//         let lastNum = this._sendNum;
//         // 发送赠礼到玩家
//         new ErrFuncProto(proto_cs.huodong.sendActiveHDGiftToFullUser)
//             .DParam({
//                 pindex: this.m_activity.GetActID(),
//                 giftChat: str,
//             })
//             .Callback((msg, errInfo) => {
//                 if (null == errInfo) {
//                     this.OnRespSendGiftSuccess(lastNum);
//                 }
//             })
//             .Send();
//     }

//     public CheckCanSend() {
//         if (this.GetLastSendCount() > 0) {
//             return true;
//         }
//         return false;
//     }

//     public OnRespSendGiftSuccess(lastNum) {
//         this._sendNum = lastNum + 1;
//         this.InvokeAll("onRespSendGift");
//         this.checkRedDot();
//     }

//     private checkRedDot() {
//         if (this.m_activity.GetFeature(ActTimeFeature).CheckOnPlay()) {
//             let canSend = this.GetLastSendCount() > 0;
//             RedDot.change(this._redEnum, canSend);
//         } else {
//             RedDot.change(this._redEnum, false);
//         }
//     }
// }

// //奖励模块
// export class HDActGetRewardFeature extends ActFeature<IUIActGetReward> {
//     public Init() {
//         super.Init();
//         this._redEnum = RedDotEvent.CanGetReward + this.m_activity.GetActID();
//     }

//     private _rwdGot: number[] = [];//已领取的id,HDRwd表里取
//     private _AchieveNum: number = 0;   //当前已领取的奖励次数
//     private _redEnum: string = null;

//     private _rewardInfo: { [index: number]: ActAchieveNetItem[] } = null;

//     public getRewardInfo(): { [index: number]: ActAchieveNetItem[] } {
//         return this._rewardInfo;
//     }

//     public onGetData(rwdGot: number[], Num: number, cfgList: { [index: number]: ActAchieveNetItem[] }) {
//         HDebug.Assert(cfgList != null, "cfgList is null ,plz check , actId[" + this.m_activity.GetActID() + "]");
//         this._rewardInfo = cfgList;
//         this._rwdGot = rwdGot;
//         this._AchieveNum = Num;
//         this.checkRedDot();
//         this.InvokeAll("onGetRwdData");
//     }

//     public checkRedDot() {
//         let list: Cfg_activeHDRwd[] = ConfigFinder.FindGroupWithKey(localdb.table_activeHDRwd, "pindex", this.getPindex());
//         let curNum = this._AchieveNum;
//         let isfind = false;
//         for (let CfgItem of list) {
//             if (CfgItem.need <= curNum && this._rwdGot.indexOf(CfgItem.id) == -1) {
//                 isfind = true;
//                 break;
//             }
//         }

//         let onPlay = this.m_activity.GetFeature(ActTimeFeature).CheckOnPlay();
//         RedDot.change(this._redEnum, isfind && onPlay);
//     }

//     private getPindex() { return this.m_activity.GetActID(); }


//     public getAchieveNum(): number {
//         return this._AchieveNum;
//     }

//     public getRewardData() {
//         return this._rwdGot;
//     }

//     public getNextCfg(): Cfg_activeHDRwd {
//         let cfg: Cfg_activeHDRwd = null;
//         let list: Cfg_activeHDRwd[] = ConfigFinder.FindGroupWithKey(localdb.table_activeHDRwd, "pindex", this.getPindex());
//         for (let i = 0; i < list.length; ++i) {
//             if (this._rwdGot.indexOf(list[i].id) == -1) {
//                 cfg = list[i];
//                 break;
//             }
//         }
//         return cfg;
//     }

//     public sendGetReward(rwdid: number) {
//         new ErrFuncProto(proto_cs.huodong.getActivieHDRwd)
//             .DParam({ pindex: this.getPindex(), id: rwdid })
//             .Callback((msg, err) => {
//                 if (null == err) {
//                     ProxyManager.getInstance().timeProxy.JustShowAllReward(AppUtils.getMsgwinItems(msg));
//                 }
//             })
//             .Send();
//     }
// }

// export class HDActNoticeFeature extends ActFeature<IFeatureCB> implements IActivityNotice, INoticeCheckerHelper {
//     private noticeChecker : NoticeChecker;
//     public Init() {
//         this.noticeChecker = new NoticeChecker(this);
//         this.noticeChecker.Start();
//     }
//     public OnDestroy() {
//         this.noticeChecker.Stop();
//     }
//     public NeedNotice() : boolean {
//         if(!OpenRuleManager.Instance().CheckCanOpen(213)) {
//             return false;
//         }
//         let cfg: Cfg_hdConf = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, this.m_activity.GetActID());
//         if(cfg.showType != ActivityShowType.NormalLimitAct) {
//             return this.m_activity.GetState() == ActivityState.Opening;
//         }
//         return false;
//     }
//     public GetNotice() : IActivityNotice {
//         return this;
//     }
//     public GoTo() {
//         ActivityGoToHelper.GoTo(this.m_activity);
//     }
//     public GetPriority() : NoticePriority {
//         let item = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, this.m_activity.GetActID());
//         if(item.showType == ActivityShowType.Discount) {
//             return NoticePriority.OpenGameBargain;
//         } 
//         let hasRed = RedDotChecker.CheckHasRedDot(this.m_activity);
//         if(hasRed) return NoticePriority.WithRedDot;

//         if (item.type == ActivityType.ActiveActivities) {
//             return NoticePriority.GamePlayAct;
//         }
//         else {
//             HDebug.Error("为处理的活动类型 " + this.m_activity.GetActID());
//         }
//         return NoticePriority.GamePlayAct;
//     }

//     public GetDescUrl() : string {
//         return UIHelps.getActivityNotice(this.m_activity.GetActID());
//     }
//     public GetTitle() : string {
//         return "玩法活动 " + this.m_activity.GetActID();
//     }
// }

// export class CBInfoFeature extends ActFeature<IFeatureCB> {
//     private _info: CBHDInfo = null;
//     Init() {
//         NetManager.getInstance().subscribe(proto_sc.CBHuoDong[("CBHD_" + this.m_activity.GetActID())], 
//             this.OnRespGetInfo.bind(this), this);
//     }

//     OnDestroy() {
//         NetManager.getInstance().remove(proto_sc.CBHuoDong[("CBHD_" + this.m_activity.GetActID())]);
//     }

//     OnRespGetInfo(info: CBHDInfo) {
//         this._info = info;
//         this.checkRedDot(info);
//     }

//     checkRedDot(info: CBHDInfo) {
//         RedDot.change(RedDotEvent.RankHasRwd + this.m_activity.GetActID(),
//             info.awardState == LimitActAwardState.canGet || 
//             info.awardCocState == LimitActAwardState.canGet ||
//             info.awardHistoryState == LimitActAwardState.canGet);
//     }

//     GetInfo(): CBHDInfo {
//         return this._info;
//     }

//     GetCrossList() {
//         return this._info.crossList;
//     }
// }

export class NetworkDetailInfoFeature extends ActFeature<IFeatureCB> {
    onGetDetailData(netData) {
        this.m_activity.GetMainFeature().onGetDetailData(netData);
    }
}

// //活动中单对单战斗模块
// export class OneManBattleFeature extends ActFeature<IFeatureCB> {
//     private heroList: Map<number, ActOneManFightServantData> = new Map<number, ActOneManFightServantData>();
//     private damageRankList: ActOneManFightRankData[] = [];
//     private fightInfo: ActOneManFightData = null;
//     private fightItem: BaseItemSlot[] = [];
//     private ServantSortType: CommonSelectType = CommonSelectType.Lower;
//     //获取战斗详情信息
//     public onGetBattleInfo(data: ActOneManFightData) {
//         this.fightInfo = data;
//         if(data.log) {
//             this.onGetDamageRank(data.log);
//         }
//         this.InvokeAll("onGetOnLineList");
//         this.InvokeAll("onGetAttackLog", data.attackLog);
//     }

//     //获取伙伴列表，包含总实力和出战次数信息
//     public onGetHeroList(data: ActOneManFightServantData_Net) {
//         let herolist = ProxyManager.getInstance().servantProxy.getHeroList(true);
//         for(let i=0;i<herolist.length;++i) {
//             let heroId = herolist[i].heroid;
//             let herodata = this.heroList.get(heroId);
//             if(!herodata) {
//                 herodata = new ActOneManFightServantData();
//                 herodata.heroId = heroId;
//                 herodata.Power = 0;
//                 if(data.heroList && data.heroList[heroId]) {
//                     herodata.Power = data.heroList[heroId];
//                 }
//                 herodata.FightNum = [0, 0];
//                 if(data.heroAttackCount && data.heroAttackCount[heroId]) {
//                     herodata.FightNum = data.heroAttackCount[heroId];
//                 }
//                 this.heroList.set(heroId, herodata);
//             }
//             else {
//                 if(data.heroList && data.heroList[heroId]) {
//                     herodata.Power = data.heroList[heroId];
//                 }
//                 herodata.FightNum = [0, 0];
//                 if(data.heroAttackCount && data.heroAttackCount[heroId]) {
//                     herodata.FightNum = data.heroAttackCount[heroId];
//                 }
//             }
//         }
//     }

//     public setSortType(type: CommonSelectType) {
//         this.ServantSortType = type;
//     }

//     public getSortType(): CommonSelectType {
//         return this.ServantSortType;
//     }

//     //服务器不做排序，客户端根据伤害降序排
//     public onGetDamageRank(data) {
//         let list: ActOneManFightRankData[] = [];
//         for(let key in data) {
//             let rankData = new ActOneManFightRankData();
//             rankData.name = data[key].name;
//             rankData.damage = data[key].damage;
//             list.push(rankData);
//         }
//         list.sort((dataA, dataB) => {
//             return dataB.damage - dataA.damage;
//         })
//         let rank = 1;
//         for(let i=0;i<list.length;++i) {
//             list[i].rank = rank;
//             rank++;
//         }
//         this.damageRankList = list;
//     }

//     public onGetFightRwd(data: BaseItemSlot[]) {
//         this.fightItem = data;
//     }

//     public getFightRwd(): BaseItemSlot[] {
//         return this.fightItem;
//     }

//     public resetFightRwd() {
//         this.fightItem = [];
//     }

//     public getBattleInfo(): ActOneManFightData {
//         return this.fightInfo;
//     }

//     public getDamageRankList(): ActOneManFightRankData[] {
//         return this.damageRankList;
//     }

//     private getPindex() { 
//         return this.m_activity.GetActID(); 
//     }

//     public getFightCfgByType(type: ActOneManFightType): ActOneManFightCfg {
//         let cfg = ConfigFinder.Find<Cfg_ModuleFight>(localdb.table_moduleFight, this.getPindex());
//         HDebug.Assert(cfg != null, "该活动对应的moduleFight表配置不存在，pindex:" + this.getPindex());
//         let fightCfg = new ActOneManFightCfg();
//         fightCfg.FreeFightNum = cfg.FreeFightNum[type];
//         fightCfg.FightMaxNum = cfg.FightMaxNum[type];
//         fightCfg.RecoverItemId = cfg.RecoverItem[type];
//         fightCfg.RecoverNeed = cfg.RecoverNeed[type];
//         return fightCfg;
//     }

//     //获取伙伴活动中总实力
//     public getHeroPower(heroId: number): number {
//         return this.heroList.get(heroId).Power;
//     }

//     public getHeroList(): ActOneManFightServantData[] {
//         let list: ActOneManFightServantData[] = [];
//         this.heroList.forEach((value, key) => {
//             list.push(value);
//         })
//         return list;
//     }

//     //获取剩余出战次数
//     public getHeroFightNum(heroId: number, fightType: ActOneManFightType): number {
//         let cfg = this.getFightCfgByType(fightType);
//         let haveFightNum = this.heroList.get(heroId).FightNum[fightType];
//         return cfg.FightMaxNum - haveFightNum;
//     }

//     //获取剩余免费出战次数
//     public getHeroFreeFightNum(heroId: number, fightType: ActOneManFightType): number {
//         let cfg = this.getFightCfgByType(fightType);
//         let haveFightNum = this.heroList.get(heroId).FightNum[fightType];
//         return cfg.FreeFightNum - haveFightNum;
//     }

//     public getHeroFightUseItemNum(heroId: number, fightType: ActOneManFightType): number {
//         let useItemNum = 0;
//         let cfg = this.getFightCfgByType(fightType);
//         let haveFightNum = this.heroList.get(heroId).FightNum[fightType];
//         if(haveFightNum < cfg.FreeFightNum) {
//             //还在免费跳战阶段
//         }
//         else {
//             //用道具恢复次数阶段
//             let index = haveFightNum - cfg.FreeFightNum;
//             useItemNum = cfg.RecoverNeed[index];
//         }
//         return useItemNum;
//     }

//     //伙伴出战
//     public SendHeroFight(heroId: number) {
//         new ErrFuncProto(proto_cs.huodong.moduleAttackMonster)
//         .DParam({ pindex: this.getPindex(), heroId: heroId })
//         .Callback((msg, err) => {
//             if (null == err) {
//                 this.onRespHeroFight(msg);
//             }
//         })
//         .Send();
//     }

//     public onRespHeroFight(msg) {
//         this.InvokeAll("onRespHeroFight", msg);
//     }

//     //查询当前战斗的伤害排行
//     public SendQuaryLog(cb?: any) {
//         new ErrFuncProto(proto_cs.huodong.moduleQueryDamageLog)
//         .DParam({ pindex: this.getPindex() })
//         .Callback((msg, err) => {
//             if (null == err) {
//                 if(cb) {
//                     cb();
//                 }
//             }
//         })
//         .Send();
//     }

//     //退出战斗场景
//     public SendQuitFight() {
//         new ErrFuncProto(proto_cs.huodong.moduleQuitMonster)
//         .DParam({ pindex: this.getPindex() })
//         .Callback((msg, err) => {
//             if (null == err) {

//             }
//         })
//         .Send();
//     }
// }

// export class ActBoxRwdFeature extends ActFeature<IFeatureCB> { 
//     private boxMap: Map<ActBoxType, number> = new Map<ActBoxType, number>();
//     Init() {
//         super.Init();
//         EventManager.getInstance().on(EventConstants.BAGPROXY_UPDATE_BAG_ITEM, this.checkRedDot.bind(this), this);
//     }
//     OnDestroy() {
//         super.OnDestroy();
//         EventManager.getInstance().offTarget(this);
//     }
//     private getPindex() { 
//         return this.m_activity.GetActID(); 
//     }

//     public getBoxList(list) {
//         for(let key in list) {
//             let BoxEventId = Number(key);
//             let BoxCfg = ConfigFinder.Find<Cfg_ModuleBoxRwd>(localdb.table_moduleBoxRwd, BoxEventId);
//             this.boxMap.set(BoxCfg.type, list[key]);
//         }
//         this.checkRedDot();
//     }

//     //根据type获取宝箱数量
//     public getBoxNum(type: ActBoxType): number {
//         let num = this.boxMap.get(type) ? this.boxMap.get(type) : 0;
//         return num;
//     }

//     //根据type获取宝箱id
//     public getBoxId(type: ActBoxType): number {
//         let cfglist: Cfg_ModuleBoxRwd[] = ConfigFinder.FindGroupWithKey(localdb.table_moduleBoxRwd, "pindex", this.getPindex());
//         for(let i=0;i<cfglist.length;++i) {
//             if(cfglist[i].type == type) {
//                 return cfglist[i].id;
//             }
//         }
//         return 0;
//     }

//     public checkRedDot() {
//         let boxRed: boolean = false;
//         this.boxMap.forEach((value,key) => {
//             if(!boxRed && value > 0){
//                 let Id = this.getBoxId(key);
//                 let cfg = ConfigFinder.Find<Cfg_ModuleBoxRwd>(localdb.table_moduleBoxRwd, Id);
//                 let boxNeedItemId = cfg.openItems.id;
//                 let needCount = cfg.openItems.count;
//                 let haveCount = ProxyManager.getInstance().bagProxy.getItemCount(boxNeedItemId);
//                 if(haveCount >= needCount) {
//                     boxRed = true;
//                 }
//             }
//         })
//         RedDot.change(RedDotEvent.CommonBox_Can_Open + this.m_activity.GetActID(), boxRed);
//     }

//     //开启宝箱 发的是ModuleBoxRwd表中的id
//     public SendOpenBox(boxId: number, type: ActBoxOpenType) {
//         new ErrFuncProto(proto_cs.huodong.moduleOpenBoxRwd)
//         .DParam({ 
//             pindex: this.getPindex(),
//             id: boxId,
//             type: type
//          })
//         .Callback((msg, err) => {
//             if (null == err) {
//                 this.onRespOpenBox(msg);
//             }
//         })
//         .Send();
//     }

//     public onRespOpenBox(msg) {
//         this.InvokeAll("onRespOpenBox", msg);
//     }
// }

// export class ActTradeFeature extends ActFeature<IFeatureCB> { 

//     private getPindex() { 
//         return this.m_activity.GetActID(); 
//     }

//     //进行交易事件
//     public SendTrade() {
//         new ErrFuncProto(proto_cs.huodong.moduleTrade)
//         .DParam({ pindex: this.getPindex() })
//         .Callback((msg, err) => {
//             if (null == err) {
//                 this.onRespTrade(msg);
//             }
//         })
//         .Send();
//     }

//     public onRespTrade(msg) {
//         this.InvokeAll("onRespTrade", msg);
//     }
// }

// 排行榜相关
export interface IActivityLeiJiData {
    rwdCfg: Map<number, Cfg_ActivityLeiJiRwd>;
    finishedMap: Map<number, boolean>;
}
export interface IActivityLeiJiRwdFeature extends IFeatureCB {
    OnGetSuccess();
}
export class ActivityLeiJiRwdFeature extends ActFeature<IActivityLeiJiRwdFeature>  {
    rwdCfg: Map<number, Cfg_ActivityLeiJiRwd> = new Map();
    finishedMap: Map<number, boolean> = new Map();

    SendGetLeiJiRwdInfo(cb?: Function) {
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (msg, err) => {
            if (null == err) {
                let info = GuardUtil.SafeReturn(msg, "a.ActiveHuoDong.smallGame" + pindex);
                this.onGetLeiJiRwdInfo(info);
                cb && cb();
            }
            else {
                HDebug.Error("请求pindex:" + pindex + "累计奖励报错:" + err);
            }
        }
        new ErrFuncProto(proto_cs.huodong.smallGameStageScoreRwdInfo)
            .DParam({
                pindex: pindex
            })
            .TimeOutCB(timeoutCB)
            .Callback(callBack)
            .Send();
    }

    ReqGetLeiJiRwd(id: number) {
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (netData, err) => {
            if (null == err) {
                let info = GuardUtil.SafeReturn(netData, "a.ActiveHuoDong.smallGame" + pindex);
                this.onGetLeiJiRwdInfo(info);
                this.InvokeAll("OnGetSuccess");

                let msgItem = GuardUtil.SafeReturn(netData, "a.msgwin.items");
                if (null != msgItem) {
                    ProxyManager.getInstance().floatRewardProxy.floatReward();
                }
            }
        }
        new ErrFuncProto(proto_cs.huodong.smallGameStageScoreRwd)
            .DParam({
                pindex: pindex,
                id: id,
            })
            .TimeOutCB(timeoutCB)
            .Callback(callBack)
            .Send();
    }

    public getRwdData(): IActivityLeiJiData {
        return {
            rwdCfg: this.rwdCfg,
            finishedMap: this.finishedMap
        }
    }

    private onGetLeiJiRwdInfo(info) {
        if (null != info) {
            let pindex = this.m_activity.GetActID();
            //奖励配置
            let cfgStageScoreRwd = GuardUtil.SafeReturn(info, "cfgStageScoreRwd");
            if (null != cfgStageScoreRwd) {
                for (let key in cfgStageScoreRwd) {
                    let cfg = cfgStageScoreRwd[key];
                    HDebug.Assert(pindex == cfg.pindex, "发下来的累充活动配置ID不一致,发下来的pindex:" + cfg.pindex + " 目前活动的：" + pindex);
                    this.rwdCfg.set(cfg.id, cfg);
                }
            }

            let stageScoreRwd = GuardUtil.SafeReturn(info, "stageScoreRwd");
            if (null != stageScoreRwd) {
                for (let index = 0; index < stageScoreRwd.length; ++index) {
                    let getRwdID = stageScoreRwd[index];
                    this.finishedMap.set(getRwdID, true);
                }
            }
        }
    }
}

//成就奖励
export class ActStageRwdInfo {
    id: number;
    needScore: number;
    score: number;
    rwd: BaseItemSlot[];
    state: number;
}

export interface IActivityStageRwdFeature extends IFeatureCB {
    OnGetSuccess();
}

export class ActivityStageRwdFeature extends ActFeature<IActivityStageRwdFeature>  {
    rwdCfg: Map<number, ActStageRwdInfo> = new Map();

    public onGetStageRwdInfo(info) {
        if (null != info) {
            //奖励配置
            let stageRwdGot = GuardUtil.SafeReturn(info, "stageRwdGot");
            if (null != stageRwdGot) {
                for (let key in stageRwdGot) {
                    let cfg = stageRwdGot[key];
                    this.rwdCfg.set(cfg.id, cfg);
                }
            }
            this.InvokeAll("OnGetSuccess");
        }
    }

    public getRwdData(): Map<number, ActStageRwdInfo> {
        return this.rwdCfg;
    }

    ReqGetStageRwd(id: number) {
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (netData, err) => {
            if (null == err) {
                // let info = GuardUtil.SafeReturn(netData, "a.ActiveHuoDong.smallGame" + pindex);
                // this.onGetStageRwdInfo(info);
                // this.InvokeAll("OnGetSuccess");

                let msgItem = GuardUtil.SafeReturn(netData, "a.msgwin.items");
                if (null != msgItem) {
                    ProxyManager.getInstance().floatRewardProxy.floatReward();
                }
            }
        }
        new ErrFuncProto(proto_cs.huodong.smallGameDrawLevelRwd)
            .DParam({
                pindex: pindex,
                id: id,
            })
            .Callback(callBack)
            .TimeOutCB(timeoutCB)
            .Send();
    }
}


//九宫格抽奖
export class ActLuckyGiftGridInfo {
    id: number;
    is_open: number;
    rwd: BaseItemSlot;
}
export class ActLuckyGiftInfo {
    private canOneKeyOpen: boolean = false;
    private drawCost: BaseItemSlot = null;
    private gridInfo: Map<number, ActLuckyGiftGridInfo> = new Map();
    private layerNum: number = 0;
    private luckyGiftType: number = 0;
    constructor(type: number) {
        this.luckyGiftType = type;
    }
    public SetInfo(data) {
        if (null != data.batch_open) {
            this.canOneKeyOpen = 1 == data.batch_open;
        }
        if (null != data.cost) {
            this.drawCost = data.cost;
        }
        if (null != data.grid_info) {
            for (let index = 0; index < data.grid_info.length; ++index) {
                let singleGridInfo = data.grid_info[index];
                let gridId = Number(singleGridInfo.id);
                this.gridInfo.set(gridId, singleGridInfo);
            }
        }
        if (null != data.layer_num) {
            this.layerNum = data.layer_num;
        }
    }

    public CanOneKeyOpen(): boolean {
        return this.canOneKeyOpen;
    }

    public GetDrawCost(): BaseItemSlot {
        return this.drawCost;
    }

    public GetCurLayerNum(): number {
        return this.layerNum;
    }

    public GetGridInfo(id: number): ActLuckyGiftGridInfo {
        HDebug.Assert(this.gridInfo.has(id), "数据里没有id为:" + id + "的数据");
        return this.gridInfo.get(id);
    }

    public GetGridInfoList(): ActLuckyGiftGridInfo[] {
        let list: ActLuckyGiftGridInfo[] = [];
        this.gridInfo.forEach((value: ActLuckyGiftGridInfo, id: number) => {
            list.push(value);
        });
        list.sort((infoA: ActLuckyGiftGridInfo, infoB: ActLuckyGiftGridInfo) => {
            return infoA.id - infoB.id;
        });
        return list;
    }

    public GetLuckyType(): number {
        return this.luckyGiftType;
    }
}

export class ActLuckyGiftLogInfo {
    date_time: number;
    item: BaseItemSlot;
    name: string;
    server_name: string;
}

export interface IActivityLuckyGiftFeature extends IFeatureCB {
    OnDrawGiftSucc(isChangeRound: boolean, rwd: BaseItemSlot[], drawIndex: number);
    OnOneKeyDrawSucc(oneKeyOpenResult: any);
}
export class ActivityLuckyGiftFeature extends ActFeature<IActivityLuckyGiftFeature>  {
    private luckyGiftInfoMap: Map<number, ActLuckyGiftInfo> = new Map();
    private hasPreviewRwdInfo: boolean = false;
    //todo 优化數據結構类
    private luckyGiftPreviewInfoMap: Map<number, any> = new Map();
    private luckyGiftLogListMap: Map<number, ActLuckyGiftLogInfo[]> = new Map();
    public GetLuckyGiftInfo(giftType: number) {
        HDebug.Assert(this.luckyGiftInfoMap.has(giftType), "九宫格数据里没有giftType为:" + giftType + "的数据");
        return this.luckyGiftInfoMap.get(giftType);
    }

    public HasRwdPreviewInfo(): boolean {
        return this.hasPreviewRwdInfo;
    }

    public GetLuckyGiftPreviewInfo(giftType: number) {
        HDebug.Assert(this.luckyGiftPreviewInfoMap.has(giftType), "九宫格奖励预览数据里没有giftType为:" + giftType + "的数据");
        return this.luckyGiftPreviewInfoMap.get(giftType);
    }

    public getLastLog(giftType: number): ActLuckyGiftLogInfo {
        if (!this.luckyGiftLogListMap.has(giftType)) {
            return null;
        }
        let list = this.luckyGiftLogListMap.get(giftType);
        if (!list || list.length < 1) {
            return null;
        }
        return list[list.length - 1];
    }

    public getLogInfo(giftType: number): ActLuckyGiftLogInfo[] {
        let list = this.luckyGiftLogListMap.get(giftType);
        return list;
    }

    private refreshLuckyGiftInfo(giftType: number, data) {
        let giftInfo = this.luckyGiftInfoMap.get(giftType);
        if (null == giftInfo) {
            giftInfo = new ActLuckyGiftInfo(giftType);
        }
        giftInfo.SetInfo(data);
        this.luckyGiftInfoMap.set(giftType, giftInfo);
    }

    private refreshLuckyGiftLog(dataArr) {
        if (dataArr && dataArr.length > 0) {
            for (let index = 0; index < dataArr.length; ++index) {
                let logData = dataArr[index];
                let type = Number(logData.luckyGiftType);
                let logList: ActLuckyGiftLogInfo[] = logData.list;
                if (logList && logList.length > 0) {
                    logList.sort((logA: ActLuckyGiftLogInfo, logB: ActLuckyGiftLogInfo) => {
                        return logA.date_time - logB.date_time;
                    });
                    this.luckyGiftLogListMap.set(type, logList);
                }
            }
        }
    }

    private onGetGiftInfo(msg) {
        let infoArr = GuardUtil.SafeReturn(msg, "a.ActiveHuoDong.lucky_gift_info");
        if (null != infoArr) {
            for (let index = 0; index < infoArr.length; ++index) {
                let info = infoArr[index];
                let type = Number(info.luckyGiftType);
                this.refreshLuckyGiftInfo(type, info);
            }
        }

        let logArr = GuardUtil.SafeReturn(msg, "a.ActiveHuoDong.lucky_gift_log");
        this.refreshLuckyGiftLog(logArr);
    }

    //获取抽奖信息 luckyGiftType:0代表获取2个抽奖数据
    ReqGetLuckyGiftInfo(luckyGiftType: number, cb?: Function) {
        MaskManager.getInstance().ShowMask(NetworkOp.LuckyGiftDraw);
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (msg, err) => {
            if (null == err) {
                this.onGetGiftInfo(msg);
                cb && cb();
            }
            else {
                HDebug.Error("请求pindex:" + pindex + "获取抽奖信息报错:" + err);
            }
            MaskManager.getInstance().HideMask(NetworkOp.LuckyGiftDraw);
        }
        new ErrFuncProto(proto_cs.huodong.smallGameGetLuckyGiftInfo)
            .DParam({
                act_id: pindex,
                luckyGiftType: luckyGiftType
            })
            .TimeOutCB(timeoutCB)
            .Callback(callBack)
            .Send();

    }

    //单次抽奖
    ReqDrawLuckyGift(luckyGiftType: number, drawIndex: number, gridID: number) { 
        MaskManager.getInstance().ShowMask(NetworkOp.LuckyGiftDraw);
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (msg, err) => {
            if (null == err) {
                this.onGetGiftInfo(msg);
                //let msgItem = GuardUtil.SafeReturn(msg, "a.msgwin.items");
                let openData = GuardUtil.SafeReturn(msg, "a.ActiveHuoDong.lucky_gift_open");
                this.InvokeAll("OnDrawGiftSucc", 1 == openData.is_pass, openData.rwd, drawIndex);
            }
            else {
                HDebug.Error("请求pindex:" + pindex + "单次抽奖报错:" + err);
            }
            MaskManager.getInstance().HideMask(NetworkOp.LuckyGiftDraw);
        }
        new ErrFuncProto(proto_cs.huodong.smallGameOpenLuckyGift)
            .DParam({
                act_id: pindex,
                luckyGiftType: luckyGiftType,
                id: gridID,
            })
            .TimeOutCB(timeoutCB)
            .Callback(callBack)
            .Send();

    }

    //查看奖励预览信息
    ReqGetLuckyGiftPreviewInfo(luckyGiftType: number, cb) {
        MaskManager.getInstance().ShowMask(NetworkOp.LuckyGiftDraw);
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (msg, err) => {
            if (null == err) {
                this.hasPreviewRwdInfo = true;
                let infoArr = GuardUtil.SafeReturn(msg, "a.ActiveHuoDong.lucky_gift_rwd");
                if (null != infoArr && infoArr.length > 0) {
                    for (let index = 0; index < infoArr.length; ++index) {
                        let info = infoArr[index];
                        let luckyType = Number(info.luckyGiftType);
                        this.luckyGiftPreviewInfoMap.set(luckyType, info.list);
                    }
                }
                cb && cb();
            }
            else {
                HDebug.Error("请求pindex:" + pindex + "查看奖励预览信息报错:" + err);
            }
            MaskManager.getInstance().HideMask(NetworkOp.LuckyGiftDraw);
        }
        new ErrFuncProto(proto_cs.huodong.smallGameGetLuckyRwdPreview)
            .DParam({
                act_id: pindex,
                luckyGiftType: luckyGiftType,
            })
            .TimeOutCB(timeoutCB)
            .Callback(callBack)
            .Send();

    }

    //一键抽奖
    ReqLuckyGiftOneKey(luckyGiftType: number) {
        MaskManager.getInstance().ShowMask(NetworkOp.LuckyGiftDraw);
        let pindex = this.m_activity.GetActID();
        let timeoutCB = () => { }
        let callBack = (msg, err) => {
            if (null == err) {
                this.onGetGiftInfo(msg);
                let oneKeyOpenResult = GuardUtil.SafeReturn(msg, "a.ActiveHuoDong.lucky_gift_batch_open");
                this.InvokeAll("OnOneKeyDrawSucc", oneKeyOpenResult);
            }
            else {
                HDebug.Error("请求pindex:" + pindex + "一键抽奖报错:" + err);
            }
            MaskManager.getInstance().HideMask(NetworkOp.LuckyGiftDraw);
        }
        new ErrFuncProto(proto_cs.huodong.smallGameBatchOpenLuckyGift)
            .DParam({
                act_id: pindex,
                luckyGiftType: luckyGiftType,
            })
            .TimeOutCB(timeoutCB)
            .Callback(callBack)
            .Send();

    }

}

//通用扎气球活动feature
export enum Activity_Lasso_RwdType {
    NotOpen = 0,
    Opened = 1,
}

export class Activity_Lasso_RwdItemData {
    id: number
    isSpecial: boolean
    state: Activity_Lasso_RwdType
    item: BaseItemSlot
    uid: number
}

export class Activity_Lasso_SpRwdData {
    id: number
    kind: number
    count: number
    maxcount: number
}

export class Activity_Lasso_PoolData {
    cur_num: number                         //剩余数量
    spItem: Activity_Lasso_SpRwdData[]      //大奖信息
    list: Activity_Lasso_RwdItemData[]      //奖池列表
    max_num: number                         //最大数量
    time: number                            //截止时间戳
    useItemId: number                       //使用道具信息
    ItemCost: number                        //单个套圈消耗道具数量
}
export interface IActivityLassoGameFeature extends IFeatureCB {
    onRefreshLassoData();
    onRespPlayLasso(boxId: number);
}

export class ActivityLassoGameFeature extends ActFeature<IActivityLassoGameFeature> {
    private poolData: Activity_Lasso_PoolData = new Activity_Lasso_PoolData();
    //发送套圈
	public reqOpenBox(boxId: number, successCB?: () => void) {
		new ErrFuncProto(proto_cs.huodong.smallGameFerrule)
			.DParam({ pindex: this.m_activity.GetActID(), id: boxId })
			.Callback((recv, errInfo) => {
				if (null == errInfo) {
					// ProxyManager.getInstance().floatRewardProxy.floatReward();
                    let LassoData = GuardUtil.SafeReturn(recv, "a.ActiveHuoDong.smallGame" + this.m_activity.GetActID() + ".ferruleData");
                    this.setPoolData(LassoData);
                    this.InvokeAll("onRespPlayLasso", boxId);
                    this.InvokeAll("onRefreshLassoData");
					successCB && successCB();
				}
                else {
                    //有报错的话重刷数据
                    this.reqGetInfo();
                }
			})
			.TimeOutCB(() => {   
			})
			.Send();
	}

    //一键套圈
    public reqOneKey(successCB?: () => void) {
        new ErrFuncProto(proto_cs.huodong.smallGameFerruleOneKey)
            .DParam({ pindex: this.m_activity.GetActID() })
            .Callback((recv, errInfo) => {
                if (null == errInfo) {
                    ProxyManager.getInstance().floatRewardProxy.floatReward();
                    successCB && successCB();
                }
            })
            .TimeOutCB(() => {   
            })
            .Send();
    }

    //获取套圈数据
    public reqGetInfo(successCB?: () => void) {
        new ErrFuncProto(proto_cs.huodong.smallGameFerruleGetData)
            .DParam({ pindex: this.m_activity.GetActID() })
            .Callback((recv, errInfo) => {
                if (null == errInfo) {
                    let LassoData = GuardUtil.SafeReturn(recv, "a.ActiveHuoDong.smallGame" + this.m_activity.GetActID() + ".ferruleData");
                    this.setPoolData(LassoData);
                    this.InvokeAll("onRefreshLassoData");
                    successCB && successCB();
                }
            })
            .TimeOutCB(() => {   
            })
            .Send();
    }

    //获取一键套圈道具配置
    public reqGetOneKeyInfo(successCB?: (data) => void) {
        new ErrFuncProto(proto_cs.huodong.smallGameFerruleGetAllItem)
            .DParam({ pindex: this.m_activity.GetActID() })
            .Callback((recv, errInfo) => {
                if (null == errInfo) {
                    let AllCfg = GuardUtil.SafeReturn(recv, "a.ActiveHuoDong.smallGame" + this.m_activity.GetActID() + ".ferruleAllCfg");
                    successCB && successCB(AllCfg);
                }
            })
            .TimeOutCB(() => {   
            })
            .Send();
    }

    //获取玩家信息
    public reqGetPlayerInfo(uid: number, successCB?: (userInfo) => void) {
        new ErrFuncProto(proto_cs.huodong.smallGameGetUserInfo)
            .DParam({ pindex: this.m_activity.GetActID(), uid: uid })
            .Callback((recv, errInfo) => {
                if (null == errInfo) {
                    let userInfo = GuardUtil.SafeReturn(recv, "a.ActiveHuoDong.smallGame" + this.m_activity.GetActID() + ".userInfo");
                    successCB && successCB(userInfo);
                }
            })
            .TimeOutCB(() => {   
            })
            .Send();
    }

    private setPoolData(data: Activity_Lasso_PoolData) {
        this.poolData.ItemCost = data.ItemCost;
        this.poolData.cur_num = data.cur_num;
        this.poolData.max_num = data.max_num;
        this.poolData.spItem = data.spItem;
        this.poolData.time = data.time;
        this.poolData.useItemId = data.useItemId;
        for(let i=0;i<data.list.length;++i) {
            let item = data.list[i];
            item.isSpecial = false;
            if(item.state == Activity_Lasso_RwdType.Opened) {
                for(let m=0;m<data.spItem.length;++m) {
                    if(item.item.id == data.spItem[m].id && item.item.kind == data.spItem[m].kind) {
                        item.isSpecial = true;
                    }
                }
            }
        }
        this.poolData.list = data.list;
        // this.poolData = data;
    }

    public getPoolData(): Activity_Lasso_PoolData {
        return this.poolData;
    }
}