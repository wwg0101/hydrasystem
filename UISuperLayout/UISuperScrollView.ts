/*
 * @Author: steveJobs
 */

import ScrollViewPlus from './ScrollViewPlus';
import UISuperLayout from './UISuperLayout';

const EPSILON = 1e-4;

// 当前进度状态 
export enum UISuperSvProgressState {
    Touch = 0,          // 触摸中 正在触摸滑动中 
    Wait = 1,           // 等待中 已经满足了触发的更新动作的条件 
    Lock = 2,           // 锁定中 当前正在执行刷新或加载
    Release = 3,        // 释放中 
};

export interface UISuperHeaderAndFooterEvent {
    // 执行动作 true:满足触发条件
    action: boolean,
    // 根据参数headerOutOffset或footerOutOffset 来计算的进度值
    progress: number,
    progressStage: UISuperSvProgressState,
}

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("UISpuerScrollView")
export default class UISpuerScrollView extends ScrollViewPlus {
    @property({
        displayName: "顶部偏移量",
        tooltip: "下拉时超过此偏移会发送下拉事件"
    })
    headerOutOffset: number = 200;

    @property({
        displayName: "满足触发Header的倍数"
    })
    headerMultiple: number = 2;

    @property({
        displayName: "底部偏移量",
        tooltip: "上拉时超过此偏移会发送上拉事件"
    })
    footerOutOffset: number = 200;

    @property({
        displayName: "满足触发Footer的倍数"
    })
    footerMultiple: number = 2;

    @property({
        type: cc.Component.EventHandler,
        displayName: "下拉事件"
    })
    pullDownEvents: cc.Component.EventHandler[] = [];

    @property({
        type: cc.Component.EventHandler,
        displayName: "上拉事件"
    })
    pullUpEvents: cc.Component.EventHandler[] = [];

    private isMoveHeader: boolean = false;
    private isMoveFooter: boolean = false;
    private isLockHeader: boolean = false;
    private isLockFooter: boolean = false;
    private headerProgress: number = 0;
    private footerProgress: number = 0;
    private _layout: UISuperLayout = null;

