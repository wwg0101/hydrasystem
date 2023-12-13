import { GoldMinerStoneType } from "../app/models/GameGoldMiner/goldMinerUICfg";
import { BaseItemSlot } from "./AppConstants";
export class Cfg_SmallGameParam {
    id: number;
    pindex: number;
    param: any;
}

export class CfgNormalItem {
    kind: number;
    id: number;
    count: number
}
export class Cfg_item {
    id//: 1,
    name//: "钻石",
    explain//: "璀璨钻石，游戏中的通用资源之一",
    icon//: 1,
    color//: 4,
    type//: ["user"],
    source//: "充值购买、排行榜膜拜、成就、每日签到、月卡、年卡",
    kind//: 1,
    is_bag//: 0,
    classify//: 1,
    iconopen//: 51,
    use//: 0,
    getWay//: [13,33,39,6500,68],
    sortId//: -1,
    is_red//: 0,
    up//: -1,
    is_activity//: 0,
    isUse//: 1,
    bag_use//: [251]
}

export class CfgShopItem {
    type: number; // 限购类型
    id: number;
    limit: number;
    buyNum: number;
    items: { kind: number; id: number; count: number };
    need: { kind: number; id: number; count: number }
}


// export enum CfgEnum_activeHDParam {
//     smallGame2056Limit = "smallGame2056Limit",//黄金矿工高级渔场积分限制
//     smallGame2056Vigor = "smallGame2056Vigor",//黄金矿工游戏体力恢复配置
//     smallGame2056Power = "smallGame2056Power",//黄金矿工游戏体力
//     smallGame2056ScoreItem = "smallGame2056ScoreItem",//黄金矿工积分道具id
//     smallGame2056VigorItemId = "smallGame2056VigorItemId",//黄金矿工恢复体力道具id
//     smallGame2056PowerItemId = "smallGame2056PowerItemId",//黄金矿工恢复耐力道具id
//     smallGame2056UniversalHook = "smallGame2056UniversalHook",//黄金矿工万能钩道具id
//     smallGame2056Torpedo = "smallGame2056Torpedo",//黄金矿工轻鱼雷道具id
//     smallGame2056FrozenLiquid = "smallGame2056FrozenLiquid",//黄金矿工冰冻液道具id
//     smallGame2056MaxPower = "smallGame2056MaxPower",//黄金矿工每一关耐久
//     smallGame2056PropsJumpItemIds = "smallGame2056PropsJumpItemIds",//黄金矿工道具商店跳转id数组


//     smallGame2056UniversalHookMaxUse = "smallGame2056UniversalHookMaxUse",//黄金矿工万能钩道具每关使用数量
//     smallGame2056TorpedoMaxUse = "smallGame2056TorpedoMaxUse",//黄金矿工轻鱼雷道具每关使用数量
//     smallGame2056FrozenLiquidMaxUse = "smallGame2056FrozenLiquidMaxUse",//黄金矿工冰冻液道具每关使用数量
//     smallGame2056PowerItemMaxUse = "smallGame2056PowerItemMaxUse",//黄金矿工体力道具每关使用数量
// }

//"id": 9000,
//"title": "翡冷翠之约",
//"iconUrl": "zjm_flczy",
//"iconName": "翡冷翠之约",
//"group": 3,
//"isTime": 0,
//"iconRank": 8,
//"url": "activity/gameCorn/GameCornActView_Main",
//"binding": [],
//"type": 9,
//"pram": 43,
//"errmsg": "通关剧情7-6开启",
//"tips": "",
//"text": "",
//"openParam": null,
//"jumpUrl": ""
//hdConf
export class Cfg_hdConf {
    id: number;
    title: string;
    iconUrl: string;
    iconName: string;
    group: number;
    isTime: number;
    iconRank: number;
    url: string;
    binding: string[];
    //skin: number;
    //content: string;
    //colorType: number;
    type: number;
    pram: number;
    errmsg: string;
    tips: string;
    text: string;
    openParam: any;
    jumpUrl: string;
    //detail: string;
    //numTrans: number;
    //RankTitle: string;
    //crossRankTitle: string;
    //currencyId: number;
    //activityBG: string;
    showType: number;
}

