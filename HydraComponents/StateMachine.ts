import HDebug from "../HDebug";

enum CacheType {
    State,
    Event,
}

//状态机
export default class StateMachine<Operation, State> {
    protected m_eState: State;

    get CurState() { return this.m_eState; }
    set CurState(value: State) {
        if (this.m_eState != value) {
            this.m_currentOpRule = this.m_allRules.get(value);

            if (!this.m_currentOpRule) {
                this.m_currentOpRule = new Map<Operation, (...paras: any[]) => any>();
                this.m_allRules.set(value, this.m_currentOpRule);
            }
            this.OnStateChanged(this.m_eState, value);
            this.m_eState = value;
        }
    }

    protected OnStateChanged(oldSt : State, newSt : State) {}

    // public delegate: (...paras: any[]) => any;
    private m_currentOpRule: Map<Operation, (...paras: any[]) => any> = new Map();
    private m_allRules: Map<State, Map<Operation, (...paras: any[]) => any>> = new Map();
    private m_allEnterStateRules: Map<State, (...paras: any[]) => any> = new Map();
    constructor(initState: State) {
        this.m_allRules = new Map<State, Map<Operation, (...paras: any[]) => any>>();
        this.m_allEnterStateRules = new Map<State, (...paras: any[]) => any>();
        this.Reset(initState);
    }

    public Reset(initState: State) {
        this.m_eState = initState;
        this.m_currentOpRule = this.m_allRules.get(initState);// [initState];
        if (!this.m_currentOpRule) {
            this.m_currentOpRule = new Map<Operation, (...paras: any[]) => any>();
            this.m_allRules.set(initState, this.m_currentOpRule);
        }
    }

    public InsertStateEnter(st: State[], callBack: (...paras: any[]) => any) {
        for (var i = 0; i < st.length; ++i) {
            this.m_allEnterStateRules.set(st[i], callBack);
        }
    } 

    //在state状态下相应op输入，做callback - 注意使用lambda时的变量引用问题
    public InsertRule(st: State[], op: Operation, callBack: (...paras: any[]) => any) {
        for (var i = 0; i < st.length; ++i) {
            var operMap = this.m_allRules.get(st[i]);
            if (operMap) {
                operMap.set(op, callBack);
            } else {
                var m = new Map<Operation, (...paras: any[]) => any>();
                m.set(op, callBack);
                this.m_allRules.set(st[i], m);
            }
        }
    }
    public ChangeState(newState: State, ...paras) {
        if (this.m_bIsInProcess) {
            var c = new CacheStateChange<Operation, State>()
            c.InitState(newState, ...paras);
            this.m_allCachedState.push(c);
        }
        else {
            if(this.CurState != newState) {
                this.CurState = newState;
                var f = this.m_allEnterStateRules.get(this.CurState);
                if(f) {
                    this.m_bIsInProcess = true;
                    f(...paras);
                    this.m_bIsInProcess = false;
                }
            }
        }
    }

    private m_bIsInProcess: boolean = false;
    private m_allCachedState: CacheStateChange<Operation, State>[] = [];

    InnerProcess(op: Operation, ...paras) {
        var ep: (...paras: any[]) => any = null;

        ep = this.m_currentOpRule.get(op);
        if (ep) {
            this.m_bIsInProcess = true;
            ep(...paras);
            this.m_bIsInProcess = false;
        }
        else {
            this.LogIllegalOp(op);
        }
    }

    //在執行狀態下其他事件都會延後處理，所以千萬不能用於事件後緊湊執行
    public Process(op: Operation, ...paras) {
        var ep: (...paras: any[]) => any = null;
        ep = this.m_currentOpRule.get(op);
        
        if (this.m_bIsInProcess) {
            var cs = new CacheStateChange<Operation, State>();
            cs.InitOperation(op, ...paras);
            this.m_allCachedState.push(cs);
            return;
        }

        if (ep) {
            this.m_bIsInProcess = true;
            ep(...paras);
            this.m_bIsInProcess = false;
            for (var i = 0; i < this.m_allCachedState.length; ++i) {
                if (this.m_allCachedState[i].type == CacheType.State) {
                    this.ChangeState(this.m_allCachedState[i].state, ...this.m_allCachedState[i].paras);
                }
                else {
                    this.InnerProcess(this.m_allCachedState[i].op, ...this.m_allCachedState[i].paras);
                }
            }
            this.m_allCachedState.splice(0, this.m_allCachedState.length);
        }
        else {
            this.LogIllegalOp(op);
        }
    }
    
    protected LogIllegalOp(op) {
        HDebug.Log("状态" + this.m_eState + "不能处理操作" + op);
    }
}

class CacheStateChange<Operation, State> {
    public type: CacheType;
    public state: State;
    public op: Operation;
    public paras: object[];

    public InitState(s: State, ...param) {
        this.state = s;
        this.type = CacheType.State;
        this.op = null;
        // this.op = Operation;
        this.paras = param;
    }

    public InitOperation(o: Operation, ...param) {//object[] p
        this.state = null;
        this.type = CacheType.Event;
        this.op = o;
        this.paras = param;
    }
}