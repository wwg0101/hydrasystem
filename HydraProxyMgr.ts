import HDebug from "./HDebug";
import { FeatureSingletonSys } from "./Feature";
import { IProxy, IProxyData, ListenerCB, ProxyBase, Request, RequestSeq } from "./HydraProxy";
import { ProxyConfig } from "./HydraProxyConfig";

export class HydraProxy {
    //獲取當前最新的全量數據 GetData(數據類型)
    public static GetData<D extends IProxyData>(dataType : new() => D) : D {
        return HydraProxyMgr.Instance().GetProxyByData(dataType).Get(dataType);
    }
    //監聽全量數據變化 AddListener(數據類型, 回調)
    //監聽增量數據變化 AddListener(數據類型, 回調, 數據key)
    //回調格式： (數據類型) => {}
    //返回值是該次監聽的標識ID，務必在不用時stop
    public static AddListener<D extends IProxyData>(dataType : new() => D, func : ListenerCB<D>, dataKey ?: string) : number {
        return HydraProxyMgr.Instance().GetProxyByData(dataType).Receive(dataType, func, dataKey);
    }
    //停止監聽 StopListener(標識ID)
    public static StopListener<D extends IProxyData>(dataType : new() => D, listenerID : number) {
        HydraProxyMgr.Instance().GetProxyByData(dataType).StopReceive(dataType, listenerID);
    }
    public static Register<D extends IProxyData>(proxy: ProxyBase, dataType : new() => D, protoName : string) {
        HydraProxyMgr.Instance().RegisterProxyData(proxy, dataType);
        proxy.AddDataHandler(dataType, protoName);
    }
    public static Send<T extends ProxyBase, R extends Request>(type: new () => T, requestType : new() => R,  ...params) : R {
        return HydraProxyMgr.Instance().GetProxy(type).Send(requestType, ...params);
    }
    public static SendSeq<T extends ProxyBase>(type: new () => T, ...params) : RequestSeq {
        return HydraProxyMgr.Instance().GetProxy(type).SendSeq(...params);
    }
    public static GetProxy<D extends ProxyBase>(type : new() => D) : D {
        return HydraProxyMgr.Instance().GetProxy(type);
    }
}
export class HydraProxyMgr extends FeatureSingletonSys<IProxy> {
    protected Init() {
        super.Init();
        ProxyConfig.InitAllProxy(this);
        this.featureSys.GetAllFeature().forEach((proxy : IProxy) => {
            proxy.Init();
        });
    }
    protected UnInit() {
        super.UnInit();
        this.featureSys.GetAllFeature().forEach((proxy : IProxy) => {
            proxy.Destroy();
            this.DeregisterAll(proxy);
        });
        this.featureSys.GetAllFeature().Clear();
        this.allDataTypeKey.clear();
    }
    public OnUserLogin() {
        this.featureSys.GetAllFeature().forEach((proxy : IProxy) => {
            proxy.OnUserLogin();
        });
    }
    public OnUserLogout() {
        this.featureSys.GetAllFeature().forEach((proxy : IProxy) => {
            proxy.OnUserLogout();
        });
    }
    public AddProxy<T extends IProxy>(type: new () => T) {
        this.AddFeature(type);
    }
    public GetProxy<T extends IProxy>(type: new () => T): T {
        return this.GetFeature(type);
    }

    private allDataTypeKey : Map<any, ProxyBase> = new Map();
    public RegisterProxyData<D extends IProxyData>(proxy: ProxyBase, dataType : new() => D) {
        HDebug.Assert(!this.allDataTypeKey.has(dataType), "重複添加數據類型，以后添加的為準！");
        this.allDataTypeKey.set(dataType, proxy);

    }
    public DeregisterAll(proxy: IProxy) {
        this.allDataTypeKey.forEach((p, k) => {
            if(p == proxy) {
                this.allDataTypeKey.delete(k);
            }
        });
    }
    public GetProxyByData<P extends ProxyBase, D extends IProxyData>(dataType : new() => D) : P {
        return <P>this.allDataTypeKey.get(dataType);
    }
    public static Instance() {
        return this.GetInstance(HydraProxyMgr);
    }
}