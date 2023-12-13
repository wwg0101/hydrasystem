declare let require;
import { Singleton } from "./HydraComponents/HydraSingleton";

export class AlertUtils extends Singleton<AlertUtils> {
    private alertList = [];
    public canResetQueue = false;
    public static Instance(): AlertUtils {
        return this.GetInstance(AlertUtils);
    }
    //尝试接引用空了的问题
    private helper = null;
    private getUIPopHelper():any{
        if(null == this.helper || undefined == this.helper|| {} == this.helper){
            this.helper = require("../../scripts/app/utils/PopUIHelper");
        }
        return this.helper;
    } 

    public onEnterScene() {
        this.alertList.splice(0, this.alertList.length);
    }

    //todo阉割下
    /*
    //TODO 这些带callback的可能有生命周期问题
    public flyIconAlert(str, needIcon, func, endFlyCallback) {
        this.alertBy("AlertFlyIconUI", {
            text: str,
            showIcon: needIcon,
            endFlyCallback: endFlyCallback,
            endCall: () => {
                if (null !== func) {
                    func();
                }
                this.CheckAndResetQueue(this.alertList)
            }
        }, false);
    }

    public flyAlert(str, addStr, needIcon, func) {
        this.alertBy("AlertFlyUI", {
            text: str,
            addText: addStr,
            showIcon: needIcon,
            endCall: () => {
                if (null !== func) {
                    func();
                }
                this.CheckAndResetQueue(this.alertList)
            }
        }, true);
    }
*/
    public alert(text, textOpt?, textColor?) {
        this.getUIPopHelper().helper.alert(text, textOpt, textColor);
        /* 换成千金的
        if (text) {
            this.alertBy("AlertUI", {
                text: text,
                textOpt: textOpt,
                textColor: textColor
            });
        }*/
    }

    public alert18n(text) {
        this.alert(text, {}, undefined);
    }

    //public alertItemLimit(itemID, itemCount?, hId?, gotoCallback?) {
    public alertItemLimit(itemID, itemCount?) {
        this.getUIPopHelper().helper.alertItemLimit(itemID, itemCount);
        /* 换成千金的
        void 0 === itemCount && (itemCount = 0);
        var itemCfg = localcache.getItem(localdb.table_item, itemID);
        HDebug.Assert(itemCfg != null, "[Utils][alertItemLimit]Cant find id on limitItem process, id is" + itemID);
        itemCfg &&
            this.alert("COMMON_LIMIT", {
                n: itemCfg.name
            });

        AllCommon.GetInitializer().timeProxy.showItemLimit({
            id: itemID,
            count: itemCount,
            heroId: hId,
            gotoCallback: gotoCallback
        });
        */
    }

    public alertIcon(text, url, textColor) {
        this.getUIPopHelper().helper.alertIcon(text, url, textColor);
        /* 换成千金的
        this.alertBy("AlertIcon", {
            text: text,
            url: url,
            textColor: textColor
        });
        */
    }

    //todo阉割下
    /*
    public notifyWifeChange(prefabStr, dataType, text) {
        this.alertBy(prefabStr, {
            text: text,
            dataType: dataType,
        });
    }

    public notifyDispatchChange(prefabStr, servantID, shopID) {
        this.alertBy(prefabStr, {
            servantID: servantID,
            shopID: shopID,
        });
    }
    */

    // public notifyCommonPrefab(prefabStr, ...params) {
    //     this.alertBy(prefabStr, params);
    // }

    ///**
    // * warning: 预制体挂载脚本名称需要与预制体名称一致
    // * @param prefabStr 
    // * @param paramData 
    // * @param noQueue 
    // */
    //private alertBy(prefabStr, paramData, noQueue = false) {
    //    let url = GlobalConfig.resDir + "/prefabs/ui/" + prefabStr;
    //    // upengine czx
    //    ResManager.getInstance().loadRes(url, cc.Prefab, (error, prefab) => {
    //        if (null != prefab) {
    //            this.alertShow(prefab, prefabStr, paramData, noQueue);
    //        }
    //        else {
    //            HDebug.Error(error);
    //        }
    //    });
    //}
    ////生成物体并把data对应属性放进去
    //public alertShow(prefab, prefabStr, paramData, noQueue) {
    //    var obj = cc.instantiate(prefab);
    //    if (obj) {
    //        obj.y = 100;
    //        var component = obj.getComponent(prefabStr);
    //        for (var n in paramData) component ? (component[n] = paramData[n]) : HDebug.Error(prefabStr + " is not find");
    //        if (!noQueue) this.alertAddToQueue(obj, component);
    //        else this.alertAdd(obj, component);
    //    }
    //    else {
    //        HDebug.Error("alert show " + prefabStr + " is error!!!");
    //    }
    //}
//
    ////添加到队列，并提高位置
    //public alertAddToQueue(obj, component) {
    //    component.endCall = () => {
    //        this.alertList.splice(this.alertList.indexOf(component), 1);
    //        this.CheckAndResetQueue(this.alertList);
    //    };
//
    //    let canvas = cc.find("Canvas");
    //    if (canvas) {
    //        canvas.addChild(obj);
    //    }
//
    //    this.alertList.push(component);
    //    for (
    //        var i = obj.height + 70, n = 0, l = this.alertList.length - 1;
    //        n < l;
    //        n++
    //    )
    //        this.alertList[n] &&
    //            this.alertList[n].node &&
    //            (this.alertList[n].node.y += i);
    //}
//
    //public alertAdd(obj, component) {
    //    cc.director
    //        .getScene()
    //        .getChildByName("Canvas")
    //        .addChild(obj);
    //}
//
    //public SetCanResetQueue() {
    //    this.canResetQueue = true;
    //}
    ////检查队列里是否可以重置
    //public CheckAndResetQueue(alertList) {
    //    if (null != alertList && null != alertList.length) {
    //        if (alertList.length > 0 || !this.canResetQueue) return;
    //    }
    //    else {
    //        return;
    //    }
    //    AllCommon.GetInitializer().timeProxy.SetCanPlayMessage();
    //    AllCommon.GetInitializer().timeProxy.CheckAndShowMessage();
    //    this.canResetQueue = false;
    //}
}