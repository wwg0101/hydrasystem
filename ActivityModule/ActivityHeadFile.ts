import { ActivityType, FUser } from "../AppConstants";
import { Feature, FeatureSys } from "../Feature";
import { List } from "../HydraComponents/HydraList";
import { IProxyData, ListenerCB } from "../HydraProxy";
import { HydraProxy } from "../HydraProxyMgr";
import { LimitRankType } from "../LimitActivity/LimitRank/LimitRankHeader";

export enum ActivityState {
    Invalid,
    Closed,
    Showing,
    Opening,
}
export interface IActivityWatcherCB extends IFeatureCB {
    //活動狀態改變
    OnActStateChange(activity: IActivity, state: ActivityState);
}

export class HuoDong {
    // conf: { type: 5, maxRankId: 200 }
    // eTime: 1611324000
    // hid: 20
    // id: "888"
    // news: 0
    // pindex: 888
    // sTime: 1611072000
    // server: "all"
    // showTime: 1611417599
    // type: 6

    //conf: any;  // { type: 5, maxRankId: 200 }
    cfg_id: number;
    eTime: number;  // 1611324000//游玩最终时间点
    hid: number;  // 20
    id: string;  // "888"
    news: number;  // 0
    pindex: number;  // 888
    sTime: number;  // 1611072000
    server: string;  // "all"
    showTime: number;  // 1611417599
    type: ActivityType;  // 6
    rankType: LimitRankType[];
    crossType: number;  //大于0就是跨服
    show: number;   //不知道是啥
    sort_Val: number;   //排序的？
    title:string;           //活動名？

    //maxRankId: number;
    //uCircle: number;
    //isOpenChat: number;     // 是否开启聊天

    //scheduleType : string;  //可能為null，排期類型
}

export class HuoDongArea {
    myRid: any;
    list: any[];
}

export class CrossServerRankCOCInfo {
    COCName: string;
    COCIndex: number;
    rank: number;
    score: number;
}

export class CrossServerRankCOCPlayerInfo {
    cocName: string;
    name: string;
    rank: number;
    score: number;
    uid: number
}

export class CrossServerRankServerInfo {
    serverName: string;
    serverID: number;
    rank: number;
    score: number;
}

export class CrossServerRankPlayerInfo {
    serverName: string;
    isCOC: boolean;
    serverID: number;
    name: string;
    rank: number;
    score: number;
    uid: number
    userInfo: any;
}

export class CBHDShowRenderData {
    pindex: number;  // 888
    news: number;  // 红点
    sTime: number;  // 1611072000
    eTime: number;  // 1611324000//游玩最终时间点
    showTime: number;  // 1611417599
    rankType: LimitRankType[];
    crossType: number;  //大于0就是跨服
}

export class ActOneManFightData {
    monsterId: number;
    hp: number;
    totalHp: number;
    killInfo: FUser;
    damage: number;
    log: {name: string, damage: number}[];
    onLineList: FUser[];
    attackLog: {uid: number, damage: number}[];
}

export class ActOneManFightHeroCardData {
    fightType: ActOneManFightType;
    heroId: number;
    pindex: number;
    select: boolean;
}

//活动中单对单战斗配置 对应Cfg_ModuleFight
export class ActOneManFightCfg {
    FreeFightNum: number;   //免费出战次数
    FightMaxNum: number;    //总出战次数上限
    RecoverItemId: number;  //恢复出战次数道具ID
    RecoverNeed: number[];  //每次恢复所消耗的道具数量
}

export class ActOneManFightRankData {
    rank: number;
    name: string;
    damage: number;
}

export class ActOneManFightServantData {
    heroId: number;
    Power: number;      //总实力，服务器计算过各种加成后的数值
    FightNum: number[]; //已出战次数，对应ActOneManFightType
}

export class ActOneManFightServantData_Net {
    heroList: { [heroId: number]: number };         //实力
    heroAttackCount: {[heroId: number]: number[]}   //出战次数
}

//通用宝箱类型，用以对应ModuleBoxRwd表里的Type
export enum ActBoxType {
    Gold = 1,
    Silver = 2,
}

//通用选择排序类型 升序降序
export enum CommonSelectType {
    Lower = 1,      //降序排列
    Higher = 2,     //升序排列
}

