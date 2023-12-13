//import FwUtils from "../fromework/FwUtils";
//import { LimitActivityPindex } from "./models/ActivityModule/ActivityHeadFile";

import { Cfg_ActivityLeiJiRwd } from "./CfgConstants";

//import { childCombFinishInfo } from "./models/Child/ChildHeadFile";
declare let i18n;

// 全局静态常量
export default class AppConstants { }

export enum DataType_new {
    NONE = 0,
    ITEM = 1,           //背包物品
    ENUM_ITEM = 2,      //属性资质等
    WIFE_LOVE = 3,      //
    WIFE_FLOWER = 4,
    BOOK_EXP = 5,
    SKILL_EXT = 6,
    HERO = 7,           //团队
    WIFE = 8,           //蓝颜
    WIFE_HAOGAN = 9,
    CHENGHAO = 10,
    HUODONG = 11,
    WIFE_EXP = 12,
    RULER = 20,          // 守护星
    PETTITLE = 21,          // 宠物称号
    HERO_SW = 90,
    ROLE_SW = 91,
    HERO_JB = 92,
    WIFE_JB = 93,
    HEAD_BLANK = 94,    //头像框
    CLOTHE = 95,        //服装
    JB_ITEM = 96,
    HEAD_HEAD = 97,     //头像
    TROPHY = 98,        //奖杯
    TUZI = 101,        //图纸
    WIFE_CARD = 151,      //蓝颜卡牌
    WIFE_CLOTHE = 195,      //蓝颜服装
    HERO_CLOTHE = 196,      //伙伴服装
    CHILDREN = 220,          // 萌宠
    CHILDREN1 = 221,          // 萌宠自动助手使用
    CHILDREN_CLOTHE = 230,          // 萌宠服装
    CHILDREN_SUIPIAN = 240,          // 萌宠碎片
    HERO_EP = 999,
    FURNITURE = 7140,         //家具
}

