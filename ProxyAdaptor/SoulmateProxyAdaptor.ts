import { wifeClotheInfo } from "../AppConstants";

declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class SoulmateProxyAdaptor {

    ctor() {
    }

    constructor() {
    }

    clearData(isInit: boolean = false) {
    }

    public getWifeData(wifeID: number): any {
        return init.soulmateProxy.getWifeData(wifeID);
    }

    public getWifeName(wifeID: number): any {
        return init.soulmateProxy.getWifeName(wifeID);
    }

    public getAllClotheData() {
        return init.soulmateProxy.getClotheData();
    }

    public getClotheData(clotheID: number): wifeClotheInfo {
        let allClotheData: wifeClotheInfo[] = init.soulmateProxy.getClotheData().list;
        for(let i = 0; i < allClotheData.length; ++i) {
            let clotheData = allClotheData[i];
            if(clotheData.clothes_id == clotheID) {
                return clotheData;
            }
        }
        return null;
    }

    public sendClotheList(wifeID: number) {
        init.soulmateProxy.sendClothList(wifeID);
    }
   
}