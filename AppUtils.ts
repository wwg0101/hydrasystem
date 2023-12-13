// app 通用工具类
declare let require, localdb, localcache, MD5, i18n, proto_cs;
const Utils = require("../app/utils/Utils")
const UIUtils = require("../app/utils/UIUtils");
const PopUIHelper = require("../app/utils/PopUIHelper");
const ResManager = require("../app/utils/ResManager");
// import ProxyManager from "../ProxyManager";
// import { PanelType } from "../../framework/PanelConfig";
// import { UIControl } from "../../framework/UIControlManager";
// import TimeUtil from "../../fromework/TimeUtil";
// import { AnimPlayState, BaseItemSlot, BaseResourceType, CommonCostConfirmData, ConditionTType, ConfirmData, ConfirmNameInputViewData, CurrencyItem, DataType, ItemSlotData, RecruitState, ServerError, UserSex } from "../AppConstants";
// import SaveKeyConstants from "../SaveKeyConstants";
// import UiUtils from "./../../fromework/UiUtils";
// import UIHelps from "./UIHelps";
// import FwUtils, { DoubleKeyDic } from "./../../fromework/FwUtils";
// import { AlertUtils } from "./AlertUtils";
// import ShaderUtils from "./ShaderUtils";
import { TimerManager } from "./TimerManager";
// import NetManager from "../../framework/NetManager";
 import HDebug from "./HDebug";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AppUtils {
    private static s_bHasAutoSizeInfo: boolean = false;
    public static s_AutoSizeInfo = null;
    public static HasAutoSizeInfo(): boolean {
        return AppUtils.s_bHasAutoSizeInfo;
    }
    public static SetAutoSizeInfo(info) {
        AppUtils.s_AutoSizeInfo = info;
        AppUtils.s_bHasAutoSizeInfo = true;
    }

    public static GetAutoSizeInfo() {
        return AppUtils.s_AutoSizeInfo;
    }

    public static getIcon(kind, id) {
        return UIUtils.uiHelps.getItemSlot(id);
    }
    
    public static showConfirm(str, successCb, failCb) {
        PopUIHelper.helper.showConfirmMsg(str, function (param) {
            if (param == "OK"){
                successCb && successCb();
            }else if(param == "Cancel"){
                failCb && failCb();
            }
        });
    }

    public static addPrefabEffect( url: string, callback: Function){
        ResManager.getInstance().loadResource(url, cc.Prefab, (error, prefab)=> {
            if(error != null){
                cc.log("----!!error addPrefabEffect----", error);
                return;
            }

            let node:cc.Node = cc.instantiate(prefab);
            callback(node);
        });
    }

    public static playAniClipByIndex(node: cc.Node, callback: Function, clipIndex: number){
        let anime = node.getComponent(cc.Animation);
        if (anime) {
            let clips = anime.getClips();
            let clip = clips[clipIndex];
            if (!clip) {
                cc.log("动画效果不存在 ", clipIndex);
                return;
            }
            anime.on(cc.Animation.EventType.FINISHED, ()=>{
                callback();
            });
            anime.play(clip.name);
        }
    }

    // public static screenShotimagePath: string = "";
    // /**
    //  * 打印cache
    //  * @param targetType 
    //  */
    // public static dumpCache(targetType: any) {
    //     let cache = cc.loader["_cache"];
    //     for (let key in cache) {
    //         let e = cache[key];
    //         if (e.type == targetType) {
    //             HDebug.Log(e);
    //         }
    //     }
    // }

    // //#region UI相關
    // /**
    //  * 通过 itemData 获取slots的图标路径
    //  * @param itemData 
    //  */
    // public static getSlotUrlByItemData(itemData: any): string {
    //     let t = itemData;
    //     if (t == null) {
    //         HDebug.Error("getSlotUrlByItemData: itemData null");
    //         return;
    //     }

    //     let cloneId = t.id ? t.id : t.itemid;
    //     switch (t.kind) {
    //         case DataType.HERO:
    //         case DataType.NEW_HERO:
    //         case DataType.CHARACTER_HERO:
    //         case DataType.HERO_JB:
    //         case DataType.HERO_SW:
    //         case DataType.BOOK_EXP:
    //         case DataType.SKILL_EXP:
    //             {
    //                 let e = localcache.getItem(localdb.table_hero, cloneId);
    //                 if (!e) {
    //                     HDebug.Error("找不hero数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getHeroHead(e.modelid);
    //             }
    //         case DataType.WIFE:
    //         case DataType.NEW_WIFE:
    //         case DataType.CHARACTER_WIFE:
    //         case DataType.WIFE_EXP:
    //         case DataType.WIFE_FLOWER:
    //         case DataType.WIFE_JB:
    //         case DataType.WIFE_LOVE:
    //             {
    //                 let e = localcache.getItem(localdb.table_wife, cloneId);
    //                 if (!e) {
    //                     HDebug.Error("找不wife数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getHeroHead(e.res);
    //             }
    //         case DataType.HEAD_BLANK:
    //             {
    //                 let o = localcache.getItem(
    //                     localdb.table_userblank,
    //                     cloneId
    //                 );
    //                 if (!o) {
    //                     HDebug.Error("找不userblank数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return o ? UIHelps.getBlank(o.blankmodel) : "";
    //             }
    //         case DataType.CLOTHE:
    //             {
    //                 let cfg = localcache.getItem(localdb.table_userClothe, cloneId);
    //                 if (!cfg) {
    //                     HDebug.Error("找不CLOTHE数据: ", cloneId);
    //                     return null;
    //                 }
    //                 let iconName = ProxyManager.getInstance().playerProxy.sex === UserSex.Male ? cfg.iconMale : cfg.iconFemale;
    //                 return UIHelps.getRolePart(iconName);
    //             }
    //         case DataType.JB_ITEM:
    //             {
    //                 let l = localcache.getItem(localdb.table_heropve, cloneId);
    //                 if (!l) {
    //                     HDebug.Error("找不JB_ITEM数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getServantHead(l.roleid);
    //             }
    //         case DataType.ENUM_ITEM:
    //             {
    //                 //1.28新规则，kind=2的道具，显示资源时，先去item表里找，然后读对应的icon去resIcon里找；
    //                 let ItemCfg = localcache.getItem(
    //                     localdb.table_item,
    //                     cloneId + ""
    //                 );
    //                 if (!ItemCfg) {
    //                     HDebug.Error("找不ITEM数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getResIcon(ItemCfg ? ItemCfg.icon : cloneId);
    //             }
    //         case DataType.PET:
    //             {
    //                 let l = ConfigFinder.Find<Cfg_Pet>(localdb.table_pet, cloneId);
    //                 if (!l) {
    //                     HDebug.Error("找不到PET数据:", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getPetResIcon(l.modelId);
    //             }
    //         case DataType.BUBBLE:
    //             {
    //                 return UIHelps.getBubbleIcon(cloneId);
    //             }
    //         case DataType.HEAD_FRAME:
    //             {
    //                 return UIHelps.getHeadFrameIcon(cloneId);
    //             }
    //         default:
    //             {
    //                 let r = localcache.getItem(localdb.table_item, cloneId + "");
    //                 if (!r) {
    //                     HDebug.Error("找不ITEM数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getItemSlot(r ? r.icon : cloneId);
    //             }
    //     }
    // }

    // /**
    //  * 通过itemData获取灵宠/人物 spine路径
    //  * @param itemData 
    //  */
    // public static getSpineUrlByItemData(itemData: any): string {
    //     var t = itemData;
    //     var cloneId = t.id ? t.id : t.itemid;
    //     if (t)
    //         switch (t.kind) {
    //             case DataType.HERO:
    //             case DataType.NEW_HERO:
    //             case DataType.CHARACTER_HERO:
    //             case DataType.HERO_JB:
    //             case DataType.HERO_SW:
    //             case DataType.BOOK_EXP:
    //             case DataType.SKILL_EXP:
    //                 var e = localcache.getItem(localdb.table_hero, cloneId);
    //                 if (!e) {
    //                     HDebug.Error("找不hero数据: ", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getServantSpine(e.modelid);

    //             case DataType.WIFE:
    //             case DataType.NEW_WIFE:
    //             case DataType.CHARACTER_WIFE:
    //             case DataType.WIFE_EXP:
    //             case DataType.WIFE_FLOWER:
    //             case DataType.WIFE_JB:
    //             case DataType.WIFE_LOVE:
    //                 return ProxyManager.getInstance().wifeProxy.getWifeModel(cloneId);
    //             case DataType.PET:
    //                 var l = ConfigFinder.Find<Cfg_Pet>(localdb.table_pet, cloneId);
    //                 if (!l) {
    //                     HDebug.Error("找不到PET数据:", cloneId);
    //                     return null;
    //                 }
    //                 return UIHelps.getPetModelByModelId(l.modelId);
    //             default:
    //                 HDebug.Error("找不到相关spine路径: ", itemData);
    //                 return "";
    //         }
    // }

    // /**
    // * 合并道具list中的同类项,合并只适用于DataType为1（普通道具）和2（枚举资源）的道具，其他原样拷贝
    // * @param itemList 
    // */
    // public static sortItemList(itemList: BaseItemSlot[]): BaseItemSlot[] {
    //     let newlist = [];
    //     for (let key = 0; key < itemList.length; key++) {
    //         let isfind = false;
    //         for (let index = 0; index < newlist.length; index++) {
    //             if (newlist[index].id == itemList[key].id
    //                 && newlist[index].kind == itemList[key].kind && newlist[index].kind <= DataType.ENUM_ITEM) {
    //                 newlist[index].count += itemList[key].count;
    //                 isfind = true;
    //             }
    //         }
    //         if (!isfind) {
    //             let data = FwUtils.cloneDeep(itemList[key]);
    //             newlist.push(data);
    //         }
    //     }
    //     return newlist;
    // }

    // //道具品质从高到低排序，非道具(kind不等于1和2)排在前面
    // public static sortItemListByQuality(itemList: BaseItemSlot[]): BaseItemSlot[] {
    //     let newlist = this.sortItemList(itemList);
    //     newlist.sort((itemA, itemB) => {
    //         if ((itemA.kind == DataType.ITEM || itemA.kind == DataType.ENUM_ITEM)
    //             && (itemB.kind == DataType.ITEM || itemB.kind == DataType.ENUM_ITEM)) {
    //             let ItemCfgA = ConfigFinder.Find<Cfg_item>(localdb.table_item, itemA.id);
    //             let ItemCfgB = ConfigFinder.Find<Cfg_item>(localdb.table_item, itemB.id);
    //             return ItemCfgB.color - ItemCfgA.color;
    //         }
    //         else if (itemA.kind != DataType.ITEM && itemA.kind != DataType.ENUM_ITEM) {
    //             return -1;
    //         }
    //         else {
    //             return 1;
    //         }
    //     })
    //     return newlist;
    // }

    // //物品相关
    // public static isSpKind(kind) {
    //     return (
    //         kind == DataType.HEAD_BLANK ||
    //         kind == DataType.HERO ||
    //         kind == DataType.NEW_HERO ||
    //         kind == DataType.CHARACTER_HERO ||
    //         kind == DataType.WIFE ||
    //         kind == DataType.NEW_WIFE ||
    //         kind == DataType.CHARACTER_WIFE ||
    //         kind == DataType.CLOTHE ||
    //         kind == DataType.WIFE_EXP ||
    //         kind == DataType.WIFE_FLOWER ||
    //         kind == DataType.WIFE_JB ||
    //         kind == DataType.WIFE_LOVE ||
    //         kind == DataType.HERO_JB ||
    //         kind == DataType.HERO_SW ||
    //         kind == DataType.BOOK_EXP ||
    //         kind == DataType.SKILL_EXP ||
    //         kind == DataType.HEAD_FRAME ||
    //         kind == DataType.BUBBLE ||
    //         kind == DataType.TITLE ||
    //         kind == DataType.BADGE
    //     );
    // }

    // //物品相关
    // public static isSpKindName(type) {
    //     return (
    //         type == DataType.HEAD_BLANK ||
    //         type == DataType.HERO ||
    //         type == DataType.NEW_HERO ||
    //         type == DataType.CHARACTER_HERO ||
    //         type == DataType.WIFE ||
    //         type == DataType.NEW_WIFE ||
    //         type == DataType.CHARACTER_WIFE ||
    //         type == DataType.CLOTHE ||
    //         type == DataType.JB_ITEM
    //     );
    // }

    // //物品扫光判定用
    // public static CheckIsSuperPet(kind: number, itemID: number): boolean {
    //     if (kind == DataType.PET) {
    //         let petId = itemID;
    //         let petCfg = ConfigFinder.Find<Cfg_Pet>(localdb.table_pet, petId);
    //         return petCfg.quality >= 5;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    // //物品扫光判定用
    // public static CheckIsSuperHero(kind: number, itemID: number): boolean {
    //     if (kind == DataType.HERO ||
    //         kind == DataType.NEW_HERO ||
    //         kind == DataType.CHARACTER_HERO) {
    //         let heroId = itemID;
    //         let heroCfg = ConfigFinder.Find<Cfg_Hero>(localdb.table_hero, heroId);
    //         return heroCfg.star >= 4;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    // //物品扫光判定用
    // public static CheckIsSuperWife(kind: number, itemID: number): boolean {
    //     if (kind == DataType.WIFE ||
    //         kind == DataType.NEW_WIFE ||
    //         kind == DataType.CHARACTER_WIFE) {
    //         let wifeId = itemID;
    //         let wifeCfg = ConfigFinder.Find<Cfg_wife>(localdb.table_wife, wifeId);
    //         return wifeCfg.quality >= 4;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // public static getIcon(kind, itemID) {
    //     switch (kind) {
    //         case DataType.HERO:
    //         case DataType.NEW_HERO:
    //         case DataType.CHARACTER_HERO:
    //         case DataType.HERO_JB:
    //         case DataType.HERO_SW:
    //         case DataType.BOOK_EXP:
    //         case DataType.SKILL_EXP:
    //             {
    //                 let e = localcache.getItem(localdb.table_hero, itemID);
    //                 if (!e) {
    //                     HDebug.Error("找不hero数据: ", itemID);
    //                     return null;
    //                 }
    //                 return UIHelps.getHeroHead(e.modelid);
    //             }
    //         case DataType.WIFE:
    //         case DataType.NEW_WIFE:
    //         case DataType.CHARACTER_WIFE:
    //         case DataType.WIFE_EXP:
    //         case DataType.WIFE_FLOWER:
    //         case DataType.WIFE_JB:
    //         case DataType.WIFE_LOVE:
    //             {
    //                 let e = localcache.getItem(localdb.table_wife, itemID);
    //                 if (!e) {
    //                     HDebug.Error("找不wife数据: ", itemID);
    //                     return null;
    //                 }
    //                 return UIHelps.getHeroHead(e.res);
    //             }
    //         case DataType.HEAD_BLANK:
    //             {
    //                 let o = localcache.getItem(
    //                     localdb.table_userblank,
    //                     itemID
    //                 );
    //                 if (!o) {
    //                     HDebug.Error("找不userblank数据: ", itemID);
    //                     return null;
    //                 }
    //                 return o ? UIHelps.getBlank(o.blankmodel) : "";
    //             }
    //         case DataType.CLOTHE:
    //             {
    //                 let cfg = localcache.getItem(localdb.table_userClothe, itemID);
    //                 if (!cfg) {
    //                     HDebug.Error("找不CLOTHE数据: ", itemID);
    //                     return null;
    //                 }
    //                 let iconName = ProxyManager.getInstance().playerProxy.sex === UserSex.Male ? cfg.iconMale : cfg.iconFemale;
    //                 return UIHelps.getRolePart(iconName);
    //             }
    //         case DataType.JB_ITEM:
    //             {
    //                 var l = localcache.getItem(localdb.table_heropve, itemID);
    //                 if (!l) {
    //                     HDebug.Error("找不JB_ITEM数据: ", itemID);
    //                     return null;
    //                 }
    //                 return UIHelps.getServantHead(l.roleid);
    //             }
    //         case DataType.ENUM_ITEM:
    //             {
    //                 //1.28新规则，kind=2的道具，显示资源时，先去item表里找，然后读对应的icon去resIcon里找；
    //                 let ItemCfg = localcache.getItem(
    //                     localdb.table_item,
    //                     itemID + ""
    //                 );
    //                 if (!ItemCfg) {
    //                     HDebug.Error("找不ITEM数据: ", itemID);
    //                     return null;
    //                 }
    //                 return UIHelps.getResIcon(ItemCfg ? ItemCfg.icon : itemID);
    //             }
    //         case DataType.PET:
    //             {
    //                 let l = ConfigFinder.Find<Cfg_Pet>(localdb.table_pet, itemID);
    //                 if (!l) {
    //                     HDebug.Error("找不到PET数据:", itemID);
    //                     return null;
    //                 }
    //                 return UIHelps.getPetResIcon(l.modelId);
    //             }
    //         case DataType.WIFE_CLOTH:
    //             {
    //                 let l = localcache.getItem(localdb.table_wifeUser, itemID);
    //                 if (!l) {
    //                     HDebug.Error("找不到WIFE_CLOTH数据:", itemID);
    //                     return null;
    //                 }
    //                 let iconName = l.model;
    //                 return UIHelps.getRolePart(iconName);
    //             }
    //         case DataType.GuessLanternItem:
    //             {
    //                 let cfg: Cfg_activeHDItem = ConfigFinder.Find<Cfg_activeHDItem>(localdb.table_activeHDItem, itemID);
    //                 HDebug.Assert(null != cfg, "Cfg_activeHDItem is null, id is " + itemID);
    //                 return UIHelps.getActivityItemIcon(cfg.icon);
    //             }
    //         case DataType.ManorFanRongIcon:
    //             {
    //                 return UIHelps.getManorFanRongIcon();
    //             }
    //         case DataType.StoneGamblingOriginStone:
    //             {
    //                 return UIHelps.getStoneGamblingSeedIcon(itemID);
    //             }
    //         case DataType.HEAD_FRAME:
    //             {
    //                 return UIHelps.getHeadFrameIcon(itemID);
    //             }
    //         case DataType.BUBBLE:
    //             {
    //                 return UIHelps.getBubbleIcon(itemID);
    //             }
    //         case DataType.TITLE:
    //             {
    //                 return UIHelps.getHeadTitleIcon(itemID);
    //             }
    //         case DataType.BADGE:
    //             {
    //                 return UIHelps.getBadgeIcon(itemID);
    //             }
    //         case DataType.DANYAO:
    //             {
    //                 return null;
    //             }
    //         default:
    //             {
    //                 let r = localcache.getItem(
    //                     localdb.table_item,
    //                     itemID + ""
    //                 );
    //                 if (!r) {
    //                     HDebug.Error("找不ITEM数据: ", itemID);
    //                     return null;
    //                 }
    //                 return UIHelps.getItemSlot(r ? r.icon : itemID);
    //             }
    //     }
    // }
    // //#endregion

    // //#region 截圖有關
    // public static ShareCapture(camera: cc.Camera, captureNode: cc.Node, captureSuccessCB) {
    //     let url = "gb/prefabs/ui/share/CaptureView";
    //     UiUtils.loadPrefab(captureNode, url, (err, node) => {
    //         if (null == captureNode || !captureNode.isValid) {
    //             return;
    //         }
    //         if (err) {
    //             return;
    //         }
    //         node.parent = captureNode;
    //         node.x = 0;
    //         node.y = 0;
    //         node.scale = 1;
    //         let spriteFrame = AppUtils.ScreenShot(camera, captureNode, 0.7, true);
    //         UIControl.JumpToPanel(PanelType.ShareSelectView, {
    //             spriteFrame: spriteFrame, openCB: () => {
    //                 node.destroy();
    //                 if (null != captureSuccessCB) captureSuccessCB();
    //             }
    //         });
    //     });
    // }

    // public static ScreenShot(camera: cc.Camera, captureNode: cc.Node, scale: number = 1, saveFile: boolean = false): cc.SpriteFrame {
    //     //initTexture
    //     let texture = new cc.RenderTexture();
    //     let textureWidth = captureNode.width * 0.7;
    //     let textureHeight = captureNode.height * 0.7;
    //     texture.initWithSize(textureWidth, textureHeight, cc.gfx.RB_FMT_S8);
    //     camera.targetTexture = texture;
    //     // create the capture
    //     camera.node.active = true;
    //     camera.render(captureNode);

    //     let data = texture.readPixels();
    //     let picData = this.filpYImage(data, texture.width, texture.height);

    //     let spriteFrame = this.createSpriteFrame(picData, textureWidth, textureHeight);
    //     camera.node.active = false;
    //     let picName = "Test";
    //     this.saveFile(picData, textureWidth, textureHeight, picName);
    //     return spriteFrame;
    // }

    // // override init with Data
    // private static createSpriteFrame(picData, width: number, height: number): cc.SpriteFrame {
    //     let texture = new cc.Texture2D();
    //     texture.initWithData(picData, 32, width, height);

    //     let spriteFrame = new cc.SpriteFrame();
    //     spriteFrame.setTexture(texture);

    //     return spriteFrame;
    // }

    // private static saveFile(picData, picWidth: number, picHeight: number, picName: string) {
    //     if (CC_JSB) {
    //         let filePath = jsb.fileUtils.getWritablePath() + picName + '.png';
    //         //@ts-ignore
    //         let success = jsb.saveImageData(picData, picWidth, picHeight, filePath);
    //         if (success) {
    //             this.screenShotimagePath = filePath;
    //         }
    //     }
    // }

    // // This is a temporary solution
    // private static filpYImage(data, width, height) {
    //     // create the data array
    //     let picData = new Uint8Array(width * height * 4);
    //     let rowBytes = width * 4;
    //     for (let row = 0; row < height; row++) {
    //         let srow = height - 1 - row;
    //         let start = srow * width * 4;
    //         let reStart = row * width * 4;
    //         // save the piexls data
    //         for (let i = 0; i < rowBytes; i++) {
    //             picData[reStart + i] = data[start + i];
    //         }
    //     }
    //     return picData;
    // }
    // //#endregion

    // /**
    //  * 充值统一入口
    //  * @param configData 读charge表拿到的数据
    //  */
    // public static payProduct(configData, callback?: (isSuc: boolean) => void) {
    //     cc.log("---payProduct---", configData);
    //     ProxyManager.getInstance().welfareProxy.getOrderInfo(configData, callback);
    // }

    // public static generatorUuid() {
    //     function S4() {
    //         return (((1 + Math.random() + Date.now()) * 0x10000) | 0).toString(16).substring(1);
    //     }
    //     function guid() {
    //         return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    //     }
    //     return guid();
    // }

    // /**
    //  * 发送服务器埋点数据
    //  * @param sdkEvent 
    //  * @param callback 
    //  */
    // public static sendSDKEventLogToserver(sdkEvent: string = "", callback?: () => void): void {
    //     let report_url = ServerConfig.report_url;
    //     HDebug.Log("skdEvent: ", sdkEvent);
    //     if (report_url == undefined || report_url == "") {
    //         return;
    //     }

    //     let uuid = AppUtils.getRanUUID();
    //     // 当前时间 + 事件名称 + 用户UUid
    //     let time = TimeUtil.getInstance().second,
    //         source = "#987&(*DASFIASE#@&^(@(*&(*@hkljhASDF" + time + uuid,
    //         tags = cc.sys.localStorage.getItem(uuid);

    //     try {
    //         tags = JSON.parse(tags) || [];
    //     } catch (e) {
    //         tags = [];
    //     }
    //     if (tags.indexOf(sdkEvent) !== -1) {
    //         return;
    //     }
    //     tags.push(sdkEvent);
    //     let value = MD5.md5(source);
    //     let str = "";
    //     try {
    //         str = JSON.stringify({
    //             sign: value,
    //             type: sdkEvent,
    //             time: time,
    //             code: uuid
    //         });
    //         tags = JSON.stringify(tags);
    //     } catch (e) {
    //         str = "";
    //         tags = [];
    //     }
    //     cc.sys.localStorage.setItem(uuid, tags);

    //     NetManager.getInstance().post(report_url, str, (msg) => {
    //         callback && callback();
    //     });
    // }

    // //#region 本地讀取， 還有取表
    // public static SaveLocalBoolean(key: SaveKeyConstants, bol: boolean) {
    //     ProxyManager.getInstance().timeProxy.saveLocalValue(key, bol);
    // }

    // public static LoadLocalBoolean(key: SaveKeyConstants): boolean {
    //     let bol = ProxyManager.getInstance().timeProxy.getLoacalValue(key);
    //     return "true" == bol ? true : false;
    // }

    // public static getParamStr(key) {
    //     var paramItem = localcache.getItem(localdb.table_param, key);
    //     HDebug.Assert(null != paramItem, "getParamStr Null, key:" + key + " param表沒有key:" + key);
    //     return paramItem ? paramItem.param + "" : "";
    // }

    // public static getParamInt(key) {
    //     var paramItem = localcache.getItem(localdb.table_param, key);
    //     HDebug.Assert(null != paramItem, "getParamInt Null, key:" + key + " param表沒有key:" + key);
    //     return paramItem ? parseInt(paramItem.param) : 0;
    // }

    // public static getParamNumber(key) {
    //     var paramItem = localcache.getItem(localdb.table_param, key);
    //     HDebug.Assert(null != paramItem, "getParamNumber Null, key:" + key + " param表沒有key:" + key);
    //     return paramItem ? Number(paramItem.param) : 0;
    // }

    // public static getParamIntArray(key): number[] {
    //     let list: number[] = [];
    //     let item = localcache.getItem(localdb.table_param, key);
    //     HDebug.Assert(null != item, "[ConfigItem]")
    //     let paramItem = item.param;
    //     paramItem = paramItem.split("[")[1];
    //     paramItem = paramItem.split("]")[0];
    //     let paramlist = paramItem.split(",");

    //     for (let index = 0; index < paramlist.length; index++) {
    //         const element = paramlist[index];
    //         list.push(parseInt(element));
    //     }
    //     return list;
    // }

    // public static getParamStrs(t, e, i) {
    //     void 0 === e && (e = "|");
    //     void 0 === i && (i = ",");
    //     for (
    //         var n = this.getParamStr(t).split(e), l = [], r = 0;
    //         r < n.length;
    //         r++
    //     )
    //         if (FwUtils.isBlank(i)) l.push(n[r]);
    //         else {
    //             for (
    //                 var a = n[r].split(i), s = [], c = 0;
    //                 c < a.length;
    //                 c++
    //             )
    //                 s.push(a[c]);
    //             l.push(s);
    //         }
    //     return l;
    // };
    // //#endregion

    // //#region UI相關
    // /**
    //  * 加头像cell
    //  * @param parent 
    //  * @param data 
    //  * @param call 
    //  */
    // public static addHeadCell(parent: cc.Node, data: UserHeadCellData, call?: Function) {
    //     let comp = AppUtils.getComp<UserHeadCell>(parent, CompUIType.UserHeadCell);
    //     comp.setData(data);
    //     return comp;
    // }

    // /**
    //  * 传入节点，往节点上同步生成对应组件prefab并返回组件给调用者
    //  * 使用者需要往CommonUIPrefabs的目录加对应prefab
    //  * @param parent 挂组件的节点
    //  * @param compType UI组件类型
    //  * @returns 
    //  */
    // public static getComp<T extends IICompUI>(parent: cc.Node, compType: CompUIType): T {
    //     let compUIConfig = CompUIConfig[compType];
    //     HDebug.Assert(parent && parent.isValid, "fuck!!! parent error");
    //     let tag = CompUIType[compType];
    //     let child = parent.getChildByName(tag);
    //     let comp: T = null;
    //     if (child && child.isValid) {
    //         comp = child.getComponent(tag);
    //     }
    //     else {
    //         child = cc.instantiate(CommonUIPrefabs.GetPrefab(compUIConfig.prefabName));
    //         child.setParent(parent);
    //         child.name = tag;
    //         comp = child.getComponent(tag);
    //         comp.initComp();
    //     }
    //     return comp;
    // }

    // public static ShowRepairFrame() {
    //     // let configLang = GlobalConfig.lang;
    //     // if ("zh-ch" != configLang) {
    //     //     Utils.langManager.loadMainifest(configLang, function (language) {
    //     //         this.showSingeConfirm(
    //     //             i18n.t("LOGIN_REPAIR_TIP"),
    //     //             function () {
    //     //                 if (jsb.fileUtils.isDirectoryExist(storagePath)) {
    //     //                     jsb.fileUtils.removeDirectory(storagePath);
    //     //                     Utils.langManager.clearLang(language);
    //     //                 }
    //     //                 AppUtils.restartGame();
    //     //             },
    //     //             null,
    //     //             null,
    //     //             i18n.t("LOGIN_CLIENT_REPAIR")
    //     //         );
    //     //     });
    //     // }
    //     // else {
    //     this.showConfirmNew({
    //         content: i18n.t("LOGIN_REPAIR_TIP"),
    //         rightHandle: () => {
    //             if (window.jsb) {
    //                 let storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "update-assets";
    //                 if (jsb.fileUtils.isDirectoryExist(storagePath)) {
    //                     jsb.fileUtils.removeDirectory(storagePath);
    //                 }
    //             }
    //             AppUtils.restartGame();
    //         },
    //     });
    //     // }

    // }

    // public static ShowCloudToB(PanelB: PanelType) {
    //     var data: any = {};
    //     // data.OldType = PanelA;
    //     data.NewType = PanelB;
    //     //用来把A界面的关闭包在回调里，延后执行
    //     // data.CloseCb = layerACloseCb;
    //     ProxyManager.getInstance().CloudDirector.Begin(data);
    // }

    // public static showNoticeView() {
    //     let checkTime = ProxyManager.getInstance().timeProxy.getLoacalValue(SaveKeyConstants.NOTICE_NOTOPEN_TIME);
    //     if (checkTime == null) {
    //         UIControl.JumpToPanel(PanelType.NoticeView);
    //     } else {
    //         let isToday = TimeUtil.getInstance().isTheSameLocalDay(TimeUtil.getInstance().second * 1000, parseInt(checkTime));
    //         if (!isToday) {
    //             UIControl.JumpToPanel(PanelType.NoticeView);
    //         }
    //     }
    // }

    // //用於從活動裡進入可兌換界面的調用方法
    // public static showExchangeDetailView(exchangeId: number) {
    //     let cfg: Cfg_exchangeShop = ConfigFinder.Find<Cfg_exchangeShop>(localdb.table_exchangeShop, exchangeId);
    //     HDebug.Assert(null != cfg, "Cfg_exchangeShop is null, plz check, id is " + exchangeId);
    //     switch (cfg.type) {
    //         case ExchangeShopType.Wife: {
    //             let dataPack = WifeExchangeUtils.CreateData(cfg.itemid);
    //             let cfgList: Cfg_exchangeShop[] = ConfigFinder.FindGroupWithKey(localdb.table_exchangeShop, "pindex", cfg.pindex);
    //             dataPack.WifeExchange(cfg);
    //             for (let i = 0; i < cfgList.length; ++i) {
    //                 if (cfgList[i].type == ExchangeShopType.WifeClothe) {
    //                     dataPack.Clothe(cfgList[i].itemid);
    //                     dataPack.ClotheExchange(cfgList[i]);
    //                 }
    //             }
    //             dataPack.getClotheCfg();
    //             dataPack.getWifeCfg();
    //             UIControl.JumpToPanel(PanelType.WifeInfo, {
    //                 fromExchangeShop: true,
    //                 dataPack: dataPack,
    //             });
    //         } break;
    //         case ExchangeShopType.Servant: {
    //             let heroId = cfg.itemid;
    //             let heroCfg = ConfigFinder.Find<Cfg_Hero>(localdb.table_hero, heroId);
    //             UIControl.JumpToPanel(PanelType.ExchangeDetailView, {
    //                 fromExchangeShop: true,
    //                 heroCfg: heroCfg,
    //                 exchangeCfg: cfg,
    //             });
    //         } break;
    //         case ExchangeShopType.WifeClothe: {
    //             let wid = Math.floor(cfg.itemid / 100);
    //             let dataPack = WifeExchangeUtils.CreateData(wid);
    //             let cfgList: Cfg_exchangeShop[] = ConfigFinder.FindGroupWithKey(localdb.table_exchangeShop, "pindex", cfg.pindex);
    //             dataPack.Clothe(cfg.itemid)
    //                 .ClotheExchange(cfg);
    //             for (let i = 0; i < cfgList.length; ++i) {
    //                 if (cfgList[i].type == ExchangeShopType.Wife) {
    //                     dataPack.WifeExchange(cfgList[i]);
    //                 }
    //             }
    //             dataPack.getClotheCfg();
    //             dataPack.getWifeCfg();
    //             UIControl.JumpToPanel(PanelType.WifeClothPreview, {
    //                 fromExchangeShop: true,
    //                 dataPack: dataPack,
    //             });
    //         } break;
    //         case ExchangeShopType.Pet: {
    //             UIControl.JumpToPanel(PanelType.LimitActivityView_ExchangePet, {
    //                 fromAct: true,
    //                 petId: cfg.itemid,
    //                 exchangeCfg: cfg,
    //             });
    //         } break;
    //         default:
    //             HDebug.Error("找不到對應類型，請檢查" + cfg.type);
    //             break;
    //     }
    // }

    // // 性格增加提示
    // public static showCharacterAdd(data) {
    //     if (!Array.isArray(data)) {
    //         return;
    //     }
    //     for (const key in data) {
    //         let e = data[key];
    //         if (e.id) {
    //             if (e.id == DataType.SHUAIZHEN) {
    //                 AlertUtils.Instance().alert18n("JIANGHU_ALERT_CHARACTER_42");
    //             }
    //             if (e.id == DataType.PANLI) {
    //                 AlertUtils.Instance().alert18n("JIANGHU_ALERT_CHARACTER_43");
    //             }
    //         }
    //     }
    // }

    // public static showSpine(nodeData: sp.Skeleton, animName, isloop?, callbackfun?) {

        
    //     if (nodeData == null) return;
    //     let remoteSpine = nodeData.node.getComponent(RemoteSpine);

    //     let func = () => { 

    //         //待优化
    //         var sln = nodeData;
    //         if (sln == null || sln == undefined)
    //             return;

    //         sln.setAnimation(0, animName, isloop);

    //         if (isloop != null && isloop != true && callbackfun != null) {
    //             sln.setCompleteListener((trackEntry, loopCount) => {
    //                 callbackfun(nodeData);
    //             });
    //         }
    //     }

    //     if (null != remoteSpine) {
            
    //         if (remoteSpine.isLoadOver()) {
    //             func();
    //         }
    //         else { 
    //             remoteSpine.setLoadSucFunc(() => {
    //                 func();
    //             });
    //         }
            

    //     } else { 
    //         func();
    //     }
        
    // }

    // /**
    //  * 竖向排布文字
    //  * @param layout 
    //  * @param labIns 
    //  * @param str 
    //  * @param splitNum 
    //  * @param maxLabNum 
    //  */
    // public static GeneratorVerticalLabel(layout: cc.Node, labIns: cc.Node, str: string = "", splitNum: number = 5, maxLabNum: number = 3): void {
    //     let texts = str.split("|");
    //     if (texts.length <= 1) { // 如果没有分割符，就以splitNum进行分割
    //         texts = FwUtils.splitTxt(texts[0], splitNum);
    //     }
    //     texts = texts.splice(0, maxLabNum);
    //     let len = Math.max(texts.length, maxLabNum);
    //     for (let i = 0; i < len; i++) {
    //         let txt = texts[i],
    //             node = layout.children[i];
    //         if (!txt && node) {
    //             node.active = false;
    //             continue;
    //         }
    //         if (txt && !node) {
    //             node = cc.instantiate(labIns);
    //             node.parent = layout;
    //             node.zIndex = i;
    //         }
    //         if (node && txt) {
    //             let lbs = node.getComponent(cc.Label) || node.getComponentInChildren(cc.Label);
    //             if (lbs) {
    //                 node.active = true;
    //                 lbs.string = txt;
    //             }
    //         }
    //     }
    //     let lay = layout.getComponent(cc.Layout);
    //     if (lay) {
    //         lay.updateLayout();
    //     }
    // }

    // public static showNumChange(labelComponet, oldValue: number, newValue: number, changeTotalFrame: number = 5
    //     , translateKey?: string, transValueKEY?, endCB?, needNumTrans: boolean = true, frameCb?) {
    //     void 0 === changeTotalFrame && (changeTotalFrame = 5);
    //     void 0 === needNumTrans && (needNumTrans = !0);
    //     if (null != labelComponet)
    //         if (oldValue == undefined) {
    //             labelComponet.numIndex = changeTotalFrame;
    //             numChange();
    //         }
    //         else if (oldValue != newValue) {
    //             labelComponet.numIndex = 1;
    //             labelComponet.unscheduleAllCallbacks();
    //             labelComponet.schedule(numChange, 0.04);
    //             numChange();
    //         } else {
    //             labelComponet.numIndex = changeTotalFrame;
    //             numChange();
    //         }
    //     function numChange() {
    //         let curIndex = labelComponet.numIndex++;
    //         let newIndex = oldValue + Math.floor(((newValue - oldValue) / changeTotalFrame) * curIndex);
    //         newIndex = curIndex >= changeTotalFrame ? newValue : newIndex;
    //         let str = needNumTrans ? AppStringUtils.number2str(newIndex) : newIndex + "";
    //         if (translateKey)
    //             if (transValueKEY) {
    //                 let translateObj = {};
    //                 translateObj[transValueKEY] = str;
    //                 str = i18n.t(translateKey, translateObj);
    //             } else str = i18n.t(translateKey) + " " + str;
    //         labelComponet.string = str;
    //         frameCb && frameCb(newIndex);
    //         if (curIndex >= changeTotalFrame) {
    //             labelComponet.unscheduleAllCallbacks();
    //             endCB && endCB();
    //         }
    //     }
    // }

    // public static showNumChangeEX(labelComponet, oldValue: number, newValue: number, changeTotalFrame: number
    //     , translateKey: string, transTxtObj, transValueKEY, endCB?, needNumTrans: boolean = true) {
    //     void 0 === changeTotalFrame && (changeTotalFrame = 5);
    //     void 0 === needNumTrans && (needNumTrans = !0);
    //     if (null != labelComponet)
    //         if (oldValue == undefined) {
    //             labelComponet.numIndex = changeTotalFrame;
    //             numChange();
    //         }
    //         else if (oldValue != newValue) {
    //             labelComponet.numIndex = 1;
    //             labelComponet.unscheduleAllCallbacks();
    //             labelComponet.schedule(numChange, 0.04);
    //             numChange();
    //         } else {
    //             labelComponet.numIndex = changeTotalFrame;
    //             numChange();
    //         }
    //     function numChange() {
    //         let curIndex = labelComponet.numIndex++;
    //         let newIndex = oldValue + Math.floor(((newValue - oldValue) / changeTotalFrame) * curIndex);
    //         newIndex = curIndex >= changeTotalFrame ? newValue : newIndex;
    //         let str = needNumTrans ? AppStringUtils.number2str(newIndex) : newIndex + "";
    //         if (translateKey)
    //             if (transValueKEY) {
    //                 let translateObj = (null != transTxtObj) ? transTxtObj : {};
    //                 translateObj[transValueKEY] = str;
    //                 str = i18n.t(translateKey, translateObj);
    //             } else str = i18n.t(translateKey) + " " + str;
    //         labelComponet.string = str;
    //         if (curIndex >= changeTotalFrame) {
    //             labelComponet.unscheduleAllCallbacks();
    //             endCB && endCB();
    //         }
    //     }
    // }

    // public static showNumChangeFloat(labelComponet, oldValue: number, newValue: number, changeTotalFrame: number
    //     , translateKey: string, transTxtObj, transValueKEY, endCB?, needNumTrans: boolean = true) {
    //     void 0 === changeTotalFrame && (changeTotalFrame = 5);
    //     void 0 === needNumTrans && (needNumTrans = !0);
    //     if (null != labelComponet)
    //         if (oldValue == undefined) {
    //             labelComponet.numIndex = changeTotalFrame;
    //             numChange();
    //         }
    //         else if (oldValue != newValue) {
    //             labelComponet.numIndex = 1;
    //             labelComponet.unscheduleAllCallbacks();
    //             labelComponet.schedule(numChange, 0.04);
    //             numChange();
    //         } else {
    //             labelComponet.numIndex = changeTotalFrame;
    //             numChange();
    //         }
    //     function numChange() {
    //         let curIndex = labelComponet.numIndex++;
    //         let changeFloat = (newValue - oldValue) / changeTotalFrame;
    //         let newIndex = oldValue + (changeFloat * curIndex);
    //         newIndex = Number.parseFloat(newIndex.toFixed(2));
    //         newIndex = curIndex >= changeTotalFrame ? Number.parseFloat(newValue.toFixed(2)) : newIndex;
    //         let str = needNumTrans ? AppStringUtils.number2str(newIndex) : newIndex + "";
    //         if (translateKey)
    //             if (transValueKEY) {
    //                 let translateObj = (null != transTxtObj) ? transTxtObj : {};
    //                 translateObj[transValueKEY] = str;
    //                 str = i18n.t(translateKey, translateObj);
    //             } else str = i18n.t(translateKey) + " " + str;
    //         labelComponet.string = str;
    //         if (curIndex >= changeTotalFrame) {
    //             labelComponet.unscheduleAllCallbacks();
    //             endCB && endCB();
    //         }
    //     }
    // }

    // public static countDown(endTime: number, labelComp, timesUpCB?, needRefresh: boolean = true, langKey?, transKey?, timeFormat?) {
    //     void 0 === needRefresh && (needRefresh = !0);

    //     if (null != labelComp && 0 != endTime) {
    //         labelComp.unscheduleAllCallbacks();
    //         let updateFunc = () => {
    //             let leftTime = endTime - TimeUtil.getInstance().second;
    //             if (leftTime > 0 && needRefresh) {
    //                 this.setLabel(labelComp, leftTime, langKey, transKey, timeFormat);
    //             }
    //             else if (leftTime <= 0) {
    //                 this.setLabel(labelComp, 0, langKey, transKey, timeFormat);
    //                 timesUpCB && timesUpCB();
    //                 labelComp.unscheduleAllCallbacks();
    //             }
    //         }
    //         labelComp.schedule(updateFunc, 1);
    //         updateFunc();
    //     }
    // }

    // private static setLabel(labelComp, time: number, langKey?, transKey?, timeFormat?) {
    //     if (transKey && "" != langKey) {
    //         let c = {};
    //         c[transKey] = TimeUtil.getInstance().second2hms(time, timeFormat);
    //         labelComp.string = i18n.t(langKey, c);
    //     } else {
    //         labelComp.string =
    //             (langKey && "" != langKey ? i18n.t(langKey) : "") +
    //             TimeUtil.getInstance().second2hms(time, timeFormat);
    //     }
    // }

    // // 根据展示物品获得
    // public static showAlertItem(recv) {
    //     ProxyManager.getInstance().timeProxy.JustShowAllReward(this.getMsgwinItems(recv));
    // }

    // // 根据展示物品无需点击直接获得
    // public static showAlertItemWithoutClick(recv) {
    //     ProxyManager.getInstance().timeProxy.JustShowAllRewardWithoutClick(this.getMsgwinItems(recv));
    // }

    // public static showChatChoose(param) {
    //     // param: title、content、fontSize、topName、bottomName、topHandle、bottomHandle、closeHandle
    //     UIControl.JumpToPanel(PanelType.ChatChooseView, param);
    // }

    //#region 一堆confirm

    ////用於彈出必須執行回調的確認框
    ////需要修改
    //public static showConfirmForce(content: string, handler: Function) {
    //    this.showConfirmNew({
    //        content: content,
    //        leftHandle: handler,
    //        rightHandle: handler,
    //        closeHandle: handler,
    //    });
    //}
//
    //public static showConfirmForceSingle(content: string, handler: Function) {
    //    this.showConfirmNew({
    //        content: content,
    //        leftHandle: handler,
    //        closeHandle: handler,
    //    });
    //}
//
    //public static showConfirm(content, handler?, target?, color?, leftBtnStr?, rightBtnStr?, isRightShow?) {
    //    void 0 === target && (target = null);
    //    void 0 === color && (color = null);
    //    void 0 === leftBtnStr && (leftBtnStr = null);
    //    void 0 === rightBtnStr && (rightBtnStr = null);
    //    var data = new ConfirmData();
    //    data.txt = content;
    //    data.target = target;
    //    data.handler = handler;
    //    data.color = color;
    //    data.left = leftBtnStr;
    //    data.right = rightBtnStr;
    //    data.isRightShow = isRightShow;
    //    UIControl.JumpToPanel(PanelType.ConfirmView, data);
    //}
//
    //public static showSingeConfirm(txtStr, handler?, target?, color?, left?) {
    //    void 0 === target && (target = null);
    //    void 0 === color && (color = null);
    //    void 0 === left && (left = null);
    //    var data = new ConfirmData();
    //    data.txt = txtStr;
    //    data.target = target;
    //    data.handler = handler;
    //    data.color = color;
    //    data.left = left;
    //    UIControl.JumpToPanel(PanelType.ConfirmRetry, data);
    //}
//
    ///**
    // * param: content、fontSize、leftName、rightName、leftHandle、rightHandle、closeHandle
    // * @param param 
    // */
    //public static showConfirmNew(param) {
    //    // param: content、fontSize、leftName、rightName、leftHandle、rightHandle、closeHandle
    //    UIControl.JumpToPanel(PanelType.ConfirmViewNew, param);
    //}
//
    ///**
    // * param: content、titleTxt、fontSize、leftName、rightName、leftHandle、rightHandle、closeHandle
    // * @param param 
    // */
    //public static showConfirmTitleViewNew(param) {
    //    // param: content、titleTxt、fontSize、leftName、rightName、leftHandle、rightHandle、closeHandle
    //    UIControl.JumpToPanel(PanelType.ConfirmTitleViewNew, param);
    //}
//
    //public static showConfirmWithTag(text, handler?, confirmTag?, left?, right?) {
    //    void 0 === confirmTag && (confirmTag = "");
    //    void 0 === left && (left = null);
    //    void 0 === right && (right = null);
    //    var data = new ConfirmData();
    //    data.txt = text;
    //    data.handler = handler;
    //    data.left = left;
    //    data.right = right;
    //    data.skip = confirmTag;
    //    this.isSkip(data) || UIControl.JumpToPanel(PanelType.ConfirmWithTag, data);
    //}
//
    //public static showConfirmItem(text, itemID, itemHasCount, handler?, confirmTag?, target?, color?, left?, right?) {
    //    void 0 === confirmTag && (confirmTag = "");
    //    void 0 === target && (target = null);
    //    void 0 === color && (color = null);
    //    void 0 === left && (left = null);
    //    void 0 === right && (right = null);
    //    var data = new ConfirmData();
    //    data.txt = text;
    //    data.itemId = itemID;
    //    data.count = itemHasCount;
    //    data.target = target;
    //    data.handler = handler;
    //    data.color = color;
    //    data.left = left;
    //    data.right = right;
    //    data.skip = confirmTag;
//
    //    this.isSkip(data) || UIControl.JumpToPanel(PanelType.ConfirmItem, data);
    //}
//
    //public static showCostConfirm(data: CommonCostConfirmData) { 
    //    UIControl.JumpToPanel(PanelType.CommonCostConfirmView, data);
    //}
//
    //public static isSkip(t) {
    //    if (!FwUtils.isBlank(t.skip) && ProxyManager.getInstance().playerProxy.confirmCheck[t.skip]) {
    //        t.target ? t.handler.apply(t.target) : t.handler();
    //        return !0;
    //    }
    //    return !1;
    //}
//
    //public static showConfirmItemNoTag(text, itemID, itemHasCount, handler?, target?, color?, left?, right?) {
    //    void 0 === target && (target = null);
    //    void 0 === color && (color = null);
    //    void 0 === left && (left = null);
    //    void 0 === right && (right = null);
    //    var data = new ConfirmData();
    //    data.txt = text;
    //    data.itemId = itemID;
    //    data.count = itemHasCount;
    //    data.target = target;
    //    data.handler = handler;
    //    data.color = color;
    //    data.left = left;
    //    data.right = right;
    //    this.isSkip(data) || UIControl.JumpToPanel(PanelType.ConfirmItemNoTag, data);
    //}
//
    //public static showConfirmInput(txt, handler?, target?, color?, left?, right?) {
    //    void 0 === target && (target = null);
    //    void 0 === color && (color = null);
    //    void 0 === left && (left = null);
    //    void 0 === right && (right = null);
    //    var data = new ConfirmData();
    //    data.txt = txt;
    //    data.target = target;
    //    data.handler = handler;
    //    data.color = color;
    //    data.left = left;
    //    data.right = right;
    //    UIControl.JumpToPanel(PanelType.ConfirmInput, data);
    //}
//
    //public static showConfirmNameInput(callback, constItem, EditString?, nameLengthLimit?, editContent?) {
    //    let _ConfirmNameInputViewData = new ConfirmNameInputViewData();
    //    _ConfirmNameInputViewData.confrimCallback = callback;
    //    _ConfirmNameInputViewData.NameLimit = nameLengthLimit;
    //    _ConfirmNameInputViewData.constItem = constItem;
    //    _ConfirmNameInputViewData.EditContent = editContent;
    //    _ConfirmNameInputViewData.EditName = EditString ? EditString : i18n.t("CHANGE_NAME_TITLE");
    //    UIControl.JumpToPanel(PanelType.ConfirmNameInput, _ConfirmNameInputViewData);
    //}
    //#endregion

    //#region 一堆showEffect
    /**
     * 待销毁的节点绝对不能用endFunc
     * @param animationComp 
     * @param aniIndex 
     * @param endFunc 
     * @param canStopClick 
     * @returns 
     */
    public static showEffect(animationComp: cc.Component, aniIndex, endFunc?, canStopClick?) { // this, index , callback
        if (null != animationComp) { // this.node.getComponent(cc.Animation)
            if (canStopClick == void 0) canStopClick = false; //是否在动画期间不准任何操作
            let animationComponent = animationComp.node.getComponent(cc.Animation);
            let aniDuration = 0;
            if (animationComponent) {
                // 获取动画组件上的所有动画剪辑。
                let targetAnimationClip = animationComponent.getClips()[aniIndex];
                if (targetAnimationClip) {
                    animationComponent.play(targetAnimationClip.name);
                    aniDuration = targetAnimationClip.duration;
                }
            }

            if (canStopClick) {
                if (!endFunc) endFunc = function () { };
            }

            if (endFunc) {
                if (aniDuration > 0.05) {
                    //if (canStopClick) GuideManager.Instance().Lock(aniDuration);
                    animationComp.scheduleOnce(
                        function () {
                            endFunc();
                        }, aniDuration - 0.05)
                }
                else {
                    endFunc.apply(animationComp)
                }
            }
            return aniDuration;
        }
    }

    public static showNodeEffect(guideNode, clipIndex?) {
        void 0 === clipIndex && (clipIndex = 0);
        if (null != guideNode) {
            var anim = guideNode.getComponent(cc.Animation);
            if (anim) {
                var clipsArr = anim.getClips();
                -1 == clipIndex && (clipIndex = Math.floor(Math.random() * clipsArr.length));
                // -1 != e &&
                //     i.length > 2 &&
                //     i.length % 2 == 0 &&
                //     (e += 2 * Math.floor((Math.random() * i.length) / 2));
                var animClip = clipsArr[clipIndex];
                animClip && anim.play(animClip.name, 0);
                animClip && anim.sample(animClip.name);
            }
        }
    }

    /**
     * 上面那個方法的用名字的播放的版本
     * @param {*} animationNode 
     * @param {*} aniIndex 
     * @param {*} endFunc 
     * @param {*} canStopClick 
     * @returns 
     */
    public static showEffectByAniName(animationNode: cc.Component, aniName: string, endFunc?, canStopClick?) { // this, index , callback
        if (null != animationNode) { // this.node.getComponent(cc.Animation)
            if (canStopClick == void 0) canStopClick = false; //是否在动画期间不准任何操作
            let animationComponent = animationNode.node.getComponent(cc.Animation);
            let aniDuration = 0;
            if (animationComponent) {
                // 获取动画组件上的所有动画剪辑。
                let aniClipsArr = animationComponent.getClips();
                for (let index = 0; index < aniClipsArr.length; ++index) {
                    if (null != aniClipsArr[index]) {
                        if (aniName == aniClipsArr[index].name) {
                            animationComponent.play(aniClipsArr[index].name);
                            aniDuration = aniClipsArr[index].duration;
                        }
                    } else {
                        HDebug.Error("有空animation Clip， 請檢查該節點， " + animationNode.node.name)
                    }
                }
            }

            if (canStopClick) {
                if (!endFunc) endFunc = function () { };
            }

            if (endFunc) {
                if (aniDuration > 0.05) {
                    //if (canStopClick) GuideManager.Instance().Lock(aniDuration);
                    animationNode.scheduleOnce(
                        function () {
                            endFunc();
                        }, aniDuration - 0.05)
                } else {
                    endFunc.apply(animationNode)
                }
            }
            return aniDuration;
        }
    }

    /**
     * 上面那個方法的用名字的播放的版本
     * @param {*} animationNode 
     * @param {*} aniIndex 
     * @param {*} endFunc 
     * @param {*} canStopClick 
     * @returns 
     */
    public static showEffectByAniNameDelay(animationNode: cc.Component, aniName: string, delayTime: number, endFunc?: Function, canStopClick?: boolean) { // this, index , callback
        if (null != animationNode) { // this.node.getComponent(cc.Animation)
            if (canStopClick == void 0) canStopClick = false; //是否在动画期间不准任何操作
            let animationComponent = animationNode.node.getComponent(cc.Animation);
            let aniDuration = 0;
            if (animationComponent) {
                // 获取动画组件上的所有动画剪辑。
                let aniClipsArr = animationComponent.getClips();
                for (let index = 0; index < aniClipsArr.length; ++index) {
                    if (null != aniClipsArr[index]) {
                        if (aniName == aniClipsArr[index].name) {
                            animationComponent.play(aniClipsArr[index].name);
                            aniDuration = aniClipsArr[index].duration;
                        }
                    } else {
                        HDebug.Error("有空animation Clip， 請檢查該節點， " + animationNode.node.name)
                    }
                }
            }

            if (canStopClick) {
                if (!endFunc) endFunc = function () { };
            }

            aniDuration += delayTime;
            if (endFunc) {
                if (aniDuration > 0.05) {
                    //if (canStopClick) GuideManager.Instance().Lock(aniDuration);
                    animationNode.scheduleOnce(
                        function () {
                            endFunc();
                        }, aniDuration)
                } else {
                    endFunc.apply(animationNode)
                }
            }
            return aniDuration;
        }
    }

    public static showEffectDelay(target, aniClipIndex, callFunc?, speed?) { // this, index , callback
        if (null != target) { // this.node.getComponent(cc.Animation)
            var playSpeed = speed || 1;
            var aniComponent = target.node.getComponent(cc.Animation),
                duration = 0;
            if (aniComponent) {
                // 获取动画组件上的所有动画剪辑。
                var aniClip = aniComponent.getClips()[aniClipIndex];
                if (aniClip) {
                    aniClip.speed = playSpeed;
                    aniComponent.play(aniClip.name);
                    duration = aniClip.duration;
                }
            }
            callFunc && (duration > 0.05 ? target.scheduleOnce(callFunc, duration + 0.1) : callFunc.apply(target));
            return duration;
        }
    }

    public static showEffectByName(animation, name, wrapMode, func, speed?) {
        if (animation != null) {
            let clips = animation._clips,
                delay;
            for (let i = 0; i < clips.length; i++) {
                let clip = clips[i];
                if (clip.name == name) {
                    let aniState = animation.play(name);
                    animation.sample(name);
                    aniState.wrapMode = wrapMode;
                    aniState.speed = speed || 1;
                    delay = aniState.duration * (1 / aniState.speed);
                    animation.scheduleOnce(func, delay);
                }
            }
        }
    }

    /**
     * 返回值是timerID -1的话说明立刻执行
     * @param targetNode 
     * @param aniClipIndex 
     * @param callFunc 
     * @returns 
     */
    public static showEffectByNode(targetNode, aniClipIndex, callFunc?): number { // this, index , callback
        let timerID = -1;
        if (null != targetNode) {
            var aniComponent = targetNode.getComponent(cc.Animation),
                duration = 0;
            if (aniComponent) {
                // 获取动画组件上的所有动画剪辑。
                var aniClip = aniComponent.getClips()[aniClipIndex];
                if (aniClip) {
                    aniComponent.play(aniClip.name);
                    duration = aniClip.duration;
                }
            }
            if (callFunc) {
                if (duration > 0.05) {
                    timerID = TimerManager.Instance().AddTimer(duration - 0.05, () => {
                        callFunc.apply(targetNode);
                    });
                }
                else {
                    callFunc.apply(targetNode);
                }
            }
        }
        return timerID;
    }

    public static storyViewShowNodeEffect(node, index) {
        if (!node || isNaN(index))
            return;
        let anime = node.getComponent(cc.Animation);
        if (anime) {
            let clips = anime.getClips();
            if (index === -1) {
                index = Math.floor(Math.random() * clips.length);
            }
            let clip = clips[index];
            if (!clip) {
                HDebug.Error("动画效果不存在 " + index, node);
                return;
            }
            anime.play(clip.name);
        }
    }
    //#endregion

    //public static SetNodeGray(btnNode, isGray) {
    //    let sprites = btnNode.getComponent(cc.Sprite);
    //    let lbl = btnNode.getComponent(cc.Label);
    //    if (sprites) {
    //        if (isGray) {
    //            ShaderUtils.setGray(sprites);
    //        }
    //        else {
    //            ShaderUtils.clearShader(sprites);
    //        }
    //    }
    //    else if (lbl) {
    //        if (isGray) {
    //            ShaderUtils.setGray(lbl);
    //        }
    //        else {
    //            ShaderUtils.clearShader(lbl);
    //        }
    //    }
    //}
    //#endregion

    //从Source复制到Target
    public static copyData(Target, Source) {
        if (Target != null && Source != null) {
            if (Target instanceof Array && Source instanceof Array) {
                this.copyList(Target, Source);
            }
            else {
                for (var key in Source) {
                    if (Source[key] != null) {
                        Target[key] = Source[key];
                    }
                }
            }
        }
    }

    /**
     * Source复制到Target，IndexName查找索引，默认为id，isCompare是否比较大小用以添加isNew，默认false，CompareName，用以比较的索引比如道具的count
     * @param Target 
     * @param Source 
     * @param IndexName 
     * @param isCompare 
     * @param CompareName 
     */
    public static copyList(Target, Source, IndexName?, isCompare?, CompareName?) {
        void 0 === IndexName && (IndexName = "id");
        void 0 === isCompare && (isCompare = false);
        void 0 === CompareName && (CompareName = "");
        if (Target != null && Source != null) {
            if (Source.length == 0) {
                //可能是想如果Source传一个object，没有length，直接覆盖？
                Target = Source
            }
            else {
                for (var Sindex = 0; Sindex < Source.length; Sindex++) {
                    var isfind = false;
                    for (var Tindex = 0; Tindex < Target.length; Tindex++) {
                        if (Source[Sindex] != null && Target[Tindex] != null
                            && Source[Sindex][IndexName] != null && Target[Tindex][IndexName] != null
                            && Source[Sindex][IndexName] == Target[Tindex][IndexName]) {
                            //如果原本地列表有该项数据，比较大小
                            if (isCompare && Target[Tindex][CompareName] < Source[Sindex][CompareName]) {
                                Source[Sindex].isNew = true
                            }
                            this.copyData(Target[Tindex], Source[Sindex]);
                            isfind = true;
                        }
                    }
                    if (!isfind && Source[Sindex]) {
                        //如果原本地列表没有该项数据，直接塞进本地列表中
                        Source[Sindex].isNew = true;
                        Target.push(Source[Sindex]);
                    }
                }
            }
        }
    }

    // 获取登录前随机生成的uuid
    //public static getRanUUID() {
    //    if (GlobalConfig.ranUUId == "") {
    //        let uid = cc.sys.localStorage.getItem("ranUUId");
    //        if (uid == undefined || uid == "" || uid == 0) {
    //            uid = AppUtils.generatorUuid();
    //            cc.sys.localStorage.setItem("ranUUId", uid);
    //        }
    //        GlobalConfig.ranUUId = uid;
    //    }
//
    //    return GlobalConfig.ranUUId;
    //};

    // //主任务 book
    // public static transMissionState(get) {
    //     switch (get) { //待领取0  待完成2  已领取1
    //         case 2:
    //             return "B";
    //         case 0:
    //             return "C";
    //         case 1:
    //             return "D";
    //         default:
    //             HDebug.Error("transMissionState");
    //             return null;
    //     }
    // };

    // //界面参数（界面类型必须在首位用 % 连接后面字符串，判断语句内部必须严格按照顺序填写，语句之间可乱序自由组合，且 用 &，或 用 #，或之间运算依次判断，有一个有结果即可返回）
    // //语句内部用_连接每个参数
    // //每个用且连接的整体语句内，数值比较的语句必须放在前面，逻辑判断的语句在后面，然后拿第一个语句的结果排序并跟后面语句取交集，结果也是顺序的
    // //解析并返回对应界面指向id
    // public static getSelectIdByTranslateStr(SelectStr) {
    //     let checklist = SelectStr.split("%");
    //     //判断属于哪个界面
    //     switch (checklist[0]) {
    //         case "Hero":
    //             return this.TranslateHeroViewStr(checklist[1]);
    //         case "Wife":
    //             return this.TranslateWifeViewStr(checklist[1]);
    //         case "Pet":
    //             return this.TranslatePetViewStr(checklist[1]);
    //         case "PetTrain":
    //             return this.TranslatePetViewStr(checklist[1]);
    //         case "Mall":
    //             return this.TranslateMallViewStr(checklist[1]);
    //         case "Bag":
    //             return this.TranslateBagViewStr(checklist[1]);
    //         case "Book":
    //             return this.TranslateLibraryViewStr(checklist[1]);
    //         case "Street":
    //             return this.TranslateStreetViewStr(checklist[1]);
    //     }
    // }

    // //解析伙伴界面
    // public static TranslateHeroViewStr(SelectStr) {
    //     let servantProxy = ProxyManager.getInstance().servantProxy;
    //     let allherolist = servantProxy.getServantList();
    //     if (!allherolist) {
    //         return;
    //     }
    //     let checklist = SelectStr.split("#");
    //     for (let m = 0; m < checklist.length; m++) {
    //         let singleChecklist = checklist[m].split("&");
    //         let list = [];
    //         for (let i = 0; i < singleChecklist.length; i++) {
    //             let str = singleChecklist[i];
    //             list[i] = [];
    //             let singlelist = str.split("_");
    //             switch (singlelist[0]) {
    //                 case "HeroLv": {
    //                     //伙伴等级
    //                     let data = this.getOperatorResult(allherolist, "level", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         if (data[key]) {
    //                             list[i].push(data[key].id)
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "BreakLv": {
    //                     //伙伴突破次数
    //                     let data = this.getOperatorResult(allherolist, "senior", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         if (data[key]) {
    //                             list[i].push(data[key].id)
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "TalentCanUp": {
    //                     //天赋是否可升级
    //                     for (let key in allherolist) {
    //                         if (singlelist[1] == "true") {
    //                             if (servantProxy.hasEpSkillCanUp(allherolist[key])) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!servantProxy.hasEpSkillCanUp(allherolist[key])) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "Talent": {
    //                     //天赋
    //                     let data = this.getOperatorResult(allherolist, "zz", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         if (data[key]) {
    //                             list[i].push(data[key].id)
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "EquipPet": {
    //                     //是否携带珍兽
    //                     for (let key in allherolist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().petProxy.getPetServerDataByHeroId(allherolist[key].id)) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().petProxy.getPetServerDataByHeroId(allherolist[key].id)) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "EquipPetProIdMin": {
    //                     //携带珍兽的伙伴中，携带珍兽品质最低的那个,只能填true
    //                     let proNum = 99;
    //                     let heroid = 0;
    //                     for (let key in allherolist) {
    //                         let PetData = ProxyManager.getInstance().petProxy.getPetServerDataByHeroId(allherolist[key].id);
    //                         if (PetData && PetData.proId < proNum) {
    //                             heroid = allherolist[key].id;
    //                             proNum = PetData.proId;
    //                         }
    //                     }
    //                     if (heroid != 0) {
    //                         list[i].push(heroid);
    //                     }
    //                 }
    //                 case "CanTupo": {
    //                     //是否可突破
    //                     for (let key in allherolist) {
    //                         if (singlelist[1] == "true") {
    //                             if (servantProxy.canUpSenior(allherolist[key])) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!servantProxy.canUpSenior(allherolist[key])) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "MedicAttr": {
    //                     //丹药属性
    //                     let templist = [];
    //                     for (let key in allherolist) {
    //                         let heroData = allherolist[key];
    //                         let Attr = servantProxy.getHeroAttrAddValue(heroData, ServantAttrAddType.Med);
    //                         templist.push({ id: allherolist[key].id, medAttr: Attr });
    //                     }
    //                     let data = this.getOperatorResult(allherolist, "medAttr", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         if (data[key]) {
    //                             list[i].push(data[key].id)
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "HeroStar": {
    //                     //伙伴品质 用的是本地读表的star值，所以要构造一个数据队列去处理
    //                     let templist = [];
    //                     for (let key in allherolist) {
    //                         let heroitem = localcache.getItem(localdb.table_hero, allherolist[key].id);
    //                         templist.push({ id: allherolist[key].id, cardQuality: heroitem.star });
    //                     }
    //                     let data = this.getOperatorResult(templist, "cardQuality", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "CanUpgradeLV": {
    //                     //是否可升级等级
    //                     for (let key in allherolist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().servantProxy.getCanExpLevelUp(allherolist[key])) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().servantProxy.getCanExpLevelUp(allherolist[key])) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "StoreAdminSkillLv": {
    //                     //掌柜技能等级
    //                     let templist = [];
    //                     for (let key in allherolist) {
    //                         let lv = ProxyManager.getInstance().servantProxy.getServantBusinessSkillLevel(allherolist[key].id);
    //                         templist.push({ id: allherolist[key].id, skillLv: lv });
    //                     }
    //                     let data = this.getOperatorResult(templist, "skillLv", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "CanUpgradeStoreAdminSkill": {
    //                     //是否可升级掌柜技能
    //                     for (let key in allherolist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().servantProxy.checkBusinessSkillCanUpgrade(allherolist[key].id)) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().servantProxy.checkBusinessSkillCanUpgrade(allherolist[key].id)) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "CanUpgradeDianXueSkill": {
    //                     //是否可升级典学技能
    //                     for(let key in allherolist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().servantProxy.checkDianXueSkillCanUpgrade(allherolist[key].id)) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().servantProxy.checkDianXueSkillCanUpgrade(allherolist[key].id)) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         } 
    //                     }
    //                 }
    //                 case "IsStoreAdmin": {
    //                     //是否被派遣
    //                     let StoreHeroMap = ProxyManager.getInstance().businessProxy.getHeroAppointMap();
    //                     for (let key in allherolist) {
    //                         let herodata = StoreHeroMap.get(allherolist[key].id);
    //                         if (singlelist[1] == "true") {
    //                             if (herodata) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!herodata) {
    //                                 list[i].push(allherolist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 default:
    //                     HDebug.Error("判断语句填写错误:" + str);
    //                     break;
    //             }
    //         }
    //         //所有list[i]取交集,用第一个list里所有元素去遍历后面所有的list
    //         let result = this.AddUpAllList(list);
    //         if (result) {
    //             return result;
    //         }
    //     }
    // }

    // //解析红颜界面
    // public static TranslateWifeViewStr(SelectStr) {
    //     let allwifelist = ProxyManager.getInstance().wifeProxy.wifeList;
    //     if (!allwifelist) {
    //         return;
    //     }
    //     let checklist = SelectStr.split("#");
    //     for (let m = 0; m < checklist.length; m++) {
    //         let singleChecklist = checklist[m].split("&");
    //         let list = [];
    //         for (let i = 0; i < singleChecklist.length; i++) {
    //             let str = singleChecklist[i];
    //             list[i] = [];
    //             let singlelist = str.split("_");
    //             switch (singlelist[0]) {
    //                 case "Attr": {
    //                     //红颜属性
    //                     let templist = [];
    //                     switch (singlelist[1]) {
    //                         case "QM":
    //                             //亲密度
    //                             for (let key in allwifelist) {
    //                                 templist.push({ id: allwifelist[key].id, QM: allwifelist[key].love });
    //                             }
    //                             break;
    //                         case "ML":
    //                             //魅力
    //                             for (let key in allwifelist) {
    //                                 templist.push({ id: allwifelist[key].id, ML: allwifelist[key].flower });
    //                             }
    //                             break;
    //                         case "ALL":
    //                             //总属性=亲密+魅力（我也不知道两个完全不相干的值为什么要相加，问春明）
    //                             for (let key in allwifelist) {
    //                                 let allattr = allwifelist[key].love + allwifelist[key].flower;
    //                                 templist.push({ id: allwifelist[key].id, ALL: allattr });
    //                             }
    //                             break;
    //                         default:
    //                             HDebug.Error("属性条件填写错误：" + singlelist[1]);
    //                             break;
    //                     }
    //                     let data = this.getOperatorResult(templist, singlelist[1], singlelist[2], singlelist[3]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "WifeStar": {
    //                     //红颜品质 用的是本地读表的quality值，所以要构造一个数据队列去处理
    //                     let templist = [];
    //                     for (let key in allwifelist) {
    //                         let heroitem = localcache.getItem(localdb.table_wife, allwifelist[key].id);
    //                         templist.push({ id: allwifelist[key].id, quality: heroitem.quality });
    //                     }
    //                     let data = this.getOperatorResult(templist, "quality", singlelist[1], singlelist[2]);
    //                     for (var key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "WifeHeroSkillOne": {
    //                     //红颜伙伴技能一
    //                     let templist = [];
    //                     for (let key in allwifelist) {
    //                         let wifeData = ProxyManager.getInstance().wifeProxy.getWifeData(allwifelist[key].id);
    //                         templist.push({ id: allwifelist[key].id, level: wifeData.skill[0].level });
    //                     }
    //                     let data = this.getOperatorResult(templist, "level", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "WifeHeroSkillTwo": {
    //                     //红颜伙伴技能二
    //                     let templist = [];
    //                     for (let key in allwifelist) {
    //                         let wifeData = ProxyManager.getInstance().wifeProxy.getWifeData(allwifelist[key].id);
    //                         templist.push({ id: allwifelist[key].id, level: wifeData.skill[1].level });
    //                     }
    //                     let data = this.getOperatorResult(templist, "level", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "CanUpgradeJN": {
    //                     //可升级红颜技能
    //                     for (let key in allwifelist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().wifeProxy.hasSkillUp(allwifelist[key].id)) {
    //                                 list[i].push(allwifelist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().wifeProxy.hasSkillUp(allwifelist[key].id)) {
    //                                 list[i].push(allwifelist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "BeDispatchedCBD": {
    //                     //被派遣到CBD
    //                     for (let key in allwifelist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().CBDProxy.checkWifeDisPatched(allwifelist[key].id)) {
    //                                 list[i].push(allwifelist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().CBDProxy.checkWifeDisPatched(allwifelist[key].id)) {
    //                                 list[i].push(allwifelist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "ExistFetter": {
    //                     //是否已激活羁绊关系
    //                     for (let key in allwifelist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().wifeProxy.hasActivedJiban(allwifelist[key].id)) {
    //                                 list[i].push(allwifelist[key].id);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().wifeProxy.hasActivedJiban(allwifelist[key].id)) {
    //                                 list[i].push(allwifelist[key].id);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "BusinessSkill": {
    //                     //这是特殊筛选，直接调用WifeProxy的方法
    //                     let id = ProxyManager.getInstance().wifeProxy.getTranslateWifeId();
    //                     if (id != 0) {
    //                         list[i].push(id)
    //                     }
    //                     break;
    //                 }
    //                 default:
    //                     HDebug.Error("判断语句填写错误:" + str);
    //                     break;
    //             }
    //         }
    //         //所有list[i]取交集,用第一个list里所有元素去遍历后面所有的list
    //         let result = this.AddUpAllList(list);
    //         if (result) {
    //             return result;
    //         }
    //     }
    // }

    // //解析珍兽界面(PetShowView 和 PetTrainView)
    // public static TranslatePetViewStr(SelectStr) {
    //     if (!ProxyManager.getInstance().petProxy.hasPetList()) {
    //         return;
    //     }
    //     let checklist = SelectStr.split("#");
    //     let allpetlist = ProxyManager.getInstance().petProxy.getPetListByType(PetType.All);
    //     for (let m = 0; m < checklist.length; m++) {
    //         let singleChecklist = checklist[m].split("&");
    //         let list = [];
    //         for (let i = 0; i < singleChecklist.length; i++) {
    //             let str = singleChecklist[i];
    //             list[i] = [];
    //             let singlelist = str.split("_");
    //             switch (singlelist[0]) {
    //                 case "PetLv": {
    //                     //珍兽等级
    //                     let data = this.getOperatorResult(allpetlist, "lv", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].index)
    //                     }
    //                     break;
    //                 }
    //                 case "PetStar": {
    //                     //珍兽品质 用的是本地读表的quality值，所以要构造一个数据队列去处理
    //                     let templist = [];
    //                     for (let key in allpetlist) {
    //                         let petItem = localcache.getItem(localdb.table_pet, allpetlist[key].id);
    //                         templist.push({ index: allpetlist[key].index, quality: petItem.quality });
    //                     }
    //                     let data = this.getOperatorResult(templist, "quality", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].index)
    //                     }
    //                     break;
    //                 }
    //                 case "PetSkill": {
    //                     //珍兽技能数值
    //                     let templist = [];
    //                     for (let key in allpetlist) {
    //                         let petProxy = ProxyManager.getInstance().petProxy;
    //                         let petData = petProxy.getPetServerDataByOnlyId(allpetlist[key].index);
    //                         let petEarnAdd = petProxy.getPetEarnAddValue(petData) / 100;
    //                         templist.push({ index: allpetlist[key].index, skillVal: petEarnAdd });
    //                     }
    //                     let data = this.getOperatorResult(templist, "skillVal", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].index)
    //                     }
    //                     break;
    //                 }
    //                 case "Talent": {
    //                     //珍兽天赋
    //                     let data = this.getOperatorResult(allpetlist, "talentValue", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].index)
    //                     }
    //                     break;
    //                 }
    //                 case "CanUpgradeLV": {
    //                     //珍兽是否可升级
    //                     for (let key in allpetlist) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().petProxy.getIsCanUpgradeByPetId(allpetlist[key].index)) {
    //                                 list[i].push(allpetlist[key].index);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!ProxyManager.getInstance().petProxy.getIsCanUpgradeByPetId(allpetlist[key].index)) {
    //                                 list[i].push(allpetlist[key].index);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "BeEquip": {
    //                     //珍兽是否被携带
    //                     for (let key in allpetlist) {
    //                         if (singlelist[1] == "true") {
    //                             if (allpetlist[key].hID != 0) {
    //                                 list[i].push(allpetlist[key].index);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (allpetlist[key].hID == 0) {
    //                                 list[i].push(allpetlist[key].index);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "PetSkill": {
    //                     //这是特殊筛选，直接调用petProxy的方法
    //                     let Index = ProxyManager.getInstance().petProxy.getTranslatPetIndex();
    //                     if (Index != 0) {
    //                         list[i].push(Index)
    //                     }
    //                     break;
    //                 }
    //                 default:
    //                     HDebug.Error("判断语句填写错误:" + str);
    //                     break;
    //             }
    //         }
    //         //所有list[i]取交集,用第一个list里所有元素去遍历后面所有的list
    //         let result = this.AddUpAllList(list);
    //         if (result) {
    //             return result;
    //         }
    //     }
    // }

    // //解析商城界面
    // //商城只有一个条件，所以不用取交集了
    // public static TranslateMallViewStr(SelectStr) {
    //     let checklist = SelectStr.split("#");
    //     let list = [];
    //     for (let i = 0; i < checklist.length; i++) {
    //         let str = checklist[i];
    //         list[i] = [];
    //         let singlelist = str.split("_");
    //         switch (singlelist[0]) {
    //             case "ItemId":
    //                 //道具id
    //                 return parseInt(singlelist[1]);
    //             default:
    //                 HDebug.Error("判断语句填写错误:" + str);
    //                 break;
    //         }
    //     }
    // };

    // //参数 alllist:总数据源,index:索引的key,operator:运算字符串,tnum:用以判断的值 
    // public static getOperatorResult(alllist, index, operator, tnum) {
    //     let list = [];
    //     let num = parseInt(tnum);
    //     switch (operator) {
    //         case "High": {
    //             for (let key in alllist) {
    //                 if (alllist[key][index] > num) {
    //                     list.push(alllist[key]);
    //                 }
    //             }
    //             list.sort(function (a, b) {
    //                 return a[index] - b[index];
    //             })
    //             return list;
    //         }
    //         case "Low": {
    //             for (let key in alllist) {
    //                 if (alllist[key][index] < num) {
    //                     list.push(alllist[key]);
    //                 }
    //             }
    //             list.sort(function (a, b) {
    //                 return b[index] - a[index];
    //             })
    //             return list;
    //         }
    //         case "Equal":
    //             for (let key in alllist) {
    //                 if (alllist[key][index] == num) {
    //                     list.push(alllist[key]);
    //                 }
    //             }
    //             return list;
    //         case "Max": {
    //             let max = 0;
    //             let maxindex = 0;
    //             for (let key in alllist) {
    //                 if (alllist[key][index] > max) {
    //                     max = alllist[key][index];
    //                     maxindex = parseInt(key);
    //                 }
    //             }
    //             if (alllist[maxindex]) {
    //                 list.push(alllist[maxindex]);
    //             }
    //             return list;
    //         }
    //         case "Min": {
    //             let min = 1e9;
    //             let minindex = 0;
    //             for (let key in alllist) {
    //                 if (alllist[key][index] < min) {
    //                     min = alllist[key][index];
    //                     minindex = parseInt(key);
    //                 }
    //             }
    //             if (alllist[minindex]) {
    //                 list.push(alllist[minindex]);
    //             }
    //             return list;
    //         }
    //         default:
    //             HDebug.Error("操作符填写错误:" + operator);
    //             break;
    //     }
    // }

    // //解析背包界面
    // //背包界面也是只返回具体道具id，所以不用取交集了
    // public static TranslateBagViewStr(SelectStr) {
    //     let checklist = SelectStr.split("#");
    //     let list = [];
    //     for (let i = 0; i < checklist.length; i++) {
    //         let str = checklist[i];
    //         list[i] = [];
    //         let singlelist = str.split("_");
    //         switch (singlelist[0]) {
    //             case "GoodsID":
    //                 //道具id
    //                 return parseInt(singlelist[1]);
    //             case "ComposeID":
    //                 //合成道具id
    //                 return parseInt(singlelist[1]);
    //             default:
    //                 HDebug.Error("判断语句填写错误:" + str);
    //                 break;
    //         }
    //     }
    // }

    // //解析典籍界面  这里解析返回的应该是席位索引
    // //典籍大改，原解析条件全部作废，todo
    // public static TranslateLibraryViewStr(SelectStr) {
    //     let booklist = ProxyManager.getInstance().LibraryProxy.getBookList();
    //     let checklist = SelectStr.split("#");
    //     for (let m = 0; m < checklist.length; m++) {
    //         let singleChecklist = checklist[m].split("&");
    //         let list = [];
    //         for (let i = 0; i < singleChecklist.length; i++) {
    //             let str = singleChecklist[i];
    //             list[i] = [];
    //             let singlelist = str.split("_");
    //             switch (singlelist[0]) {
    //                 case "BookFinish": {
    //                     //判断已婚未派遣徒弟类型
    //                     let typeList = [];
    //                     let exchangedList = ProxyManager.getInstance().LibraryProxy.getFinishBookList();
    //                     for (let key in exchangedList) {
    //                         let childInfo = exchangedList[key].myChildInfo;
    //                         let jobCfg: Cfg_libraryJob = ConfigFinder.Find(localdb.table_libraryJob, childInfo.job);
    //                         let jobType = jobCfg.type;
    //                         if(typeList.indexOf(jobType) == -1) {
    //                             typeList.push(jobType);
    //                         }
    //                     }
    //                     let templist = [];
    //                     let businessProxy = ProxyManager.getInstance().businessProxy;
    //                     let allBuildList = businessProxy.GetBuildIDList(false);
    //                     for (let i = 0; i < allBuildList.length; ++i) {
    //                         let buildID = allBuildList[i];
    //                         let buildData = businessProxy.GetBusinessData(buildID).getCfg();
    //                         if(typeList.indexOf(buildData.type) != -1) {
    //                             let buildBookLv = businessProxy.getBookListLv(buildID);
    //                             templist.push({id: buildID, level: buildBookLv});
    //                         }
    //                     }

    //                     let data = this.getOperatorResult(templist, "level", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id);
    //                     }
    //                     break;

    //                     // let templist = [];
    //                     // for (let key in booklist) {
    //                     //     templist.push({ id: booklist[key].index, level: booklist[key].});
    //                     // }
    //                     // let data = this.getOperatorResult(templist, "level", singlelist[1], singlelist[2]);
    //                     // for (let key in data) {
    //                     //     let seatindex = ProxyManager.getInstance().LibraryProxy.getSeatIndexByBookIndex(data[key].id);
    //                     //     if (seatindex) {
    //                     //         list[i].push(data[key].id);
    //                     //     }
    //                     // }
    //                     // break;

    //                 }
    //                 // case "BookLv": {
    //                 //     //典籍等级
    //                 //     let templist = [];
    //                 //     for (let key in booklist) {
    //                 //         templist.push({ id: booklist[key].index, level: booklist[key].level });
    //                 //     }
    //                 //     let data = this.getOperatorResult(templist, "level", singlelist[1], singlelist[2]);
    //                 //     for (let key in data) {
    //                 //         let seatindex = ProxyManager.getInstance().LibraryProxy.getSeatIndexByBookIndex(data[key].id);
    //                 //         if (seatindex) {
    //                 //             list[i].push(data[key].id);
    //                 //         }
    //                 //     }
    //                 //     break;
    //                 // }
    //                 // case "BookStar": {
    //                 //     //典籍品质
    //                 //     let templist = [];
    //                 //     for (let key in booklist) {
    //                 //         let bookitem = localcache.getItem(localdb.table_library, booklist[key].id);
    //                 //         templist.push({ id: booklist[key].index, star: bookitem.star });
    //                 //     }
    //                 //     let data = this.getOperatorResult(templist, "star", singlelist[1], singlelist[2]);
    //                 //     for (let key in data) {
    //                 //         let seatindex = ProxyManager.getInstance().LibraryProxy.getSeatIndexByBookIndex(data[key].id);
    //                 //         if (seatindex) {
    //                 //             list[i].push(data[key].id);
    //                 //         }
    //                 //     }
    //                 //     break;
    //                 // }
    //                 // case "BookType": {
    //                 //     //典籍类型
    //                 //     for (let key in booklist) {
    //                 //         let bookitem = localcache.getItem(localdb.table_library, booklist[key].id);
    //                 //         if (bookitem.type == singlelist[1]) {
    //                 //             let seatindex = ProxyManager.getInstance().LibraryProxy.getSeatIndexByBookIndex(booklist[key].index);
    //                 //             if (seatindex) {
    //                 //                 list[i].push(seatindex);
    //                 //             }
    //                 //         }
    //                 //     }
    //                 //     break;
    //                 // }
    //                 // case "CanPractice": {
    //                 //     //是否有活力可研读
    //                 //     let seatlist = ProxyManager.getInstance().LibraryProxy.getBase().seatInfo;
    //                 //     for (let key in booklist) {
    //                 //         let bookitem = localcache.getItem(localdb.table_library, booklist[key].id);
    //                 //         if (booklist[key].level < bookitem.maxLevel) {//学习中
    //                 //             let seatindex = ProxyManager.getInstance().LibraryProxy.getSeatIndexByBookIndex(booklist[key].index);
    //                 //             if (singlelist[1] == "true") {
    //                 //                 for (let index in seatlist) {
    //                 //                     if (seatlist[index].pos == seatindex && seatlist[index].power > 0) {
    //                 //                         list[i].push(seatindex)
    //                 //                     }
    //                 //                 }
    //                 //             }
    //                 //             else if (singlelist[1] == "false") {
    //                 //                 for (let index in seatlist) {
    //                 //                     if (seatlist[index].pos == seatindex && seatlist[index].power == 0) {
    //                 //                         list[i].push(seatindex)
    //                 //                     }
    //                 //                 }
    //                 //             }
    //                 //         }
    //                 //     }
    //                 //     break;
    //                 // }
    //                 default:
    //                     HDebug.Error("判断语句填写错误:" + str);
    //                     break;
    //             }
    //         }
    //         //所有list[i]取交集,用第一个list里所有元素去遍历后面所有的list
    //         let result = this.AddUpAllList(list);
    //         if (result) {
    //             return result;
    //         }
    //     }
    // }

    // //解析商业街界面 这里有个蛋疼的点，策划填店铺ID时是对应表里的index，但是用条件索引算出来的，是对应表里的BuildID，所以有一部分是要处理过才能统一传出去
    // public static TranslateStreetViewStr(SelectStr) {
    //     let checklist = SelectStr.split("#");
    //     let BuildIdList = ProxyManager.getInstance().businessProxy.GetBuildIDList(false);
    //     for (let m = 0; m < checklist.length; m++) {
    //         let singleChecklist = checklist[m].split("&");
    //         let list = [];
    //         for (let i = 0; i < singleChecklist.length; i++) {
    //             let str = singleChecklist[i];
    //             list[i] = [];
    //             let singlelist = str.split("_");
    //             switch (singlelist[0]) {
    //                 case "StoreID": {
    //                     //店铺ID index，转成BuildID传出去
    //                     let index = parseInt(singlelist[1]);
    //                     let buildCfgList = localcache.getGroup(localdb.table_build, "index", index);
    //                     return buildCfgList[0].buildID;
    //                 }
    //                 case "StoreType": {
    //                     //店铺类型
    //                     for (let key in BuildIdList) {
    //                         if (ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]).GetBuildType() == singlelist[1]) {
    //                             list[i].push(BuildIdList[key]);
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "StoreLv": {
    //                     //店铺等级
    //                     let templist = [];
    //                     for (let key in BuildIdList) {
    //                         let lv = ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]).GetBuildLevel();
    //                         templist.push({ id: BuildIdList[key], level: lv });
    //                     }
    //                     let data = this.getOperatorResult(templist, "level", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "StoreAdmin": {
    //                     //店铺是否派遣掌柜
    //                     for (let key in BuildIdList) {
    //                         if (singlelist[1] == "true") {
    //                             if (ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]).GetHeroNum() != 0) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]).GetHeroNum() == 0) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "StoreWorker": {
    //                     //店铺伙计数量
    //                     let templist = [];
    //                     for (let key in BuildIdList) {
    //                         let Num = ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]).GetWorkerNum();
    //                         templist.push({ id: BuildIdList[key], WorkerNum: Num });
    //                     }
    //                     let data = this.getOperatorResult(templist, "WorkerNum", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "CanPosition": {
    //                     //是否可招募店员（当前等级没满员）
    //                     for (let key in BuildIdList) {
    //                         let BuildData = ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]);
    //                         let State = ProxyManager.getInstance().businessProxy.getRecruitState(BuildData);
    //                         if (singlelist[1] == "true") {
    //                             if (State == RecruitState.NotMax) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (State == RecruitState.ConfigMax || State == RecruitState.CurBuildLevelMax) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "CanBuild": {
    //                     //店铺是否可解锁
    //                     let cfglist: Cfg_Build[] = ConfigFinder.GetConfigs(localdb.table_build);
    //                     for (let key in cfglist) {
    //                         let isCanUnlock = ProxyManager.getInstance().businessProxy.checkSingleBuildCanUnlock(cfglist[key].buildID, false);
    //                         let BuildData = ProxyManager.getInstance().businessProxy.GetBusinessData(cfglist[key].buildID);
    //                         if (singlelist[1] == "true") {
    //                             if (isCanUnlock) {
    //                                 list[i].push(cfglist[key].buildID);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!isCanUnlock && (!BuildData || BuildData.GetBuildLevel() < 1)) {
    //                                 list[i].push(cfglist[key].buildID);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "CanLevelUp": {
    //                     //店铺是否可升级
    //                     for (let key in BuildIdList) {
    //                         let isCanUpgrade = ProxyManager.getInstance().businessProxy.checkSingleBuildCanUpgrade(BuildIdList[key]);
    //                         if (singlelist[1] == "true") {
    //                             if (isCanUpgrade) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!isCanUpgrade) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "clickPop": {
    //                     //店铺上有任务气泡npc
    //                     for (let key in BuildIdList) {
    //                         let isHasTaskNpc = ProxyManager.getInstance().lushiProxy.GetTaskNpcMgr().CheckBuildHasNpc(BuildIdList[key]);
    //                         if (singlelist[1] == "true") {
    //                             if (isHasTaskNpc) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!isHasTaskNpc) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "EmptySeatHavePersonal": {
    //                     //店铺里有空位且有对应专席伙伴 
    //                     for (let key in BuildIdList) {
    //                         let isHasEmpty = ProxyManager.getInstance().businessProxy.checkHasFreeSeatWithPersonal(BuildIdList[key]);
    //                         if (singlelist[1] == "true") {
    //                             if (isHasEmpty) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!isHasEmpty) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "EmptySeatHavePersonalFree": {
    //                     //店铺里有空位且有对应专席伙伴也空闲 
    //                     for (let key in BuildIdList) {
    //                         let isHasEmpty = ProxyManager.getInstance().businessProxy.checkHasPersonalSeatWithFreeHero(BuildIdList[key]);
    //                         if (singlelist[1] == "true") {
    //                             if (isHasEmpty) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                         else if (singlelist[1] == "false") {
    //                             if (!isHasEmpty) {
    //                                 list[i].push(BuildIdList[key]);
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case "PersonalSeatNotFitNum": {
    //                     //店铺里不符合专席伙伴的数量
    //                     let templist = [];
    //                     for (let key in BuildIdList) {
    //                         let Num = ProxyManager.getInstance().businessProxy.getBuildWrongSeatNum(BuildIdList[key]);
    //                         templist.push({ id: BuildIdList[key], WrongSeatNum: Num });
    //                     }
    //                     let data = this.getOperatorResult(templist, "WrongSeatNum", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "HeroTypeNotFitNum": {
    //                     //店铺里不符合特长伙伴的数量
    //                     let templist = [];
    //                     for (let key in BuildIdList) {
    //                         let Num = ProxyManager.getInstance().businessProxy.getBuildWrongTypeNum(BuildIdList[key]);
    //                         templist.push({ id: BuildIdList[key], WrongTypeNum: Num });
    //                     }
    //                     let data = this.getOperatorResult(templist, "WrongTypeNum", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "ManagerNum": {
    //                     //店铺里掌柜的数量
    //                     let templist = [];
    //                     for (let key in BuildIdList) {
    //                         let BuildData = ProxyManager.getInstance().businessProxy.GetBusinessData(BuildIdList[key]);
    //                         let Num = BuildData.GetHeroNum();
    //                         templist.push({ id: BuildIdList[key], Manager: Num });
    //                     }
    //                     let data = this.getOperatorResult(templist, "Manager", singlelist[1], singlelist[2]);
    //                     for (let key in data) {
    //                         list[i].push(data[key].id)
    //                     }
    //                     break;
    //                 }
    //                 case "CheapRecruitShop": {
    //                     //招工费用最便宜的，特殊方法
    //                     let buildId = ProxyManager.getInstance().businessProxy.getCheapRecruitShop();
    //                     if (buildId != 0) {
    //                         list[i].push(buildId)
    //                     }
    //                     break;
    //                 }
    //                 default:
    //                     HDebug.Error("判断语句填写错误:" + str);
    //                     break;
    //             }
    //         }
    //         //所有list[i]取交集,用第一个list里所有元素去遍历后面所有的list
    //         let result = this.AddUpAllList(list);
    //         if (result) {
    //             return result;
    //         }
    //     }
    // };

    // //把list中每个数组取交集，返回最终结果中的第一个值
    // public static AddUpAllList(list) {
    //     let resultlist = [];
    //     for (let key in list[0]) {
    //         let isfind = true;
    //         for (let i = 1; i < list.length; i++) {
    //             if (list[i].indexOf(list[0][key]) == -1) {
    //                 isfind = false;
    //                 break;
    //             }
    //         }
    //         if (isfind) {
    //             resultlist.push(list[0][key]);
    //         }
    //     }
    //     return resultlist[0];
    // };

    // public static getHeroStr(heroId) {
    //     var heroItem = localcache.getItem(
    //         localdb.table_hero,
    //         heroId + ""
    //     )
    //     if (heroItem) return heroItem.name;
    //     else return "hero:" + heroId;
    // }

    // static propStr = [
    //     "JIANGHU_ALLATTR_STR",
    //     "COMMON_PROP1",
    //     "COMMON_PROP2",
    //     "COMMON_PROP3",
    //     "COMMON_PROP4",
    //     "COMMON_PROP5",
    //     "COMMON_PROP6",
    // ]

    // public static getPropStr(propId) {
    //     //找指定属性名称
    //     return i18n.t(AppUtils.propStr[propId]);
    // }

    // static fengShangPropStr = [
    //     "COMMON_FENGSHANG_PROP1",
    //     "COMMON_FENGSHANG_PROP2",
    //     "COMMON_FENGSHANG_PROP3",
    //     "COMMON_FENGSHANG_PROP4",
    //     "COMMON_FENGSHANG_PROP5",
    //     "COMMON_FENGSHANG_PROP6",
    //     "COMMON_FENGSHANG_PROP7",
    //     "COMMON_FENGSHANG_PROP8",
    // ];

    // public static getFengShangPropStr(propId) {
    //     //找指定属性名称
    //     return i18n.t(AppUtils.fengShangPropStr[propId - 1]);
    // }

    // public static getOfficeDesByCompare(guanTargetDataItem, compareDataItem) {
    //     if (null == guanTargetDataItem) return "";

    //     //为空则是和目标数据一致
    //     if (compareDataItem == null) {
    //         compareDataItem = guanTargetDataItem;
    //     }
    //     var e = "",
    //         o = 1;
    //     if (0 != guanTargetDataItem.heroid) {
    //         var i = localcache.getItem(localdb.table_hero, guanTargetDataItem.heroid);
    //         null != i &&
    //             (e += i18n.t("COMMON_CONTEXT_NUM", {
    //                 c: o++,
    //                 n: i18n.t("JIANGHU_USER_LOCK_HERO", {
    //                     n: i.name
    //                 })
    //             }));
    //     }
    //     //办差相关列表
    //     var jyList =
    //         localcache.getGroup(localdb.table_jyBase, "guanid", guanTargetDataItem.id)
    //         , jyArrary = {};


    //     var addQingAn = guanTargetDataItem.qingAn - compareDataItem.qingAn;
    //     var addMax_zw = guanTargetDataItem.max_zw - compareDataItem.max_zw;
    //     var addMax_jy = guanTargetDataItem.max_jy - compareDataItem.max_jy;
    //     var addMax_pray = guanTargetDataItem.pray - compareDataItem.pray;

    //     let addQingAnStr = addQingAn > 0 ? "+" + addQingAn : "";
    //     let addMax_zwStr = addMax_zw > 0 ? "+" + addMax_zw : "";
    //     let addMax_jyStr = addMax_jy > 0 ? "+" + addMax_jy : "";
    //     let addMax_prayStr = addMax_pray > 0 ? "+" + addMax_pray : "";

    //     if (jyList && jyList.length > 0) {
    //         for (var r = 0; r < jyList.length; r++) {
    //             jyArrary[jyList[r].type] = jyList[r].name;
    //         }

    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_QINAN_GOLD", {
    //                 n: guanTargetDataItem.qingAn,
    //                 add: addQingAnStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIP4", {
    //                 n: guanTargetDataItem.max_zw,
    //                 add: addMax_zwStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIPSP", {
    //                 n: jyArrary[2],
    //                 c: guanTargetDataItem.max_jy,
    //                 add: addMax_jyStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIPSP", {
    //                 n: jyArrary[3],
    //                 c: guanTargetDataItem.max_jy,
    //                 add: addMax_jyStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIPSP", {
    //                 n: jyArrary[4],
    //                 c: guanTargetDataItem.max_jy,
    //                 add: addMax_jyStr
    //             })
    //         });
    //         guanTargetDataItem.pray > 0 &&
    //             (e += i18n.t("COMMON_CONTEXT_NUM", {
    //                 c: o++,
    //                 n: i18n.t("JIANGHU_USER_SP_TIP5", {
    //                     n: guanTargetDataItem.pray,
    //                     add: addMax_prayStr
    //                 })
    //             }));
    //     } else {
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_QINAN_GOLD", {
    //                 n: guanTargetDataItem.qingAn,
    //                 add: addQingAnStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIP1", {
    //                 n: guanTargetDataItem.max_jy,
    //                 add: addMax_jyStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIP2", {
    //                 n: guanTargetDataItem.max_jy,
    //                 add: addMax_jyStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIP3", {
    //                 n: guanTargetDataItem.max_jy,
    //                 add: addMax_jyStr
    //             })
    //         });
    //         e += i18n.t("COMMON_CONTEXT_NUM", {
    //             c: o++,
    //             n: i18n.t("JIANGHU_USER_SP_TIP4", {
    //                 n: guanTargetDataItem.max_zw,
    //                 add: addMax_zwStr
    //             })
    //         });
    //         guanTargetDataItem.pray > 0 &&
    //             (e += i18n.t("COMMON_CONTEXT_NUM", {
    //                 c: o++,
    //                 n: i18n.t("JIANGHU_USER_SP_TIP5", {
    //                     n: guanTargetDataItem.pray,
    //                     add: (addMax_prayStr)
    //                 })
    //             }));
    //     }
    //     return e;
    // }

    // public static GetStageInfo(stageId) {
    //     let zhang = Math.floor(stageId / 100);
    //     let jie = stageId % 100;
    //     return {
    //         bmap: zhang,
    //         mmap: jie
    //     };
    // }

    // public static GetStageStr(stageId, processClock) {
    //     let stageInfo = this.GetStageInfo(stageId);
    //     return i18n.t("MAIN_STAGE_PROCESS_NAME", {
    //         bmap: AppStringUtils.changeToCN(stageInfo.bmap),
    //         mmap: AppStringUtils.changeToCN(stageInfo.mmap),
    //         processClock: processClock
    //     });
    // }
    // //#endregion

    // 检查服务器返回是否存在异常
    public static checkHasErrorMsg(info) {
        return info != null
            && info.a != null
            && info.a.system != null
            && info.a.system.errror != null
    }

    // //例如宠物列表满
    // public static checkNoPetFullError(info) {
    //     return info != null
    //         && info.a != null
    //         && info.a.system != null
    //         && info.a.system.errror != null
    //         && info.a.system.errror.msg != null
    //         && info.a.system.errror.msg != ServerError.PET_LIST_FULL_EMAIL;
    // }

    // public static GetErrorMsg(info): { type: number, msg: string } {
    //     if (this.checkHasErrorMsg(info)) {
    //         return info.a.system.errror;
    //     }
    //     else {
    //         return null;
    //     }
    // }

    // public static getMsgwinItems(info) {
    //     return GuardUtil.SafeReturn(info, "a.msgwin.items");
    // }

    // /**
    //  * 要求里面每个item有 count  id king属性
    //  * @param itemList 
    //  * @returns 
    //  */
    // public static getMergeItemList(itemList): any[] {
    //     let mergeList = [];
    //     let itemMap = new DoubleKeyDic();
    //     if (itemList) {
    //         for (let index = 0; index < itemList.length; ++index) {
    //             let item = itemList[index];
    //             let itemID = item.id;
    //             let itemKind = item.kind;
    //             if (item.count > 0) {
    //                 let numInMap = itemMap.getValue(itemID, itemKind);
    //                 if (null != numInMap) {
    //                     itemMap.setValue(itemID, itemKind, item.count + numInMap);
    //                 }
    //                 else {
    //                     itemMap.setValue(itemID, itemKind, item.count);
    //                 }
    //             }
    //         }
    //     }
    //     itemMap.getMap().forEach((kindMap, itemID) => {
    //         kindMap.forEach((itemCount, kind) => {
    //             mergeList.push({
    //                 id: itemID,
    //                 kind: kind,
    //                 count: itemCount
    //             });
    //         });
    //     });
    //     return mergeList;
    // }

    // public static transServerData(keys, data) {
    //     var array = keys.split(".");
    //     if (data && data[array[0]] && data[array[0]][array[1]] && data[array[0]][array[1]][array[2]]) {
    //         return data[array[0]][array[1]][array[2]];
    //     }
    //     return null;
    // }

    // static characterDataRangeMinList = null;
    // static characterDataMaxList = null;

    // //六维图显示区间最小和最大
    // static IntervalMin = 0.5;
    // static IntervalMax = 0.7;

    // public static getCharacterRangeData(numKey) {
    //     if (!AppUtils.characterDataRangeMinList) {
    //         AppUtils.characterDataRangeMinList = [0, 70, 100];
    //         AppUtils.characterDataMaxList = [100, 140, 200];
    //         for (let i = 0; i < 40; ++i) {
    //             var nowNum = AppUtils.characterDataRangeMinList[AppUtils.characterDataRangeMinList.length - 1] * AppUtils.IntervalMax / AppUtils.IntervalMin;
    //             AppUtils.characterDataRangeMinList.push(nowNum);
    //             AppUtils.characterDataMaxList.push((Math.ceil(nowNum * 0.02 * 2) + 1) * 50);
    //         }
    //     }

    //     while (AppUtils.characterDataRangeMinList[AppUtils.characterDataRangeMinList.length - 1] < numKey) {
    //         for (let i = 0; i < 5; ++i) {
    //             var nowNum = AppUtils.characterDataRangeMinList[AppUtils.characterDataRangeMinList.length - 1] * AppUtils.IntervalMax / AppUtils.IntervalMin;
    //             AppUtils.characterDataRangeMinList.push(nowNum);
    //             AppUtils.characterDataMaxList.push((Math.ceil(nowNum / 50) + 1) * 50);
    //         }
    //     }
    //     var arr = AppUtils.characterDataRangeMinList;
    //     //2分搜索
    //     var low = 0;
    //     var high = arr.length - 2;
    //     var finalIndex = 0;
    //     while (low <= high) {
    //         var mid = Math.floor((low + high) / 2);
    //         if (numKey > arr[mid] && numKey <= arr[mid + 1]) {
    //             //搜索成功
    //             finalIndex = mid;
    //             break;;
    //         } else if (numKey > arr[mid]) {
    //             low = mid + 1;
    //         } else {
    //             high = mid - 1;
    //         }
    //     }

    //     return { startNum: AppUtils.characterDataRangeMinList[finalIndex], maxNum: AppUtils.characterDataMaxList[finalIndex] };
    // }

    // public static getTodyNum() {
    //     let date = new Date(TimeUtil.getInstance().second * 1000);
    //     let d = date.getDate();
    //     let m = date.getMonth() + 1;
    //     let y = date.getFullYear();
    //     return `${y}${m >= 10 ? m : "0" + m}${d >= 10 ? d : "0" + d}`;
    // }

    // //获取文本
    // public static getStr(textId, data) {
    //     var conditionTextItem = localcache.getItem(
    //         localdb.table_conditionText,
    //         textId + ""
    //     );

    //     //TODO 条件判断
    //     if (!conditionTextItem) { return "null textId, " + textId; }
    //     var str = conditionTextItem.text1;
    //     switch (conditionTextItem.condition) {
    //         case ConditionTType.None:
    //             str = conditionTextItem.text1;
    //             break;
    //         case ConditionTType.Profession:
    //             var nowParams = ProxyManager.getInstance().playerProxy.getProfession();
    //             switch (nowParams + "") {
    //                 case conditionTextItem.param1:
    //                     str = conditionTextItem.text1;
    //                     break;
    //                 case conditionTextItem.param2:
    //                     str = conditionTextItem.text2;
    //                     break;
    //                 case conditionTextItem.param3:
    //                     str = conditionTextItem.text3;
    //                     break;
    //                 default:
    //                     str = conditionTextItem.otherText;
    //                     break;
    //             }
    //             break;

    //         case ConditionTType.MainCharacter:
    //             var cList = ProxyManager.getInstance().playerProxy.getCharacterList();

    //             var mainId = 0;
    //             for (var key = 0; key < cList.length; ++key) {
    //                 if (cList[mainId] < cList[key]) {
    //                     mainId = key;
    //                 }
    //             }
    //             switch ((mainId + 1) + "") {
    //                 case conditionTextItem.param1:
    //                     str = conditionTextItem.text1;
    //                     break;
    //                 case conditionTextItem.param2:
    //                     str = conditionTextItem.text2;
    //                     break;
    //                 case conditionTextItem.param3:
    //                     str = conditionTextItem.text3;
    //                     break;
    //                 default:
    //                     str = conditionTextItem.otherText;
    //                     break;
    //             }
    //             break;
    //         default:
    //             HDebug.Error("TODO, can not fix this condition, condition is " + conditionTextItem.condition);
    //             return "null textId, err condition, " + textId;
    //     }

    //     if (str != null) {
    //         for (var a in data) {
    //             str = FwUtils.replaceAllStr(str, "%{" + a + "}", data[a])
    //         }
    //         return str;
    //     } else {
    //         return "null textId, " + textId;
    //     }
    // }

    // public static calculateMonsterNeiCost(monsterGong, selfGong, uArmy) {
    //     monsterGong = Math.max(1, monsterGong);
    //     selfGong = Math.max(1, selfGong);

    //     var cfgAll = localcache.getList(localdb.table_battleParam);

    //     var uEpBeishu = Math.floor(selfGong * 100 / monsterGong);

    //     var cfgParam = null;

    //     var uRangeKey = 0;
    //     for (var i = 0; i < cfgAll.length; ++i) {
    //         if (uEpBeishu <= cfgAll[i].beishu) {
    //             cfgParam = cfgAll[i];
    //             uRangeKey = cfgAll[i].beishu - uRangeKey;
    //             break;
    //         } else {
    //             uRangeKey = cfgAll[i].beishu;
    //         }
    //     }

    //     //做个判断
    //     if (cfgParam == null) {
    //         cfgParam = cfgAll[cfgAll.length - 1];
    //         HDebug.Assert(false, "cfgParam is null, " + monsterGong + ", " + selfGong + ", " + uArmy);
    //     }
    //     var uDelCount = 0;
    //     uDelCount = cfgParam.MinParam + (cfgParam.beishu - uEpBeishu) * (cfgParam.MaxParam - cfgParam.MinParam) / uRangeKey;

    //     // uDelCount = uDelCount / 100;
    //     var need_army = Math.floor(uArmy * uDelCount / 100);
    //     need_army = need_army > 0 ? need_army : 1;
    //     return need_army;
    // }

    // public static getMonsterNeiCostIndex(monsterGong, selfGong, uArmy) {
    //     monsterGong = Math.max(1, monsterGong);
    //     selfGong = Math.max(1, selfGong);

    //     var cfgAll = localcache.getList(localdb.table_battleParam);

    //     var uEpBeishu = selfGong * 100 / monsterGong;

    //     var cfgParam = null;

    //     var uRangeKey = 0;

    //     var index = 0;
    //     for (index = 0; index < cfgAll.length; ++index) {
    //         if (uEpBeishu <= cfgAll[index].beishu) {
    //             cfgParam = cfgAll[index];
    //             uRangeKey = cfgAll[index].beishu - uRangeKey;
    //             break;
    //         } else {
    //             uRangeKey = cfgAll[index].beishu;
    //         }
    //     }

    //     if (index >= cfgAll.length) {
    //         HDebug.Assert(false, "过分的数值！！！" + monsterGong + ", " + selfGong);
    //         index = cfgAll.length - 1;
    //     };

    //     return index;
    // }

    // public static getMapBattlePercent(monsterGong, selfGong) {
    //     monsterGong = Math.max(1, monsterGong);
    //     selfGong = Math.max(1, selfGong);

    //     let cfgAll = localcache.getList(localdb.table_battleParam);

    //     let uEpBeishu = selfGong * 100 / monsterGong;

    //     let cfgParam = null;
    //     let uRangeKey = 0;
    //     for (let index = 0; index < cfgAll.length; ++index) {
    //         if (uEpBeishu <= cfgAll[index].beishu) {
    //             cfgParam = cfgAll[index];
    //             uRangeKey = cfgAll[index].beishu - uRangeKey;
    //             break;
    //         }
    //         else {
    //             uRangeKey = cfgAll[index].beishu;
    //         }
    //     }
    //     let precent = cfgParam.MinParam + (cfgParam.beishu - uEpBeishu) * (cfgParam.MaxParam - cfgParam.MinParam) / uRangeKey
    //     return precent;
    // }

    // public static GetStrMD5(text: string) {
    //     return MD5.md5(text);
    // }

    // //补丁，用于处理物品列表，目前作用于去除不同性别不该显示的奖励
    // public static ProcessRewards(items: ItemClass[]): ItemClass[] {
    //     if(items == null) {
    //         return null;
    //     }
    //     let list: ItemClass[] = [];
    //     for (let i = 0; i < items.length; i++) {
    //         let item = items[i];

    //         if (item.kind) {
    //             if (item.param && (item.kind == DataType.CHARACTER_HERO || item.kind == DataType.CHARACTER_WIFE)) {
    //                 let sex = ProxyManager.getInstance().playerProxy.sex;
    //                 if (
    //                     (sex == UserSex.Male && item.param != UserSex.Male)
    //                     || (sex == UserSex.FeMale && item.param != UserSex.FeMale)
    //                 ) {
    //                     continue;
    //                 }
    //             }

    //             if (item.kind == DataType.HEAD) {
    //                 continue;
    //             }
    //             //宴贴过滤
    //             if (item.kind == DataType.PARTY_TICKET) {
    //                 continue;
    //             }
    //             if (item.kind == DataType.WIFE_FLOWER) {
    //                 continue;
    //             }
    //             if (item.id == CurrencyItem.MiJuan) {
    //                 continue;
    //             }
    //         }

    //         list.push(item);
    //     }
    //     return list;
    // }

    // /**
    //  * 随机名字
    //  * @param sex 1男2女 3不分男女 
    //  */
    // public static randomName(sex: number) {
    //     let lastNameConfig = localcache.getList(localdb.table_lastName);
    //     let lastName = FwUtils.getRandomArrayItem(lastNameConfig, 1)[0].name;
    //     let boyNameConfig = localcache.getList(localdb.table_boyName);
    //     let girlNameConfig = localcache.getList(localdb.table_girlName);
    //     let firstNameConfig;
    //     if (sex == 1) {
    //         firstNameConfig = boyNameConfig;
    //     }
    //     else if (sex == 2) {
    //         firstNameConfig = girlNameConfig;
    //     }
    //     else {
    //         firstNameConfig = boyNameConfig.concat(girlNameConfig);
    //     }
    //     let firstName = FwUtils.getRandomArrayItem(firstNameConfig, 1)[0].name;
    //     return lastName + firstName;
    // }

    // /**
    //  * 根据地区取计费点原价
    //  * @param info 传进来的配置或者数据
    //  */
    // public static getPayOgrinPrice(info) {
    //     let str = info.ogrinPrice;
    //     if (SDKCtrl.getInstance().getIPArea() == IPCode.HK) {
    //         str = info.ogrinPriceHK;
    //     }
    //     else if (SDKCtrl.getInstance().getIPArea() == IPCode.US) {
    //         str = info.ogrinPriceUS;
    //     }
    //     return str;
    // }

    // /**
    //  * 根据地区取计费点现价
    //  * @param info 传进来的配置或者数据
    //  */
    // public static getPayPrice(info) {
    //     let str = info.priceName;
    //     if (SDKCtrl.getInstance().getIPArea() == IPCode.HK) {
    //         str = info.priceNameHK;
    //     }
    //     else if (SDKCtrl.getInstance().getIPArea() == IPCode.US) {
    //         str = info.priceNameUS;
    //     }
    //     return str;
    // }

    // /**
    //  * 获取充值配置
    //  * @param productID 计费点id
    //  */
    // public static getRechargeConfig(productID: number): Cfg_charge {
    //     let pf = GlobalConfig.rechargePf;
    //     let configGroup = localcache.getGroup(localdb.table_charge, "productID", productID);
    //     for (let index = 0, len = configGroup.length; index < len; ++index) {
    //         if (pf == configGroup[index].platType) {
    //             return configGroup[index];
    //         }
    //     }
    //     HDebug.Assert(true, "往charge表取productID:" + productID + "的时候取不到");
    // }

    // /**
    //  * 播放美术做的prefab形式的动画, 
    //  * @param url 
    //  * @param clipIndex 第几个动画index 
    //  */
    // public static playPrefabAni(parent: cc.Node, url: string, clipIndex: number = 0) {
    //     UiUtils.loadPrefab(parent, url, (err, node: cc.Node) => {
    //         if (err) {
    //             HDebug.Log("--playPrefabAni--err-", err);
    //             return;
    //         }
    //         let ani = node.getComponent(cc.Animation);
    //         let clips = ani.getClips();
    //         let clip = clips[clipIndex];
    //         if (clip) {
    //             node.parent = parent;
    //             ani.on('finished', () => {
    //                 node.destroy();
    //             });
    //             ani.play(clip.name);
    //         }
    //     });
    // }

    // public static showNormalBuy(itemId: number) {
    //     if (CurrencyItem.DiscountCurrency == itemId) {
    //         UIControl.JumpToPanel(PanelType.DiscountView_CommonBuy, { pindex: LimitActivityPindex.StartDiscount });
    //     }
    //     else {
    //         this.showNormalBuyWithNeedSend(itemId, false);
    //     }

    // }
    // //通用物品購買
    // public static showNormalBuyWithNeedSend(itemId: number, needSend: boolean) {
    //     let priceItem: Cfg_normalShop = ConfigFinder.Find
    //         <Cfg_normalShop>(localdb.table_normalShop, itemId),

    //         noBuyTimesCB = () => {
    //             AlertUtils.Instance().alertItemLimit(priceItem.currency);
    //         },
    //         clickFunc = (shopItemId: number, count: number, costNum: number) => {
    //             /// 购买回调
    //             ProxyManager.getInstance().MallProxy.SendBuyItem(false, priceItem.goods_id, count);
    //         },
    //         openSuccessCB = () => {
    //             /// 打开界面之后的回调
    //         }
    //     HDebug.Assert(null != priceItem, "沒配置還想購買？？請檢查normalShop，id[" + itemId + "]");

    //     let limitNum = 99;
    //     if (priceItem.is_limit) {
    //         limitNum = priceItem.limit
    //     }

    //     new CommonBuy(itemId, true)
    //         .SetCostInfo({
    //             costItem: { kind: priceItem.item_type, id: priceItem.currency },
    //             costCount: priceItem.price
    //         })
    //         .SetMaxBuyNum(limitNum)
    //         .SetNoBuyTimesCB(noBuyTimesCB)
    //         .SetSendMarketGift(needSend)
    //         .SetConfirmDo(clickFunc)
    //         .ShowView(openSuccessCB);
    // }

    // public static compareValue(compareValue: number, compareType: CfgEnum_CompareType, param: number) {
    //     switch (compareType) {
    //         //小于
    //         case CfgEnum_CompareType.Less: {
    //             return compareValue < param;
    //         }
    //         //小于等于
    //         case CfgEnum_CompareType.LessOrEqual: {
    //             return compareValue <= param;
    //         }
    //         //等于
    //         case CfgEnum_CompareType.Equal: {
    //             return compareValue == param;
    //         }
    //         //大于等于
    //         case CfgEnum_CompareType.GreaterOrEqual: {
    //             return compareValue >= param;
    //         }
    //         //大于
    //         case CfgEnum_CompareType.Greater: {
    //             return compareValue > param;
    //         }
    //         default: {
    //             HDebug.Error("有未处理的比较类型：" + compareType);
    //             return false;
    //         }
    //     }
    // }

    // public static setStandImg(imgNode: cc.Node, standImgResID, isAlignHead: boolean) {
    //     HDebug.Assert(null != imgNode, "加载立绘节点为空,standImgResID:" + standImgResID);
    //     UiUtils.loadSpriteFrameWithUrl(imgNode, UIHelps.getHeroStandUrl(standImgResID));
    //     let standImgCfg: Cfg_standImgOffset[] =
    //         ConfigFinder.FindGroupWithKey(localdb.table_standImgOffset, "name", standImgResID);
    //     let offset;
    //     HDebug.Assert(null != standImgCfg, "standImgOffset表没有对应立绘的偏移配置,standImgResID:" + standImgResID);
    //     if (isAlignHead) {
    //         offset = null != standImgCfg ? standImgCfg[0].headPos : cc.v2(0, 0);
    //     }
    //     else {
    //         offset = null != standImgCfg ? standImgCfg[0].footPos : cc.v2(0, 0);
    //     }
    //     imgNode.x = offset.x;
    //     imgNode.y = offset.y;
    //     imgNode.scale = 1.25;
    // }

    // public static checkRealIconOpen(panelType: PanelType) {
    //     let iconOpenItem: Cfg_iconOpen = ConfigFinder.Find<Cfg_iconOpen>(localdb.table_iconOpen, panelType);
    //     let isOpen = OpenRuleManager.Instance().CheckCanOpen(panelType);
    //     let passGuide = ProxyManager.getInstance().playerProxy.isUnlockGuideByIconOpen(iconOpenItem);

    //     return isOpen && passGuide;
    // }

    // //下面两个方法用于统计花费了多少钱
    // //用于获取货币类型
    // public static getMoneyType(price: string) {
    //     for (let i = 0; i < price.length; ++i) {
    //         if (price[i] >= '0' && price[i] <= '9') {
    //             let cutStr = price.substr(0, i);
    //             return cutStr;
    //         }
    //     }
    // }

    // public static getMoneyNum(price: string) {
    //     let cutStr = "";
    //     for (let i = 0; i < price.length; ++i) {
    //         if (price[i] >= '0' && price[i] <= '9') {
    //             cutStr = price.substr(i, price.length - i);
    //             break;
    //         }
    //     }
    //     for (let j = 0; j < cutStr.length; ++j) {
    //         if (!((cutStr[j] >= '0' && cutStr[j] <= '9') || cutStr[j] == ".")) {
    //             AlertUtils.Instance().alert("包含了數字內不可能存在的字符");
    //             return;
    //         }
    //     }
    //     return Number(cutStr);
    // }

    // public static getBaseResTypeName(type: BaseResourceType) {
    //     let str = i18n.t(`BASE_TYPE_NAME_${type}`);
    //     return str;
    // }

    // public static restartGame() {
    //     cc.audioEngine.stopAll();
    //     LockManager.Instance().OnGameRestart();
    //     cc.game.restart();
    // }

    // // 按钮上下浮动
    // public static runFrameUpDown(node: cc.Node, oriY: number, during = 1.0, step = 5) {
    //     if (node.getNumberOfRunningActions() > 0) {
    //         return;
    //     }
    //     node.runAction(cc.sequence(
    //         cc.moveTo(during, node.x, oriY - step),
    //         cc.moveTo(during, node.x, oriY + step),
    //     ).repeatForever());
    // }
}

// class ItemClass {
//     id: number;
//     count?: number;
//     kind?: DataType;
//     param?: UserSex;
// }

// /**
//  * 通用的购买，物品价格不变
//  */
// export class CommonBuy {
//     protected m_iShopItemID: number = 0;
//     protected m_iShowItemOwnNum: number = 0;
//     protected m_bIsEnumItem: boolean = false;
//     /**
//      * 
//      * @param shopItemId 
//      * @param isEnumItem 
//      * @param itemCount     特殊道具拥有数量
//      */
//     constructor(shopItemId: number, isEnumItem: boolean, itemCount?: number) {
//         this.m_iShopItemID = shopItemId;
//         this.m_bIsEnumItem = isEnumItem;
//         this.m_iShowItemOwnNum = itemCount;
//     }

//     protected m_costItemInfo = { kind: 1, id: 1 };
//     protected m_costArr: { times: number, cost: number }[] = [];
//     /**
//      * 消耗物品的信息
//      * @param costInfo 
//      * {
//      *       costItem:{kind: number, id:number},
//      *       costCount:number
//      *   }
//      */
//     SetCostInfo(costInfo) {
//         let info = costInfo as {
//             costItem: { kind: number, id: number },
//             costCount: number
//         };
//         this.m_costItemInfo = info.costItem;
//         this.m_costArr.push({ times: 0, cost: info.costCount });
//         return this;
//     }

//     needSendMarketGift: boolean = false;
//     SetSendMarketGift(bol) {
//         this.needSendMarketGift = bol;
//         return this;
//     }

//     protected m_iShopItemKind: number = 1;
//     SetItemKind(kind: number) {
//         this.m_iShopItemKind = kind;
//         return this;
//     }

//     protected m_iShopItemCount: number = 1;
//     SetItemCount(Count: number) {
//         this.m_iShopItemCount = Count;
//         return this;
//     }

//     protected m_confirmDo: (shopItemId: number, count: number, costNum: number) => void;
//     SetConfirmDo(confirmDo: (shopItemId: number, count: number, costNum: number) => void) {
//         this.m_confirmDo = confirmDo;
//         return this;
//     }

//     protected m_customizeInfo: { tips: string, title?: string, tipsColor?: cc.Color } = null;
//     SetCustomizeInfo(tips?: string, title?: string, tipsColor?: cc.Color) {
//         this.m_customizeInfo = {
//             tips: tips,
//             title: title,
//             tipsColor: tipsColor
//         }
//         return this;
//     }

//     protected m_noBuyTimesCB: () => void;
//     SetNoBuyTimesCB(cb: () => void) {
//         this.m_noBuyTimesCB = cb;
//         return this;
//     }

//     //剩余限购次数
//     protected m_iMaxLimitBuyNum: number = 99;
//     SetMaxBuyNum(maxBuyNum: number) {
//         this.m_iMaxLimitBuyNum = maxBuyNum;
//         return this;
//     }
//     //拖动条拖到某个个数时的价格
//     protected m_costMap: Map<number, number> = new Map<number, number>();

//     protected m_iDiamondBuyNum: number = 0;
//     CollectData() {
//         let bagProxy = ProxyManager.getInstance().bagProxy;
//         if(this.m_iShowItemOwnNum == 0) {
//             this.m_iShowItemOwnNum = bagProxy.getItemCount(this.m_iShopItemID, this.m_bIsEnumItem);
//         }
//         this.m_costMap = new Map<number, number>();
//         let costItemInBag = ProxyManager.getInstance().bagProxy.getItemCount(this.m_costItemInfo.id);
//         //算单价
//         let singleCost = this.m_costArr[0].cost;
//         if (singleCost > 0) {
//             this.m_iDiamondBuyNum = Math.floor(costItemInBag / singleCost);
//         }
//         else {
//             this.m_iDiamondBuyNum = this.m_iMaxLimitBuyNum;
//         }

//         this.m_costMap.set(0, 0);
//         let total = 0;
//         for (let index = 1; index <= this.m_iMaxLimitBuyNum; ++index) {
//             total += singleCost;
//             this.m_costMap.set(index, total);
//         }

//         return {
//             ItemKind: this.m_iShopItemKind,
//             ItemCount: this.m_iShopItemCount,
//             shopItemID: this.m_iShopItemID,
//             itemOwnNum: this.m_iShowItemOwnNum,
//             costItem: this.m_costItemInfo,
//             costMap: this.m_costMap,
//             maxBuyNum: this.m_iMaxLimitBuyNum,
//             diamondBuyNum: this.m_iDiamondBuyNum,
//             customizeInfo: this.m_customizeInfo,
//             successCallBack: null,
//             confirmDo: this.m_confirmDo,
//         };
//     }

//     ShowView(successCallBack?: Function) {
//         let data = this.CollectData();
//         data.successCallBack = successCallBack;
//         if (data.maxBuyNum > 0) {
//             UIControl.JumpToPanel(PanelType.CommonBuyConfirm, data);
//             if (this.needSendMarketGift) {
//                 //MarketManager.getInstance().CheckAndPutLimitItem(this.m_iShopItemID, this.m_bIsEnumItem ? 2 : 1);
//             }
//         }
//         else {
//             if (null != this.m_noBuyTimesCB) {
//                 this.m_noBuyTimesCB();
//             }
//         }
//     }
// }

// export class CommonBuyEX extends CommonBuy {
//     /**
//      * 当前已经买的数量次数
//      */
//     private m_iCurBuyNum: number = 0;
//     /**
//      * 消耗物品的信息
//      * @param costInfo 
//      * {
//      *      costItem:{kind: number, id:number}, 
//      *      costArr:{times: number, cost: number}[], 
//      *      curBuyNum: number
//      *  }
//      */
//     SetCostInfo(costInfo) {
//         let info = costInfo as {
//             costItem: { kind: number, id: number },
//             costArr: { times: number, cost: number }[],
//             curBuyNum: number
//         };
//         this.m_costItemInfo = info.costItem;
//         this.m_costArr = costInfo.costArr;
//         this.m_iCurBuyNum = info.curBuyNum;
//         return this;
//     }

//     CollectData() {
//         let bagProxy = ProxyManager.getInstance().bagProxy
//         this.m_iShowItemOwnNum = bagProxy.getItemCount(this.m_iShopItemID, this.m_bIsEnumItem)
//         this.m_costMap = new Map<number, number>();
//         let costItemInBag = ProxyManager.getInstance().bagProxy.getItemCount(this.m_costItemInfo.id);

//         let costArr = this.m_costArr;
//         costArr.sort((a, b) => {
//             return a.times - b.times;
//         });
//         let arrLength = costArr.length;
//         let curCostIndex = 0;
//         for (curCostIndex = 0; curCostIndex + 1 < arrLength; ++curCostIndex) {
//             if (this.m_iCurBuyNum <= costArr[curCostIndex].times) {
//                 break;
//             }
//         }

//         this.m_costMap.set(0, 0);
//         let total = 0;
//         let buyNum = 0;
//         let maxNum = this.m_iMaxLimitBuyNum;
//         for (let index = 1; index <= maxNum; ++index) {
//             let curTimes = this.m_iCurBuyNum + index;
//             if (curTimes > costArr[curCostIndex].times && (curCostIndex + 1) < arrLength) {
//                 curCostIndex++;
//             }
//             total += costArr[curCostIndex].cost;
//             if (total <= costItemInBag) {
//                 buyNum = index;
//                 this.m_costMap.set(index, total);
//             }
//             else break;

//         }
//         this.m_iDiamondBuyNum = buyNum;

//         return {
//             ItemKind: this.m_iShopItemKind,
//             ItemCount: this.m_iShopItemCount,
//             shopItemID: this.m_iShopItemID,
//             itemOwnNum: this.m_iShowItemOwnNum,
//             costItem: this.m_costItemInfo,
//             costMap: this.m_costMap,
//             maxBuyNum: this.m_iMaxLimitBuyNum,
//             diamondBuyNum: this.m_iDiamondBuyNum,
//             customizeInfo: this.m_customizeInfo,
//             successCallBack: null,
//             confirmDo: this.m_confirmDo,
//         };
//     }

//     public static getRwd(itemDataList) {
//         let itemList = new Array();
//         let dataArr = itemDataList.split(",");
//         for (let index = 0; index < dataArr.length; ++index) {
//             let itemInfoArr = dataArr[index].split("|");
//             let itemSlotData = new ItemSlotData();
//             itemSlotData.id = itemInfoArr.length > 0 ? parseInt(itemInfoArr[0]) : 0;
//             itemSlotData.count = itemInfoArr.length > 1 ? parseInt(itemInfoArr[1]) : 0;
//             itemSlotData.kind = itemInfoArr.length > 2 ? parseInt(itemInfoArr[2]) : 0;
//             itemList.push(itemSlotData);
//         }
//         return itemList;
//     };

//     public static getRwdItem(itemDataList) {
//         //会去重
//         let rwdItemList = new Array();
//         let dic = {};
//         if (null != itemDataList) {
//             for (let index = 0; index < itemDataList.length; index++) {
//                 let itemID = itemDataList[index].itemid;
//                 if (1 != dic[itemID]) {
//                     dic[itemID] = 1;
//                     rwdItemList.push({
//                         id: itemID
//                     });
//                 }
//             }
//         }

//         return rwdItemList;
//     };
// }

export class LabelCountDown {
    private label: cc.Label|cc.RichText = null;
    private endTime: number = 0;
    private timesUpCB: Function = null;
    private needRefresh: boolean = true;
    private i18nKey: string = null;
    private transKey: string = null;
    private timeFormat: string = null;
    constructor(label: cc.Label | cc.RichText, endTime: number) {
        this.label = label
        this.endTime = endTime;
    }
    public SetTimeUpCB(cb: Function): LabelCountDown {
        this.timesUpCB = cb;
        return this;
    }

    public SetRefresh(needRefresh: boolean): LabelCountDown {
        this.needRefresh = needRefresh;
        return this;
    }

    public SetI18nKey(i18nKey: string): LabelCountDown {
        this.i18nKey = i18nKey;
        return this;
    }

    public SetTransKey(transKey: string): LabelCountDown {
        this.transKey = transKey;
        return this;
    }

    public SetTimeFormat(timeFormat: string): LabelCountDown {
        this.timeFormat = timeFormat;
        return this;
    }

    public Start() {
        let endTime = this.endTime;
        if (null != this.label && 0 != endTime) {
            let timeFormat = this.timeFormat;
            let transKey = this.transKey;
            let i18nKey = this.i18nKey;
            let needRefresh = this.needRefresh;
            let updateFunc = () => {
                let timeUtils = Utils.timeUtil;
                let leftTime = endTime - timeUtils.second;
                let setLabel = (time: number) => {
                    if (transKey && "" != i18nKey) {
                        let c = {};
                        c[transKey] = timeUtils.second2hms(time, timeFormat);
                        this.label.string = i18n.t(i18nKey, c);
                    } else
                        this.label.string =
                            (i18nKey && "" != i18nKey ? i18n.t(i18nKey) : "") +
                            timeUtils.second2hms(time, timeFormat);
                }

                if (leftTime > 0 && needRefresh) {
                    setLabel(leftTime);
                }
                else if (leftTime <= 0) {
                    setLabel(0);
                    this.label.unscheduleAllCallbacks();
                    this.timesUpCB && this.timesUpCB();
                }
            }
            this.label.unscheduleAllCallbacks();
            this.label.schedule(updateFunc, 0.95);
            updateFunc();
        }
    }

    public Stop() {
        this.label && this.label.unscheduleAllCallbacks();
    }
}

// //顺序Animation播放控制器
// export class SeqAnimProcess {
//     protected playlist: string[] = [];
//     protected node: cc.Node = null;
//     protected state: AnimPlayState = AnimPlayState.Stop;
//     protected timerId: number = -1;
//     protected totalAnimTime: number = null;     //总动画时长
//     constructor(node) {
//         this.node = node;
//     }

//     public getPlayState(): AnimPlayState {
//         return this.state;
//     }

//     public setPlaylist(list: string[]) {
//         this.playlist = list;
//         this.calculateTotalAnimTime();
//     }

//     public getAnimClipByName(name: string) {
//         let clips = this.node.getComponent(cc.Animation).getClips();
//         for (let index = 0; index < clips.length; ++index) {
//             if (name == clips[index].name) {
//                 return clips[index];
//             }
//         }
//     }

//     //计算该序列所有动画总时长
//     protected calculateTotalAnimTime() {
//         let time = 0;
//         for (let i = 0; i < this.playlist.length; ++i) {
//             let clipName = this.playlist[i];
//             let clip = this.getAnimClipByName(clipName);
//             time += clip.duration;
//         }
//         HDebug.Assert(time != 0, "动画总时长为0，检查传入序列");
//         this.totalAnimTime = time;
//     }

//     public Play() {
//         HDebug.Assert(this.timerId < 0, "当前已正在播放animation");
//         let nextPlayAnim = this.playlist.shift();
//         if (nextPlayAnim) {
//             let animation = this.node.getComponent(cc.Animation);
//             HDebug.Assert(animation != null, "当前node没有绑Animation组件")
//             if (animation != null) {
//                 let clip = this.getAnimClipByName(nextPlayAnim);
//                 if (clip) {
//                     let aniState = animation.play(nextPlayAnim);
//                     this.state = AnimPlayState.Playing;
//                     this.timerId = TimerManager.Instance().AddTimer(aniState.duration, () => {
//                         this.clearTimer();
//                         this.Play();
//                     })
//                 }
//             }
//         }
//     }

//     public Stop() {
//         this.node.getComponent(cc.Animation).stop();
//         this.clearTimer();
//     }

//     public clearTimer() {
//         if (this.timerId > 0) {
//             TimerManager.Instance().RemoveTimer(this.timerId);
//             this.timerId = -1;
//         }
//         this.state = AnimPlayState.Stop;
//     }
// }

// //带速度控制的版本
// export class SeqAnimProcessEnhancer extends SeqAnimProcess {
//     private standardSpeedFactorList: number[] = [];     //基准速度倍率，每段动画的播放speed要乘以这个参数来统一标准
//     private totalTime: number = null;
//     private leftTime: number = null;
//     private totalStandardAnimTime: number = null;

//     public setTotalTime(time: number) {
//         this.totalTime = time;
//     }

//     public setLeftTime(time: number) {
//         this.leftTime = time;
//     }

//     public setStandardList(list: number[]) {
//         this.standardSpeedFactorList = list;
//         this.calculateStandardAnimTime();
//     }

//     private calculateStandardAnimTime() {
//         let time = 0;
//         if (this.standardSpeedFactorList.length != 0 || this.playlist.length != 0) {
//             for (let i = 0; i < this.playlist.length; ++i) {
//                 let name = this.playlist[i]
//                 let clip = this.getAnimClipByName(name);
//                 let standardSpeed = this.standardSpeedFactorList[i];
//                 time += clip.duration * (1 / standardSpeed);
//             }
//         }
//         HDebug.Assert(time != 0, "计算动画标准时长有误，请检查");
//         this.totalStandardAnimTime = time;
//     }

//     private calculateSpeed(): number {
//         let speed = this.totalStandardAnimTime / this.totalTime;
//         HDebug.Assert(speed != 0, "计算动画播放速度有误，请检查");
//         return speed;
//     }

//     //用总时间，剩余时间，计算处于哪个动画之中，哪个阶段
//     public calculateAndPlay() {
//         let percent = 1 - (this.leftTime / this.totalTime);
//         let currentTime = this.totalAnimTime * percent;
//         let playNum = this.playlist.length;
//         for (let i = 0; i < playNum; ++i) {
//             if (currentTime <= 0) {
//                 break;
//             }
//             let name = this.playlist.shift();
//             let standardSpeed = this.standardSpeedFactorList.shift();
//             let clip = this.getAnimClipByName(name);
//             if (currentTime >= clip.duration) {

//             }
//             else {
//                 let animComp = this.node.getComponent(cc.Animation);
//                 HDebug.Assert(animComp != null, "当前node没有绑Animation组件")
//                 let aniState = animComp.play(name, currentTime);
//                 this.state = AnimPlayState.Playing;
//                 let speed = this.calculateSpeed();
//                 aniState.speed = standardSpeed * speed;
//                 let playtime = aniState.duration * (1 / (standardSpeed * speed));
//                 this.timerId = TimerManager.Instance().AddTimer(playtime, () => {
//                     this.clearTimer();
//                     this.Play();
//                 })
//             }
//             currentTime -= clip.duration;
//         }
//     }

//     public Play() {
//         HDebug.Assert(this.timerId < 0, "当前已正在播放animation");
//         let nextPlayAnim = this.playlist.shift();
//         let nextStandardSpeed = this.standardSpeedFactorList.shift();
//         if (nextPlayAnim) {
//             let animation = this.node.getComponent(cc.Animation);
//             HDebug.Assert(animation != null, "当前node没有绑Animation组件")
//             if (animation != null) {
//                 let clip = this.getAnimClipByName(nextPlayAnim);
//                 if (clip) {
//                     let aniState = animation.play(nextPlayAnim);
//                     let speed = this.calculateSpeed();
//                     aniState.speed = nextStandardSpeed * speed;
//                     let playtime = aniState.duration * (1 / (nextStandardSpeed * speed));
//                     this.state = AnimPlayState.Playing;
//                     this.timerId = TimerManager.Instance().AddTimer(playtime, () => {
//                         this.clearTimer();
//                         this.Play();
//                     })
//                 }
//             }
//         }
//     }
// }