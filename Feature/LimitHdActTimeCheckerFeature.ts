import { List } from "../HydraComponents/HydraList";
import { PanelConfig, PanelType } from "../PanelConfig";
//import { UIControlManager } from "../../../framework/UIControlManager";
//import AppUtils from "../../utils/AppUtils";
import HDebug from "../HDebug";
import { ActFeature, ActivityState, IActivity, IActivityWatcherCB, IHdActTimeCheckerFeature, LimitActivityPindex } from "../ActivityModule/ActivityHeadFile";
import { ActivityMgr } from "../ActivityModule/ActivityModule";
import { UIControlManagerTemp } from "../UIControlManager";
import { AlertUtils } from "../AlertUtils";

declare let require;
//用於檢查活動時間情況，根據不同界面加入展示不同效果

interface IPanelTimeChecker {
    isEmpty(): boolean;
    addPanel(panelType: PanelType);
    removePanel(panelType: PanelType);
    needShowConfirm(state: ActivityState): boolean;
    getGoPanel(state: ActivityState): PanelType;
}

class PanelTimeCheckerBase implements IPanelTimeChecker {
    protected readonly _playPanCfgs: PanelType[] = [];
    protected nowPanList: List<PanelType> = new List<PanelType>();
    protected _pindex: LimitActivityPindex = null;
    private readonly _mainPanel: PanelType = PanelType.None;

    constructor(pindex: LimitActivityPindex, mainPan: PanelType, playPanList: PanelType[]) {
        this._pindex = pindex;
        this._mainPanel = mainPan;
        this._playPanCfgs = playPanList;
    }

    public addPanel(panelType: PanelType) {
        HDebug.Assert(!this.nowPanList.includes(panelType), "[HdActTimeCheckFeature]有重複的paneltype，plz check");
        this.nowPanList.Add(panelType);
    }

    public removePanel(panelType: PanelType) {
        this.nowPanList.Remove(panelType);
    }

    public isEmpty(): boolean {
        return this.nowPanList.length == 0;
    }

    public needShowConfirm(state: ActivityState): boolean {
        switch (state) {
            case ActivityState.Opening: return false;
            case ActivityState.Showing:
                return this.checkHasPlayPan(this.nowPanList);
            case ActivityState.Closed:
                return this.nowPanList.length > 0;
            default:
                HDebug.Error("error state ,plz check");
                return false;
        }
    }

    public getGoPanel(state: ActivityState): PanelType {
        let type = PanelType.None;
        switch (state) {
            case ActivityState.Opening:
                type = this._mainPanel;
                break;
            case ActivityState.Showing:
                if (this.checkHasPlayPan(this.nowPanList)) {
                    type = this._mainPanel;
                } else {
                    type = PanelType.MainView_Scene;
                }
                break;
            case ActivityState.Closed:
                type = PanelType.MainView_Scene;
                break;
            default:
                type = PanelType.MainView_Scene;
                HDebug.Error("error state ,plz check");
        }
        return type;
    }

    protected checkHasPlayPan(panelList: PanelType[]) {
        for (let i = 0; i < panelList.length; i++) {
            let panType = panelList[i];
            if (-1 != this._playPanCfgs.indexOf(panType)) {
                return true;
            }
        }
        return false;
    }
}

class NormalPanelTimeChecker extends PanelTimeCheckerBase {
    constructor(pindex: LimitActivityPindex) {
        let playPanList = [
            //PanelType.LimitActivityView_Item,
            //PanelType.LimitActivityView_Join,
        ];
        super(pindex, PanelType.None, playPanList);
    }

}

class GameCornTimeChecker extends PanelTimeCheckerBase {
    constructor() {
        let playPanList = [
            PanelType.GameCornActView_Join,
        ];
        super(LimitActivityPindex.GameCornActivity, PanelType.GameBubbleActView_Main, playPanList);
    }
}

class GameBubbleTimeChecker extends PanelTimeCheckerBase {
    constructor() {
        let playPanList = [
            PanelType.GameBubbleActView_Join
        ];
        super(LimitActivityPindex.GameBubbleDragon, PanelType.GameBubbleActView_Main, playPanList);
    }
}

class GameMonopolyTimeChecker extends PanelTimeCheckerBase {
    constructor() {
        let playPanList = [
            PanelType.GameMonopolyActView_Join, PanelType.GameMonopolyActView_Badge, PanelType.GameMonopolyActView_Profile
        ];
        super(LimitActivityPindex.GameMonopoly, PanelType.GameMonopolyActView_Main, playPanList);
    }
}


export class TimeOutFeature extends ActFeature<IHdActTimeCheckerFeature> implements IActivityWatcherCB {
    private _checker: IPanelTimeChecker = null;
    private _nowState: ActivityState = null;

    Init() {
        super.Init();
        this._checker = HdActTimeFactory.createPack(this.m_activity.GetActID());
        ActivityMgr.Instance().Register(this);
    }

    OnDestroy() {
        super.OnDestroy();
        ActivityMgr.Instance().Deregister(this);
    }

    SetState(state: ActivityState) {
        this._nowState = state;
    }

    //狀態發生改變，檢測並彈出提示框
    public OnActStateChange(activity: IActivity, state: ActivityState) {
        if (activity == this.m_activity && this._nowState != state) {
            HDebug.Log("[OnActStateChange]" + activity.GetActID() + "狀態改變" + state);
            this._nowState = state;
            this.checkTimeAndShowConfirm();
        }
    }
    public addPan(panelType: PanelType) {
        this._checker.addPanel(panelType);
    }

    public removePan(panelType: PanelType) {
        let pack = this._checker;
        HDebug.Assert(null != pack, "pack is null, pindex is " + this.m_activity.GetActID());
        pack.removePanel(panelType);
    }

    public checkTimeAndShowConfirm() {
        if (this._checker.needShowConfirm(this._nowState)) {
            this.processGoTo();
            this.showTimeOutTips();
        }
    }

    private showTimeOutTips() {
        AlertUtils.Instance().alert18n("ACTHD_OVERDUE");
    }

    private processGoTo() {
        let goPanel: PanelType = null;
        let goParam = {
            pindex: this.m_activity.GetActID()
        };
        if (PanelType.MainView_Scene != goPanel) {
            let go = this._checker.getGoPanel(this._nowState);
            if (PanelType.None != go) {
                goPanel = go;
            }
        }
        HDebug.Assert(goPanel != null, "處理到展示時間的活動，直接返回主界面 " + LimitActivityPindex[this.m_activity.GetActID()]);
        UIControlManagerTemp.Instance().CloseTo(goPanel);
        //UIControlManagerTemp.CloseTo(goPanel, goParam);
        // UIControlManager.Instance().GoToPanel(goPanel, goParam);
    }
}

class HdActTimeFactory {
    public static createPack(pindex: LimitActivityPindex) {
        if (LimitActivityPindex.GameCornActivity == pindex) {
            return new GameCornTimeChecker();
        }
        if (LimitActivityPindex.GameBubbleDragon == pindex) {
            return new GameBubbleTimeChecker();
        }
        if (LimitActivityPindex.GameMonopoly == pindex) {
            return new GameMonopolyTimeChecker();
        }
        else {
            //無特殊的活動則直接當做普通的FullActivities來處理
            return new NormalPanelTimeChecker(pindex);
        }
    }
}