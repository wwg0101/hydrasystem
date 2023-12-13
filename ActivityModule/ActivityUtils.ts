import { IFeatureCB } from "../Feature";
import { ActivityType } from "../AppConstants";
import HDebug from "../HDebug";
import { Activity, ActFeature, IActivity, IActivityHelper, IIFeature, IMainFeature, LimitActivityPindex } from "./ActivityHeadFile";


export class ActivityUtils {
    public static getKeyByTypePindex(type: ActivityType, pindex: number, isCrossServer: boolean = false): any {
        if (ActivityType.LimitActivity == type) {
            return {
                key1: "XSHuoDong",
                key2: `XSHD_${pindex}`,
            };
        }
        else if (ActivityType.AtListActivity == type
            || ActivityType.ActiveActivities == type
        ) {
            if (isCrossServer) {
                return {
                    key1: "CBHuoDong",
                    key2: `CBHD_AREA_${pindex}`,
                };
            }
            else {
                return {
                    key1: "CBHuoDong",
                    key2: `CBHD_${pindex}`,
                };
            }
        }
        else if (ActivityType.ExchangeAcivity == type) {
            return {
                key1: "exchange",
                key2: "info",
            };
            //switch (pindex) {
            //    case LimitActivityPindex.ServantExchange: {
            //        return {
            //            key1: "exchange",
            //            key2: "info",
            //        };
            //    }
            //    case LimitActivityPindex.WifeExchange: {
            //        return {
            //            key1: "exchange",
            //            key2: "info",
            //        };
            //    }
            //    case LimitActivityPindex.FourAgainst: {
            //        return {
            //            key1: "exchange",
            //            key2: "info",
            //        }
            //    }
            //}
        }
        else if (ActivityType.RechargeActivity == type) {
            return {
                key1: "XSHuoDong",
                key2: `XSHD_${pindex}`,
            };
        }

        else if (ActivityType.FullActivities == type) {
            return {
                key1: "FullHuoDong",
                key2: `FullHD_${pindex}`,
            };
        }
    }

    //注册 【功能名，回调对象】
    //ActivityUtils.Register(FeatureType, this)
    public static Register<CB1 extends IFeatureCB, CB extends CB1 & IActivityHelper>(type: (new () => ActFeature<CB1>), self: CB) {
        let f = this.InvokeCheck(type, self);
        if (f != null) {
            f.Register(self);
        }
    }
    //反注册 【功能名，回调对象】
    //ActivityUtils.Deregister(FeatureType, this)
    public static Deregister<CB1 extends IFeatureCB, CB extends CB1 & IActivityHelper>(type: (new () => ActFeature<CB1>), self: CB) {
        let f = this.InvokeCheck(type, self);
        if (f != null) {
            f.Deregister(self);
        }
    }
    //調用特定方法 【功能名，對象，方法名，參數】
    public static Invoke<CB1 extends IFeatureCB, CB extends CB1 & IActivityHelper>(type: (new () => ActFeature<CB1>), self: CB, fName : string, params) {
        let f = this.InvokeCheck(type, self);
        if (f != null) {
            if(f[fName]) {
                f[fName](...params);
            }
            else {
                HDebug.Error("非法方法調用" + fName);
            }
        }
    }
    //獲取特定功能 【功能名，對象】
    public static GetFeature<CB1 extends IFeatureCB, CB extends CB1 & IActivityHelper>(type: (new () => ActFeature<CB1>), self: CB) : ActFeature<CB1> {
        return this.InvokeCheck(type, self);
    }
    private static InvokeCheck<CB1 extends IFeatureCB, CB extends CB1 & IActivityHelper>(type: (new () => ActFeature<CB1>), self: CB): ActFeature<CB1> {
        let ac = self.GetActivity();
        if (ac != null) {
            let f = ac.GetFeature(type);
            if (f != null) {
                return f;
            }
            else {
                HDebug.Error(ac + "不存在" + type + "功能");
            }
        }
        else {
            HDebug.Error(self + "还没有绑定活动");
        }
        return null;
    }

    //创建一个对应的活动 【功能名1，功能名2，功能名3】
    //ActivityUtils.Create(FeatureType1,FeatureType2, FeatureType3)
    public static Create<T extends IMainFeature>(mainFeature: new () => T, ...params): IActivity {
        let act: Activity = new Activity();
        act.OnCreate<T>(mainFeature);
        return this.InnerHandle(act, params[0], ...params);
    }
    public static InnerHandle<T extends IIFeature>(act: Activity, type: (new () => T), ...params): Activity {
        act.AddFeature(type);
        params.shift();
        if (params.length > 0) {
            this.InnerHandle(act, params[0], ...params);
        }
        return act;
    }
}