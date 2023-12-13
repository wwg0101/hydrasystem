// 扩展 tiledMap 
// 支持在对象层挂序列帧动画 tsx格式

const { ccclass, property } = cc._decorator;

class TiledAnimInfo {
    firstGid: number = 0;
    curFrame: number = 0;
    node: cc.Node = null;
    curTime: number = 0;
}

@ccclass
export default class ExTiledMap extends cc.TiledMap {
    _animInfos: TiledAnimInfo[] = [];

    start() {
        this.InitAnim();
    }

    protected InitAnim() {
        let animations = this["_animations"];
        let objGroups = this.getObjectGroups();
        for (let i = 0, len = objGroups.length; i < len; ++i) {
            let group = objGroups[i];
            let objs = group.getObjects();
            for (let j = 0, objLen = objs.length; j < objLen; j++) {
                let obj = objs[j];
                let gid = obj.gid;
                if (gid && animations[gid]) {
                    let node = group.node.getChildByName("img" + obj.id);
                    if (node) {
                        let info = new TiledAnimInfo();
                        info.firstGid = gid;
                        info.node = node;
                        this._animInfos.push(info);
                    }
                }
            }
        }
    }

    update(dt) {
        let animations = this["_animations"];

        for (let index = 0, len = this._animInfos.length; index < len; index++) {
            let info = this._animInfos[index];
            info.curTime += dt;
            let frames = animations[info.firstGid].frames;
            let gidDuration = frames[info.curFrame].duration;
            if (info.curTime > gidDuration) {
                info.curTime = 0;
                info.curFrame++;
                if(info.curFrame >= frames.length){
                    info.curFrame = 0;
                }

                let grid = frames[info.curFrame].grid;
                let sp = info.node.getComponent(cc.Sprite);
                let spf = sp.spriteFrame;
                spf.setTexture(grid.tileset.sourceImage, cc.rect(grid));
                sp.spriteFrame = spf;
                sp.setVertsDirty();
            }
        }

        super.update(dt);
    }
}
