import { List } from "./HydraComponents/HydraList";
// import HDebug from "../../utils/HDebug";

export interface IAnimPlayerCB {}
export interface IAnimPlayer<T extends IAnimPlayerCB> {
    init(ui: T);
    playAnimList(animRoot);
}

export interface IAnimCB<T extends IAnimPlayerCB> {
    OnAnimFinished();
    CreateAnimPlayer() : IAnimPlayer<T>;
}
export class AnimDataBase<Key> {
    IsNodeAnim() : boolean { return false; }
    IsCreateAnim() : boolean { return false; }
    GetAnimKey() : Key { return null; }
    seq : number = 0;
    next : AnimDataBase<Key> = null;
}

export class AnimDirector<Panel extends IAnimCB<CB> & CB, CB extends IAnimPlayerCB, AnimPlayer extends IAnimPlayer<CB>, AnimData extends AnimDataBase<Key>, Key> {
    protected PrepareNodeData(nodes: Map<Key, AnimPlayer>) {}
    protected PlayBoardAnim(anim : AnimData) {}

    protected panel: Panel;
    protected animNode: Map<Key, AnimPlayer> = null;
    private curAnimList: List<AnimData> = null;
    private curAnimSeq: number = 0;
    private animLock: number = 0;

    constructor(p: Panel) {
        this.panel = p;
    }

    public Reset() {
        this.animNode = null;
        this.curAnimList = null;
        this.curAnimSeq = 0;
        this.animLock = 0;
    }

    public Begin(nodes: Map<Key, AnimPlayer>, animList: List<AnimData>) {
        this.PrepareNodeData(nodes);
        this.Play(nodes, animList);
    }

    private Play(nodes: Map<Key, AnimPlayer>, animList: List<AnimData>) {
        this.curAnimList = animList;
        this.curAnimSeq = 0;
        this.PlayAnimBySeq(animList, this.curAnimSeq);
        if (this.animLock == 0) {
            this.OnAllSeqAnimOver();
        }
    }

    private PlayAnimBySeq(animList: List<AnimData>, seq: number) {
        let animDic: Map<Key, AnimDataBase<Key>> = new Map();
        let boardAnimList : List<AnimData> = new List<AnimData>();
        for (let i = 0; i < animList.length; ++i) {
            let anim: AnimData = animList[i];
            if (anim.seq == seq) {
                this.animLock++;
                if (!anim.IsNodeAnim()) {
                    let animKey = anim.GetAnimKey();
                    if (animDic.has(animKey)) {
                        let animRoot = animDic.get(animKey);
                        //按照seq
                        while (animRoot.next && animRoot.next.seq >= anim.seq) {
                            animRoot = animRoot.next;
                        }
                        //插入节点
                        let oldNext = animRoot.next;
                        animRoot.next = anim;
                        anim.next = oldNext;
                    }
                    else {
                        animDic.set(animKey, anim);
                    }
                }
                else {
                    boardAnimList.Add(anim);
                   
                }
            }
        }

        animDic.forEach((value: AnimData, key: Key) => {
            if (!value.IsCreateAnim()) {
                if(this.animNode.get(key) != null ){
                    this.animNode.get(key).playAnimList(value);
                }
                
            }
            else {
                let player = this.panel.CreateAnimPlayer();
                player.init(this.panel);
                player.playAnimList(value);
            }
        });

        for(let i = 0; i < boardAnimList.length; ++i) {
            this.PlayBoardAnim(boardAnimList[i]);
        }
    }

    private OnAllSeqAnimOver() {
        if (this.curAnimList && this.curAnimList.length > 0) {
            this.curAnimSeq++;
            this.PlayAnimBySeq(this.curAnimList, this.curAnimSeq);
            if (this.animLock == 0) {
                this.OnAllSeqAnimOver();
            }
        }
        else {
            this.curAnimSeq = 0;
            this.curAnimList = null;
            this.animNode = null;
            this.panel.OnAnimFinished();
        }
    }

    public OnAnimOver(anim: AnimData) {
        this.animLock--;
        this.curAnimList && (this.curAnimList.Remove(anim));
        // HDebug.Assert(this.animLock >= 0, "lock error !");
        if (this.animLock == 0) {
            this.OnAllSeqAnimOver();
        }
    }
}