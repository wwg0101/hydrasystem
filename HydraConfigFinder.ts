import HDebug from "./HDebug";


class localcacheClass {
    getItem: (para: string, id: any) => any
    getGroup: (keyName: string, col_key: string, index: any) => any[]
    getList: (tableName: string) => any[];
}

export class ConfigFinder {
    //查找某个配置
    public static Find<T>(tableName : string, keyValue : any) : T {
        return <T>(<localcacheClass>(<any>window).localcache).getItem(tableName, keyValue);
    }

    private static fastFindCache : Map<string, any[]> = new Map<string, any[]>();
    //快速查找某个配置
    public static FastFind<T>(tableName : string, keyValue : any, helperKey : string, helperValue : any) : T {
        let keyName = (<any>(<any>window).localdb).KEYS[tableName];
        let cacheName = tableName + helperKey + helperValue;
        let group = ConfigFinder.fastFindCache[cacheName];
        if(group == null) {
            group = this.FindGroupWithKey(tableName, helperKey, helperValue);
            ConfigFinder.fastFindCache[cacheName] = group;
        }
        for(let i = 0, len = group.length; i < len; ++i) {
            if (group[i][keyName] == keyValue) {
                return <T>group[i];
            }
        }
        return null;
    }

    public static FindWithKey<T>(tableName : string, keyName : string, keyValue : any) : T {
        let gp = (<localcacheClass>(<any>window).localcache).getGroup(tableName, keyName, keyValue);
        HDebug.Assert(gp.length == 1, "CNM CEHUA");
        if(gp.length > 0) {
            return <T>gp[0];
        }
        return null;
    }

    //获取一整张表
    public static GetConfigs<T>(tableName : string) : T[] {
        return (<localcacheClass>(<any>window).localcache).getList(tableName);
    }

    //以某列为key获取一张子表
    public static FindGroupWithKey<T>(tableName : string, keyName : string, keyValue : any) : T[] {
        return (<localcacheClass>(<any>window).localcache).getGroup(tableName, keyName, keyValue);
    }

    public static Clear() {
        ConfigFinder.fastFindCache.clear();
    }
}