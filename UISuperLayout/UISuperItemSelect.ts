// 增加选中效果的UISuperItem

import UISuperItem from "./UISuperItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UISuperItemSelect extends UISuperItem {
    @property(cc.Node)
    selectNode = null;

    public show() {
        let realIndex = this.getRealIndex();
        this.setUnSelect();
        if (realIndex == this.layout.getSelectIndex()) {
            this.setSelected();
        }
    }

    public setSelected() {
        if (this.selectNode) {
            this.selectNode.active = true;
        }
    }

    public setUnSelect() {
        if (this.selectNode) {
            this.selectNode.active = false;
        }
    }
}