export class Cfg_ActivityLeiJiRwd {
    id: number;
    pindex: number;
    needScore: number;
    rwd: BaseItemSlot[];
}

//活动Item配置
export class Cfg_activeHDItem {
    id: number;
    pindex: number;
    level: number;
    rate: number;
    name: string;
    desc: string;
    score: number;
    icon: string;
    color: number;
    compose: number;
    breakdown: number;
    items: BaseItemSlot[];
    wifeFlower: number;
    wifeLove: number;
    addKungfu: number;
    boxRate: number;
}

//activeParamConf
export class Cfg_activeParamConf {

    smallGame2050OverScore: number;

    smallGame2052Multiple: any[];
    smallGame2052PowerItemId: number;
    smallGame2052Power: any;

    smallGame2053Multiple: any[];
    smallGame2053PowerItemId: number;
    smallGame2053Power: any;
}



//活动赠礼配置
export class Cfg_activeHDGift {
    pindex: number;
    title: string;
    conditionScore: number;
    conditionNum: number;
    giftChat: string;
    desc: string;
    items: BaseItemSlot[];
    goType: activeHDGiftGoType;
    resId: number;
    cloth: number;
    wishItemId: number;
    achieveId: number;
    titlesp: string;
    composetitle: string;
    todayNeedScore: number;

    secondGoType: number;
    secondResId: number;
    secondCloth: number;
    secondDayLimit: number;
    secondScore: number;
}

export class Cfg_hero {
    heroid: number;
    name: string;
    star: number;
    init_zz: {};
    sex: number;
    spec: number[];
    specMsg: string;
    txt: string;
    cv: string;
    model: string;
    modelsmail: string;
    fightModel: string;
    heroRes: string;
    heroIcon: string;
    heroIconYuan: string;
    storyId: number;
    ghSkills: [];
    disposition: number;
    voice: number;
    unlock: string;
    title: string;
    country: string;
    age: number;
    height: string;
    weight: string;
    tag: number[];
    unlock_type: number;
    unlock_condition: number;
    npcWeight: number;
    npcPos: string;
    PveSpeak: number[];
    skills: [];
    isDisplay: number;
    keyword: string;
    isParti: number;
    potential_skill: number[];
    recommend_condition: number;
    condition_value: number[];
    jump_to: number;
    wifeId: number[];
    halo_group: number;
    skillGroup: number;
    notice: number;
    levelupskill: number;
    cpid: number;
    background: string;
    effectBehind: string;
    effectFront: string;
    college: number[];
    clothes_judge: number;
}

export class Cfg_suit {
    suit_id: number;
    clothe: number[];
    clothe_state: number;
    cp_suit_state: number;
}

export enum activeHDGiftGoType {
    Wife = 1,
    Servant = 2,
    ServantCloth = 3,
}

//activeHDGoldMiner
export class Cfg_activeHDGoldMiner {
    id: GoldMinerStoneType;
    name: string;
    donateItemId: number;
    power_deduct: number;
    score: number;
    desc: string;
    icon: string;

    colliderType: number;//0 圆形 1方形
    colliderParam: any;

}
export class Cfg_activeHDGoldMinerLevel {
    id: number;
    mapName: string;
    target: number;
    reward: { count: number; id: number; kind: number }[]
}

export class Cfg_activeHDGoldMinerDonateLevel {
    id: number;
    target: number;
}

export class Cfg_activeHDGoldMinerDonateRate {
    id: number;
    extraDonate: number[];
    donateBase: number;
}

export class Cfg_activeHDGoldMinerDonateLvRwd {
    id: number;
    itemId: number;
    num: number;
}

export class Cfg_activeHDGoldMinerObj {
    id: number;
    type: GoldMinerStoneType;
    level: number;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    width: number;
    height: number;
    param: [];
    name: string;

