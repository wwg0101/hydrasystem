/*
 * @Author: steveJobs
 */
import UISpuerScrollView from './UISuperScrollView';
import UISuperItem from './UISuperItem';
import FrameUtils from '../../../fromework/FrameUtils';

const EPSILON = 1e-4;

export enum UISuperEvent {
    ChangeBrother = "ChangeBrother",
    ItemRefresh = "ItemRefresh",
}
export enum UISuperAxis {
    HORIZONTAL = 0,
    VERTICAL = 1
}
export enum UISuperDirection {
    HEADER_TO_FOOTER = 0,
    FOOTER_TO_HEADER = 1,
}

enum UISuperScrollToType {
    TO_FOOTER = 1,
    TO_HEADER = 2,
    TO_INDEX = 3,
    TO_INDEX_EX = 4,
}

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("UISuperLayout")
export default class UISuperLayout extends cc.Component {
    @property({
        type: cc.Enum(UISuperAxis),
        displayName: "排列方向"
    })
    startAxis: UISuperAxis = UISuperAxis.VERTICAL;

    @property({
        type: cc.Enum(UISuperDirection),
        displayName: "排列子节点的方向"
    })
    direction: UISuperDirection = UISuperDirection.HEADER_TO_FOOTER;

    @property({
        displayName: "上边距"
    })
    paddingTop: number = 0;

    @property({
        displayName: "下边距"
    })
    paddingBottom: number = 0;

    @property({
        displayName: "左边距"
    })
    paddingLeft: number = 0;

    @property({
        displayName: "右边距"
    })
    paddingRight: number = 0;

    @property({
        displayName: "间隔"
    })
    spacing: cc.Vec2 = cc.Vec2.ZERO;

    @property({
        displayName: "每组item个数",
        tooltip: "单行的列数 或 单列的行数"
    })
    column: number = 2;

    @property({
        displayName: "item创建倍率",
        tooltip: "相对于view的尺寸 默认2倍"
    })
    multiple: number = 2;

    @property({
        type: cc.Prefab,
        displayName: "item Prefab"
    })
    itemPrefab: cc.Prefab = null;

    @property({
        type: cc.Node,
        displayName: "item Node"
    })
    itemNode: cc.Node = null;

    @property({
        displayName: "头部滑动循环"
    })
    headerLoop: boolean = false;

    @property({
        displayName: "尾部滑动循环"
    })
    footerLoop: boolean = false;

    @property({
        displayName: "适配宽屏，放大scale然后高度减小"
    })
    needFitWidth: boolean = false;
    /*
    *   层级关系如下，分层的物件 最好把按钮响应相关的 放在content层，就是不用挂
    *   *************topLayer1
    *   *************topLayer0
    *   *************content item层
    *   *************bottomLayer1
    *   *************bottomLayer0
    */
    @property({
        displayName: "分多少层底层，要和Item的匹配"
    })
    bottomLayerNum: number = 0;

    @property({
        displayName: "分多少层顶层，要和Item的匹配"
    })
    topLayerNum: number = 0;

    @property({
        displayName: "每帧创建几个"
    })
    preFrameNode: number = 1;

    @property affectedByScale: boolean = true;

    // @property(cc.Component.EventHandler)
    // refreshItemEvents: cc.Component.EventHandler[] = [];

    private _data: any[] = [];
    private _gener: Generator;
    private _isinited: boolean = false;
    private _maxPrefabTotal: number = 0;
    //和this.node.children 保持同步
    private _children: cc.Node[] = [];
    private _scrollView: UISpuerScrollView = null;
    // 记录当前总数
    private _maxItemTotal: number = 0;
    private _prevLayoutPosition: cc.Vec2 = cc.Vec2.ZERO;
    private _bottomLayerContainer: cc.Node[] = [];
    private _topLayerContainer: cc.Node[] = [];
    // 当前的滚动是否是由 scrollTo 方法执行的 和touch滑动做个区分
    public scrollToHeaderOrFooter: boolean = false;
    // 是否item创建结束
    private _itemCreateFinished: boolean = false;
    // 创建过程中缓存的滑动命令
    private _scrollCmd = null;
    private _newValue = 0;
    private _lastSelectIndex = -1;
    private _needShowCompList: UISuperItem[] = [];

    onLoad() {
        this.initlized();
        this.node.on(cc.Node.EventType.POSITION_CHANGED, this.onChangePosition, this);
        this.scrollView.view.on(cc.Node.EventType.SIZE_CHANGED, this.resetItemSize, this);
    }

    onDestroy() {
        this.node.off(UISuperEvent.ChangeBrother);
        this.node.off(cc.Node.EventType.POSITION_CHANGED, this.onChangePosition, this);
        this.scrollView.view.off(cc.Node.EventType.SIZE_CHANGED, this.resetItemSize, this);
    }

    public getDataLength(): number {
        if (this._data && this._data.length) {
            return this._data.length;
        }
        else {
            return 0;
        }
    }

    /**
     * 初始化数据
     * @param tmp 
     */
    public setData(tmp: any[]) {
        for (let index = 0, len = tmp.length; index < len; index++) {
            let data = tmp[index];
            data["realIndex"] = index;
        }
        this._data = tmp;
        this._lastSelectIndex = -1;
        this._needShowCompList = [];
        this.total(this._data.length);
    }

    public getData() {
        return this._data;
    }

    public getOneData(index) {
        return this._data[index];
    }

    /**
     * 移除item
     * @param index 
     */
    public removeItem(index: number) {
        this._data.splice(index, 1);
        this.total(this._data.length);
    }

    /**
     * 增加item
     * @param value 
     * @param index 不传则默认添加到最后，传0则添加到首 
     */
    public addItem(value, index?: number) {
        if (value == undefined) {
            value = this._data.length;
        }
        this._data.splice(index, 0, value);
        this.total(this._data.length);
    }

