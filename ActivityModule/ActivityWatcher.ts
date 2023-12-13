import { List } from "../HydraComponents/HydraList";
import { ConfigFinder } from "../HydraConfigFinder";
import { TimerManager } from "../TimerManager";
import { Cfg_hdConf } from "../CfgConstants";
import HDebug from "../HDebug";
import { TimeOutFeature } from "../Feature/LimitHdActTimeCheckerFeature";
import { ActivityConfig, ActivityInProgress } from "../ActivityConfig";
import { IconOpenFeature } from "./ActivityFeature";
import { ActCheckerData, ActFeature, ActivityShowType, ActivityState, HuoDong, IActivity, IActivityWatcherCB, LimitActivityPindex } from "./ActivityHeadFile";
import { ActivityMgr } from "./ActivityModule";
import { ActivityStateChecker } from "./ActivityStateChecker";
import { ActivityUtils } from "./ActivityUtils";
import { ActTimeFeature } from "../Feature/TimeFeature";

declare let localdb;

class ActivityCreator {
    public static CreateByType(activityID: LimitActivityPindex): IActivity {
        if (true == ActivityInProgress[activityID]) {
            return null;
        }

        let cfg: Cfg_hdConf = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, activityID);
        HDebug.Assert(null != cfg, "activitytable.json里没有 activityID:" + activityID + "的配置，请检查表配置");
        if (cfg) {
            let ftCfg = ActivityConfig.ActivityFeatureConfig[cfg.showType];
            if (ftCfg) {
                let seftCfg: any[] = ftCfg.featureTypes;
                let commonCfg: any[] = ActivityConfig.ActivityFeatureConfig[ActivityShowType.All].featureTypes;
                let allFt = seftCfg.concat(commonCfg);
                return ActivityUtils.Create(ftCfg.mainFeature, ...allFt);
            }
            else {
                switch (cfg.showType) {
                    case ActivityShowType.None:
                    default: {
                        HDebug.Error("未处理的活动类型！ pindex[" + activityID + "] showType[" + cfg.showType + "]");
                    }
                        break;
                }
            }
        }

        return null;
    }
}

export class ActivityWatcher extends ActFeature<IActivityWatcherCB> {
    private activityCheckTimer: number = -1;
    public Init() {
        ActivityConfig.InitConfig();
        this.activityCheckTimer = TimerManager.Instance().AddForever(1, () => {
            this.CheckAllActivity();
        });
    }
    public OnDestroy() {
        TimerManager.Instance().RemoveTimer(this.activityCheckTimer);
        this.activityCheckTimer = 0;
    }
    public ActStateChange(act: IActivity, state: ActivityState) {
        if (state != act.GetState()) {
            this.InvokeAll("OnActStateChange", act, state);
            act.SetState(state);
        }
    }

    private CheckAllActivity() {
        let allAct = ActivityMgr.Instance().GetAllActivity();
        let actToRemove: List<number> = new List<number>();
        allAct.forEach((act: IActivity) => {
            let timeFt = act.GetFeature(ActTimeFeature);
            let checkerData = timeFt.getActCheckerData();
            let tarState = ActivityStateChecker.getState(checkerData);

            let openFt = act.GetFeature(IconOpenFeature);
            if (openFt) {
                if (ActivityState.Closed == tarState) {
                    this.ActStateChange(act, tarState);
                    actToRemove.Add(act.GetActID());
                } else {
                    if (!openFt.HasOpened() && !openFt.CheckCanOpen()) {
                        tarState = ActivityState.Closed;
                    }
                    this.ActStateChange(act, tarState);
                }
            } else {
                this.ActStateChange(act, tarState);
                if (ActivityState.Closed == tarState) actToRemove.Add(act.GetActID());
            }
        });

        actToRemove.forEach((actID: number) => {
            ActivityMgr.Instance().Remove(actID);
        });
    }

    private getAcCheckerData(netData: HuoDong) {
        return new ActCheckerData(
            netData.pindex,
            netData.type,
            netData.sTime,
            netData.eTime,
            netData.showTime,
        )
    }

    public OnGetActivityData(activityID: LimitActivityPindex, netData: HuoDong) {
        if (true == ActivityInProgress[activityID]) {
            return;
        }
        let curAct = ActivityMgr.Instance().Get(activityID);
        if (curAct) {
            curAct.GetMainFeature().onGetNetBaseData(netData);
        }
        let activityState = ActivityStateChecker.getState(this.getAcCheckerData(netData));
        switch (activityState) {
            case ActivityState.Showing:
            case ActivityState.Opening: {
                if (!ActivityMgr.Instance().Has(activityID)) {
                    // let newAct = ActivityCreator.Create(activityID, netData.type);
                    let newAct = ActivityCreator.CreateByType(activityID);
                    if (newAct) {
                        ActivityMgr.Instance().Add(activityID, newAct);
                        newAct.GetMainFeature().onGetNetBaseData(netData);
                        let nowState = ActivityState.Closed;
                        let ft = newAct.GetFeature(IconOpenFeature);
                        if (ft) {
                            if (ft.CheckCanOpen()) {
                                nowState = activityState;
                            } else {
                                nowState = ActivityState.Closed;
                            }
                        }
                        else {
                            nowState = activityState;
                        }
                        let timeFt = newAct.GetFeature(TimeOutFeature);
                        if (timeFt) {
                            timeFt.SetState(nowState);
                        }
                        this.ActStateChange(newAct, nowState);
                    }
                }
            }
                break;
            case ActivityState.Closed: {
                let oldAct = ActivityMgr.Instance().Get(activityID);
                if (oldAct) {
                    this.ActStateChange(oldAct, ActivityState.Closed);
                    ActivityMgr.Instance().Remove(activityID);
                }
            }
                break;
            default: {
                HDebug.Warning("错误的活动状态！ " + LimitActivityPindex[activityID]);
            }
        }
    }

    public Register(t: IActivityWatcherCB) {
        super.Register(t);
        let allAct = ActivityMgr.Instance().GetAllActivity();
        allAct.forEach((actObj: IActivity) => {
            let state = actObj.GetState();
            if (ActivityState.Invalid != state) {
                this.InvokeAll("OnActStateChange", actObj, state);
            }
        });
    }
}