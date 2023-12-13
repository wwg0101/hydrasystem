import BasePanel from "./BasePanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActivityPreloadPanel extends BasePanel {

    /**
     * 加载展示节点
     * @returns 
     */
    protected getLoadingNode(): cc.Node {
        return null;
    }

    protected getDisplayNode(): cc.Node {
        let loadingNode = this.getLoadingNode()
        return loadingNode ? loadingNode : this.node;
    }

}