    /**
     * 根据key获取item的uisuperitem组件
     * @param key 
     * @param value 
     */
    public getRenderByDataKey(key, value) {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            if (child) {
                let comp = child.getComponent(UISuperItem);
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

    public optScrollViewDC() {
        this._scrollView.optDc();
    }

    //#region 私有方法
    // 设置最大item数量
    private async total(value: number) {
        this._itemCreateFinished = false;
        this.scrollView.stopAutoScroll();
        this.scrollView.release();
        this.initlized();

        this._newValue = value;

        // 分帧创建item
        await this.asyncCreateItem(value);
        if (value != this._newValue) {
            return;
        }

        // 获取数据偏移量（根据value相对于 _maxItemTotal 计算增加、减少的数量）
        let dataOffset = this.getDataOffset(value);
        // 获取真实的数据偏移（Grid模式 功能用于判断是否需要偏移header来将下方填满）
        let reallyOffset = this.getReallyOffset(dataOffset);
        // 通过已有的item _svItemIndex 加上数据偏移 来是刷新显示
        this.refreshItems(value, reallyOffset);

        this._maxItemTotal = this._newValue;

        // 创建item结束
        this._itemCreateFinished = true;

        if (this._scrollCmd != null) {
            if (this._scrollCmd.type == UISuperScrollToType.TO_FOOTER) {
                this.scrollToFooter(...this._scrollCmd.param);
            }
            else if (this._scrollCmd.type == UISuperScrollToType.TO_HEADER) {
                this.scrollToHeader(...this._scrollCmd.param);
            }
            else if (this._scrollCmd.type == UISuperScrollToType.TO_INDEX) {
                //@ts-ignore
                this.scrollToIndex(...this._scrollCmd.param);
            }
            else if (this._scrollCmd.type == UISuperScrollToType.TO_INDEX_EX) {
                //@ts-ignore
                this.scrollToIndexEX(...this._scrollCmd.param);
            }
        }
        this._scrollCmd = null;

        // EventManager.getInstance().emit(EventConstants.UISUPERLAYOUT_CREATE_FINISH, this);
        this.optScrollViewDC();
        // EventManager.getInstance().emit(EventConstants.UISUPERLAYOUT_OPTDC_FINISH, this);
    }

    // 初始化 
    private initlized() {
        if (this._isinited) {
            return;
        }
        this._lastSelectIndex = -1;
        this.node.anchorX = 0.5
        this.node.anchorY = 0.5;
        this.node.setContentSize(this.viewSize);
        // 重写 this.node.getContentSize 方法 因为content的真实尺寸不会随着item的数量变化
        this.node.getContentSize = this.getContentSize.bind(this);
        this.node.setPosition(cc.Vec2.ZERO);
        // 一组item的数量 最少是1 也就是普通的水平/垂直 大于1就是Grid模式
        this.column = this.column < 1 ? 1 : this.column;

        // if (this.needFitWidth) {
        //     var scales = GlobalConfig.widthScale;
        //     var scrollWidth = this.scrollView.view.width;
        //     var scrollHeight = this.scrollView.view.height;
        //     if (this.horizontal) {
        //         this.scrollView.view.width = scrollWidth * scales;
        //     }
        //     else {
        //         this.scrollView.view.scale = this.scrollView.view.scale * scales;
        //         this.scrollView.view.height = scrollHeight / scales;
        //     }
        // }

        this.createLayerContainer();
    }

    private createLayerContainer() {
        this._bottomLayerContainer = [];
        this._topLayerContainer = [];

        for (let index = 0; index < this.bottomLayerNum; ++index) {
            let layerNode = new cc.Node();
            layerNode.name = "BottomLayerContainer" + index;
            layerNode.parent = this.node.parent;
            layerNode.zIndex = index;
            this._bottomLayerContainer.push(layerNode);
        }
        this.node.zIndex = this.bottomLayerNum;

        for (let index = 0; index < this.topLayerNum; ++index) {
            let layerNode = new cc.Node();
            layerNode.name = "TopLayerContainer" + index;
            layerNode.parent = this.node.parent;
            layerNode.zIndex = index + this.bottomLayerNum + 1;
            this._topLayerContainer.push(layerNode);
        }

        this._isinited = true;

        this.scheduleOnce(() => {
            for (let index = 0; index < this.bottomLayerNum; ++index) {
                let layerNode = this._bottomLayerContainer[index];
                layerNode.scale = 1;
                layerNode.setPosition(this.node.getPosition());
                layerNode.setContentSize(this.node.getContentSize());
                layerNode.setAnchorPoint(this.node.getAnchorPoint());
            }
            for (let index = 0; index < this.topLayerNum; ++index) {
                let layerNode = this._topLayerContainer[index];
                layerNode.scale = 1;
                layerNode.setPosition(this.node.getPosition());
                layerNode.setContentSize(this.node.getContentSize());
                layerNode.setAnchorPoint(this.node.getAnchorPoint());
            }
        }, 0);
    }

    public onChangePosition() {
        if (!this.header) {
            return;
        }
        // this.isScrollToFooter = true 向下滑动 false 向上滑动
        let flag = this.isScrollToFooter
        if (this.headerToFooter) {
            // 倒序刷新
            flag ? this.footerToHeaderWatchChilds(flag) : this.headerToFooterWatchChilds(flag);
        } else {
            // 正序刷新
            flag ? this.headerToFooterWatchChilds(flag) : this.footerToHeaderWatchChilds(flag);
        }
        // 当item 由多到少 并且 当content的位置被重置到初始状态时 重新设置头部的item归位
        if (this.vertical && 0 == this.node.y || this.horizontal && 0 == this.node.x) {
            this.header.setPosition(this.getGroupHeader(this.header));
        }

        let curContentPos = this.node.getPosition();

        let bottomLayerCount = this._bottomLayerContainer.length;
        for (let index = 0; index < bottomLayerCount; ++index) {
            this._bottomLayerContainer[index].setPosition(curContentPos);
        }

        let topLayerCount = this._topLayerContainer.length;
        for (let index = 0; index < topLayerCount; ++index) {
            this._topLayerContainer[index].setPosition(curContentPos);
        }
    }

    // 根据上一次和本次的坐标变化计算滑动方向
    private get layoutDirection(): cc.Vec2 {
        let pos = cc.Vec2.ZERO;
        if (this.vertical) {
            pos.y = this.node.y - this._prevLayoutPosition.y;
        } else {
            pos.x = this.node.x - this._prevLayoutPosition.x;
        }
        this._prevLayoutPosition = this.node.getPosition();
        return pos;
    }

    // 是否是向下滑动
    private get isScrollToFooter(): boolean {
        if (this.vertical) {
            return this.layoutDirection.y < 0
        } else {
            return this.layoutDirection.x > 0
        }
    }

    // 获取缩放宽度 
    private getScaleWidth(node: cc.Node): number {
        return node.width * this.getUsedScaleValue(node.scaleX);
    }

    // 获取缩放高度 
    private getScaleHeight(node: cc.Node): number {
        return node.height * this.getUsedScaleValue(node.scaleY);
    }

    // 简单的浅拷贝 
    private getTempChildren() {
        let list: cc.Node[] = [];
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            list.push(child);
        }
        return list;
    }

    // 正序更新item 
    private headerToFooterWatchChilds(flag) {
        let children = this.getTempChildren();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let comp = child.getComponent(UISuperItem);
            comp.watchSelf(flag);
        }
    }

