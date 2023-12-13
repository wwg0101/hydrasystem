
const { ccclass } = cc._decorator;
@ccclass
//常驻节点
export class InstanceNode extends cc.Component {
    onLoad() {
        let curScene = cc.director.getScene();
        // console.assert(curScene != null, "场景还未加载！");
        this.node.parent = curScene;
        cc.game.addPersistRootNode(this.node);
    }
}