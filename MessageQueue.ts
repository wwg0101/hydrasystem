import { Singleton } from "./HydraComponents/HydraSingleton";

//消息类型
export enum MessageType {
    GetItem, //获取道具
    Notice,
}
//消息监听者
export interface IMessageListener {
    OnMessageTrigger(t: MessageType, msg: any);  //展示消息
    OnMessageHide(t: MessageType);          //隐藏消息
    OnMessageOver(t: MessageType);          //结束消息
}
//消息队列
export interface IMessageQueue {
    Init(t: MessageType, interval: number, stay: number);   //最小停留时间，最大停留时间
    Register(lis: IMessageListener);
    DeRegister(lis: IMessageListener);
    OnUpdate(delta: number);
    Lock(isLock: boolean); //锁定更新时间
    AddMessage(message: any);  //增加一条消息
}

/*class TestClass implements IMessageListener{
    AddMessageTest() {
        MessageQueueManager.Instance().GetMessageQueue(MessageType.GetItem).AddMessage({ });
    }

    ReceiveMessageTest() {
        MessageQueueManager.Instance().GetMessageQueue(MessageType.GetItem).Register(this);
    }

     //展示消息
    OnMessageTrigger(t : MessageType, msg : any) {}
    //单个消息结束
    OnMessageHide(t : MessageType) {}
    //所有消息结束
    OnMessageOver(t : MessageType) {}
}*/

export class MessageQueueManager extends Singleton<MessageQueueManager> {
    private m_allMessageQueue: Map<MessageType, IMessageQueue> = new Map<MessageType, IMessageQueue>();
    static Instance(): MessageQueueManager {
        return MessageQueueManager.GetInstance(MessageQueueManager);
    }

    protected Init() {
        super.Init();
        //获取队列 - 示例
        //this.CreateMessageQueue(MessageQueue, MessageType.GetItem, 2.0, 3);
        //this.CreateMessageQueue(MessageQueue, MessageType.SysTargetReward, 2.0, 3);
    }

    //最小停留时间，最大停留时间
    CreateMessageQueue<T extends IMessageQueue>(ttype: (new () => T), type: MessageType, interval: number, stay: number) {
        //这里如果有任何人对同一种消息队列重复调用了，后果自负
        let m = new ttype();
        m.Init(type, interval, stay);
        this.m_allMessageQueue.set(type, m);
    }

    GetMessageQueue(t: MessageType): IMessageQueue {
        let m: IMessageQueue = this.m_allMessageQueue.get(t);
        return m;
    }

    LockTime(isLock: boolean) {
        this.m_allMessageQueue.forEach((element) => {
            element.Lock(isLock);
        });
    }

    //每帧调用
    Update(deltaTime: number) {
        this.m_allMessageQueue.forEach((element) => {
            element.OnUpdate(deltaTime);
        });
    }
}

export class MessageQueue implements IMessageQueue {
    private m_allMessage = [];
    private m_lockMessage = [];

    private m_fIntervalTime: number = 0;
    private m_fStayTime: number = 0;

    private m_bIsLock: boolean = false;

    m_eMsgType: MessageType = MessageType.Notice;
    Init(type: MessageType, interval: number, stay: number) {
        this.m_eMsgType = type;
        this.m_fIntervalTime = interval;
        this.m_fStayTime = stay;
        this.m_bIsLock = false;
    }

    m_allRegistedCB = [];
    Register(lis: IMessageListener) {
        this.m_allRegistedCB.push(lis);
    }
    DeRegister(lis: IMessageListener) {
        this.m_allRegistedCB.splice(this.m_allRegistedCB.indexOf(lis), 1);
    }

    m_fLockTimer: number = 0;
    AddMessage(message: any) {
        if (!this.m_bIsLock) {
            if (this.m_fLockTimer <= 0) {
                this.OnMessageBegin();
                this.ShowMessage(message);
                this.m_fLockTimer = this.m_fStayTime;
            }
            else {
                this.m_fLockTimer = this.m_fLockTimer > this.m_fIntervalTime ? this.m_fIntervalTime : this.m_fLockTimer;
                this.m_allMessage.push(message);
            }
        }
        else {
            this.m_lockMessage.push(message);
        }
    }

    private ShowMessage(message: any) {
        for (let i = 0; i < this.m_allRegistedCB.length; ++i) {
            this.m_allRegistedCB[i].OnMessageTrigger(this.m_eMsgType, message);
        }
    }

    private HideMessage() {
        for (let i = 0; i < this.m_allRegistedCB.length; ++i) {
            this.m_allRegistedCB[i].OnMessageHide(this.m_eMsgType);
        }
    }

    private OnMessageBegin() {
        for (let i = 0; i < this.m_allRegistedCB.length; ++i) {
            this.m_allRegistedCB[i].OnMessageBegin(this.m_eMsgType);
        }
    }

    private OnMessageOver() {
        for (let i = 0; i < this.m_allRegistedCB.length; ++i) {
            this.m_allRegistedCB[i].OnMessageOver(this.m_eMsgType);
        }
    }

    OnUpdate(delta: number) {
        if (this.m_fLockTimer > 0) {
            this.m_fLockTimer -= delta;
            if (this.m_fLockTimer <= 0) {
                this.UpdateShowMessage();
            }
        }
    }

    private UpdateShowMessage() {
        if (this.m_allMessage.length > 0) {
            this.HideMessage();
            this.ShowMessage(this.m_allMessage[0]);
            //this.m_allMessage.RemoveAt(0);
            if (this.m_allMessage.length > 0) {
                this.m_fLockTimer = this.m_fIntervalTime;
            }
            else {
                this.m_fLockTimer = this.m_fStayTime;
            }
        }
        else {
            this.HideMessage();
            this.OnMessageOver();
        }
    }


    Lock(isLock: boolean) {
        let isChangeLock = this.m_bIsLock != isLock;
        this.m_bIsLock = isLock;

        if (isChangeLock && !isLock) {
            for (let i = 0; i < this.m_lockMessage.length; ++i) {
                this.AddMessage(this.m_lockMessage[i]);
            }
            this.m_lockMessage = [];
        }
    }
}