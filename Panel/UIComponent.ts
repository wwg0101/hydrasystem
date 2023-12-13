// // 通用ui组件 事件监听注销 children快速获取
// import EventManager, { EventObject } from "../EventManager";
// import EventConstants from "../../app/EventConstants";
// import SoundManager from "../SoundManager";
import { IPanelControl, IPanelControlCompat, UIControl } from "../UIControlManager";
import { PanelConfig, PanelType } from "../PanelConfig";
import EventManager, { EventObject } from "../EventManager";
import HDebug from "../HDebug";
// import ResManager from "../ResManager";

declare let require;
const BaseView = require("../../app/component/BaseView.js") ;

const { ccclass } = cc._decorator;
interface NodeArray {
    [key: string]: cc.Node
};

@ccclass
export default class UIComponent extends BaseView implements IPanelControl, IPanelControlCompat {
//export default class UIComponent extends cc.Component implements IPanelControl, IPanelControlCompat {
    CheckPerformance() { }

    PreparePrefab(cbFunction: Function) { }
    GetPrefab(name: string): cc.Node { return null; }
    //#region UI层级管理
    public GetNode(): cc.Node { return this.node; }
    protected panelType: PanelType = PanelType.None;
    public SetPanelType(n: PanelType) {
        this.panelType = n;
    }
    public GetPanelType(): PanelType {
        return this.panelType;
    }
    public IsVisible(): boolean {
        return this.m_bIsVisible;
    }
    public SetCanvasOrder(order: number) {
        this.node.zIndex = order;
    }
    private m_bIsVisible = false;
    public SetVisible(bActive: boolean) {
        this.m_bIsVisible = bActive;
        this.node.active = bActive;
        //bActive ? this.node.opacity = 255 : this.node.opacity = 0;
    }
    public OptimizeDc(bVisible: boolean) {
        //this.m_bIsVisible = bVisible;
        this.node.active = bVisible;
    }
    public Destroy() {
        //TODO
        //销毁这个UI
        this.node.destroy();
    }
    public SetOpenParam(params) {
        ((this.node) as any).openParam = params;
    }
    //#endregion

    //初始化 【onLoad之后】
    public Init() { }
    //是否可以展示界面
    public CanShowPanel(params): boolean { return true; }
    //准备数据阶段 【参数 - 是否是回退，false = 第一次展示，true = 其他界面关闭后回到这个界面】
    public BeforePanelShow(bRollback: boolean, params) {
        this.SetOpenParam(params);
        this.SetVisible(true);
        if (!bRollback) {
            if (params != null) {
                if (params.timeProxyTs_callback != null) {
                    params.timeProxyTs_callback(this.GetNode());
                }
            }
            this.showNodeEffect(this.node);

            if (this.panelType < PanelType.____SpecialIconOpenLimit_____) {
                //EventManager.getInstance().emit(EventConstants.GUIDE_OPENICONOPEN_TASKCHECK,this.panelType);
            }
        }
    }

    private showNodeEffect(guideNode, clipIndex?) {
        void 0 === clipIndex && (clipIndex = 0);
        if (null != guideNode) {
            var anim = guideNode.getComponent(cc.Animation);
            if (anim) {
                var clipsArr = anim.getClips();
                -1 == clipIndex && (clipIndex = Math.floor(Math.random() * clipsArr.length));
                // -1 != e &&
                //     i.length > 2 &&
                //     i.length % 2 == 0 &&
                //     (e += 2 * Math.floor((Math.random() * i.length) / 2));
                var animClip = clipsArr[clipIndex];
                animClip && anim.play(animClip.name, 0);
                animClip && anim.sample(animClip.name);
            }
        }
    }

    //显示阶段
    public OnPanelShow() {
        //EventManager.getInstance().emit(EventConstants.UICONTROLMANAGER_PANEL_SHOW, this.panelType);
    }
    public CanHidePanel(): boolean {
        return this.IsVisible();
    }
    //隐藏阶段  
    public OnPanelHide() {
        this.SetVisible(false);
        //EventManager.getInstance().emit(EventConstants.UICONTROLMANAGER_PANEL_HIDE, this.panelType);
    }
    //释放阶段 【onDestroy之前】
    public OnPanelRelease() {
        //先销毁子界面
        //EventManager.getInstance().emit(EventConstants.UICONTROLMANAGER_PANEL_RELEASE, this.panelType);
    }
    //刷新界面
    public OnPanelRefresh(params) { }

    // 自动绑定的ui列表
    protected _ui: NodeArray = {};
    // 监听的事件表
    protected _eventList: EventObject[] = [];
    // 播放的音效表
    protected _audioList: number[] = [];

    protected doCleanAll() {
        this._eventList.forEach(event => {
            EventManager.getInstance().off(event);
        });
        this._eventList = [];

        //this._audioList.forEach(id => {
        //    SoundManager.getInstance().stopEffect(id);
        //});
        this._audioList = [];
    }

    onDestroy() {
        this.doCleanAll();
        //if (PanelConfig[this.GetPanelType()].releaseRes) {
        //    ResManager.getInstance().cleanUnusedRes();
        //}
    }

    /**
     * 快速取到 以下划线开头命名的node
     * this._ui['_xx']
     */
    protected bindComponent() {
        this.bindNode(this.node);
    }

    private bindNode(nodeObject) {
        nodeObject.children.forEach((child: cc.Node) => {
            let name = child.name;
            if (name[0] === '_') {
                this._ui[name] = child;
            }
            this.bindNode(child);
        });
    }

    /**
     * 绑定监听事件
     * baseview自动会在节点销毁off事件
     */
    protected bindEvent(eventName: string, callback: Function) {
        let event = EventManager.getInstance().on(eventName, callback);
        this._eventList.push(event);
    }

    /**
     * 播放音效
     * @param name 
     * @param loop 
     * @param finishFunc 
     * @param volume 
     */
    protected playAudioEffect(name: string, loop: boolean = false, stopLast: boolean = false, finishFunc?: Function, volume?: number) {
        HDebug.TODO("未接入playAudioEffect");
        //let effectID = SoundManager.getInstance().playEffect(name, loop, stopLast, finishFunc, volume);
        //this._audioList.push(effectID);
    }

    protected getChildByKey(key: string): cc.Node {
        if (this._ui) {
            return this._ui[key];
        }
        return null;
    }

    public getOpenParam() {
        return ((this.node) as any).openParam;
    }
    //检测是否响应手机返回键
    public CheckCanKeyClose() {
        return true;
    }

    isNodeValid() {
        return this.node && this.node.isValid;
    }
}