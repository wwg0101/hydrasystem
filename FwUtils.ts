// jie 与ui无关的各种静态通用方法

import HDebug from "./HDebug";

//这个文件最好别引用其他东西！！！
const { ccclass, property } = cc._decorator;

@ccclass
export default class FwUtils {
    public static checkNodeValid(node: cc.Node): boolean {
        return null != node && node.isValid;
    }
    /**
     * 深拷贝
     * 
     */
    public static cloneDeep(obj: Object) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 递归克隆(性能差)
     * @param target 
     * @returns 
     */
    public static deepClone(target) {
        let result;
        if (typeof target === 'object') {
            if (Array.isArray(target)) {
                result = [];
                for (let i in target) {
                    result.push(this.deepClone(target[i]))
                }
            } else if (target === null) {
                result = null;
            } else if (target.constructor === RegExp) {
                //正则表达式对象
                result = target;
            } else {
                result = {};
                for (let i in target) {
                    result[i] = this.deepClone(target[i]);
                }
            }
        } else {
            result = target;
        }
        return result;
    }

    //assign克隆（对深层的对象拷贝不到）
    public static assignClone(target) {
        var result = Object.assign({}, target);
        return result;
    }

    /**
     * 数组乱序高效版实现 会改变原数组返回
     * @param array 
     */
    public static shuffleArray(array: any[]) {
        for (var j, x, i = array.length; i; j = parseInt(Math.random() * i + ""), x = array[--i], array[i] = array[j], array[j] = x);
    }

    public static KeyValueDataTransToArray(data) {
        let array = [];
        if (null != data) {
            for (let key in data) {
                array.push(data[key]);
            }
        }
        return array;
    }

    /**
     * 生成从minNum到maxNum的随机整数
     * @param min 
     * @param max 
     */
    public static getRandomNum(min: number, max?: number) {
        if (max === undefined) {
            max = min;
            min = 1;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * 按随机区域掉落
    */
    public static getRandomPosInRect(point: cc.Vec2, width: number, height: number): cc.Vec2 {
        var minX = point.x - (width / 2);
        var maxX = point.x + (width / 2);
        var x = Math.random() * (maxX - minX + 1) + minX;

        var minY = point.y - (height / 2);
        var maxY = point.y + (height / 2);

        var y = Math.random() * (maxY - minY + 1) + minY;
        return new cc.Vec2(x, y);
    }

    /**
     * 数组中随机取count个元素 不改变原数组，返回数组
     * @param arr 数组
     * @param count 
     */
    public static getRandomArrayItem(arr: any[], count: number = 1) {
        if (arr.length <= 1) {
            return arr;
        }
        if (count > arr.length) {
            count = arr.length;
        }
        let shuffled = arr.slice(0);
        let i = arr.length;
        let min = i - count;
        let temp = 0;
        let index = 0;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }

        return shuffled.slice(min);
    }

    /**
     * 几个一组拆分数组
     * @param arr 
     * @param count 几个一组
     * @returns 
     */
    public static groupArray(arr: any[], count: number) {
        let index = 0;
        let newArray = [];
        let len = arr.length;
        while (index < len) {
            newArray.push(arr.slice(index, index += count));
        }
        return newArray;
    }

    public static checkNotEmpty(obj): boolean {
        if (null == obj) return false;
        let hasItem = false;
        for (let item in obj) {
            hasItem = true;
            break;
        }
        return hasItem;
    }

    public static getNodeList(node) {
        let list = [node];
        let children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            let rtn = this.getNodeList(children[i]);
            Array.prototype.push.apply(list, rtn);
        }
        return list;
    }
    //#region 字符串部分

    public static cutString(sourceStr: string, maxLength: number, suffix: string = "...") {
        if (null == sourceStr) {
            cc.log("sourceStr is null");
            return "";
        }
        sourceStr = sourceStr.toString();
        if (null == sourceStr.length || sourceStr.length <= maxLength) {
            return sourceStr;
        } else {
            let cutStr = sourceStr.substr(0, maxLength);
            cutStr += suffix;
            return cutStr;
        }

    }

    public static trim(t) {
        return t.replace(/(^\s*)|(\s*$)/g, "");
    }

    public static isBlank(t): boolean {
        return (
            null == t ||
            "" == t ||
            " " == t ||
            "0" == t ||
            "null" == t ||
            "undefined" == t
        );
    }

    public static isNull(s) {
        return s === "null";
    }

