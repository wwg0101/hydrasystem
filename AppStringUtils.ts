import HDebug from "./HDebug";

declare let i18n;
const { ccclass, property } = cc._decorator;
//这个文件最好只引用i18n!!!!!!
@ccclass
export default class AppStringUtils {

    //循环引用添加
    // 数值显示规则：
    // 0-99999：直接显示数值0-99999
    // 100000-100099：显示10万（忽略个位十位）
    // 100100-999999：显示10.01万-99.99万（小数点精确到百位）
    // 1000000-1000999：显示100万（忽略个十百位）
    // 1001000-9999999：显示100.1万-999.9万（小数点精确到千位）
    // 10000000-99999999：显示1000万-9999万（忽略个十百千）
    //
    // 100000000-100099999：显示1亿（忽略个十百千万位）
    // 100100000-999999999：显示1.001亿-9.999亿（精确到十万位）
    // 1000000000-1000999999：显示10亿（忽略百万以内的数）
    // 1001000000-9999999999：显示10.01亿-99.99亿（精确到百万位）
    // 10000000000-10009999999：显示100亿（忽略不到千万的数）
    // 10010000000-99999999999：显示100.1亿-999.9亿（精确到千万）
    // 100000000000-9999999999999：显示1000亿-99999亿（精确到亿）
    //
    // 1000000000000-1000999999999显示1兆（忽略不到十亿的数）
    // 1001000000000-9999999999999显示1.001兆-9.999兆（精确到十亿位）
    // 10000000000000-10009999999999显示10兆（忽略不到百亿的数）
    // 10010000000000-99999999999999显示10.01兆-99.99兆（精确到百亿位）
    // 100000000000000-100099999999999显示100兆（忽略不到百亿的数）
    // 100100000000000-999999999999999显示100.1兆-999.9兆（精确到千亿）
    // 1000000000000000-9999999999999999显示1000兆-9999兆（精确到兆）
    /**
     * 常用战力等数值显示
     * @param num 
     */
    //public static number2str(num: number | string) {
    //    if (null == num) return "0";
    //    num = Number(num);
    //    let isNegative = num < 0;
    //    num = Math.abs(num);
    //    let getPointNum = (number) => {
    //        let list = [10e4, 10.01e4, 100e4, 100.1e4, 1000e4,
    //            1e8, 1.001e8, 10e8, 10.01e8, 100e8, 100.1e8, 1000e8,
    //            1e12, 1.001e12, 10e12, 10.01e12, 100e12, 100.1e12, 1000e12];
    //        let pointNum = [0, 2, 0, 1, 0,
    //            0, 3, 0, 2, 0, 1, 0,
    //            0, 3, 0, 2, 0, 1, 0];
    //        let i = 0;
    //        for (let index = 0, len = list.length; index < len; index++) {
    //            let n = list[index];
    //            if (number < n) {
    //                i = index - 1;
    //                break;
    //            }
    //        }
    //        return pointNum[i];
    //    };
//
    //    let toDecimal = (number, pointnum) => {
    //        var f = parseFloat(number);
    //        if (isNaN(f)) {
    //            return;
    //        }
    //        switch (pointnum) {
    //            case 0:
    //                f = Math.floor(number);
    //                break;
    //            case 1:
    //                f = Math.floor(number * 1000 / 100) / 10;
    //                break;
    //            case 2:
    //                f = Math.floor(number * 10000 / 100) / 100;
    //                break;
    //            case 3:
    //                f = Math.floor(number * 100000 / 100) / 1000;
    //                break;
    //        }
    //        var s = f.toString();
    //        // var rs = s.indexOf('.');
    //        // if (rs < 0 && pointnum > 0) {
    //        //     rs = s.length;
    //        //     s += '.';
    //        // }
    //        // while (s.length <= rs + pointnum) {
    //        //     s += '0';
    //        // }
    //        return s;
    //    }
//
    //    let str = "";
    //    if (num < 10e4) {
    //        // 小于10万
    //        str = num + "";
    //    }
    //    else if (num < 1e8) {
    //        // 小于1亿
    //        str = toDecimal(num / 1e4, (getPointNum(num))) + i18n.t("COMMON_WAN");
    //    }
    //    else if (num < 1e12) {
    //        // 小于1兆
    //        str = toDecimal((num / 1e8), (getPointNum(num))) + i18n.t("COMMON_YI");
    //    }
    //    else {
    //        // 大于1兆
    //        str = toDecimal((num / 1e12), (getPointNum(num))) + i18n.t("COMMON_ZHAO");
    //    }
//
    //    if (isNegative) {
    //        str = "-" + str;
    //    }
    //    return str;
    //}

    /**
     * 此方法仅用于将number2str转化获得的字符串重新转为number
     * attention：会丢失精度
     * @param str 
     * @returns 
     */
    //public static str2number(str: string) {
    //    //TODO 获取str最后的单位
    //    let strLength = str.length;
    //    let num = str.substring(0, strLength - 1);
    //    let unit = str.substring(strLength - 1, strLength);
    //    switch (unit) {
    //        case (i18n.t("COMMON_WAN")):
    //            return Number(num) * 1e4;
    //        case (i18n.t("COMMON_YI")):
    //            return Number(num) * 1e8;
    //        case (i18n.t("COMMON_ZHAO")):
    //            return Number(num) * 1e12;
    //        default:
    //            return Number(str);
    //    }
    //}

