// height变长的UISuperItem
import { TimerManager } from "../TimerManager";
import UISuperItem from "./UISuperItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIAlterableItem extends UISuperItem {
    private lastResizeTimer = -1;
    public SetItemHeight(height: number) {
        if (this.lastResizeTimer > 0) {
            TimerManager.Instance().RemoveTimer(this.lastResizeTimer);
        }
        if (this.isScrollDown) {
            //this.node.width = this.actualItem.width;
            this.node.height = height;
            this.layout.optScrollViewDC();
        }
        else {
            this.lastResizeTimer = TimerManager.Instance().AddTimer(0, () => {
                this.lastResizeTimer = 0;
                //this.node.width = this.actualItem.width;
                this.node.height = height;
                this.layout.optScrollViewDC();
            });
        }
    }

    public onDestroy() {
        super.onDestroy();
        if (this.lastResizeTimer > 0) {
            TimerManager.Instance().RemoveTimer(this.lastResizeTimer);
            this.lastResizeTimer = 0;
        }
    }
}