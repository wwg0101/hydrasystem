declare let require, facade;
import { Singleton } from "./HydraComponents/HydraSingleton";
import { PanelConfig, PanelType } from "./PanelConfig";
// const Utils = require("../app/utils/Utils");

const UIHelper = require("../app/component/UIHelper");

export interface IPanelControl {
    //准备prefab
    PreparePrefab(cbFunction: Function);
    GetPrefab(name: string): cc.Node;
    //初始化
    Init();
    //是否可以显示界面，在JumpTo和Pull时判断，返回false则会取消打开
    CanShowPanel(params): boolean;
    //准备数据
    BeforePanelShow(bRollback: boolean, params: any);
    //显示
    OnPanelShow();
    //是否可以关闭界面，在Rollback和Throw时判断，返回false则会取消关闭
    CanHidePanel(): boolean;
    //隐藏
    OnPanelHide();
    //释放
    OnPanelRelease();
    //刷新
    OnPanelRefresh(params: any);

    //工具方法 - 如非必要，请勿调用
    GetNode(): cc.Node;
    SetCanvasOrder(order: number);
    SetPanelType(type: PanelType);
    GetPanelType(): PanelType;
    IsVisible(): boolean;
    //销毁节点
    Destroy();
    SetVisible(bActive: boolean);
    OptimizeDc(bVisible: boolean);
    //性能监控
    CheckPerformance();
}

//兼容接口
export interface IPanelControlCompat {
    //兼容代码
    SetOpenParam(params);
}

//UI工具类
export class UIControl {

    //打开指定界面 【界面类型，打开参数openParam，会再beforepanelshow时传递】
    //public static JumpToPanel(toType: PanelType, params?) {
    //    Utils.utils.openPrefabView(PanelConfig[toType].url, false, params);
    //    // if (SceneState.IsLoading())
    //    //     SceneManager.getInstance().CacheFunction(
    //    //         () => {
    //    //             UIControl.JumpToPanel(toType, params);
    //    //         }
    //    //     );
    //    // else {
    //    //     AsynUIControl.JumpToPanel(toType, params, null);
    //    // }
    //}

    //关闭指定界面，如果界面不在栈顶，则关闭失败
    public static RollBack(ctrl: any) {
        //todo UI框架时接回来哦
        ctrl && ctrl.closeSelf();
        //Utils.utils.closeView(ctrl);
        // AsynUIControl.RollBack(ctrl);
    }
    // //跳转到指定界面，如果界面已在堆栈中，等价于自动rollback，否则清除所有界面并拉起
    //public static GoToPanel(type: PanelType, params?) {
    //    //     if (SceneState.IsLoading())
    //    //         SceneManager.getInstance().CacheFunction(
    //    //             () => {
    //    //                 UIControl.GoToPanel(type, params);
    //    //             }
    //    //         );
    //    //     else {
    //    //         AsynUIControl.GoToPanel(type, params);
    //    //     }
    //    this.JumpToPanel(type, params);
    //}
    // //直接无视堆栈，干掉某界面，用的人自重！如果是PanelConfig里用了queue的界面不要用这个方法
    // public static RemovePanel(type: PanelType): boolean {
    //     return AsynUIControl.RemovePanel(type);
    // }
    // //不参与堆栈管理
    // public static CreateFreePanel(type: PanelType, cbFunction: Function) {
    //     AsynUIControl.CreateFreePanel(type, cbFunction);
    // }
    // public static ReleaseFreePanel(type: PanelType) {
    //     PanelManager.ReleaseByType(type);
    // }
    // //不准用！
    // public static JumpToPanelWithCB(toType: PanelType, params, cbFunction: Function) {
    //     AsynUIControl.JumpToPanel(toType, params, cbFunction);
    // }
    // //根据界面的url反查界面类型
    // public static FindPanelType(url: string): PanelType {
    //     return <PanelType>this.FindKey(url);
    // }
    // private static FindKey(url: string): number {
    //     for (const key in PanelConfig) {
    //         if (PanelConfig[key].url == url) {
    //             return Number(key);
    //         }
    //     }
    //     HDebug.Error("查找界面失败，请添加PanelConfig配置" + url);
    //     return PanelType.None;
    // }

    // public static GetPanel(type: PanelType): IPanelControl {
    //     return PanelManager.GetPanel(type);
    // }
}

