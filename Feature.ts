import HDebug from "./HDebug";
import { List } from "./HydraComponents/HydraList";
import { Singleton } from "./HydraComponents/HydraSingleton";

//功能回调
export interface IFeatureCB { }

enum FeatureCBState {
    Normal,
    Invalid,
}

class FeatureHolder<T extends IFeatureCB> {
    public actualFeature : T;
    constructor(ft : T) {
        this.actualFeature = ft;
    }
    private state : FeatureCBState = FeatureCBState.Normal;
    public Valid() : boolean { return this.state == FeatureCBState.Normal; }
    public Invoke(fName : string, ...params) {
        if(this.actualFeature[fName]) {
            this.actualFeature[fName](...params);    
        }
        else {
            HDebug.Error("[InvokeAll]Feature CallBack Not Exist!!!" + fName);
        }
    }
    public MInvoke(fName : string, ...params) {
        if(this.actualFeature[fName]) {
            this.actualFeature[fName](...params);    
        }
    }
    public Remove() {
        this.state = FeatureCBState.Invalid;
        this.actualFeature = null;
    }
    public Is(ft : T) : boolean {
        return this.actualFeature == ft;
    }
}

export class Feature<T extends IFeatureCB> {
    protected m_allRegisteredCB: List<FeatureHolder<T>> = new List();
    public Register(t: T) {
        for(let i = 0 ; i < this.m_allRegisteredCB.length; ++i) {
            if(this.m_allRegisteredCB[i].Is(t)) {
                HDebug.Error("已经添加过了！一定是矿总写的");
                return;
            }
        }
        this.m_allRegisteredCB.Add(new FeatureHolder<T>(t));
    }
    public Deregister(t: T) {
        for(let i = 0 ; i < this.m_allRegisteredCB.length; ++i) {
            if(this.m_allRegisteredCB[i].Is(t)) {
                if(this.isInvoking) {
                    this.m_allRegisteredCB[i].Remove();
                    this.needRemoveCheck = true;
                }
                else {
                    this.m_allRegisteredCB.RemoveAt(i);
                }
                return;
            }
        }
        HDebug.Error("没有添加就移除！一定是矿总写的");
    }

    private isInvoking : boolean = false;
    private needRemoveCheck : boolean = false;
    public InvokeAll(fName: string, ...params) {
        HDebug.Assert(!this.isInvoking, "invoke all 遞歸調用，理論上不可能出現");
        this.isInvoking = true
        for (let i = this.m_allRegisteredCB.length - 1; i >=0 ; --i) {
            let ftHolder = this.m_allRegisteredCB[i];
            if(ftHolder.Valid()) {
                this.innerInvoke(ftHolder, fName, ...params);
            }
        }
        this.isInvoking = false;
        if(this.needRemoveCheck) {
            for (let i = this.m_allRegisteredCB.length - 1; i >=0 ; --i) {
                if(!this.m_allRegisteredCB[i].Valid()) {
                    this.m_allRegisteredCB.RemoveAt(i);
                }
            }
            this.needRemoveCheck = false;
        }
    }

    protected innerInvoke(ftHolder : FeatureHolder<T>, fName : string, ...params) {
        ftHolder.Invoke(fName, ...params);
    }
}

export class MFeature<T extends IFeatureCB> extends Feature<T> {
    protected innerInvoke(ftHolder : FeatureHolder<T>, fName : string, ...params) {
        ftHolder.MInvoke(fName, ...params);
    }
}

//基于组件的工具类
export class FeatureSingletonSys<T> extends Singleton<FeatureSingletonSys<T>> {
    protected featureSys : FeatureSys<T> = null;
    constructor() {
        super();
        this.featureSys = new FeatureSys<T>();
    }

    //添加组件
    public AddFeature<T1 extends T>(type: new () => T1) {
        this.featureSys.AddFeature(type);
    }
    //获取组件
    public GetFeature<T1 extends T>(type: (new () => T1)): T1 {
        return this.featureSys.GetFeature(type);
    }
}

export class FeatureSys<T> {
    protected m_allComps: List<T> = new List<T>();
    //添加组件
    public AddFeature<T1 extends T>(type: new () => T1) {
        if(this.GetFeature(type) == null) {
            this.m_allComps.Add(new type());
        }
    }
    //获取组件
    public GetFeature<T1 extends T>(type: (new () => T1)): T1 {
        let comp = null;
        this.m_allComps.forEach((v)=> {
            if(!comp && v instanceof type) {
                comp = v;
            }
        });
        return <T1>comp;
    }
    public GetAllFeature() : List<T> {
        return this.m_allComps;
    }
}