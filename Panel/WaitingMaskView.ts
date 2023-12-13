import { PanelData, PanelLayer } from "../PanelConfig";
import BasePanel from "./BasePanel";
import { TouchEnum, TouchManager } from "../TouchManager";
import MaskManager from "../MaskManager";

const { ccclass } = cc._decorator;
@ccclass
export default class WaitingMaskView extends BasePanel {
    Init(){
        super.Init();
        
        this.node.zIndex = PanelLayer.Count * PanelData.s_iLayerSpacing;
        this.node.parent = cc.director.getScene();
        cc.game.addPersistRootNode(this.node);
    }

    _touchType: TouchEnum = null;
    BeforePanelShow(bRollback, param) {
        super.BeforePanelShow(bRollback, param);
        this._touchType = param.touchType;
    }

    OnPanelShow() {
        super.OnPanelShow();
        this.m_bNeedClose = false;
        if (this._touchType != null) TouchManager.getInstance().LockTouch(this._touchType);
    
    }

    private m_bNeedClose = false;
    OnPanelHide() {
        this.m_bNeedClose = true;
        if (this._touchType != null) TouchManager.getInstance().UnlockTouch(this._touchType);
    }

    lateUpdate() {
        if (this.m_bNeedClose) {
            this.m_bNeedClose = false;
            this.SetVisible(false);
        }
    }

    OnClickMask() {
        MaskManager.getInstance().OnMaskClicked();
    }
}
