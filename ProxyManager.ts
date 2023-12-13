import { Singleton } from "./HydraComponents/HydraSingleton";
import { HydraProxyMgr } from "./HydraProxyMgr";
import BagProxyAdaptor from "./ProxyAdaptor/BagProxyAdaptor";
import PlayerProxyAdaptor from "./ProxyAdaptor/PlayerProxyAdaptor";
import SoulmateProxyAdaptor from "./ProxyAdaptor/SoulmateProxyAdaptor";
import LimitActivityProxyAdaptor from "./ProxyAdaptor/LimitActivityProxyAdaptor";
import FloatRewardProxyAdaptor from "./ProxyAdaptor/FloatRewardProxyAdaptor";
import ServantClotheProxyAdaptor from "./ProxyAdaptor/ServantClotheProxyAdaptor";
import RankProxyAdaptor from "./ProxyAdaptor/rankProxyAdaptor";
import ServantProxyAdaptor from "./ProxyAdaptor/ServantProxyAdaptor";
import UnionProxyAdaptor from "./ProxyAdaptor/UnionProxyAdaptor";
import PurchaseProxy from "./ProxyAdaptor/PurchaseProxyAdaptor";
import ActivityRechargeProxyAdaptor from "./ProxyAdaptor/ActivityRechargeProxyAdaptor";


export default class ProxyManager extends Singleton<ProxyManager> {
    public static getInstance(): ProxyManager {
        return this.GetInstance(ProxyManager);
    }

    //进游戏初始化用，之前用的是proxy身上的ctor
    public OnInit() {
        HydraProxyMgr.Instance();
    }
    //ts的Proxy
    //adaptor的ts Proxy
    public readonly bagProxy = new BagProxyAdaptor();
    public readonly wifeProxy = new SoulmateProxyAdaptor();
    public readonly playerProxy = new PlayerProxyAdaptor();
    public readonly limitActivityProxy = new LimitActivityProxyAdaptor();
    public readonly floatRewardProxy = new FloatRewardProxyAdaptor();
    public readonly servantProxy = new ServantProxyAdaptor();
    public readonly servantClotheProxy = new ServantClotheProxyAdaptor();
    public readonly rankProxy = new RankProxyAdaptor();
    public readonly unionProxy = new UnionProxyAdaptor();
    public readonly purchaseProxy = new PurchaseProxy();
    public readonly rechargeProxy = new ActivityRechargeProxyAdaptor();
}