export enum ActBoxOpenType {
    current = 1,        //当场打开宝箱
    review = 2,         //后来在别的界面打开宝箱
}

//用以读ModuleFight表中数组的第几项
export enum ActOneManFightType {
    Normal = 0,
    Boss = 1,
}

export enum ActOneManFightSceneActionType {
    Enter = 1,
    Exit = 2,
    Attack = 3,
}

export enum ActivityShowType {
    All = -1,                   //通用部分
    None = 0,                   // 0 - 無展示活動類型
    SimpleAct = 1,              // 1 - 簡易活動（月餅）
    ComposeAct = 2,             // 2 - 組合分解活動（食神大會）
    ShopAct = 3,                // 3 -（購物大會）
    NormalLimitAct = 6,         // 4 - 通用垃圾活動（燈會）
    StarLimit = 101,            // 101 - 特殊2合1合成活動（星宿）
    ShipLimit = 102,            // 102 - 特殊寶船活動
    Mahjong = 103,              // 103 - 雀圣活动
    StoneGambling = 104,        // 104 - 赌石
    Rich = 105,                 // 105 - 大富豪
    CocTrade = 106,             // 106 - 沙海贸易
    Discount = 107,             // 107 - 开服酬宾
    CombFruit = 108,            // 108 - 合成西瓜
    Game2048 = 109,             // 109 - 2048
    Mystery = 110,              // 110 - 大理寺（花石纲）
    Turkey = 111,               // 111 - 土耳其方块
    Game3KDraw = 233,           // 233 - 三国抽卡
    Corn = 112,                 // 112 -  啄玉米
    LinkMatch = 113,            // 113 - 名媛私厨
    CrossServerUFC = 123,       // 123 - 跨服擂台
    CrossServerParty = 124,     // 124 - 跨服宴会
    GameBubbleDragon = 125,     // 125 - 泡泡龙
    GameLinkMatch = 126,        // 126 - 连线消
    GameGoldMiner = 127,        // 127 - 黄金矿工
    GameSakura = 128,           // 128 - 千金樱花
    GameMonopoly = 129,         // 129 - 大富翁
    CallbackReunion = 130,      // 130 - 千金重聚（召回）
    CallbackReturn = 131,       // 131 - 千金归来（回归）
    CallbackStory = 132,        // 132 - 韶光浅忆
}

export enum LimitActivityPindex {
    None,

    CallbackStoryActivity = 6280,       //韶光浅忆
    CallbackReunionActivity = 6281,     //千金重聚（召回）
    CallbackReturnActivity = 6282,      //千金归来（回归）

    GameCornActivity = 9000,        //小鸡啄米
    GameLinkMatchActivity = 9001,   //连线消
    GameBubbleDragon = 9002,        //泡泡龙
    //
    GameGoldMiner = 9003,           //海滨垂钓
    GameSakura = 9004,              //千金樱花
    GameMonopoly = 9005,            //大富翁
    All,
}

export const LinkGame = {
    [LimitActivityPindex.GameCornActivity]: true,
    [LimitActivityPindex.GameLinkMatchActivity]: true,
    // [2333]: true,
    [LimitActivityPindex.GameBubbleDragon]: true,
    [LimitActivityPindex.GameGoldMiner]: true,
    [LimitActivityPindex.GameSakura]: true,
    [LimitActivityPindex.GameMonopoly]: true,
    [LimitActivityPindex.CallbackReturnActivity]: true,
    [LimitActivityPindex.CallbackReunionActivity]: true,
    [LimitActivityPindex.CallbackStoryActivity]: true,
   // [2333]: true,
}

export enum ActivityRwdState {
    WaitGet = 0,
    HasGet = 1,
    NotGet = 2,
};

//活动功能接口
export interface IIFeature {
    Init();
    OnDestroy();
    Bind(act: IActivity);
    //调用该功能下，所有回调对象的某个特定方法 【方法名，参数列表】
    InvokeAll(fName: string, ...params);
}
//功能方法合集
//如果要使用方法合集，请实现这个接口（可选）
export interface IActivityHelper {
    Bind(act: IActivity);
    Unbind();
    GetActivity(): IActivity;
}
//活动对象接口 - 一般不会需要手动调用
export interface IActivity {
    Init(actID: number);
    GetActID(): number;
    AddFeature<T extends IIFeature>(type: (new () => T));
    GetFeature<T extends IIFeature>(type: (new () => T)): T;
    GetMainFeature(): IMainFeature;
    OnDestroy();

