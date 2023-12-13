declare let require;
import HDebug from "./HDebug";
import { List } from "./HydraComponents/HydraList";
import { TimerManager } from "./TimerManager";
import { TouchEnum } from "./TouchManager";
import { PanelConfig, PanelData, PanelType } from "./PanelConfig";
import { IPanelControl } from "./UIControlManager";
import { Singleton } from "./HydraComponents/HydraSingleton";
const ResManager = require("../app/utils/ResManager");
const Config = require("../app/Config");

export enum NetworkOp {
    Guide,
    Logout,
    CommonEnter,//
    LoadPanel,
    BuildGameUpLoad,
    CornGameUpLoad,
    GameCornMask,
    LinkMatchGameUpLoad,
    GameBubbleUpLoad,
    GameBubbleMask,
    LuckyGiftDraw,
    LuckyGiftViewChange,

    GoldMiner_DonateView,
    GoldMiner_Donate,

    GoldMiner_SaveInfo,

    MonopolySpecDicPan,
    MonopolyUseDic,
    MonopolyDealEvent,
    MonopolyMoveRole,
    MonopolyLasso,
    MonopolySouvenir,
    MonopolyAtkBlocker,

    CallBackGetRecallRwd,
    CallBackSetInviteCode,
    CallbackRecharge,
    CallbackGetTimebackGift,
}

export enum LockOp {
    Guide, //引导
    LoadScene, //场景
}


interface IMaskManager<T> {
    ContainsMask(opType: T);
    ExistMask(): boolean;
}

class MaskManagerBase<T, U extends ITimeOut> extends Singleton<MaskManagerBase<T, U>> implements IMaskManager<T> {
    private tickID: number = 0;
    protected Init() {
        super.Init();
        this.tickID = TimerManager.Instance().AddTick(this.Update.bind(this));
    }
    protected UnInit() {
        super.UnInit();
        TimerManager.Instance().RemoveTick(this.tickID);
        this.Clear();
        if (this._view != null) {
            this._view.Destroy();
            this._view = null;
        }
    }
    public OnGameRestart() {
        this._view = null;
    }
    public Clear() {
        this.RollBack();
        this.m_curMaskOp = new Map<T, U>();
    }
    protected Update() {
        let timeoutOp = [];
        this.m_curMaskOp.forEach(function (value: U, k: NetworkOp) {
            if (value.CheckTimeOut()) {
                timeoutOp.push({ Key: k, Value: value });
            }
        }.bind(this));
        for (var i = 0; i < timeoutOp.length; ++i) {
            this.m_curMaskOp.delete(timeoutOp[i].Key);
            timeoutOp[i].Value.OnTimeOut();
        }
        if (timeoutOp.length != 0 && !this.ExistMask()) {
            this.RollBack();
        }
    }

    public OnMaskClicked() {
        this.m_curMaskOp.forEach((value : U) => {
            if(value instanceof TimeOutWithClick) {
                let v = value as TimeOutWithClick;
                v.clickCB();
            }
        });
    }

    protected maskPanelType: PanelType = PanelType.WaitingMaskView;
    protected GetMaskParam(): TouchEnum { return null; }
    protected PullPanel() {
        if (this._view != null) {
            this._view.BeforePanelShow(false, this.GetMaskParam())
            this._view.OnPanelShow();
        }
        else {
            if (!this.hasCreated) {
                this.hasCreated = true;

                this.CreatePan(this.maskPanelType, (panel: IPanelControl) => {
                    this._view = panel;
                    this._view.SetPanelType(this.maskPanelType);
                    this._view.Init();
                    this._view.BeforePanelShow(false, this.GetMaskParam())
                    this._view.OnPanelShow();
                    if (!this.ExistMask()) this._view.SetVisible(false);
                });
            }
        }
    }

    private CreatePan(panelType: PanelType, createCB: Function) {
        let path = Config.Config.filename + "/prefabs/ui/" + PanelConfig[panelType].url;
        ResManager.getInstance().loadResource(path, cc.Prefab, function (err, prefab) {
            if (null == err) {
                let node = cc.instantiate(prefab);
                node.active = false;

                let canvas = cc.director.getScene().getChildByName("Canvas");
                let topLayer = canvas.getChildByName("topLayer");
                if (topLayer) {
                    topLayer.addChild(node);
                }
                else {
                    canvas.addChild(node);
                }
                createCB && createCB(node.getComponent("BasePanel"));
            }
            else {
                cc.warn(path + " path Prefab load error!!!");
            }
        });
        // PanelFactory.Create(panelType, createCB);
    }

    public ContainsMask(opType: T): boolean {
        return this.m_curMaskOp.get(opType) != null;
    }
    public ExistMask(): boolean {
        return this.m_curMaskOp.size != 0;
    }
    protected RollBack() {
        if (this._view != null) {
            this._view.OnPanelHide();
        }
    }

    private hasCreated = false;
    private _view: IPanelControl = null;

    protected m_curMaskOp: Map<T, U> = new Map<T, U>();
}

