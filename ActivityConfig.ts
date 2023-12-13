import { GameCornFeature } from "../../scripts/app/models/GameCorn/GameCorn";
import { GameLinkMatchFeature } from "../../scripts/app/models/linkMatch/GameLinkMatch";
import { CallbackReturnFeature, CallbackReunionFeature, CallbackStoryFeature } from "../app/models/Callback/CallbackFeature";
import { GameBubbleFeature } from "../app/models/GameBubble/GameBubbleDragon";
import { GameGoldMinerFeature } from "../app/models/GameGoldMiner/GameGoldMiner";
import { GameMonopolyFeature } from "../app/models/GameMonopoly/GameMonopoly";
import { GameSakuraFeature } from "../app/models/GameSakura/GameSakura";
import { ActivityLassoGameFeature, ActivityLeiJiRwdFeature, ActivityLuckyGiftFeature, ActivityStageRwdFeature, NetworkDetailInfoFeature } from "./ActivityModule/ActivityFeature";
import { LimitActivityPindex, ActivityShowType } from "./ActivityModule/ActivityHeadFile";
import { TimeOutFeature } from "./Feature/LimitHdActTimeCheckerFeature";
import { SimpleActInfoFeature } from "./Feature/SimpleActFeature";
import { ActTimeFeature } from "./Feature/TimeFeature";
import { PanelType } from "./PanelConfig";
//开发中
export const ActivityInProgress = {
    //[2050]: true,
    // [2333]: true,
}

export class ActivityConfig {
    public static InitConfig() {
        ActivityConfig.ActivityFeatureConfig = {
            [ActivityShowType.SimpleAct]: {
                mainFeature: SimpleActInfoFeature,
                featureTypes: []
            },
            [ActivityShowType.Corn]: {
                mainFeature: GameCornFeature,
                featureTypes:
                    [
                        ActivityLeiJiRwdFeature,
                        NetworkDetailInfoFeature
                    ]
            },
            [ActivityShowType.LinkMatch]: {
                mainFeature: GameLinkMatchFeature,
                featureTypes:
                    [
                        TimeOutFeature,
                        ActTimeFeature
                    ]
            },
            [ActivityShowType.GameBubbleDragon]: {
                mainFeature: GameBubbleFeature,
                featureTypes:
                    [
                        ActivityLuckyGiftFeature,
                        NetworkDetailInfoFeature
                    ]
            },
            [ActivityShowType.GameGoldMiner]: {
                mainFeature: GameGoldMinerFeature,
                featureTypes:
                    [
                        TimeOutFeature,
                        ActTimeFeature
                    ]
            },
            [ActivityShowType.GameSakura]: {
                mainFeature: GameSakuraFeature,
                featureTypes:
                    [
                        ActivityStageRwdFeature,
                        TimeOutFeature,
                        ActTimeFeature
                    ]
            },
            [ActivityShowType.GameMonopoly]: {
                mainFeature: GameMonopolyFeature,
                featureTypes:
                    [
                        TimeOutFeature,
                        ActTimeFeature,
                        ActivityLassoGameFeature,
                    ]
            },
            [ActivityShowType.CallbackReunion]: {
                mainFeature: CallbackReunionFeature,
                featureTypes:
                    [
                        TimeOutFeature,
                        ActTimeFeature,
                    ]
            },
            [ActivityShowType.CallbackReturn]: {
                mainFeature: CallbackReturnFeature,
                featureTypes:
                    [
                        TimeOutFeature,
                        ActTimeFeature,
                    ]
            },
            [ActivityShowType.CallbackStory]: {
                mainFeature: CallbackStoryFeature,
                featureTypes:
                    [
                        TimeOutFeature,
                        ActTimeFeature,
                    ]
            },
        
            [ActivityShowType.All]: {
                featureTypes:
                    [   
                        TimeOutFeature,
                        ActTimeFeature
                    ]
            },
        };
    }
    public static ActivityFeatureConfig;
}


