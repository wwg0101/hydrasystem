

// import { CurrencyItem } from "../../app/AppConstants";
// import ProxyManager from "../../app/ProxyManager";

import HDebug from "../HDebug";
// import { CommonBottomModule } from "../../app/views/main/MainView/CommonBottomModule";
// import CommonBottomView from "../../app/views/main/MainView/CommonBottomView";
import UIComponent from "./UIComponent";
import FwUtils from "../FwUtils";
import { PanelType } from "../PanelConfig";
import { UIControl } from "../UIControlManager";
// import { AutoUIConfig, AutoUIType, CommonBottomMode } from "../PanelUIConfig";
// import { IPanelControl, UIControl } from "../UIControlManager";
// import { CommonUIPrefabs, UIPrefab } from "../UIPrefab";



// interface IAutoUI {
//     Destroy();
//     //控制特定控件显隐
//     setVisible(type: AutoUIType, visible: boolean);
//     //改变帮助ID
//     changeHelpID(helpID: number);
//     //改变返回按钮文字
//     changeBtnDesc(desc: string);
//     //改变货币栏展示
//     changeCurrency(...currencyList: CurrencyItem[]);
//     //改变按钮可交互
//     changeBtnInteractable(active: boolean);
//     //获取item
//     getAutoUIItem(type: AutoUIType): cc.Node;
// }

export class PanelUtils {
    // 禁止所有按钮点击
    public static pauseAllButtonHandler(node: cc.Node) {
        let btns: cc.Button[] = node.getComponentsInChildren(cc.Button);
        if (btns && btns.length) {
            for (let i = 0; i < btns.length; i++) {
                let btn = btns[i];
                btn.interactable = false;
            }
        } else {
            HDebug.Error("没有找到ButtonHandler: ", node);
        }
    }

    //恢复所有按钮点击
    public static resumeAllButtonHandler(node: cc.Node) {
        let btns: cc.Button[] = node.getComponentsInChildren(cc.Button);
        if (btns && btns.length) {
            for (let i = 0; i < btns.length; i++) {
                let btn = btns[i];
                btn.interactable = true;
            }
        } else {
            HDebug.Error("没有找到ButtonHandler: ", node);
        }
    }
}

const { ccclass } = cc._decorator;
@ccclass
export default class BasePanel extends UIComponent {
    onLoad() {
        super.onLoad();
        this.bindComponent();
    }
    public PreparePrefab(cbFunction: Function) {
        //todo
        // UIPrefab.Load(this, this.GetPanelType(), cbFunction);
    }
    public GetPrefab(name: string): cc.Node {
        HDebug.Error("未實現該方法")
        return null;
        //
        //return UIPrefab.Get(this, name);
    }

    CheckPerformance() {
        let nodeList = FwUtils.getNodeList(this.node);
        let nodeCount = nodeList.length;
        if (nodeCount > 1000) {
            HDebug.Error("【performance】node count warning " + nodeCount + " " + PanelType[this.panelType]);
        }
    }
    //todo
    //protected getAutoUI(): new (panel: IPanelControl) => IAutoUI {
    //    return AutoUIBase;
    //}

    public Init() {
        super.Init();
        //this.initAutoUI(this.getAutoUI(), this);
    }

    public AutoClose() {
        UIControl.RollBack(this);
    }

    public BeforePanelShow(bRollback: boolean, params) {
        super.BeforePanelShow(bRollback, params);
        if (!bRollback) {
            if (null != params && this.isSubIdBase(params.subId)) {
                this.onChangeTabView(params.subId);
            }
        }
    }

    public OnPanelShow() {
        super.OnPanelShow();
        //ProxyManager.getInstance().CloudDirector.OnNewPanelOpen(this.GetPanelType());
        //if (this.checkCanShowBottom()) {
        //    CommonBottomModule.addMainPan(this.GetPanelType());
        //}
        //if (this.autoUI) {
        //    let bottom = this.autoUI.getAutoUIItem(AutoUIType.Bottom);
        //    if (bottom) {
        //        bottom.getComponent("CommonBottomView").show(this.GetPanelType());
        //    }
        //}
    }

    public OnPanelRefresh(params): void {
        super.OnPanelRefresh(params);
        //if (this.checkCanShowBottom()) {
        //    CommonBottomModule.refreshMainPan(this.GetPanelType());
        //}
        //if (this.autoUI) {
        //    let bottom = this.autoUI.getAutoUIItem(AutoUIType.Bottom);
        //    if (bottom) {
        //        bottom.getComponent("CommonBottomView").show(this.GetPanelType());
        //    }
        //}
    }

    public OnPanelHide() {
        super.OnPanelHide();
        //if (this.checkCanShowBottom()) {
        //    CommonBottomModule.removeMainPan(this.GetPanelType());
        //}
        //if (this.autoUI) {
        //    let bottom = this.autoUI.getAutoUIItem(AutoUIType.Bottom);
        //    if (bottom) {
        //        bottom.getComponent("CommonBottomView").hide();
        //    }
        //}
    }