    /**
     * 数字转换成中文字(不带十百千，直接转换, 如125 直接转成一二五)
     * @param num 输入的数
     */
    //public static changeToCNWithOutDesc(num: number): string {
    //    let chnNumChar = i18n.t("COMMON_HANZI").split("|");
    //    let index = num.toString().indexOf(".");
    //    if (index != -1) {
    //        let str1 = num.toString().slice(0, index);
    //        let a = "";
    //        for (let i = 0; i < str1.length; ++i) {
    //            a += chnNumChar[parseInt(str1[i])];
    //        }
    //        let str2 = num.toString().slice(index);
    //        let b = i18n.t("COMMON_HANZI_DIAN");
    //        for (let i = 1; i < str2.length; i++) {
    //            b += chnNumChar[parseInt(str2[i])];
    //        }
    //        return a + b;
    //    } else {
    //        let str = num.toString();
    //        let a = "";
    //        for (let i = 0; i < str.length; ++i) {
    //            a += chnNumChar[parseInt(str[i])];
    //        }
    //        return a;
    //    }
    //}

    /**
     * 数字转换成中文字
     * @param num 输入的数
     */
    //public static changeToCN(num: number): string {
    //    let chnNumChar = i18n.t("COMMON_HANZI").split("|");
    //    // 万 亿 万亿 亿亿
    //    let chnUnitSection = ["", i18n.t("COMMON_WAN"), i18n.t("COMMON_HANZI_YI"), i18n.t("COMMON_HANZI_WANYI"), i18n.t("COMMON_HANZI_YIYI")];
    //    // 十 百 千
    //    let chnUnitChar = ["", i18n.t("COMMON_HANZI_SHI"), i18n.t("COMMON_HANZI_BAI"), i18n.t("COMMON_HANZI_QIAN")];
    //    //如果数字含有小数部分，那么可以将小数部分单独取出
    //    //将小数部分的数字转换为字符串的方法：
    //    let numToChn = (number) => {
    //        var index = number.toString().indexOf(".");
    //        if (index != -1) {
    //            var str = number.toString().slice(index);
    //            var a = i18n.t("COMMON_HANZI_DIAN");
    //            for (var i = 1; i < str.length; i++) {
    //                a += chnNumChar[parseInt(str[i])];
    //            }
    //            return a;
    //        } else {
    //            return '';
    //        }
    //    }
    //    //定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
    //    let sectionToChn = (section) => {
    //        let str = '', chnstr = '', zero = false, count = 0;   //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
    //        while (section > 0) {
    //            let v = section % 10;  //对数字取余10，得到的数即为个位数
    //            if (v == 0) {                    //如果数字为零，则对字符串进行补零
    //                if (zero) {
    //                    zero = false;        //如果遇到连续多次取余都是0，那么只需补一个零即可
    //                    chnstr = chnNumChar[v] + chnstr;
    //                }
    //            } else {
    //                zero = true;           //第一次取余之后，如果再次取余为零，则需要补零
    //                str = chnNumChar[v];
    //                str += chnUnitChar[count];
    //                chnstr = str + chnstr;
    //            }
    //            count++;
    //            section = Math.floor(section / 10);
    //        }
    //        return chnstr;
    //    }
//
    //    //定义整个数字全部转换的方法，需要依次对数字进行10000为单位的取余，然后分成小节，按小节计算，当每个小节的数不足1000时，则需要进行补零
    //    let result = '';
    //    let a = numToChn(num);
    //    num = Math.floor(num);
    //    let unitPos = 0;
    //    let strIns = '', chnStr = '';
    //    let needZero = false;
//
    //    if (num >= 0 && num < 10) {
    //        return chnNumChar[num] + a;
    //    }
    //    else if (num >= 10 && num < 20) {
    //        let numStr = num.toString();
    //        let n = numStr.substring(1, 2);
    //        let result = chnUnitChar[1] + (Number(n) == 0 ? '' : chnNumChar[n]);
    //        return result + a;
    //    }
//
    //    while (num > 0) {
    //        let section = num % 10000;
    //        if (needZero) {
    //            chnStr = chnNumChar[0] + chnStr;
    //        }
    //        strIns = sectionToChn(section);
    //        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    //        chnStr = strIns + chnStr;
    //        needZero = (section < 1000) && (section > 0);
    //        num = Math.floor(num / 10000);
    //        unitPos++;
    //    }
    //    result = chnStr + a;
    //    return result;
    //}

    /**
     * 去除richtext標籤, \n會替換成,
     * <size=70><color=#ff0000><b>親愛的玩家朋友們\n</b></color></size><br/><outline color=#504A44 width=1><color=#504A44>樣例展示</color></outline>
     * @param txt
     * @returns
     */
    public static GetPureString(txt: string): string {
        if (null == txt || txt.length < 1) {
            return "";
        }
        let a = txt.replace(/<[^>]+>/g, "")
        return a.replace(/\n/g, "，");
    }

    /**
     * 去除換行符
     * @param str 
     * @returns 
     */
    public static CutWrap(str: string): string {
        if (null == str || str.length < 1) {
            return "";
        }
        let newStr = str.replace(/\n/g, "");
        newStr = newStr.replace(/\t/g, "");
        return newStr;
    }
}