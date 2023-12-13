//界面层级
export enum PanelLayer {
    Background, //背景、场景固有界面
    Mid,        //普通界面
    Foreground, //弹出窗 - 覆盖型界面
    Message,    //消息

    Notice,     //通知层 - 通用错误提示

    StaticLayer,  //静态层分割线
    Mask,       //遮罩
    Count,
}

//界面类型
export enum PanelType {
    None,
    /**
     * 主场景
     */    

    //通用活动相关界面
    activityShop,
    activitySpecialBuy,

    SmallGameActView_Main,
    SmallGameActView_Join,
    SmallGameRankNewView_Pop,
    BagUse,
    ItemUseConfirm,
    AlertItemMoreAndShow,
    CommonChooseWifeView,
    ActCommonGiftRwdView,   //通用奖励预览界面
    ActConfessionView,      //活动通用公告日志界面

    //未制作
    WaitingMaskView,
    // UseItemView,//用baguse代替
    //未完成
    MainView_Scene = 998,
    ____IconOpenLimit_____ = 999,
    //-----------------------------------------------------------------------------------------------------------------------
    //中间预留字段用于特权解锁
    //对应IconOpenSpec枚举
    //-----------------------------------------------------------------------------------------------------------------------
    ____SpecialIconOpenLimit_____ = 1999,
    //-----------------------------------------------------------------------------------------------------------------------
    //特殊含义的界面
    //-----------------------------------------------------------------------------------------------------------------------
    _____Div____ = 3000,
    //----------icon open 分割线---------------------
    SceneContainer,
    WaitingHttpView,

    GameCornActView_Main,
    GameCornActView_Join,
    GameBubbleActView_Main,
    GameBubbleActView_FirstIn,
    GameBubbleActView_Join,
    GameBubbleDragonClotheView,
    GameBubbleDragonGiftView,
    GameBubbleDragonLuckyGiftLogView,
    GameBubbleDragonGiftRwdView,
    GameBubbleDragonCollectInfoView,
    ActLeiJiRwdView,
    ActStageRwdView,
    ActLuckyGiftRwdPreView,

    //连连消
    GameLinkMatchView_Main,
    GameLinkMatchView_Join,
    GameLinkMatchBPView,
    GameLinkMatchGuideView,

    //黄金矿工
    GameGoldMinerActView_Main,
    GameGoldMinerActView_Join,
    GameGoldMinerActView_Book,
    GameGoldMinerActView_props,
    GameGoldMinerActView_ConditionSuccess,
    GameGoldMinerActView_ConditionFail,
    GameGoldMinerActView_ResultSuccess,
    GameGoldMinerActView_ResultFail,
    GameGoldMinerActView_buyItemView,
    GameGoldMinerActView_donateSuccessView,
    GameGoldMinerActView_donateRwdPreviewView,
    GameGoldMinerActView_donate,
    GameGoldMinerActView_TargetRwd,

    //千金樱花行
    GameSakuraActView_Main,
    GameSakuraActView_Join,
    GameSakuraDrawView,
    GameSakuraRwdPreView,

    //大富翁
    GameMonopolyActView_Main,
    GameMonopolyActView_Join,
    GameMonopolyView_CastleEventPreview,
    GameMonopolyView_BlockerEventPreview,
    GameMonopolyView_BlockerEvent,
    GameMonopolyView_BlockerEvent_ChangeMark,
    GameMonopolyView_Lasso,
    GameMonopolyView_LassoOneKey,
    GameMonopolyView_LassoRwdPlayer,
    GameMonopolyActView_Profile,
    GameMonopolyActView_Badge,
    GameMonopolyActView_BadgeRwdPreview,
    GameMonopolyActView_BadgeGift,
    GameMonopolyActView_BadgeGiftRecord,
    GameMonopolyActView_BadgeFiltrate,
    GameMonopolyActView_PapaBear,
    GameMonopolyActView_PrisonCagePreview,
    GameMonopolyActView_PrisonCage,
    GameMonopolyActView_CageEscapeResult,
    GamemonopolyDreamSkillTips,
    GameMonopolyActView_GiftPack,
    GameMonopolyActView_GiftCar,
    GameMonopolyActView_GiftExchange,
    GameMonopolyActView_TreasureBox,
    GameMonopolyView_TreasureBoxPreview,
    GameMonopolyActView_BdDreamLvl,
    GameMonopolyView_BuildEvent,
    GameMonopolyView_BuildEventPreview,
    GameMonopolyView_BuildEventStageRwd,
    GameMonopolyView_BadgeTent,
    GameMonopolyView_BadgeTentPreview,
    GameMonopolyView_CloudRoam,
    GameMonopolyView_CloudRoamPreview,
    GameMonopolyView_CloudRoam_InviteClubMember,
    GameMonopolyView_CloudRoam_InviteLetter,
    GameMonopolyView_CloudRoam_InviteLetterList,
    GameMonopolyView_ClubEnemyList,
    GameMonopolyView_ClubEnemy_Rwd,
    GameMonopolyActView_Turntable,
    GameMonopolyActView_TurntablePreview,
    GameMonopolyView_SkillView,
    GameMonopolyActView_PapaBearSucc,
    GameMonopolyActView_ClubGift,
    GameMonopolyActView_ClubInfo,

