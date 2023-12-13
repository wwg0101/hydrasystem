import { IFeatureCB } from "./../Feature";
// // import { PanelOpenHelper } from "../../../framework/UIFramework/PanelOpenHelper";
import { MTBConfigHelper } from "../MTBConfig";
import { ActTimeFeature } from "./TimeFeature";
import { PanelType } from "../PanelConfig";
import HDebug from "../HDebug";
import { ActivityConfig } from "../ActivityConfig";
import { ConfigFinder } from "../HydraConfigFinder";
import { ActivityType } from "../AppConstants";
import { Cfg_hdConf } from "../CfgConstants";
import { ActFeature, HuoDong, IMainFeature, LimitActivityPindex } from "../ActivityModule/ActivityHeadFile";
import ProxyManager from "../ProxyManager";
import { UIControlManagerTemp } from "../UIControlManager";

declare let localdb, require;

export class MainFeature<T extends IFeatureCB> extends ActFeature<T> implements IMainFeature {
    public enterActivity() {
        let actID = this.m_activity.GetActID();
        let p = MTBConfigHelper.GetActivityPanel(actID);
        let tt: Cfg_hdConf = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, this.m_activity.GetActID());
        let cfg = ActivityConfig.ActivityFeatureConfig[tt.showType];
        HDebug.Assert(cfg, "未配置的ActivityShowType，请检查ActivityConfig");
        if (p != PanelType.None) {
            let func = (info) => {
                this.openActView(actID, p);
                //PanelOpenHelper.JumpToPanel(p, sendData);
            }
            ProxyManager.getInstance().limitActivityProxy.
                    sendReqActivityInfo(func, actID, cfg.activityType ? cfg.activityType : ActivityType.ActiveActivities);
            //monotodo 对大富豪活动数据请求进行暂时屏蔽
            //if(actID != LimitActivityPindex.GameMonopoly) {
            //    ProxyManager.getInstance().limitActivityProxy.
            //        sendReqActivityInfo(func, actID, cfg.activityType ? cfg.activityType : ActivityType.ActiveActivities);
            //} else {
            //    func && func(null);
            //}

        }
        else {
            HDebug.Error("未处理的活动类型");
        }
    }

    protected openActView(actID: number, panelType: PanelType) {
        let sendData = {
            pindex: actID,
            panelType: panelType,
        }
        UIControlManagerTemp.Instance().JumpToPanel(panelType, sendData);
    }

    public onGetNetBaseData(data: HuoDong) {
        this.m_activity.GetFeature(ActTimeFeature).SetTimeByData(data.type, data.sTime, data.eTime, data.showTime);
    }

    public onGetDetailData(netData) {

    }
}