//跳转状态
// export enum JumpState {
//     Illegal,  //无法进入
//     UnCreate, //未创建
//     Success,  //成功
//     Refresh, //刷新
// }

// export class UIControlManager extends Singleton<UIControlManager> {
//     public static Instance(): UIControlManager {
//         return this.GetInstance(UIControlManager);
//     }

// //     private _uiObserverManager: UIObserverManager = new UIObserverManager();
// //     // private _stackEmptyManager: StackEmptyManager = new StackEmptyManager();
// //     protected Init() {
// //         super.Init();
// //         this.curUIStack = new UIStackQueue();
// //         this.curUIStack.Init(true);
// //         this._uiObserverManager.init();
// //         // this._stackEmptyManager.init();
// //     }

// //     protected UnInit() {
// //         super.UnInit();
// //         PanelManager.ReleaseAll(true);
// //         // this._stackEmptyManager.uninit();
// //         this._uiObserverManager.uninit();
// //     }

// //     public GetUIObserverManager() { return this._uiObserverManager; }
// //     // public GetStackEmptyManager() { return this._stackEmptyManager; }

// //     //拉起一个界面，无栈限制 无限栈制 I am the bone of my stack
// //     public PullPanel(type : PanelType, params : any): JumpState {
// //         let panel = PanelManager.GetPanel(type);
// //         if(!panel.CanShowPanel(params))
// //             return;
// //         HDebug.Assert(panel != null, "界面不存在，生命周期异常！");
// //         let jumpState = JumpState.Success;
// //         if(this.curUIStack.Pull(type) == JumpState.Success) {
// //             this.ShowPanel(panel, false, params);
// //             this._uiObserverManager.onAddPanel(type, false);
// //         }
// //         else {
// //             panel.OnPanelRefresh(params);
// //             jumpState = JumpState.Refresh;
// //         }
// //         this.curUIStack.RecaculatePanelOrder();
// //         return jumpState;
// //     }
// //     //隐藏一个界面
//     // public ThrowPanel(ctrl: IPanelControl) {
// //         if(!ctrl.CanHidePanel())
// //             return;
// //         this.curUIStack.Throw(ctrl.GetPanelType());
// //         this._uiObserverManager.onRemovePanel(ctrl.GetPanelType(), false);
// //         this.Leave(ctrl);
// //         PanelManager.Release(ctrl);
//     // }

// //     private curUIStack : UIStackQueue = null;
// //     //private m_layerUIStack: PanelInfo[][] = [];
// //     //前往某个界面，同步
//     // public JumpToPanel(type: PanelType, params: any): JumpState {
// //         let ctrl: IPanelControl = PanelManager.GetPanel(type);
// //         if (ctrl != null) {
// //             let isLegal: boolean = ctrl.CanShowPanel(params);
// //             ///先判断是不是能进入该窗口，不能则什么都不处理 - 被进入的界面需要提供一套进入条件检测及处理的流程哦~
// //             if (!isLegal) {
// //                 ctrl.SetVisible(false);
// //                 return JumpState.Illegal;
// //             }

// //             let pLayer: PanelLayer = PanelConfig[type].layer;//ctrl.GetPanelLayer();
// //             let layerStack = this.curUIStack.GetLayer(pLayer);
// //             let lastTopWin: PanelType = PanelType.None;
// //             if (layerStack.length != 0)
// //                 lastTopWin = layerStack[layerStack.length - 1].type;
// //             //解决循环跳转
// //             if(this.curUIStack.ExistInStack(type)) {
// //                 if(pLayer < PanelLayer.StaticLayer) { 
// //                     HDebug.Log("出现循环跳转！！ " + PanelType[type]);
// //                     //回退过去
// //                     //隐藏上层界面
// //                     this.curUIStack.ClearUpperLayer(pLayer);
// //                     for(let i = layerStack.length - 1; i >= 0; --i) {
// //                         if(layerStack[i].type != type) {
// //                             this.RollBack(PanelManager.GetPanel(layerStack[i].type), false);
// //                         }
// //                         else {
// //                             break;
// //                         }
// //                     }
// //                 }
// //                 layerStack[layerStack.length - 1].UpdateData(params);
// //                 //兼容
// //                 (<any>ctrl).SetOpenParam(params);
// //                 ctrl.OnPanelRefresh(params);
// //                 return JumpState.Refresh;
// //             }
// //             ///先入栈
// //             this.curUIStack.Push(new PanelInfo(type, params));
// //             ///离开之前的界面
// //             if (lastTopWin != PanelType.None) {
// //                 this.LeavePanel(lastTopWin);
// //             }
// //             ///进入该界面
// //             this.ShowPanel(ctrl, false, params);
// //             ctrl.SetCanvasOrder(this.curUIStack.GetPanelDepth(pLayer));
// //             return JumpState.Success;
// //         }
// //         else {
// //             return JumpState.UnCreate;
// //         }

