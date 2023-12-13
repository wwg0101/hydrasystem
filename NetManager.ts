import GlobalConfig from "../../scripts/app/GlobalConfig";
import { LockManagerBase } from "./MaskManager";
import { GuardUtil } from "./GuardUtil";
import HDebug from "./HDebug";
import { PanelType } from "./PanelConfig";

declare let require, JsonHttp;

enum HallRequestType {
    POST = 1,
    GET = 2,
    POSTPROTO = 3,
}

export enum HttpOp {
    NetHttp,
}

export default class NetManager extends LockManagerBase<HttpOp> {
    private numberReg = /^\d+$/;
    private s_dicRegistedProto = {};
    private netSeqID: number = 0;

    public static getInstance(): NetManager {
        return this.GetInstance(NetManager);
    }

    protected Init() {
        super.Init();
        this.netSeqID = 0;
        this.maskPanelType = PanelType.WaitingHttpView;
    }

    /**
     * 注册协议监听
     * @param protoKey 
     * @param handler 
     * @param target 
     */
    public subscribe(protoKey, handler, target) {
        
        JsonHttp.subscribe(protoKey, handler, target);
        //let keyArr = protoKey.key.split(".");
        //let model = keyArr[1];
        //let funcType = keyArr[2];
        //let registKey = model + "_" + funcType;
        //if (null != model && null != funcType) {
        //    if (null != this.s_dicRegistedProto[registKey]) {
        //        HDebug.Error("protoKey: " + protoKey.key + " has registed");
        //    }
        //    this.s_dicRegistedProto[registKey] = {
        //        mod: model,
        //        type: funcType,
        //        handler: handler,
        //        target: target
        //    }
        //}
        //else {
        //    HDebug.Error("proto class is error!!!" + protoKey.key);
        //}
    }

    /**
     * 反注册某个协议的监听
     * @param protoKey 
     */
    public remove(protoKey) {
        JsonHttp.removeSubscribe(protoKey);
        //let protoArr = protoKey.key.split(".");
        //let model = protoArr[1];
        //let funcType = protoArr[2];
        //let registKey = model + "_" + funcType;
        //if (model != null && funcType != null) {
        //    if (this.s_dicRegistedProto[registKey]) {
        //        this.s_dicRegistedProto[registKey] = null;
        //        delete this.s_dicRegistedProto[registKey];
        //    };
        //} else {
        //    HDebug.Error("proto class is error!!!" + protoKey.key);
        //}
    }

    /**
     * 清楚所有协议监听
     */
    public removeAllRegister() {
        this.s_dicRegistedProto = {};
    }

    /**
     * 获取当前网络发包序列号
     */
    public getCurNetSeqID(): number {
        return this.netSeqID;
    }

    /**
     * 从网络回包里解出发包序列号
     * @param data 
     * @returns 
     */
    public getNetSeqIDInResp(data): number {
        let seqID = GuardUtil.SafeReturn(data, "a.system.seqid.seqid");
        return seqID;
    }

    //字符串解析出协议名
    private getProtoStrFromJson(protoJson: string): string {
        let result = "";
        let index = protoJson.indexOf("\"");
        let tempstr = protoJson.substring(index+1);
        index = tempstr.indexOf("\"");
        result += tempstr.substring(0,index) + ".";
        tempstr = tempstr.substring(index+1);
        index = tempstr.indexOf("\"");
        tempstr = tempstr.substring(index+1);
        index = tempstr.indexOf("\"");
        result += tempstr.substring(0,index);
        return result;
    }

    /**
     * 游戏内通用协议post
     * @param proto 
     * @param callback 
     * @param timeOutCall 超时回调
     * @param needLock 是否遮罩
     */
    public postProto(proto: any, callback?: Function, timeOutCall?: Function, needLock: boolean = true, timeout: number = 5000, requestTimes: number = 2) {
        let sucCall = (responseArr) => {
            if (callback) {
                callback(responseArr);
            }
        };
        JsonHttp.send(proto, sucCall);
        //let url = this.getGameUrl();
        //if (proto == undefined || null == proto) {
        //    proto = { seqID: this.netSeqID };
        //}
        //let data = proto.getJsonWithSeqID(this.netSeqID);
        //// 是否心跳 
        //let isAdok = false;
        //let adokIndex = data.indexOf("adok");
        //if (adokIndex != -1) {
        //    isAdok = true;
        //}
        //let sucCall = (responseArr) => {
        //    if (callback) {
        //        callback(responseArr);p
        //    }
        //    if(!isAdok && !cc.sys.isNative) {
        //        let rwd = GuardUtil.SafeReturn(responseArr, "a.msgwin.items");
        //        if(rwd) {
        //            let protostr = this.getProtoStrFromJson(data);
        //            //ProxyManager.getInstance().gmProxy.setNetItemRwd(protostr, rwd);
        //        }
        //    }
        //};
        //let temp_timeOutCall = () => {
        //    if (timeOutCall) {
        //        timeOutCall();
        //    }
        //};
//
        //let lockFlag = (!isAdok && needLock);
        //this.post(url, data, sucCall, lockFlag, temp_timeOutCall, true, timeout, requestTimes);
        //this.netSeqID++;
    }

