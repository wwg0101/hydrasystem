// jie ui的静态通用方法
declare let require;
import HDebug from "./HDebug";
import ExTiledMap from "./TileMap/ExTiledMap";
const ResManager = require("../app/utils/ResManager");

const { ccclass, property } = cc._decorator;

class SpineData {
    cacheMode?: any
    premultipliedAlpha?: any
    timeScale?: any
    play?: any
    skin?: any
}

@ccclass
export default class UiUtilsTM {

    ///**
    // * 动态加载SpriteFrame
    // * @param target 
    // * @param url 
    // * @param call 
    // * @param failCall 禁止在回调中调用该方法防止递归
    // * @param param 包含SizeMode 和 trim属性
    // */
    //public static loadSpriteFrameWithUrl(target: cc.Node | cc.Sprite, url: string, call?: Function, param?, failCall?: Function) {
    //    if (!target) {
    //        HDebug.Error("error loadSpriteFrameWithUrl target undefined");
    //        return;
    //    }
    //
    //    //@ts-ignore
    //    target._spUrl = url;
    //    ResManager.getInstance().loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
    //        if (err) {
    //            HDebug.Error("error:[loadSpriteFrameWithUrl] " + err.message);
    //            if (failCall) {
    //                failCall();
    //            }
    //            return;
    //        }
    //        if (!(target && target.isValid)) {
    //            return;
    //        }
    //
    //        //@ts-ignore
    //        if (target._spUrl != url) {
    //            return;
    //        }
    //
    //        let node: cc.Node = null;
    //        if (target instanceof cc.Node) {
    //            let sprite = target.getComponent(cc.Sprite);
    //            if (!sprite) {
    //                sprite = target.addComponent(cc.Sprite);
    //                if (null != param) {
    //                    if (null != param.SizeMode) {
    //                        sprite.sizeMode = param.SizeMode;
    //                    }
    //                    if (null != param.trim) {
    //                        sprite.trim = param.trim;
    //                    }
    //                }
    //            }
    //            sprite.spriteFrame = spriteFrame;
    //            node = target;
    //        }
    //
    //        if (target instanceof cc.Sprite) {
    //            target.spriteFrame = spriteFrame;
    //            node = target.node;
    //        }
    //
    //        // 销毁节点时自动释放资源
    //        let ar = node.getComponent(AutoReleaseComponent);
    //        if (!ar) {
    //            ar = node.addComponent(AutoReleaseComponent);
    //        }
    //        ar.setResUrl(url);
    //
    //        if (call) {
    //            call();
    //        }
    //
    //    });
    //}
    //
    //public static loadSpriteFrameRemoteWithUrl(target: cc.Node | cc.Sprite, url: string, call?: Function, param?, failCall?: Function) {
    //    if (!target) {
    //        HDebug.Error("error loadSpriteFrameWithUrl target undefined");
    //        return;
    //    }
    //
    //    //@ts-ignore
    //    target._spUrl = url;
    //    RemoteLoader.getInstance().loadImg(url, (err, spriteFrame) => {
    //        if (err) {
    //            HDebug.Error("error:[loadSpriteFrameWithUrl] " + err.message);
    //            if (failCall) {
    //                failCall();
    //            }
    //            return;
    //        }
    //        if (!(target && target.isValid)) {
    //            return;
    //        }
    //
    //        //@ts-ignore
    //        if (target._spUrl != url) {
    //            return;
    //        }
    //
    //        let node: cc.Node = null;
    //        if (target instanceof cc.Node) {
    //            let sprite = target.getComponent(cc.Sprite);
    //            if (!sprite) {
    //                sprite = target.addComponent(cc.Sprite);
    //                if (null != param) {
    //                    if (null != param.SizeMode) {
    //                        sprite.sizeMode = param.SizeMode;
    //                    }
    //                    if (null != param.trim) {
    //                        sprite.trim = param.trim;
    //                    }
    //                }
    //            }
    //            sprite.spriteFrame = spriteFrame;
    //            node = target;
    //        }
    //
    //        if (target instanceof cc.Sprite) {
    //            target.spriteFrame = spriteFrame;
    //            node = target.node;
    //        }
    //
    //        // 销毁节点时自动释放资源
    //        let ar = node.getComponent(AutoReleaseComponent);
    //        if (!ar) {
    //            ar = node.addComponent(AutoReleaseComponent);
    //        }
    //        ar.setResUrl(url);
    //
    //        if (call) {
    //            call();
    //        }
    //
    //    });
    //}
    //
    ///**
    // * 加载图集
    // * @param node 调用的节点
    // * @param path 图集路径
    // * @param cb 回调
    // */
    //public static loadAtlas(node: cc.Node, path: string, cb: Function) {
    //    if (!node) {
    //        HDebug.Error("error loadAtlas target undefined");
    //        return;
    //    }
    //    ResManager.getInstance().loadRes(path, cc.SpriteAtlas, (err, atlas) => {
    //        if (err) {
    //            HDebug.Error("error:[loadAtlas]", err);
    //            return;
    //        }
    //        if (!(node && node.isValid)) {
    //            return;
    //        }
    //        cb(atlas);
    //    })
    //}
    //
    //public static loadMaskSpriteFrame(target: cc.Mask, url: string, cb?: Function) {
    //    ResManager.getInstance().loadRes(url, cc.SpriteFrame, (err, sf) => {
    //        if (err) {
    //            HDebug.Error("error:[loadMaskSpriteFrame]", err);
    //            return;
    //        }
    //        if (!(target && target.isValid)) {
    //            return;
    //        }
    //        target.spriteFrame = sf;
    //        cb && cb();
    //    })
    //}
    //
    ///**
    // * 异步变同步 克隆node节点 可避免瞬间多个instantiate的开销
    // * @param cell 
    // */
    //public static instantiateCell(cell: cc.Node) {
    //    return new Promise<cc.Node>((resolve, reject) => {
    //        if (cell && cell.isValid) {
    //            let node = cc.instantiate(cell);
    //            resolve(node);
    //        }
    //        else {
    //            reject();
    //        }
    //    });
    //}
    //
    //public static createSpineWithUrlTemp(node: cc.Node, url: string, animationName: string, isLoop: boolean = false, playCall?: Function, data?: SpineData, loadSuccess?: Function) {
    //    this.createSpine(node, url, animationName, isLoop, playCall, data, loadSuccess);
    //}
    //
    ///**
    // * 动态创建加载 spine 不播放
    // * @param node 
    // * @param url 
    // * @param data 其他参数: cacheMode渲染模式、premultipliedAlpha、timescale
    // */
    //public static createSpineWithUrlNotPlay(node: cc.Node, url: string, data?: SpineData) {
    //    if (!data) {
    //        data = { };
    //    }
    //    data.play = false;
    //    this.createSpineWithUrl(node, url, "", false, null, null, data)
    //}
    //
    ///**
    // * 动态创建加载 spine
    // * @param node 
    // * @param url 
    // * @param animationName 
    // * @param isLoop 是否循环
    // * @param playCall 只播放一次的后的回调
    // * @param data 其他参数: cacheMode渲染模式、premultipliedAlpha、timescale、play是否设动画播放
    // */
    //public static createSpineWithUrl(node: cc.Node, url: string, animationName: string, isLoop: boolean = false, playCall?: Function, loadSuccess?: Function, data?: SpineData) {
    //    // spine统一放这个目录下
    //    url = "gb/res/spineAni/" + url;
    //    this.createSpine(node, url, animationName, isLoop, playCall, data, loadSuccess);
    //}
    //
    ///**
    // * 动态创建加载 spine
    // * @param node 
    // * @param url 
    // * @param animationName 
    // * @param isLoop 是否循环
    // * @param playCall 只播放一次的后的回调
    // * @param data 其他参数: cacheMode渲染模式、premultipliedAlpha、timescale、play是否设动画播放
    // */
    //public static createSpine(node: cc.Node, url: string, animationName: string, isLoop: boolean = false, playCall?: Function, data?: SpineData, loadSuccess?: Function) {
    //    if (!node) {
    //        HDebug.Error("error createSpine node undefined");
    //        return;
    //    }
    //    //@ts-ignore
    //    node._spineUrl = url;
    //
    //    RemoteLoader.getInstance().loadSpine(url, (err, res) => {
    //        if (err || !res) {
    //            HDebug.Error("error:[createSpineWithUrl]:", err);
    //            return;
    //        }
    //        if (!(node && node.isValid)) {
    //            return;
    //        }
    //
    //        //@ts-ignore
    //        if (node._spineUrl != url) {
    //            return;
    //        }
    //
    //        // 销毁节点时自动释放资源
    //        let ar = node.getComponent(AutoReleaseComponent);
    //        if (null == ar) {
    //            ar = node.addComponent(AutoReleaseComponent);
    //        }
    //        ar.setResUrl(url);
    //
    //        let spine = node.getComponent(sp.Skeleton);
    //        if (spine == undefined) {
    //            spine = node.addComponent(sp.Skeleton);
    //        }
    //        else {
    //            spine.clearTrack(0);
    //            spine.setToSetupPose();
    //        }
    //
    //        // 设置缓存模式
    //        if (data && data.cacheMode != undefined) {
    //            let mode = data.cacheMode;
    //            spine.setAnimationCacheMode(mode);
    //        }
    //
    //        // 设置预乘
    //        if (data && data.premultipliedAlpha != undefined) {
    //            spine.premultipliedAlpha = data.premultipliedAlpha;
    //        }
    //
    //        // 设置timescale
    //        if (data && data.timeScale != undefined) {
    //            spine.timeScale = data.timeScale;
    //        }
    //
    //        spine.skeletonData = res;
    //
    //        let play = true;
    //        if (data && data.play != undefined) {
    //            play = data.play;
    //        }
    //        if (play) {
    //            spine.setAnimation(0, animationName, isLoop);
    //            // 设置setSkin
    //            if (data && data.skin) {
    //                UiUtils.setSpineSkin(spine, data.skin);
    //            }
    //
    //            // 只播放一次 回调
    //            if (!isLoop) {
    //                if (playCall) {
    //                    spine.setCompleteListener((trackEntry, loopCount) => {
    //                        let name = trackEntry.animation ? trackEntry.animation.name : "";
    //                        if (name == animationName) {
    //                            playCall(spine);
    //                        }
    //                    });
    //                }
    //            }
    //        }
    //
    //        //@ts-ignore
    //        // spine._updateSkeletonData();
    //
    //        if (loadSuccess) loadSuccess();
    //    });
    //}
    //
    ///**
    // * spine setSkin
    // * @param spine 
    // * @param skin 
    // */
    //public static setSpineSkin(spine: sp.Skeleton, skinName: string) {
    //    spine.scheduleOnce(() => {
    //        if (skinName == undefined) {
    //            return;
    //        }
    //        if (spine.skeletonData &&
    //            spine.skeletonData.skeletonJson &&
    //            spine.skeletonData.skeletonJson.skins) {
    //            let keys = Object.keys(spine.skeletonData.skeletonJson.skins);
    //            if (!keys.includes(skinName)) {
    //                return;
    //            }
    //            spine.setSkin(skinName);
    //        }
    //    }, 0);
    //}
    //
    ///**
    // * spine直接切动作
    // * @param node 
    // * @param ani 
    // * @param isLoop 
    // */
    //public static changeSpineAnimation(node: cc.Node, ani: string, isLoop: boolean = false) {
    //    if (node && node.isValid) {
    //        let component = node.getComponent(sp.Skeleton);
    //        if (component) {
    //            component.clearTrack(0);
    //            component.setToSetupPose();
    //            component.setAnimation(0, ani, isLoop)
    //        }
    //    }
    //}
    //
    ///**
    // * load 预制体
    // * @param url 
    // * @param call 
    // */
    //public static loadPrefab(parent: cc.Node, url: string, call?: Function) {
    //    ResManager.getInstance().loadRes(url, cc.Prefab, (error, res) => {
    //        if (error) {
    //            call && call(error, null);
    //            return;
    //        }
    //
    //        let viewNode: cc.Node = cc.instantiate(res);
    //        // 暂时注释 预制体的释放管理
    //        // let ar = viewNode.addComponent(AutoReleaseComponent);
    //        // ar.setResUrl(url);
    //        if (parent && parent.isValid) {
    //            call && call(null, viewNode);
    //        }
    //        else {
    //            HDebug.Error("!! loadPrefab parent无效 " + url);
    //        }
    //    });
    //}
    //
    ///**
    // * load 预制体 豪哥專用
    // * @param url 
    // * @param call 
    // */
    //public static loadPrefab5000(parent: cc.Node, url: string, call?: Function) {
    //    ResManager.getInstance().loadRes(url, cc.Prefab, (error, res) => {
    //        if (error) {
    //            call && call(error, null);
    //            return;
    //        }
    //
    //        let viewNode: cc.Node = cc.instantiate(res);
    //        // 暂时注释 预制体的释放管理
    //        // let ar = viewNode.addComponent(AutoReleaseComponent);
    //        // ar.setResUrl(url);
    //        call && call(null, viewNode);
    //    });
    //}
    //
    ///**
    // * load 预制体 同步写法
    // * @param url 
    // * @param call 
    // */
    //public static async loadPrefabPromise(url: string) {
    //    let prefab = await this.loadResPromise(url, cc.Prefab);
    //    let viewNode: cc.Node = cc.instantiate(prefab);
    //    return viewNode;
    //}
    //
    ///**
    // * 异步变同步 载入单个资源
    // * @param path 
    // * @param type 
    // */
    //public static loadResPromise<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>> {
    //    return new Promise(res => {
    //        ResManager.getInstance().loadRes(path, type, (err, resource) => {
    //            if (err) {
    //                res(null)
    //            } else {
    //                res(resource)
    //            }
    //        })
    //    })
    //}
    //
    /**
     * load tiledmap
     * @param node 需要注意的是node必须要传进来，而且得在调用这个方法之前parent设置好
     * @param url 
     * @param call 
     */
    public static loadTiledMap(node: cc.Node, url: string, callBack?: Function, failCallback?: Function) {
        ResManager.getInstance().loadResource(url, cc.TiledMapAsset, (err, mapAsset) => {
            if (err) {
                HDebug.Error(err);
                failCallback && failCallback();
                return;
            }
    
            let tiledMap = node.getComponent(ExTiledMap);
            if (tiledMap == undefined) {
                tiledMap = node.addComponent(ExTiledMap);
            }
            tiledMap.tmxAsset = mapAsset;
    
            // let ar = node.addComponent(AutoReleaseComponent);
            // ar.setResUrl(url);
            callBack && callBack(node);
        });
    }
    ///**
    //* load tiledmap
    //* @param node 需要注意的是node必须要传进来，而且得在调用这个方法之前parent设置好
    //* @param url 
    //* @param call 
    //*/
    //public static loadTiledMapByLayer(node: cc.Node, url: string, callBack?: Function, failCallback?: Function) {
    //    ResManager.getInstance().loadRes(url, cc.TiledMapAsset, (err, mapAsset) => {
    //        if (err) {
    //            HDebug.Error(err);
    //            failCallback && failCallback();
    //            return;
    //        }
    //
    //        if (GlobalData.zhulexianggive5000) {
    //            //快速加载地图
    //            let tiledMap = node.getComponent(ExLayerTiledMap);
    //            if (tiledMap == undefined) {
    //                tiledMap = node.addComponent(ExLayerTiledMap);
    //            }
    //            tiledMap.tmxAsset = mapAsset;
    //        }
    //        else {
    //            let tiledMap = node.getComponent(ExTiledMap);
    //            if (tiledMap == undefined) {
    //                tiledMap = node.addComponent(ExTiledMap);
    //            }
    //            tiledMap.tmxAsset = mapAsset;
    //        }
    //
    //        callBack && callBack(node);
    //    });
    //}
    //
    ///**
    // * 动态创建加载particle
    // * 
    // */
    //public static createParticleWithUrl(node: cc.Node, url: string) {
    //    ResManager.getInstance().loadRes(url, cc.ParticleAsset, function (err, res) {
    //        if (err) {
    //            return;
    //        }
    //
    //        // 销毁节点时自动释放资源
    //        let ar = node.addComponent("AutoReleaseComponent");
    //        ar.setResUrl(url);
    //
    //        let component = node.getComponent(cc.ParticleSystem);
    //        if (!component) {
    //            component = node.addComponent(cc.ParticleSystem);
    //        }
    //        component.file = res;
    //        component.resetSystem();
    //    });
    //}
    //
    ///**
    // * spine换装
    // * @param ani 
    // * @param tex2d 
    // * @param slotsName 
    // */
    //public static changeSpineAttach(ani: sp.Skeleton, spriteFrame: cc.SpriteFrame, slotsName: string) {
    //    let slot: sp.spine.Slot = ani.findSlot(slotsName);
    //    let attachment: sp.spine.RegionAttachment = slot.getAttachment() as sp.spine.RegionAttachment;
    //    if (!slot || !attachment) {
    //        HDebug.Error('error没有该slot');
    //        return;
    //    }
    //
    //    let tex2d = spriteFrame.getTexture();
    //    if (cc.sys.isNative) {
    //        //@ts-ignore
    //        let jsbTex = new middleware.Texture2D();
    //        jsbTex.setPixelsHigh(tex2d.height);
    //        jsbTex.setPixelsWide(tex2d.width);
    //        jsbTex.setNativeTexture(tex2d.getImpl());
    //        //@ts-ignore
    //        ani.updateRegion(slotsName, jsbTex);
    //    } else {
    //        //@ts-ignore
    //        let skeletonTexture = new sp.SkeletonTexture();
    //        skeletonTexture.setRealTexture(tex2d);
    //
    //        let region: sp.spine.TextureAtlasRegion = attachment.region as sp.spine.TextureAtlasRegion;
    //        region.u = 0;
    //        region.v = 0;
    //        region.u2 = 1;
    //        region.v2 = 1;
    //        region.width = tex2d.width;
    //        region.height = tex2d.height;
    //        region.originalWidth = tex2d.width;
    //        region.originalHeight = tex2d.height;
    //        region.rotate = false;
    //        region.texture = skeletonTexture;
    //        region.page = null;
    //        attachment.width = region.width;
    //        attachment.height = region.height;
    //
    //        // const texture = sprite_frame.getTexture();
    //        // let rect = sprite_frame.getRect()
    //        // let isrotated = sprite_frame.isRotated()
    //        // let offset = sprite_frame.getOffset();
    //        // let original_size = sprite_frame.getOriginalSize()
    //
    //        // let skeletonTexture = new sp.SkeletonTexture();
    //        // skeletonTexture.setRealTexture(texture);
    //        // let page = new sp.spine.TextureAtlasPage();
    //        // page.name = texture.name;
    //        // page.uWrap = sp.spine.TextureWrap.ClampToEdge;
    //        // page.vWrap = sp.spine.TextureWrap.ClampToEdge;
    //        // page.texture = skeletonTexture;
    //        // page.texture.setWraps(page.uWrap, page.vWrap);
    //        // page.width = rect.width;
    //        // page.height = rect.height;
    //        // let region = new sp.spine.TextureAtlasRegion();
    //        // region.page = page;
    //        // region.rotate = isrotated;
    //        // region.x = rect.x;
    //        // region.y = rect.y;
    //        // region.offsetX = offset.x
    //        // region.offsetY = offset.y;
    //        // region.width = rect.width;
    //        // region.height = rect.height;
    //        // region.originalWidth = original_size.width;
    //        // region.originalHeight = original_size.height;
    //        // region.u = rect.x / texture.width;
    //        // region.v = (rect.y) / texture.height;
    //        // region.u2 = (rect.x + rect.width) / texture.width;
    //        // region.v2 = (rect.y + rect.height) / texture.height;
    //        // region.texture = skeletonTexture;
    //
    //        attachment.setRegion(region);
    //        attachment.updateOffset();
    //        slot.setAttachment(attachment);
    //    }
    //
    //    // 缓存模式下需要刷新缓存
    //    ani.invalidAnimationCache();
    //}
    //
    ///**
    // * 分帧执行 Generator 逻辑
    // *
    // * @param generator 生成器
    // * @param duration 持续时间（ms），每次执行 Generator 的操作时，最长可持续执行时长。
    // * 假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
    // */
    public static exeGenerator(target: cc.Component, generator: Generator, duration: number) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间
                let startTime = new Date().getTime();
    
                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {
                    // 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve(null);
                        return;
                    }
    