    //private checkCanShowBottom(): boolean {
    //    return CommonBottomModule.checkCanShowBottom(this.GetPanelType());
    //}

    public OnPanelRelease() {
        super.OnPanelRelease();
        // UIPrefab.Clear(this);
    }

    public onChangeTabView(subId: number): void {
    }

    public closeView(): void {
        UIControl.RollBack(this);
    }

    //界面关闭成功的时候干的事
    private isSubIdBase(subId): boolean {
        return subId == undefined || subId == null || subId == 0 || subId == 1;
    }

    //protected autoUI: IAutoUI = null;
    //初始化配置型UI功能
    //private initAutoUI<T extends IAutoUI, T2 extends IPanelControl>(type: new (panel: T2) => T, p: T2) {
    //    //自动创建全屏关闭按钮
    //    let closeNode = cc.find("Auto", this.node);
    //    if (closeNode != null) {
    //        let btn = closeNode.addComponent(cc.Button);
    //        //设置按钮回调
    //        let evt = new cc.Component.EventHandler();
    //        evt.target = this.node;
    //        evt.component = "BasePanel",
    //            evt.handler = "AutoClose";
    //        btn.clickEvents.push(evt);
    //    }
    //    //自动创建配置型UI
    //    if (AutoUIConfig[this.GetPanelType()]) {
    //        if (this.autoUI) this.autoUI.Destroy();
    //        this.autoUI = new type(p);
    //    }
    //}

    private clickMap: Map<number, Function> = new Map<number, Function>();
    private clickIDAllocator: number = 0;
    //TODO,暂时不允许移除
    protected AddClickListener(btnNode: cc.Node, clickCb: Function) {
        //设置按钮回调
        btnNode.on("click", clickCb);
        let evt = new cc.Component.EventHandler();
        let clickID = ++this.clickIDAllocator;
        evt.target = this.GetNode();
        evt.component = "BasePanel",
            evt.handler = "commonBtnClickCB";
        evt.customEventData = clickID.toString();
        let clickEvt = btnNode.getComponent(cc.Button).clickEvents;
        clickEvt.splice(0, clickEvt.length);
        clickEvt.push(evt);
        this.clickMap.set(clickID, clickCb);
    }

    protected commonBtnClickCB(evt, data) {
        if (data) {
            let id = parseInt(data);
            this.clickMap.get(id)();
        }
    }
}

