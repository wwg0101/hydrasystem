import { List } from "./HydraComponents/HydraList";
import { Singleton } from "./HydraComponents/HydraSingleton";
import { ConfigFinder } from "./HydraConfigFinder";

// 多语言枚举，对应language的字段名
export enum LanguageType {
    zh = "zh", // 中文
    tw = "tw", // 繁体
    sm = "sm"  //新马简体
}

class LanguageCfg {
    id: number;
    zh: string;
    tw: string;
}

// 多语言文件的范围
export default class LanguageManager extends Singleton<LanguageManager> {
    private curLanguage: LanguageType = LanguageType.zh; // 当前的语言
    public static Instance(): LanguageManager {
        return this.GetInstance(LanguageManager);
    }

    protected Init() {
        let localLan: string = cc.sys.localStorage.getItem('LanguageType');
        if (localLan != null) {
            this.curLanguage = LanguageType[localLan];
        }
    }

    //加载完所有表格后调用
    public static handleTable(allRawTable) {
        LanguageManager.Instance().handleRawTable(allRawTable);
        //检查工具 测试时替换上面的函数
        //LanguageManager.Instance().handleRawTableTest(allRawTable);   
    }

    private isLanguageTable(tableName: string) {
        let reg = new RegExp("^(language)[0-9]+$");
        return reg.test(tableName);
    }

    private handleRawTable(allRawTable: Map<string, Array<unknown>>) {
        //1.遍历所有的表格
        //2.根据标识修正表名以及多语言内容
        allRawTable.forEach((rawTable, tableName) => {
            //性能优化，以第一行为表的原型
            //if(tableName == "vipReward"
            //    || tableName == "vip"
            //    || tableName == "name_color") {
            //    return;
            //}

            if (rawTable.length > 0 && !this.isLanguageTable(tableName)) {
                let allCfgKey = Object.keys(rawTable[0]);
                let allKeyType: List<number> = new List();
                let allKeyToHandle: List<string> = new List();
                let allKeyToReplace: List<string> = new List();
                for (let i = 0; i < allCfgKey.length; ++i) {
                    let split = allCfgKey[i].split('_');
                    if (split.length >= 2) {
                        if (split[0] == "lg") {
                            allKeyType.Add(0);
                            allKeyToHandle.Add(allCfgKey[i]);
                            allKeyToReplace.Add(allCfgKey[i].substring(3));
                        }
                        else if (split[0] == "lga") {
                            allKeyType.Add(1);
                            allKeyToHandle.Add(allCfgKey[i]);
                            allKeyToReplace.Add(allCfgKey[i].substring(4));
                        }
                    }
                }
                for (let i = 0; i < rawTable.length; ++i) {
                    let singleCfg = rawTable[i];
                    for (let j = 0; j < allKeyToHandle.length; ++j) {
                        let id: any = singleCfg[allKeyToHandle[j]];
                        if (allKeyType[j] == 0) {
                            if (id && !isNaN(id)) {
                                let numID = Number.parseInt(id);
                                Object.defineProperty(singleCfg, allKeyToReplace[j], {
                                    get() { return LanguageManager.Instance().getLanguageById(numID); }
                                });
                            }
                            else {
                                singleCfg[allKeyToReplace[j]] = "";
                            }
                        }
                        else {
                            if (id && id.length > 0 && !isNaN(id[0])) {
                                let numID = Number.parseInt(id[0]);
                                Object.defineProperty(singleCfg, allKeyToReplace[j], {
                                    get() {
                                        let aryStr = LanguageManager.Instance().getLanguageById(numID);
                                        return JSON.parse(aryStr.toString());
                                    }
                                });
                            }
                            else {
                                singleCfg[allKeyToReplace[j]] = [];
                            }
                        }
                    }
                }
            }
        });
    }

    // 首次安装初始化手机语言
    public initSysLanguage() {
        let saveValue = cc.sys.localStorage.getItem('LanguageType');
        if (saveValue == null || saveValue == "") {
            let sysLang = LanguageType.sm;
            let code = cc.sys.languageCode;
            if (code.indexOf("hant") != -1) {
                sysLang = LanguageType.tw;
            }
            if (code.indexOf("hans") != -1) {
                sysLang = LanguageType.sm;
            }
            if ((code.indexOf("zh-hk") != -1) ||
                (code.indexOf("zh_hk") != -1) ||
                (code.indexOf("zh-tw") != -1) ||
                (code.indexOf("zh_tw") != -1) ||
                (code.indexOf("zh-mo") != -1) ||
                (code.indexOf("zh_mo") != -1)) {
                sysLang = LanguageType.tw;
            }
            console.log("--LanguageManager-=-", cc.sys.language, cc.sys.languageCode, sysLang);

            this.setLanguage(sysLang);
        }
    }

    // 设置当前的多语言，返回值表示是否切换成功
    public setLanguage(language: LanguageType): boolean {
        if (this.curLanguage != language) {
            this.curLanguage = language;
            cc.sys.localStorage.setItem('LanguageType', this.curLanguage);
            return true;
        }
        return false;
    }

    // 获取当前的多语言
    public getLanguage(): LanguageType {
        return this.curLanguage;
    }

    // 根据id获取多语言
    private getLanguageById(id: number) {
        let dbName = "language" + Math.floor(id / 100000000);
        let lanData = ConfigFinder.Find<LanguageCfg>(dbName, id.toString());
        if (lanData == null) {
            console.error("err " + id + " " + dbName);
            return id;
        }
        else {
            return lanData[this.curLanguage];
        }
    }


