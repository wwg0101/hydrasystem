const { ccclass, property } = cc._decorator;
@ccclass
export default class ScrollViewPlusItem extends cc.Component {
    // 当前是否在展示中
    public isShowing: boolean = false;

    /**
     * Item 进入 ScrollView 的时候回调
     */
    public publishOnEnterScrollView() {
        this.node.opacity = 255;
        // this.node.active = true;
    }

    /**
     * Item 离开 ScrollView 的时候回调
     */
    public publishOnExitScrollView() {
        this.node.opacity = 0;
        // this.node.active = false;
    }

    /**
     * Item 进入 ScrollView 后，位置发生移动时回调，离开ScrollView后不会回调
     *
     * @param xOffsetPercent 相对于 ScrollView 可视区域中心点，X的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最左边，1：为可视区域最右边
     * @param yOffsetPercent 相对于 ScrollView 可视区域中心点，Y的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最下边，1：为可视区域最上边
     */
    publishOnPositionChange(xOffsetPercent: number, yOffsetPercent: number) {
    }
}