    public static nameHasLimit(t, limit) {
        if (!t)
            return true;
        if (limit < 0)
            return true;
        return t.length <= limit;
    }

    public static hasLimit(t) {
        for (
            var e = ["|", "#", "<", ">", "%", "*", "/", "\\", "="],
            o = 0,
            i = e.length;
            o < i;
            o++
        )
            if (t.indexOf(e[o]) >= 0) return !0;
        return !1;
    }

    public static hasBlank(t) {
        for (
            var e = ["\n", "\r", "\t", "\f", " ", "　"], o = 0, i = e.length;
            o < i;
            o++
        )
            if (t.indexOf(e[o]) >= 0) return !0;
        return !1;
    }

    public static hasEmoji(t) {
        return t.indexOf("\ud83c") >= 0 || t.indexOf("\ud83d") >= 0;
    }

    // 对数字补某个字符 num  数字， n n位 charIn 要填充的字符
    public static pad(num, n, charIn) {
        var len = num.toString().length;
        while (len < n) {
            num = charIn + num;
            len++;
        }
        return num;
    }

    public static splitTxt(str, splitNum) {
        let temp = [];
        if (null == str) {
            return temp;
        }
        let v = "";
        for (var index = 0; index < str.length; index++) {
            v += str.charAt(index);
            if (index % splitNum === 0 && index !== 0) {
                temp.push(v);
                v = "";
            }
        }
        temp.push(v);
        return temp;
    }

    public static getSizeStr(t) {
        null == t && (t = 0);
        return t > 1048576
            ? (t / 1024 / 1024).toFixed(2) + "M"
            : (t / 1024).toFixed(1) + "KB";
    }
    //#endregion

    /**
     * 插值函数
     * @param left 
     * @param right 
     * @param rate 
     */
    public static Lerp(left: number, right: number, rate: number) {
        return left + (right - left) * rate;
    }

    /**
     * 把num收敛在left right之间
     * 返回的是一个结构 hasClamp代表有没约束 result是结果
     * @param left 
     * @param right 
     * @param num 
     */
    public static ClampNum(left: number, right: number, num: number): {
        hasClamp: boolean,
        result: number
    } {
        let hasClamp = !(num >= left && num <= right);
        let ans;
        ans = (num >= left) ? num : left;
        ans = (ans <= right) ? ans : right;
        return {
            hasClamp: hasClamp,
            result: ans
        };
    }

    /**
     * 二分查找区间,返回对应index，getValueFunc如果不传的话 就是直接用dataList[index]的值和key做比较
     * @param dataList 
     * @param compareValue 
     * @param getValueFunc 
     * @returns 
     */
    public static BinSearchSection(dataList, compareValue: number, getValueFunc?: Function) {
        let listCount = (null != dataList) ? dataList.length : 0;
        if (listCount < 1) return -1;
        let low = 0;
        let high = listCount - 1;
        let mid;
        while (low < high) {
            mid = Math.floor((low + high) / 2);
            let value = (null != getValueFunc) ? getValueFunc(dataList[mid]) : dataList[mid];
            if (null == value) {
                HDebug.Error("二分查找区间方法的getValueFunc取到的数值为空，请检查");
                break;
            }
            if (high == low + 1) {
                //剩两个的情况 有点特殊
                let lowValue = (null != getValueFunc) ? getValueFunc(dataList[low]) : dataList[low];
                let highValue = (null != getValueFunc) ? getValueFunc(dataList[high]) : dataList[high];
                if (lowValue <= compareValue && compareValue < highValue) {
                    return low;
                }
                else {
                    return high;
                }
            }
            else {
                if (compareValue == value) {
                    return mid;
                }
                else if (compareValue < value) {
                    high = mid - 1;
                }
                else if (compareValue > value) {
                    low = mid + 1;
                }
            }
        }
        return low;
    }


