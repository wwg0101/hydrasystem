//单例
export class Singleton<T> {
    private static ins;
    public static GetInstance<T>(type: (new () => T)): T {
        if (this.ins == null) {
            this.CreateInstance(type);
        }
        return <T>this.ins;
    }

    public static CreateInstance<T>(type: (new () => T)) {
        this.ins = new type();
        this.ins.Init();
    }

    public static DestroyInstance() {
        if (this.ins != null) {
            this.ins.UnInit();
        }
        this.ins = null;
    }
    //初始化
    protected Init() { }
    //销毁
    protected UnInit() { }
}