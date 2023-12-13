import { ProxyBase, Request } from "./HydraProxy";
import { HydraProxy } from "./HydraProxyMgr";
import { LimitActivityPindex } from "./ActivityModule/ActivityHeadFile";
import { AlertUtils } from "./AlertUtils";
import HDebug from "./HDebug";
import { SmallGameData } from "./CommonProxyData";
import { GameCornData } from "../../scripts/app/models/GameCorn/GameCornProxy";
import { GameLinkMatchBPData, GameLinkMatchData } from "../../scripts/app/models/linkMatch/GameLinkMatchProxy";
import { GameBubbleDragonData } from "../app/models/GameBubble/GameBubbleDragonProxy";
import { GameGoldMinerData } from "../app/models/GameGoldMiner/GameGoldMinerProxy";
import { GameSakuraData } from "../app/models/GameSakura/GameSakuraProxy";
import { GameMonopolyData } from "../app/models/GameMonopoly/GameMonopolyProxy";
import { CallbackReturnData, CallbackReunionData, CallbackStoryData } from "../app/models/Callback/CallbackProxy";
// import { GameCornData } from "./CornGame/GameCornProxy";

declare let proto_sc, proto_cs, localdb: any;

//请求生成一个建筑 1
//使用道具A 2
//游戏结算 3
//使用道具B 4
//其他 0
//离开界面时保存 【saveInfo, upLoadInfo】
export class SaveInfo extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameHandler);
    }

    private pIndex: number = 0;
    protected CreateParam(...params): any {
        this.pIndex = params[0];
        let d: SmallGameData = this.GetData();
        let upLoadInfo = d.GetUpLoadInfo();
        this.ClearUpLoadInfo();
        return { pindex: this.pIndex, opType: params[1], saveInfo: d.GetSaveInfo(), upLoadInfo: upLoadInfo, multiple: d.GetMuiltiple(), seqID: d.getSeqId() };
    }
    protected OnResp(netData) {
        super.OnResp(netData);
    }

    protected OnError() {
        this.ClearUpLoadInfo();
        this.GetData().OnNetErr();
    }

    protected OnTimeOut() {
        this.ClearUpLoadInfo();
        this.GetData().OnNetErr();
        AlertUtils.Instance().alert18n("SMALL_GAME_NET_TIME_OUT");
    }
    private ClearUpLoadInfo() {
        this.GetData().ClearUpLoadInfo();
    }
    private GetData(): SmallGameData {
        switch (this.pIndex) {
            case LimitActivityPindex.GameCornActivity: {
                return HydraProxy.GetData(GameCornData);
            }
            case LimitActivityPindex.GameLinkMatchActivity: {
                return HydraProxy.GetData(GameLinkMatchData);
            }
            case LimitActivityPindex.GameBubbleDragon: {
                return HydraProxy.GetData(GameBubbleDragonData);
            }
            case LimitActivityPindex.GameGoldMiner: {
                return HydraProxy.GetData(GameGoldMinerData);
            }
            case LimitActivityPindex.GameSakura: {
                return HydraProxy.GetData(GameSakuraData);
            }
            case LimitActivityPindex.GameMonopoly: {
                return HydraProxy.GetData(GameMonopolyData);
            }
            default: {
                HDebug.Error("未处理的小游戏类型");
                return new SmallGameData();
            }
        }
    }
}

export class StartGame extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameSet);
    }

    protected CreateParam(...params): any {
        return { pindex: params[0], id: 0 };
    }
}

export class SetActRole extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameSet);
    }

    protected CreateParam(...params): any {
        return { pindex: params[0], id: params[1] };
    }
}

export class GetPowerInfo extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameGetPowerInfo);
    }
    protected CreateParam(...params): any {
        return { pindex: params[0] };
    }
}

export class UsePowerItem extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameAddPower);
    }
    protected CreateParam(...params): any {
        return { pindex: params[0], count: params[1] };
    }
}

//使用道具
export class UseActItem extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameUseItem);
    }
    protected CreateParam(...params): any {
        return { pindex: params[0], count: params[2], id: params[1] };
    }
}

export class ChangeMultiple extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameUpdateMultiple);
    }
    protected CreateParam(...params): any {
        return { pindex: params[0], multiple: params[1] };
    }
}

export class ReqRankRwdInfo extends Request {
    constructor() {
        super(proto_cs.huodong.hdGeneralRankRwd);
    }
    protected CreateParam(...params): any {
        return { act_id: params[0] };
    }
}


export class ReqRankInfo extends Request {
    constructor() {
        super(proto_cs.huodong.hdGetRank);
    }
    protected CreateParam(...params): any {
        return { act_id: params[0] };
    }
}

export class ReqGetRankRwd extends Request {
    constructor() {
        super(proto_cs.huodong.hdGeneralGetRankRwd);
    }
    protected CreateParam(...params): any {
        return { act_id: params[0], rank_type: params[1] };
    }
}

export class ReqRankRwdInfoEx extends Request {
    constructor() {
        super(proto_cs.huodong.hdGetRankRwd);
    }
    protected CreateParam(...params): any {
        return { act_id: params[0] };
    }
}

export class ReqClubInfo extends Request {
    constructor() {
        super(proto_cs.huodong.smallGameRichClubFind);
    }
    protected CreateParam(...params): any {
        return { cid: params[0] };
    }
}

export class SmallGameProxy extends ProxyBase {
    public Init() {
        HydraProxy.Register(this, GameCornData, proto_sc.ActiveHuoDong.smallGame9000);
        HydraProxy.Register(this, GameLinkMatchData, proto_sc.ActiveHuoDong.smallGame9001);
        HydraProxy.Register(this, GameLinkMatchBPData, proto_sc.ActiveHuoDong.battlePass9001);
        HydraProxy.Register(this, GameBubbleDragonData, proto_sc.ActiveHuoDong.smallGame9002);
        HydraProxy.Register(this, GameGoldMinerData, proto_sc.ActiveHuoDong.smallGame9003);
        HydraProxy.Register(this, GameSakuraData, proto_sc.ActiveHuoDong.smallGame9004);
        HydraProxy.Register(this, GameMonopolyData, proto_sc.ActiveHuoDong.smallGame9005);
    }
}