    // 倒序更新item 
    private footerToHeaderWatchChilds(flag) {
        let children = this.getTempChildren();
        for (let i = children.length - 1; i >= 0; i--) {
            let child = children[i];
            let comp = child.getComponent(UISuperItem);
            comp.watchSelf(flag);
        }
    }

    // 当数据增加、减少时 获取数据偏移 
    private getDataOffset(value: number) {
        // 返回删除数据偏移 （比如当前最大数据值=10，新数据=9 返回-1）
        if (this.footer) {
            let offset = this.footer['_svItemIndex'] + 1 - value;
            if (offset >= 0) {
                return offset == 0 ? 0 : -offset;
            }
        }
        // 返回增加数据偏移
        if (this._maxItemTotal == 0 || value < this._maxItemTotal || this._maxItemTotal < this._maxPrefabTotal) {
            //比如当前最多允许创建10个item 当前显示5个 返回0
            return 0;
        }
        //Grid模式 如果尾部的位置是在一组item中末尾的位置时 返回 0 
        if (this.isGroupFooter(this.footer)) {
            return 0;
        }
        return value - this._maxItemTotal;
    }

    /** 
     * 当数据增加、减少时 获取节点偏移量 
     * 当前数据是这样的   增加1个     增加2个
     * 0,1,2,3           1,2,3         2,3
     * 4,5,6           4,5,6,7     4,5,6,7
     *                             8
    */
    private getReallyOffset(dataOffset: number) {
        if (!this.header) {
            return 0;
        }

        // 代表增加item 表格模式下 通过偏移头部来让下方填满 填满后停止偏移
        if (dataOffset > 0) {
            for (let i = 0; i < dataOffset; i++) {
                if (this.isGroupFooter(this.footer)) {
                    //返回真实的偏移量
                    return i;
                }

                // 此时如果header 已经是一组item中最后一个时 向下位移 并 设置到一组item的起始位置   
                let pos = this.header.getPosition();
                // 垂直滑动时
                if (this.vertical) {
                    if (this.isGroupFooter(this.header)) {
                        if (this.headerToFooter) {
                            pos.y = this.getGroupBottomY(this.header, this.header);
                        }
                        else {
                            pos.y = this.getGroupTopY(this.header, this.header);
                        }
                        pos.x = this.getGroupHeader(this.header).x;
                    } else {
                        pos.x = this.getGroupRightX(this.header, this.header);
                    }
                }
                // 水平滑动时
                else {
                    if (this.isGroupFooter(this.header)) {
                        if (this.headerToFooter) {
                            pos.x = this.getGroupRightX(this.header, this.header);
                        } else {
                            pos.x = this.getGroupLeftX(this.header, this.header);
                        }
                        pos.y = this.getGroupHeader(this.header).y;
                    } else {
                        pos.y = this.getGroupBottomY(this.header, this.header);
                    }
                }
                this.header.setPosition(pos);
            }
            return dataOffset;
        }

        // 代表减少了item 计算偏移量 offset<0 【注意！这里的逻辑和上面正好相反】
        for (let i = 0; i < Math.abs(dataOffset); i++) {
            let pos = cc.Vec2.ZERO;
            if (this.vertical) {
                if (this.isGroupHeader(this.header)) {
                    pos.x = this.getGroupFooter(this.header).x;
                    if (this.headerToFooter) {
                        pos.y = this.getGroupTopY(this.header, this.header);
                    } else {
                        pos.y = this.getGroupBottomY(this.header, this.header);
                    }
                } else {
                    pos.x = this.getGroupLeftX(this.header, this.header);
                    pos.y = this.header.y;
                }
            } else {
                if (this.isGroupHeader(this.header)) {
                    pos.y = this.getGroupFooter(this.header).y;
                    if (this.headerToFooter) {
                        pos.x = this.getGroupLeftX(this.header, this.header);
                    } else {
                        pos.x = this.getGroupRightX(this.header, this.header);
                    }
                } else {
                    pos.y = this.getGroupTopY(this.header, this.header);
                    pos.x = this.header.x;
                }
            }
            this.header.setPosition(pos);
        }
        this.scrollView.calculateBoundary();
        return dataOffset;
    }

