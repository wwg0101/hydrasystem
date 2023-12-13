const { ccclass } = cc._decorator;
@ccclass
export default class ViewAdaptor extends cc.Component {
    constructor() {
        super();
    }
    viewType;
    cacheView;
    backgroundMask;
    backgroundOpacity;
    quickClose;
    renderOptimize;
    aniBlockInput;
    defaultAni;
    defineAnimationClips;
    playOpenAudio;
    openAduio;
    _openPlayed;
    _uiData;
    _prefabAssetMap;
    onOpen() { };
    lateOpen() { };
    onClose() { };
    lateClose() { };
    updateView() { };
    onClickClose() { };

    onKeyBackClose() { };
    closeSelf() { };
    setUIData(uiData) { };

    getUIData() { };
    close(ignoreAni) { };
    onLoad() { };

    Init() { };
    BeforePanelShow(bRollback, params) { };
    OnPanelShow() { };
    OnPanelHide() { };
    OnPanelRelease() { };

    onDestroy() { };

    start() { };

    // 加载自定义prefab
    loadPrefab(path, callback) { };

    // 释放自定义prefab
    releasePrefab(path) { };
    releaseAllPrefab() { };
    _initBackgroundMask() { };
    _initAnimationData() { };
    _initQucikClose() { };
    _playOpenAnimation() { };
    _playCloseAnimation(callback) { };

    _getBackground() { };

    _addBackground() { };
    _initBlockInput() { };
    playOpenSound() { };
    playCloseSound() { };
}