import HDebug from "./HDebug";
import { List } from "./HydraComponents/HydraList";
import { Singleton } from "./HydraComponents/HydraSingleton";
export enum TouchEnum {
    WaitingMask,
    Lock,
    Guide
}

export class TouchManager extends Singleton<TouchManager>{
    public static getInstance() {
        return TouchManager.GetInstance(TouchManager);
    }
    private btn: cc.Button = null;

    protected m_curTouchOp: List<TouchEnum> = new List<TouchEnum>();
    public LockTouch(touchEnum: TouchEnum) {
        if (!this.m_curTouchOp.Contains(touchEnum)) {
            this.m_curTouchOp.Add(touchEnum);
        } else {
            HDebug.Error("[TouchManager]有重複屏蔽touch參數" + TouchEnum[touchEnum]);
        }

        this.refresh();
    }

    public UnlockTouch(touchEnum: TouchEnum) {
        if (this.m_curTouchOp.Contains(touchEnum)) {
            this.m_curTouchOp.Remove(touchEnum);
        } else {
            HDebug.Log("[TouchManager]沒有對應參數！！！" + TouchEnum[touchEnum]);
        }

        this.refresh();
    }

    private refresh() {
        if (this.m_curTouchOp.length > 0) {
            //@ts-ignore
            if (null != this.btn) this.btn._pressed = false;
        }
    }

    public Register(btn: cc.Button) {
        this.btn = btn;
    }
}