    SetState(state: ActivityState);
    GetState(): ActivityState;
}

//活动通用UI类
export interface IUIActDailyTask extends IFeatureCB {
    onGetTaskData();
}
export interface IUIActSendGift extends IFeatureCB {
    onRespSendGift();
}
export interface IUIActGetGift extends IFeatureCB {
    onRespGetGift(items);
}
export interface IUIActGiftMission extends IFeatureCB {
    onRespGetGiftReward(giftId: number, rewardList: any[]);
}

export interface IUIOneManBattle extends IFeatureCB {
    onGetAttackLog(data);
    onGetOnLineList();
}

export interface IUIActTrade extends IFeatureCB {
    onRespTrade(data);
}

export interface IUIActBoxRwd extends IFeatureCB {
    onRespOpenBox(data);
}

export interface IHdActTimeCheckerFeature {
}

//用於檢查活動狀態相關的數據
export class ActCheckerData {
    pindex: number;
    type: ActivityType;
    sTime: number;
    eTime: number;
    showTime: number;

    constructor(pindex: number, type: ActivityType, sTime: number, eTime: number, showTime: number) {
        this.pindex = pindex;
        this.type = type;
        this.sTime = sTime;
        this.eTime = eTime;
        this.showTime = showTime;
    }
}

//功能回调
//todo 需要删除
export interface IFeatureCB { }
class ListenerSaver {
    type : any;
    id : number;
    constructor(t : any, id : number) {
        this.type = t;
        this.id = id;
    }
}

export class ActFeature<T extends IFeatureCB> extends Feature<T> implements IIFeature {
    protected m_activity: IActivity = null;
    public Init() { }

    public OnDestroy() {
        for(let i = 0; i < this.listenerID.length; ++i) {
            HydraProxy.StopListener(this.listenerID[i].type, this.listenerID[i].id);
        }

     }
    public Bind(act: IActivity) {
        this.m_activity = act;
    }

    private listenerID : List<ListenerSaver> = new List();
    protected AddListener<D extends IProxyData>(dataType : new() => D, func : ListenerCB<D>, dataKey ?: string) {
        let id = HydraProxy.AddListener(dataType, func, dataKey);
        this.listenerID.Add(new ListenerSaver(dataType, id));
    }
}

export interface IMainFeature extends IIFeature {
    onGetNetBaseData(data: HuoDong);
    onGetDetailData(netData);
    enterActivity();
}

//活动基类，功能容器
export class Activity extends FeatureSys<IIFeature> implements IActivity {
    private m_iActivityID: number = 0;
    public Init(actID: number) {
        this.m_iActivityID = actID;
        for(let i = 0; i < this.m_allComps.length; ++i) {
            this.m_allComps[i].Init();
        }
    }

    private mainFt: IMainFeature = null;
    public OnCreate<T extends IMainFeature>(mainFtType: new () => T) {
        this.AddFeature(mainFtType);
        this.mainFt = this.GetFeature(mainFtType);
    }
    public GetMainFeature(): IMainFeature { return this.mainFt; }

    //获取活动ID
    public GetActID(): number { return this.m_iActivityID; }
    public OnDestroy() {
        for(let i = this.m_allComps.length - 1; i >= 0; --i) {
            this.m_allComps[i].OnDestroy();
        }
        this.m_allComps.Clear();
    }
    //添加功能
    public AddFeature<T extends IIFeature>(type: (new () => T)) {
        super.AddFeature(type);
        let ft = this.GetFeature(type);
        ft.Bind(this);
    }

    private _state: ActivityState = ActivityState.Invalid;
    public SetState(state: ActivityState) { this._state = state; }
    public GetState(): ActivityState { return this._state; }
}

export class ActivityData {
    public static isMultipleCheck: boolean = false;//用于十连
    public static isSkipCheck: boolean = false;//用于是否跳过

    public static isSkipCheck_cook: boolean = false;//用于是否跳过
    public static isSkipCheck_discount: boolean = false;//用于是否跳过

    public static isShopActSkipCheck: boolean = false;//用于是否跳过
}

export interface IUIActGetReward extends IFeatureCB {
    onGetRwdData();
}

export class HuoDongMainData {
    clothe: any;
    clothe_state: any;
}