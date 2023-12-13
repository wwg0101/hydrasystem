import { LimitActivityPindex } from "./ActivityModule/ActivityHeadFile";
import { PanelType } from "./PanelConfig";


// 按钮类型
export enum ShowType {
    //big_charge = 1,             // 充值豪礼大图标
    GameCorn = 112,
    GameLinkMatch = 113,
    GameBubble = 125,
    GameMiner = 127,
    GameSakura = 128,
    GameMonopoly = 129,
    CallbackReunion = 130,
    CallbackReturn = 131,
    CallbackStory = 132,
}

export const ActivityBinding = {
    [ShowType.GameCorn]: {
        activity: LimitActivityPindex.GameCornActivity,
        panel: PanelType.GameCornActView_Main,
        iconName: "zjm_flczy",
    },
    [ShowType.GameLinkMatch]: {
        activity: LimitActivityPindex.GameLinkMatchActivity,
        panel: PanelType.GameLinkMatchView_Main,
        iconName: "zjm_flczy",
    },
    [ShowType.GameBubble]: {
        activity: LimitActivityPindex.GameBubbleDragon,
        panel: PanelType.GameBubbleActView_Main,
        iconName: "zjm_flczy",
    },
    [ShowType.GameMiner]: {
        activity: LimitActivityPindex.GameGoldMiner,
        panel: PanelType.GameGoldMinerActView_Main,
        iconName: "zjm_hbcd",
    },
    [ShowType.GameSakura]: {
        activity: LimitActivityPindex.GameSakura,
        panel: PanelType.GameSakuraActView_Main,
        iconName: "zjm_hbcd",
    },
    [ShowType.GameMonopoly]: {
        activity: LimitActivityPindex.GameMonopoly,
        panel: PanelType.GameMonopolyActView_Main,
        iconName: "zjm_xmhy",
    },
    [ShowType.CallbackReunion]: {
        activity: LimitActivityPindex.CallbackReunionActivity,
        panel: PanelType.CallbackReunionView,
        iconName: "zjm_qjgl",
    },
    [ShowType.CallbackReturn]: {
        activity: LimitActivityPindex.CallbackReturnActivity,
        panel: PanelType.Callback_CallerJoinView,
        iconName: "zjm_qjgl",
    },
    [ShowType.CallbackStory]: {
        activity: LimitActivityPindex.CallbackStoryActivity,
        panel: PanelType.CallbackStoryView,
        iconName: "zjm_sgqy",
    },
}

class Cfg {
    redDot?: string[];
    size?: any;
}


export const SpecialBtnCfg: { [index: number]: Cfg } = {
    
    //[LimitActivityPindex.MahjongActivity]: {
    //    redDot: [
    //        RedDotEvent.CanExchangeWifeCloth + LimitActivityPindex.MahjongActivity,
    //        RedDotEvent.CanExchangeWife + LimitActivityPindex.MahjongActivity,
    //    ],
    //},
    //[LimitActivityPindex.RichActivity]: {
    //    redDot: [
    //        RedDotEvent.CanGetReward + LimitActivityPindex.RichActivity,
    //    ],
    //    size: cc.v2(128, 128),
    //},
};

export enum MTBContainerType {
    Slider, // 滑动容器 
    Fix, // 固定容器
    BigCell, // 头标 通常只有一个
    Hide // 隐藏
}

//根據此順序排優先級
export const ButtonConfig = {
    //滑动
    [MTBContainerType.Slider]: {
        iconType: [
        ]
    },
    //固定
    [MTBContainerType.Fix]: {
        iconType: [
            //ShowType.Charge,            // 充值豪礼
        ]
    },
}

export class MTBConfigHelper {
    public static GetActivityPanel(activityID: LimitActivityPindex): PanelType {
        let rst = PanelType.None;
        for (let key in ActivityBinding) {
            if (rst == PanelType.None) {
                let cfg = ActivityBinding[key];
                if (cfg.activity == activityID) {
                    rst = cfg.panel;
                }
            }
        }
        return rst;
    }
}