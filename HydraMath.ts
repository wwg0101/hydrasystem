export default class HydraMath {
    public static mul(a, b) {
        var astr = a.toString(),
            bstr = b.toString(),
            abLength = 0;
        try {
            abLength += astr.split(".")[1].length;
        } catch (f) { }
        try {
            abLength += bstr.split(".")[1].length;
        } catch (f) { }
        return Number(astr.replace(".", "")) *
            Number(bstr.replace(".", "")) /
            Math.pow(10, abLength);
    }
    
    public static div(a, b) {
        //inta = 整数a
        //intb = 整数b
        //longest = aLength和bLength的最大值
        var inta,
            intb,
            alength = 0,
            blength = 0;
        try {
            alength = a.toString()
                .split(".")[1]
                .length;
        } catch (g) { }
        try {
            blength = b.toString()
                .split(".")[1]
                .length;
        } catch (g) { }
        //a取整
        inta = Number(
            a.toString()
                .replace(".", "")
        );
        //b取整
        intb = Number(
            b.toString()
                .replace(".", "")
        );
        //调用乘法运算，
        //用升级为整数的
        //(a/b)*(alength - blength)小数位数，
        //并返回运算厚的值；
        //假如是0.18/0.3
        //到这一步就是mul(18/3,0.1)
        return HydraMath.mul(
            inta / intb,
            Math.pow(10, blength - alength)
        );
    }
}