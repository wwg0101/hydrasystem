declare let require;
const { ccclass, property } = cc._decorator;
const init = require("../../app/Initializer");

@ccclass
export default class ServantClotheProxyAdaptor {

    constructor() {
    }

    ctor() {

    }

    clearData(isInit: boolean = false) {

    }

    sendExchangeShopBuy(id: number) {
        init.servantClotheProxy.sendExchangeShopBuy(id);
    }

    getClotheByHeroId(heroID: number, clotheID: number): any {
        return init.servantClotheProxy.getClotheByHeroId(heroID, clotheID);
    }

    getClotheMaxLvById(clotheID): number{
        return init.servantClotheProxy.getClotheMaxLvById(clotheID);
    }

    getClotheLvInfo(clotheID: number, lv: number): any {
        return init.servantClotheProxy.getClotheLvInfo(clotheID, lv);
    }

    getHeroClotheSkillInfoById(skillID: number): any {
        return init.servantClotheProxy.getHeroClotheSkillInfoById(skillID);
    }
}