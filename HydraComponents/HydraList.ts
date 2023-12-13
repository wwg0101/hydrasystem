import HDebug from "../HDebug";
const { ccclass } = cc._decorator;
@ccclass
//传统List
export class List<T> extends Array<T> {
    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, List.prototype);
    }
    public Add(data: T) {
        this.push(data);
    }
    public Remove(data: T): boolean {
        if (this.includes(data)) {
            this.splice(this.indexOf(data), 1);
            return true;
        }
        else {
            return false;
        }
    }
    public RemoveAt(index: number): T {
        let ary = this.splice(index, 1);
        return ary[0];
    }
    public Insert(index: number, data: T) {
        this.splice(index, 0, data);
    }
    public Empty(): boolean {
        return this.length == 0;
    }
    public Clear() {
        this.splice(0, this.length);
    }
    public Contains(data: T): boolean {
        return this.indexOf(data) != -1;
    }
    public Merge(dataList: List<T>, mergeKey: string) {
        if (dataList.length < 1) {
            return;
        }
        let firstElement = dataList[0];
        HDebug.Assert(null != firstElement[mergeKey], "element没有key " + mergeKey);

        let dic = new Map<any, T>();
        for (let index = 0; index < dataList.length; ++index) {
            dic.set(dataList[index][mergeKey], dataList[index]);
        }
        this.forEach((element, index) => {
            let key = element[mergeKey];
            if (dic.has(key)) {
                //替换element，dic清掉对应项
                this[index] = dic.get(key);
                dic.delete(key);
            }
        });

        dic.forEach((element) => {
            this.Add(element);
        });
    }
    public Append(other : List<T>) {
        for(let i = 0; i < other.length; ++i) {
            this.Add(other[i]);
        }
    }
}