    /**
     * 判断两个简单的obj对象是否相等 基本数据类型也行
     * @param x 
     * @param y 
     */
    public static isObjEqual(x, y) {
        var f1 = x instanceof Object;
        var f2 = y instanceof Object;
        if (!f1 || !f2) {
            return x === y;
        }
        if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
        }
        for (var p in x) {
            var a = x[p] instanceof Object;
            var b = y[p] instanceof Object;
            if (a && b) {
                this.isObjEqual(x[p], y[p]);
            } else if (x[p] != y[p]) {
                return false;
            }
        }
        return true;
    }

    public static getAngle(pos1, pos2) {
        var len_y = pos2.y - pos1.y;
        var len_x = pos2.x - pos1.x;
        var angle = 0;
        if (len_x == 0) {
            if (len_y > 0) {
                angle = 0;
            }
            else if (len_y < 0) {
                angle = 180;
            }
        }
        else {
            var tan_yx = Math.abs(len_y) / Math.abs(len_x);
            if (len_y > 0 && len_x < 0) {
                angle = Math.atan(tan_yx) * 180 / Math.PI - 90;
            }
            else if (len_y > 0 && len_x > 0) {
                angle = 90 - Math.atan(tan_yx) * 180 / Math.PI;
            }
            else if (len_y < 0 && len_x < 0) {
                angle = -Math.atan(tan_yx) * 180 / Math.PI - 90;
            }
            else if (len_y < 0 && len_x > 0) {
                angle = Math.atan(tan_yx) * 180 / Math.PI + 90;
            }
            else if (len_y == 0) {
                if (len_x > 0) {
                    angle = 90;
                }
                else if (len_x < 0) {
                    angle = -90;
                }
            }
        }

        return angle;
    }

    /**
     * 返回时为屏幕正右方的角度为0，逆时针方向增加角度
     * @param startPos 
     * @param endPos 
     * @param lowerLimit 
     * @param upperLimit 
     * @returns 
     */
    public static getRotation(startPos: cc.Vec2, endPos: cc.Vec2, lowerLimit : number = 0, upperLimit : number = 360): number {
        let dir = new cc.Vec2(endPos.x - startPos.x,endPos.y - startPos.y);
        let angle = 0;
        if(dir.x == 0){
            angle = dir.y < 0 ? 270 : 90;
        }
        else{
            angle = Math.atan(dir.y / dir.x) * 180 / 3.14;
            if (dir.x < 0) {
                angle += 180;
            }
            else if (dir.y < 0) {
                angle += 360;
            }
            if (angle < 0) {
                angle += 180;
            }
        }
        
        if (angle < lowerLimit) {
            angle = lowerLimit;
        }
        else if (angle > upperLimit) {
            angle = upperLimit;
        }
        return angle
    }

    public static getDistance(pos1, pos2) {
        var distance = Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
        return distance;
    }

    //cc.Vec3
    public static getWorldPosition(node: cc.Node, offset?): any {
        var temPos = node.position;
        if (offset) {
            temPos.x += offset.x;
            temPos.y += offset.y;
        }
        let position = node.parent.convertToWorldSpaceAR(temPos);
        return position;
    }

    public static setWorldPosition(targetNode: cc.Node, position) {
        let pos = targetNode.parent.convertToNodeSpaceAR(position);
        targetNode.setPosition(pos);
    }

    public static setWorldPositionByTarget(needSetNode: cc.Node, originNode: cc.Node, offset?) {
        let position = this.getWorldPosition(originNode, offset);// originNode.parent.convertToWorldSpaceAR(originNode.position)
        let pos = needSetNode.parent.convertToNodeSpaceAR(position);
        needSetNode.setPosition(pos);
    }

    public static getNodePositionByWorldPos(targetNode: cc.Node, worldPos): cc.Vec2 {
        return targetNode.parent.convertToNodeSpaceAR(worldPos);
    }

    public static converToNodeSpace(src, des) {
        let wPos = src.parent.convertToWorldSpaceAR(src.position);
        return des.convertToNodeSpaceAR(wPos);
    }

    //位置不变的情况下更改节点
    public static changeParent(node: cc.Node, parent: cc.Node) {
        var pos1 = node.convertToWorldSpaceAR(cc.v2(0, 0));
        var pos2 = parent.convertToNodeSpaceAR(pos1);
        node.setParent(parent);
        node.setPosition(pos2);
    }

    public static replaceAllStr(target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    }

    public static AddBtnListener(btnNode: cc.Node, compName: string, funName: string, target: cc.Node, data?: string) {
        //设置按钮回调
        let evt = new cc.Component.EventHandler();
        evt.target = target;
        evt.component = compName;
        evt.handler = funName;
        if (data) {
            evt.customEventData = data;
        }
        btnNode.getComponent(cc.Button).clickEvents.push(evt);
    }

    public static isAllChinese(str: string): boolean {
        /**
         * 匹配中文字符的正则表达式： [\u4e00-\u9fa5]
         * 匹配双字节字符(包括汉字在内)：[^\x00-\xff]
         * 应用：计算字符串的长度（一个双字节字符长度计2，ASCII字符计1）
         */
        let reg = new RegExp("^[\u4e00-\u9fa5]+$");
        let legal = true;
        if (str != null) {
            let length = str.length;
            for (let index = 0; index < length; ++index) {
                let nameChar = str[index];
                if (!reg.test(nameChar)) {
                    legal = false;
                    break;
                }
            }
            return legal;
        }
        else
            return false;
    }

    public static isAllChineseOrNumberOrEnglish(str: string): boolean {
        /**
         * 匹配中文字符的正则表达式： [\u4e00-\u9fa5]
         * 匹配双字节字符(包括汉字在内)：[^\x00-\xff]
         * 应用：计算字符串的长度（一个双字节字符长度计2，ASCII字符计1）
         */
        let reg = new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$");
        let legal = true;
        if (str != null) {
            let length = str.length;
            for (let index = 0; index < length; ++index) {
                let nameChar = str[index];
                if (!reg.test(nameChar)) {
                    legal = false;
                    break;
                }
            }
            return legal;
        }
        else
            return false;
    }


    public static refreshMapGroupWithNode(groupNode: cc.Node, samePosCheck = (a, b) => { return 0 }) {
        let obj_list = [];
        groupNode.children.forEach((obj: cc.Node) => {
            obj_list.push(obj);
        });
        let sortF = (a, b) => {
            if (a.y == b.y) {
                if (b.x - a.x != 0) {
                    return b.x - a.x;
                } else {
                    return samePosCheck(a, b);
                }
            }
            else {
                return b.y - a.y;
            }
        };
        obj_list.sort(sortF);
        for (let index = 0, len = obj_list.length; index < len; index++) {
            let obj: cc.Node = obj_list[index];
            obj.setSiblingIndex(index);
        }
    }

    public static refreshMapGroup(group: cc.TiledObjectGroup, samePosCheck = (a, b) => { return 0 }) {
        FwUtils.refreshMapGroupWithNode(group.node, samePosCheck);
    }

    public static changeArr2ToVec2(arr: number[]): cc.Vec2 {
        return cc.v2(arr[0], arr[1]);
    }

    /**
     * 根据数组中对象的某个属性值进行去重
     * @param arr 对象数组
     * @param keyName  某个属性值
     * @returns 
     */
    public static uniqueObjArr(arr: any[], keyName: string) {
        let res = new Map();
        return arr.filter((a) => !res.has(a[keyName]) && res.set(a[keyName], 1));
    }

    /**
     * 枚举转数组(value值)
     * @param valueEnum 
     * @returns 
     */
    public static enum2Arr(valueEnum: any[] | Record<string, any>) {
        let values = Array.isArray(valueEnum) ? valueEnum : Object.values(valueEnum);
        const hasNum = values.some((v) => typeof v === 'number');
        if(hasNum) {
            values = values.filter((v) => typeof v === 'number');
        }
        return values;
    }
}

