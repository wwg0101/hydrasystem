import UIAlterableItem from "../UISuperLayout/UIAlterableItem";
import { MultiItemLine } from "./MultiItemLine";
import RenderListItemAlert from "../../app/component/RenderListItemAlter";

const { ccclass, property } = cc._decorator;
export enum MultiItemType {
    Tilte, //标题
    //TitleWithData, //带数据的标题
    ListItem,  //普通行
    LineListItem,  //一行有多列
}
export class MultiItemListData {
    public type: MultiItemType;
    public prefabIndex: number = 0;
    public data: any = null;
    constructor(type: MultiItemType, index: number, data: any) {
        this.type = type;
        this.prefabIndex = index;
        this.data = data;
    }
    public GetType(): MultiItemType {
        return this.type;
    }
    public CastTo<T extends MultiItemListData>(): T {
        return <T><any>this;
    }
    public GetHeight() {
        return 65;
    }
    public GetWidth() {
        return 100;
    }
}
//标题
export class TitleData extends MultiItemListData {
    constructor(index: number, data: any) {
        super(MultiItemType.Tilte, index, data);
        this.prefabIndex = index;
    }
    public GetHeight() {
        return 65;
    }
}
//数据
export class ListData extends MultiItemListData {
    constructor(index: number, data: any) {
        super(MultiItemType.ListItem, index, data);
        this.prefabIndex = index;
    }
}
//多个
export class LineListData extends MultiItemListData {
    constructor(index: number, data: any) {
        super(MultiItemType.LineListItem, index, data);
        this.prefabIndex = index;
    }
    public GetHeight() {
        return 500;
    }
}

@ccclass
export class MultiItemList extends UIAlterableItem {
    @property(cc.Prefab)
    listPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    listNodes: cc.Node[] = [];

    private actualItem: cc.Node = null;
    private curPrefabIndex = -1;
    private nodeDic: Map<number, cc.Node> = new Map<number, cc.Node>();
    public show() {
        this.node.active = true;
        let data = <MultiItemListData>this.getData();
        let index = data.prefabIndex;
        if (index != this.curPrefabIndex) {
            if (null != this.actualItem) {
                this.actualItem.active = false;
            }
            this.actualItem = this.getNode(index);
            this.actualItem.parent = this.node;
            this.actualItem.active = true;
            this.curPrefabIndex = index;
            this.SetItemHeight(this.actualItem.height);
        }
        if (data.GetType() == MultiItemType.ListItem
            || data.GetType() == MultiItemType.Tilte) {
            let item: any = this.actualItem.getComponent(RenderListItemAlert);
            if (item != null) {
                item.data = data.data;
            }
        }
        else if (data.GetType() == MultiItemType.LineListItem) {
            let item = this.actualItem.getComponent(MultiItemLine);
            item.Show(data);
        }
    }

    public getActualItem(): cc.Node {
        return this.actualItem;
    }

    public getNode(prefabIndex: number): cc.Node {
        let node = this.nodeDic.get(prefabIndex);
        if (null != node) {
            return node;
        }
        else {
            if (this.listPrefabs.length > 0) {
                node = cc.instantiate(this.listPrefabs[prefabIndex]);
            }
            else {
                node = cc.instantiate(this.listNodes[prefabIndex]);
            }
            this.nodeDic.set(prefabIndex, node);
            return node;
        }
    }
}