                    // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        target.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };
            // 运行执行函数
            execute();
        });
    }
    //
    ///**
    // * 传一个节点 让这个节点自己变大变小
    // * @param node 
    // * @param smallScale 缩小的比例
    // * @param bigScale 放大的比例
    // * @param duration 变大变小的循环时间
    // */
    //public static scaleRepeat(node: cc.Node, smallScale: number = 0.8, bigScale: number = 1.2, duration: number = 1) {
    //    if (null != node) {
    //        var scaleX = node.scaleX,
    //            scaleY = node.scaleY;
    //        node.scaleX = scaleX * smallScale;
    //        node.scaleY = scaleY * smallScale;
    //        node.runAction(
    //            cc.repeatForever(
    //                cc.sequence(
    //                    cc.scaleTo(duration, scaleX * bigScale, scaleY * bigScale),
    //                    cc.scaleTo(duration, scaleX * smallScale, scaleY * smallScale)
    //                )
    //            )
    //        );
    //    }
    //}
    //
    //public static floatPos(node, deltaX: number = 0, deltaY: number = 0, deltaTime: number = 1) {
    //    void 0 === deltaX && (deltaX = 0);
    //    void 0 === deltaY && (deltaY = 0);
    //    void 0 === deltaTime && (deltaTime = 1);
    //    if (null != node) {
    //        if (node.orgx) {
    //            node.x = node.orgx;
    //            node.y = node.orgy;
    //        } else {
    //            node.orgx = node.x;
    //            node.orgy = node.y;
    //        }
    //        node.x = node.orgx + deltaX;
    //        node.y = node.orgy + deltaY;
    //        node.runAction(
    //            cc.repeatForever(
    //                cc.sequence(
    //                    cc.moveTo(deltaTime, node.orgx - deltaX, node.orgy - deltaY),
    //                    cc.moveTo(deltaTime, node.orgx + deltaX, node.orgy + deltaY)
    //                )
    //            )
    //        );
    //    }
    //}
    //
    ///**
    // * 传一个节点让他渐隐渐显
    // * @param node 
    // * @param minOpacity 渐隐时的目标透明度
    // * @param maxOpacity 渐显是的目标透明度
    // * @param duration 渐隐/渐显的时间
    // */
    //public static fadeRepeat(node: cc.Node, minOpacity: number = 0, maxOpacity: number = 255, duration: number = 1) {
    //    void 0 === minOpacity && (minOpacity = 0);
    //    void 0 === maxOpacity && (maxOpacity = 255);
    //    void 0 === duration && (duration = 1);
    //    if (null != node) {
    //        node.opacity = minOpacity;
    //        node.runAction(
    //            cc.repeatForever(
    //                cc.sequence(cc.fadeTo(duration, maxOpacity), cc.fadeTo(duration, minOpacity))
    //            )
    //        );
    //    }
    //}
    //
    ///**
    // * 让节点在duration时间内变成targetOpacity
    // * @param node 
    // * @param targetOpacity 
    // * @param duration 
    // */
    //public static fadeOver(node: cc.Node, targetOpacity: number = 0, duration: number = 1) {
    //    void 0 === targetOpacity && (targetOpacity = 0);
    //    void 0 === duration && (duration = 1);
    //    null != node && node.runAction(cc.fadeTo(duration, targetOpacity));
    //}
    //
    //public static showFillChange(img: cc.Sprite, oldValue: number = 0, newValue: number = 1, circleNum: number = 1, indexN: number = 5, endCB?) {
    //    void 0 === oldValue && (oldValue = 0);
    //    void 0 === newValue && (newValue = 1);
    //    void 0 === circleNum && (circleNum = 1);
    //    void 0 === indexN && (indexN = 5);
    //    if (null != img) {
    //        oldValue = oldValue;
    //        newValue = null != newValue ? newValue : 1;
    //        img.fillRange = oldValue;
    //        if (oldValue != newValue) {
    //            //@ts-ignore
    //            img.numIndex = 1;
    //            img.unscheduleAllCallbacks();
    //            img.schedule(fillChangeFunc, 0.04);
    //            fillChangeFunc();
    //        }
    //        else {
    //            endCB && endCB();
    //        }
    //    }
    //    function fillChangeFunc() {
    //        //@ts-ignore
    //        let curNumIndex = img.numIndex++;
    //        let prgRate = oldValue + ((newValue - oldValue) / indexN) * ((curNumIndex % indexN) + 1);
    //        prgRate = (prgRate = prgRate < 0.005 ? 0 : prgRate) > 1 ? 1 : prgRate;
    //        img.fillRange = prgRate;
    //        if (curNumIndex + 1 >= indexN * circleNum) {
    //            img.unscheduleAllCallbacks();
    //            endCB && endCB();
    //        }
    //    }
    //}
    //
    ///**
    // * 进度条变化
    // * @param progressBar 
    // * @param oldValue 
    // * @param newValue 
    // * @param circleNum 
    // * @param indexN 
    // * @param endCB 
    // */
    //public static showPrgChange(progressBar, oldValue: number = 0, newValue: number = 1, circleNum: number = 1, indexN: number = 5, endCB?) {
    //    void 0 === oldValue && (oldValue = 0);
    //    void 0 === newValue && (newValue = 1);
    //    void 0 === circleNum && (circleNum = 1);
    //    void 0 === indexN && (indexN = 5);
    //    if (null != progressBar) {
    //        indexN = indexN;
    //        circleNum = circleNum;
    //        oldValue = oldValue;
    //        newValue = null != newValue ? newValue : 1;
    //        progressBar.progress = oldValue;
    //        if (oldValue != newValue) {
    //            progressBar.numIndex = 1;
    //            progressBar.unscheduleAllCallbacks();
    //            progressBar.schedule(prgChange, 0.04);
    //            prgChange();
    //        }
    //        else {
    //            endCB && endCB();
    //        }
    //    }
    //    function prgChange() {
    //        var curIndex = progressBar.numIndex++,
    //            rate = oldValue + ((newValue - oldValue) / indexN) * ((curIndex % indexN) + 1);
    //        rate = (rate = rate < 0.0001 ? 0 : rate) > 1 ? 1 : rate;
    //        progressBar.progress = rate;
    //        if (curIndex + 1 >= indexN * circleNum) {
    //            progressBar.unscheduleAllCallbacks();
    //            endCB && endCB();
    //        }
    //    }
    //}
    //
    ///**
    // * 让文字一个个出现
    // * @param lblText 
    // * @param str 
    // * @param speed 
    // * @param cb 
    // */
    //public static showText(lblText, str, speed, cb) {
    //    void 0 === speed && (speed = 0.1);
    //    if (null != lblText && "" != str && 0 != str.length)
    //        if (1 != str.length) {
    //            lblText.string = "";
    //            lblText.unscheduleAllCallbacks();
    //            lblText.isRunShowText = !0;
    //            lblText.context = str;
    //            lblText.schedule(showFunc, speed);
    //            showFunc();
    //        } else {
    //            lblText.unscheduleAllCallbacks();
    //            lblText.isRunShowText = !1;
    //            cb && cb();
    //            lblText.string = str;
    //        }
    //    function showFunc() {
    //        var textLength = lblText.string ? lblText.string.length : 0;
    //        if (textLength < str.length) lblText.string = str.substring(0, textLength + 1);
    //        else {
    //            lblText.unscheduleAllCallbacks();
    //            lblText.isRunShowText = !1;
    //            cb && cb();
    //        }
    //    }
    //}
    //
    ///**
    // * 好像是个支持richtext的让文字一个个蹦出来的方法？
    // * @param richText 
    // * @param str 
    // * @param speed 
    // * @param cb 
    // */
    //public static showRichText(richText, str, speed, cb) {
    //    void 0 === speed && (speed = 0.1);
    //    if (null != richText && "" != str && 0 != str.length) {
    //        if (1 != str.length) {
    //            richText.string = "";
    //            richText.unscheduleAllCallbacks();
    //            richText.isRunShowText = true;
    //            richText.context = str;
    //            richText.schedule(show, speed);
    //            show();
    //        } else {
    //            richText.unscheduleAllCallbacks();
    //            richText.isRunShowText = false;
    //            cb && cb();
    //            richText.string = str;
    //        }
    //    }
    //    function show() {
    //        var strLength = richText.string ? richText.string.length : 0;
    //        if (strLength < str.length) {
    //            var count = 0;
    //            var isBreak = false;
    //            if ("<" == str.charAt(strLength)) {
    //                count++;
    //
    //                for (var i = strLength + 1; i < str.length; i++) {
    //                    if (isBreak) {
    //                        break;
    //                    }
    //                    if ("<" == str.charAt(i) && "/" != str.charAt(i + 1)) {
    //                        count++;
    //                    }
    //
    //                    if ("<" == str.charAt(i) && "/" == str.charAt(i + 1)) {
    //                        count--;
    //
    //                        if (count == 0) {
    //                            for (var j = i + 1; j < str.length; j++) {
    //                                if (">" == str.charAt(j)) {
    //                                    strLength = j;
    //                                    isBreak = true;
    //                                    break;
    //                                }
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //            richText.string = str.substring(0, strLength + 1);
    //
    //        } else {
    //            richText.unscheduleAllCallbacks();
    //            richText.isRunShowText = false;
    //            cb && cb();
    //        }
    //    }
    //}
    //
    //public static getVerticalName(name: string): string {
    //    let nameStr = "";
    //    if (null != name) {
    //        for (let charIndex = 0; charIndex < name.length; charIndex++) {
    //            nameStr += name.charAt(charIndex);
    //            if (charIndex < name.length - 1) {
    //                nameStr += "\n";
    //            }
    //        }
    //    }
    //    return nameStr;
    //}
    ////
    //
    private static shakeArr = [[1, 1], [-1, -1], [-1, 1], [1, -1]];
    //Comp-compenent，ShakeParam-振幅参数，o-震动次数，i-结束回调
    /**
     * 
     * @param Comp compenent
     * @param ShakeParam 振幅参数
     * @param ShakeNumber 震动次数
     * @param callback 结束回调
     */
    public static showShake(Comp, ShakeParam: number = 4, ShakeNumber: number = 12, callback?) {
        void 0 === ShakeParam && (ShakeParam = 4);
        void 0 === ShakeNumber && (ShakeNumber = 12);
        if (null != Comp) {
            if (Comp.orgx) {
                Comp.node.x = Comp.orgx;
                Comp.node.y = Comp.orgy;
            } else {
                Comp.orgx = Comp.node.x;
                Comp.orgy = Comp.node.y;
            }
            Comp.numIndex = 1;
            Comp.unscheduleAllCallbacks();
            Comp.schedule(shake, 0.04);
            shake();
        }
        function shake() {
            let curIndex = Comp.numIndex++;
            let processIndex = (ShakeNumber - curIndex) / ShakeNumber;
            let modIndex = curIndex % 4;
            Comp.node.x = UiUtilsTM.shakeArr[modIndex][0] * processIndex * ShakeParam + Comp.orgx;
            Comp.node.y = UiUtilsTM.shakeArr[modIndex][1] * processIndex * ShakeParam + Comp.orgy;
            if (curIndex >= ShakeNumber) {
                Comp.node.x = Comp.orgx;
                Comp.node.y = Comp.orgy;
                Comp.unscheduleAllCallbacks();
                callback && callback();
            }
        }
    }

     //Comp-compenent，ShakeParam-振幅参数，o-震动次数，i-结束回调
    /**
     * 
     * @param Comp compenent
     * @param ShakeParam 振幅参数
     * @param ShakeNumber 震动次数
     * @param callback 结束回调
     */
     public static showShakeDyn(Comp, ShakeParam: number = 4, ShakeNumber: number = 12, callback?) {
        void 0 === ShakeParam && (ShakeParam = 4);
        void 0 === ShakeNumber && (ShakeNumber = 12);
        if (null != Comp) {
            Comp.orgx = Comp.node.x;
            Comp.orgy = Comp.node.y;
            Comp.numIndex = 1;
            Comp.unscheduleAllCallbacks();
            Comp.schedule(shake, 0.04);
            shake();
        }
        function shake() {
            let curIndex = Comp.numIndex++;
            let processIndex = (ShakeNumber - curIndex) / ShakeNumber;
            let modIndex = curIndex % 4;
            Comp.node.x = UiUtilsTM.shakeArr[modIndex][0] * processIndex * ShakeParam + Comp.orgx;
            Comp.node.y = UiUtilsTM.shakeArr[modIndex][1] * processIndex * ShakeParam + Comp.orgy;
            if (curIndex >= ShakeNumber) {
                Comp.node.x = Comp.orgx;
                Comp.node.y = Comp.orgy;
                Comp.unscheduleAllCallbacks();
                callback && callback();
            }
        }
    }

    //Node-震动node，ShakeParam-振幅参数，ShakeNumber-震动次数，callback-结束回调
    /**
     * 
     * @param Node 震动node
     * @param ShakeParam 振幅参数
     * @param ShakeNumber 震动次数
     * @param callback 结束回调
     */
    public static showShakeNode(Node, ShakeParam: number = 4, ShakeNumber: number = 12, callback?) {
        void 0 === ShakeParam && (ShakeParam = 4);
        void 0 === ShakeNumber && (ShakeNumber = 12);
        if (null != Node) {
            var component = Node.getComponent(cc.Component);

            if (component) {
                this.showShake(component, ShakeParam, ShakeNumber, callback);
            } else {
                HDebug.Error("空component，请检查");
                callback && callback();
            }
        }
    }
    
   //Node-震动node，ShakeParam-振幅参数，ShakeNumber-震动次数，callback-结束回调
    /**
     * 
     * @param Node 震动node
     * @param ShakeParam 振幅参数
     * @param ShakeNumber 震动次数
     * @param callback 结束回调
     */
     public static showShakeNodeDyn(Node, ShakeParam: number = 4, ShakeNumber: number = 12, callback?) {
        void 0 === ShakeParam && (ShakeParam = 4);
        void 0 === ShakeNumber && (ShakeNumber = 12);
        if (null != Node) {
            var component = Node.getComponent(cc.Component);

            if (component) {
                this.showShakeDyn(component, ShakeParam, ShakeNumber, callback);
            } else {
                HDebug.Error("空component，请检查");
                callback && callback();
            }
        }
    }

    //
    ///**
    // * 战斗用的shake还得带透明度变化效果
    // * @param Node 震动node 
    // * @param ShakeParam 振幅参数
    // * @param ShakeNumber 震动次数
    // */
    //public static showBattleShakeNode(Node, ShakeParam: number = 4, ShakeNumber: number = 6) {
    //    void 0 === ShakeParam && (ShakeParam = 4);
    //    void 0 === ShakeNumber && (ShakeNumber = 6);
    //
    //    if (null != Node) {
    //        Node.orgx = Node.x;
    //        Node.orgy = Node.y;
    //        Node.opacity = 150;
    //        let children = Node.getComponentsInChildren(sp.Skeleton);
    //        for (let i = 0; i < children.length; i++) {
    //            children[i].node.color = cc.Color.WHITE.fromHEX("#969696");
    //        }
    //        Node.numIndex = 1;
    //        Node.getComponent(cc.Component).unscheduleAllCallbacks();
    //        Node.getComponent(cc.Component).schedule(shake, 0.08);
    //        shake();
    //    }
    //    function shake() {
    //        let curIndex = Node.numIndex++;
    //        let processIndex = (ShakeNumber - curIndex) / ShakeNumber;
    //        let modIndex = curIndex % 4;
    //        Node.x = UiUtils.shakeArr[modIndex][0] * processIndex * ShakeParam + Node.orgx;
    //        Node.y = UiUtils.shakeArr[modIndex][1] * processIndex * ShakeParam + Node.orgy;
    //        if (Node.opacity == 255) {
    //            Node.opacity = 150
    //            var children = Node.getComponentsInChildren(sp.Skeleton);
    //            for (var i = 0; i < children.length; i++) {
    //                children[i].node.color = cc.Color.WHITE.fromHEX("#969696");
    //            }
    //        }
    //        else {
    //            Node.opacity = 255
    //            var children = Node.getComponentsInChildren(sp.Skeleton);
    //            for (var i = 0; i < children.length; i++) {
    //                children[i].node.color = cc.Color.WHITE.fromHEX("#ffffff");
    //            }
    //        }
    //        if (curIndex >= ShakeNumber) {
    //            Node.x = Node.orgx;
    //            Node.y = Node.orgy;
    //            Node.opacity = 255;
    //            var children = Node.getComponentsInChildren(sp.Skeleton);
    //            for (var i = 0; i < children.length; i++) {
    //                children[i].node.color = cc.Color.WHITE.fromHEX("#ffffff");
    //            }
    //            Node.getComponent(cc.Component).unscheduleAllCallbacks();
    //        }
    //    }
    //}
    //
    //public static moveNodeToPos(node, pos, speed, callback, target) {
    //    let finished = cc.callFunc(() => {
    //        if (callback && target) {
    //            callback.call(target, node);
    //        }
    //    }, target);
    //    let action = cc.sequence(cc.moveTo(speed, pos), finished);
    //    node.runAction(action);
    //}
    //
    //public static moveNodeToPosByPromise(node, pos, speed) {
    //    return new Promise(resolve => {
    //        this.moveNodeToPos(node, pos, speed, (node) => {
    //            resolve(node);
    //        }, this)
    //    });
    //}
    //
    //public static transferByFadeIn(node, endFunc, thiz, constime?) {
    //    if (!node) {
    //        HDebug.Error(`fadeNode error, not node`)
    //        return;
    //    }
    //    node.stopActionByTag(1);
    //    constime = constime || .3;
    //    node.active = true;
    //    // upengine czx
    //    // node.setOpacityModifyRGB(true);
    //    node.opacity = 255;
    //    let endTransfer = cc.callFunc(() => {
    //        if (endFunc && thiz) endFunc.call(thiz, node);
    //    })
    //    let act = cc.sequence(cc.fadeOut(constime), endTransfer);
    //    act.setTag(1);
    //    node.runAction(act);
    //}
    //
    //public static transferByFadeOut(node, endFunc?, thiz?, constime?) {
    //    if (!node) {
    //        HDebug.Error(`fadeNode error, not node`)
    //        return;
    //    }
    //    node.stopActionByTag(2);
    //    constime = constime || .3;
    //    // upengine czx
    //    // node.setOpacityModifyRGB(true);
    //    node.active = true;
    //    node.opacity = 0;
    //    let endTransfer = cc.callFunc(() => {
    //        if (endFunc && thiz) endFunc.call(thiz, node);
    //    })
    //    let act = cc.sequence(cc.fadeIn(constime), endTransfer);
    //    act.setTag(2);
    //    node.runAction(act);
    //}
    //
    //public static scaleFromPoint(node, startPos, endPos, startScale, endScale, func, thiz, time) {
    //    let sPos = node.parent.convertToNodeSpaceAR(startPos),
    //        ePos = node.parent.convertToNodeSpaceAR(endPos);
    //    node.scale = startScale;
    //    node.position = cc.v3(sPos.x, sPos.y, sPos.z);
    //    if (node) {
    //        let fAni = cc.tween(node).to(time, {
    //            scale: endScale,
    //            position: cc.v3(ePos.x, ePos.y, ePos.z),
    //            easing: 'sineIn'
    //        }).call(() => {
    //            func && thiz && func.call(thiz);
    //        })
    //        fAni.start();
    //    }
    //}
    //
    //public static scaleRepeatAction(node, call?, target?, t?) {
    //    if (!node) return
    //    let sx = node.scaleX,
    //        sy = node.scaleY,
    //        eSx = sx * .8,
    //        eSy = .8 * sy,
    //        time = t || .2;
    //    if (!node.active) node.active = true
    //    let act = cc.scaleTo(time, sx, sy)
    //    let act2 = cc.scaleTo(time * 1.5, eSx, eSy)
    //    let sq = cc.sequence(act, act2)
    //    let repeat = sq.repeat(2);
    //    let call1 = cc.callFunc(() => {
    //        node.scaleX = sx
    //        node.scaleY = sy
    //        if (call && target) call.call(target, node);
    //    });
    //    let sq2 = cc.sequence(repeat, call1)
    //    return node.runAction(sq2)
    //}
    //
    //public static bubbleNodeForever(node) {
    //    if (!node) {
    //        HDebug.Error("bubbleNodeForever is not node!");
    //        return;
    //    }
    //    let upDis = cc.v2(0, 8);
    //    let downDis = cc.v2(0, -5);
    //    let startPos = node.position;
    //    let act = cc.moveTo(.7, startPos.addSelf(upDis));
    //    let act1 = cc.moveTo(.7, startPos.addSelf(downDis));
    //    let act2 = cc.sequence(act, act1).repeatForever();
    //    node.runAction(act2);
    //    return node;
    //}
    //
    //public static fadeNodeForever(node) {
    //    if (!node) {
    //        HDebug.Error("fadeNodeForever is not node!");
    //        return;
    //    }
    //    node.opacity = 255;
    //    let act = cc.fadeOut(.3);
    //    let act1 = cc.fadeIn(.35);
    //    let act2 = cc.sequence(act, act1).repeatForever();
    //    node.runAction(act2);
    //    return node;
    //}
    //
    //public static fadeRepeatNode(node, callback, thiz) {
    //    if (!node) {
    //        HDebug.Error("fadeNodeForever is not node!");
    //        return;
    //    }
    //    node.opacity = 255;
    //    let act = cc.fadeOut(.1);
    //    let act1 = cc.fadeIn(.15);
    //    let act2 = cc.sequence(act, act1).repeat(3);
    //    let call1 = cc.callFunc(() => {
    //        if (callback && thiz) callback.call(thiz, node);
    //    });
    //    let sq = cc.sequence(act2, call1);
    //    return node.runAction(sq);
    //}
}