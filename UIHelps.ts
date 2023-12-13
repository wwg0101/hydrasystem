import { ChessLinkMatch, LinkMatchDepth, LinkMatchFuncType, emoType } from "../../scripts/app/models/linkMatch/GameLinkMatchChessHeader";

import { BubbleChessType } from "../app/models/GameBubble/GameBubbleDragonProxy";
import { MonopolyLocationID } from "../app/models/GameMonopoly/GameMonopolyHeadFile";

declare let require;
const config = require("../app/Config");
const ResManager = require("../../scripts/app/utils/ResManager");
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIHelps {
    /**
     * load Ԥ���� ���猣��
     * @param url 
     * @param call 
     */

    public static getFileName(): string {
        return config.Config.filename;
    }
    public static getGameCornUIPath(name): string {
        return UIHelps.getFileName() + "/res/ui/activity/gameCorn/load/" + name;
    }
    public static getGameCornBlockPath(color, length): string {
        let lengthIndex = (3 - length) + 1;
        return UIHelps.getFileName() + "/res/ui/activity/gameCorn/load/" + `flczy_se${color}_${lengthIndex}`;
    }
    public static getGameCornBlockBGPath(level, length): string {
        let lengthIndex = (3 - length) + 4;
        return UIHelps.getFileName() + "/res/ui/activity/gameCorn/load/" + `flczy_pan${level}_pan${lengthIndex}`;
    }
    public static getGameCornPainting(round: number, stage: number): string {
        return UIHelps.getFileName() + "/res/ui/activity/gameCorn/load/" + `flczy_gao${(round + 1)}_${(stage)}_70p`;
    }

    //---------------------------������------------------------------//
    //��������
    public static getTaskChess(chessID: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/LinkMatchChess/" + chessID;
    }

    public static getLinkMatchComboBg(combLevel: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/icon_combo" + combLevel;
    }

    public static getLinkMatchComboName(combLevel: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/sp_combo" + combLevel;
    }

    public static getLinkMatchMenu(iconID: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/DishesIcon/" + iconID;
    }

    public static getLinkMatchChess(chessData: ChessLinkMatch) {
		if(chessData.Depth() == LinkMatchDepth.Mid){
			if(chessData.funcType == LinkMatchFuncType.Stone || chessData.funcType == LinkMatchFuncType.ChangeColor || chessData.funcType == LinkMatchFuncType.DropBlock){
				return this.getTaskChess(chessData.chessColor + chessData.funcType * 1000);
			}
			return this.getTaskChess(chessData.chessColor);
		}
		else if(chessData.Depth() == LinkMatchDepth.Linker){
			return UIHelps.getFileName() + "/res/anm/ConnectingLineEliminate/Line_002";
		}
		else if(chessData.Depth() == LinkMatchDepth.Marker){
			return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/icon_yyqg_qidi2";
		}
    }
    
    public static getLinkMatchChessSelect(chessData: ChessLinkMatch) {
		if(chessData.funcType == LinkMatchFuncType.ChangeColor){
			return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/LinkMatchChess/" + (chessData.chessColor + chessData.funcType * 1000) + "_1";
		}
		if(chessData.funcType != LinkMatchFuncType.DropBlock && chessData.funcType != LinkMatchFuncType.Stone ){
			return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/LinkMatchChess/" + (chessData.chessColor) + "_1";
		}
		return null;
    }
    
    public static getLinkMatchEmo(type: emoType){
        return UIHelps.getFileName() + "/res/ui/activity/gameLinkMatch/linkMatch/mysc_bq_" + type;
    }
    //---------------------------泡泡龙------------------------------//
    public static getBubbleChess(chessType: BubbleChessType, level : number) {
        if(chessType == BubbleChessType.ChessChest) {
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_qz_ts";
        } else {
            switch(level) {
                case 1: return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_qzpt_" + chessType;
                case 4: return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_qz4_" + chessType;
                case 16: return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_qz16_" + chessType;
            }
        }
    }
        

    public static getBubbleComboBg(combLevel: number) {
        return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/effect/icon_combo_di" + combLevel;
    }

    public static getBubbleComboName(combLevel: number) {
        return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/effect/icon_combo_name" + combLevel;
    }

    public static getBubbleDragonGiftImg(type: number){
        if(1 == type){
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/drawView/zdqc_cj_1";
        }
        else{
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/drawView/zdqc_cj_2";
        }
    }

    public static getBubbleDragonGiftBG1(type: number){
        if(1 == type){
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/drawView/zdqc_gui1_70p";
        }
        else{
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/drawView/zdqc_gui2_70p";
        }
    }

    public static getBubbleDragonGiftGuiMen(type: number){
        if(1 == type){
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/drawView/zdqc_guimen1_50p";
        }
        else{
            return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/drawView/zdqc_guimen2_50p";
        }
    }

    public static getBubbleDragonProgressItem(type: number) {
        switch(type) {
            case 1: {
                return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_xianquan3";;
            }
            case 2: {
                return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_xianquan4";
            }
        }
    }

    public static getBubbleDragonProgressBottom(type: number) {
        switch(type) {
            case 1: {
                return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_xianquan2";
            }
            case 2: {
                return UIHelps.getFileName() + "/res/ui/activity/bubbleDragon/zdqc_xianquan";
            }
        }
    }

    public static getItemNameHexColorStr(color: number):string{
        switch(Number(color)){
            case 1:{
                return "#18cb1c";
            }
            case 2:{
                return "#169ce1";
            }
            case 3:{
                return "#be2ee5";
            }
            case 4:{
                return "#df7819";
            }
            case 5:{
                return "#e5323b";
            }
            default:{
                return "#18cb1c";
            }
        }
    }

    //----------------------------黄金矿工------------------------------//
    public static getGoldMinerBookIcon(icon: number) {
        return UIHelps.getFileName() + "/res/ui/activity/goldMiner/minerBookIcon/" + icon; // todo 路径可能要改
    }
    
    //千金樱花（旅行手记）
    public static getSakuraCardBg(type: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameSakura/lxsj_ck_" + type;
    }

    public static getSakuraCardBgIcon(level: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameSakura/lxsj_ckb_" + level;
    }
    
    //星辉展馆
    public static getPreciousIcon(id: string): string {
        return UIHelps.getFileName() + "/res/ui/exhibition/xhzg_dczx_" + id;
    } 

    //小人形象贴图
    public static getMonopolyProfilePic(icon: string): string{
        return UIHelps.getFileName() + "/res/ui/activity/gameMonopoly/profile/" + icon;
    }

    //获取buff图标
    public static getMonopolyBuffIcon(type: number, level: number): string {
        return UIHelps.getFileName() + "/res/ui/activity/gameMonopoly/buffIcon/buff_" + type + "_" + level;
    }

    //巡梦环游小人动图
    public static getMonopolyProfileSpine(icon: string):string{
        return UIHelps.getFileName() + "/prefabs/ui/activity/gameMonopoly/role/" + icon;
    }

    //徽章小整图
    public static getMonopolyBadgeIcon(id: number){
        return UIHelps.getFileName() + "/res/ui/activity/gameMonopoly/badgeIcon/badge_" + id;
    }

    //徽章碎片
    public static getMonopolyBadgeFrags(id: number){
        return UIHelps.getFileName() + "/res/ui/activity/gameMonopoly/badgeFrags/badgeFrag_" + id;
    }

    // build
    public static getMonopolyBuild(id: number, imageLevel: number) {
        return UIHelps.getFileName() + "/res/ui/activity/gameMonopoly/buildLv/build_" + id + "_" + imageLevel;
    }

    //获取大富翁地图
    public static getMonopolyMap(isNight): string {
        return isNight
            ? UIHelps.getFileName() + "/res/tiledMap/monopolyNightMap/map"
            : UIHelps.getFileName() + "/res/tiledMap/monopolyDayMap/map";
    }

    //获取宝箱形象
    public static getTreasureBoxIcon(type: number): string {
        return UIHelps.getFileName() + "/res/ui/activity/gameMonopoly/boxIcon/box_" + type;
    }

    public static getTreasureBoxPrefab(type: number): string {
        let prefabStr = "";
        switch(type) {
            case MonopolyLocationID.WoodBox : prefabStr = "BoxOpen_White_LCY"; break;
            case MonopolyLocationID.SilverBox : prefabStr = "BoxOpen_Gold_LCY"; break;
            case MonopolyLocationID.GoldBox : prefabStr = "BoxOpen_Rainbow_LCY"; break;
        }
        return UIHelps.getFileName() + "/prefabs/ui/activity/gameMonopoly/box/" + prefabStr;
    }
    
    public static getMonopolyMapObjPrefab(isNight: boolean, name: string): string {
        return isNight
            ? UIHelps.getFileName() + "/prefabs/ui/activity/gameMonopoly/nightMapBuild/" + name
            : UIHelps.getFileName() + "/prefabs/ui/activity/gameMonopoly/dayMapBuild/" + name;
    }

    public static getLinkEffectPrefab(url: string){
        return UIHelps.getFileName() + "/LinkEffect/Prefab/" + url;
    }

    public static getReunionViewPrefab(prefabName: string){
        return UIHelps.getFileName() + "/prefabs/ui/activity/callback/" + prefabName;
    }

    public static getCallbackStoryTaskIcon(name: string){
        return UIHelps.getFileName() + "/res/ui/daily/load/" + name;
    }

}