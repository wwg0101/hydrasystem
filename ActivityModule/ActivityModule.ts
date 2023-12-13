
import HDebug from "../HDebug";
import { Singleton } from "../HydraComponents/HydraSingleton";
import { ActivityState, HuoDong, IActivity, IActivityWatcherCB, IIFeature, LimitActivityPindex } from "./ActivityHeadFile";
import { ActivityWatcher } from "./ActivityWatcher";

//活动管理器，负责和网络层交互
export class ActivityMgr extends Singleton<ActivityMgr> {
    static Instance(): ActivityMgr {
        return ActivityMgr.GetInstance(ActivityMgr);
    }

    protected Init() {
        this.m_activityWatcher.Init();
    }
    protected UnInit() {
        this.m_activityWatcher.OnDestroy();
    }

    private m_allActivity: Map<LimitActivityPindex, IActivity> = new Map<LimitActivityPindex, IActivity>();
    private m_activityWatcher : ActivityWatcher = new ActivityWatcher();
    //添加一个活动 【活动ID, 活动对象】，对象创建方式见ActivityUtils
    public Add(type: LimitActivityPindex, activity: IActivity) {
        this.m_allActivity.set(type, activity);
        activity.Init(type);
    }
    //移除一个活动 【活动ID】
    public Remove(type : LimitActivityPindex) {
        let act = this.m_allActivity.get(type);
        if(act) {
            this.m_allActivity.delete(type);
            act.OnDestroy();
        }
    }
    //是否存在活动 【活动ID】
    public Has(type: LimitActivityPindex) {
        return this.m_allActivity.has(type);
    }
    //所有活动的列表【活动ID】，如果不存在，返回空
    public Get(t: LimitActivityPindex): IActivity {
        //外部需要判空，可能不存在活动
        //但是理论上，UI是滞后活动创建的，一般不会出现
        //需要考虑活动超时是否会删除对象
        let item = this.m_allActivity.get(t);
        if (item != null) {
            return item;
        }
        else {
            return null;
        }
    }

    //获取网络层活动时间数据
    public OnGetActivityData(activityID: LimitActivityPindex, netData: HuoDong) {
        this.m_activityWatcher.OnGetActivityData(activityID, netData);
    }
    //注册活动入口开关监听
    public Register(cb : IActivityWatcherCB) {
        this.m_activityWatcher.Register(cb);
    }
    //反注册活动入口开关监听
    public Deregister(cb : IActivityWatcherCB) {
        this.m_activityWatcher.Deregister(cb);
    }
    public GetAllActivity() : Map<LimitActivityPindex, IActivity> {
        return this.m_allActivity;
    }

    //调用特定活动某个方法 【功能名，活动ID，方法名，参数列表】
    //this.Invoke(ActItemFunction, 1008, "OnBuyItem", retCode, itemID);
    public InvokeSingle<T extends IIFeature>(type: (new () => T), actID: LimitActivityPindex, fName: string, ...params) {
        let act = this.Get(actID);
        if (act != null) {
            //act.GetFeature(type)[fName](...params);
            let ft = act.GetFeature(type);
            if(ft) {
                ft[fName](...params);
            }
            else {
                HDebug.Error("活动" + actID + "没有模块" + type);
            }
        }
        else {
            HDebug.Warning("活动" + actID + "不存在，调用" + type + " " + fName + "失败");
        }
    }

    //调用方式 【功能名，方法名，参数列表】 *注意自己匹配参数列表
    //this.Invoke(ActItemFunction, "OnBuyItem", retCode, itemID);
    public Invoke<T extends IIFeature>(type: (new () => T), fName: string, ...params): boolean {
        let callSucc = false;
        this.m_allActivity.forEach((value, key) => {
            let f = value.GetFeature(type);
            if (f != null) {
                f[fName](...params);
                callSucc = true;
            }
        })
        return callSucc;
    }
    //如果不放心，就这种写法
    /*OnItemBuyNetwork(retCode : number, itemID : number) {
        this.m_allActivity.forEach((value, key) => { 
            let f = value.GetFunction(ActItemFunction);
            if(f != null) {
                f.OnBuyItem(retCode,itemID);
            }
        }) 
    }*/
}

//@ts-ignore
window.getAllCanPlayActivity = function (): number[] {

    let data: Map<LimitActivityPindex, IActivity> = ActivityMgr.Instance().GetAllActivity();
    let list = [];
    data.forEach((value: IActivity, key) => {
        if (value.GetState() == ActivityState.Opening) {
            list.push(key);
        }
    });

    return list;
}
