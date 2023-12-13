declare let require;
import { Feature } from "./Feature";
import { GuardUtil } from "./GuardUtil";
import { List } from "./HydraComponents/HydraList";
import { IProxyData } from "./HydraProxy";
import { HydraProxy } from "./HydraProxyMgr";
// import { RedDotEvent } from "../../AppConstants";
// import RedDot from "../../component/RedDot";
import { LimitActivityPindex } from "./ActivityModule/ActivityHeadFile";
import { SmallGameActInfoFeature } from "./SmallGameAct/SmallGameActFeature";
import HDebug from "./HDebug";
import { SaveInfo, SmallGameProxy } from "./CommonProxy";
import { SmallGameGameStatus } from "./SmallGameAct/SmallGameActHeadFile";
import { ICrossSeverData, RedDotEvent } from "./AppConstants";
import { SmallGameParamEnum } from "./Feature/SimpleActHeadFile";
import { Cfg_SmallGameParam } from "./CfgConstants";
import { PanelType } from "./PanelConfig";
// import { CornLocalSaveInfo } from "../../scripts/app/models/GameCorn/GameCornRequest";
// import { SaveInfo, SmallGameProxy } from "./CommonProxy";
const { default: RedDot } = require("../app/component/RedDot");

export interface ICommonSmallGameFeature {
    OnUpLoadSucess();
    OnUpLoadFailed();
    OnGetPowerInfo(power: number, cd: number);
    OnChangeScore(cur: number);
    OnChangeScoreTotal(score: number);
    OnChangeHistoryScore(history: number);
}

export class CommonSmallGameFeature<T extends ICommonSmallGameFeature> extends SmallGameActInfoFeature<T> {
    protected GetProxyHeader(): string {
        HDebug.Error("必须重写这个方法！");
        return "";
    }

    protected dataType: new () => SmallGameData = null;

    public GetData(): SmallGameData {
        let data = HydraProxy.GetData(this.dataType);
        return data;
    }

    public GetLuckyGiftView(): PanelType {
        return null;
    }

    public GetLuckyGiftRwdPreview(): PanelType {
        return null;
    }

    protected BindData(type: new () => SmallGameData) {
        this.dataType = type;
        this.AddListener(type, this.OnChangePowerInfo.bind(this), "power");
        this.AddListener(type, this.OnChangeHistoryScore.bind(this), "historyScore");
        this.AddListener(type, this.OnChangeCurScore.bind(this), "currScore");
        this.AddListener(type, this.OnChangeScoreTotal.bind(this), "score");
    }
    public OnChangePowerInfo(data: SmallGameData) {
        this.InvokeAll("OnGetPowerInfo", data.GetPower(), data.GetPowerCD());
    }

    public OnChangeHistoryScore(data: SmallGameData) {
        this.InvokeAll("OnChangeHistoryScore", data.GetHistoryScore());
    }

    public OnChangeCurScore(data: SmallGameData) {
        this.InvokeAll("OnChangeScore", data.GetCurScore());
    }

    public OnChangeScoreTotal(data: SmallGameData) {
        this.InvokeAll("OnChangeScoreTotal", data.GetScoreTotal());
    }

    public ReqUseItem(opCode: number) {
        return HydraProxy.Send(SmallGameProxy, SaveInfo, this.m_activity.GetActID(), opCode).SucCallBack(() => {
            this.InvokeAll("OnUpLoadSucess");
        })
            .TimeOut(() => {
                this.InvokeAll("OnUpLoadFailed");
            })
            .ErrCallBack(() => {
                this.InvokeAll("OnUpLoadFailed");
            });
    }

    public ChangeMultiple(m: number): number {
        let data = HydraProxy.GetData(this.dataType);
        if (data.GetMuiltiple() == m) {
            data.SetMultiple(1);
            return 1;
        }
        else {
            data.SetMultiple(m);
            return m;
        }
    }

    public ReqGameOver() {
        HydraProxy.GetProxy(SmallGameProxy).Send(SaveInfo, this.m_activity.GetActID(), 3)
            .SucCallBack((netData) => {
                let failedInfo = GuardUtil.SafeReturn(netData, "a.ActiveHuoDong." + this.GetProxyHeader() + ".gameOver");
                let actData = HydraProxy.GetData(this.dataType);
                actData.CacheFailedData(failedInfo);
                this.InvokeAll("OnUpLoadSucess");
            })
            .TimeOut(() => {
                this.InvokeAll("OnUpLoadFailed");
            })
            .ErrCallBack(() => {
                this.InvokeAll("OnUpLoadFailed");
            });
    }
}

export interface ISmallGameErrHandle {
    OnBoardErr();
}

export class BaseGameData extends Feature<ISmallGameErrHandle> implements IProxyData {
    private historyScore: number = 0; //历史最高分
    protected score: number = 0;     //当前积分
    protected curScore: number = 0; //当局积分
    protected curRoleID: number = 0; //当前选择红颜
    private multiple: number = 0;  //倍率

    protected powerAmount: number = 0; //当前体力
    protected powerCD: number = 0;
    private gameStatus: number = 0;
    
    protected cfgParam: { [index: number]: any };
    protected crossServerList: ICrossSeverData[] = [];
    protected allGetItems: List<number> = new List<number>();

    GetDataType(): new () => BaseGameData {
        return BaseGameData;
    }

    Init() {
    }
    private saveInfoListener: number = 0;
    OnUserLogin() {
        this.saveInfoListener = HydraProxy.AddListener(this.GetDataType(), (data: BaseGameData) => {
            this.OnSaveInfoChanged(data.saveInfo);
        }, "saveInfo");
    }
    OnUserLogout() {
        HydraProxy.StopListener(this.GetDataType(), this.saveInfoListener);
        this.saveInfoListener = 0;
    }
    Clear() {
        this.failedInfo = null;
        this.finalRwd = null;
    }

