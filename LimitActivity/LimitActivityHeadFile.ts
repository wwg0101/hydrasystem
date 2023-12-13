import { LimitActivityPindex } from "../ActivityModule/ActivityHeadFile";
import { BaseItemSlot, FUser, ServerTaskType } from "../AppConstants";
import { Cfg_activeHDItem } from "../CfgConstants";

declare let localdb;

export class SendUIActData {
    pindex: number;
    actData: ActInfo;
    constructor(pindex, actData) { this.pindex = pindex; this.actData = actData; }
}


export class ActViewCfg {
    id: number;
    mainBg: string;
    mainIcon: string;
    mainBtnIcon: string;
    joinBg: string;
    joinSpine: string;
    animScale: number;
    animX: number;
    animY: number;
    simpleTxtIcon: string;
    simple_achieveTxt: string;
    simple_achieveAnimArray: string[];
    simple_otherShow: string;
}

export class ActInfo {
    awardCocState: LimitActAwardState;
    awardState: LimitActAwardState;// 2, // 奖励状态 0：待领取 1：已领取 2：不能领取
    score: number;// 0, // 活动积分
    item: { id: number, num: number }[];// [], // 道具购买情况 {"id":301, "num":5}  无 代表没有购买
    shop: { id: number, num: number }[];// [], //商品兑换情况 {"id":301, "num":5}
    bag: { id: number, num: number }[];// [], // 背包已有道具情况 {"id":301, "num":5}
    rwd: {
        id: number,
        rankStart: number,
        rankEnd: number,
        items: {
            id: number,
            count: number,
            kind: number
        }[]
    }[];
    cfg?;

    totalScore: number = 0;//全服积分
    box: number[] = [];//全服积分已领取的奖励列表
    //跨服分区信息
    crossList: string[];//分区ID

    //排行榜数据
    list: UserRid[];
    myRid: MyRid;
    cocList: any[];
    myCocRid: any;
}

export enum LimitActAwardState {
    canGet = 0,         //待领取
    hasGet = 1,         //已领取
    noTime = 2,         //不能领取（没有到结算时间）
    noCondition = 3,    //未入排名无法领取
}


class MyRid {
    rid: number;
    score: number;
    name: string;
}

class UserRid {
    rid: number;
    score: number;
    name: string;
    userInfo?: FUser;
}

export enum RewardState {
    CanGet = 0,//0：待领取
    HasGet = 1,//1：已领取
    NoGetOnNotTime = 2,//2：不能领取（没有到结算时间）
    NoGetOnNotRank = 3,//3：未入排名无法领取  
}

export enum HdActTaskState {
    CanGet = 0,//0：待领取
    HasGet = 1,//1：已领取
    NotGet = 2,//2：不能领取
}

export class HdActList {
    readonly [index: number]: HDActivityNetData;
}

//活动网络数据
export class HDActivityNetData {
    taskGet: TaskGet[]; //: [];// 任务情况
    myGiftList: MyGift[]; //: [];
    giftNum: number; //: 0;// 已赠礼次数 
    num: number; //: 0;// 星宿数量
    rwdGot: number[]; //: [1,2];// 星宿奖励领取情况
    items: { readonly [index: number]: number }; //: [];// 已抽到道具情况
    awardState: RewardState; //: 2; // 个人排行奖励领取情况
    awardCocState: RewardState; //: 2;// 商会排行奖励领取情况
    score: number;//分數
    rwdInfo: { readonly [index: number]: ActAchieveNetItem[] };//成就奖励配置
    // "taskGet": [],// 任务情况
    // "myGiftList": [// 赠礼进度和奖励领取情况
    //     {
    //         "giftId": 1, // 赠礼id
    //         "level": 0,  // 我已领取到奖励id
    //         "getNum": 10, // 玩家已领取人数
    //     }
    // ],
    // "giftNum": 0,// 已赠礼次数 
    // "num": 0,// 星宿数量
    // "rwdGot": [],// 星宿奖励领取情况
    // "items": [],// 已抽到道具情况     
    // "awardState": 2, // 个人排行奖励领取情况     
    // "awardCocState": 2,// 商会排行奖励领取情况     
}

export class ActAchieveNetItem {
    id: number;
    count: number;
    kind: number;
}