//export class LoginData {
//    account: string = "";
//    token: string = "";
//    game_id?: string;
//    oauth_token?: string;
//    channel?: string;
//}
//
export class BaseItemSlot {
    public count = 0;
    public id = 0;
    public kind?= 0;
}
//
////#region 各种类
//export class ItemSlotData extends BaseItemSlot {
//    public itemid = 0;
//}
//
//export class PetDirGetItemRenderData {
//    dirCfg;
//    awardState: PetDirAwardState = PetDirAwardState.NoComplete;
//}
//
//export class ThritySignItem {
//    constructor() { };
//    signState;      // 簽到狀態
//    signId;         // 簽到ID
//    signReward;     // 簽到獎勵
//    signSpecial;    // 特殊簽到
//    desc;           // 描述
//};
//
//export class ConfirmData {
//    constructor() { };
//    txt: string = "";
//    handler = null;
//    target = null;
//    itemId: number = 0;
//    count: number = 0;
//    color = null;
//    skip: string = "";
//    left: string = "";
//    right: string = "";
//    tipsKey: string = "";
//    max: number = 0;
//    isRightShow: boolean;
//    iconurl: string;
//    maxtipsKey: string;
//    mintipsKey: string;
//}
//
//export class CommonCostConfirmData {
//    private _itemId: CurrencyItem = null;
//    private _itemCostNum: number = null;
//    private _yesFunc: () => void = null;
//    private _noFunc: () => void = null;
//    constructor(costId: CurrencyItem, costNum: number, yesFunc: () => void, noFunc: () => void) {
//        this._itemId = costId;
//        this._itemCostNum = costNum;
//        this._yesFunc = yesFunc;
//        this._noFunc = noFunc;
//    }
//    public getItemId(): CurrencyItem { return this._itemId; }
//    public getItemCostNum(): number { return this._itemCostNum; }
//
//    private _title: string = null;
//    private _desc: string = null;
//    public setTitle(value: string) { this._title = value; }
//    public setDesc(value: string) { this._desc = value; }
//
//    public getTitle(): string { return this._title ? this._title : i18n.t("COMMON_COST_DEFAULT_TITLE"); }
//    public getDesc(): string { return this._desc ? this._desc : i18n.t("COMMON_COST_DEFAULT_DESC"); }
//
//    public sureFunc() { if (this._yesFunc) this._yesFunc(); }
//    public cancelFunc() { if (this._noFunc) this._noFunc(); }
//}
//
//export class UseItemViewOpenParam {
//    title: string = "";
//    descText: string = "";
//    // descTextPrefix:string = "";
//    // descTextSuffix:string = "";
//    // descChangeValue:number = 0;
//    itemID: number = 0;
//    minVal: number = 1;
//    maxVal: number = 99;
//    maxTipsKey: string = null;
//    minTipsKey: string = null;
//    confirmHandler: Function = null;
//    unitCost: number = 1;
//}
//
//export class AdaptPosViewOpenParam {
//    clickNodeInfo: {
//        nodeWorldPos: cc.Vec2,
//        nodeSize: cc.Vec2,
//    } = null;
//    data: any;
//    constructor(nodeWorldPos: cc.Vec2, nodeSize: cc.Vec2, data: any) {
//        this.clickNodeInfo = {
//            nodeWorldPos: nodeWorldPos,
//            nodeSize: nodeSize,
//        };
//        this.data = data;
//    }
//}
//
export class ActivityOpenTime {
    showTime: number = 0;
    startTime: number = 0;
    endTime: number = 0;
    constructor(showTime: number, startTime: number, endTime: number) {
        this.showTime = showTime;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
//
//export class BagTupoItemData {
//    CfgIDList: number[] = [];
//    needHeChengCfg: any[] = [];
//    minLV: number = -1;
//    maxLV: number = -1;
//    listIndex: number = 0;
//}
////#endregion
//
////#region  各种枚举
//export enum LoginState {
//    Logined,    //已登录
//    Logouts,    //已登出
//}
//
// export enum DataType {
//     NONE = 0,               //无
//     ITEM = 1,               //道具
// ENUM_ITEM = 2,          //枚举
// WIFE_LOVE = 3,          //红颜亲密
// WIFE_FLOWER = 4,        //红颜魅力
// BOOK_EXP = 5,           //门客书籍经验
// SKILL_EXP = 6,          //门客技能经验
// HERO = 7,               //门客
// WIFE = 8,               //红颜
// PARTY_TICKET = 9,       //宴帖
// DANYAO = 10,            // 丹药
// HUODONG = 11,           //活动道具
// WIFE_EXP = 12,          //红颜经验
// HERO_MEDICINE = 13,     //门客丹药
// BOOK = 14,              //书籍
// HERO_SKIN = 15,         //门客皮肤
// WIFE_SKIN = 16,         //红颜皮肤
// NEW_HERO = 17,          //策划和后台定了新的根据职业获得伙伴枚举是17
// NEW_WIFE = 18,          //策划和后台定了新的根据职业获得红颜枚举是18
// Xunfang = 20,           //寻访
// CHARACTER_HERO = 21,    //策划和后台定了新的根据性格获得伙伴枚举是21，11.11号确定是没有，请求优化
// CHARACTER_WIFE = 22,    //策划和后台定了新的根据性格获得红颜枚举是22，11.11号确定是没有，请求优化
// MONSTER = 56,           //用于卡牌数据类型：怪物
// HEAD = 80,              //头像id
// HEAD_FRAME = 81,        //头像框id
// BUBBLE = 82,            //气泡id
// TITLE = 83,             //称号id
// BADGE = 84,             //徽章id
// HERO_SW = 90,           //伙伴名声
// ROLE_SW = 91,           //自己名声
// HERO_JB = 92,           //伙伴羁绊
// WIFE_JB = 93,           //知己羁绊
// HEAD_BLANK = 94,        //头像框
// CLOTHE = 95,            //装备库
// JB_ITEM = 96,           //羁绊等级
// MAGIC = 98,             //内功
// HAOGAN = 107,           //紅顔好感度
// PET = 110,              //灵宠
// WESTLAKEITEM = 111,     //地牢物品
// WIFE_CLOTH = 112,       //红颜外装
// HERO_CLOTH = 113,       //伙伴外装
// WESTLAKE_SKILL = 114,   // 地宫技能组
// EVENT_EXP = 115,        //百业司事件经验
// HERO_EP = 999,          //随机增加某项属性
// SHUAIZHEN = 42, // 率真
// PANLI = 43, // 叛逆
// GUAO = 44, // 孤傲
//本地假类型分割线
// FakeItem = 99999,
// GuessLanternItem,       //灯会活动类型  itemID - 1 ~ 10 级灯笼
// StoneGamblingOriginStone,       //赌石活动原石类型  itemID - 1 ~ 10 级灯笼
// ManorFanRongIcon,       //庄园热度Icon
// }

export enum CurrencyItem {
    Diamond = 1,            //钻石
    Money = 3,              //资金
}
//
//export const FlyBagCurrencyItem = {
//    [CurrencyItem.ZHENGSHOU]: true,
//    [CurrencyItem.XiangNang]: true,
//    [CurrencyItem.SuanPan]: true,
//    [CurrencyItem.XiLianShi]: true,
//    [CurrencyItem.Wood]: true,
//    [CurrencyItem.YOULI]: true,
//    [CurrencyItem.ZhaoXianTie]: true,
//    [CurrencyItem.GUIHUAGAO]: true,
//    [CurrencyItem.PetRefreshSkillStone]: true,
//    [CurrencyItem.PetAwakeItem]: true,
//    [CurrencyItem.PetUpgradeItem]: true,
//}
//
//export enum ItemType {
//    NORMAL = 1,
//    WIFE_LOVE = 3,
//    WIFE_FLOWER = 4,
//    HERO_SKILL_EXP = 6,
//    HERO_PROP_UP = 7,
//    DANYAO = 10,
//    HUODONG = 11,
//    WIFE_SKILL_EXP = 12,
//    PROP_ADD = 13,
//    GIFT = 15,
//    COOK_ITEM = 100,
//    FOOD_ITEM = 101,
//    TREASURE_CLIP = 103,
//    TREASURE = 104,
//    TRUN_TABLE = 105,
//
//    PET_COMPOSE = 110,//守护万兽山相关合成用材料
//}
//
//export enum ItemTypeString {
//    User = "user",
//    Other = "other",
//    Hero = "hero",
//    PKEXP = "pkexp",
//    ZZEXP = "zzexp",
//    Wife = "wife",
//    FixWifeLove = "fixWifeLove",            // 指定红颜 固定亲密度
//    RandWifeLove = "randWifeLove",          // 指定红颜 随机亲密度
//    FixWifeFlower = "fixWifeFlower",        // 指定红颜 固定魅力值
//    RandWifeFlower = "randWifeFlower",      // 指定红颜 随机魅力值
//    LeiTaiGongXun = "ltgx",
//    Item = "item",
//    Base = "base",
//    List = "list",
//    FixHeroAttr = "fixHeroAttr",            // 指定英雄 固定属性
//    RandHeroAttr = "randHeroAttr",          // 指定英雄 随机属性
//    Drop = "drop",
//    RandHeroAttrSpec = "randHeroAttrSpec",  // 随机英雄 固定属性
//    RandHeroFixWexp = "randHeroFixWexp",    // 随机英雄 固定武道经验
//}
//
//export enum WifePillowType {
//    Random = 1,
//    YuanBao = 2,
//    Item = 3,
//}
//
//export enum AFKCheckEffect {
//    Finger = "AfkFinger",
//    BtnBlue = "BtnBlue",
//    BtnYellow = "BtnYellow",
//}
//
//export enum AnimPlayState {
//    Playing = "Playing",
//    Stop = "Stop",
//}
//
//export enum RankType {
//    POWER = 1,      //繁荣度
//    HERO = 2,       //伙伴总实力
//    HONGYAN = 3,    //红颜总亲密度
//    COC = 4,        //商会总繁荣度
//    UFC = 10,       //新擂台
//    HUNT = 11,      //狩猎
//    CHUANGGUAN = 12, //关卡进度
//    // WESTLAKE = 13,  //水牢
//    LIBRARY = 14,   //典籍
//    UFCALL = 15,    //擂台总榜（用于发布悬赏）
//
//    //跨服排行
//    CROSS_POWER = 31,  //跨服繁荣榜
//    CROSS_HERO = 32,   //跨服伙伴总实力
//    CROSS_HONGYAN = 33,   //跨服知己亲密度
//    CROSS_COC = 34,    //跨服商会总繁荣度
//
//    ROYALTRADE = 40,    //皇商
//    ROYALTRADE1 = 41,   //皇商-资质1排行
//    ROYALTRADE2 = 42,   //皇商-资质2排行
//    ROYALTRADE3 = 43,   //皇商-资质3排行
//    ROYALTRADE4 = 44,   //皇商-资质4排行
//    ROYALTRADE5 = 45,   //皇商-资质5排行
//}
//
//export enum RankServerType {
//    LOCAL = 1,      //本服
//    HDCROSS = 2,    //活动跨服
//    SYSCROSS = 3,   //系统跨服
//    ALL = 4,        //全服
//    AREA = 5,       //区域跨服
//}
//
//export enum CharacterType {
//    FuQi = 41,
//    ShuaiZhen = 42,
//    PanLi = 43,
//    GuAo = 44
//}
//
//和先连约定的任务状态
export enum ServerTaskType {
    CanGet = 0,     //可领取
    Got = 1,        //已领取
    NotFinish = 2,  //不可领取
}
//
//export enum BagTabType {
//    ITEM = 1,
//    HECHENG = 2,
//}
//
//export enum TabType {
//    HUOBAN = 1,
//    HONGYAN = 2,
//    DAOJU = 3,
//    TUPO = 11,
//    QITAHECHENG = 12,
//}
//
//export enum HeChengType {
//    TUPO = 1,
//    QITA = 2,
//    PET = 3,
//}
//
//export enum ClassifyType {
//    Other = 0,
//    RESOURCE = 1,
//    HERO = 2,
//    WIFE = 3,
//}
//
//export enum XunFangViewType {
//    Normal = 0,
//    JiangHu,
//    YunBiao,
//}
//
//export enum XunFangBtnType {
//    YouLi = 2, // 游历
//    XingXia = 1   // 行侠
//}
//
//export enum PetAddType {
//    Caiyun = 1,
//    Tili = 2,
//    Lingxing = 3,
//    Banlance = 4,
//}
//
//export enum BuildIndex {
//    // Hook : 1,        //武馆
//    Look = 2,           //游历
//    JiuLou = 3,         //青烛会
//    UFC = 4,            //擂台
//    Book = 5,           //书院
//    Pet = 6,            //灵宠
//    WestLake = 7,       //西湖水牢
//    Library = 8,        //典籍
//}
//
//export enum BuildSysRed {
//    Look = "XunFang_LBT_Reward",
//    JiuLou = "Jiulou_LBT_Reward",
//    UFC = "UFC_LBT_Reward",
//    Book = "Book_LBT_Reward",
//    Pet = "PetHome_LBT_Reward",
//    WestLake = "WestLake_LBT_Reward",
//    Library = "Library_LBT_Reward",
//}
//
//export enum ChargeActivityTabType {
//    None = 0,
//    Tehui = 1,
//    YuanBao = 2,
//    MeiRi = 3,
//    LeiJi = 4,
//    LeiTian = 5,
//}
//
//export enum CardType {
//    None = 0,
//    MonthCard = 1,
//    YearCard = 2,
//}
//
//// 红点枚举
export enum RedDotEvent {
    GamePowerRed_ = "GamePowerRed_",            //游戏体力红点
    GameCountRankRed_ = "GameCountRankRed_",    //游戏总分排行红点
    GameMaxRankRed_ = "GameMaxRankRed_",        //游戏单局排行红点
    GameCocRankRed_ = "GameCocRankRed_",        //游戏名媛会奖励红点
    GameLeiJiRwdRed_ = "GameLeiJiRwdRed_",      //游戏累计奖励红点
    GameBPRed_ = "GameBPRed_",                  //游戏BP奖励红点
    GameLuckyGift_ = "GameLuckyGift_",          //游戏BP奖励红点
    GameStageRwdRed_ = "GameStageRwdRed_",      //游戏成就奖励红点

    //连线消
    SMALL_GAME_2053_DAY_RWD = "SMALL_GAME_2053_DAY_RWD",                //连线消每日奖励红点
    SMALL_GAME_2053_BP_RWD = "SMALL_GAME_2053_BP_RWD",                  //连线消bp红点
    //泡泡龙
    SmallGameBubble_Power = "SmallGameBubble_Power",
    SmallGameBubble_TotalRwd = "SmallGameBubble_TotalRwd",
    //星辉展馆
    ExhibitionShop_Servant = "ExhibitionShop_Servant",
    ExhibitionShop_Soulmate = "ExhibitionShop_Soulmate",
    ExhibitionShop_Furniture = "ExhibitionShop_Furniture",
    ExhibitionShop_PreciousHero = "ExhibitionShop_PreciousHero",
    ExhibitionShop_PreciousWife = "ExhibitionShop_PreciousWife",
    //千金樱花
    SakuraRed_Egg = "SakuraRed_Egg",
    SakuraRed_Gift = "SakuraRed_Gift",
    SakuraRed_Power = "SakuraRed_Power",
    //巡梦环游
    GameMonopolyRed_CanGetGuiBao = "GameMonopolyRed_CanGetGuiBao",    //有可激活的瑰宝形象
    GameMonopolyRed_DreamLvRwd = "GameMonopolyRed_DreamLvRwd",        //名媛会筑梦等级升级后可领奖
    GameMonopolyRed_Lasso = "GameMonopolyRed_Lasso",                  //可套圈红点
    GameMonopolyRed_GiftBox = "GameMonopolyRed_GiftBox",              //可领取名媛会礼盒
    GameMonopolyRed_Invite = "GameMonopolyRed_Invite",                //云端漫游邀请红点
    GameMonopolyRed_Barricade = "GameMonopolyRed_Barricade",          //拦路红点
    GameMonopolyRed_Blocker = "GameMonopolyRed_Blocker",              //标记拦路者红点
    GameMonopolyRed_ClaimGive = "GameMonopolyRed_ClaimGive",          //索赠日志红点
    GameMonopolyRed_BuildStage = "GameMonopolyRed_BuildStage",        //游乐设施阶段奖励红点
    GameMonopolyRed_Badge = "GameMonopolyRed_Badge",                  //未领取徽章奖励，可点亮徽章
    GameMonopolyRed_BP = "GameMonopolyRed_bp",                        //bp红点
    GameMonopolyRed_Achieve = "GameMonopolyRed_Achieve",              //成就红点
    //回归召回
    CallbackRed_Gift = "CallbackRed_Gift",                            //千金重聚姐妹豪礼可领取红点
    CallbackRed_Check = "CallbackRed_Check",                          //千金重聚亲友卡账单可领取红点
    CallbackRed_Invite = "CallbackRed_Invite",                        //千金重聚绑定人数奖励可领取红点
    CallbackRed_ChargeBigRwd = "CallbackRed_ChargeBigRwd_",            //庄园信使红点
    CallbackRed_ChargeDailyTips = "CallbackRed_ChargeDailyTips_",            //庄园信使红点
}

//
//export enum ServerError {
//    PET_LIST_FULL_EMAIL = "PET_LIST_FULL_EMAIL",
//    APPLY_SUCCESS = "APPLY_SUCCESS",
//    COC_PERSON_FULL = "COC_PERSON_FULL",//商会满人
//    COC_HAVE_JOIN = "COC_HAVE_JOIN",//处理申请列表时 申请的玩家已经进入了别的商会
//    COC_USER_QUIT = "COC_USER_QUIT",//玩家已不在商会里
//
//    NEED_KILL_BOSS = "NEED_KILL_BOSS",//需要擊殺一次boss
//
//    HUNT_FIGHT_ERROR = "HUNT_FIGHT_ERROR",//兽神山战斗失败
//}
//
//export enum LimitConditionId {
//    // HookView = 1,//木桩升级条件不足情况
//    LuBanTang = 2,//鲁班堂解锁相关
//    LuShiChu = 3,//接取任务条件不足
//    ServantUpgrade = 4,//伙伴升级条件不足
//
//    HookView_Level = 5, //江湖地位不足(目前用于解锁商业街iconopen建筑身上)
//
//    MapBattle_Auto = 6, //无法自动走格子
//    PETUPGRADE_QualityLimited = 8, // 宠物升级品质不足提示
//    ServantLack = 9,        //缺少戰鬥伙伴
//    BusinessBuildUnlock = 10, // 商业街解锁建筑条件不足
//    EquipUnlockLimited = 11,  // 装备尚未解锁
//    BusinessCountLimited = 12,  // 经营值不足
//    SystargetLimited = 13,  // 系统目标不足
//    WifeShopSkillLimited = 14,  //知己技能加成不足
//    ServantPowerLimited = 15,       //伙伴實力不足
//    WifeExpLimited = 16,            //知己经验不足
//}
//
//export enum AnimationClipName {
//    MainScene_Close = "MainScene_close",
//    MainScene_Open = "MainScene_Open",
//}
//
//export enum ParamStr {
//    arenaUnlockHeroLevel = "arenaUnlockHeroLevel",
//    arenaUnlockHeroNum = "arenaUnlockHeroNum",
//}
//
///**
// * Fix 固定值 Rate 万分比
// */
//export enum AttrAddType {
//    Fix = 1,//固定值
//    Rate = 2, //万分比
//}
//
//export enum HeroSkillAddType {
//    Talent = 1,
//    Rate = 2,
//}
//
//export enum HeroSkillType {
//    NormalEPSkill = 1,          //普通天赋技能
//    DianXue = 2,                //典学技能
//    WuDao = 3,                  //武道技能
//    ProgressSkill = 4,          //精进解锁技能
//    HaloSkill = 5,              //光环衍生技能
//    ClothAureole = 6,           //服装光环
//    ClothSkill = 7,             //服装技能
//    OtherSkill = 8,             //副业技能
//    Halo = 999,                 //光环
//    BusinessSkill = 1000,       //商业街技能
//}
//
//export enum RelationType {
//    Wife = 1,       //伙伴对应的红颜列表
//    Relation = 2,   //红颜对应的伙伴列表
//}
//
// 性别
export enum UserSex {
    Male = 1,   // 男性
    FeMale = 2, // 女性
}

//短信聊天类型
export enum PhoneChatType {
    WifeChat = 1,   //蓝颜聊天
    FreeChat = 2,   //自定义头像icon和名字聊天
}
////伙伴属性
//export enum ServantPropType {
//    //AllRound = 1,//全能 - 客户端暂时没用
//    Finance = 2,//财力
//    Strength = 3,//体力
//    Intellect = 4,//智力
//    Power = 5,//武力
//    Skill = 6,//巧力
//    ALL = 1000,
//}
///**
// * 伙伴界面的页签枚举
// */
//export enum ServantFuncTabType {
//    Base = 1,
//    Talent = 2,
//    JueXue = 3,
//    Medicine = 4,
//    PET = 5,
//}
//
//export enum ServantGetType {
//    All,
//    Locked,
//    Unlocked,
//}
////羁绊状态枚举
//export enum JibanType {
//    AllUp = 0,      //已全部上阵
//    CanUp = 1,      //未全部上阵但可上阵（有羁绊涉及英雄并且空位足够）
//    NotCanUp = 2,   //不可全部上阵
//}
//
//// 装备类型
//export enum EquipType {
//    Sword = 1,          // 剑
//    Cloth = 2,          // 服装
//    HiddenWeapon = 3,   // 暗器
//}
//
//export enum ConditionTType {
//    None = 0,
//    Profession = 1,
//    MainCharacter = 2,
//}
//
//export enum DirectChargeType {
//    SALE = 1,       // 特惠
//    YUANBAO = 4,    // 商城元宝礼包
//}
//
////#region 懒人谷枚举
//export enum LazyBossHitType {
//    HitBoss = 0,
//    HitPlayer = 1,
//}
////#endregion
//
////#region 宠物
//
///**
// * 珍兽名錄獎勵狀態
// */
//export enum PetDirAwardState {
//    WaitingGet = 0, // 待領取
//    HasComplete = 1, // 已完成
//    NoComplete = 2, // 未完成
//}
///**
// * 珍兽名錄狀態
// */
//export enum PetDirState {
//    NotGet = 0, // 未獲得
//    GetNotActive = 1, // 已獲得未激活
//    GetActive = 2, // 已獲得已激活
//}
///**
// * 寵物與當前英雄的關係
// */
//export enum PetsTakeStateWithHero {
//    CurTake = 0, // 當前携帶
//    NotTake = 1, // 未携帶
//    HasTake = 2, // 已携帶
//}
//
///**
// * 寵物與當前英雄的關係
// */
//export enum PetsDisPatchStateWithFloor {
//    CurTake = 0, // 當前携帶
//    NotTake = 1, // 未携帶
//    HasTake = 2, // 已携帶
//}
//
///**
// * 城池类型枚举 删掉了兽栏
// */
//export enum PetCityType {
//    WeiYangLan = 1,
//    WanShowDaHui = 3,
//    ZhenShouMinLu = 4
//}
////#endregion
//
////#region storyview的枚举
//export enum RichTextEntityType {
//    ActorSay = 0,
//    NpcSay = 1,
//    PangBai = 2,
//    optionExplain = 3,
//}
//
//export enum RichTextStateType {
//    Null = -1,
//    IdleState = 0,
//    PlayState = 1,
//    DoublePlayState = 2,
//    ShowAllState = 3,
//}
////#endregion
//
////#region 宴会的枚举
//// 宴会类型(类型分类)
//export enum PartyType {
//    Unknown = 0,
//    // 普通宴会
//    Normal = 1,             // 家宴
//    Luxury = 2,             // 官宴
//    Level = 3,              // 青云宴 矿脉
//    Library = 4,            // 读书宴 典籍
//    Wife = 5,               // 花烛宴 知己
//    Giants = 6,             // 豪门宴
//    Official = 7,           // 百官宴
//    ActGiant = 8,           // 活动豪门宴
//    ActOfficial = 9,        // 活动百官宴
//
//    // 盛会
//    CityLord = 100,         // 城主宴
//    CityAlliance = 101,     // 城盟宴
//    CityHundred = 102,      // 百城宴
//
//    // 跨服盛会
//    CrossCityLord = 200,
//    CrossCityAlliance = 201,
//    CrossCityHundred = 202,
//
//    Older = 300,            // 千叟宴
//}
//
//export enum PartyCategory {
//    None = 0,
//    Friend = 1,             //亲友宴会
//    Own = 2,                //本服宴会
//    Cross = 3,              //跨服宴会
//}
//
//export enum PartyTicketType {
//    Study = 1,  // 学成宴
//    Guan = 2,   // 矿脉宴
//    Wife = 3,   // 花烛宴
//    ALL = 4,    // 所有宴
//}
//
//// 宴会服务枚举
//export enum PartyServiceType {
//    // Wine = 1,    //美酒助兴
//    Dance = 1,   //舞娘助兴
//}
//
//// 宴会酒菜
//export enum PartyFoodType {
//    Main = 1,    //主菜
//    Side = 2,    //配菜
//}
//
////#endregion
//
export enum ActivityType {
    Normal = 1, // 普通活动
    LimitActivity = 2, // 限时消耗活动
    AtListActivity = 3, // 冲榜活动
    RechargeActivity = 4, // 充值活动
    ExchangeAcivity = 5, // 兑换活动
    FullActivities = 6, // 全活动集合

    ActiveActivities = 8, // 活跃活动

    SEVEN_DAY_ID = 287, // 七日签到？？？？
}
//
//export enum ActivityCrossType {
//    All = 1,        //全部，不管单服还是跨服
//    Single = 2,    //单服
//    Cross = 3,      //跨服
//}
//
//export enum BoxRewardState {
//    waitGet = 0,    //待领取
//    hasGet = 1,     //已领取
//    notGet = 2,     //待完成
//}
//
//export enum BeatyState {
//    NotGet = "LOOK_WIFE_UNKNOWN", // 未相遇
//    MoSheng = "LOOK_WIFE_QINMI1", // 陌生
//    TanCheng = "LOOK_WIFE_QINMI2", // 坦诚
//    ShuXi = "LOOK_WIFE_QINMI3", // 熟悉
//    Get = "LOOK_WIFE_QINMI4",
//}
//
//export enum XunFangEventUnLockType {
//    BMAP = 1,
//    LEVEL = 2,
//    VIP = 3,
//}
//
////基金大类枚举
//export enum FundType {
//    NormalFund = 1,     //普通基金
//    BattlePass = 2,     //BP基金
//    FreeCharge = 3,     //零元购
//}
//
////基金类型枚举，根据funds表fundsOpen设定的，表改了这里也要改
//export enum FundCfgType {
//    Business = 1,       //繁荣度
//    Attr = 2,           //属性
//    Level = 3,          //城主等级
//    Wife = 4,           //知己
//}
//
////主线任务
//export enum MissionType {
//    MainTask = 1,       //主线任务
//    BookTask = 2,       //行侠手册
//    None = 3,           //两者皆无
//};
//
////三大资源 和EnumItem表对应
//export enum BaseResType {
//    Finance = 2, //财
//    Strength = 3, //体
//    Intellect = 4, //智
//    Power = 5,    //武
//    Skill = 6,    //巧
//    //最后还是因为需求加了All
//    All = 999,
//}
//
//// 新三大类型 20220117
//export enum BaseResourceType {
//    All = 1,     // 全能
//    Finance = 2,    // 财
//    Strength = 3,   // 体
//    Intellect = 4,  // 智
//    Power = 5,     // 武
//    Skill = 6,     // 巧
//}
//
//export enum ShopTabType {
//    Yuanbao = 1,
//    Normal = 2,
//}
//
//export class ConfirmNameInputViewData {
//    public NameLimit?: number;
//    public constItem?: [url: string, need: number];
//    public EditContent?: string;
//    public EditName: string;
//    public confrimCallback: (bool: boolean, Name: string) => void;
//}
//
//export enum RecruitState {
//    NotMax,             //没招募满
//    CurBuildLevelMax,   //当前建筑最大招募
//    ConfigMax,          //配置最大值
//}
//
//export enum ShopId {
//    MainShop = 1,       //海湾流市主商店
//    QingZhuShop = 2,    //青烛会商店
//    LazyVallyShop = 3,  //懒人谷商店
//    WestLakeShop = 4,   //水牢商店
//    UFCShop = 5,        //演武台商店
//    // HuntShop = 6,    //狩猎商店
//    COCShop = 7,        //商会商店
//    BPShop = 8,         //BP商店（不在坊市显示）
//    RestaurantShop = 9, //菜馆商店
//}
//
//// 社交装饰
//export enum SocialDecorType {
//    Head,           // 头像
//    Icon,           // 头像框
//    Pop,            // 聊天气泡
//    Title,          // 称号
//    Badge,          // 徽章
//}
//
//export enum DotDataType {
//    TotalServantLevel = 4,                  //伙伴总等级
//    BusinessTaskFinishedNum = 12,           //商业街事件次数
//    WifeYouHuiHistoryTimes = 17,            //红颜幽会次数
//    YouLiHistoryTimes = 23,                 //游历次数
//    TotalServantTalentLevel = 40,           //40 伙伴技能天赋总数值
//    TotalUseMedTimes = 69,                  //总服用丹药次数
//    TotalServantTalentValue = 83,           //83 伙伴天赋总数值
//    CollectMoneyHistoryTimes = 106,         //历史征收次数
//    WifeShopShillXiLian = 111,              //红颜商铺技能洗练次数
//
//    ShopScore = 132,                        //商店积分,类型非number
//
//
//    WenSchoolHistoryLearnTimes = 29,        //书院文曲院学习次数
//    WuSchoolHistoryLearnTimes = 31,         //书院武曲院学习次数
//    TotalServantBreak = 58,                 //伙伴总突破次数
//    MaxMineLevel = 64,                      //矿脉层数
//    MiningHistoryTimes = 65,                //采矿完成次数
//    MineBattleFailHistoryTimes = 67,        //矿脉战败
//    TotalServantJueXueLevel = 42,           //42绝学总等级
//    TotalRecruitNum = 103,                  //103总招募人数 
//    PaiQianZhangGuiShuLiang = 105,          //总派遣掌柜数量
//
//    TurnplateExchangeOServant = 127,           //觀星轉盤兌換X名橙色夥伴
//    TurnplateExchangeOWife = 128,              //觀星轉盤兌換X名橙色夥伴
//    ExchangeFourDevil = 129,                   //兌換X名四大惡人
//    ExchangeFourBeauty = 130,                  //兌換X名四大美人
//    ExchangeFourLazy = 131,                    //兌換X名四大懶人
//
//
//}
////#endregion
//
//export class ImgDate {
//    size: cc.Size;
//    scale: number;
//    worldPos: cc.Vec2;
//    public setDataByNode(node: cc.Node) {
//        this.size = cc.size(node.width, node.height);
//        this.scale = node.scale;
//        this.worldPos = FwUtils.getWorldPosition(node)
//    }
//    public setDataByParam(size: cc.Size, scale: number, worldPos: cc.Vec2) {
//        this.size = size;
//        this.scale = scale;
//        this.worldPos = worldPos;
//    }
//}
//
//// 装饰data
//export class SocialData {
//    decorType: SocialDecorType;
//    got: number;         // 1拥有 0没 number方便排序
//    isCur: number;       // 1当前 0没
//    headID: number;
//    headIconID: number;
//    popID: number;
//    titleID: number;
//    badgeID: number;
//    sex: number;             // 性别
//    name: string;
//    desc: string;
//    sort: number;           // 策划配的排序顺序
//    femaleName: string;
//}
//
//// 限时装饰data
//export class LimitSocialData extends SocialData {
//    eTime: number;
//}
//

//todo 直接踏馬過來的
// 玩家配件
export class IUserClothe {
    public get body() {
        if (this.curClotheID && this.curClotheID > 0) {
            return this.curClotheID;
        }
        else {
            return 101; //默认服装的ID为101
        }
    }; // 身体cfgId
    head: number; // 武器
    ear: number; // 暗器
    background?: number;
    effect?: number;
    animal?: number;
    clothes: { [clothID: number]: clothLvInfo };    //玩家解锁服装： clothid： clothLvInfo
    curClotheID: number;   //玩家当前穿戴服装ID
};

export class clothLvInfo {
    lv: number;
    add: number[][];
    time: number;       //服装到期时间, 0-永久服装
}

//export class MainTaskNetData {
//    id: number;
//    set: number;
//    max: number;
//    taskMainIsFinish: number;
//}
//

//todo 直接踏馬過來的 不知道問題
// 其他玩家信息 fuser
export class FUser {
    uid: number;
    name: string;
    level: number;
    sex: number;
    profession: number;
    exp?: number;
    vip: number;
    clothe: IUserClothe;
    headID: number;
    iconID: number;
    wifeNum: number;
    heroNum: number;
    wifeID: number;
    petID: number;
    allAttr?: number;
    heroAllAttr?: number;
    serverName?: string;
    popID?: number;
    bmap?: number;
    businessCount: number;
    mmap?: number;
    clubid?: number;
    clubname?: string;
    xuanyan?: string;
    isLike?: number;         // 1点赞 0踩 对我
    time?: number;            // 点赞时间
    likecount?: number;       // 繁荣度加成
    cocId?: number;            // 帮会id
    cocName?: string;           // 帮会name
    isFeast?: number;           //服务器增加了isFeast 字段 是否有宴会 1是 0否
    lastTime?: string;           //上次心跳交互时间
    badgeID?: number;
    badgeExpTime?: number;
    titleID?: number;
    titleExpTime?: number;
    clotheID: number;
}
//
////心跳 userAdok.json对应
//export enum HeartbeatType {
//    COC = "coc",
//    LazyBossView = "lazy_boss",
//    LazyBossRed = "lazyBossRed",
//    Business = "business",
//    Party = "flowersFloor",
//    Arena = "yamen",                //旧擂台 已废弃
//    WifePillow = "pillowTalkNum",   //红颜幽会
//    Library = "seatpow",            //典籍
//    School = "school",              //书院
//    Ships = "ships",                //宝船
//    Vistor = "vistor",              //拜访加成
//    Lushi = "lushi",                //錄事處
//    UFC = "challenge",              //新擂台
//    PenPal = "libraryFriend",       //寻访里的书友赠礼
//    Tax = "challengeTax",           //税金
//    ManorBag = "manorBag",          //仓库
//    MysteryFight = "mysteryFight",  //大理寺战斗的刷新
//    Mystery = "mystery",            //大理寺活动刷新
//    TradeFight = "tradeFight",      //沙海战斗中的刷新
//    Trade = "trade",                //沙海活动刷新
//    TradeMonster = "tradeMonster",  //沙海查询怪物列表
//    CrossUFC = "crossChallenge",    //跨服擂台心跳
//    RoyalTrade = "invest",          //皇商
//}
//
//export class HeartbeatCfg {
//    id: number;
//    label: string;
//    cdTime: number;
//}
//
//export class HeroBaseInfoData {
//    name: string;
//    quality: number;
//    spec: number;
//    level?: number;
//}
//
//export class WifeBaseInfoData {
//    name: string;
//    quality: number;
//    spec: number;
//}
//
//export enum TipsType {
//    Title,
//    Content,
//    Line,
//}
//
//export class WifeGoodNameCellData {
//    WifeId: number;
//    GoodNameLevel: number;
//}
//
//export class TipsData {
//    str: string = "";
//    color: cc.Color = cc.Color.WHITE.fromHEX("#FFFFFF");
//    fontSize: number = 40;
//    private lineHeightInit: boolean = false;
//    lineHeight: number = 42;
//    setText(text: string) {
//        this.str = text;
//    }
//    setColor(color: cc.Color) {
//        this.color = color;
//    }
//    setFontSize(fontSize: number) {
//        this.fontSize = fontSize;
//        if (!this.lineHeightInit) {
//            this.lineHeight = fontSize + 2;
//        }
//    }
//    setLineHeight(lineHeight: number) {
//        this.lineHeightInit = true;
//        this.lineHeight = lineHeight;
//    }
//}
//
//export interface ITipInfo {
//    getType(): TipsType;
//    getData(): TipsData;
//}
//
//export class LineTips implements ITipInfo {
//    getType(): TipsType {
//        return TipsType.Line;
//    }
//    getData(): TipsData {
//        return null;
//    }
//}
//
//export class LabelTipsInfo implements ITipInfo {
//    type: TipsType = TipsType.Content;
//    tipsData: TipsData = new TipsData();
//
//    public Text(text: string): LabelTipsInfo {
//        this.tipsData.setText(text);
//        return this;
//    }
//    public Color(color: string): LabelTipsInfo {
//        this.tipsData.setColor(cc.Color.WHITE.fromHEX(color));
//        return this;
//    }
//    public FontSize(fontsize: number): LabelTipsInfo {
//        this.tipsData.setFontSize(fontsize);
//        return this;
//    }
//    public LineHeight(lineHeight: number): LabelTipsInfo {
//        this.tipsData.setLineHeight(lineHeight);
//        return this;
//    }
//    public Type(type: TipsType): LabelTipsInfo {
//        this.type = type;
//        return this;
//    }
//
//    getType(): TipsType {
//        return this.type;
//    }
//    getData(): TipsData {
//        return this.tipsData;
//    }
//}
//
//export class CommonDescPanOpenParam {
//    private title: LabelTipsInfo = null;
//    private descArr: ITipInfo[] = [];
//    constructor(title: LabelTipsInfo) {
//        this.title = title;
//    }
//    public Insert<T extends ITipInfo>(tipType: new () => T): T {
//        let data = new tipType();
//        this.descArr.push(data);
//        return data;
//    }
//    public getTitle(): LabelTipsInfo {
//        return this.title;
//    }
//    public getDescArr(): ITipInfo[] {
//        return this.descArr;
//    }
//}
//
//export class ConfirmViewOpenParam {
//    content?: string;
//    fontSize?: number;
//    leftName?: string;
//    rightName?: string;
//    leftHandle?: Function;
//    rightHandle?: Function;
//    closeHandle?: Function;
//    btnFr?: number;
//    btnLayoutLeftToRight?: boolean;
//}
//
//export class ConfirmTitleViewOpenParam extends ConfirmViewOpenParam {
//    titleTxt: string;
//}
//
//export class userTitleInfo {
//    titleID: number;
//    titleExpTime: number;
//    constructor(titleID, titleExpTime) {
//        this.titleID = titleID;
//        this.titleExpTime = titleExpTime;
//    }
//}
//
//export class userBadgeInfo {
//    badgeID: number;
//    badgeExpireTime: number;
//    constructor(badgeID, badgeExpireTime) {
//        this.badgeID = badgeID;
//        this.badgeExpireTime = badgeExpireTime;
//    }
//}
//
//// 聊天频道
//export enum ChatMsgChannel {
//    MAIN = 0,           // 主频道 包含普通、商会、跨服、系统
//    NORMAL = 1,         // 普通
//    COC = 2,            // 商会
//    CROSS_SERVER = 3,   // 跨服
//    SYS = 4,            // 系统
//    PMD = 5,            // 跑马灯 暂无用
//    ACTIVITY = 6,       // 活动
//    FUN = 7,            // 功能 ChatFunType
//}
//
//export enum ChatFunType {
//    LIBRARY = 1,                    // 典籍
//    FLOWERSFLOOR = 2,               // 万花楼
//    CHALLENGE = 3,                  // 擂台
//    LAZYBOSS = 4,                   // 懒人谷
//    ROYALTRADE = 5,                 // 皇商
//}
//
//// 聊天条样式
//export enum ChatPanelStyle {
//    SINGLELINE = 0,          // 单行
//    TWICELINE = 1,           // 两行
//}
//
//// 一条聊天基本数据
//export class IChatInfo {
//    index: number;
//    time: number;               // 消息时间
//    // channel: ChatMsgChannel; // 消息频道
//    msg: string;                // 消息内容
//    type: number;               // 消息类型
//    paramList: number[];        // 参数列表
//    msgStr: string;             // 去掉param的消息内容
//    user?: FUser;
//    isSys?: boolean;            // 是否系统 根据user uid是否空
//    isSelf?: boolean;           // 是否自己
//    channel?: ChatMsgChannel;   // 消息频道
//    pIndex?: number;            // 限时活动id (活动聊天专属)
//    p?: any;
//}
//
//// 聊天组合参数
//export class ChatParam {
//    channel: ChatMsgChannel;
//    type: (LimitActivityPindex | ChatFunType);
//    index?: number;                 // 聊天递增index 服务器发的
//    withBottom: boolean = false;
//
//    constructor(channel: ChatMsgChannel, type: LimitActivityPindex | ChatFunType, index?: number) {
//        this.channel = channel;
//        this.type = type;
//        this.index = index;
//    }
//    setWithBottom(b) {
//        this.withBottom = b;
//    }
//}
//
//export enum StageNextType {
//    chat = 0,
//    choose = 1,
//    smallGameChoose = 2,
//    weakGuide = 3,
//    // justGoSmallGame = 3
//}
//
//export enum ModuleChooseType {
//    NetWork = 1,    //走格子
//    LuShiChoose = 2, //录事处
//    Single = 3,     //走格子支线
//    BusinessStreet = 4, //商业街
//    JinSheng = 5, //晋升剧情
//    YouLi = 6, //游历剧情
//}
//
//export class ServanShowOpenParam {
//    type; // 类型红颜 / 英雄
//    heroId; // 英雄 id
//    callback; // 回调函数
//    callbackAfterRollback;//rollback之后调的回调
//};
//
//export var ServanShowHeroType = {
//    Beaty: "wife",
//    Hero: "partner",
//    Pet: "pet",
//    Cloth: "cloth",
//}
//
//export enum DissloveDir {
//    up = 0, // 向上
//    down = 1, // 向下
//    left = 2, // 向左
//    right = 3, // 向右
//}
//
//export enum storyEnum {
//    CreateRole = "CreateRole",
//    QTE = "QTE",
//    Fight = "Fight",
//    StoryRecord = "StoryRecord",
//    StorySectionRecord = "StorySectionRecord",
//    GuideUI = "GuideUI",
//    JibanDetil = "JibanDetil",
//    LaborDay = "LaborDay",
//    LookView = "LookView",
//    MainView = "MainView",
//    ServantHeroStory = "ServantHeroStory",
//    ServantView = "ServantView",
//    SystemStory = "SystemStory",
//    Wife = "Wife",
//    ZhenWu = "ZhenWu",
//    lubantang = "lubantang",
//    mapBattle = "mapBattle",
//    TimeProxy = "TimeProxy",
//}
//
//export enum storyTablesEnum {
//    story2 = "story2_",
//    bigPve = "bigPve_",
//    midPve = "midPve_",
//    story3 = "story3_",
//    story4 = "story4_",
//    story5 = "story5_",
//}
//
//export enum LazyBossSubscribeState {
//    Locked,
//    NoSubscribe,
//    SubscribedNoAuto,
//    SubscribedAuto,
//}
//
///**
// * itemShowGroup表 对应的枚举
// */
//export enum ItemShowGroupType {
//    ServantMed = 1,
//    WifeSendGift = 2,
//    BagWife = 3,
//}
////登录相关
//export class Account {
//    public account = "";
//    public password = "";
//
//    constructor() { }
//}
//
//// 服务器状态
//export enum ServetState {
//    NORMAL = 1,             // 正常
//    // BUSY = 2,               // 拥挤
//    FULL = 3,               // 爆满
//    // QUEUE = 4,              // 排队
//    NEW = 5,                // 新服
//    PEPAIR = 6,             // 维护
//    PRE = 7,                // 预上线
//    PRE_REPAIR = 8,         // 预维护
//    HUIDU = 9,              // 灰度
//}
//
//export class ServerInfo {
//    he: number;
//    id: number;
//    name: string;
//    showtime: number;
//    skin: number;
//    state: ServetState;
//    url: string;
//}
//
//export class ServerQuData {
//    name: string = "";
//    list: ServerInfo[] = [];
//    minID: number = 0;
//    maxID: number = 9999;
//    sortNum: number = 1;
//    constructor(name: string, minID: number, maxID: number) {
//        this.name = name;
//        this.minID = minID;
//        this.maxID = maxID;
//    }
//
//    public setSortNum(sortNum: number) {
//        this.sortNum = sortNum;
//    }
//}
//
//export class ShopBuyCountData {
//    count: number;
//    price: number;
//}
//
//export enum WeakGuideTypeEnum {
//    SysTargetMainViewGuide = 9993,
//}
//
////用于判断针对性礼包开启
//export enum CBActivity {
//    HongYanMeiLi = 258,
//    YanHuiJiFen = 256,
//    DianJiYanDu = 267,
//    LeiTaiJiFen = 254,
//    HuoBanShiLi = 252,
//}
//
//export enum MarketGiftNeedItem {
//    WOOD = 254,
//    MONEY = 2,
//    PETFOOD = 3,
//    FOOD = 4,
//    PETCOIN = 15,
//    STARCOIN = 26,
//    PARTYFOOD = 141,
//    WIFEFLOWER = 93,
//    BOOKFOOD = 73,
//    BATTLEBOOK = 125,
//    YOULIMAP = 72,
//    WIFELOVE = 91,
//    YOUHUIPAPER = 71,
//    EVOLVEMEDICINE = 100201,
//    CBDLETTER = 375,
//    RESTAURANTFOOD = 501,
//}
//
////美人图兑换
//export class WifeClothExchangeInfo {
//    clothID: number;
//    endTime: number;
//}
//
////伙伴光环
//export enum ServantSkillType {
//    aureole = 1,
//    speciality = 2,
//}
//
//export class ServantSkillInfo {
//    skillID: number;
//    skillType: number;
//    skillKind: ServantSkillType;
//    skillLv: number;
//    heroID: number;
//}
//
//// 月卡拍脸图类型
//export enum MonthlyCardPopType {
//    Month = 1,
//    Year = 2,
//    BP = 3,
//    Fund = 4,
//    FreeCharge = 5,
//}
//
////伙伴基本界面伙伴技能标签
//export enum ServantSkillTabType {
//    businessSkill,
//    speciality,
//    aureole,
//    wife,
//}
//
////礼包类型
//export enum MarketGiftType {
//    smallGift = 1,
//    bigGift = 2,
//}
//
////商铺产速加成相关
//export enum businessProBaseType {
//    recruitAdd = 1,
//    heroBaseAdd = 2,
//    manorAdd = 3,
//}
//
//export enum businessProType {
//    levelAdd = 1,
//    heroAdd = 2,
//    petMapAdd = 3,
//    cocAdd = 4,
//    cbdAdd = 5,
//    cocSkillAdd = 6,
//    equipAdd = 7,
//    wifeSkillAdd = 8,
//    westLakeAdd = 9,
//    manorAdd = 10,
//}
////用于通用确认打钩
//export enum ConfirmString {
//    Discount_UseShow = "Discount_UseShow",
//    COCTenDonate = "COCTenDonate",
//    COCDonateConfirm = "COCDonateConfirm",
//    UpgradeWifeSkill = "UpgradeWifeSkill",
//    UpgradePetSkill = "UpgradePetSkill",
//}
//
//export class GMEvent {
//    public static GMEvent_SetGuideState: string = "GMEvent_SetGuideState";
//    public static GMEVent_SetGMFouces: string = "GMEVent_SetGMFouces";
//}
//
//export interface IGmOpeator {
//    id?: number,
//    funcType?: string,
//    funcName?: string,
//    param1?: string,
//    param2?: string,
//    param3?: string,
//    param4?: string,
//}
//
////典籍入驻商铺相关信息
//export class businessCompleteData_BuildData {
//    v: number;  //加成数值
//    c: number;  //上阵典籍数量
//}
//
////相关数据可以看https://www.yuque.com/chenliang-cmq8b/kb/slx4u8；
//export class businessCompleteData {
//    buildData: Map<number, businessCompleteData_BuildData>;
//    record: Map<number, childCombFinishInfo[]>;
//}
//
////典籍研读奖励的道具ID，道具ID改了打策划
//export enum readBookRwdID {
//    money = 62,
//    petFood = 63,
//    food = 64,
//    power = 67,
//    skill = 68,
//    random = 66,
//}
//
//export class Lazy_RwdInfo {
//    playerInfo: FUser;
//    rank: number;
//    rwd: BaseItemSlot[];
//}
//
//export class Lazy_emenyInfo_player {
//    playerInfo: FUser;      //敌人信息
//    maxHP: number;          //敌人最大生命值
//    nowHP: number;          //敌人剩余生命值
//    ownScore: number;       //敌人携带令牌数
//}
//
//export class Lazy_deadInfo {
//    killerName: string;             //击杀自己的人的名字
//    killerServer: string;           //击杀自己的人所在的服务器
//    loseScore: number;              //丢失令牌
//    rebornTime: number;             //复活时间
//}
//
//export enum CrossServerEvt {
//    library = 1,
//    flowersFloor = 2,
//    challenge = 3,
//    lazyBoss = 4,
//    royalTrade = 5,
//}
//export class crossSystemInfo {
//    systemid: CrossServerEvt;
//    b: number;  //基准服
//    list: Map<string, string>;    //跨服列表 serverID: serverName
//}
////主角服装加成类型
//export enum userClothAddType {
//    wifeAdd = 1,
//    heroAdd = 2,
//}
//
//export enum userClothWifeAdd {
//    MeiLi,
//    QinMi,
//}
//
////系统目标任务进度条类型
//export enum sysTargetProgressType {
//    normal = 1,     //通常
//    servant = 2,    //伙伴
//    shop = 3,       //商铺
//}
//
////BP商店道具
//export class BPShopItemData {
//    condition: number;
//    conditionNum: number;
//    conditionType: number;
//    count: number;
//    curr_price: number;
//    currency: number;
//    discount: number;
//    goods_id: number;
//    is_limit: number;
//    item_id: number;
//    item_type: number;
//    kind: number;
//    limit: number;
//    marketing_talk: number;
//    maxNum: number;
//    price: number;
//}
//
////购买条件限制类型
//export enum BuyConditionType {
//    NoLimit = 0,        //无限制
//    Vip = 1,            //vip等级
//    Level = 2,          //玩家等级
//    COC = 3,            //商会等级
//    DayScore = 4,       //每日积分限制-活动商店才用，坊市如果用就打死昌昊
//    Score = 5,          //总积分限制
//}
//
////购买限购类型
//export enum BuyLimitType {
//    NoLimit = 1,        //不限购
//    DayLimit = 2,       //日限购
//    MonthLimit = 3,     //月限购
//    ForeverLimit = 9,   //永久限购
//}
//
////1.21改动后商品类, 支持线性涨价
//export class NewShopItem {
//    goods_id: number;           //商品id
//    item_id: number;            //道具id
//    kind: number;               //道具kind
//    count: number;              //一组商品的个数
//    item_type: number;          //货币类型
//    currency: number;           //货币id
//    price: number;              //原价
//    limitType: BuyLimitType;    //限购类型
//    limit: number;              //限购次数
//    bought: number;             //已购买次数
//    consumeInc: number;         //购买递增值
//    buyType: BuyConditionType;  //购买条件类型
//    buyVal: number;             //购买条件目标值
//    buyValUser: number;         //购买条件当前值
//    havemoney: number;          //对应货币当前拥有值
//    shopid: ShopId;             //对应的商店
//}
//
////珍兽觉醒方式
//export enum PetAwakeWay {
//    petItem,
//    normal,
//}
//
////宝藏下层状态
//export enum TreasuryNextState {
//    noEnd,
//    floorEnd,
//    allEnd,
//}
//
////宝藏消耗道具方式
//export enum TreasuryCostItemType {
//    static = 1,     //固定消耗,目前暂定为1
//    withFloor = 2,  //与层数线性相关，目前等于层数
//}
//
//// 懒得贸易状态
//export enum BusinessTradeStatus {
//    Ready,
//    Trading,
//}
//
//// 客户端自己做的每天刷新的红点
//export enum ClienDaylyRed {
//    RED_WEIBO = "red_weibo",
//    RED_WECHAT = "red_wechat",
//    RED_H5_GOONLUE = "red_h5_gonglue",
//    RED_H5_CHILD = "red_h5_child",
//    RED_WECHAT_SHOP = "red_wechat_shop",
//}

export interface ICrossSeverData {
    servid,
    server_name,
}

export enum SmallGameRankRwdType {
    MaxRank = 1,    //单局分数排行
    CountRank = 2,  //总分排行
}

//1正常 2预览
export enum ServantClotheShowType {
    Normal = 1,
    Preview = 2,
}

export enum RwdState {
    CanGet = 0,    //0 可领取 
    NotFinished = 1,    //1 未达成
    Got = 2,    //2已领取
}

export enum StageRwdState {
    CanGet = 0,         //0 可领取
    Got = 1,            //2 已领取
    NotFinished = 2,    //1 未达成
}

export class ActivityLeiJiRwdData {
    curScore: number;
    cfg: Cfg_ActivityLeiJiRwd;
    status: RwdState;
}

export enum ChangeMultLimitType {
    score = 1,
    vip = 2,
}

//老活动相关

export class WBNetData_shop {
    id: number;
    is_limit: number;
    items: { kind: number, id: number, count: number };
    limit: number;
    need: {
        id: number;
        count: number;
    }
}

export class WBNetData_shop_goldMiner extends WBNetData_shop {
    dayMaxLimit: number;
}

//弹窗型排行榜相关数据
export class RankData_pop {
    title: string;
    scoreTitle: string;
    rankList: any;
    myRank: number;
    myScore: number;
    myScoreTips: string;
    isCrossServer: boolean;
}

//排行榜相关
export enum RankType {
    personTotal,
    personSingle,
    person,
    club,
    team,
    school,
}

export class clubRankNetData {
    cid: number;
    club_shili: number;
    exp: number;
    family_card: string;
    fund: number;
    icon: number;
    leaders: Map<number,number>;
    level: number;
    members: string;
    name: string;
    name_color: number;
    num: number;
    president_clothe: presidentClotheInfo;
    president_name: string;
    president_uid: number;
    president_vip: number;
    president_wx: string;
    qq_group: string;
    rid: number;
    server_id: number;
    server_name: string;
}

//进入通用排行榜界面所需的数据
export class RankViewInfo {
    personRankInfo: rankInfo<userRankNetData>;
    personSingleRankInfo: rankInfo<userRankNetData>;
    clubRankInfo: rankInfo<clubRankNetData>;
    teamRankInfo: rankInfo<any>;
    schoolRankInfo: rankInfo<any>;
    isCrossServer: boolean;
    rankTypeList: RankType[];
    changeID?: number;
    actID?: number;
    extra?: any;
}

export class rankInfo<T> {
    scoreTitle: string;
    rankList: T[];
    myRank: number;
    myScore: number;
    myScoreEx: number;
    maxRid: number;
    myStar: number;
    type: number;
}


export class RankRwdViewInfo {
    personRwd: rankRwdInfo;
    personSingleRwd: rankRwdInfo;
    clubRwd: rankRwdInfo;
    teamRwd: rankRwdInfo;
    schoolRwd: rankRwdInfo;
    rankTypeList: RankType[];
    endTime: number;
    coundDownCallback: Function;
    changeID?: number;
    extra?: any;
}

export class rankRwdInfo {
    rwdList: any[];
    reddot: string[];
    rank: number;
    score: number;
    num: number;
    score_type: number;
    scoreTitle: string;
    numTitle: string;
    extra: string;
    maxRid: number;
    getType: rwdGetType;
    getCallback: Function;
}
export enum rwdGetType {
    noTime,     //时间未到
    hasGet,     //已领取
    canGet,     //可领取
    timeEnd,    //时间已过
}

export class giftRwdInfo {
    title: string;
    rwd: BaseItemSlot[];
    bonus: BaseItemSlot[];
}

//通用排行榜玩家数据结构  暂时写在这里
export class userRankNetData {
    id: number;
    uid: number;
    name: string;
    sex: UserSex;
    level: number;
    vip: number;
    clothe: Map<number, number>;
    headavatar: playerHeadAvatarInfo;
    clothe_State: number;
    title: playerTitleInfo;
    lastlogin: number;
    server_id: number;
    server_name: string;
    on_title_id: number;
    on_pet_title: any;
    birthday: string;
    individuality_sign: string;
    favourite_suit: number;
    favourite_wife_id: number;
    favourite_hero_id: number;
    name_color: number;
    rid: number;
    num: any;
    o_num: any;
    is_kua: number;
    star: number;
    self_score: number;
    score_type: number;
    school_id: number;
    frame:number;
}

export class presidentClotheInfo {
    clothe_state: number;
    clothes: Map<number,number>;
    clothes_create: any[];
}
export class playerHeadAvatarInfo{
    head: number;
    blank: number;
    bubble: number;
}

export class playerTitleInfo {
    own_title_list: any[];
    on_title_id: number;
}

export class userRankInfo {
    data: userRankNetData;
    //下面是纯客户端展示用的
    socreFDesc: string;     //分数文本前缀  例："+" 对应 +16
    scoreEDesc: string;     //分数文本后缀  例："+" 对应 16+
    isKua: boolean;         //是否跨服
}

export class wifeClotheInfo {
    unlock: number;
    clothes_id: number;
    clothes_level: number;
}

//商店兑换item信息
export class shopExchangeItemNetData {
    id: number;
    buyCount: number;
    closeSetting: number;
    dc: string;
    fun_open: string;
    groupid: string;
    icon: string;
    isdisplay: string;
    itemShow: number;
    items: BaseItemSlot[];
    kind: number;
    limit: number;
    lv: number;
    moneyType: number;
    name: string;
    need: any;
    needAdd: string;
    needSale: BaseItemSlot;
    remark: string;
    resetting: number;
    showSetting: number;
    sn: number;
    superValue: string;
    time: number;
    type: number;
}

//集团商店兑换信息
export class groupShopItemNetData {
    id: number;
    buy: number;
    items: BaseItemSlot;
    limit: number;
    need: BaseItemSlot;
    sort: number;
    tab: number;
    type: number;
    unlock: number;
}

export class clubMemberInfo {
    name: string;
    vip: number;
    name_color: string;
    shili: number;
    level: number;
    headavatar: playerHeadAvatarInfo;
    uid: number;
    online: boolean;
    logout_time: number;
    position: number;
}

export class GiftInfo {
    buy_num: number;
    cost: BaseItemSlot;
    dc: number;
    id: number;
    items: BaseItemSlot[];
    name: string;
    need: BaseItemSlot;
    productId: string;
    remark: number;
    rmb: number;
    type: number;
    vip: number;
    onekey: number;
}