//自动创建UI控制器
//export class AutoUI<T extends IPanelControl> {
//    protected panel: T = null;
//    private allAutoUI: Map<AutoUIType, cc.Node> = new Map<AutoUIType, cc.Node>();
//    protected readonly btnBgExtraWidth = 244;
//    constructor(panel: T) {
//        this.panel = panel;
//        let panelType = panel.GetPanelType();
//        let node = panel.GetNode();
//        if (AutoUIConfig[panelType]) {
//            if (AutoUIConfig[panelType].closeBtn != undefined) {
//                //创建关闭按钮
//                let closeBtn = cc.instantiate(CommonUIPrefabs.GetPrefab("CloseBtn"));
//                closeBtn.setParent(node);
//                let guideItem = closeBtn.getComponent("GuideItem");
//                guideItem.btnUI = node.name;
//                let btnDesc = closeBtn.getComponentInChildren("LabelLocalized");
//                btnDesc.textKey = AutoUIConfig[panelType].closeBtn;
//                let labelComp: cc.Label = btnDesc.node.getComponent(cc.Label);
//                labelComp._forceUpdateRenderData();
//                let nodeBtnBG = cc.find("btnImg", closeBtn);
//                nodeBtnBG.width = labelComp.node.width + this.btnBgExtraWidth;
//                //设置按钮回调
//                closeBtn.on('click', this.onClickClose, this);
//                this.allAutoUI.set(AutoUIType.CloseBtn, closeBtn);
//                let helpBtn = cc.find("HelpBtn", btnDesc.node);
//                if (AutoUIConfig[panelType].helpID != undefined) {
//                    HDebug.Assert(!AutoUIConfig[panelType].otherHelp, "[AutoUIConfig]helpID和otherHelp不可兼得，请检查" + panelType);
//                    //创建帮助按钮
//                    let helpItem = helpBtn.getComponent("HelpItem");
//                    helpItem.helpId = AutoUIConfig[panelType].helpID;
//                    helpItem.setHelpCb(null);
//                    helpBtn.active = true;
//                }
//                else if (AutoUIConfig[panelType].otherHelp) {
//                    let helpItem = helpBtn.getComponent("HelpItem");
//                    helpItem.setHelpCb(this.onClickHelp.bind(this));
//                    helpBtn.active = true;
//                }
//                else {
//                    helpBtn.active = false;
//                }
//
//                this.allAutoUI.set(AutoUIType.HelpBtn, helpBtn);
//            }
//            if (AutoUIConfig[panelType].currencyID != undefined
//                || AutoUIConfig[panelType].normalCurrencyID != undefined) {
//                let currencyViewNode = cc.instantiate(CommonUIPrefabs.GetPrefab("CurrencyView"));
//                currencyViewNode.setParent(node);
//                let currencyView = currencyViewNode.getComponent("CurrencyView");
//                currencyView.setCurrencyIdWithNormalBuy(AutoUIConfig[panelType].currencyID, AutoUIConfig[panelType].normalCurrencyID);
//                this.allAutoUI.set(AutoUIType.CurrencyView, currencyViewNode);
//            }
//
//            //创建鲁班堂特权按钮
//            if (AutoUIConfig[panelType].BuildId != undefined) {
//                let SysStoryBtn = cc.instantiate(CommonUIPrefabs.GetPrefab("SysStoryBtn"));
//                SysStoryBtn.setParent(node);
//                //设置按钮回调
//                let comp = SysStoryBtn.getComponent("BuildStoryBtn");
//                comp.setBuildId(AutoUIConfig[panelType].BuildId);
//                this.allAutoUI.set(AutoUIType.BuildBtn, SysStoryBtn);
//            }
//
//            if (AutoUIConfig[panelType].commonBottom != undefined) {
//                let mode: CommonBottomMode = AutoUIConfig[panelType].commonBottom;
//                let bottomNode = cc.instantiate(CommonUIPrefabs.GetPrefab("CommonBottom"));
//                bottomNode.setParent(node);
//                let comp = bottomNode.getComponent("CommonBottomView");
//                let w = node.getComponent(cc.Widget);
//                HDebug.Assert(w != null, "需要底部请自己带widget组件！");
//                switch (mode) {
//                    case CommonBottomMode.BottomWithChat_Auto: {
//                        w.bottom = 284;
//                        w.updateAlignment();
//                        let w1 = bottomNode.getComponent(cc.Widget);
//                        w1.bottom = -284;
//                        w1.updateAlignment();
//                    } break;
//                    case CommonBottomMode.Bottom_Auto: {
//                        w.bottom = 224;
//                        w.updateAlignment();
//                        let w1 = bottomNode.getComponent(cc.Widget);
//                        w1.bottom = -224;
//                        w1.updateAlignment();
//                    } break;
//                }
//                comp.Init(this.panel.GetPanelType());
//                this.allAutoUI.set(AutoUIType.Bottom, bottomNode);
//            }
//        }
//    }
//
//    Destroy() {
//        this.allAutoUI.forEach((node: cc.Node) => {
//            node.destroy();
//        });
//    }
//
//    //控制显隐性
//    public setVisible(type: AutoUIType, visible: boolean) {
//        let uiItem = this.allAutoUI.get(type);
//        HDebug.Assert(uiItem != null, "没有创建，控制个鬼");
//        uiItem.active = visible;
//    }
//
//    //改变按钮可点
//    public changeBtnInteractable(active: boolean) {
//        let closeBtn = this.allAutoUI.get(AutoUIType.CloseBtn);
//        HDebug.Assert(closeBtn != null, "没有创建，控制个鬼");
//        let btn = closeBtn.getComponent(cc.Button);
//        btn.interactable = active;
//    }
//
//    //改变帮助ID
//    public changeHelpID(helpID: number) {
//        let helpBtn = this.allAutoUI.get(AutoUIType.HelpBtn);
//        HDebug.Assert(helpBtn != null, "没有创建，控制个鬼");
//        let helpItem = helpBtn.getComponentInChildren("HelpItem");
//        helpItem.helpId = helpID;
//    }
//
//    //改变返回按钮文字
//    public changeBtnDesc(desc: string) {
//        let closeBtn = this.allAutoUI.get(AutoUIType.CloseBtn);
//        HDebug.Assert(closeBtn != null, "没有创建，控制个鬼");
//        let btnDesc = closeBtn.getComponentInChildren("LabelLocalized");
//        btnDesc.string = desc;
//
//        let labelComp: cc.Label = btnDesc.node.getComponent(cc.Label);
//        labelComp._forceUpdateRenderData();
//        let nodeBtnBG = cc.find("btnImg", closeBtn);
//        nodeBtnBG.width = labelComp.node.width + this.btnBgExtraWidth;
//    }
//
//    //改变货币栏展示
//    public changeCurrency(...currencyList: CurrencyItem[]) {
//        let currencyView = this.allAutoUI.get(AutoUIType.CurrencyView);
//        HDebug.Assert(currencyView != null, "没有创建，控制个鬼");
//        currencyView.getComponent("CurrencyView").setNewCurrencyID(currencyList);
//    }
//
//    public getAutoUIItem(t: AutoUIType): cc.Node {
//        return this.allAutoUI.get(t);
//    }
//
//    protected onClickClose() {
//        UIControl.RollBack(this.panel);
//    }
//
//    protected onClickHelp() {
//        HDebug.Error("[AutoUI]未重写该方法，请检查")
//    }
//}
//class AutoUIBase extends AutoUI<IPanelControl> { }