    onLoad() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.onChangeSize, this);
    }

    onDestroy() {
        super.onDestroy();
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.onChangeSize, this);
    }

    //#region 私有方法
    private onChangeSize() {
        let widget = this.view.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
    }

    private get layout(): UISuperLayout {
        if (this._layout == null) {
            this._layout = this.content.getComponent(UISuperLayout);
        }
        if (this._layout === null) {
            cc.log("---当前scrollview的content没add UISuperLayout---");
        }
        return this._layout;
    }

    // 当前是否头部
    private get isHeader() {
        return this.layout.isHeader();
    }

    // 当前是否尾部
    private get isFooter() {
        return this.layout.isFooter();
    }

    private clearProgress() {
        this.headerProgress = 0;
        this.footerProgress = 0;
        this.emitPullDownEvent({ action: false, progress: 0, progressStage: UISuperSvProgressState.Release });
        this.emitPullUpEvent({ action: false, progress: 0, progressStage: UISuperSvProgressState.Release });
    }

    private emitPullDownEvent(data: UISuperHeaderAndFooterEvent) {
        cc.Component.EventHandler.emitEvents(this.pullDownEvents, this, data);
    }

    private emitPullUpEvent(data: UISuperHeaderAndFooterEvent) {
        cc.Component.EventHandler.emitEvents(this.pullUpEvents, this, data);
    }
    //#endregion

    //#region public方法
    // 是否需要计算？如果上拉/下拉事件没有监听者则不需要相关的计算
    public get isCalculPull() {
        return this.pullDownEvents.length > 0 || this.pullUpEvents.length > 0;
    }

    // 释放 功能用于上拉加载下拉刷新 解锁头尾固定的尺寸
    public release() {
        this.isMoveHeader = false;
        this.isMoveFooter = false;
        if (this.isLockHeader || this.isLockFooter) {
            let outOfBoundary = this.getHowMuchOutOfBoundary()
            let offset = this.vertical ? outOfBoundary.y : -outOfBoundary.x
            let autoScroll = true
            if (offset == 0 || this.isLockHeader && offset < 0 || this.isLockFooter && offset > 0) {
                this.clearProgress()
                autoScroll = false
            }
            this.isLockHeader = false;
            this.isLockFooter = false;
            if (autoScroll) {
                //@ts-ignore
                this._outOfBoundaryAmountDirty = true;
                //@ts-ignore
                this._processInertiaScroll();
            }
        } else {
            this.clearProgress()
        }
    }

    // 重置列表 当列表滑动到底部时 然后不管通过什么方式(同步|异步)减少了整体的(高度|缩放|尺寸) 时保证内容显示正确
    public reset() {
        //@ts-ignore
        this._outOfBoundaryAmountDirty = true;
        let offset = this.getHowMuchOutOfBoundary();
        if (!offset.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            //@ts-ignore
            this._processInertiaScroll();
        }
    }
    //#endregion

    //#region 继承/重写 scrollview的一些属性方法
    // scrollview的view
    public get view(): cc.Node {
        //@ts-ignore
        return this._view;
    }

    public set autoScrolling(value: boolean) {
        //@ts-ignore
        this._autoScrolling = value;
    }

    public get autoScrolling() {
        //@ts-ignore
        return this._autoScrolling;
    }

    // 计算边界
    public calculateBoundary() {
        //@ts-ignore
        this._calculateBoundary();
    }

    // 计算超出多少边界
    public getHowMuchOutOfBoundary(offset?: cc.Vec2) {
        //@ts-ignore
        return this._getHowMuchOutOfBoundary(offset);
    }

    // 重写scrollview的_onTouchMoved
    private _onTouchMoved(event: cc.Event.EventTouch, captureListeners) {
        //@ts-ignore
        super._onTouchMoved(event, captureListeners);

        if (this.isCalculPull) {
            let outOfBoundary = this.getHowMuchOutOfBoundary();
            let offset = this.vertical ? outOfBoundary.y : -outOfBoundary.x;
            if (offset > 0 && this.isHeader && !this.isLockHeader && !this.isLockFooter) {
                this.headerProgress = offset < EPSILON ? 0 : offset / this.headerOutOffset;
                this.isMoveHeader = this.headerProgress >= this.headerMultiple;
                let state = this.isMoveHeader ? UISuperSvProgressState.Wait : UISuperSvProgressState.Touch;

                this.emitPullDownEvent({ action: false, progress: this.headerProgress, progressStage: state });
                this.emitPullUpEvent({ action: false, progress: 0, progressStage: UISuperSvProgressState.Release });
            }
            else if (offset < 0 && this.isFooter && !this.isLockFooter && !this.isLockHeader) {
                this.footerProgress = -offset < EPSILON ? 0 : -offset / this.footerOutOffset;
                this.isMoveFooter = this.footerProgress >= this.footerMultiple;
                let state = this.isMoveFooter ? UISuperSvProgressState.Wait : UISuperSvProgressState.Touch;

                this.emitPullUpEvent({ action: false, progress: this.footerProgress, progressStage: state });
                this.emitPullDownEvent({ action: false, progress: 0, progressStage: UISuperSvProgressState.Release });
            }
        }
    }

    // 重写scrollview的_dispatchEvent
    private _dispatchEvent(event) {
        //@ts-ignore
        super._dispatchEvent(event);
        if (event == 'scroll-ended') {
            // 用于控制循环滚动时使用scrollTo方法滚动带来的效果问题 
            this.layout.scrollToHeaderOrFooter = false;
        }
    }

    // 重写scrollview的_getContentTopBoundary
    private _getContentTopBoundary() {
        let viewSize = this.view.getContentSize();
        let local = 0;
        if (this.layout && this.layout.header && this.layout.getReallySize().height > viewSize.height) {
            // 返回头部item上边距
            local = this.layout.topBoundary;
        } else {
            // 用于无内容/少量内容时也可以上拉加载下拉刷新 如果所有item加起来的尺寸不足以撑满整个可视区域时 直接使用view可视尺寸
            local = this._getContentBottomBoundary() + viewSize.height;
        }
        if (this.isHeader && this.isLockHeader) {
            // 用于上拉加载 下拉刷新 让整个content多一个 headerOutOffset 的尺寸
            local += this.headerOutOffset;
        }
        return local
    }

    // 重写scrollview的_getContentBottomBoundary
    private _getContentBottomBoundary() {
        let viewSize = this.view.getContentSize();
        let local = 0;
        if (this.layout && this.layout.footer && this.layout.getReallySize().height > viewSize.height) {
            // 返回尾部item上边距
            local = this.layout.bottomBoundary;
        } else {
            // 用于无内容/少量内容时也可以上拉加载下拉刷新 如果所有item加起来的尺寸不足以撑满整个可视区域时 直接使用view可视尺寸
            local = this.layout.node.y - this.layout.node.getAnchorPoint().y * viewSize.height;
        }
        if (this.isFooter && this.isLockFooter) {
            // 用于上拉加载 下拉刷新 让整个content多一个 footerOutOffset 的尺寸
            local -= this.footerOutOffset;
        }
        return local;
    }

    // 重写scrollview的_getContentLeftBoundary
    private _getContentLeftBoundary() {
        let viewSize = this.view.getContentSize();
        let local = 0;
        if (this.layout && this.layout.header && this.layout.getReallySize().width > viewSize.width) {
            // 返回头部item左边距
            local = this.layout.leftBoundary
        } else {
            // 用于无内容/少量内容时也可以上拉加载下拉刷新 如果所有item加起来的尺寸不足以撑满整个可视区域时 直接使用view可视尺寸
            local = this.layout.node.x - this.layout.node.getAnchorPoint().x * viewSize.width;
        }
        if (this.isHeader && this.isLockHeader) {
            // 用于上拉加载 下拉刷新 让整个content多一个 headerOutOffset 的尺寸
            local -= this.headerOutOffset;
        }
        return local;
    }

    // 重写scrollview的_getContentRightBoundary
    private _getContentRightBoundary() {
        let viewSize = this.view.getContentSize();
        let local = 0;
        if (this.layout && this.layout.footer && this.layout.getReallySize().width > viewSize.width) {
            // 返回头部item右边距
            local = this.layout.rightBoundary;
        } else {
            // 用于无内容/少量内容时也可以上拉加载下拉刷新 如果所有item加起来的尺寸不足以撑满整个可视区域时 直接使用view可视尺寸
            local = this._getContentLeftBoundary() + viewSize.width;
        }
        if (this.isFooter && this.isLockFooter) {
            // 用于上拉加载 下拉刷新 让整个content多一个 footerOutOffset 的尺寸
            local += this.footerOutOffset;
        }
        return local;
    }

    // 重写scrollview的_getContentRightBoundary
    private _startAutoScroll(deltaMove, timeInSecond, attenuated) {
        if (this.isCalculPull) {  // 如果没有刷新/加载的监听者 则不计算 
            // 锁住头部 意思就是已经触发了下拉事件 应用层应该做些刷新的动作
            if (this.isMoveHeader && !this.isLockHeader) {
                this.isLockHeader = true;
                this.vertical && (deltaMove.y -= this.headerOutOffset);
                this.horizontal && (deltaMove.x += this.headerOutOffset);
                this.emitPullDownEvent({ action: true, progress: this.headerProgress, progressStage: UISuperSvProgressState.Lock });
            }
            // 锁住尾部 意思就是已经触发了上拉事件 应用层应该做些加载的动作
            else if (this.isMoveFooter && !this.isLockFooter) {
                this.isLockFooter = true
                this.vertical && (deltaMove.y += this.footerOutOffset);
                this.horizontal && (deltaMove.x -= this.footerOutOffset);
                this.emitPullUpEvent({ action: true, progress: this.footerProgress, progressStage: UISuperSvProgressState.Lock });
            }
        }

        //@ts-ignore
        super._startAutoScroll(deltaMove, timeInSecond, attenuated);
    }

    // 重写scrollview的_updateScrollBar
    private _updateScrollBar(outOfBoundary) {
        //@ts-ignore
        super._updateScrollBar(outOfBoundary);

        // 如果没有刷新/加载的监听者 则不计算 
        if (!this.isCalculPull) {
            return;
        }

        // 自动回弹时不计算 （非手动）
        //@ts-ignore
        if (this._autoScrollBraking) {
            return;
        }

        // 非自动滚动时不计算 
        if (!this.autoScrolling) {
            return;
        }

        let offset = this.vertical ? outOfBoundary.y : -outOfBoundary.x;
        if (offset > 0) { // 下滑
            // 根据参数 headerOutOffset 计算当前下滑的办百分比
            let progress = offset < EPSILON ? 0 : offset / this.headerOutOffset;
            let progressStage: UISuperSvProgressState;

            if (this.isLockHeader) {
                this.headerProgress = this.headerProgress == 1 ? this.headerProgress : Math.max(progress, 1);
                progressStage = UISuperSvProgressState.Lock;  //锁定状态
            } else {
                this.headerProgress = progress < this.headerProgress ? progress : this.headerProgress
                progressStage = UISuperSvProgressState.Release; //释放状态
            }
            this.emitPullDownEvent({ action: false, progress: this.headerProgress, progressStage: progressStage });

        } else if (offset < 0) { //上拉
            // 根据参数 footerOutOffset 计算当前下滑的办百分比
            let progress = -offset < EPSILON ? 0 : -offset / this.footerOutOffset;
            let progressStage: UISuperSvProgressState;

            if (this.isLockFooter) {
                this.footerProgress = this.footerProgress == 1 ? this.footerProgress : Math.max(progress, 1);
                progressStage = UISuperSvProgressState.Lock;  //锁定状态
            } else {
                this.footerProgress = progress < this.footerProgress ? progress : this.footerProgress;
                progressStage = UISuperSvProgressState.Release;  //释放状态
            }
            this.emitPullUpEvent({ action: false, progress: this.footerProgress, progressStage: progressStage });

        } else if (offset == 0) {
            // 正常滑动时 如果没有锁定头和尾时 释放所有进度
            if (!this.isLockHeader && !this.isLockFooter) {
                this.clearProgress();
            }
        }
    }
    //#endregion
}
