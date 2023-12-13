
import HDebug from "../HDebug";
import { List } from "../HydraComponents/HydraList";
import { Singleton } from "../HydraComponents/HydraSingleton";
import { TimerManager } from "../TimerManager";
import { ChargeActivityNotice } from "./SpecialActivityNotice";


export interface INoticeListener {
    OnNoticeChanged(notice : IActivityNotice);
}

//開服大酬賓 - 開服活動 - 限時沖榜 - 當期玩法活動 - 垃圾玩法活動
export interface IActivityNotice {
    //获取优先级
    GetPriority() : NoticePriority;
    GetDescUrl() : string;
    GetTitle() : string;
    GoTo();
}

//公告优先级
export enum NoticePriority {
    FixActWithTimeLimit,//固定开启的限时活动（兽神山，懒人谷）
    WithRedDot,         //具有红点的活动
    OpenGameBargain,    //开服大酬宾
    OpenGameAct,        //开服活动
    GamePlayAct,        //玩法活动
    RankActOver,        //快结束的限时冲榜
    RankAct,            //冲榜活动
    ChargeAct,          //充值相关（月卡，年卡，基金*2）
}

export interface INoticeCheckerHelper {
    NeedNotice() : boolean;
    GetNotice() : IActivityNotice;
}
export class NoticeChecker {
    private checkerHelper : INoticeCheckerHelper;
    private checkerTimer : number = 0;
    private hasNotice : boolean = false;
    public constructor(ch : INoticeCheckerHelper) {
        this.checkerHelper = ch;
    }
    public Start() {
        HDebug.Assert(this.checkerTimer == 0, "重复检查！");
        this.checkerTimer = TimerManager.Instance().AddForever(3, () => {
            this.CheckNoticeState();
        });
    }
    public Stop() {
        HDebug.Assert(this.checkerTimer != 0, "异常停止检查！");
        TimerManager.Instance().RemoveTimer(this.checkerTimer);
        if(this.hasNotice) {
            ActivityNoticeMgr.GetInstance(ActivityNoticeMgr).Remove(this.checkerHelper.GetNotice());
            this.hasNotice = false;
        }
    }
    private CheckNoticeState() {
        if(!this.hasNotice) {
            if(this.checkerHelper.NeedNotice()) {
                ActivityNoticeMgr.GetInstance(ActivityNoticeMgr).Add(this.checkerHelper.GetNotice());
                this.hasNotice = true;
            }
        }
        else {
            if(!this.checkerHelper.NeedNotice()) {
                ActivityNoticeMgr.GetInstance(ActivityNoticeMgr).Remove(this.checkerHelper.GetNotice());
                this.hasNotice = false;
            }
        }
    }
}

class EmptyNotice implements IActivityNotice {
    GetPriority() : NoticePriority { return NoticePriority.GamePlayAct; }
    GetDescUrl() : string {  
        HDebug.Warning("有未处理的noticeDescUrl");
        return "";
    }
    GetTitle() : string { return "招商中"; }
    GoTo() {}
}

export class ActivityNoticeMgr extends Singleton<ActivityNoticeMgr> {
    //先做成固定展示周期的
    private static readonly s_displayTime : number = 3; 

    private allListener : List<INoticeListener> = new List<INoticeListener>();
    private emptyNotice : EmptyNotice = new EmptyNotice();
    public Register(l : INoticeListener) {
        HDebug.Assert(!this.allListener.Contains(l), "重复注册！");
        this.allListener.Add(l);
        //刚注册时，推送一下当前的公告内容
        l.OnNoticeChanged(this.GetCurNotice());
    }
    public Deregister(l : INoticeListener) {
        HDebug.Assert(this.allListener.Contains(l), "异常反注册！");
        this.allListener.Remove(l);
    }
    private noticeChangeTimer : number = 0;
    public Begin() {
        this.Sort();    //每次開始時，刷新一下排序
        HDebug.Assert(this.noticeChangeTimer == 0, "重复 begin！！！！");
        this.noticeChangeTimer = TimerManager.Instance().AddForever(ActivityNoticeMgr.s_displayTime, () => {
            this.curFlag++;
            this.curFlag = this.allNotice.length > 0 ? this.curFlag % this.allNotice.length : 0;
            this.NotifyChange();
        });
    }
    public Stop() {
        if(this.noticeChangeTimer > 0) {
            TimerManager.Instance().RemoveTimer(this.noticeChangeTimer);
            this.noticeChangeTimer = 0;
        }
    }
    public Refresh() {
        this.Sort();
        this.curFlag = 0;
        this.NotifyChange();
    }
    private curFlag : number = 0;
    private allNotice : List<IActivityNotice> = new List<IActivityNotice>();

    private chargeNoticeChecker : NoticeChecker;
    private chargeNotice : ChargeActivityNotice = new ChargeActivityNotice();
    protected Init() {
        this.chargeNoticeChecker = new NoticeChecker(this.chargeNotice);
        this.chargeNoticeChecker.Start();
    }
    protected UnInit() {
        this.chargeNoticeChecker.Stop();
        this.chargeNoticeChecker = null;
    }

    public Add(provider : IActivityNotice) {
        this.allNotice.Add(provider);
        this.Sort();
    }
    public Remove(provider : IActivityNotice) {
        let index = this.allNotice.indexOf(provider);
        if(this.curFlag > index) {
            this.curFlag--;
        }
        this.allNotice.Remove(provider);
        this.curFlag = this.allNotice.length > 0 ? this.curFlag % this.allNotice.length : 0;
        this.NotifyChange();
    }
    private Sort() {
        this.allNotice.sort((a : IActivityNotice, b : IActivityNotice) => {
            return a.GetPriority() >= b.GetPriority() ? 1 : -1;
        });
    }
    //获取当前的公告
    private GetCurNotice() : IActivityNotice {
        if(this.allNotice.length > 0) {
            return this.allNotice[this.curFlag];
        }
        else {
            return this.emptyNotice;
        }
    }
    private NotifyChange() {
        for(let i = this.allListener.length - 1; i >= 0; --i) {
            this.allListener[i].OnNoticeChanged(this.GetCurNotice());
        }
    }
}
