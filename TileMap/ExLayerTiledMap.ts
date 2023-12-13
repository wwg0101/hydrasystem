// 扩展 tiledMap 
// 支持在对象层挂序列帧动画 tsx格式


import FwUtils from "../FwUtils";
import { List } from "../HydraComponents/HydraList";
import { TimerManager } from "../TimerManager";
import ExTiledMap from "./ExTiledMap";

const { ccclass, property } = cc._decorator;

class TiledAnimInfo {
    firstGid: number = 0;
    curFrame: number = 0;
    node: cc.Node = null;
    curTime: number = 0;
}

@ccclass
export default class ExLayerTiledMap extends ExTiledMap {
    _animInfos: TiledAnimInfo[] = [];

    start() {
        this.DelayLoad(0.1, "wall");
        this.DelayLoad(0.2, "buildingA", this.refreshIndex.bind(this));
        this.DelayLoad(0.3, "building", this.refreshIndex.bind(this));
        this.DelayLoad(0.4, "buildingB", this.refreshIndex.bind(this));
        this.DelayLoad(0.5, "top", () => {
            this.InitAnim();
        });
    }

    refreshIndex(node:cc.Node) {
        if (null == node) return;
        FwUtils.refreshMapGroup(node.getComponent(cc.TiledObjectGroup));
    }

    onDestroy() {
        for(let i = 0; i < this.timerIDList.length; ++i) {
            TimerManager.Instance().RemoveTimer(this.timerIDList[i]);
        }
        this.timerIDList.Clear();
    }

    private timerIDList : List<number> = new List<number>();
    private DelayLoad(delay : number, layer : string, cb : Function = null) {
        let timerID = TimerManager.Instance().AddTimer(delay, () => {
            this._buildOtherLayerAndGroup(layer);
            this.timerIDList.Remove(timerID);
            if (cb) cb(this.node.getChildByName(layer));
        });
        this.timerIDList.Add(timerID);
    }

    _buildOtherLayerAndGroup(layerName : string) {
        let tilesets = this._tilesets;
        let texGrids = this._texGrids;

        let layers = this._layers;
        let groups = this._groups;
        let images = this._images;

        let mapInfo = this._mapInfo;
        let node = this.node;
        let layerInfos = mapInfo.getAllChildren();
        let textures = this._textures;
        let maxWidth = 0;
        let maxHeight = 0;

        if (layerInfos && layerInfos.length > 0) {
            for (let i = 0, len = layerInfos.length; i < len; i++) {
                let layerInfo = layerInfos[i];
                let name = layerInfo.name;

                if(name != layerName) {
                    continue;
                }

                let child = this.node.getChildByName(name);
                if (!child) {
                    child = new cc.Node();
                    child.name = name;
                    node.addChild(child, i);
                }

                child.setSiblingIndex(i);
                child.active = layerInfo.visible;

                if (layerInfo instanceof cc.TMXLayerInfo) {
                    let layer = child.getComponent(cc.TiledLayer);
                    if (!layer) {
                        layer = child.addComponent(cc.TiledLayer);
                    }
                    
                    layer._init(layerInfo, mapInfo, tilesets, textures, texGrids);

                    // tell the layerinfo to release the ownership of the tiles map.
                    layerInfo.ownTiles = false;
                    layers.push(layer);
                }
                else if (layerInfo instanceof cc.TMXObjectGroupInfo) {
                    let group = child.getComponent(cc.TiledObjectGroup);
                    if (!group) {
                        group = child.addComponent(cc.TiledObjectGroup);
                    }
                    group._init(layerInfo, mapInfo, texGrids);
                    groups.push(group);
                }
                else if (layerInfo instanceof cc.TMXImageLayerInfo) {
                    let texture = layerInfo.sourceImage;
                    child.opacity = layerInfo.opacity;
                    child.layerInfo = layerInfo;
                    child._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);

                    let image = child.getComponent(cc.Sprite);
                    if (!image) {
                        image = child.addComponent(cc.Sprite);
                    }
                    
                    let spf = image.spriteFrame || new cc.SpriteFrame();
                    spf.setTexture(texture);
                    image.spriteFrame = spf;

                    child.width = texture.width;
                    child.height = texture.height;
                    images.push(child);
                }

                maxWidth = Math.max(maxWidth, child.width);
                maxHeight = Math.max(maxHeight, child.height);
            }
        }

