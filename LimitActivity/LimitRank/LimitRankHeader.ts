//TODO 直接踏马拉过来的
export enum LimitRankType {
    Player = 1,             // 单服 个人榜
    COC = 2,                // 单服 商会榜
    CrossSingle = 3,        // 跨服 个人榜
    CrossCOC = 4,           // 跨服 商会榜
    CrossArea = 5,          // 区服榜
    PlayerHistory = 6,      // 单服 历史最大
    CrossSingleHistory = 7, // 跨服 历史最大

    COCHistory = 8, // 商会 历史最大
    CrossCOCHistory = 9, // 跨服区服 历史最大
    AreaHistory = 10, // 区服 历史最大
}