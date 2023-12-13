import ScrollViewPlusItem from './ScrollViewPlusItem';
import UISuperLayout, { UISuperEvent } from './UISuperLayout';

const { ccclass, property } = cc._decorator;
@ccclass
export default class UISuperItem extends ScrollViewPlusItem {
    @property(cc.Node)
    bottomLayerNodeList: cc.Node[] = [];

    @property(cc.Node)
    topLayerNodeList: cc.Node[] = [];

    protected layout: UISuperLayout;
    private brother: cc.Node;
    private originSize: cc.Size;
    private originScale: cc.Vec2;
    protected _data: any;
    protected _index: number = 0;

    private _lastSize: cc.Size = cc.Size.ZERO;
    private _lastScale: cc.Vec2 = cc.Vec2.ZERO;
    private _lastPos: cc.Vec2 = cc.Vec2.ZERO;

    // 当前是否在展示中
    public isShowing: boolean = false;

    onLoad() { }

    onDestroy() {
        // this.layout.node.off(UISuperEvent.ChangeBrother, this.onChangeBrother, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.watchSize, this);
        this.node.off(cc.Node.EventType.SCALE_CHANGED, this.watchSize, this);
        this.node.off(cc.Node.EventType.POSITION_CHANGED, this.onItemChange, this);
        this.unlisten();
        this.destroySonLayer();
    }