//     // }
// //     //关闭某个界面
//     // public RollBack(ctrl: IPanelControl, forceRemove: boolean): boolean {
// //         if(ctrl == undefined){
// //             return;
// //         }
// //         let pLayer: PanelLayer = PanelConfig[ctrl.GetPanelType()].layer;
// //         let layerStack = this.curUIStack.GetLayer(pLayer);
// //         if (layerStack.length == 0) {
// //             ///理论上是不会为空的
// //             return false;
// //         }
// //         if (ctrl.GetPanelType() != layerStack[layerStack.length - 1].type) {
// //             ///离开了非栈顶的界面是什么鬼
// //             //LeavePanel(ctrl);
// //             HDebug.Error("不允许离开非栈顶的界面 " + PanelType[ctrl.GetPanelType()] + " 当前栈顶 " + PanelType[layerStack[layerStack.length - 1].type]);
// //             return false;
// //         }
// //         if(!forceRemove && !ctrl.CanHidePanel()) {
// //             HDebug.Warning("想要关闭的界面因为自身状态，禁止了此次关闭");
// //             return false;
// //         }
// //         this.curUIStack.Pop(pLayer);
// //         this.Leave(ctrl);
// //         this.Release(ctrl);
// //         //重新获取一下层级信息
// //         layerStack = this.curUIStack.GetLayer(pLayer);
// //         if (layerStack.length != 0) {
// //             let dest: PanelInfo = layerStack[layerStack.length - 1];
// //             ///回滚到原本的窗口
// //             let pEnterCtrl: IPanelControl = PanelManager.GetPanel(dest.type);
// //             if (pEnterCtrl != null) {
// //                 this.ShowPanel(pEnterCtrl, true, dest.data);
// //             }
// //             else {
// //                 HDebug.Error("[UIControlManager][RollBack]有问题的分支，出现请拉柏豪 " + dest.type);
// //                 // ctrl.OnPanelRefresh(dest.data);
// //             }
// //         }
// //         return true;
//     // }
// //     //无视堆栈，移除某个界面
//     // public RemovePanel(type: PanelType): boolean {
// //         let ctrl = PanelManager.GetPanel(type);
// //         if (ctrl == null) {
// //             HDebug.Error("直接销毁界面就算了，还特么销毁一个不存在的界面！！ " + PanelType[type]);
// //             return false;
// //         }

// //         let pLayer: PanelLayer = PanelConfig[ctrl.GetPanelType()].layer;
// //         let layerStack = this.curUIStack.GetLayer(pLayer);
// //         if (layerStack.length == 0) {
// //             ///理论上是不会为空的
// //             return false;
// //         }

// //         let findIndex = -1;
// //         for (let i = 0; i < layerStack.length; ++i) {
// //             if (layerStack[i].type == type) {
// //                 findIndex = i;
// //                 break;
// //             }
// //         }
// //         let isTop = findIndex == layerStack.length - 1;
// //         if (isTop) {
// //             return this.RollBack(ctrl, true);
// //         }
// //         else {
// //             this.Leave(ctrl);
// //             this.curUIStack.Remove(type);
// //             this.Release(ctrl);
// //         }
// //         return true;
//     // }
// //     //处理跳转界面
//     // public GoToPanel(type: PanelType, params) {
// //         this._uiObserverManager.lock();
// //         SceneState.SetTarget(type);
// //         // this._stackEmptyManager.clearAutoJump();
// //         this.curUIStack.HandleGoTo(type, params);

// //         //加载场景的坑
// //         if (!SceneState.IsLoading()) {
// //             UIControl.JumpToPanel(type, params);
// //         }
// //         else {
// //             UIControlManager.Instance().MakeStackInfo(type, params);
// //         }
// //         SceneState.SetTarget(PanelType.None);

// //         this._uiObserverManager.unlock();
// //         this._uiObserverManager.check();
//     // }