    GameMonopolyView_SchoolEvent_ServantSelect,
    GameMonopolyView_SchoolEvent,
    GameMonopolyView_BlockerBear,
    GameMonopolyActView_CatFireBalloonPreview,
    GameMonopolyCatFireBalloonView,

    //星辉展馆
    ExhibitionShopView,
    ExhibitionRankView,

    //小助手
    SecretaryView,
    SecretaryShopView,
    SecretaryWaitingView,
    SecretaryResultView,
    ConfirmSecretaryShopSet,

    //回归
    Callback_Bottom,
    Callback_StorySelect,
    Callback_FirstShow,
    Callback_CallerJoinView,
    CallbackReunionView,
    CallbackCheckView,
    CallbackCheckPopView,
    CallbackStoryView,
    CallbackReturnView,
    CallbackRechargeView,

    // 璀璨之路商店
    BrightShopView,
}

export enum IconOpenSpec {
    BusinessStreetRandomTaskNpc = 1601,
}

export class PanelData {
    public static readonly s_iLayerSpacing: number = 5;
    public static readonly s_iStaticOffset: number = 10000;
    //获取UI根节点 -> TODO 最好和场景管理器联动，实时变更，不要每次取
    public static GetUIRoot(): cc.Node {
        let uiRoot = cc.director.getScene().getChildByName("Canvas").getChildByName("midLayer");
        return uiRoot;
    }

    public static readonly s_mainShowPanelList = [
        // PanelType.BusinessStreetView,
        // PanelType.MainView_Scene,
    ]
}
export interface IPanelConfig {
    url: string,
    layer: PanelLayer,
    releaseRes?: boolean;   //释放资源
    fullScreen?: boolean;   //全屏
    scene?: boolean;    //切换场景
    persist?: boolean;  //常驻
    immdiateRelease?: boolean; //销毁时立刻释放
    subLayer?: boolean;   //独立层级
    queue?: boolean;      //受队列管理，不受栈管理
    needUIRegister?: boolean;   //兼容千金的UIConfig  标记registerUI用的
};

export const NotCoverPanel = {
    [PanelType.None]: true,
    [PanelType.WaitingHttpView]: true,
}

type valueOf<T> = T[keyof T];
type IViewEnumTpConfig<T> = { [key in valueOf<typeof PanelType>]: T };