    move1: { x: number, y: number }
    move2: { x: number, y: number }
}

export class cfg_activeHDTargetRwd {
    id: number; // 钓物id
    need: number[]; // 阶段需要数量
    items: { id: number; count: number; kind: number }[]; // 单次达标奖励
}

export class Cfg_starHallHeroClothes {
    id: number;
    clotheIDs: number[];
    rwdIDs: number;
    icon: string;
    name: string;
}

export class Cfg_starHallWifeClothes {
    id: number;
    clotheIDs: number[];
    rwdIDs: number;
    icon: string;
    name: string;
}

export class Cfg_hero_clothe {
    background: string;
    clothes_icon: string;
    exchange: BaseItemSlot;
    exchangeType: number;
    getmsg: string;
    getway: number;
    halo_group_id: number[];
    hero_id: number;
    iconid: string;
    id: number;
    ip_logo: string;
    is_defult: number;
    items: BaseItemSlot;
    lock_skillid: number[];
    lysound: string;
    model: string;
    name: string;
    sort: number;
    star: number;
    txt: string;
    unlock: BaseItemSlot;
    shopExchange: BaseItemSlot;
}

export class Cfg_soulmate_clothe {
    background: string;
    exchange: BaseItemSlot;
    exchangetype: number;
    fashion_type: number;
    getmsg: string;
    iconid: string;
    id: number;
    ip_logo: string;
    items: BaseItemSlot;
    lysound: string;
    modelid: string;
    name: string;
    shopicon: string;
    sort: number;
    star: number;
    storyModelid: string;
    txt: string;
    unlock: BaseItemSlot;
    use: number;
    wifeid: number;
    shopExchange: BaseItemSlot;
}

export class Cfg_home_fur {
    des: string;
    icon: number;
    id: number;
    isEmpty: number;
    is_default: number;
    max_level: number;
    model: furModelInfo[];
    name: string;
    recovery: BaseItemSlot;
    sortOne: number;
    sortTwo: number;
    starNum: number;
    style: number[];
    suit_id: number;
    suitname: string;
    shopExchange: BaseItemSlot;
}

export class furModelInfo {
    index: number;
    mode: string;
}

export class Cfg_officer {
    id: number;
    name: string;
    need_eXP: number;
    zw_exp: number;
    qianAn: number;
    heroid: number;
    condition: number[];
    buttontext: string;
    storyid: string;
    workchange: string;
    zwhuoban: number[];
    shizhuang: any[];
    chenghu: string;
    pray: number;
    haoyou_num: number;
    award: number;
    vip_function_0: number;
    vip_function_1: number;
    vip_function_4: number;
    vip_function_21: number;
    vip_function_33: number;
    vip_function_10: number;
    vip_function_12: number;
    vip_function_42: number;
    vip_function_43: number;
    vip_function_46: number;
    vip_function_47: number;
    vip_function_49: number;
    vip_function_34: number;
    vip_function_53: number;
    vip_function_54: number;
    vip_function_41: number;
    vip_function_13: number;
    vip_function_70: number;
    vip_function_60: number;
    vip_function_50: number;
    vip_function_40: number;
    vip_function_80: number;
    vip_function_85: number;
    rewardtx: number;
    rewardtxk: number;
    rewardltk: number;
    boite: number;
    play_energy: number;
    play_energy_time: number;
    rdw: any;
    animation: string;
    zs_project: number;
    zs_yield: number;
    zs_buff: number;
    gain: any[];
}

export class Cfg_fashion_wear_process {
    id: number;
    clothes_type: number;
    fashion_type: number;
    collect_process: number;
    process_rwd: BaseItemSlot[];
}

export class Cfg_HeroHaloSkill {
    skill_id: number;
    skill_name: string;
    icon: string;
    des: string;
    other_des: string;
    skill_type: number;
    skill_att: Map<number, number>;
    add_type: number;
    skill_maxlv: number;
    lvup_type: number;
    lvup_item: number;
    clothes_collect_id: number[];
    type_number: number;
    unlock_type: number;
    unlock: Map<number, number>;
    unlock_lv: number;
    unlock_des: string;
    sort: number;
}