    public init(layout: UISuperLayout, bottomLayerContainer: cc.Node[], topLayerContainer: cc.Node[]) {
        // 向node写入一个方法 省去了先获取组件然后调用的步骤
        this.node['watchSelf'] = this.watchSelf.bind(this);
        this.node['saveOriginSize'] = this.saveOriginSize.bind(this);
        let widget = this.node.getComponent(cc.Widget);
        if (widget) {
            cc.log("UISuperItem: item不允许挂cc.Widget组件 请手动移除");
            this.node.removeComponent(widget);
        }

        this.layout = layout;
        bottomLayerContainer = (null != bottomLayerContainer) ? bottomLayerContainer : [];
        topLayerContainer = (null != topLayerContainer) ? topLayerContainer : [];
        this.layout.node.on(UISuperEvent.ChangeBrother, this.onChangeBrother, this);
        this.saveOriginSize();
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.watchSize, this);
        this.node.on(cc.Node.EventType.SCALE_CHANGED, this.watchSize, this);
        this.node.on(cc.Node.EventType.POSITION_CHANGED, this.onItemChange, this);
        this.onChangeBrother();
        this.setSonNodeToLayer(this.SonBottomLayerCount, bottomLayerContainer, this.bottomLayerNodeList, "Bottom ");
        this.setSonNodeToLayer(this.SonTopLayerCount, topLayerContainer, this.topLayerNodeList, "Top ");
        this.InitItem();
    }

    /**
     * 外部调用 初始化
     */
    protected InitItem() { }

    // 外部调用 更新数据
    public updateData(index: number, data: any) {
        this._index = index;
        if (data != undefined) {
            this._data = data;
        }
    }

    /**
     * 外部调用 获取数据data
     */
    public getData() {
        return this._data;
    }

    public getRealIndex(){
        return this._data["realIndex"];
    }

    /**
     * 外部调用 获取数据data 某一个key的值
     */
    public getDataValue(key) {
        if (this._data != undefined) {
            return this._data[key];
        }
    }

    /**
     * 外部调用 获取顺序index
     */
    public getIndex() {
        return this._index;
    }

    /**
     * 外部调用 展示 子类可重写
     */
    public show() {
    }

    //#region public方法

    public saveOriginSize() {
        this.originSize = cc.size(this.width, this.height);
        this.node.setContentSize(this.originSize);
        this.originScale = cc.v2(this.node.scaleX, this.node.scaleY);
    }

    // 设置自己相对于上一个兄弟节点的位置
    // private firstWatch: boolean = false;
    public watchBrother() {
        // this.scheduleOnce(() => {
        this.actualWatch();
        // }, 0);
    }

    private actualWatch() {
        if (!this.brother) {
            return;
        }
        //正序排列时
        if (this.layout.headerToFooter) {
            this.headerToFooterRelativeToFooter(this.brother);
        }
        //倒序排列时
        else {
            this.footerToHeaderRelativeToFooter(this.brother);
        }
    }

    protected isScrollDown: boolean = true;
    // isScrollToFooter=true 向下滑动 
    public watchSelf(isScrollToFooter: boolean) {
        this.isScrollDown = isScrollToFooter;
        if (isScrollToFooter) {
            if (this.layout.headerToFooter) {
                // 从【上到下排序】方向 检查【尾部】是否需要向上填充
                this.headerToFooterWatchFooter();
            } else {
                // 从【下到上排序】方向 检查【头部】是否需要向上填充
                this.footerToHeaderWatchHeader();
            }
        } else {
            if (this.layout.headerToFooter) {
                // 从【上到下排序】方向 检查【头部】是否需要向下填充
                this.headerToFooterWatchHeader();
            } else {
                // 从【下到上排序】方向 检查【尾部】是否需要向下填充
                this.footerToHeaderWatchFooter();
            }
        }
    }

    public get SonBottomLayerCount(): number {
        return this.bottomLayerNodeList.length;
    }

    public get SonTopLayerCount(): number {
        return this.topLayerNodeList.length;
    }
    //#endregion

    //#region 私有方法

    // 根据可视范围 和 一组item的个数 去掉 边距/间隔 来计算本item的真实宽度 
    private get width() {
        if (this.layout.vertical) {
            // 垂直滑动时 固定宽度
            return (this.layout.accommodWidth - this.layout.spacingWidth) / this.layout.column;
        } else {
            // 水平模式时 宽度随意
            return this.node.width * this.layout.getUsedScaleValue(this.node.scaleX);
        }
    }

    // 根据可视范围 和 一组item的个数 去掉 边距/间隔 来计算本item的真实高度 
    private get height() {
        if (this.layout.horizontal) {
            // 水平模式时 固定高度
            return (this.layout.accommodHeight - this.layout.spacingWidth) / this.layout.column;
        } else {
            // 垂直滑动时 高度随意
            return this.node.height * this.layout.getUsedScaleValue(this.node.scaleY);
        }
    }

    /**
     * 当兄弟节点的顺序变化时 来改变自己监听的对象
     * 0,1,2,3,4,5,6,7,8,9 例如列表中共有10个item 0是header 9是footer 
     * 正序排列时 监听的顺序是 9->8->7->6->5->4->3->2->1->0 0的 brother=null 
     * 向下填充的逻辑是 0跑到9后面 0=footer 0的brother=9 相对9的位置设置自己 此时1=header 
     * 向上填充的逻辑是 9跑到0前面 此时9=header 9的brother=null 主动设置自己相对于0前面位置之后 0的brother=9 8=footer
     */
    private onChangeBrother() {
        let _brother = this.layout.getBrotherNode(this.node)
        //如果没有变化 则跳过
        if (_brother && this.brother) {
            if (_brother.uuid == this.brother.uuid) {
                return
            }
        }
        this.unlisten();
        this.brother = _brother;
        this.listen();
        this.watchBrother();
        // this.actualWatch();
    }

    private listen() {
        if (this.brother) {
            this.brother.on('leave', this.unlisten, this);
            this.brother.on(cc.Node.EventType.POSITION_CHANGED, this.watchBrother, this);
        }
    }

    private unlisten() {
        if (this.brother) {
            this.brother.off('leave', this.unlisten, this);
            this.brother.off(cc.Node.EventType.POSITION_CHANGED, this.watchBrother, this);
            this.brother = null;
        }
    }

    private setSonNodeToLayer(sonLayerCount: number, layerContent: cc.Node[], layerNodeList: cc.Node[], errStr: string) {
        let layerCount = layerContent.length;
        if (sonLayerCount != layerCount) {
            cc.log(errStr, ": UISuperItem 层数:", sonLayerCount, "和UISuperLayout 层数:", layerCount, "不匹配");
        }
        if (layerCount > 0) {
            for (let index = 0; index < sonLayerCount; ++index) {
                let layerIndex = (index < layerCount) ? index : layerCount;
                let layerNode = layerNodeList[index];

                layerNode.parent = layerContent[layerIndex];
                layerNode.setPosition(this.node.getPosition());
                layerNode.setContentSize(this.node.getContentSize());
                layerNode.setScale(this.node.getScale(cc.v2()));
            }
        }
    }

    private destroySonLayer() {
        let sonBottomLayerCount = this.SonBottomLayerCount;
        for (let index = sonBottomLayerCount - 1; index >= 0; --index) {
            let layerNode = this.bottomLayerNodeList[index];
            layerNode.destroy();
        }

        let sonTopLayerCount = this.SonTopLayerCount;
        for (let index = sonTopLayerCount - 1; index >= 0; --index) {
            let layerNode = this.topLayerNodeList[index];
            layerNode.destroy();
        }
    }

    // 当我的尺寸/缩放改变时
    private watchSize() {
        //如果是Grid模式 不允许修改尺寸/缩放 强制改回来
        if (this.layout.column > 1) {
            this.node.setContentSize(this.originSize);
            this.node.setScale(this.originScale);
        }
        else {
            if (this.layout.vertical) {
                if ((this.node.getContentSize().width != this.originSize.width) || (this.node.scaleX != this.originScale.x)) {
                    this.node.width = this.originSize.width;
                    this.node.scaleX = this.originScale.x;
                }
            }

            if (this.layout.horizontal) {
                if ((this.node.getContentSize().height != this.originSize.height) || (this.node.scaleY != this.originScale.y)) {
                    this.node.height = this.originSize.height;
                    this.node.scaleY = this.originScale.y;
                }
            }

            // 如果我监听了兄弟节点就设置自己相对兄弟节点的位置，否则 我就发送一个位置变化的消息 让监听我的兄弟相对我做出变化
            this.brother && this.watchBrother();
            this.layout.resetScrollView();
            this.node.emit(cc.Node.EventType.POSITION_CHANGED);
        }

        if (this.node['_svItemIndex'] == 0 && this.layout.isNormalSize) {
            this.node.setPosition(this.layout.getGroupHeader(this.node));
        }

        this.onItemChange();
    }

    private onItemChange() {
        if(this.node == null){
            return;
        }
        let curPos = this.node.getPosition();
        let posChanged = this._lastPos != curPos;
        let curScale = this.node.getScale(cc.v2());
        let scaleChanged = this._lastScale != curScale
        let curSize = this.node.getContentSize();
        let sizeChanged = this._lastSize != curSize
        if (posChanged || scaleChanged || sizeChanged) {
            this._lastPos = curPos;
            this._lastScale = curScale;
            this._lastSize = curSize;
            if (posChanged) {
                this.SynLayerItemPos(this.bottomLayerNodeList, curPos);
                this.SynLayerItemPos(this.topLayerNodeList, curPos);
            }
            if (scaleChanged) {
                this.SynLayerItemScale(this.bottomLayerNodeList, curScale);
                this.SynLayerItemScale(this.topLayerNodeList, curScale);
            }
            if (sizeChanged) {
                this.SynLayerItemSize(this.bottomLayerNodeList, curSize);
                this.SynLayerItemSize(this.topLayerNodeList, curSize);
            }
        }
    }

    private SynLayerItemPos(nodeList: cc.Node[], newPos: cc.Vec2) {
        let layerCount = nodeList.length;
        for (let index = 0; index < layerCount; ++index) {
            let layerNode = nodeList[index];
            layerNode.setPosition(newPos);
        }
    }

    private SynLayerItemScale(nodeList: cc.Node[], newScale: cc.Vec2) {
        let layerCount = nodeList.length;
        for (let index = 0; index < layerCount; ++index) {
            let layerNode = nodeList[index];
            layerNode.setScale(newScale);
        }
    }

    private SynLayerItemSize(nodeList: cc.Node[], newSize: cc.Size) {
        let layerCount = nodeList.length;
        for (let index = 0; index < layerCount; ++index) {
            let layerNode = nodeList[index];
            layerNode.setContentSize(newSize);
        }
    }

    private isOutOfBoundary(offset: cc.Vec2) {
        if (this.layout.vertical && offset.y == 0) {
            return true;
        }
        if (this.layout.horizontal && offset.x == 0) {
            return true;
        }
        return false;
    }

    // 从下到上排序方向 检查头部是否需要向上填充
    private footerToHeaderWatchHeader() {
        // 如果不是头部一组的任意一个时跳过 比如一组有3个item 只计算 0，1，2 
        if (this.layout.getSiblingIndex(this.node) >= this.layout.column) {
            return;
        }

        // 如果此时【尾部】已经是最后一个数据时
        let index = this.layout.footer['_svItemIndex'] + 1
        if (index >= this.layout.maxItemTotal) {
            if (!this.layout.footerLoop || this.layout.scrollToHeaderOrFooter) {
                return;
            }
            index = 0
        }

        // 计算超出的偏移量 (从下到上排序方向时 头部在 下尾部在上 检测【头部】是否超出下边框)
        let offset = this.layout.isOutOfBoundaryFooter(this.node)
        // 没有超出时跳过
        if (!this.isOutOfBoundary(offset)) {
            return;
        }

        this.node['_svItemIndex'] = index;
        this.layout.notifyRefreshItem(this.node);
        this.node.emit('leave');
        // 将自己的节点索引设置到尾部
        this.layout.setSiblingIndex(this.node, this.layout.children.length - 1);
    }

    // 从下到上排序方向 检查尾部是否需要向下填充
    private footerToHeaderWatchFooter() {
        // 如果不是尾部一组的任意一个时跳过 比如一组有3个item 只计算末尾的3个item 
        if (this.layout.getSiblingIndex(this.node) < this.layout.children.length - this.layout.column) {
            return;
        }

        // 如果此时【头部】已经是第一个数据时
        let index = this.layout.header['_svItemIndex'] - 1;
        if (index < 0) {
            // 如果没有使用无限循环功能 否则不往下走
            if (!this.layout.headerLoop || this.layout.scrollToHeaderOrFooter) {
                return;
            }
            index = this.node['_svItemIndex'];
        }

        // 计算超出的偏移量 (从下到上排序方向时 头部在 下尾部在上 检测【尾部】是否超出下边框)
        let offset = this.layout.isOutOfBoundaryHeader(this.node);
        if (!this.isOutOfBoundary(offset)) {
            return;
        }
        this.node['_svItemIndex'] = index;
        this.layout.notifyRefreshItem(this.node);
        this.node.emit('leave');
        this.unlisten();
        this.footerToHeaderRelativeToHeader(this.layout.header);
        // 将自己的节点索引设置到头部
        this.layout.setSiblingIndex(this.node, 0);
    }

    // 从上到下排序方向 检查头部是否需要向下填充
    private headerToFooterWatchHeader() {
        // 如果不是头部一组的任意一个时跳过 比如一组有3个item 只计算 0，1，2 
        if (this.layout.getSiblingIndex(this.node) >= this.layout.column) {
            return;
        }

        // 如果此时【尾部】已经是第一个数据时  
        let index = this.layout.footer['_svItemIndex'] + 1;
        if (index > this.layout.maxItemTotal - 1) {
            // 如果没有使用无限循环功能 否则不往下走
            if (!this.layout.footerLoop || this.layout.scrollToHeaderOrFooter) {
                return;
            }
            index = 0;
        }

        // 计算超出的偏移量 (从下到上排序方向时 头部在下 尾部在上 检测【尾部】是否超出下边框)
        let offset = this.layout.isOutOfBoundaryHeader(this.node);
        if (!this.isOutOfBoundary(offset)) {
            return;
        }
        this.node['_svItemIndex'] = index;
        this.layout.notifyRefreshItem(this.node);
        this.node.emit('leave');
        // 将自己的节点索引设置到尾部
        this.layout.setSiblingIndex(this.node, this.layout.children.length - 1);
    }

    // 从上到下排序方向 检查尾部是否需要向上填充
    private headerToFooterWatchFooter() {
        // 如果不是尾部一组的任意一个时跳过 比如一组有3个item 只计算末尾的3个item 
        if (this.layout.getSiblingIndex(this.node) < this.layout.children.length - this.layout.column) {
            return;
        }

        // 如果此时【头部】已经是第一个数据时 
        let index = this.layout.header['_svItemIndex'] - 1;
        if (index < 0) {
            // 如果没有使用无限循环功能 否则不往下走
            if (!this.layout.headerLoop || this.layout.scrollToHeaderOrFooter) {
                return;
            }
            index = this.node['_svItemIndex'];
        }

        // 计算超出的偏移量 (从上到下排序方向时 头部在上 尾部在下 检测【尾部】是否超出下边框)
        let offset = this.layout.isOutOfBoundaryFooter(this.node);
        if (!this.isOutOfBoundary(offset)) {
            return;
        }
        this.node['_svItemIndex'] = index;
        this.layout.notifyRefreshItem(this.node);
        this.node.emit('leave');
        this.unlisten();
        this.headerToFooterRelativeToHeader(this.layout.header);
        // 将自己的节点索引设置到尾部
        this.layout.setSiblingIndex(this.node, 0);
    }

    // 从下到上 从右到左 排序方向  设置自己到相对node的头部
    private footerToHeaderRelativeToHeader(relative: cc.Node) {
        let pos = this.node.getPosition();
        // 从下到上
        if (this.layout.vertical) {
            if (this.layout.isGroupHeader(relative)) {
                pos.x = this.layout.getGroupFooter(this.node).x;
                pos.y = this.layout.getGroupBottomY(this.node, relative);
            }
            else {
                pos.x = this.layout.getGroupLeftX(this.node, relative);
                pos.y = relative.y;
            }

            if (this.node['_svItemIndex'] == 0) {
                pos.x = this.layout.getGroupHeader(this.node).x;
            }
        }
        else {
            // 从右到左
            if (this.layout.isGroupHeader(relative)) {
                pos.x = this.layout.getGroupRightX(this.node, relative);
                pos.y = this.layout.getGroupFooter(this.node).y;
            }
            else {
                pos.x = relative.x;
                pos.y = this.layout.getGroupTopY(this.node, relative);
            }

            if (this.node['_svItemIndex'] == 0) {
                pos.y = this.layout.getGroupHeader(this.node).y;
            }
        }
        this.node.setPosition(pos);
    }

    // 从下到上 从右到左 排序方向 设置自己到相对node的尾部
    private footerToHeaderRelativeToFooter(relative: cc.Node) {
        let pos = this.node.getPosition();
        // 从下到上
        if (this.layout.vertical) {
            if (this.layout.isGroupFooter(relative)) {
                pos.x = this.layout.getGroupHeader(this.node).x;
                pos.y = this.layout.getGroupTopY(this.node, relative);
            }
            else {
                pos.x = this.layout.getGroupRightX(this.node, relative);
                pos.y = relative.y;
            }
        }
        else {
            // 从右到左
            if (this.layout.isGroupFooter(relative)) {
                pos.x = this.layout.getGroupLeftX(this.node, relative);
                pos.y = this.layout.getGroupHeader(this.node).y;
            }
            else {
                pos.x = relative.x;
                pos.y = this.layout.getGroupBottomY(this.node, relative);
            }
        }
        this.node.setPosition(pos);
    }

    // 从上到下 从左到右 排序方向 设置自己到相对node的头部 
    private headerToFooterRelativeToHeader(relative: cc.Node) {
        let pos = this.node.getPosition();
        // 从上到下
        if (this.layout.vertical) {
            if (this.layout.isGroupHeader(relative)) {
                pos.x = this.layout.getGroupFooter(this.node).x;
                pos.y = this.layout.getGroupTopY(this.node, relative);
            }
            else {
                pos.x = this.layout.getGroupLeftX(this.node, relative);
                pos.y = relative.y;
            }

            if (this.node['_svItemIndex'] == 0) {
                pos.x = this.layout.getGroupHeader(this.node).x;
            }
        }
        else {
            // 从左到右
            if (this.layout.isGroupHeader(relative)) {
                pos.x = this.layout.getGroupLeftX(this.node, relative);
                pos.y = this.layout.getGroupFooter(this.node).y;
            }
            else {
                pos.x = relative.x
                pos.y = this.layout.getGroupTopY(this.node, relative);
            }

            if (this.node['_svItemIndex'] == 0) {
                pos.y = this.layout.getGroupHeader(this.node).y;
            }
        }
        this.node.setPosition(pos);
    }

    // 从上到下 从左到右 排序方向 设置自己到相对node尾部
    private headerToFooterRelativeToFooter(relative: cc.Node) {
        let pos = this.node.getPosition();
        // 从上到下
        if (this.layout.vertical) {
            if (this.layout.isGroupFooter(relative)) {
                pos.x = this.layout.getGroupHeader(this.node).x;
                pos.y = this.layout.getGroupBottomY(this.node, relative);
            }
            else {
                pos.x = this.layout.getGroupRightX(this.node, relative);
                pos.y = relative.y;
            }
        }
        else {
            // 从左到右
            if (this.layout.isGroupFooter(relative)) {
                pos.x = this.layout.getGroupRightX(this.node, relative);
                pos.y = this.layout.getGroupHeader(this.node).y;
            }
            else {
                pos.x = relative.x;
                pos.y = this.layout.getGroupBottomY(this.node, relative);
            }
        }
        this.node.setPosition(pos)
    }
    //#endregion

    publishOnEnterScrollView() {
        super.publishOnEnterScrollView();
        this.setNodeListActived(this.topLayerNodeList, true);
        this.setNodeListActived(this.bottomLayerNodeList, true);
        // this.node.active = true;
    }

    publishOnExitScrollView() {
        super.publishOnExitScrollView();
        this.setNodeListActived(this.topLayerNodeList, false);
        this.setNodeListActived(this.bottomLayerNodeList, false);
        // this.node.active = false;
    }

    private setNodeListActived(list: cc.Node[], actived: boolean) {
        let opacity = actived ? 255 : 0;
        for (let index = 0; index < list.length; ++index) {
            list[index].opacity = opacity;
        }
    }

    // 子类可重写
    public setSelected(){
    }

    // 子类可重写
    public setUnSelect(){
    }

    // 触发点击选中
    protected clickSelect(){
        this.layout.setSelectItem(this.getRealIndex());
    }
}