    // 刷新所有item数据 根据当前item的 index 刷新
    private refreshItems(value: number, offset: number = 0) {
        if (!this.header) {
            return;
        }

        // 获取头部item持有的index 加上 数据偏移来计算起始index 
        let startIndex = this.header['_svItemIndex'] - 1 + offset;
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            startIndex++;
            // 这里的判断用于无限循环滚动的逻辑 如果索引大于数据总数 索引归零
            if (startIndex > value - 1) {
                startIndex = 0;
            } else if (startIndex < 0) { // 索引小于0 索引定位到数据尾部 保持首尾相连
                startIndex = value - 1;
            }
            child['_svItemIndex'] = startIndex; //设置当前索引
            this.notifyRefreshItem(child);
        }
    }

    // 从头部到尾部重置数据
    private resetToHeader() {
        for (let i = 0; i < this._children.length; i++) {
            let child = this._children[i];
            child['_svItemIndex'] = i;
            this.notifyRefreshItem(child);
        }
        if (!this.headerLoop && !this.footerLoop) {
            if (this.header) {
                this.header.setPosition(this.getGroupHeader(this.header));
            }
        } else if (!this.scrollToHeaderOrFooter) {
            if (this.header) {
                this.header.setPosition(this.getGroupHeader(this.header));
            }
        }
    }

    // 从尾部到头部重置数据
    private resetToFooter() {
        let index = this._maxItemTotal;
        for (let i = this._children.length - 1; i >= 0; i--) {
            var child = this._children[i];
            child['_svItemIndex'] = --index;
            this.notifyRefreshItem(child);
        }
    }

    // 从尾部到头部重置数据
    private resetToIndex(index: number, fromHead: boolean) {
        if (fromHead) {
            for (let i = 0; i < this._children.length; i++) {
                let child = this._children[i];
                child['_svItemIndex'] = i + Math.floor(index / this.column) * this.column;
                this.notifyRefreshItem(child);
            }
        }
        else {
            let curIndex = this._maxItemTotal;
            for (let i = this._children.length - 1; i >= 0; i--) {
                var child = this._children[i];
                child['_svItemIndex'] = --curIndex;
                this.notifyRefreshItem(child);
            }
        }

    }

    // 删除多余的item
    private removeChilds(value: number) {
        // 有多余的item 需要删除
        let length = this.node.childrenCount - value;
        // 删除掉多余的item
        for (let i = 0; i < length; i++) {
            var child = this.footer;
            this.remChild(child);
            child.destroy();
            this.node.removeChild(child);
        }
        if (!this.header) {
            return;
        }
        // 将头部节点的位置重置到一组item的第一个位置
        let pos = this.getGroupHeader(this.header)
        if (this.vertical) {
            this.header.x = pos.x;
        } else {
            this.header.y = pos.y;
        }
    }

    /** 分帧创建item */
    private async asyncCreateItem(value: number) {
        if (this._gener) {
            //取消上一次的分帧任务（如果任务正在执行）
            this._gener.return("");
        }

        // 有多余的item 需要删除 不处理
        if (this.node.childrenCount > value) {
            return this.removeChilds(value);
        }

        // 已经固定item总数 不处理
        if (this._maxPrefabTotal > 0 && this._maxPrefabTotal == this.node.childrenCount) {
            return;
        }

        // 开始分帧创建item
        //计算当前应该创建的总数
        let total = value - this.node.childrenCount;
        this._gener = this.getGeneratorLength(total, () => {
            let child: cc.Node;
            if (this.itemPrefab != undefined) {
                child = cc.instantiate(this.itemPrefab);
            }
            else {
                child = cc.instantiate(this.itemNode);
            }
            child['_svItemIndex'] = this.node.childrenCount;
            this.addChild(child);

            // 获取或添加 UISuperItem
            let spuerItem = child.getComponent(UISuperItem) || child.addComponent(UISuperItem);
            this.node.addChild(child);
            spuerItem.init(this, this._bottomLayerContainer, this._topLayerContainer);

            // item在首次创建时立即刷新 避免显示item初始状态
            this.notifyRefreshItem(child);

            // 如果创建的是第一个item 设置他的起始位置 之后的item会自动相对于他来设置自己 我们只需要确定第一个位置就行了
            if (this.node.childrenCount == 1) {
                // 获取一组item中头部位置
                let pos = this.getGroupHeader(this.header);
                this.header.setPosition(pos);
                this.scrollView.calculateBoundary();
            }

            let selfHorW, viewHorW;
            if (this.vertical) {
                selfHorW = this.getReallySize().height;
                viewHorW = this.viewSize.height;
            } else {
                selfHorW = this.getReallySize().width;
                viewHorW = this.viewSize.width;
            }
            if (selfHorW >= viewHorW * this.multiple && this.isGroupFooter(this.footer)) {
                // 固定item数量 不继续创建
                this._maxPrefabTotal = this.node.childrenCount
                return false;
            }
            return true;
        })

        // 执行分帧任务 1帧创建1个
        await FrameUtils.exeGenerator(this, this._gener, this.preFrameNode);
    }

    // 分帧加载 
    private * getGeneratorLength(length: number, callback: Function, ...params: any): Generator {
        for (let i = 0; i < length; i++) {
            let result = callback(i, ...params);
            if (result) {
                yield;
            } else {
                return;
            }
        }
    }

    // 同步添加本地变量 children 并发送通知
    private addChild(node: cc.Node) {
        this._children.push(node);
        this.node.emit(UISuperEvent.ChangeBrother);
    }

    // 同步移除本地变量 children 并发送通知 
    private remChild(node: cc.Node) {
        let index = this._children.indexOf(node);
        if (index == -1) {
            return;
        }
        this._children.splice(index, 1);
        this.node.emit(UISuperEvent.ChangeBrother);
    }
    //#endregion

    //#region public方法
    public get scrollView(): UISpuerScrollView {
        if (!this._scrollView) {
            this._scrollView = this.node.parent.parent.getComponent(UISpuerScrollView);
        }
        if (!this._scrollView) {
            this._scrollView = this.node.parent.getComponent(UISpuerScrollView);
        }
        return this._scrollView;
    }

    // 自己维护的子节点数组 和this.node.children 保持同步
    public get children() {
        return this._children;
    }

    // 最大数据总数
    public get maxItemTotal() {
        return this._maxItemTotal;
    }

    // 当前被创建的item总数
    public get maxPrefabTotal() {
        return this._maxPrefabTotal;
    }

    // scrollView.view尺寸
    public get viewSize(): cc.Size {
        return this.scrollView.view.getContentSize();
    }

    // 是否是垂直模式
    public get vertical(): boolean {
        return this.startAxis == UISuperAxis.VERTICAL;
    }

    // 是否是水平模式
    public get horizontal(): boolean {
        return this.startAxis == UISuperAxis.HORIZONTAL;
    }

    // 是否是正序排列
    public get headerToFooter(): boolean {
        return this.direction == UISuperDirection.HEADER_TO_FOOTER;
    }

    // 是否是倒序排列
    public get footerToHeader(): boolean {
        return this.direction == UISuperDirection.FOOTER_TO_HEADER;
    }

    // 水平间隔总宽度 (Grid 模式返回多个间隔总宽度)
    public get spacingWidth() {
        return this.spacing.x * (this.column - 1);
    }

    // 水平间隔总高度 (Grid 模式返回多个间隔总高度)
    public get spacingHeight() {
        return this.spacing.y * (this.column - 1);
    }

    // 可容纳item的真实宽度
    public get accommodWidth() {
        return this.viewSize.width - this.paddingLeft - this.paddingRight;
    }

    // 可容纳item的真实高度
    public get accommodHeight() {
        return this.viewSize.height - this.paddingTop - this.paddingBottom;
    }

    // 当前头部的item 
    public get header(): cc.Node {
        return this._children[0];
    }

    // 当前尾部的item 
    public get footer(): cc.Node {
        return this._children[this._children.length - 1];
    }

    // 真实的上边距 
    public get topBoundary() {
        if (this.headerToFooter) {
            return this.headerBoundaryY + this.paddingTop;
        } else {
            return this.footerBoundaryY + this.paddingTop;
        }
    }

    // 真实的下边距 
    public get bottomBoundary() {
        if (this.headerToFooter) {
            return this.footerBoundaryY - this.paddingBottom;
        } else {
            return this.headerBoundaryY - this.paddingBottom;
        }
    }

    // 真实的左边距 
    public get leftBoundary() {
        if (this.headerToFooter) {
            return this.headerBoundaryX - this.paddingLeft;
        } else {
            return this.footerBoundaryX - this.paddingLeft;
        }
    }

    // 真实的右边距 
    public get rightBoundary() {
        if (this.headerToFooter) {
            return this.footerBoundaryX + this.paddingRight;
        } else {
            return this.headerBoundaryX + this.paddingRight;
        }
    }

    // 头部item的世界坐标边框 类似 xMin、xMax 
    public get headerBoundaryX() {
        if (this.headerToFooter) {
            return this.node.x + this.header.x - this.header.anchorX * this.getScaleWidth(this.header);
        } else {
            return this.node.x + this.header.x + (1 - this.header.anchorX) * this.getScaleWidth(this.header);
        }
    }

    // 头部item的世界坐标边框 类似 yMin、yMax 
    public get headerBoundaryY() {
        if (this.headerToFooter) {
            return this.node.y + this.header.y + (1 - this.header.anchorY) * this.getScaleHeight(this.header);
        } else {
            return this.node.y + this.header.y - this.header.anchorY * this.getScaleHeight(this.header);
        }
    }

    // 尾部item的世界坐标边框 类似 xMin、xMax 
    public get footerBoundaryX() {
        if (this.headerToFooter) {
            return this.node.x + this.footer.x + (1 - this.footer.anchorX) * this.getScaleWidth(this.footer);
        } else {
            return this.node.x + this.footer.x - this.footer.anchorX * this.getScaleWidth(this.footer);
        }
    }

    // 尾部item的世界坐标边框 类似 yMin、yMax 
    public get footerBoundaryY() {
        if (this.headerToFooter) {
            return this.node.y + this.footer.y - this.footer.anchorY * this.getScaleHeight(this.footer);
        } else {
            return this.node.y + this.footer.y + (1 - this.footer.anchorY) * this.getScaleHeight(this.footer);
        }
    }

    public get isNormalSize(): boolean {
        return this.node.getContentSize().equals(this.viewSize);
    }

    // 重写 this.node.getContentSize 动态计算头尾item 返回虚拟的尺寸 非content设置的尺寸
    public getContentSize() {
        let size = this.getReallySize();
        let viewSize = this.scrollView.view.getContentSize();
        // 列表为空时 直接返回 scrollView.view 的尺寸
        if (size.height < viewSize.height) {
            size.height = viewSize.height;
        }
        if (size.width < viewSize.width) {
            size.width = viewSize.width;
        }
        return size;
    }

    // 返回 header到 footer 之间的整体尺寸 
    public getReallySize() {
        if (this.node.childrenCount == 0) {
            return this.viewSize;
        }
        let size = cc.Size.ZERO;
        if (this.headerToFooter) { // 根据header和footer计算出真实的content尺寸 
            size.width = this.footerBoundaryX + -this.headerBoundaryX + this.paddingLeft + this.paddingRight;
            size.height = this.headerBoundaryY + -this.footerBoundaryY + this.paddingTop + this.paddingBottom;
        } else {
            size.width = this.headerBoundaryX + -this.footerBoundaryX + this.paddingLeft + this.paddingRight;
            size.height = this.footerBoundaryY + -this.headerBoundaryY + this.paddingTop + this.paddingBottom;
        }
        return size;
    }

    // 重置scrollview 
    public resetScrollView() {
        this.scrollView.reset();
    }

    // 获取缩放系数 
    public getUsedScaleValue(value: number) {
        return this.affectedByScale ? Math.abs(value) : 1
    }

    // 获取兄弟节点 
    public getBrotherNode(node: cc.Node) {
        // 此 getSiblingIndex 非 this.node.getSiblingIndex
        let index = this.getSiblingIndex(node) - 1;
        return this._children[index];
    }

    // 是否是一组item中第一个（垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public isGroupHeader(node: cc.Node): boolean {
        let xOry = this.getGroupHeader(node);
        let pos = this.vertical ? cc.v2(xOry.x, 0) : cc.v2(0, xOry.y);
        let self = this.vertical ? cc.v2(node.x, 0) : cc.v2(0, node.y);
        return self.fuzzyEquals(pos, EPSILON);
    }

    // 是否是一组item中最后一个（垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public isGroupFooter(node: cc.Node): boolean {
        let xOry = this.getGroupFooter(node);
        let pos = this.vertical ? cc.v2(xOry.x, 0) : cc.v2(0, xOry.y);
        let self = this.vertical ? cc.v2(node.x, 0) : cc.v2(0, node.y);
        return self.fuzzyEquals(pos, EPSILON);
    }

    // 获取一组item中起始位置 （垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public getGroupHeader(node: cc.Node): cc.Vec2 {
        let pos = cc.Vec2.ZERO;
        if (!node) {
            return pos;
        }
        let scaleW = this.getScaleWidth(node);
        let scaleH = this.getScaleHeight(node);
        if (this.vertical) {
            if (this.headerToFooter) {
                pos.x = node.anchorX * scaleW + (this.paddingLeft * node.scaleX) - (this.node.anchorX * this.viewSize.width * node.scaleX);
                pos.y = (1 - node.anchorY) * -scaleH - this.paddingTop + (1 - this.node.anchorY) * this.viewSize.height;
            } else {
                pos.x = node.anchorX * scaleW + this.paddingLeft - this.node.anchorX * this.viewSize.width;
                pos.y = node.anchorY * scaleH + this.paddingBottom - this.node.anchorY * this.viewSize.height;
            }
        } else {
            if (this.headerToFooter) {
                pos.x = node.anchorX * scaleW + this.paddingLeft - this.node.anchorX * this.viewSize.width;
                pos.y = (1 - node.anchorY) * -node.height - this.paddingTop + (1 - this.node.anchorY) * this.viewSize.height;
            } else {
                pos.x = this.accommodWidth * this.node.anchorX - scaleW * (1 - node.anchorX);
                pos.y = (1 - node.anchorY) * -node.height - this.paddingTop + (1 - this.node.anchorY) * this.viewSize.height;
            }
        }
        return pos;
    }

    // 获取一组item中结束位置 （垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public getGroupFooter(node: cc.Node): cc.Vec2 {
        let pos = cc.Vec2.ZERO;
        if (!node) {
            return pos;
        }
        if (this.vertical) {
            pos.x = (this.accommodWidth + this.paddingLeft) * this.node.anchorX - (this.getScaleWidth(node) * (1 - node.anchorX) + this.node.anchorX * this.paddingRight);
            pos.y = node.y;
        } else {
            pos.x = node.x;
            pos.y = -((this.accommodHeight + this.paddingTop) * this.node.anchorY - this.getScaleHeight(node) * node.anchorY) + (1 - node.anchorY) * this.paddingBottom;
        }
        return pos;
    }

    // 获取一组item中 node 相对 relative 右偏移量 （垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public getGroupRightX(node: cc.Node, relative: cc.Node) {
        if (!node || !relative) {
            return this.getGroupHeader(node).x;
        }
        let prevWidth = relative.x + this.getScaleWidth(relative) * (1 - relative.anchorX);
        let selfWidth = this.getScaleWidth(node) * node.anchorX;
        return prevWidth + selfWidth + this.spacing.x;
    }

    // 获取一组item中 node 相对 relative 左偏移量 （垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public getGroupLeftX(node: cc.Node, relative: cc.Node) {
        if (!node || !relative) {
            return this.getGroupFooter(node).x;
        }
        let prevWidth = relative.x - this.getScaleWidth(relative) * relative.anchorX;
        let selfWidth = this.getScaleWidth(node) * (1 - node.anchorX);
        return prevWidth - selfWidth - this.spacing.x;
    }

    // 获取一组item中 node 相对 relative 下偏移量 （垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public getGroupBottomY(node: cc.Node, relative: cc.Node) {
        let prevHeight = relative.y - this.getScaleHeight(relative) * relative.anchorY;
        let selfHeight = this.getScaleHeight(node) * (1 - node.anchorY);
        return prevHeight - selfHeight - this.spacing.y;
    }

    // 获取一组item中 node 相对 relative 上偏移量 （垂直滑动中 一组item 就是单行的所有列 、水平滑动中 一组item 就是单列中所有行）
    public getGroupTopY(node: cc.Node, relative: cc.Node) {
        let prevHeight = relative.y + this.getScaleHeight(relative) * (1 - relative.anchorY);
        let selfHeight = this.getScaleHeight(node) * node.anchorY;
        return prevHeight + selfHeight + this.spacing.y;
    }

    // 判断给定的 node 乘以 multiple 倍数后 是否超出了头部边框 （ multiple = 1 就是一个node的尺寸 默认1.5倍）
    public isOutOfBoundaryHeader(node: cc.Node, multiple: number = 1.5) {
        let width = node.width * this.getUsedScaleValue(node.scaleX) * multiple;
        let height = -node.height * this.getUsedScaleValue(node.scaleY) * multiple;
        let offset = this.scrollView.getHowMuchOutOfBoundary(cc.v2(width, height));
        return offset;
    }

    // 判断给定的 node 乘以 multiple 倍数后 是否超出了尾部部边框 （ multiple = 1 就是一个node的尺寸 默认1.5倍）
    public isOutOfBoundaryFooter(node: cc.Node, multiple: number = 1.5) {
        let width = -node.width * this.getUsedScaleValue(node.scaleX) * multiple;
        let height = node.height * this.getUsedScaleValue(node.scaleY) * multiple;
        let offset = this.scrollView.getHowMuchOutOfBoundary(cc.v2(width, height));
        return offset;
    }

    // 滚动到头部 （根据 排列方向、排列子节点的方向）来调用 scrollView.scrollTo... 方法 
    public scrollToHeader(timeInSecond?: number, attenuated?: boolean) {
        if (this._itemCreateFinished) {
            this.scrollToHeaderOrFooter = timeInSecond > 0;
            this.scrollView.stopAutoScroll();
            this.resetToHeader();
            if (this.headerToFooter) {
                if (this.vertical) {
                    this.scrollView.scrollToTop(timeInSecond, attenuated);
                } else {
                    this.scrollView.scrollToLeft(timeInSecond, attenuated);
                }
            } else {
                if (this.vertical) {
                    this.scrollView.scrollToBottom(timeInSecond, attenuated);
                } else {
                    this.scrollView.scrollToRight(timeInSecond, attenuated);
                }
            }
            this.scrollFinish();
        }
        else {
            this._scrollCmd = {
                type: UISuperScrollToType.TO_HEADER,
                param: [timeInSecond, attenuated],
            };
        }
    }

    // 滚动到尾部（根据 排列方向、排列子节点的方向）来调用 scrollView.scrollTo... 方法 
    public scrollToFooter(timeInSecond?: number, attenuated?: boolean) {
        if (this._itemCreateFinished) {
            this.scrollToHeaderOrFooter = timeInSecond > 0;
            this.scrollView.stopAutoScroll();
            this.resetToFooter();
            if (this.headerToFooter) {
                if (this.vertical) {
                    this.scrollView.scrollToBottom(timeInSecond, attenuated);
                } else {
                    this.scrollView.scrollToRight(timeInSecond, attenuated);
                }
            } else {
                if (this.vertical) {
                    this.scrollView.scrollToTop(timeInSecond, attenuated);
                } else {
                    this.scrollView.scrollToLeft(timeInSecond, attenuated);
                }
            }
            this.scrollFinish();
        }
        else {
            this._scrollCmd = {
                type: UISuperScrollToType.TO_FOOTER,
                param: [timeInSecond, attenuated],
            };
        }
    }

    /**
     * 仅支持垂直或者平移
     * @param offsetPos 
     * @param timeInSecond 
     * @param attenuated 
     */
    public scrollToIndex(index: number, itemSize: cc.Vec2, timeInSecond?: number, attenuated?: boolean) {
        if (this._itemCreateFinished) {
            this.scrollToHeaderOrFooter = timeInSecond > 0;
            this.scrollView.stopAutoScroll();
            let resetFromHead = this.calIndexPosResetFromHead(index, itemSize);
            let reallyPecent = resetFromHead ? 1 : 0;
            this.resetToIndex(index, resetFromHead);
            if (this.vertical) {
                this.scrollView.scrollToPercentVertical(reallyPecent, timeInSecond, attenuated);
            } else {
                this.scrollView.scrollToPercentHorizontal(reallyPecent, timeInSecond, attenuated);
            }
            this.scrollFinish();
        }
        else {
            this._scrollCmd = {
                type: UISuperScrollToType.TO_INDEX,
                param: [index, itemSize, timeInSecond, attenuated],
            };
        }
    }

    public scrollToIndexEX(index: number, timeInSecond?: number, attenuated?: boolean) {
        if (this._itemCreateFinished) {
            this.scrollToHeaderOrFooter = timeInSecond > 0;
            this.scrollView.stopAutoScroll();
            let resetFromHead = this.calIndexPosResetFromHeadEX(index);
            let reallyPecent = resetFromHead ? 1 : 0;
            this.resetToIndex(index, resetFromHead);
            if (this.vertical) {
                this.scrollView.scrollToPercentVertical(reallyPecent, timeInSecond, attenuated);
            } else {
                this.scrollView.scrollToPercentHorizontal(reallyPecent, timeInSecond, attenuated);
            }
            this.scrollFinish();
        }
        else {
            this._scrollCmd = {
                type: UISuperScrollToType.TO_INDEX_EX,
                param: [index, timeInSecond, attenuated],
            };
        }
    }


    private scrollFinish() {
        // EventManager.getInstance().emit(EventConstants.UISUPERLAYOUT_SCROLL_FINISH, this);
        this.optScrollViewDC();
    }

    private calIndexPosResetFromHead(index: number, itemSize: cc.Vec2): boolean {
        let length = this.getDataLength();
        if (index >= length) index = length - 1;
        if (index < 0) index = 0;
        let groupLength = this.column > 0 ? Math.ceil(length / this.column) : length;
        let scrollLength = 1;
        let blockLength = 1;
        let totalLength = 1;
        let spaceLength = 0;
        if (this.vertical) {
            spaceLength = this.spacing.y;
            scrollLength = this.scrollView.node.height * this.scrollView.node.scaleY;
            blockLength = itemSize.y + spaceLength;
        }
        else {
            spaceLength = this.spacing.x;
            scrollLength = this.scrollView.node.width * this.scrollView.node.scaleX;
            blockLength = itemSize.x + spaceLength;
        }
        totalLength = groupLength * blockLength - spaceLength - scrollLength;

        let percent = 0;
        if (totalLength > 0) {
            let groupIndex = this.column > 0 ? Math.floor(index / this.column) : index;
            percent = blockLength * groupIndex / totalLength;
            return (percent < 1) ? true : false;
        }
        else {
            return false;
        }
    }

    private calIndexPosResetFromHeadEX(index: number): boolean {
        let length = this.getDataLength();
        let totalHeight = 0;
        let needHeight = 0;

        let scrollLength = 1;
        let spaceLength = 0;
        if (this.vertical) {
            spaceLength = this.spacing.y;
            scrollLength = this.scrollView.node.height * this.scrollView.node.scaleY;
        }
        else {
            spaceLength = this.spacing.x;
            scrollLength = this.scrollView.node.width * this.scrollView.node.scaleX;
        }
        for (let i = 0; i < length; ++i) {
            let singleData = this.getOneData(i);
            let childLength = this.vertical
                ? singleData.GetHeight()
                : singleData.GetWidth();
            totalHeight += (childLength + spaceLength);
            if (i < index) {
                needHeight += (childLength + spaceLength);
            }
        }

        totalHeight = totalHeight - spaceLength - scrollLength;
        let percent = 0;
        if (totalHeight > 0) {
            //let groupIndex = this.column > 0 ? Math.floor(index / this.column) : index;
            percent = needHeight / totalHeight;
            return (percent < 1) ? true : false;
        }
        else {
            return false;
        }

    }

    /**
     * 根据ListID获取Item
     * @param {Number} listId
     * @returns
     */
    getItemByListId(listId) {
        for (let n = this._children.length - 1; n >= 0; n--) {
            if (this._children[n]['_svItemIndex'] == listId)
                return this._children[n];
        }
    }

    /**
     * 更新指定的Item
     * @param {Array} args 单个listId，或者数组
     * @returns
     */
    public updateItem(args) {
        if (!this._isinited) {
            return;
        }
        if (!Array.isArray(args)) {
            args = [args];
        }
        for (let n = 0, len = args.length; n < len; n++) {
            let index = args[n];
            let info = this.getOneData(index);
            let item = this.getItemByListId(index);
            if (item) {
                item.getComponent(UISuperItem).updateData(index, info);
                item.active = true;
                item.getComponent(UISuperItem).show();
            }
        }
    }

    // 通知给定的node刷新数据 
    public notifyRefreshItem(target: cc.Node) {
        // cc.Component.EventHandler.emitEvents(this.refreshItemEvents, target, target['_svItemIndex']);
        target.active = true;
        let index = target['_svItemIndex'];
        let info = this.getOneData(index);
        let comp = target.getComponent(UISuperItem);
        comp.updateData(index, info);
        this._needShowCompList.push(comp);
    }

    // 获取节点索引 
    public getSiblingIndex(node: cc.Node) {
        return this._children.indexOf(node);
    }

    // 自定义索引方法 这里不是通过实时修改节点索引的方法，只是模拟类似的功能，实际上并没有真正改变节点的实际顺序（优化项） 
    public setSiblingIndex(node: cc.Node, index: number) {
        // 此方法时参考引擎原setSiblingIndex方法 去掉了修改节点索引位置的调用（item本身的zIndex没有任何变化）
        index = index !== -1 ? index : this._children.length - 1;
        var oldIndex = this._children.indexOf(node);
        if (index !== oldIndex) {
            this._children.splice(oldIndex, 1);
            if (index < this._children.length) {
                this._children.splice(index, 0, node);
            }
            else {
                this._children.push(node);
            }
            this.node.emit(UISuperEvent.ChangeBrother);
        }
    }

    public resetItemSize() {
        // 重新设置原始尺寸
        for (let i = 0; i < this.children.length; i++) {
            this.children[i]['saveOriginSize']();
        }

        // 改变头部位置
        if (this.header) {
            let pos = this.getGroupHeader(this.header);
            if (this.vertical) {
                this.header.x = pos.x;
            } else {
                this.header.y = pos.y;
            }
        }

        // 通知改变坐标事件
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].emit(cc.Node.EventType.POSITION_CHANGED);
        }

        this.optScrollViewDC();
    }

    // 当前是否头部
    public isHeader() {
        if (this.headerToFooter) {
            if (this.header) {
                return this.header['_svItemIndex'] == 0 && this.header.opacity == 255;
            }
        } else {
            if (this.footer) {
                return this.footer['_svItemIndex'] == this.maxItemTotal - 1
                    && this.footer.opacity == 255;
            }
        }
        return true;
    }

    // 当前是否尾部
    public isFooter() {
        if (this.headerToFooter) {
            if (this.footer) {
                return this.footer['_svItemIndex'] == this.maxItemTotal - 1
                    && this.footer.opacity == 255;
            }
        } else {
            if (this.header) {
                return this.header['_svItemIndex'] == 0 && this.header.opacity == 255;
            }
        }
        return true;
    }

    // realIndex -1表示全不选
    public setSelectItem(realIndex: number) {
        if (this._lastSelectIndex == realIndex) {
            return;
        }
        this._lastSelectIndex = realIndex;

        let children = this.getTempChildren();
        for (let i = children.length - 1; i >= 0; i--) {
            let child = children[i];
            let comp = child.getComponent(UISuperItem);
            if (comp.getRealIndex() == realIndex) {
                comp.setSelected();
            }
            else {
                comp.setUnSelect();
            }
        }
    }

    public getSelectIndex() {
        return this._lastSelectIndex;
    }
    //#endregion

    update() {
        let comp = this._needShowCompList.shift();
        if (comp) {
            comp.show();
        }
    }
}
