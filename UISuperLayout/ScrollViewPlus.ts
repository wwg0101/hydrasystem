import ScrollViewPlusItem from "./ScrollViewPlusItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewPlus extends cc.ScrollView {
    // 是否计算在可视区域中Item的相对位置（可能会相对耗性能）"
    protected _caculatePosition: boolean = false;
    private needOpDC: boolean = false;

    onEnable() {
        super.onEnable();
        this.node.on("scrolling", this._onScrollingDrawCallOpt, this);
    }

    onDisable() {
        super.onDisable();
        this.node.off("scrolling", this._onScrollingDrawCallOpt, this);
    }

    onDestroy() {
        this.node.off("scrolling", this._onScrollingDrawCallOpt, this);
    }

    private _onScrollingDrawCallOpt() {
        if (this.content.childrenCount == 0) {
            return;
        }
        this.optDc();
    }

    lateUpdate() {
        if (this.needOpDC) {
            this.actualOptDC();
        }
    }

    public optDc() {
        this.needOpDC = true;
    }

    private actualOptDC() {
        ScrollViewPlus.optDc(this, this._caculatePosition);
        this.needOpDC = false;
    }

    /**
     * 优化 ScrollView Content 节点 DC，可以手动调用
     */
    public static optDc(scrollView: cc.ScrollView, caculatePosition: boolean) {
        // 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
        let svNode = scrollView.node;
        let svNodeParent = svNode.parent;
        let scrollSize = cc.v2(svNode.width * svNode.scaleX
            , svNode.height * svNode.scaleY);

        let svLeftBottomPoint: cc.Vec2 = svNodeParent.convertToWorldSpaceAR(
            cc.v2(
                svNode.x - svNode.anchorX * scrollSize.x,
                svNode.y - svNode.anchorY * scrollSize.y
            )
        );

        let svRightTopPoint: cc.Vec2 = svNodeParent.convertToWorldSpaceAR(
            cc.v2(
                svNode.x + (1 - svNode.anchorX) * scrollSize.x,
                svNode.y + (1 - svNode.anchorY) * scrollSize.y
            )
        );

        // 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
        let svBBoxRect: cc.Rect = cc.rect(svLeftBottomPoint.x, svLeftBottomPoint.y,
            Math.abs(svRightTopPoint.x - svLeftBottomPoint.x),
            Math.abs(svRightTopPoint.y - svLeftBottomPoint.y),
        );
        scrollView.content.children.forEach((childNode: cc.Node) => {
            let itemComponent = childNode.getComponent(ScrollViewPlusItem);
            if (itemComponent == null) {
                return;
            }

            let childNodeSize = cc.v2(childNode.width * childNode.scaleX, childNode.height * childNode.scaleY);
            let childLeftBotPoint = cc.v2(
                childNode.x - childNode.anchorX * childNodeSize.x,
                childNode.y - childNode.anchorY * childNodeSize.y
            );
            let childRightTopPoint = cc.v2(
                childNode.x + (1 - childNode.anchorX) * childNodeSize.x,
                childNode.y + (1 - childNode.anchorX) * childNodeSize.y
            );
            let childNodeParent = childNode.parent;
            let childLeftBotPointWorldPoint = childNodeParent.convertToWorldSpaceAR(childLeftBotPoint);
            let childRightTopPointWorldPoint = childNodeParent.convertToWorldSpaceAR(childRightTopPoint);
            let childNodeBBox: cc.Rect = cc.rect(childLeftBotPointWorldPoint.x, childLeftBotPointWorldPoint.y,
                Math.abs(childRightTopPointWorldPoint.x - childLeftBotPointWorldPoint.x),
                Math.abs(childRightTopPointWorldPoint.y - childLeftBotPointWorldPoint.y)
            );

            // 如果相交了，那么就显示，否则就隐藏
            if (childNodeBBox.intersects(svBBoxRect)) {
                // if (!itemComponent.isShowing) {
                // itemComponent.isShowing = true;
                itemComponent.publishOnEnterScrollView();
                // }
                if (caculatePosition) {
                    if (itemComponent.isShowing) {
                        itemComponent.publishOnPositionChange(
                            (childNodeBBox.x - (svBBoxRect.x - childNodeBBox.width / 2)) / (childNodeBBox.width + svBBoxRect.width),
                            (childNodeBBox.y - (svBBoxRect.y - childNodeBBox.height / 2)) / (childNodeBBox.height + svBBoxRect.height)
                        );
                    }
                }
            }
            else {
                // if (itemComponent.isShowing) {
                // itemComponent.isShowing = false;
                itemComponent.publishOnExitScrollView();
                // }
            }
        });
    }
}
