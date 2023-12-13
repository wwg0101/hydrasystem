import HydraResManager from "./HydraResManager";
import { Singleton } from "./HydraComponents/HydraSingleton";
import { InstanceNode } from "./HydraComponents/InstanceNode";
import HDebug from "./HDebug";

declare let facade;
class HydraPrefab {
    constructor(prefab: cc.Prefab) {
        this.prefabNode = cc.instantiate(prefab);
    }
    private prefabNode: cc.Node;
    public Get(): cc.Node {
        return this.prefabNode;
    }
}

export class CommonUIPrefabs {
    private static assetMap: Map<string, HydraPrefab> = new Map<string, HydraPrefab>();
    public static GetPrefab(key: string): cc.Node {
        return this.assetMap.get(key).Get();
    }

    private static hasLoad: boolean = false;
    public static LoadAll() {
        if (this.hasLoad) {
            facade.send("LOAD_PREFAB_OVER");
            return;
        }
        this.hasLoad = true;
        HydraResManager.getInstance().loadResDir("gl_zh/prefabs/ui/CommonUIPrefabs", cc.Prefab, (err, resources: any[]) => {
            if (err == null) {
                for (let i = 0; i < resources.length; ++i) {
                    let name = resources[i].data.name;
                    let asset = resources[i];
                    if (!this.assetMap.has(name)) {
                        let hp = new HydraPrefab(asset);
                        this.assetMap.set(name, hp);
                        PrefabManager.Instance().AddPrefab(hp);
                    }
                }
                facade.send("LOAD_PREFAB_OVER");
            }
            else {
                HDebug.Error(err);
            }
        });
    }
    public static Clear() {
        this.assetMap.forEach((value: HydraPrefab) => {
            PrefabManager.Instance().RemovePrefab(value);

        });
        this.assetMap.clear();
    }
}

class PrefabRef {
    node: cc.Node;
    refCnt: number;
    constructor(p: cc.Node, n: number) {
        this.node = p;
        this.refCnt = n;
    }
}

class PrefabManager extends Singleton<PrefabManager> {
    private prefabObjRoot: cc.Node = null;
    public static Instance(): PrefabManager {
        return this.GetInstance(PrefabManager);
    }

    protected Init() {
        this.prefabObjRoot = new cc.Node("PrefabRoot");
        this.prefabObjRoot.addComponent(InstanceNode);
        let curScene = cc.director.getScene();
        this.prefabObjRoot.parent = curScene;
        this.prefabObjRoot.active = false;
    }

    protected UnInit() {
        this.prefabObjRoot.destroy();
    }

    private prefabObjMap: Map<HydraPrefab, PrefabRef> = new Map<HydraPrefab, PrefabRef>();
    public AddPrefab(prefab: HydraPrefab) {
        if (!this.prefabObjMap.has(prefab)) {
            prefab.Get().parent = this.prefabObjRoot;
            this.prefabObjMap.set(prefab, new PrefabRef(prefab.Get(), 1));
        }
        else {
            this.prefabObjMap.get(prefab).refCnt++;
        }
    }

    public RemovePrefab(prefab: HydraPrefab) {
        HDebug.Assert(this.prefabObjMap.has(prefab), "引用计数错误！！！");
        let ref = this.prefabObjMap.get(prefab);
        ref.refCnt--;
        if (ref.refCnt == 0) {
            //ref.node.parent = null;
            prefab.Get().destroy();
            this.prefabObjMap.delete(prefab);
        }
    }
}