//目前用于读取url，layer没用
export const PanelConfig: IViewEnumTpConfig<IPanelConfig> = {
    [PanelType.None]: {
        url: "",
        layer: PanelLayer.StaticLayer,
    },
    [PanelType.____IconOpenLimit_____]: {
        url: "",
        layer: PanelLayer.StaticLayer,
    },
    [PanelType.____SpecialIconOpenLimit_____]: {
        url: "",
        layer: PanelLayer.StaticLayer,
    },
    [PanelType._____Div____]: {
        url: "",
        layer: PanelLayer.StaticLayer,
    },
    [PanelType.SceneContainer]: {
        url: "",
        layer: PanelLayer.StaticLayer,
    },
    [PanelType.MainView_Scene]: {
        url: "todo-MainViewScene",
        layer: PanelLayer.Background,
        releaseRes: true,
        persist: true,
    },
    [PanelType.activityShop]: {
        url: "ActivityShopView",
        layer: PanelLayer.Mid,
    },
    [PanelType.activitySpecialBuy]: {
        url: "ActivitySpecialBuy",
        layer: PanelLayer.Mid,
    },
    [PanelType.SmallGameActView_Main]: {
        url: "smallGame/SmallGameActView_Main",
        layer: PanelLayer.Mid,
    },
    [PanelType.SmallGameActView_Join]: {
        url: "smallGame/SmallGameActView_Join",
        layer: PanelLayer.Mid,
    },
    [PanelType.SmallGameRankNewView_Pop]: {
        url: "activity/SmallGameRankNewView_Pop",
        layer: PanelLayer.Foreground,
        needUIRegister: true, 
    },
    [PanelType.AlertItemMoreAndShow]: {
        url: "AlertItemMoreAndShow",
        layer: PanelLayer.Mid,
    },
    [PanelType.WaitingHttpView]: {
        url: "waitMask/WaitingHttpView",
        layer: PanelLayer.Mask,
    },
    [PanelType.WaitingMaskView]: {
        url: "waitMask/WaitingMaskView",
        layer: PanelLayer.Mask,
    },
    [PanelType.CommonChooseWifeView]: {
        url: "CommonChooseWifeView",
        layer: PanelLayer.Mid,
    },
    [PanelType.ActCommonGiftRwdView]: {
        url: "activity/common/ActCommonGiftRwdView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.ActConfessionView]: {
        url: "activity/common/ActConfessionView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.ItemUseConfirm]: {
        url: "bag/UseItemConfirm",
        layer: PanelLayer.Mid,
    },
    [PanelType.BagUse]: {
        url: "bag/BagUse",
        layer: PanelLayer.Mid,
    },
    [PanelType.GameCornActView_Main]: {
        url: "activity/gameCorn/GameCornActView_Main",
        layer: PanelLayer.Background,
        releaseRes: true,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameCornActView_Join]: {
        url: "activity/gameCorn/GameCornActView_Join",
        layer: PanelLayer.Background,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleActView_Main]: {
        url: "activity/gameBubble/GameBubbleDragonActView_Main",
        layer: PanelLayer.Background,
        releaseRes: true,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleActView_Join]: {
        url: "activity/gameBubble/GameBubbleDragonActView_Join",
        layer: PanelLayer.Background,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleActView_FirstIn]: {
        url: "activity/gameBubble/GameBubbleActView_FirstIn",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleDragonClotheView]: {
        url: "activity/gameBubble/GameBubbleDragonClotheView",
        layer: PanelLayer.Background,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleDragonGiftView]: {
        url: "activity/gameBubble/GameBubbleDragonGiftView",
        layer: PanelLayer.Background,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleDragonLuckyGiftLogView]: {
        url: "activity/gameBubble/GameBubbleDragonLuckyGiftLogView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleDragonGiftRwdView]: {
        url: "activity/gameBubble/GameBubbleDragonGiftRwdView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameBubbleDragonCollectInfoView]: {
        url: "activity/gameBubble/GameBubbleDragonCollectInfoView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.ActLeiJiRwdView]: {
        url: "activity/common/ActLeiJiRwdView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.ActStageRwdView]: {
        url: "activity/common/ActStageRwdView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.ActLuckyGiftRwdPreView]: {
        url: "activity/common/ActLuckyGiftRwdPreView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameLinkMatchView_Main]: {
        url: "activity/gameLinkMatch/GameLinkMatchActView_Main",
        layer: PanelLayer.Background,
        releaseRes: true,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameLinkMatchView_Join]: {
        url: "activity/gameLinkMatch/GameLinkMatchActView_Join",
        layer: PanelLayer.Background,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameLinkMatchBPView]: {
        url: "activity/gameLinkMatch/GameLinkMatchBPView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameLinkMatchGuideView]: {
        url: "activity/gameLinkMatch/GameLinkMatchGuide",
        layer: PanelLayer.Foreground,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_Main]: {
        url: "activity/GoldMiner/GameGoldMinerActView_Main",
        layer: PanelLayer.Background,
        releaseRes: true,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_Join]: {
        url: "activity/GoldMiner/GameGoldMinerActView_Join",
        layer: PanelLayer.Background,
        fullScreen: true,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_Book]: {
        url: "activity/GoldMiner/GameGoldMinerActView_Book",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_props]: {
        url: "activity/GoldMiner/GameGoldMinerActView_props",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_ConditionSuccess]: {
        url: "activity/GoldMiner/GameGoldMinerActView_ConditionSuccess",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_ResultSuccess]: {
        url: "activity/GoldMiner/GameGoldMinerActView_ResultSuccess",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_ResultFail]: {
        url: "activity/GoldMiner/GameGoldMinerActView_ResultFail",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_ConditionFail]: {
        url: "activity/GoldMiner/GameGoldMinerActView_ConditionFail",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_buyItemView]: {
        url: "activity/GoldMiner/GameGoldMinerActView_buyItemView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_donateSuccessView]: {
        url: "activity/GoldMiner/GameGoldMinerActView_donateSuccessView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_donateRwdPreviewView]: {
        url: "activity/GoldMiner/GameGoldMinerActView_donateRwdPreviewView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_donate]: {
        url: "activity/GoldMiner/GameGoldMinerActView_donate",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameGoldMinerActView_TargetRwd]: {
        url: "activity/GoldMiner/GameGoldMinerActView_TargetRwd",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameSakuraActView_Main]: {
        url: "activity/gameSakura/GameSakuraActView_Main",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameSakuraActView_Join]: {
        url: "activity/gameSakura/GameSakuraActView_Join",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameSakuraDrawView]: {
        url: "activity/gameSakura/GameSakuraDrawView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameSakuraRwdPreView]: {
        url: "activity/gameSakura/GameSakuraRwdPreView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_Main]: {
        url: "activity/gameMonopoly/GameMonopolyActView_Main",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_Join]: {
        url: "activity/gameMonopoly/GameMonopolyActView_Join",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_CastleEventPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_CastleEventPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BlockerEventPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_BlockerEventPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BlockerEvent]: {
        url: "activity/gameMonopoly/GameMonopolyView_BlockerEvent",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BlockerEvent_ChangeMark]: {
        url: "activity/gameMonopoly/GameMonopolyView_BlockerEvent_ChangeMark",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_Lasso]: {
        url: "activity/gameMonopoly/GameMonopolyView_Lasso",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_LassoOneKey]: {
        url: "activity/gameMonopoly/GameMonopolyView_LassoOneKey",
        layer: PanelLayer.Foreground,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_LassoRwdPlayer]: {
        url: "activity/gameMonopoly/GameMonopolyView_LassoRwdPlayer",
        layer: PanelLayer.Notice,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_Profile]: {
        url: "activity/gameMonopoly/GameMonopolyActView_Profile",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_Badge]: {
        url: "activity/gameMonopoly/GameMonopolyActView_Badge",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_PrisonCagePreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_PrisonCagePreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_PrisonCage]: {
        url: "activity/gameMonopoly/GameMonopolyView_PrisonCage",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_CageEscapeResult]: {
        url: "activity/gameMonopoly/GameMonopolyView_CageEscapeResult",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_BadgeRwdPreview]: {
        url: "activity/gameMonopoly/GameMonopolyActView_BadgeRwdPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_BadgeGift]: {
        url: "activity/gameMonopoly/GameMonopolyActView_BadgeGift",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_BadgeGiftRecord]: {
        url: "activity/gameMonopoly/GameMonopolyActView_BadgeGiftRecord",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_BadgeFiltrate]: {
        url: "activity/gameMonopoly/GameMonopolyActView_BadgeFiltrate",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_PapaBear]: {
        url: "activity/gameMonopoly/GameMonopolyActView_PapaBear",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_GiftPack]: {
        url: "activity/gameMonopoly/GameMonopolyView_GiftPack",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_GiftCar]: {
        url: "activity/gameMonopoly/GameMonopolyView_GiftCar",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_GiftExchange]: {
        url: "activity/gameMonopoly/GameMonopolyView_GiftExchange",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_TreasureBox]: {
        url: "activity/gameMonopoly/GameMonopolyView_TreasureBox",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_TreasureBoxPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_TreasureBoxPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_BdDreamLvl]: {
        url: "activity/gameMonopoly/GameMonopolyActView_BdDreamLvl",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BuildEvent]: {
        url: "activity/gameMonopoly/GameMonopolyView_BuildEvent",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BuildEventPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_BuildEventPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BuildEventStageRwd]: {
        url: "activity/gameMonopoly/GameMonopolyView_BuildEventStageRwd",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_SchoolEvent_ServantSelect]: {
        url: "activity/gameMonopoly/GameMonopolyView_SchoolEvent_ServantSelect",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
[PanelType.GameMonopolyView_SchoolEvent]: {
    url: "activity/gameMonopoly/GameMonopolyView_SchoolEvent",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GamemonopolyDreamSkillTips]: {
        url: "activity/gameMonopoly/GamemonopolyDreamSkillTips",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_Turntable]: {
        url: "activity/gameMonopoly/GameMonopolyView_Turntable",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_TurntablePreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_TurntablePreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BadgeTent]: {
        url: "activity/gameMonopoly/GameMonopolyView_BadgeTent",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BadgeTentPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_BadgeTentPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_CloudRoam]: {
        url: "activity/gameMonopoly/GameMonopolyView_CloudRoam",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_CloudRoamPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_CloudRoamPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_CloudRoam_InviteClubMember]: {
        url: "activity/gameMonopoly/GameMonopolyView_CloudRoam_InviteClubMember",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_CloudRoam_InviteLetter]: {
        url: "activity/gameMonopoly/GameMonopolyView_CloudRoam_InviteLetter",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_CloudRoam_InviteLetterList]: {
        url: "activity/gameMonopoly/GameMonopolyView_CloudRoam_InviteLetterList",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_ClubEnemyList]: {
        url: "activity/gameMonopoly/GameMonopolyView_ClubEnemyList",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_ClubEnemy_Rwd]: {
        url: "activity/gameMonopoly/GameMonopolyView_ClubEnemy_Rwd",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_SkillView]: {
        url: "activity/gameMonopoly/GameMonopolyView_SkillView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_PapaBearSucc]: {
        url: "activity/gameMonopoly/GameMonopolyActView_PapaBearSucc",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_ClubGift]: {
        url: "activity/gameMonopoly/GameMonopolyActView_ClubGift",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_ClubInfo]: {
        url: "activity/gameMonopoly/GameMonopolyActView_ClubInfo",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyView_BlockerBear]: {
        url: "activity/gameMonopoly/GameMonopolyView_BlockerBear",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.GameMonopolyActView_CatFireBalloonPreview]: {
        url: "activity/gameMonopoly/GameMonopolyView_CatFireBalloonPreview",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.GameMonopolyCatFireBalloonView]: {
        url: "activity/gameMonopoly/GameMonopolyCatFireBalloonView",
        layer: PanelLayer.Mid,
        needUIRegister: true, 
    },
    [PanelType.ExhibitionShopView]: {
        url: "exhibition/ExhibitionShopView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.ExhibitionRankView]: {
        url: "exhibition/ExhibitionRankView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.SecretaryView]: {
        url: "secretary/SecretaryView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.SecretaryShopView]: {
        url: "secretary/SecretaryShopView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.SecretaryResultView]: {
        url: "secretary/SecretaryResultView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.SecretaryWaitingView]: {
        url: "secretary/SecretaryWaitingView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.ConfirmSecretaryShopSet]: {
        url: "secretary/ConfirmSecretaryShopSet",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.Callback_Bottom]: {
        url: "activity/callback/Callback_Bottom",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.Callback_StorySelect]: {
        url: "activity/callback/Callback_StorySelect",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.Callback_FirstShow]: {
        url: "activity/callback/Callback_FirstShow",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.Callback_CallerJoinView]: {
        url: "activity/callback/Callback_CallerJoinView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.CallbackReunionView]: {
        url: "activity/callback/CallbackReunionView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.CallbackStoryView]: {
        url: "activity/callback/CallbackStoryView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.CallbackReturnView]: {
        url: "activity/callback/CallbackReturnView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.CallbackCheckView]: {
        url: "activity/callback/CallbackCheckView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.CallbackCheckPopView]: {
        url: "activity/callback/CallbackCheckPopView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.CallbackRechargeView]: {
        url: "activity/callback/CallbackRechargeView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
    [PanelType.BrightShopView]: {
        url: "brightRoad/BrightShopView",
        layer: PanelLayer.Mid,
        needUIRegister: true,
    },
}

