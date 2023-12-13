import HDebug from "../HDebug";
import { IPanelConfig, PanelConfig, PanelType } from "../PanelConfig";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PanelConfigHelper{
    public static getPanelConfig(panelType:PanelType):IPanelConfig{
        let cfg = PanelConfig[panelType];
        HDebug.Assert(null !=cfg, "没panelType:"+panelType+"的配置");
        return cfg;
    }
    
    public static getPanelUrl(panelType:PanelType):string{
        let cfg = PanelConfigHelper.getPanelConfig(panelType);
        return null != cfg ? cfg.url : "";
    }
}