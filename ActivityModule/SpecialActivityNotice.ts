
import HDebug from "../HDebug";
import { PanelType } from "../PanelConfig";
import { IActivityNotice, INoticeCheckerHelper, NoticePriority } from "./ActivityNotice";

//月卡、年卡、基金*2
export class ChargeActivityNotice implements INoticeCheckerHelper {
    public NeedNotice() : boolean {
        let t = this.GetCurNoticeType();
        this.chargeNotice.SetCurNoticeType(t);
        return t != NoticeType.None;
    }
    private chargeNotice : ChargeNotice = new ChargeNotice();
    public GetNotice() : IActivityNotice {
        return this.chargeNotice;
    }

    private GetCurNoticeType() : NoticeType {
        //let Proxy = ProxyManager.getInstance();
        //if(OpenRuleManager.Instance().CheckCanOpen(PanelType.MonthlyCardView)) {
        //    //当前有月卡
        //    let hasBoughtMonth : boolean = Proxy.monthCardProxy.isCardBuy(CardType.MonthCard); //是否购买过月卡
        //    if(!hasBoughtMonth) {
        //        return NoticeType.MonthCard;
        //    }
        //    //当前有年卡
        //    let hasBoughtYear : boolean = Proxy.monthCardProxy.isCardBuy(CardType.YearCard); //是否购买过年卡
        //    if(!hasBoughtYear) {
        //        return NoticeType.YearCard;
        //    }
        //}
        //if(Proxy.BattlePassProxy.checkCanOpenBP() && OpenRuleManager.Instance().CheckCanOpen(PanelType.FundsView)) {
        //    //当前有礼券
        //    let hasBoughtBP1 : boolean = Proxy.BattlePassProxy.getPurchasedByBPId(); //是否购买过礼券
        //    if(!hasBoughtBP1) {
        //        return NoticeType.BP1;
        //    }
        //}
        //if(Proxy.FundsProxy.getHasCurrentFund() && OpenRuleManager.Instance().CheckCanOpen(PanelType.FundsView)) {
        //    //当前有基金
        //    let hasBoughtBP2 : boolean = Proxy.FundsProxy.getPurchasedBusinessFund(); //是否购买过基金
        //    if(!hasBoughtBP2) {
        //        return NoticeType.BP2;
        //    }
        //}
        return NoticeType.None;
    }
}

enum NoticeType {
    None,       //无
    MonthCard,  //月卡
    YearCard,   //年卡
    BP1,        //礼券
    BP2         //基金
}

//动态决定当前要展示的公告内容
class ChargeNotice implements IActivityNotice {
    //获取优先级
    public GetPriority() : NoticePriority {
        return NoticePriority.ChargeAct;
    }
    public GetDescUrl() : string {
        switch(this.noticeType) {
            default: HDebug.Error("未处理的充值活动类型");
        }
        return "";
    }
    public GetTitle() : string {
        return "";
    }
    public GoTo() {
        switch(this.noticeType) {
            //case NoticeType.MonthCard : 
            //case NoticeType.YearCard : {
            //    PanelOpenHelper.JumpToPanel(PanelType.MonthlyCardView);
            //}
            //break;
            //case NoticeType.BP1 :
            //case NoticeType.BP2 : {
            //    PanelOpenHelper.JumpToPanel(PanelType.FundsView);
            //}
            //break;
            default: HDebug.Error("未处理的充值活动类型");
        }
    }

    private noticeType : NoticeType = NoticeType.None;
    public SetCurNoticeType(n : NoticeType) {
        this.noticeType = n;
    }
}
