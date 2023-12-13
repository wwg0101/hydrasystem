import { SmallGameData } from "../CommonProxyData";
import { IFeatureCB } from "../Feature";
import { MainFeature } from "../Feature/MainFeature";
import { ActInfo } from "../LimitActivity/LimitActivityHeadFile";
import { PanelType } from "../PanelConfig";


export interface ISmallGameMainFeature {
    GetGameJoinView() : PanelType;
    GetGameBookView() : PanelType;
    GetLuckyGiftView() : PanelType;
    GetLuckyGiftRwdPreview() : PanelType;
    GetInfo() : ActInfo;
    GetData(): SmallGameData;
}

export class SmallGameActInfoFeature<T extends IFeatureCB> extends MainFeature<T> {
    _info: ActInfo = null;
    GetInfo(): ActInfo {
        return this._info;
    }
    public onGetDetailData(data) {
        this.OnRespGetInfo(data);
        //todo 送礼featurem没接
        //this.m_activity.GetFeature(HdActSendGiftFeature).onGetData(data.score, data.num, data.giftNum);
    }
    protected OnRespGetInfo(info: ActInfo) {
        if (this._info != null) {
            for (let key in info) {
                this._info[key] = info[key];
            }
        } else {
            this._info = info;
        }
    }
}