    //以下是测试代码
    /*private handleRawTableTest(allRawTable : Map<string, Array<unknown>>) {
        //1.遍历所有的表格
        //2.根据标识修正表名以及多语言内容
        allRawTable.forEach((rawTable, tableName) => {
            //性能优化，以第一行为表的原型
            if(rawTable.length > 0 && !this.isLanguageTable(tableName)) {
                let allCfgKey = Object.keys(rawTable[0]);
                let allKeyType :List<number> = new List();
                let allKeyToHandle : List<string> = new List();
                let allKeyToReplace : List<string> = new List();
                for(let i = 0; i < allCfgKey.length; ++i) {
                    let split = allCfgKey[i].split('_');
                    if(split.length >= 2) {
                        if(split[0] == "lg") {
                            allKeyType.Add(0);
                            allKeyToHandle.Add(allCfgKey[i]);
                            allKeyToReplace.Add(allCfgKey[i].substring(3));
                        }
                        else if(split[0] == "lga") {
                            allKeyType.Add(1);
                            allKeyToHandle.Add(allCfgKey[i]);
                            allKeyToReplace.Add(allCfgKey[i].substring(4));
                        }
                        else {
                            for(let k = 0; k < rawTable.length; ++k) {
                                if(this.checkHeader(rawTable[k][allCfgKey[i]]) || this.hasChinese(rawTable[k][allCfgKey[i]])) {
                                    console.error("疑似翻译错误表，表名:" + tableName + " 列名:" + allCfgKey[i] + " 内容:" + rawTable[k][allCfgKey[i]]);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        for(let k = 0; k < rawTable.length; ++k) {
                            if(this.checkHeader(rawTable[k][allCfgKey[i]]) || this.hasChinese(rawTable[k][allCfgKey[i]])) {
                                console.error("疑似翻译错误表，表名:" + tableName + " 列名:" + allCfgKey[i] + " 内容:" + rawTable[k][allCfgKey[i]]);
                                break;
                            }
                        }
                    }
                }
                for(let i = 0; i < rawTable.length; ++i) {
                    let singleCfg = rawTable[i];
                    for(let j = 0; j < allKeyToHandle.length; ++j) {
                        let id :any = singleCfg[allKeyToHandle[j]];
                        if(allKeyType[j] == 0) {
                            if(id) {
                                let numID = Number.parseInt(id);
                                if(!this.checkHeader(numID) || this.hasChinese(id)) {
                                    console.error("id错误:" + tableName + " 列名:" + allKeyToHandle[j] + " 内容:" + id);
                                }
                                else {
                                    let testStr = LanguageManager.Instance().getLanguageByIdTest(tableName, numID);
                                    if(testStr[0] == "[" && testStr[testStr.length - 1] == "]") {
                                        console.error("表头错误，应为lga_ " + numID + " " + tableName + " " + testStr);
                                    }
                                }
                                Object.defineProperty(singleCfg, allKeyToReplace[j], {
                                    get() { return LanguageManager.Instance().getLanguageById(numID); }
                                });
                            }
                            else {
                                singleCfg[allKeyToReplace[j]] = "";
                            }
                        }
                        else {
                            if(id && id.length > 0) {
                                let numID = Number.parseInt(id[0]);
                                if(!this.checkHeader(numID) || this.hasChinese(id[0])) {
                                    console.error("id错误:" + tableName + " 列名:" + allKeyToHandle[j] + " 内容:" + id);
                                }
                                else {
                                    let testStr = LanguageManager.Instance().getLanguageByIdTest(tableName, numID);
                                    if((testStr[0] != "[" || testStr[testStr.length - 1] != "]") && testStr != "") {
                                        console.error("表头错误，应为lgb_ " + numID + " " + tableName + " " + testStr);
                                    }
                                }
                                Object.defineProperty(singleCfg, allKeyToReplace[j], {
                                    get() { 
                                        let aryStr = LanguageManager.Instance().getLanguageById(numID); 
                                        return JSON.parse(aryStr.toString());
                                    }
                                });
                            }
                            else {
                                singleCfg[allKeyToReplace[j]] = [];
                            }
                        }
                    }
                } 
            }
        });
    }

    private getLanguageByIdTest(initDBName : string, id: number) {
        if(isNaN(id)) {
            console.error("id 错误！！！！ " + id + " " + initDBName);
            return id;
        }
        let dbName = "language" + Math.floor(id / 100000000);
        let lanData = ConfigFinder.Find(dbName, id.toString());
        if(lanData == null) {
            console.error("找不到对应的翻译 " + id + " " + initDBName + " " + dbName);
            return id;
        }
        else {
            return lanData[this.curLanguage];
        }
    }

    public hasChinese(str: string): boolean {
        let reg = new RegExp("^[\u4e00-\u9fa5]+$");
        let contains = false;
        if (str != null) {
            let length = str.length;
            for (let index = 0; index < length; ++index) {
                let nameChar = str[index];
                if (reg.test(nameChar)) {
                    contains = true;
                    break;
                }
            }
            return contains;
        }
        else {
            return false;
        }
    }

    //检查表时使用，注意随版本更新修改数量
    private languageIDLimit : number = 16;
    private checkHeader(id : number) {
        let testID = Math.floor(id / 100000000);;
        return testID > 0 && testID <= this.languageIDLimit;
    }*/
}