export class Cfg_HaloGroup {
    halo_group_id: number;
    halogroup_name: string;
    halo_group_skill: number[];
    halo_group_title: string;
    halo_group_type: number;
}

export class Cfg_sgtn_item_pool {
    id: number;
    level: number;
    type: number;
    subType: number;
    item: BaseItemSlot;
}

export class Cfg_sgtn_list {
    level: number;
    consumeCount: number;
    layer: number;
    count: number;
}

export class cfg_wife {
    manid: number;
    picterid: string;
    iconid: string;
    iconid2: string;
    listid: string;
    label: string;
    name: string;
    soulmatebg: string;
    magazine: string;
    height: number;
    status: string;
    birthday: string;
    tag: string;
    soulmate_cv: string;
    aside_cv: string;
    story: {id: string, pro: number};
    wflower: number[];
    from: string;
    errmsg:string;
    from_chat: string;
    cv: string;
    date: string;
}

export class cfg_wifeCard{
    id: number;
    name: string;
    isOpen: number;
    wifeid: number;
    sort: number;
    quality: number;
    pos: {"s": number, "x": number, "y": number};
    tips: string;
    speed: number;
    kind: number;
    skillid: number[];
    tiaozhuan: number;
    cardtxt: string;
}

export class cfg_storyBookSet {
    set_id: number;
    name: string;
    type: number;
    pram: number;
    errms: string;
    is_open: number;
}

export class cfg_storyBook {
    id: number;
    tag_name: string;
    tag_show: string;
    name: string;
    set_id: number;
    type: number;
    pram: number;
    errms: string;
    is_open: number;
}

export class cfg_storyBookPart {
    id: number;
    part_id: number;
    chapter_id: number;
    desc: string;
    icon_head: string;
    icon_bg: string;
    unlock: BaseItemSlot;
    fight: number;
    story_id: number;
    enemy_name: string;
    beijing: string;
    bgm: string;
    spine: string;
    enemy_talk: string;
    take_off: any[];
}

export class cfg_clothPveChapter {
    id: number;
    name: string;
    back: number;
    msg: number[];
    time: number[];
}

export class cfg_hero {
    heroid: number;
    name: string;
    star: number;
    init_zz: Map<string,number>;
    sex: number;
    spec: number[];
    specMsg: string;
    txt: string;
    cv: string;
    model: string;
    modelsmail: string;
    fightModel: string;
    heroRes: any;
    heroIcon: string;
    heroIconyuan: string;
    storyId: number;
    ghSkills: any[];
    disposition: number;
    voice: number;
    unlock: string;
    title: string;
    country: string;
    age:number;
    height: string;
    weight: string;
    tag: number[];
    unlock_type: number;
    unlock_condition: number;
    npcWeight: number;
    npcPos: string;
    PveSpeak: number[];
    skills:Map<string, number>;
    isDisplay: number;
    keyword: string;
    isParti: number;
    potential_skill: number[];
    recommend_condition: number;
    condition_value: number[];
    jump_to: number;
    wifeId: number[];
    halo_group: number;
    skillGroup: number;
    notice: number;
    levelupskill: number;
    cpid: number;
    background: any;
    effectBehind: any;
    effectFront: any;
    college: number[];
    clothes_judge: number;
}

export class cfg_ruler {
    id: number;
    name: string;
    getWay: number[];
    quality: number;
    initialZizhi: number;
    initialSkill: number;
    baseSkill: number[];
    maxSkillNum: number;
    advanceSkill: number[];
    desc: string;
    halo: number[];
    picterid: string;
    iconid: string;
    bs_iconId: string;
    static_iconId: string;
    items: BaseItemSlot[];
    level_upZizhi: number;
    levelmax: number;
    can_decompose: number;
    group_type: number;
    has_special_awake: number;
}

