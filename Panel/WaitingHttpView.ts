import { PanelData, PanelLayer } from "./../PanelConfig";
import BasePanel from "./BasePanel";

const { ccclass , property} = cc._decorator;
@ccclass
export default class WaitingHttpView extends BasePanel {
    @property(cc.Node)
    nodeAni:cc.Node = null;

    Init() {
        super.Init();
        this.bindComponent();
        // 常驻
        this.node.zIndex = PanelLayer.Count * PanelData.s_iLayerSpacing;
        this.node.parent = cc.director.getScene();
        cc.game.addPersistRootNode(this.node);
        this.nodeAni.active = false;
    }

    OnPanelShow() {
        super.OnPanelShow();
        this.unscheduleAllCallbacks();
         this.scheduleOnce(() => {
             this.nodeAni.active = true;
         }, 2);
    }

    OnPanelHide() {
        super.OnPanelHide();
        this.unscheduleAllCallbacks();
        this.nodeAni.active = false;
    }
}
