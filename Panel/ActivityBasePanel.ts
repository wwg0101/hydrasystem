import { ActivityConfig, ActivityConfigHelper } from "../ActivityConfig";
import { IActivity, IActivityHelper } from "../ActivityModule/ActivityHeadFile";
import { ActivityMgr } from "../ActivityModule/ActivityModule";
import AppUtils from "../AppUtils";
import { Cfg_hdConf } from "../CfgConstants";
import { TimeOutFeature } from "../Feature/LimitHdActTimeCheckerFeature";
import HDebug from "../HDebug";
import { IProto } from "../HydraCommon";
import { ConfigFinder } from "../HydraConfigFinder";
import MaskManager, { NetworkOp } from "../MaskManager";
import { ISmallGameMainFeature } from "../SmallGameAct/SmallGameActFeature";
import { UIControl } from "../UIControlManager";
import ActivityPreloadPanel from "./ActivityPreloadPanel";

declare let localdb;

const { ccclass } = cc._decorator;
@ccclass
export class ActivityPanelBase extends ActivityPreloadPanel implements IActivityHelper {
    private m_bindAct: IActivity = null;

    public CanShowPanel(params): boolean {
        return super.CanShowPanel(params) && this.CheckActivityCanShow(params);
    }

    protected CheckActivityCanShow(param) {
        return true;
    }

    /**
     * 进入前网络请求协议
     * @returns 
     */
    protected getEnterReq(params: any): IProto {
        return null;
    }

    // protected getEnterReqs(params: any) : IProto[] {
    //     return null;
    // }

    // public testFunc(params) {
    //     let protoList = [];
    //     let enterProtos = this.getEnterReqs(params);
    //     let protoNum = enterProtos.length; 
    //     for(let index = 0; index < protoNum; ++ index) {
    //         let enterProto = enterProtos[index];
    //     }
    // }

    public BeforePanelShow(bRollBack, params) {
        super.BeforePanelShow(bRollBack, params);
        let enterProto = this.getEnterReq(params);
        if (enterProto) {
            //网络请求遮罩
            let loadingNode = this.getDisplayNode();
            let loadingAni = loadingNode.getComponent(cc.Animation);
            MaskManager.getInstance().ShowMask(NetworkOp.CommonEnter, 5, () => {
                //如果这里切换了场景，就让它毁灭吧……
                //this.SetVisible(true);
                loadingNode.active = true;
                if (loadingAni && loadingAni.playOnLoad) {
                    loadingAni.play();
                }
                UIControl.RollBack(this);
            });
            //this.SetVisible(false);
            loadingNode.active = false;
            enterProto.Callback((msg) => {
                MaskManager.getInstance().HideMask(NetworkOp.CommonEnter);
                //this.SetVisible(true);
                if (AppUtils.checkHasErrorMsg(msg)) {
                    console.log("活动界面回包数据异常");
                    UIControl.RollBack(this);
                } else {
                    loadingNode.active = true;
                    if (loadingAni && loadingAni.playOnLoad) {
                        loadingAni.play();
                    }
                }
            }).Send();
        }
    }

    public OnPanelHide() {
        super.OnPanelHide();
        this.Unbind();
    }

    //Helper工具方法，不需要变更
    Bind(act: IActivity) {
        this.m_bindAct = act;
        this.OnRegister();
    }
    Unbind() {
        this.OnDeregister();
        this.m_bindAct = null;
    }
    public GetActivity(): IActivity {
        return this.m_bindAct;
    }
    /**
     * 注册活动对应组件
     */
    protected OnRegister() {
        let checkerFt = this.m_bindAct.GetFeature(TimeOutFeature);
        if (checkerFt) checkerFt.addPan(this.GetPanelType());
    }

    /**
     * 注销活动对应组件
     */
    protected OnDeregister() {
        let checkerFt = this.m_bindAct.GetFeature(TimeOutFeature);
        if (checkerFt) checkerFt.removePan(this.GetPanelType());
    }

    //TODO 可以考虑设计一组活动的通用Feature以及对应的CB
    //比如
    /*public OnActivtiyOver() {
        UIControl.RollBack(this);
    }*/
    public CastTo<T>(type, obj: any): T {
        HDebug.Assert(obj instanceof type, "type cast error!");
        return obj as T;
    }

    public GetSmallGameFeatureInterface():ISmallGameMainFeature{
        let pindex  =this.GetActivity().GetActID();
        let item = ConfigFinder.Find<Cfg_hdConf>(localdb.table_activity, pindex);
        let ftCfg = ActivityConfig.ActivityFeatureConfig[item.showType];
        let ft = this.CastTo<ISmallGameMainFeature>(ftCfg.mainFeature, this.GetActivity().GetMainFeature());
        return ft;
    }
}

export default class ActivityPanel extends ActivityPanelBase {
    protected GetActivityPindex(): number {
        return this.GetActivity().GetActID();
    }
    public BeforePanelShow(bRollBack, params) {
        super.BeforePanelShow(bRollBack, params);
        //绑定活动ID
        this.Bind(ActivityMgr.Instance().Get(ActivityConfigHelper.GetActivityID(this.GetPanelType())));
    }
    protected CheckActivityCanShow(param) {
        return ActivityMgr.Instance().Has(ActivityConfigHelper.GetActivityID(this.GetPanelType()));
    }
}