export class HDActivityCookNetData {
    taskGet: TaskGet[]; //: [];// 任务情况
    myGiftList: MyGift[]; //: [];//赠礼进度和奖励领取情况
    giftNum: number; //: 0;// 已赠礼次数 
    num: number; //: 0;// 集齐满汉全席次数
    rwdGot: number[]; //: [1,2];// 满汉全席领取情况
    rwdInfo: { readonly [index: number]: ActAchieveNetItem[] };//成就奖励配置
    items: { readonly [index: number]: number }; //: { "1": 0, "2": 0 }// 已抽到菜品道具情况
    chipNum: number; // 碎片数
    oneKeyLog: { [index: number]: number }// { "1": 1 } // 当前烹饪的菜品
    groupRwd: { readonly [index: number]: number }; //: { "1": 0, "2": 0 }// 组合奖励兑换情况
    awardState: RewardState; //: 2; // 个人排行奖励领取情况
    awardCocState: RewardState; //: 2;// 商会排行奖励领取情况
    score?: number; //: 0;// 食神積分，後台未添加
}

export class ActClotheClass {
    animal: number;         // 0
    background: number;     // 0
    body: number;           // 101
    ear: number;            // 0
    effect: number;         // 0
    head: number;           // 0
}

export class NetStarGiftUserInfo {
    uid: string;// "",
    level: number;// "",
    name: string;// "",
    sex: number;// "",
    clothe: ActClotheClass;// {},
    serverName: string;// "", // 服务器名称
    vip: number;
    titleList: number[]// [1,2,3],// 称号列表
}

export class NetActGiftWithType {
    endTime: number;//1, // 结束时间
    giftChat: string;//: 0, // 赠语
    giftId: number;//: 1, // 赠礼id
    type: number;//: 0, // 赠礼类型 0城盟赠礼 大于0对应的活动pindex
    userInfo: NetStarGiftUserInfo;
}
export class NetActGift {
    userInfo: NetStarGiftUserInfo;
    giftChat: string;// "赠语",
    giftId: number;// 1, // 赠礼id
    pindex: number;//活動類型
}

export interface IActGetGiftInfo {
    //getName(): string;
    //getLevel(): number;
    //getVip(): number;
    //getServerStr(): string;
    //getDesc(): string;
    //getClothe(): ActClotheClass;
    //getSex(): UserSex ;
    //getGiftId(): number;
    //getPindex(): number;
//
    //getTitles() : number[];
    //isPlayerShow(): boolean;
}

export class ActGetGiftInfo implements IActGetGiftInfo {
    //private netData: NetActGift = null;
    //private userInfo: NetStarGiftUserInfo;
    //private giftChat: string;// "赠语",
    //private giftId: string;// 1, // 赠礼id
    //constructor(netData: NetActGift) { this.netData = netData; }
//
    //getName(): string { return this.netData.userInfo.name;}
    //getLevel(): number { return this.netData.userInfo.level;}
    //getVip(): number {return this.netData.userInfo.vip}
    //getServerStr(): string { return this.netData.userInfo.serverName;}
    //getDesc(): string { return this.netData.giftChat; }
    //getClothe(): ActClotheClass {
    //    //this.netData.userInfo.clothe;
    //    return this.netData.userInfo.clothe;
    //}
    //getSex(): UserSex {
    //    return this.netData.userInfo.sex;
    //}
    //getGiftId(): number {
    //    return this.netData.giftId;
    //}
    //getPindex(): number {
    //    return this.netData.pindex;
    //}
    //getTitles() : number[] {return [];}
    //isPlayerShow(){ return false; }
}
export class ActGetGiftInfoWithPlayer implements IActGetGiftInfo {
    //private netData: NetActGiftWithType = null;
    //private userInfo: NetStarGiftUserInfo;
    //private giftChat: string;// "赠语",
    //private giftId: string;// 1, // 赠礼id
    //constructor(netData: NetActGiftWithType) { this.netData = netData; }
//
    //getName(): string { return this.netData.userInfo.name;}
    //getLevel(): number { return this.netData.userInfo.level;}
    //getVip(): number {return this.netData.userInfo.vip}
    //getServerStr(): string { return this.netData.userInfo.serverName;}
    //getDesc(): string { return this.netData.giftChat; }
    //getClothe(): ActClotheClass {
    //    //this.netData.userInfo.clothe;
    //    return this.netData.userInfo.clothe;
    //}
    //getSex(): UserSex {
    //    return this.netData.userInfo.sex;
    //}
    //getGiftId(): number {
    //    return this.netData.giftId;
    //}
    //getPindex(): number {
    //    return this.netData.type;
    //}
    //getTitles(): number[] { if(this.netData.userInfo.titleList != null) return this.netData.userInfo.titleList; }
    //isPlayerShow(): boolean { return this.netData.type <= 0; }
}



