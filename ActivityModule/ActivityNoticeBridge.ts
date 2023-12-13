
import { Cfg_hdConf } from "../CfgConstants";
import { ConfigFinder } from "../HydraConfigFinder";
import { PanelType } from "../PanelConfig";
import { ActivityShowType, IActivity } from "./ActivityHeadFile";

declare let localdb, i18n;

export class RedDotChecker {
    public static CheckHasRedDot(activity: IActivity) {
        console.warn("这功能还没好 先todo");
        // let bindStrArr = [];
        ////默認紅點
        //bindStrArr.push("ActivityFeature_" + activity.GetActID());
        //let cfg = SpecialBtnCfg[activity.GetActID()];
        //if(cfg && cfg.redDot) {
        //    for(let i = 0; i < cfg.redDot.length; ++i) {
        //        bindStrArr.push(cfg.redDot[i])
        //    }  
        //}
        //for (let arrLenght = bindStrArr.length, index = 0; index < arrLenght; index++) {
        //    if (RedDot._MAP[bindStrArr[index].toString()]) {
        //        return true;
        //    }
        //}
        return false;
    }
}

export class ActivityGoToHelper {
    public static GoTo(activity: IActivity) {
        let actID = activity.GetActID();
        let cfg: Cfg_hdConf = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, actID);
        switch (cfg.showType) {
            //case ActivityShowType.ShipLimit: {
            //    PanelOpenHelper.JumpToPanel(PanelType.ShipsPreview);
            //}
            //    break;
            //case ActivityShowType.Rich: {
            //    PanelOpenHelper.JumpToPanel(PanelType.RichPreview);
            //}
            //    break;
            default: {
                activity.GetMainFeature().enterActivity();
            };
        }
    }
}