import GlobalConfig from "../../scripts/app/GlobalConfig";
import { AlertUtils } from "./AlertUtils";

export default class HDebug {
    public static Assert(condition: boolean, desc) {
        // console.assert(condition, "[HAssert]" + desc);
        if (!condition) {
            HDebug.ShowMsg(desc);
        }
    }

    public static Error(desc, ...param) {
        cc.error("[HError]" + desc, ...param);
        HDebug.ShowMsg(desc);
    }
    
    public static Log(desc, ...param) {
        cc.log("[HLog]" + desc, ...param);
    }

    public static Warning(desc) {
        cc.warn("[HWarning]", desc);
        HDebug.ShowMsg(desc);
    }

    public static TODO(desc?) {
        cc.warn("[HTODO]", desc);
        HDebug.ShowMsg("[TODO] " + desc);
    }

    private static ShowMsg(desc) {
        if (GlobalConfig.DEBUG) {
            // AlertUtils.Instance().alert(desc);
        }
    }
}