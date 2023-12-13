import { BaseItemSlot } from "../AppConstants";

export enum SmallGameGameStatus {
    None = 0, // 未开始
    Ing = 1, // 进行中
    End = 2, // 结束 等待进行
}

export class smallGameInfo {
	currScore: number;      // 0
	dropInfo: { lv: number, id: number };       // { lv: 1, id: 1 }
	historyScore: number;       // 0
	multiple: number;       // 1
	power: { count: number, cdTime: number };      // { count: 500, cdTime: 0 }
	saveInfo: string;       // ""
	wifeId: number;     // 0

	seqID: number;
	roleId: number;
}


export class TotalRwdItem {
	id: number;
	need: number;
	items: BaseItemSlot[]
}

export class BattlePassInfo {
    product: any;
	rwd: any[];
	bp_isbuy: number;
	bp_level: number;
	bp_total: number;
	bp_suit: number;
	max_level: number;
	bp_next_coin: number;
}