
// import { CombFruitProxy } from "../../app/models/CombFruit/CombFruitProxy";
import { LimitHdActProxy } from "./LimitActivity/LimitHdActProxy";
// import MemoirsProxy from "../../app/models/MemoirsProxy";
// import WinterBanquetProxy from "../../app/models/WinterBanquet/WinterBanquetProxy";
import { HydraProxyMgr } from "./HydraProxyMgr";
import { SmallGameProxy } from "./CommonProxy";
import { GameLinkMatchProxy } from "../../scripts/app/models/linkMatch/GameLinkMatchProxy";
import { GameGoldMinerProxy } from "../app/models/GameGoldMiner/GameGoldMinerProxy";
import { GameSakuraProxy } from "../app/models/GameSakura/GameSakuraProxy";
import ExhibitionProxy from "../app/models/exhibition/ExhibitionProxy";
import SecretaryProxy from "../app/models/Secretary/SecretaryProxy";
import { GameMonopolyProxy } from "../app/models/GameMonopoly/GameMonopolyProxy";
import CallbackProxy from "../app/models/Callback/CallbackProxy";

export class ProxyConfig {
    public static InitAllProxy(mgr: HydraProxyMgr) {
        mgr.AddProxy(LimitHdActProxy);
        mgr.AddProxy(SmallGameProxy);
        mgr.AddProxy(GameLinkMatchProxy);
        mgr.AddProxy(GameGoldMinerProxy);
        mgr.AddProxy(GameSakuraProxy);
        mgr.AddProxy(GameMonopolyProxy);
        mgr.AddProxy(ExhibitionProxy);
	    mgr.AddProxy(SecretaryProxy);
	    mgr.AddProxy(CallbackProxy);
        // mgr.AddProxy(WinterBanquetProxy);
        // mgr.AddProxy(MemoirsProxy);
        // mgr.AddProxy(CombFruitProxy);
    }
}