export class ActGiftMissionData {
    //giftId: number;     //赠礼id
    //rewardlevel: number;      //我已领取到奖励id
    //getNum: number;     //玩家已领取人数
    //pindex: LimitActivityPindex = null;
//
    //public getId() { return this.giftId; }
    //public getMissionId() { return this.giftId; }
    //public getnowProcess() { return this.getNum; }
//
    //private _cfg: Cfg_activeHDGiftProgressRwd;
//
    //private endTime: number = null;
    //private netData: MyGift = null;
    //constructor(task: MyGift) {
    //    this.pindex = task.pindex;
    //    this.giftId = task.giftId;
    //    this.rewardlevel = task.level;
    //    this.getNum = task.getNum;
    //    this.endTime = task.endTime;
    //    this.netData = task;
    //}
//
    //getNextCfg(): Cfg_activeHDGiftProgressRwd {
    //    let item = this.getCfg(this.pindex, this.rewardlevel + 1);
    //    return item;
    //}
//
    //getNowCfg() {
    //    let item = this.getCfg(this.pindex, this.rewardlevel);
    //    HDebug.Assert(null != item, "error item!!!!!!!");
    //    return item;
    //}
//
    //getEndTime() { return this.endTime; }
//
    //canGetReward(): boolean {
    //    let nextCfg = this.getNextCfg();
    //    if (null != nextCfg) {
    //        return this.getNum >= nextCfg.need;
    //    }
    //    else {
    //        return false;
    //    }
    //}
//
    //private getCfg(pindex: number, level:number): Cfg_activeHDGiftProgressRwd {
    //    let list: Cfg_activeHDGiftProgressRwd[] = ConfigFinder.FindGroupWithKey(localdb.table_activeHDGiftProgressRwd, "pindex", pindex);
    //    for (let i = 0; i < list.length; i++) {
    //        let item = list[i];
    //        if (item.level == level) {
    //            return item;
    //        }
    //    }
    //    return null;
    //}
}

export class TaskGet {
    get: number;//任务id
    id: HdActTaskState;// 领取情况 0：待领取 1：已领取 2：不能领取
    max: number;// 最大进度值
    set: number;// 当前进度值
}

export class MyGift {
    pindex: LimitActivityPindex;
    giftId: number;     //赠礼id
    level: number;      //我已领取到奖励id
    getNum: number;     //玩家已领取人数
    endTime: number;
}
export interface IActProxyComp { }

//活动任务内容
export class FullHDMission_Daily {
    pindex: LimitActivityPindex;
    id: number;
    isOpen: boolean;
    rewards: BaseItemSlot[];
    desc: string;
    needNum: number;
    curNum: number;
    hasTake: ServerTaskType;
    JumpTo: number;
    WeakGuideType: number;
    selectItem: string;
    subId: number;
}

//活动奖励
export class FullHDMission_Rwd {
    pindex: number;
    id: number;
    title: string;
    reward: BaseItemSlot[];
    needNum: number;
    hasTake: ServerTaskType;
    curNum: number;
}

//活动赠礼
export class FullHDMission_SendGift {
    endTime: number;
    title: string;
    desc: string;
    tip: string;
    targetNum: number;
    nowNum: number;
}

export class FullHDMission_GiftPack {
    playerId: number;
    desc: number;
    name: number;
    level: number;
}

export class ActHandBookData {
    cfg: Cfg_activeHDItem = null;
    canGet: boolean; //是否可以抽奖获得
    constructor(cfg: Cfg_activeHDItem) {
        this.cfg = cfg;
        this.canGet = 0 != cfg.rate;
    }
}

//活动主用道具Item类 如星宿的符石，厨神的菜肴
export class ActItemData {
    private Cfg: Cfg_activeHDItem = null;
    private ItemCount: number = null;
    constructor(cfg: Cfg_activeHDItem, ItemCount: number) {
        this.Cfg = cfg;
        this.ItemCount = ItemCount;
    }

    public getItemCount() : number{
        return this.ItemCount;
    }

    public getCfg() : Cfg_activeHDItem{
        return this.Cfg;
    }
}

export class ActItemComposeData {
    private ActItem: ActItemData = null;
    constructor(cfg: Cfg_activeHDItem, ItemCount: number) {
        this.ActItem = new ActItemData(cfg, ItemCount);
    }

    public getActItem() : ActItemData{
        return this.ActItem;
    }

}

export class SpecialActTabData { 
    id: number;
    name: string;
    news: number;
}

