import { ActAchieveNetItem, TaskGet } from "../LimitActivity/LimitActivityHeadFile";

declare let localdb;

export enum SmallGameParamEnum {
    GameCornMutipleLimit = 1,               //翡冷翠小游戏倍数条件
    GameCornGetPowerItem = 2,               //翡冷翠小游戏回复体力道具
    GameCornPassScore = 3,                  //翡冷翠小游戏通关积分
    GameCornGetSlowDownItem = 4,            //翡冷翠小游戏减速道具  //现在没有
    GameCornScoreItem = 5,                  //翡冷翠小游戏积分道具
    GameCornClothID = 6,                    //翡冷翠小游戏展示时装  
    GameCornPowerCfg = 7,                   //翡冷翠小游戏体力
    GameCornGetPowerItemAddNum = 8,         //翡冷翠小游戏道具回复体力数
    GameCornEndRwdItems = 9,                //翡冷翠小游戏通关奖励道具

    GameLinkMatchMultLimit = 10,            //名媛私厨小游戏切换倍率条件
    GameLinkMatchPowerItem = 11,            //名媛私厨小游戏恢复体力道具ID
    GameLinkMatchBPExpItem = 12,            //名媛私厨小游戏bp经验道具
    GameLinkMatchClotheShow = 13,           //名媛私厨小游戏服装展示
    GameLinkMatchPowerLimit = 14,           //名媛私厨小游戏体力限制
    GameLinkMatchPowerAddNum = 15,          //名媛私厨小游戏道具回复体力数
    GameLinkMatchComboLimit = 16,           //名媛私厨小游戏暴击积分倍率
    GameLinkMatchBPBuyAdd = 17,             //名媛私厨小游戏bp购买经验数

    GameBubbleMutipleLimit = 18,            //织短情长小游戏倍数条件
    GameBubbleGetPowerItem = 19,            //织短情长小游戏回复体力道具
    GameBubbleGetPowerItemAddNum = 20,      //织短情长小游戏道具回复体力数
    GameBubblePowerCfg = 21,                //织短情长小游戏体力
    GameBubbleScoreItem = 22,               //织短情长小游戏积分道具
    GameBubbleClothID = 23,                 //织短情长小游戏展示时装  
    GameBubbleBasket = 24,                  //织短情长小游戏篮子配置  
    GameBubbleLuckyGiftPrize = 25,          //织短情长九宫格界面展示时装
    GameBubbleComboLimit = 26,              //纸短情长小游戏掉落combo
    GameBubbleChessLinkRateList = 27,       //纸短情长小游戏生成棋子连贯概率
    GameBubbleChessColorRateList = 28,      //纸短情长小游戏棋子生成概率
    GameBubbleBorderChessLinkMult = 29,     //纸短情长小游戏2格棋子行额外倍率

    smallGame2056Limit = 30,//'海滨垂钓高级渔场积分限制', type: 'number', param: 3000}1
    smallGame2056Vigor = 31,//'海滨垂钓游戏体力恢复配置', type: 'array', param: '{"count":10,"cdTime":3600,"num":1}'}2
    smallGame2056MaxVigor = 32,//'海滨垂钓游戏体力道具增加上限', type: 'number', param: 100}3
    smallGame2056MaxPower = 33,//'海滨垂钓鱼钩耐久值上限', type: 'number', param: 15}4
    smallGame2056VigorDeduct = 34,//'海滨垂钓高级渔场体力扣除', type: 'number', param: 5}5
    smallGame2056VigorItemId = 35,//'海滨垂钓恢复体力道具id', type: 'number', param: 2101}6
    smallGame2056PowerItemId = 36,//'海滨垂钓恢复耐力道具id', type: 'number', param: 2102}7
    smallGame2056UniversalHook = 37,//'海滨垂钓万能钩道具id', type: 'number', param: 2103}8
    smallGame2056Torpedo = 38,//'海滨垂钓轻鱼雷道具id', type: 'number', param: 2104}9
    smallGame2056FrozenLiquid = 39,//'海滨垂钓冰冻液道具id', type: 'number', param: 2105}
    smallGame2056PropsJumpItemIds = 40,//'海滨垂钓道具商店跳转id数组', type: 'array', param: '[1,1,1]'}
    smallGame2056UniversalHookMaxUse = 41,//'海滨垂钓万能钩道具每局使用数量', type: 'number', param: 10}
    smallGame2056TorpedoMaxUse = 42,//'海滨垂钓轻鱼雷道具每局使用数量', type: 'number', param: 10}
    smallGame2056FrozenLiquidMaxUse = 43,//'海滨垂钓冰冻液道具每局使用数量', type: 'number', param: 10}
    smallGame2056PowerItemMaxUse = 44,//'海滨垂钓耐力道具每局使用数量', type: 'number', param: 10}


