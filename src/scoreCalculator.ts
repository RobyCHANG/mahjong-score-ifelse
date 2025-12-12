import { Role, WinEvent, HandPattern, ScenarioKey } from './types';

// 結算結果結構
export interface ScoreResult {
    dealerPays: number;      // 庄家要給的
    nonDealerPays: number;   // 其他闲家要給的
    discardPays: number;     // 放炮的人要給的 (如果有)
    hasDiscard: boolean;     // 是否有放炮者
}

// 分数查询表 - 返回结构化数据
type ScoreMap = Map<string, ScoreResult>;

function createKey(key: ScenarioKey): string {
    return `${key.role}-${key.event}-${key.hasJing}-${key.pattern}`;
}

const SCORE_TABLE: ScoreMap = new Map([
    // ========== 庄家胡牌 ==========

    // 庄家 - 自摸 - 有精 (闲家每人出)
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: true, pattern: 'pingHu' }),
    { dealerPays: 0, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: true, pattern: 'jingDiao' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: true, pattern: 'gangKai' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: true, pattern: 'qiDui' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: true, pattern: 'shiSanLan' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: true, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 0, nonDealerPays: 16, discardPays: 0, hasDiscard: false }],

    // 庄家 - 自摸 - 无精 (闲家每人出)
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: false, pattern: 'pingHu' }),
    { dealerPays: 0, nonDealerPays: 13, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: false, pattern: 'gangKai' }),
    { dealerPays: 0, nonDealerPays: 21, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: false, pattern: 'qiDui' }),
    { dealerPays: 0, nonDealerPays: 21, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: false, pattern: 'shiSanLan' }),
    { dealerPays: 0, nonDealerPays: 21, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'dealer', event: 'selfDraw', hasJing: false, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 0, nonDealerPays: 37, discardPays: 0, hasDiscard: false }],

    // 庄家 - 闲家放炮 - 有精
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'pingHu' }),
    { dealerPays: 0, nonDealerPays: 2, discardPays: 4, hasDiscard: true }],
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'qiDui' }),
    { dealerPays: 0, nonDealerPays: 4, discardPays: 8, hasDiscard: true }],
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'shiSanLan' }),
    { dealerPays: 0, nonDealerPays: 4, discardPays: 8, hasDiscard: true }],
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 16, hasDiscard: true }],

    // 庄家 - 闲家放炮 - 无精
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'pingHu' }),
    { dealerPays: 0, nonDealerPays: 4, discardPays: 13, hasDiscard: true }],
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'qiDui' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 21, hasDiscard: true }],
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'shiSanLan' }),
    { dealerPays: 0, nonDealerPays: 8, discardPays: 21, hasDiscard: true }],
    [createKey({ role: 'dealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 0, nonDealerPays: 16, discardPays: 37, hasDiscard: true }],

    // ========== 闲家胡牌 ==========

    // 闲家 - 自摸 - 有精
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: true, pattern: 'pingHu' }),
    { dealerPays: 4, nonDealerPays: 2, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: true, pattern: 'jingDiao' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: true, pattern: 'gangKai' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: true, pattern: 'qiDui' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: true, pattern: 'shiSanLan' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: true, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 16, nonDealerPays: 8, discardPays: 0, hasDiscard: false }],

    // 闲家 - 自摸 - 无精
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: false, pattern: 'pingHu' }),
    { dealerPays: 13, nonDealerPays: 9, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: false, pattern: 'gangKai' }),
    { dealerPays: 21, nonDealerPays: 13, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: false, pattern: 'qiDui' }),
    { dealerPays: 21, nonDealerPays: 13, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: false, pattern: 'shiSanLan' }),
    { dealerPays: 21, nonDealerPays: 13, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'selfDraw', hasJing: false, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 37, nonDealerPays: 21, discardPays: 0, hasDiscard: false }],

    // 闲家 - 庄家放炮 - 有精
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: true, pattern: 'pingHu' }),
    { dealerPays: 4, nonDealerPays: 1, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: true, pattern: 'qiDui' }),
    { dealerPays: 8, nonDealerPays: 2, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: true, pattern: 'shiSanLan' }),
    { dealerPays: 8, nonDealerPays: 2, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: true, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 16, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],

    // 闲家 - 庄家放炮 - 无精
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: false, pattern: 'pingHu' }),
    { dealerPays: 13, nonDealerPays: 2, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: false, pattern: 'qiDui' }),
    { dealerPays: 21, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: false, pattern: 'shiSanLan' }),
    { dealerPays: 21, nonDealerPays: 4, discardPays: 0, hasDiscard: false }],
    [createKey({ role: 'nonDealer', event: 'dealerDiscard', hasJing: false, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 37, nonDealerPays: 8, discardPays: 0, hasDiscard: false }],

    // 闲家 - 闲家放炮 - 有精
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'pingHu' }),
    { dealerPays: 2, nonDealerPays: 1, discardPays: 2, hasDiscard: true }],
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'qiDui' }),
    { dealerPays: 4, nonDealerPays: 2, discardPays: 4, hasDiscard: true }],
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'shiSanLan' }),
    { dealerPays: 4, nonDealerPays: 2, discardPays: 4, hasDiscard: true }],
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: true, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 8, hasDiscard: true }],

    // 闲家 - 闲家放炮 - 无精
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'pingHu' }),
    { dealerPays: 4, nonDealerPays: 2, discardPays: 9, hasDiscard: true }],
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'qiDui' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 13, hasDiscard: true }],
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'shiSanLan' }),
    { dealerPays: 8, nonDealerPays: 4, discardPays: 13, hasDiscard: true }],
    [createKey({ role: 'nonDealer', event: 'nonDealerDiscard', hasJing: false, pattern: 'qiXingShiSanLan' }),
    { dealerPays: 16, nonDealerPays: 8, discardPays: 21, hasDiscard: true }],
]);

export function calculateScore(
    role: Role,
    event: WinEvent,
    hasJing: boolean,
    pattern: HandPattern
): ScoreResult | null {
    const key = createKey({ role, event, hasJing, pattern });
    return SCORE_TABLE.get(key) ?? null;
}

/**
 * 將基礎分數加上精的加成
 */
export function applyJingBonus(baseScore: ScoreResult, jingBonus: number): ScoreResult {
    if (jingBonus === 0) {
        return baseScore;
    }

    return {
        dealerPays: baseScore.dealerPays > 0 ? baseScore.dealerPays + jingBonus : 0,
        nonDealerPays: baseScore.nonDealerPays > 0 ? baseScore.nonDealerPays + jingBonus : 0,
        discardPays: baseScore.discardPays > 0 ? baseScore.discardPays + jingBonus : 0,
        hasDiscard: baseScore.hasDiscard,
    };
}

// 保留舊的函數供兼容（已不使用）
export function parseScoreWithJing(baseScore: string, jingCount: number): string {
    if (jingCount === 0) {
        return baseScore;
    }
    return baseScore.replace(/(\d+)/g, (match) => {
        const num = parseInt(match, 10);
        return String(num + jingCount);
    });
}