export class DoubleKeyDic {
    //用null表示没有这个点
    private posDic: Map<number, Map<number, any>> = new Map<number, Map<number, any>>();
    public setValue(key1: number, key2: number, value) {
        if (this.posDic.has(key1)) {
            if (this.posDic.has(key2)) {
                let targetDic = this.posDic.get(key1);
                targetDic.set(key2, value);
                this.posDic.set(key1, targetDic);
            }
            else {
                let targetDic = this.posDic.get(key1);
                targetDic.set(key2, value);
                this.posDic.set(key1, targetDic);
            }
        }
        else {
            let targetDic = new Map<number, any>();
            targetDic.set(key2, value);
            this.posDic.set(key1, targetDic);
        }
    }
    /**
     * 如果没有对应Key值的，返回的就是null
     * @param key1 
     * @param key2 
     */
    public getValue(key1: number, key2: number) {
        if (this.posDic.has(key1)) {
            let targetDic = this.posDic.get(key1);
            if (targetDic.has(key2)) {
                return targetDic.get(key2);
            }
            else {
                return null;
            }
        }
        return null;
    }
    /**
     * 禁止用此方法get出来取数据！！！
     * 这方法我写出来只是为了遍历用的！
     */
    public getMap(): Map<number, Map<number, any>> {
        return this.posDic;
    }
    public Clear() {
        this.posDic.forEach((value, key1) => {
            value.clear();
        });
        this.posDic.clear();
    }

}