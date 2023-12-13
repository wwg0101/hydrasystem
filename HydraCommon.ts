
import { GuardUtil } from "./GuardUtil";
import HDebug from "./HDebug";
import { List } from "./HydraComponents/HydraList";
import NetManager from "./NetManager";
const { ccclass } = cc._decorator;
@ccclass

export class GlobalData {
    public static zhulexianggive5000 = true;
}

export class FuncProto<T, U extends Function> implements IProto {
    m_request: T = null;
    m_callBack: U = null;
    m_timeOutCallBack: Function = null;
    m_needLock: boolean = true;
    constructor(type: (new () => T), ...params) {
        this.m_request = new type;
    }
    //构建一个请求
    private ConstructRequest(...params) {
        //这个应该是类型吧
        if (params.length % 2 != 0) {
            HDebug.Error("网络参数不匹配！");
        }
        else {
            if (params.length >= 2) {
                this.ParseNetworkParams(this.m_request, params[0], params[1], ...params);
            }
        }
    }
    private ParseNetworkParams(request: any, key: string, value: any, ...params) {
        request[key] = value;
        params.shift();
        params.shift();
        if (params.length >= 2) {
            this.ParseNetworkParams(request, params[0], params[1], ...params);
        }
    }

    Param(...params): IProto {
        this.ConstructRequest(...params);
        return this;
    }
    DParam(data): IProto {
        for (var key in data) {
            this.m_request[key] = data[key];
        }
        return this;
    }
    Callback(callback: U): IProto {
        this.m_callBack = callback;
        return this;
    }
    TimeOutCB(callback: Function): IProto {
        this.m_timeOutCallBack = callback;
        return this;
    }
    SetNeedLock(flag: boolean): IProto {
        this.m_needLock = flag;
        return this;
    }
    Send() {
        NetManager.getInstance().postProto(this.m_request,
            (msg) => {
                if (this.m_callBack != null) {
                    this.m_callBack(msg);
                }
            },
            () => {
                if (this.m_timeOutCallBack != null) {
                    this.m_timeOutCallBack();
                }
            }, this.m_needLock);
    }
}
//协议小工具
export class Proto<T> extends FuncProto<T, (msg) => void> { }

export class ErrFuncProto<T> extends FuncProto<T, (msg, errorInfo) => void> {
    Send() {
        NetManager.getInstance().postProto(this.m_request, (msg) => {
            let errorInfo = GuardUtil.SafeReturn(msg, "a.system.errror");
            if (this.m_callBack != null) this.m_callBack(msg, errorInfo);
        });
    }
}
export interface IProto {
    Param(...params): IProto;
    //跌跨提的，可以用数组
    DParam(data): IProto;
    Callback(callback: Function): IProto;
    TimeOutCB(callback: Function): IProto;
    Send();
    SetNeedLock(flag: boolean): IProto;
}

export interface UIClass {
    //绑定节点
    Init(root: cc.Node);
    //设置显隐
    SetVisible(b: boolean);
    //设置数据
    ApplyData(params);
}
export class UIHolder<T extends UIClass> implements UIClass {
    protected uiClass: T;
    private parent: cc.Node = null;
    private prefab: cc.Node = null;
    private offset: cc.Vec2 = null;
    private scale: cc.Vec2 = null;
    constructor(type: new () => T, prefab: cc.Node, parent: cc.Node) {
        this.uiClass = new type();
        this.prefab = prefab;
        this.parent = parent;
        if (!GlobalData.zhulexianggive5000) {
            //立刻创建，直接变卡
            this.CreateNode();
            this.SetVisible(false);
        }
    }

    Init(root: cc.Node) { HDebug.Error("不能直接调用该方法"); }
    protected active: boolean = false;
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

    public GetUIClass(): T {
        return this.uiClass;
    }

    //设置数据
    public ApplyData(params) {
        // console.assert(this.active, "没有显示过节点设置nm数据");
        if (this.active) {
            this.uiClass.ApplyData(params);
        }
    }