//#region 大富翁配置
export class Cfg_sgr_richScene {
    id: number;
    next: number;
    locationID: number;
    pathID: number;
    pos: number[];
    uiPos: number[];
    img: string;
    direction: number;
    clickPointList: number[][];
}

export class Cfg_sgr_richMainPath {
    id: number;
    pos: number[];
}

export class Cfg_sgr_richSubPath {
    id: number;
    next: number;
    groupID: number;
    isEnd: number;
    rwd: BaseItemSlot;
    rwd2: BaseItemSlot[];
    pos: number[];
}

export class Cfg_sgr_richLocation {
    id: number;
    name: string;
    stayGet: BaseItemSlot[];
    passByGet: BaseItemSlot[];
    randCount: number;
    role: number;
    roleName: string;
    dialogue: string;
    param:any;
}

export class Cfg_sgr_richIcon{
    id: number;
    name: string;
    need: number;
    skillDesc: string;
    skillCount: number;
    canFlash: number;
    canOnekey: number;
    isDefault: number;
    image: string;
}

export class Cfg_sgr_richDreamLevel{
    id: number;
    name: string;
    need: number;
    rwd:BaseItemSlot[];
    dreamSkill:number[]
}

export class Cfg_sgr_richDreamSkill{
    id: number;
    type: number;
    level: number;
    name: string;
    skillDesc: string;
    skillCount: number;
    dreamLevel: number;
}

export class Cfg_sgr_richBadge{
    id: number;
    type: number;
    place: number;
    icon: number;
    itemId: number;
    name: string;
}

export class Cfg_sgr_richBadgeRwd{
    id: number;
    type: number;
    need: number;
    rwd: BaseItemSlot[];
}

export class Cfg_sgr_richTradeRwdPool{
    id: number;
    need: BaseItemSlot;
    reward: BaseItemSlot;
}

export class Cfg_sgr_richBattle{
    locationID: number;
    name: string;
    hp: number;
    iconID: number;
    attackRwd: BaseItemSlot[];
    killRwd: BaseItemSlot[];
    randRwdList: BaseItemSlot[];
    ranCount: number;
}

export class Cfg_sgr_richBuild{
    locationID: number;
    name: string;
    rwd: BaseItemSlot[];
    upgradeRwd: BaseItemSlot[];
    level: number;
    cost: BaseItemSlot;
}

export class Cfg_sgr_richBuildStageRwd{
    id: number;
    locationID: number;
    level: number;
    rwd: BaseItemSlot[];
    imageLevel: number;
}

export class Cfg_sgr_richGift {
    id: number;
    name: string;
    dc: number;
    type: number;
    need: BaseItemSlot;
    cost: BaseItemSlot;
    profit: string;
    item: BaseItemSlot[];
    desc: string;
}
//#endregion

export class cfg_clubBuild {
    id: number;
    pay: BaseItemSlot;
    payType: number;
    msg: string;
    get: BaseItemSlot[];
    donate: number;
    limit: number;
    cd: number;
    icon: string;
    yueka: number;
    nianka: number;
}

export class cfg_travelEvent {
    id: number;
    name: string;
    type: number;
    storyid: any;
    hero_id: number;
    wifecardID: number;
    award: BaseItemSlot[];
    herocount: number;
    award_ep: any[];
    award_zep: any[];
    power: number;
    pro: number;
    des: string;
    des_relation: string;
    build_id: number;
    children_id: number;
}

export class cfg_playerBack_cofig {
    id: number;
    key: string;
    name: string;
    data: string;
}

export class cfg_playerBack_reCallRwdCfg {
    id: number;
    need: number;
    rwd: BaseItemSlot[];
}

export class cfg_playerBack_taskCfg {
    id:number;
    type: number;
    name:string;
    need: number;
    rwd: BaseItemSlot[];
    jumpTo:number;
    icon:string;
}
export class cfg_playerBack_cumCashRwdCfg {
    id: number;
    need: number;
    rwd: BaseItemSlot[];
}

export class cfg_playerBack_loginRwdCfg {
    id: number;
    rwd: BaseItemSlot[];
}