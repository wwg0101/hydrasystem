const RenderListItem = require("../../app/component/RenderListItem");
import { List } from "../HydraComponents/HydraList";
import { LineListData } from "./MultiItemList";

const { ccclass, property } = cc._decorator;
@ccclass
export class MultiItemLine extends cc.Component {
    @property(cc.Prefab)
    singleItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    singleItemNode: cc.Node = null;

    private allItems: List<cc.Node> = new List<cc.Node>();
    public Show(data: LineListData) {
        this.node.x = 0;
        this.node.y = 0;

        for (let i = this.allItems.length; i < data.data.length; ++i) {
            let node: cc.Node;
            if (this.singleItemPrefab != null) {
                node = cc.instantiate(this.singleItemPrefab);
            }
            else {
                node = cc.instantiate(this.singleItemNode);
            }
            this.allItems.push(node);
            this.allItems[i].parent = this.node;
        }

        for (let i = 0; i < this.allItems.length; ++i) {
            if (i < data.data.length) {
                this.allItems[i].active = true;
                let item: any = this.allItems[i].getComponent(RenderListItem);
                item.data = data.data[i];
                item.showData();
            }
            else {
                this.allItems[i].active = false;
            }
        }
    }

    public getRenderByDataKey(key, value) {
        for (let i = 0; i < this.allItems.length; i++) {
            let child = this.allItems[i];
            if (child) {
                let comp: any = child.getComponent(RenderListItem);
                if (comp) {
                    let v = comp.getDataValue(key);
                    if (this.isObjEqual(v, value)) {
                        return comp;
                    }
                }
            }
        }
    }

    /**
     * 判断两个简单的obj对象是否相等 基本数据类型也行
     * @param x 
     * @param y 
     */
    private isObjEqual(x, y) {
        var f1 = x instanceof Object;
        var f2 = y instanceof Object;
        if (!f1 || !f2) {
            return x === y;
        }
        if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
        }
        for (var p in x) {
            var a = x[p] instanceof Object;
            var b = y[p] instanceof Object;
            if (a && b) {
                this.isObjEqual(x[p], y[p]);
            } else if (x[p] != y[p]) {
                return false;
            }
        }
        return true;
    }
}