    smallGame2056PowerItemNum = 45,//'海滨垂钓道具恢复钩子耐力数', type: 'number', param: 5}
    smallGame2056VigorItemNum = 46,//'海滨垂钓道具恢复体力数', type: 'number', param: 5}
    smallGame2056ScoreItemId = 47,  //海滨垂钓积分道具ID, type: number

    GameSakuraDrawItem = 48,                //旅行手记抽奖道具id
    GameSakuraExchangeItemBig = 49,         //旅行手记兑换道具大
    GameSakuraExchangeItemSmall = 50,       //旅行手记兑换道具小
    GameSakuraClotheShow = 51,              //旅行手记服装展示

    GameMonopolyLassoUseItem = 501,     //巡梦环游奇妙套圈抽奖道具id
    GameMonopolyLassoUseItemNum = 502,  //巡梦环游奇妙套圈抽奖消耗
    GameMonopolyLassoOneKeyVipNeed = 503,  //巡梦环游奇妙套圈抽奖一键套圈vip限制
    GameMonopolyLassoMaxNum = 504,  //巡梦环游奇妙套圈最大数量
    GameMonopolyLassoRefreshTime = 505,  //巡梦环游奇妙套圈刷新时间
    GameMonopolyPower = 506,  //巡梦环游游戏体力
    GameMonopolySpecPowerItemID = 507,  //巡梦环游特殊骰子点数道具id
    GameMonopolyScoreItemID = 508,  //巡梦环游积分道具id
    GameMonopolyBaseAtkValue = 509,  //巡梦环游攻击拦路者基础攻击
    GameMonopolyCageTime = 510,  //巡梦环游荆棘囚笼时间
    GameMonopolyCageCostPower = 511,  //巡梦环游荆棘囚笼立刻脱困消耗体力数
    GameMonopolyAtkCostPower = 512,  //巡梦环游再次攻击拦路者消耗体力数
    GameMonopolyAtkRefreshTime = 513,  //巡梦环游再次攻击标记拦路者刷新时间
    GameMonopolyPapaBearItemID = 514,  //巡梦环游拦路趴趴熊道具
    GameMonopolyCloudWalkTime = 515,  //巡梦环游邀请云端漫游过期时间
    GameMonopolyLadiesGiftNum = 516,  //巡梦环游名媛会礼盒数量
    GameMonopolyLadiesGiftTime = 517,  //巡梦环游名媛会礼盒时间限制
    GameMonopolyCloudWalkDayMaxTimes = 518,  //巡梦环游被邀请云端漫游日上限
    GameMonopolyBadgeMaxAskTimes = 519,  //巡梦环游纪念徽章索要日上限
    GameMonopolyBadgeMaxGiveTimes = 520,  //巡梦环游纪念徽章赠送日上限
    GameMonopolyPowerRecoverItemID = 521,    //巡梦环游恢复体力道具ID
    GameMonopolyPowerRecoverNum = 522,    //巡梦环游恢复体力道具恢复数值
    GameMonopolyLadiesGiftBoxMaxCount = 523,    //巡梦环游名媛会礼盒数量上限
}

export class SimpleActInfo {
    taskGet: TaskGet[];// 任务情况
    giftNum: number; //: 0;// 已赠礼次数 

    crossList: string[];//分区ID

    rwdGot: number[]; // [1,2]; 成就奖励领取情况
    num: number;//0 進度
    rwdInfo: { readonly [index: number]: ActAchieveNetItem[] };;//成就奖励配置
}

export class NetShopActCellItem {
    isOpen: number;//0為未開啟，非0位對應商品id
    index: number;//
}

export interface ISimpleAct_Join {
    onRespJoin(item: any[]);
}

