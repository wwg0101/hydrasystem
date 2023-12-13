declare let require;
const Utils = require("../app/utils/Utils");

export enum SoundEffEnum {
    GameCornSoundBoom = "yinxiao_gameCornBomb",
    GameCornSoundClick = "yinxiao_gameCornClick",
    GameCornSoundPeakDead = "yinxiao_gameCornPeckDead",
    GameCornSoundPeakSucc = "yinxiao_gameCornPeckSucc",

    GameLinkMatchSoundLink = "yinxiao_gameLinkMatchLink",
    GameLinkMatchSoundBoom = "yinxiao_gameLinkMatchBoom",
    GameLinkMatchSoundCombo = "yinxiao_gameLinkMatchCombo",

    GameBubbleOpenGift = "yinxiao_GameBubbleGiftSmall",
    GameBubbleOpenGiftBig = "yinxiao_GameBubbleGiftBig",
    GameBubbleChangeGift = "yinxiao_GameBubbleGiftChange",
    GameBubbleShoot = "yinxiao_gameBubbleShoot",
    GameBubbleHit = "yinxiao_gameBubbleHit",
    GameBubbleDrop = "yinxiao_gameBubbleDrop",
    GameBubbleCombo = "yinxiao_gameBubbleCombo",

    GameGoldMinerDonate = "yinxiao_GameGoldMinerDonate",
    GameGoldMinerDonateTence = "yinxiao_GameGoldMinerDonateTence",
    GameGoldMinerDonateSelect = "yinxiao_GameGoldMinerDonateSelect",
    GameGoldMinerFrozen = "yinxiao_goldMinerFrozen",
    GameGoldMinerBomb = "yinxiao_goldMinerBomb",
    GameGoldMinerHookSelect = "yinxiao_goldMinerHookSelect",
    GameGoldMinerScoreAdd = "yinxiao_goldMinerScoreAdd",
    GameGoldMinerRopeCatchGold = "yinxiao_goldMinerRopeCatchGold",
    GameGoldMinerRopeThrow = "yinxiao_goldMinerRopeThrow",
    GameGoldMinerRopeBack = "yinxiao_goldMinerRopeBack",
    GameGoldMinerJoinNormal = "yinxiao_goldMinerJoinNormal",
    GameGoldMinerJoinHigh = "yinxiao_goldMinerJoinHigh",

    GameSakuraFlip = "yinxiao_sakuraFlip",
    GameSakuraFlick = "fanye",
    GameSakuraOpen = "yinxiao_sakuraEnvelope",
    GameSakuraPass = "yinxiao_sakuraStemp",
    GameSakuraTravel = "yinxiao_sakuraTravel",

    LuckGiftOpen = "lucky_open",

    //大富翁-寻梦环游
    GameMonopolyJump = "yinxiao_monopoly_Jump",             //小人蹦跳
    GameMonopolyTeleport1 = "yinxiao_monopoly_Teleport1",   //T1小人瞬移
    GameMonopolyTeleport2 = "yinxiao_monopoly_Teleport2",   //T2小人瞬移
    GameMonopolyTeleport3 = "yinxiao_monopoly_Teleport3",   //T3小人瞬移
    GameMonopolyRollDice = "yinxiao_monopoly_RollDice",     //掷骰子
    GameMonopolyStartPoint = "yinxiao_monopoly_StartPoint", //路过起点
    GameMonopolyRainDoor = "yinxiao_monopoly_RainDoor",     //穿过彩虹门瞬间
    GameMonopolyBalloon = "yinxiao_monopoly_Balloon",       //热气球常驻音效
    GameMonopolyAimTarget = "yinxiao_monopoly_AimTarget",   //标记拦路者
    GameMonopolyCageOpen = "yinxiao_monopoly_CageOpen",     //笼门开启音效
    GameMonopolyCageClose = "yinxiao_monopoly_CageClose",   //笼门关闭音效
    GameMonopolyTurnPlate = "yinxiao_monopoly_TurnPlate",   //转盘转动
    GameMonopolyBoxOpen = "yinxiao_monopoly_BoxOpen",       //宝箱打开
    GameMonopolyBarricade = "yinxiao_monopoly_Barricade",   //放路障音效
    GameMonopolyLvUp = "yinxiao_monopoly_LvUp",             //游乐设施升级
    GameMonopolyBadge = "yinxiao_monopoly_Badge",           //点亮徽章音效
    GameMonopolyBadgeAll = "yinxiao_monopoly_BadgeAll",     //徽章集齐
    GameMonopolyLasso = "yinxiao_monopoly_Lasso",           //扔套圈

    //回归重聚
    CallbackGiftOpen = "yinxiao_callback_GiftOpen",         //红包打开音效
}
const { ccclass, property } = cc._decorator;
@ccclass
export default class SoundHelper {
    public static playSound(sound:SoundEffEnum | string) {
        Utils.audioManager.playSound(sound);
    }
}