    /**
     * post
     * @param url 
     * @param data 
     * @param callback 
     * @param lockFlag 
     * @param timeOutCall 
     */
    public post(url: string, data?: any, callback?: Function, lockFlag: boolean = false, timeOutCall?: Function, isProto: boolean = false, timeout: number = 5000, requestTimes: number = 2) {
        if (data == undefined) {
            data = "";
        }
        let hallRequestType = isProto ? HallRequestType.POSTPROTO : HallRequestType.POST;
        this.request(hallRequestType, url, data, callback, lockFlag, timeOutCall, timeout, requestTimes);
    }

    /**
     * get
     * @param url 
     * @param param 
     * @param callback 
     * @param timeOutCall 
     */
    public get(url: string, param: any = null, callback: Function, timeOutCall?: Function) {
        url = this.createUrl(url, param);
        this.request(HallRequestType.GET, url, {}, callback, false, timeOutCall);
    }

    /**
     * 拼接url接口
     * @param url 
     * @param param 
     * @returns 
     */
    public createUrl(url: string, param: any = null): string {
        if (param) {
            let paramStr = "";
            for (let key in param) {
                paramStr += this.urlFormat("&{0}={1}", key, param[key]);
            }
            url += "?" + paramStr.substr(1);
        }
        return url;
    }

    private dealSub(jsonData) {
        for (let dataType in jsonData) {
            let data = jsonData[dataType];
            data && this.dealItem(data);
        }
    }

    private dealItem(data) {
        for (let model in data) {
            for (let funcType in data[model]) {
                let dataObj = this.dealNumber(data[model][funcType]);
                let registKey = model + "_" + funcType;
                let callback = this.s_dicRegistedProto[registKey];
                if (null != callback) {
                    callback.handler.apply(callback.target, [dataObj]);
                }
            }
        }
    }

    private dealNumber(data) {
        for (let dataKey in data) {
            let subData = data[dataKey];
            let dataType = typeof subData;
            if (null != subData && "number" != dataType) {
                if ("object" == dataType) {
                    data[dataKey] = this.dealNumber(subData)
                }
                else if ("string" == dataType && null != dataType && subData.length < 11
                    && this.numberReg.test(subData)) {
                    data[dataKey] = parseInt(subData)
                }
            }
        }
        return data;
    }

    /**
     * http 请求
     * @param requestType HallRequestType
     * @param url 目标地址
     * @data data 参数
     * @param sucCall 成功数据回调
     * @param lockFlag 加遮罩
     * @param timeOutCall 超时回调
     * @param timeout 超时
     * @param requestTimes 重复请求次数
     */
    private request(requestType: HallRequestType, url: string, data: any, sucCall?: Function, lockFlag: boolean = false, timeOutCall?: Function, timeout: number = 5000, requestTimes: number = 2) {
        if (lockFlag) {
            this.Lock(HttpOp.NetHttp);
        }

        let xhr = new XMLHttpRequest();
        // 响应回调
        xhr.onloadend = () => {
            if (lockFlag) {
                this.Unlock(HttpOp.NetHttp);
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                let response = xhr.responseText;
                if (("string" == typeof response) && (response != "")) {
                    if (GlobalConfig.printNet) {
                        console.log("XMLHttpRequest responseArr:", response);
                    }
                    let responseArr = JSON.parse(response);
                    // 处理监听的协议
                    if (HallRequestType.POSTPROTO == requestType) {
                        this.dealSub(responseArr);
                    }
                    if (sucCall) {
                        sucCall(responseArr);
                    }
                }
                else {
                    HDebug.Error("response not a string or empty", response);
                }
            }
            else {
                console.log("XMLHttpRequest error:", xhr.status);
                HDebug.Error(url + " request is error!!!");
            }
        };;

        // 错误
        xhr.onerror = () => {
            if (timeOutCall) {
                timeOutCall();
            }
        };

        // 超时
        xhr.ontimeout = () => {
            // 超时默认再请求一次，还不行就走超时回调
            if (requestTimes <= 0) {
                if (timeOutCall) {
                    timeOutCall();
                }
            }
            else {
                this.request(requestType, url, data, sucCall, lockFlag, timeOutCall, timeout, --requestTimes);
            }
        };

        if (GlobalConfig.printNet) {
            console.log("XMLHttpRequest url:", url);
            console.log("XMLHttpRequest data:", data);
        }
        switch (requestType) {
            case HallRequestType.GET:
                xhr.open("GET", url, true);
                if (cc.sys.isNative) {
                    xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
                }
                break;
            case HallRequestType.POST:
            case HallRequestType.POSTPROTO:
                xhr.open("POST", url, true);
                // xhr.setRequestHeader("Content-Type", "application/json");
                break;
        }

        // method and before calling the send() method.
        // 20秒
        xhr.timeout = timeout;

        if (requestType == HallRequestType.GET) {
            xhr.send();
        } else {
            xhr.send(data);
        }
    }

    // 返回游戏url
    private getGameUrl() {
        // 换成千金的
        return JsonHttp.getUrl();
        /** 
        let urlParam = {
            sevid: GlobalConfig.serverID,
            ver: GlobalConfig.version,
            uid: GlobalConfig.uid,
            token: GlobalConfig.token,
            platform: GlobalConfig.pf,
            lang: GlobalConfig.lang,
            channel: GlobalConfig.channel,
        }
        return this.createUrl(GlobalConfig.httpUrl, urlParam);
        */
    }

    private urlFormat(formatSrt: string, ...args: any[]) {
        if (arguments.length == 0) {
            return null;
        }
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }
}