export const ActivityUIConfig: { [Pindex: number]: { panel: PanelType[], mainPan: PanelType } } = {
    [LimitActivityPindex.GameCornActivity]: {
        panel: [
            PanelType.GameCornActView_Join,
            PanelType.GameCornActView_Main,
        ],
        mainPan: PanelType.GameCornActView_Main
    },
    [LimitActivityPindex.GameLinkMatchActivity]: {
        panel: [
            PanelType.GameLinkMatchView_Join,
            PanelType.GameLinkMatchView_Main,
            PanelType.GameLinkMatchBPView,
        ],
        mainPan: PanelType.GameLinkMatchView_Main
    },
    [LimitActivityPindex.GameBubbleDragon]: {
        panel: [
            PanelType.GameBubbleActView_Join,
            PanelType.GameBubbleActView_Main,
        ],
        mainPan: PanelType.GameBubbleActView_Main
    },
    [LimitActivityPindex.GameGoldMiner]: {
        panel: [
            PanelType.GameGoldMinerActView_Join,
            PanelType.GameGoldMinerActView_Main,
            PanelType.GameGoldMinerActView_Book,
            PanelType.GameGoldMinerActView_props,
            PanelType.GameGoldMinerActView_ConditionSuccess,
            PanelType.GameGoldMinerActView_ConditionFail,
            PanelType.GameGoldMinerActView_ResultSuccess,
            PanelType.GameGoldMinerActView_ResultFail,
            PanelType.GameGoldMinerActView_buyItemView,
            PanelType.GameGoldMinerActView_donateSuccessView,
            PanelType.GameGoldMinerActView_donateRwdPreviewView,
            PanelType.GameGoldMinerActView_donate,
        ],
        mainPan: PanelType.GameGoldMinerActView_Main
    },
    [LimitActivityPindex.GameSakura]: {
        panel: [
            PanelType.GameSakuraActView_Join,
            PanelType.GameSakuraActView_Main,
            PanelType.GameSakuraDrawView,
        ],
        mainPan: PanelType.GameSakuraActView_Main
    },
    [LimitActivityPindex.GameMonopoly]: {
        panel: [
            PanelType.GameMonopolyActView_Main,
            PanelType.GameMonopolyActView_Join,
            PanelType.GameMonopolyView_CastleEventPreview,
            PanelType.GameMonopolyView_BlockerEventPreview,
            PanelType.GameMonopolyView_BlockerEvent,
            PanelType.GameMonopolyView_BlockerEvent_ChangeMark,
            PanelType.GameMonopolyActView_Profile,
            PanelType.GameMonopolyView_Lasso,
            PanelType.GameMonopolyView_LassoOneKey,
            PanelType.GameMonopolyActView_PrisonCage,
            PanelType.GameMonopolyActView_Badge,
            PanelType.GameMonopolyActView_BadgeRwdPreview,
            PanelType.GameMonopolyActView_BadgeFiltrate,
            PanelType.GameMonopolyActView_BadgeGift,
            PanelType.GameMonopolyActView_BadgeGiftRecord,
            PanelType.GameMonopolyActView_PapaBear,
            PanelType.GameMonopolyActView_BdDreamLvl,
            PanelType.GamemonopolyDreamSkillTips,
            PanelType.GameMonopolyActView_Turntable,
            PanelType.GameMonopolyActView_PapaBearSucc,
            PanelType.GameMonopolyActView_ClubGift,
        ],
        mainPan: PanelType.GameMonopolyActView_Main
    },
    [LimitActivityPindex.CallbackReunionActivity]: {
        panel: [
            PanelType.CallbackReunionView,
            PanelType.CallbackCheckView,
        ],
        mainPan: PanelType.CallbackReunionView
    },
    [LimitActivityPindex.CallbackReturnActivity]: {
        panel: [
            PanelType.Callback_CallerJoinView
        ],
        mainPan: PanelType.Callback_CallerJoinView
    },
    [LimitActivityPindex.CallbackStoryActivity]: {
        panel: [
            PanelType.CallbackStoryView
        ],
        mainPan: PanelType.CallbackStoryView
    },
}
export class ActivityConfigHelper {
    public static GetActivityID(panelType: PanelType): LimitActivityPindex {
        let rst = LimitActivityPindex.None;
        for (let key in ActivityUIConfig) {
            if (rst == LimitActivityPindex.None) {
                let cfg = ActivityUIConfig[key];
                for (let i = 0; i < cfg.panel.length; ++i) {
                    if (cfg.panel[i] == panelType) {
                        rst = Number.parseInt(key);
                        break;
                    }
                }
            }
        }
        return rst;
    }
}