    OnNetErr() {
        this.allGetItems.Clear();
    }

    ClearUpLoadInfo() {
        this.allGetItems.Clear();
    }

    protected getPindex(): LimitActivityPindex {
        return LimitActivityPindex.None;
    }

    private failedInfo: any = null;
    CacheFailedData(failedInfo) {
        this.failedInfo = failedInfo;
        this.failedInfo.actID = this.getPindex();
    }
    GetFailedData() {
        let f = this.failedInfo;
        this.failedInfo = null;
        return f;
    }

    private finalRwd: any = null;
    CacheFinalRwd(rwd) {
        this.finalRwd = rwd;
    }
    GetFinalRwd() {
        return this.finalRwd;
    }

    IsInGame() {
        return true;
    }
    GetGameStatus(): SmallGameGameStatus {
        switch (this.gameStatus) {
            case 0:
                return SmallGameGameStatus.None;
            case 1:
                return SmallGameGameStatus.Ing;
            case 2:
                return SmallGameGameStatus.End;
            default:
                return SmallGameGameStatus.None;
        }
    }
    public GetMainViewCurrencyShowList(): number[] {
        return [];
    }

    public GetClothePreviewPram() {
        HDebug.Error("没有重载小游戏的预览配置参数配置");
        return null;
    }
    GetCurRole(): number {
        return this.curRoleID;
    }
    GetPower(): number {
        return this.powerAmount;
    }
    GetPowerLimit(): number {
        return 300;
    }
    GetPowerCD(): number {
        return this.powerCD;
    }
    GetHistoryScore() {
        return this.historyScore > this.curScore ? this.historyScore : this.curScore;
    }
    GetScoreTotal() {
        return this.score;
    }
    GetCurScore() {
        return this.curScore;
    }
    GetCrossServerList(): ICrossSeverData[] {
        return this.crossServerList;
    }
    GetCfgParam(key: SmallGameParamEnum): Cfg_SmallGameParam {
        let param = GuardUtil.SafeReturn(this.cfgParam, key.toString());
        if (null != param) {
            return param;
        }
        else {
            HDebug.Error("没有发小游戏的配置下来!!!!:cfgParam key:" + key);
        }
        return null;
    }

    private localMultiple: number = 0;
    SetMultiple(m: number) {
        this.localMultiple = m;
    }
    GetChangeOffset(): number {
        return Math.ceil((this.localMultiple - 1) / 8) - Math.ceil((this.multiple - 1) / 8);
    }
    SyncData() {
        this.localMultiple = this.multiple;
    }
    GetMuiltiple() {
        return this.localMultiple;
    }
    OnGetItem(itemID: number) {
        this.allGetItems.Add(itemID);
    }
    protected seqID: number = null;
    getSeqId() {
        return this.seqID;
    }
    GetSaveInfo(): any {
        return null;
    }
    GetUpLoadInfo(): any {
        return null;
    }

    private saveInfo: string = null;
    OnSaveInfoChanged(saveInfo: string) { }

    Update(netData: any) {
        this.historyScore = netData.historyScore;
        this.score = netData.score;
        this.curScore = netData.currScore;
        this.multiple = netData.multiple;

        if (this.localMultiple == 0) {
            this.localMultiple = this.multiple;
        }

        this.saveInfo = netData.saveInfo;

        this.powerAmount = netData.power.count;
        this.powerCD = netData.power.cdTime;

        this.seqID = netData.seqID;

        this.curRoleID = netData.roleId;
        this.gameStatus = netData.gameStatus;
        this.crossServerList = netData.kua_list;
        this.cfgParam = netData.cfgParam;

        if (null != netData.red_power) {
            RedDot.change(RedDotEvent.GamePowerRed_ + this.getPindex(), netData.red_power == 1);
        }
        if (null != netData.red_rwd_count) {
            RedDot.change(RedDotEvent.GameCountRankRed_ + this.getPindex(), netData.red_rwd_count == 1);
        }
        if (null != netData.red_rwd_max) {
            RedDot.change(RedDotEvent.GameMaxRankRed_ + this.getPindex(), netData.red_rwd_max == 1);
        }
        if (null != netData.red_rwd_stageScore) {
            RedDot.change(RedDotEvent.GameLeiJiRwdRed_ + this.getPindex(), netData.red_rwd_stageScore == 1);
        }
        if (null != netData.red_bp) {
            RedDot.change(RedDotEvent.GameBPRed_ + this.getPindex(), netData.red_bp == 1);
        }
        if (null != netData.red_luckyGift){
            RedDot.change(RedDotEvent.GameLuckyGift_ + this.getPindex(), netData.red_luckyGift == 1);
        }
    }
}

/**
 * 需要选择伙伴知己的小游戏类型
 */
export class SmallGameData extends BaseGameData {
    IsInGame(pindex?: number) {
        switch (pindex) {
            case LimitActivityPindex.GameLinkMatchActivity: {
                return true;
            }
            default: {
                return this.curRoleID > 0;
            }
        }
    }
}

export class NeedStartSmallGameData extends BaseGameData {
    private isInGame: boolean = false;
    IsInGame(): boolean {
        return this.isInGame;
    }
    Update(netData: any) {
        super.Update(netData);
        this.isInGame = netData.gameStatus != 0
        //todo 紅點
        //RedDot.change(RedDotEvent.SmallGame_HasPower + this.getPindex() , this.GetPower() >= this.GetPowerLimit());
    }
}