    public setOffset(offset: cc.Vec2) {
        this.offset = offset;
        if(null != this.actualNode){
            this.actualNode.setPosition(offset);
        }
    }

    public setScale(scale: cc.Vec2) {
        this.scale = scale;
        if(null != this.actualNode){
            this.actualNode.setScale(scale);
        }
    }

    private actualNode: cc.Node = null;
    private CreateNode() {
        let node = cc.instantiate(this.prefab);
        this.OnNodeCreated(node);
    }
    protected OnNodeCreated(n: cc.Node) {
        this.actualNode = n;
        this.actualNode.parent = this.parent;
        if(null != this.offset){
            this.actualNode.setPosition(this.offset);
        }
        if(null != this.scale){
            this.actualNode.setScale(this.scale);
        }
        this.uiClass.Init(this.actualNode);
        this.uiClass.SetVisible(this.active);
    }

    //慎用，可能没有
    GetNode(): cc.Node {
        return this.actualNode;
    }
}
export class NodeHolder {
    private prefab: cc.Node = null;
    private parent: cc.Node = null;
    private positon: cc.Vec2 = null;
    private scale: cc.Vec2 = null;
    constructor(p: cc.Node, pa: cc.Node, pos?: cc.Vec2, scale?: cc.Vec2) {
        this.prefab = p;
        this.parent = pa;
        this.positon = pos;
        this.scale = scale;
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
        // console.assert(this.active, "没显示过获取NM");
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
        let node = cc.instantiate(this.prefab);
        this.OnNodeCreated(node);
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

    //慎用，可能没有
    public GetNode(): cc.Node {
        return this.actualNode;
    }
}

export class NodeHolderWithZIndex extends NodeHolder {
    private _zIndex: number = 0;
    public setZIndex(zIndex: number) {
        this._zIndex = zIndex;
        if (this.actualNode) {
            this.actualNode.zIndex = zIndex;
        }
    }

    protected OnNodeCreated(node: cc.Node) {
        super.OnNodeCreated(node);
        node.zIndex = this._zIndex;
    }
}

//帶順序的字典
export class SortDic<K, V> {
    protected sortList: List<K> = new List<K>();
    protected dataMap: Map<K, V> = new Map<K, V>();
    private sort: (a: V, B: V) => number = null;
    public constructor(sortFunc: (a: V, b: V) => number) {
        this.sort = sortFunc;
    }
    public clear() {
        this.sortList.Clear();
        this.dataMap.clear();
    }
    public count(): number {
        return this.sortList.length;
    }
    public get(key: K): V {
        return this.dataMap.get(key);
    }
    public has(key: K): boolean {
        return this.dataMap.has(key);
    }
    public getAt(index: number): V {
        HDebug.Assert(index <= this.count(), "異常下標訪問");
        return this.dataMap.get(this.sortList[index]);
    }
    public getList(): List<K> {
        return this.sortList;
    }
    public foreach(func: (value: V) => {}) {
        for (let i = 0; i < this.sortList.length; ++i) {
            func(this.dataMap.get(this.sortList[i]));
        }
    }
    public set(key: K, value: V) {
        if (!this.dataMap.has(key)) {
            this.sortList.Add(key);
        }
        this.dataMap.set(key, value);
        this.resort();
    }
    public remove(key: K) {
        HDebug.Assert(this.dataMap.has(key), "重複移除！");
        this.sortList.Remove(key);
        this.resort();
        this.dataMap.delete(key);
    }
    public removeAt(index: number) {
        HDebug.Assert(index <= this.count(), "異常移除下標");
        this.sortList.RemoveAt(index);
        this.resort();
        this.dataMap.delete(this.sortList[index]);
    }
    protected resort() {
        //卡的話，可以考慮換成插入排序
        this.sortList.sort((a: K, b: K) => {
            return this.sort(this.dataMap.get(a), this.dataMap.get(b));
        });
    }
}

