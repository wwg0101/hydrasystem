
import { ActCheckerData, ActFeature } from "../ActivityModule/ActivityHeadFile";
import { ActivityOpenTime, ActivityType } from "../AppConstants";
import { IFeatureCB } from "../Feature";
import ProxyManager from "../ProxyManager";

declare let require;
const utils = require("../../app/utils/Utils");
//---------------------------示例分割线，上面是框架----------------------------

//计时
export interface IActTime extends IFeatureCB { }
export class ActTimeFeature extends ActFeature<IActTime> {
    //兑换道具
    m_registers: IActTime[] = [];
    _startTime: number = 0;

    activityType: ActivityType = ActivityType.FullActivities;
    public GetStartTime() {
        return this._startTime;
    }
    _type: ActivityType;
    _endTime: number = 0;
    _showTime: number = 0;
    _onShowConfirm = false;
    SetTime() {
        let act = ProxyManager.getInstance().limitActivityProxy.getHuodongByPindex(this.m_activity.GetActID());
        this._startTime = act.sTime;
        this._endTime = act.eTime;
        this._showTime = act.showTime;
        this._onShowConfirm = false;
    }

    SetTimeByData(type: ActivityType, startTime: number, endTime: number, showTime: number) {
        this._type = type;
        this._startTime = startTime;
        this._endTime = endTime;
        this._showTime = showTime;
        this._onShowConfirm = false;
    }
    Register(ui: IActTime) {
        if (this.m_registers.indexOf(ui) == -1) {
            this.m_registers.push(ui);
        }
    }

    Deregister(ui: IActTime) {
        let index = this.m_registers.indexOf(ui);
        if (index != -1) {
            this.m_registers.splice(index, 1);
        }
    }

    //是否需要展示，展示时间永远大于游玩时间
    CheckOnShow() {
        if (this._showTime == 0) {
            return false;
        }
        else {
            let curTime = utils.timeUtil.second;
            return this._startTime <= curTime
                && this._showTime > curTime;
        }
    }

    //判断活动是不是正在游玩中
    CheckOnPlay(): boolean {
        if (this._endTime == 0) {
            return false;
        }
        else {
            let curTime = utils.timeUtil.second;
            return this._startTime <= curTime &&
                curTime < this._endTime;
        }
    }

    public getEndTime(): number {
        return this._endTime;
    }

    public getOpenTime(): ActivityOpenTime {
        return new ActivityOpenTime(this._startTime, this._endTime, this._showTime);
    }

    public getActCheckerData(): ActCheckerData {
        return new ActCheckerData(this.m_activity.GetActID(), this._type, this._startTime, this._endTime, this._showTime);
    }
}
