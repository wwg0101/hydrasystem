declare let require;
import HDebug from "../HDebug";
const ResManager = require("../../app/utils/ResManager");


export interface UIClassEX {
    //绑定节点
    InitClass(...params);
    //设置显隐
    SetVisible(b: boolean);
    GetVisible(): boolean;
    //设置数据
    ApplyData(params);
    //尝试调用方法
    TryInvoke(funcname: string, ...params): boolean;
}

export class AsynUIHolder<T extends UIClassEX & cc.Component, F> implements UIClassEX {
    private classType = null;
    protected uiClass: T = null;
    private prefabPath: string = null;
    private parent: cc.Node = null;
    private m_bHasLoad: boolean = false;
    private uiData: F = null;
    private initParam = null;
    constructor(type: new () => T, prefabPath: string, parent: cc.Node, ...params) {
        this.classType = type;
        this.prefabPath = prefabPath;
        this.parent = parent;
        this.m_bHasLoad = false;
        this.initParam = params;
    }

    public InitClass() { HDebug.Error("不能直接调用该方法"); }
    protected active: boolean = false;
    public SetVisible(b: boolean) {
        this.active = b;
        if (null != this.actualNode) {
            this.uiClass.SetVisible(this.active);
        }
        else {
            if (this.active) {
                this.CreateNode();
            }
        }
    }
    public GetVisible(): boolean {
        return this.active;
    }
    //设置数据
    public ApplyData(params: F) {
        this.uiData = params;
        if (this.active && null != this.uiClass) {
            this.uiClass.ApplyData(params);
        }
    }

    public TryInvoke(methodName: string, ...params): boolean {
        if (null != this.uiClass) {
            return this.uiClass.TryInvoke(methodName, ...params);
        }
        return false;
    }

    protected actualNode: cc.Node = null;
    private CreateNode() {
        if (this.m_bHasLoad) {
            //防止重复加载
            return;
        }
        this.m_bHasLoad = true;
        ResManager.getInstance().loadResource(this.prefabPath, cc.Prefab, (err, res) => {
            if (null != err) {
                HDebug.Error("loadPrefab报错，errMsg:" + err + " prefabPath:" + this.prefabPath);
            }
            else if (null == this.parent || !this.parent.isValid) {
                HDebug.Error("狗吧！parent无效!! prefabPath:" + this.prefabPath);
            }
            else {
                let node = cc.instantiate(res);
                this.OnNodeCreated(node);
            }
        });
    }

    protected OnNodeCreated(newNode: cc.Node) {
        this.actualNode = newNode;
        this.actualNode.parent = this.parent;
        this.uiClass = newNode.getComponent(this.classType);
        this.uiClass.InitClass(this.initParam);
        this.uiClass.SetVisible(this.active);
        if (this.active) {
            this.uiClass.ApplyData(this.uiData);
        }
    }
}

export class AsynNodeHolder {
    private prefabPath: string = null;
    private parent: cc.Node = null;
    private positon: cc.Vec2 = null;
    private scale: cc.Vec2 = null;
    private m_bHasLoad: boolean = false;
    constructor(p: cc.Node, prefabPath: string, pos?: cc.Vec2, scale?: cc.Vec2) {
        this.prefabPath = prefabPath;
        this.parent = p;
        this.positon = pos;
        this.scale = scale;
        this.m_bHasLoad = false;
    }

    Init(root: cc.Node) { HDebug.Error("不能直接调用该方法"); }
    private active: boolean = false;
    public IsVisible() {
        return this.active;
    }
    public SetVisible(b: boolean) {
        this.active = b;
        if (this.actualNode) {
            this.actualNode.active = this.active;
        }
        else {
            if (this.active) {
                this.CreateNode();
            }
        }
    }

    public Get(): cc.Node {
        console.assert(this.active, "没显示过获取NM");
        return this.actualNode;
    }

    public GetComponent<T extends cc.Component>(type: new () => T): T {
        return this.actualNode.getComponent(type);
    }

    public GetComponentInChildren<T extends cc.Component>(type: new () => T): T {
        return this.actualNode.getComponentInChildren(type);
    }

    protected actualNode: cc.Node = null;
    private CreateNode() {
        if (this.m_bHasLoad) {
            //防止重复加载
            return;
        }
        this.m_bHasLoad = true;
        ResManager.getInstance().loadResource(this.prefabPath, cc.Prefab, (err, res) => {
            if (null != err) {
                HDebug.Error("loadPrefab报错，errMsg:" + err + " prefabPath:" + this.prefabPath);
            }
            else if (null == this.parent || !this.parent.isValid) {
                HDebug.Error("狗吧！parent无效!! prefabPath:" + this.prefabPath);
            }
            else {
                let node = cc.instantiate(res);
                this.OnNodeCreated(node);
            }
        });
    }
    protected OnNodeCreated(n: cc.Node) {
        this.actualNode = n;
        this.actualNode.parent = this.parent;
        this.actualNode.active = this.active;
        if (this.positon) {
            this.actualNode.setPosition(this.positon);
        }
        if (this.scale) {
            this.actualNode.setScale(this.scale);
        }
    }
}