// jie 资源管理manager

export interface ResInfo {
    path: "",      //资源路径
    type: null,    //资源类型
    uuids: {},     //使用的资源id
    obj: null,     //资源对象
    ref: 0,        //引用计数
};

export interface ResCommond {
    path: string,
    assetType: typeof cc.Asset,
    completeCallback: any,
};

const { ccclass, property } = cc._decorator;
@ccclass
export default class HydraResManager {
    private static instance: HydraResManager = null;
    private resPool = {};
    private uuidTable = {};
    private _cleanFlag: boolean = false;
    private _loadFrame: number = 2;
    private _loadRef: number = 0;

    public static getInstance(): HydraResManager {
        if (this.instance == null) {
            this.instance = new HydraResManager();
            this.instance.init();
        }
        return this.instance;
    }

    init() {
        // cc.director.getScheduler().enableForTarget(this);
        // cc.director.getScheduler().schedule(this.Update.bind(this), this, 0);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.afterDraw.bind(this));
    }

    // Update() {
    //     this.cleanUnusedRes();
    // }

    private afterDraw() {
        if (this._cleanFlag) {
            if (this._loadRef <= 0) {
                if (this._loadFrame >= 0) {
                    this._loadFrame--;
                    return;
                }

                this._cleanFlag = false;
                // cc.loader.cleanUnusedRes && cc.loader.cleanUnusedRes();//引擎没有该方法，先注掉todo
            }
        }
    }

    public cleanUnusedRes() {
        this._cleanFlag = true;
    }

    /**
     * 加载资源
     * @param path 
     * @param assetType 
     * @param completeCallback  load成功还是失败都会返回
     */
    public loadRes(path: string, assetType: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void) {
        this._loadRef++;
        cc.loader.loadRes(path, assetType, (err, res) => {
            if (err) {
                completeCallback && completeCallback(err, null);
                this._loadRef--;
                return;
            }

            completeCallback && completeCallback(null, res);
            this._loadFrame = 2;
            this._loadRef--;
        });
    }

    public loadRes2(resources: string | string[] | { uuid?: string, url?: string, type?: string }, completeCallback: (error: Error, resource: any) => void) {
        this._loadRef++;
        cc.loader.load(resources, (err, res) => {
            if (err) {
                completeCallback && completeCallback(err, null);
                this._loadRef--;
                return;
            }

            completeCallback && completeCallback(null, res);
            this._loadFrame = 2;
            this._loadRef--;
        });
    }

    public loadResDir(path: string, assetType: typeof cc.Asset, completeCallback) {
        this._loadRef++;
        cc.loader.loadResDir(path, assetType, (err, res) => {
            if (err) {
                completeCallback && completeCallback(err, null);
                this._loadRef--;
                return;
            }

            completeCallback && completeCallback(null, res);

            this._loadFrame = 2;
            this._loadRef--;
        });
    }

    /**
     * 加载图集
     * @param node 调用的节点
     * @param path 图集路径
     * @param cb 回调
     */
    public static loadAtlas(node: cc.Node, path: string, cb: Function) {
        if (!node) {
            return;
        }
        HydraResManager.getInstance().loadRes(path, cc.SpriteAtlas, (err, atlas) => {
            if (err) {
                return;
            }
            if (!(node && node.isValid)) {
                return;
            }
            cb(atlas);
        })
    }

    /**
     * 获取res实例
     * @param path 
     */
    public getRes(path) {
        let p: ResInfo = this.resPool[path];
        if (p != null) {
            p.ref++;
            if (p.type == cc.Prefab) {
                return cc.instantiate(p.obj);
            }
            else {
                return p.obj;
            }
        }
        return null;
    }

    /**
     * 释放res实例
     * @param path 
     * @param num 
     */
    public releaseRes(path, num = 1) {
        let p: ResInfo = this.resPool[path];
        if (p != null) {
            p.ref -= num;
            //释放资源
            if (p.ref <= 0) {
                if (p.type == sp.SkeletonData) {
                    window["spineCount"]--;
                }
                this.deleteRes(p);
            }
        }
    }

    // 依赖的资源 uuid 计数
    private addUUidTable(path, res, type) {
        let newInfo: ResInfo = {
            path: path,
            obj: res,
            type: type,
            uuids: {},
            ref: 0,
        };
        // 记录所有相关资源
        for (let key of cc.loader.getDependsRecursively(res)) {
            newInfo.uuids[key] = true;
            if (key in this.uuidTable) {
                this.uuidTable[key] += 1;
            }
            else {
                this.uuidTable[key] = 1;
            }
        }
        this.resPool[path] = newInfo;
    }

    // 释放资源
    private deleteRes(p: ResInfo) {
        Object.keys(p.uuids).forEach((key) => {
            this.uuidTable[key]--;
            if (this.uuidTable[key] > 0) {
                delete p.uuids[key];
            }
            else {
                delete this.uuidTable[key];
            }
        });
        cc.loader.release(Object.keys(p.uuids));
        delete this.resPool[p.path];
    }
}