export default class MaskManager extends MaskManagerBase<NetworkOp, TimeOut> {
    public static getInstance(): MaskManager {
        return this.GetInstance(MaskManager);
    }
    protected GetMaskParam() { return TouchEnum.WaitingMask; }
    //添加一个遮罩，不可重复添加，和Hide成对调用
    public ShowMask(opType: NetworkOp, lockTime: number = 10/*最大锁定时长*/, timeOutCB: Function = null /*超时回调*/, clickCB : Function = null) {
        let canJump = false;
        if (this.m_curMaskOp.size == 0) {
            canJump = true;
        }
        HDebug.Assert(this.m_curMaskOp.get(opType) == null, "network mask duplicated!, opType: " + opType);
        if(!clickCB) {
            this.m_curMaskOp.set(opType, new TimeOut(lockTime, timeOutCB));
        }
        else {
            this.m_curMaskOp.set(opType, new TimeOutWithClick(lockTime, timeOutCB, clickCB));
        }
        if (canJump) this.PullPanel();
    }
    public HideMask(opType: NetworkOp) {
        HDebug.Assert(this.m_curMaskOp.get(opType) != null, "network mask hide invalid!, opType: " + opType);
        this.m_curMaskOp.delete(opType);
        if (this.m_curMaskOp.size == 0) {
            this.RollBack();
        }
    }

    //怕对原来功能造成影响 把之前接的都换成这个 不拉起实际的mask
    public _ShowOldMask(opType: NetworkOp, lockTime: number = 10/*最大锁定时长*/, timeOutCB: Function = null /*超时回调*/) {
        let canJump = false;
        if (this.m_curMaskOp.size == 0) {
            canJump = true;
        }
        HDebug.Assert(this.m_curMaskOp.get(opType) == null, "network mask duplicated!, opType: " + opType);
        this.m_curMaskOp.set(opType, new TimeOut(lockTime, timeOutCB));
        //if (canJump) this.PullPanel();
    }
    public _HideOldMask(opType: NetworkOp) {
        HDebug.Assert(this.m_curMaskOp.get(opType) != null, "network mask hide invalid!, opType: " + opType);
        this.m_curMaskOp.delete(opType);
        if (this.m_curMaskOp.size == 0) {
            //this.RollBack();
        }
    }
}

export class LockManagerBase<T> extends MaskManagerBase<T, MultiTimeOut> {
    protected GetMaskParam() { return TouchEnum.Lock; }
    private timerIDMap: Map<T, List<number>> = new Map<T, List<number>>();
    public LockByTime(opType: T, time: number, cbFunction: Function) {
        this.Lock(opType);
        //TODO
        let timerID = TimerManager.Instance().AddTimer(time, () => {
            this.timerIDMap.get(opType).Remove(timerID);
            this.Unlock(opType);
            if (cbFunction) cbFunction();
        });

        if (!this.timerIDMap.has(opType)) {
            this.timerIDMap.set(opType, new List<number>());
        }
        this.timerIDMap.get(opType).Add(timerID);
    }

    public Lock(opType: T) {
        let canJump = false;
        if (this.m_curMaskOp.size == 0) {
            canJump = true;
        }
        if (this.m_curMaskOp.has(opType)) {
            this.m_curMaskOp.get(opType).Add();
        }
        else {
            this.m_curMaskOp.set(opType, new MultiTimeOut());
        }
        if (canJump) this.PullPanel();
    }

    public Unlock(opType: T) {
        // HDebug.Assert(this.m_curMaskOp.get(opType) != null, "lock hide invalid!, opType: " + opType);
        if (this.m_curMaskOp.get(opType) != null) {
            this.m_curMaskOp.get(opType).Remove();
        }
    }
    public Clear() {
        super.Clear();
        //因为timer关联了回调，切完场景可能会爆炸，所以这里单独清理一下timer，不调回调，但是解锁
        this.timerIDMap.forEach((list: List<number>, key: T) => {
            for (let i = 0; i < list.length; ++i) {
                TimerManager.Instance().RemoveTimer(list[i]);
                this.Unlock(key);
            }
            list.Clear();
        });
    }
}

export class LockManager extends LockManagerBase<LockOp> {
    public static Instance(): LockManager {
        return this.GetInstance(LockManager);
    }
}

interface ITimeOut {
    CheckTimeOut(): boolean;
    OnTimeOut();
}

class TimeOut implements ITimeOut {
    timeOutCB: Function;
    timeOutTime: number;
    public constructor(t: number, cb: Function) {
        this.timeOutTime = t + new Date().getTime() / 1000;
        this.timeOutCB = cb;
    }
    public CheckTimeOut(): boolean {
        if ((new Date().getTime() / 1000) > this.timeOutTime) {
            return true;
        }
        return false;
    }
    public OnTimeOut() {
        if (this.timeOutCB != null) {
            this.timeOutCB();
        }
    }
}

class TimeOutWithClick extends TimeOut {
    clickCB : Function;
    public constructor(t: number, cb: Function, clickCB : Function) {
        super(t, cb);
        this.clickCB = clickCB;
    }
}

//可叠加的Timeout
class MultiTimeOut implements ITimeOut {
    timeOutCount: number = 0;
    public constructor() {
        this.Add();
    }
    public Add() {
        this.timeOutCount++;
    }
    public Remove() {
        this.timeOutCount--;
    }
    public CheckTimeOut(): boolean {
        HDebug.Assert(this.timeOutCount >= 0, "锁定异常");
        return this.timeOutCount == 0;
    }
    public OnTimeOut() { }
}