// //     //检查一个栈是否为空
// //     // public CheckEmpty(): boolean {
// //     //     return this._stackEmptyManager.GetIsEmpty();
// //     // }
// //     //进出场景
// //     public MakeStackInfo(totype: PanelType, params: any) {
// //         this.curUIStack.Make(new PanelInfo(totype, params));
// //     }
//     public OnEnterScene() {
// //         SceneState.LoadOver();
// //         this.curUIStack.OnEnterScene();
//     }
//     public OnLeaveScene() {
// //         this.curUIStack.OnLeaveScene();
// //         for(let i = PanelLayer.Count - 1; i >= 0; --i) {
// //             let s = this.curUIStack.GetLayer(i);
// //             for(let j = s.length - 1; j >= 0; --j) {
// //                 let p = PanelManager.GetPanel(s[j].type);
// //                 if(p) {
// //                     if(p.IsVisible()) {
// //                         p.OnPanelHide();
// //                     }
// //                     PanelManager.Release(p);
// //                 }
// //             }
// //         }
// //         PanelManager.OnLeaveScene();
// //         SeqLoad.Clear();
// //         this._uiObserverManager.onChangeScene();
//     }
// //     private ShowPanel(ctrl: IPanelControl, bRollBack: boolean, params) {
// //         ctrl.BeforePanelShow(bRollBack, params);
// //         ctrl.OnPanelShow();
// //         //ctrl.CheckPerformance();
// //         PanelManager.MarkLoad(ctrl.GetPanelType());
// //         //如果是全屏界面，隐藏下面的界面
// //         if (PanelConfig[ctrl.GetPanelType()].fullScreen && !PanelConfig[ctrl.GetPanelType()].subLayer) {
// //             this.curUIStack.HideLowerLayer(PanelConfig[ctrl.GetPanelType()].layer);
// //         }
// //     }
// //     private Leave(ctrl: IPanelControl) {
// //         if(ctrl.IsVisible()) {
// //             //scenecontainer的锅，垃圾代码
// //             ctrl.OnPanelHide();
// //         }
// //         //如果是全屏界面，显示下面的界面
// //         if (PanelConfig[ctrl.GetPanelType()].fullScreen && !PanelConfig[ctrl.GetPanelType()].subLayer) {
// //             this.curUIStack.ShowLowerLayer(PanelConfig[ctrl.GetPanelType()].layer);
// //         }
// //     }
// //     private LeavePanel(panel: PanelType) {
// //         let ctrl: IPanelControl = null;
// //         ctrl = PanelManager.GetPanel(panel);
// //         if (ctrl != null) {
// //             this.Leave(ctrl);
// //         }
// //     }
// //     private Release(ctrl: IPanelControl) {
// //         if (this.curUIStack.CanRelease(ctrl.GetPanelType())) {
// //             PanelManager.Release(ctrl);
// //         }
// //     }
// }

export class UIControlManagerTemp extends Singleton<UIControlManagerTemp> {
    public static Instance(): UIControlManagerTemp {
        return this.GetInstance(UIControlManagerTemp);
    }

    protected Init(): void {
        super.Init();
        this.registUI();
    }

    protected UnInit(): void {
        super.UnInit();
    }

    public registUI() {
        for (let panelType in PanelConfig) {
            let cfg = PanelConfig[panelType];
            if (cfg.needUIRegister) {
                UIHelper.registerUIConfig(PanelType[panelType], PanelConfig[panelType].url, null, panelType);
            }
        }
        //let panList = [PanelType.GameCornActView_Main, PanelType.GameCornActView_Join, PanelType.ActLeiJiRwdView];
        //for (let index = 0; index < panList.length; ++index) {
        //    let panType = panList[index];
        //    UIHelper.registerUIConfig(PanelType[panType], PanelConfig[panType].url, null, panType);
        //}
    }

    public JumpToPanel(type: PanelType, params?: any) {
        UIHelper.openLinkUI(type, params, null);
    }

    public JumpToQianJinPanel(configIndex: string, openParam?, openCallback?) {
        UIHelper.openUI(configIndex, openParam, openCallback);
    }

    public CloseTo(panelType: PanelType) {
        if (PanelType.MainView_Scene == panelType) {
            UIHelper.closeAll(false, true);
            facade.send("MAIN_SCENCELAYER_SET", 1);
        }
        else {
            let configIndex = PanelType[panelType];
            UIHelper.closeAllByAppoint(configIndex);

        }
    }
}