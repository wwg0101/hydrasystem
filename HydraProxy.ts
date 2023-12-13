import HDebug from "./HDebug";
import { GuardUtil } from "./GuardUtil";
import { Proto } from "./HydraCommon";
import NetManager from "./NetManager";
import { List } from "./HydraComponents/HydraList";
//抽象後臺數據交互流程
//Request 發包行为类 - 一般只需要填协议名
//DataHandler 收包 - 一般只需要填写协议名，并且声明关联的ProxyData
//ProxyData *负责处理并存储数据 - 主要实现 Update，根据netData刷新本地数据
//Proxy 功能中介者
//Send(SendDataType, params) - 发送一个请求，使用SucCallBack处理成功事件 
//Get(DataType) - 获取当前数据
//AddListener(DataType, cb, string?) => listenerID
//- 添加数据变化监视器，监听某个数据变化，不用时要手动停止，可選參數的數據子key
//RemoveListener - 停止监听变化
//网络层数据处理器
export interface IProxyData {
    Init();
    OnUserLogin();
    OnUserLogout();
    Clear();
    Update(netData: any);
}
export interface IProxy {
    Init();
    OnUserLogin();
    OnUserLogout();
    Destroy();
}
interface IProxyFunc {
    Init(proto: IProxy);
    Destroy();
}
interface IDataHandler extends IProxyFunc {
    OnUserLogin();
    OnUserLogout();
}
class ProxyFuncBase implements IProxyFunc {
    protected proxy: IProxy;
    protected protoType: any;
    constructor(protoType: any) {
        this.protoType = protoType;
    }
    public Init(proxy: IProxy) {
        this.proxy = proxy;
    }
    public Destroy() {
        this.proxy = null;
        this.protoType = null;
    }
}
//向服务器发起请求
//T僅做類型檢查
export class Request extends ProxyFuncBase {
    constructor(protoName: string) {
        super(protoName);
    }
    public Send(...params) {
        new Proto(this.protoType)
            .DParam(this.CreateParam(...params))
            .Callback(this.OnResp.bind(this))
            .TimeOutCB(() => {
                if (this.timeOutCB) {
                    this.timeOutCB();
                    this.timeOutCB = null;
                }
                this.OnTimeOut();
            })
            .Send();
    }

    private successCB: Function = null;
    public SucCallBack(cb: Function): Request {
        if (this.successCB != null) {
            let oldCB = this.successCB;
            this.successCB = (netData) => {
                oldCB(netData);
                cb(netData);
            }
        } else {
            this.successCB = cb;
        }
        return this;
    }
    private errorCB: Function = null;
    public ErrCallBack(cb: Function): Request {
        if (this.errorCB != null) {
            let oldCB = this.errorCB;
            this.errorCB = (netData, errorInfo) => {
                oldCB(netData, errorInfo);
                cb(netData, errorInfo);
            }
        } else { 
            this.errorCB = cb;
        }
        return this;
    }
    private timeOutCB: Function = null;
    public TimeOut(cb: Function): Request {
        if (this.timeOutCB != null) {
            let oldCB = this.timeOutCB;
            this.timeOutCB = () => {
                oldCB();
                cb();
            }
        } else { 
            this.timeOutCB = cb;
        }
        return this;
    }
    //构建协议参数
    protected CreateParam(...params): any {
        return null;
    }
    protected OnResp(netData) {
        let errorInfo = GuardUtil.SafeReturn(netData, "a.system.errror");
        if (errorInfo == null) {
            if (this.successCB) {
                this.successCB(netData);
                this.successCB = null;
            }
            this.OnSuccess();
        }
        else {
            if (this.errorCB) {
                this.errorCB(netData, errorInfo);
                this.errorCB = null;
            }
            this.OnError();
        }
    }
    protected OnSuccess() { }
    protected OnTimeOut() { }
    protected OnError() { }
}

export class RequestSeq {
    private allParams : any[] = null;
    constructor(...params) {
        this.allParams = params;
    }

    private InnerSend(req : Request, ...params) {
        req.SucCallBack(() => {
            params.shift();
            if (params.length > 0) {
                this.InnerSend(params[0], ...params);
            }
            else {
                if(this.successCB) {
                    this.successCB();
                    this.successCB = null;
                }
            }
        })
        .ErrCallBack(() => {
            if(this.errorCB) {
                this.errorCB();
                this.errorCB = null;
            }
        })
        .TimeOut(() => {
            if(this.timeOutCB) {
                this.timeOutCB();
                this.timeOutCB = null;
            }
        });
    }

    Send() : RequestSeq {
        this.InnerSend(this.allParams[0], ...this.allParams);
        return this;
    }

    private successCB: Function = null;
    public SucCallBack(cb: Function): RequestSeq {
        HDebug.Assert(this.successCB == null, "[RequestSeq]已有回调，请检查");
        this.successCB = cb;
        return this;
    }
    private errorCB: Function = null;
    public ErrCallBack(cb: Function): RequestSeq {
        HDebug.Assert(this.errorCB == null, "[RequestSeq]已有回调，请检查");
        this.errorCB = cb;
        return this;
    }
    private timeOutCB: Function = null;
    public TimeOut(cb: Function): RequestSeq {
        HDebug.Assert(this.timeOutCB == null, "[RequestSeq]已有回调，请检查");
        this.timeOutCB = cb;
        return this;
    }
}

