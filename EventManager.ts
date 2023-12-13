// 事件管理Manager

import HDebug from "./HDebug";

export interface EventObject {
    eventID: number,
    eventName: string,
    handler: Function,
    once: boolean,
    target: Object,
};

export interface EventMap { [key: string]: Array<EventObject> };

const { ccclass, property } = cc._decorator;
@ccclass
export default class EventManager {
    private static instance: EventManager = null;
    private _eventMap: EventMap = {};
    private _eventID: number = 0;

    public static getInstance(): EventManager {
        if (this.instance == null) {
            this.instance = new EventManager();
        }
        return this.instance;
    }

    constructor() {
        this._eventID = 0;
    }

    /**
     * 触发事件
     * @param eventName 需要响应的事件名
     * @param data 事件需要传递的数据
     * @param target 只触发target上的事件
     */
    emit(eventName: string, data?: any | void, target: Object = null) {
        let events = this._eventMap[eventName];
        if (!events) {
            return;
        }
        for (let index = events.length - 1; index >= 0; index--) {
            let flag = false;
            let event = events[index];
            if (event != undefined) {
                // 触发指定target
                if (target) {
                    if (target == event.target) {
                        flag = true;
                        event.handler && event.handler.call(event.target, data);
                    }
                }
                else {
                    flag = true;
                    if (event.target) {
                        event.handler && event.handler.call(event.target, data);
                    }
                    else {
                        event.handler && event.handler(data);
                    }
                }

                // 移除单次的事件
                if (flag && event.once) {
                    events.splice(index, 1);
                }
            }
        }
    }

    /**
     * 注册事件
     * @param eventName 事件名
     * @param handler   事件回调
     * @param target    目标对象
     */
    on(eventName: string, handler: Function, target: Object = null) {
        return this.register(eventName, handler, false, target);
    }

    /**
    * 注册单次事件，回调后移除
    * @param eventName 事件名
    * @param handler   事件回调
    * @param target    目标对象
    */
    once(eventName: string, handler: Function, target: Object = null) {
        return this.register(eventName, handler, true, target);
    }

    /**
     *  移除事件
     * @param eventName 事件名或者事件对象。1> 当传入事件对象时只移除对应事件 2> 当传入事件名时移除所有同名的事件
     * @param target 当有target参数传入时，只移除对应target上的事件
     */
    off(eventName: string | EventObject, target: Object = null) {
        this.unregister(eventName, target);
    }

    /**
     *  移除对应target上的所有事件
     * @param target 
     */
    offTarget(target: Object) {
        this.unregister(null, target);
    }

    /**
     * 注册事件
     * @param eventName 事件名
     * @param handler   事件回调
     * @param once      是否为单次事件
     * @param target    目标对象
     */
    private register(eventName: string, handler: Function, once: boolean = false, target: Object = null): EventObject {
        if (!eventName || !handler) {
            HDebug.Error("---!!!-event--register--error--");
            return;
        }

        this._eventID++;
        let event: EventObject = {
            eventID: this._eventID,
            eventName: eventName,
            handler: handler,
            once: once,
            target: target,
        };

        if (!this._eventMap[event.eventName]) {
            this._eventMap[event.eventName] = [];
        }
        this._eventMap[event.eventName].push(event);
        return event;
    }

    /**
     *  移除事件
     * @param eve 事件名或者事件对象。1> 当传入事件对象时只移除对应事件 2> 当传入事件名时移除所有同名的事件
     * @param target 当有target参数传入时，只移除对应target上的事件
     */
    private unregister(eve: string | EventObject, target: Object = null) {
        // 没有传入[事件名/事件对象]

        if (eve == null) {
            // 只传入[target],移除target上的所有事件
            target && this._unregisterByTarget(target);
            return;
        }

        let events: EventObject[];
        if (typeof eve === 'string') {
            events = this._eventMap[eve];
        }
        else {
            events = this._eventMap[eve.eventName];
        }

        if (events == undefined) {
            return;
        }

        // 传入事件名
        if (typeof eve === 'string') {
            for (let index = events.length - 1; index >= 0; index--) {
                let event = events[index];
                if (target) {
                    if (event.target == target) {
                        events.splice(index, 1);
                    }
                }
                else {
                    events.splice(index, 1);
                }
            }
        }
        // 传入事件对象
        else {
            for (let index = events.length - 1; index >= 0; index--) {
                let event = events[index];
                if (eve.eventID == event.eventID) {
                    events.splice(index, 1);
                }
            }
        }
    }

    private _unregisterByTarget(target: Object) {
        if (!target) {
            return;
        }
        for (let key in this._eventMap) {
            let events = this._eventMap[key];
            for (let index = events.length - 1; index >= 0; index--) {
                let event = events[index];
                if (event.target == target) {
                    events.splice(index, 1);
                }
            }
        }
    }
}