        this.node.width = maxWidth;
        this.node.height = maxHeight;
        this._syncAnchorPoint();
    }

    _buildLayerAndGroup() {
        let tilesets = this._tilesets;
        let texGrids = this._texGrids;
        let animations = this._animations;
        texGrids.length = 0;
        for (let i = 0, l = tilesets.length; i < l; ++i) {
            let tilesetInfo = tilesets[i];
            if (!tilesetInfo) continue;
            cc.TiledMap.fillTextureGrids(tilesetInfo, texGrids, i);
        }
        this._fillAniGrids(texGrids, animations);

        let layers = this._layers;
        let groups = this._groups;
        let images = this._images;
        let oldNodeNames = {};
        for (let i = 0, n = layers.length; i < n; i++) {
            oldNodeNames[layers[i].node._name] = true;
        }
        for (let i = 0, n = groups.length; i < n; i++) {
            oldNodeNames[groups[i].node._name] = true;
        }
        for (let i = 0, n = images.length; i < n; i++) {
            oldNodeNames[images[i]._name] = true;
        }

        layers = this._layers = [];
        groups = this._groups = [];
        images = this._images = [];

        let mapInfo = this._mapInfo;
        let node = this.node;
        let layerInfos = mapInfo.getAllChildren();
        let textures = this._textures;
        let maxWidth = 0;
        let maxHeight = 0;

        if (layerInfos && layerInfos.length > 0) {
            for (let i = 0, len = layerInfos.length; i < len; i++) {
                let layerInfo = layerInfos[i];
                let name = layerInfo.name;

                let child = this.node.getChildByName(name);
                oldNodeNames[name] = false;

                if(name != "barrier" && name != "role" && name != "background") {
                    continue;
                }

                if (!child) {
                    child = new cc.Node();
                    child.name = name;
                    node.addChild(child, i);
                }

                child.setSiblingIndex(i);
                child.active = layerInfo.visible;

                if (layerInfo instanceof cc.TMXLayerInfo) {
                    let layer = child.getComponent(cc.TiledLayer);
                    if (!layer) {
                        layer = child.addComponent(cc.TiledLayer);
                    }
                    
                    layer._init(layerInfo, mapInfo, tilesets, textures, texGrids);

                    // tell the layerinfo to release the ownership of the tiles map.
                    layerInfo.ownTiles = false;
                    layers.push(layer);
                }
                else if (layerInfo instanceof cc.TMXObjectGroupInfo) {
                    let group = child.getComponent(cc.TiledObjectGroup);
                    if (!group) {
                        group = child.addComponent(cc.TiledObjectGroup);
                    }
                    group._init(layerInfo, mapInfo, texGrids);
                    groups.push(group);
                }
                else if (layerInfo instanceof cc.TMXImageLayerInfo) {
                    let texture = layerInfo.sourceImage;
                    child.opacity = layerInfo.opacity;
                    child.layerInfo = layerInfo;
                    child._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);

                    let image = child.getComponent(cc.Sprite);
                    if (!image) {
                        image = child.addComponent(cc.Sprite);
                    }
                    
                    let spf = image.spriteFrame || new cc.SpriteFrame();
                    spf.setTexture(texture);
                    image.spriteFrame = spf;

                    child.width = texture.width;
                    child.height = texture.height;
                    images.push(child);
                }

                maxWidth = Math.max(maxWidth, child.width);
                maxHeight = Math.max(maxHeight, child.height);
            }
        }

        let children = node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            let c = children[i];
            if (oldNodeNames[c._name]) {
                c.destroy();
            }
        }

        this.node.width = maxWidth;
        this.node.height = maxHeight;
        this._syncAnchorPoint();
    }
}
