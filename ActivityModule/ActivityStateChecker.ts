import { ActivityType } from "../AppConstants";
import { ActCheckerData, ActivityState, HuoDong, LimitActivityPindex } from "./ActivityHeadFile";
declare let require;
const utils = require("../../app/utils/Utils");

interface IActivityChecker {
    CheckOpen(netData: ActCheckerData): ActivityState;
}

class BasicActivityChecker implements IActivityChecker {
    protected activityID: LimitActivityPindex;
    constructor(actID: LimitActivityPindex) {
        this.activityID = actID;
    }

    CheckOpen(netData: ActCheckerData): ActivityState {
        return ActivityState.Opening;
    }
}

class NormalActivityChecker implements IActivityChecker {
    protected activityID: LimitActivityPindex;
    
    constructor(actID: LimitActivityPindex) {
        this.activityID = actID;
    }

    CheckOpen(netData: ActCheckerData): ActivityState {
        let nowTime = utils.timeUtil.second;
        if (netData.sTime <= nowTime && nowTime < netData.eTime) {
            return ActivityState.Opening;
        };
        if (netData.eTime <= nowTime && nowTime < netData.showTime) {
            return ActivityState.Showing;
        };
        return ActivityState.Closed;
    }
}

export class ActivityStateChecker {
    static getState(netData: ActCheckerData): ActivityState {
        let activityID: LimitActivityPindex = netData.pindex;
        let activityState = ActivityState.Invalid;
        if (netData.type == ActivityType.FullActivities) {
            activityState = this.Check(NormalActivityChecker, activityID, netData);
        } else {
            switch (activityID) {
                //case LimitActivityPindex.ShipsActivity: {
                //    activityState = this.Check(BasicActivityChecker, activityID, netData);
                //}
                //    break;     
                default: {
                    activityState = this.Check(NormalActivityChecker, activityID, netData);
                }
            }
        }
        return activityState;
    }

    private static Check<T extends IActivityChecker>(type: new (actID) => T, activityID: LimitActivityPindex, netData: ActCheckerData): ActivityState {
        let checker = new type(activityID);
        return checker.CheckOpen(netData);
    }
}