export type ListenerCB<U> = (data: U) => void;
class ListenerWrapper {
    id: number;
    listener: Function;
    constructor(i, l) {
        this.id = i;
        this.listener = l;
    }
}
//接收到服务器的数据
export class DataHandler<T extends IProxyData> extends ProxyFuncBase implements IDataHandler {
    //所有的監聽者，key是監聽的數據key，如果為空，則默認是全量數據
    private allListener: Map<string, List<ListenerWrapper>> = null;
    private IDAllocator: number = 0;
    constructor(protoType: any, dataType: new () => T) {
        super(protoType);
        this.data = new dataType();
        this.data.Init();
    }
    public Init(proxy: IProxy) {
        super.Init(proxy)
        this.allListener = new Map();
        this.IDAllocator = 0;
        this.initNetData = {};
        NetManager.getInstance().subscribe(this.protoType, this.OnReceive, this);
    }
    private hasLogined: boolean = false;
    public OnUserLogin() {
        this.hasLogined = true;
        this.data.OnUserLogin();
        if (this.hasData()) {
            this.OnReceive(this.initNetData);
        }
    }
    public OnUserLogout() {
        this.hasLogined = false;
        this.initNetData = {};
        this.data.OnUserLogout();
    }
    public Destroy() {
        NetManager.getInstance().remove(this.protoType);
        this.allListener.clear();
        this.data.Clear();
    }
    private static readonly s_allMainKey: string = "_allData";
    public AddListener(func: ListenerCB<T>, dataKey?: string): number {
        this.IDAllocator++;
        let listenerList: List<ListenerWrapper> = null;
        if (dataKey == null) {
            dataKey = DataHandler.s_allMainKey;
        }
        if (this.allListener.has(dataKey)) {
            listenerList = this.allListener.get(dataKey);
        }
        else {
            listenerList = new List();
            this.allListener.set(dataKey, listenerList);
        }
        listenerList.Add(new ListenerWrapper(this.IDAllocator, func));
        return this.IDAllocator;
    }
    public RemoveListener(listenerID: number) {
        let find: boolean = false;
        this.allListener.forEach((l: List<ListenerWrapper>) => {
            if (!find) {
                for (let i = l.length - 1; i >= 0; --i) {
                    if (l[i].id == listenerID) {
                        l.RemoveAt(i);
                        find = true;
                        break;
                    }
                }
            }
        });
    }
    protected data: T = null;
    private initNetData: any = {};
    public GetData(): T {
        return this.data;
    }
    protected OnReceive(netData) {
        //保存一份，保證每次只更新增量內容
        //经过渣哥的指点，数组不应该支持增量更新
        if (netData instanceof Array) {
            this.initNetData = netData;
        }
        else {
            for (var key in netData) {
                this.initNetData[key] = netData[key];
            }
        }
        if (!this.hasLogined) {
            return;
        }
        this.data.Update(this.initNetData);
        this.allListener.forEach((l: List<ListenerWrapper>, key: string) => {
            if (l.length > 0) {
                let copyList: List<ListenerWrapper> = new List();
                for (let index = 0; index < l.length; ++index) {
                    copyList.Add(l[index]);
                }
                if (key == DataHandler.s_allMainKey) {
                    for (let index = 0; index < copyList.length; ++index) {
                        copyList[index].listener(this.data);
                    }
                }
                else {
                    let subData = GuardUtil.SafeReturn(netData, key);
                    if (subData) {
                        for (let index = 0; index < copyList.length; ++index) {
                            copyList[index].listener(this.data);
                        }
                    }
                }
            }
        });
    }
    public SimReceive(localData) {
        this.OnReceive(localData);
    }
    private hasData(): boolean {
        for (let key in this.initNetData) {
            return true;
        }
        return false;
    }
}

export class ProxyBase implements IProxy {
    //类型为数据类型，如果有多个收包操作同一个协议，则需要重构
    private allProxyDataHandler: Map<any, IDataHandler> = new Map<any, IDataHandler>();
    public AddDataHandler<D extends IProxyData>(dataType: new () => D, protoName: string) {
        let pf = new DataHandler<D>(protoName, dataType);
        pf.Init(this);
        this.allProxyDataHandler.set(new dataType(), pf);
    }
    public GetDataHandler<D extends IProxyData>(dataType: new () => D): DataHandler<D> {
        let pf = null;
        this.allProxyDataHandler.forEach((v, key) => {
            if (key instanceof dataType) {
                pf = v;
            }
        });
        HDebug.Assert(pf != null, "不存在的回包數據！");
        return pf;
    }

    public Init() { }
    public OnUserLogin() {
        this.allProxyDataHandler.forEach((v) => {
            v.OnUserLogin();
        });
    }
    public OnUserLogout() {
        this.allProxyDataHandler.forEach((v) => {
            v.OnUserLogout();
        });
    }
    public Destroy() {
        this.allProxyDataHandler.forEach((pf) => {
            pf.Destroy();
        });
        this.allProxyDataHandler.clear();
    }
    //發送請求 【請求對象類型，參數列表】
    //返回值为链式对象，可以设置SucCallBack
    public Send<T extends Request>(type: new () => T, ...params): T {
        let pf = new type();
        pf.Init(this);
        pf.Send(...params);
        return pf;
    }

    public SendSeq(...params) : RequestSeq {
        let s = new RequestSeq(...params);
        s.Send();
        return s;
    }

    //监听数据变化 【数据类型，回调函数】
    //返回值为监听id，不用时需要手动StopReceive
    public Receive<D extends IProxyData>(type: new () => D, func: ListenerCB<D>, dataKey?: string): number {
        return this.GetDataHandler(type).AddListener(func, dataKey);
    }
    //停止数据变化 【数据类型，监听id】
    public StopReceive<D extends IProxyData>(type: new () => D, listenerID: number) {
        this.GetDataHandler(type).RemoveListener(listenerID);
    }
    //获取数据 【数据类型】
    public Get<D extends IProxyData>(type: new () => D): D {
        return this.GetDataHandler(type).GetData();
    }
}