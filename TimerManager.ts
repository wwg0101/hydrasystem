
import { MessageQueueManager } from "./MessageQueue";
import { List } from "./HydraComponents/HydraList";
import { Singleton } from "./HydraComponents/HydraSingleton";
import { InstanceNode } from "./HydraComponents/InstanceNode";


enum TimerState {
    Normal,
    Invalid
}
enum TickState {
    TimeOver, //结束并移除
    TimeOut,  //到点并执行
    Ticking,  //无事发生
}

class TickTimer {
    timerState : TimerState;
    timerID : number;
    cbFunction : Function;
    public constructor(id : number, t : number, cb : Function) {
        this.timerID = id;
        this.cbFunction = cb;
        this.timerState = TimerState.Normal;
    }

    public Tick(dt :number) : TickState {
        this.cbFunction(dt);
        return TickState.Ticking;
    }
}
class Timer extends TickTimer {
    time : number;
    public constructor(id : number, t : number, cb : Function) {
        super(id, t, cb);
        this.timerID = id;
        this.time = t;
    }
    public Tick(dt :number) : TickState {
        if(this.time < 0) {
            return TickState.TimeOut;
        }
        this.time -= dt;
        return TickState.Ticking;
    }
}
class RepeatTimer extends Timer {
    repeatCount: number;
    interval : number;
    public constructor(id : number, t : number, cb : Function) {
        super(id, t, cb);
        this.interval = t;
    }

    public SetRepeatNum(repeat : number) {
        this.repeatCount = repeat;
    }

    public Tick(dt :number) : TickState {
        if(this.repeatCount == 0) {
            return TickState.TimeOut;
        }
        if(this.time < 0) {
            this.repeatCount--;
            this.time += this.interval;
            return TickState.TimeOver;
        }
        this.time -= dt;
        return TickState.Ticking;
    }
}
class ForeverTimer extends Timer {
    interval : number;
    public constructor(id : number, t : number, cb : Function) {
        super(id, t, cb);
        this.interval = t;
    }

    public Tick(dt :number) : TickState {
        if(this.time < 0) {
            this.time += this.interval;
            return TickState.TimeOver;
        }
        this.time -= dt;
        return TickState.Ticking;
    }
}

class FrameTimer extends TickTimer { 
    frame: number;
    public constructor(id: number, frame: number, cb: Function) {
        super(id, frame, cb);
        this.timerID = id;
        this.frame = frame;
    }
    public Tick(dt: number): TickState {
        if (this.frame < 0) {
            return TickState.TimeOut;
        }
        this.frame -= 1;
        return TickState.Ticking;
    }
}

//定时器
//how can u don't have this function！！！？？？
export class TimerManager extends Singleton<TimerManager> {
    private timerHolder: TimerNode = null;
    public static Instance(): TimerManager {
        return this.GetInstance(TimerManager);
    }

    protected Init() {
        let node = new cc.Node("TimerRoot");
        this.timerHolder = node.addComponent(TimerNode);
        this.timerHolder.SetUpdateHandle(this.Update.bind(this));
        let curScene = cc.director.getScene();
        if(curScene == null) {
            console.log("场景还未加载，加NM定时器！");
        }
        // console.assert(curScene != null , "场景还未加载，加NM定时器！");
        node.parent = curScene;
    }

    protected UnInit() {
        this.Reset();
    }

    public Reset() {
        this.timerHolder.node.destroy();
        this.m_allTimer.Clear();
        this.m_repeatTimer.Clear();
        this.m_iTimerAllocator = 0;
    }

    private m_iTimerAllocator : number = 0;
    private m_allTimer : List<TickTimer> = new List<TickTimer>();
    private m_repeatTimer : List<TickTimer> = new List<TickTimer>();
    //注册一个tick回调 - 注意！！tick回调中不能移除自身！！器【TimerID从1开始】
    public AddTick(cbFunction : (dt) => void) : number {
        return this.CreateTimer(TickTimer, 0, cbFunction).timerID;
    }
    //移除tick
    public RemoveTick(tickID : number) {
        this.RemoveTimer(tickID);
    }
    //启动一个定时器【TimerID从1开始】
    public AddTimer(time : number, cbFunction : Function) : number {
        return this.CreateTimer(Timer, time, cbFunction).timerID;
    }
    //启动一个定时器【TimerID从1开始】
    public AddFrame(frame : number, cbFunction : Function) : number {
        return this.CreateTimer(FrameTimer, frame, cbFunction).timerID;
    }
    //启动一个永久定时器【一定要注意停止！！！！】器【TimerID从1开始】
    public AddForever(time : number, cbFunction : Function) : number {
        return this.CreateTimer(ForeverTimer, time, cbFunction).timerID;
    }
    //启动一个可重复定时器器【TimerID从1开始】
    public AddRepeat(time : number, cbFunction : Function, repeatCount: number) : number {
        let timer = this.CreateTimer(RepeatTimer, time, cbFunction);
        timer.SetRepeatNum(repeatCount);
        return timer.timerID;
    }
    //删除一个定时器
    public RemoveTimer(timerID : number) {
        for(let i = this.m_allTimer.length - 1; i >= 0; --i) {
            let timer = this.m_allTimer[i];
            if(timer.timerID == timerID) {
                timer.timerState = TimerState.Invalid;
                timer.cbFunction = null;
                break;
            }
        }
        for(let i = this.m_repeatTimer.length - 1; i >= 0; --i) {
            let timer = this.m_repeatTimer[i];
            if(timer.timerID == timerID) {
                timer.timerState = TimerState.Invalid;
                timer.cbFunction = null;
                break;
            }
        }
    }
    private CreateTimer<T extends TickTimer>(type: (new (i : number, t : number, c : Function) => T), time : number, cbFunction : Function) : T {
        this.m_iTimerAllocator++;
        let timer = new type(this.m_iTimerAllocator, time, cbFunction);
        this.m_allTimer.Add(timer);
        return timer;
    }
    private Update(delta : number) {
        MessageQueueManager.Instance().Update(delta);

        for(let i = this.m_allTimer.length - 1; i >= 0; --i) {
            let timer = this.m_allTimer[i];
            if(timer.timerState == TimerState.Normal) {
                switch(timer.Tick(delta)) {
                    case TickState.TimeOut: {
                        this.m_allTimer.Remove(timer);
                        timer.cbFunction();
                    }
                    break;
                    case TickState.TimeOver: {
                        this.m_allTimer.Remove(timer);
                        this.m_repeatTimer.Add(timer);
                        timer.cbFunction();
                    }
                    break;
                }
            }
            else {
                this.m_allTimer.Remove(timer);
            }
        }
        for(let i = 0; i < this.m_repeatTimer.length; ++i) {
            if(this.m_repeatTimer[i].timerState == TimerState.Normal) {
                this.m_allTimer.Add(this.m_repeatTimer[i]);
            }
        }
        if(this.m_repeatTimer.length > 0) this.m_repeatTimer.Clear();
    }
}

class TimerNode extends InstanceNode {
    private cbFunction : Function;
    SetUpdateHandle(cb : Function) {
        this.cbFunction = cb;
    }

    update(delta) {
        this.cbFunction(delta);
    }
}