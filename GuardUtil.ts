export class GuardUtil {
    //e.g.
    //SafeReturn(data, "a.b.c.d");
    public static SafeReturn(data: any, path: string): any {
        if(null == data){
            return null;
        }
        let allKeys: string[] = path.split(".");
        let curData = data;
        for (let i = 0; i < allKeys.length; ++i) {
            curData = curData[allKeys[i]];
            if (curData == null) {
                return null;
            }
        }
        return curData;
    }
}