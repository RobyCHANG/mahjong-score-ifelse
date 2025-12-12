// 台灣16張麻將計分器（親友局簡化版）

// 台數項目類型
export interface TaiwanScoreItem {
    id: string;
    name: string;
    nameZhCN: string;
    nameZhTW: string;
    tai: number;
    category: 'base' | 'dealer' | 'win' | 'pattern' | 'flower' | 'special';
    description?: string;
    descZhCN?: string;
    descZhTW?: string;
    isCapped?: boolean;  // 是否直接封頂（如天胡、地胡）
}

// 計算結果
export interface TaiwanScoreResult {
    totalTai: number;
    items: { item: TaiwanScoreItem; count: number }[];
    perPlayer: number;
    explanation: string;
    isCapped: boolean;
}

// 台數定義
export const TAIWAN_SCORE_ITEMS: TaiwanScoreItem[] = [
    // 基本
    { id: 'base', name: 'Base', nameZhCN: '底台', nameZhTW: '底台', tai: 1, category: 'base' },

    // 莊家相關
    { id: 'isDealer', name: 'Dealer', nameZhCN: '庄家', nameZhTW: '莊家', tai: 1, category: 'dealer', descZhCN: '莊家胡牌或放槍', descZhTW: '莊家胡牌或放槍' },
    { id: 'lianZhuang1', name: 'Consecutive Win 1', nameZhCN: '连1庄', nameZhTW: '連1莊', tai: 3, category: 'dealer', descZhCN: '連莊1次(2×1+1=3)', descZhTW: '連莊1次(2×1+1=3)' },
    { id: 'lianZhuang2', name: 'Consecutive Win 2', nameZhCN: '连2庄', nameZhTW: '連2莊', tai: 5, category: 'dealer', descZhCN: '連莊2次(2×2+1=5)', descZhTW: '連莊2次(2×2+1=5)' },
    { id: 'lianZhuang3', name: 'Consecutive Win 3', nameZhCN: '连3庄', nameZhTW: '連3莊', tai: 7, category: 'dealer', descZhCN: '連莊3次(2×3+1=7)', descZhTW: '連莊3次(2×3+1=7)' },

    // 胡牌方式
    { id: 'selfDraw', name: 'Self Draw', nameZhCN: '自摸', nameZhTW: '自摸', tai: 1, category: 'win' },
    { id: 'menQing', name: 'Concealed Hand', nameZhCN: '门清', nameZhTW: '門清', tai: 1, category: 'win', descZhCN: '全程無吃碰', descZhTW: '全程無吃碰' },
    { id: 'menQingSelfDraw', name: 'Concealed Self Draw', nameZhCN: '门清自摸', nameZhTW: '門清自摸', tai: 3, category: 'win', descZhCN: '固定3台', descZhTW: '固定3台' },

    // 牌型 - 一色類
    { id: 'qingYiSe', name: 'Pure Suit', nameZhCN: '清一色', nameZhTW: '清一色', tai: 8, category: 'pattern', descZhCN: '全同一花色', descZhTW: '全同一花色' },
    { id: 'hunYiSe', name: 'Mixed Suit', nameZhCN: '混一色', nameZhTW: '混一色', tai: 4, category: 'pattern', descZhCN: '一種花色+字牌', descZhTW: '一種花色+字牌' },

    // 牌型 - 刻子/對子類
    { id: 'duiDuiHu', name: 'All Triplets', nameZhCN: '对对胡', nameZhTW: '對對胡', tai: 4, category: 'pattern', descZhCN: '4刻/槓+1對', descZhTW: '4刻/槓+1對' },
    { id: 'qiDuiZi', name: 'Seven Pairs', nameZhCN: '七对子', nameZhTW: '七對子', tai: 4, category: 'pattern', descZhCN: '7個對子', descZhTW: '7個對子' },

    // 牌型 - 三元/字牌類
    { id: 'daSanYuan', name: 'Big Three Dragons', nameZhCN: '大三元', nameZhTW: '大三元', tai: 8, category: 'pattern', descZhCN: '中發白皆刻/槓', descZhTW: '中發白皆刻/槓' },
    { id: 'xiaoSanYuan', name: 'Small Three Dragons', nameZhCN: '小三元', nameZhTW: '小三元', tai: 4, category: 'pattern', descZhCN: '兩組刻+一將', descZhTW: '兩組刻+一將' },
    { id: 'ziYiSe', name: 'All Honors', nameZhCN: '字一色', nameZhTW: '字一色', tai: 16, category: 'pattern', descZhCN: '全字牌=封頂', descZhTW: '全字牌=封頂', isCapped: true },

    // 花牌
    { id: 'flower', name: 'Flower', nameZhCN: '花牌', nameZhTW: '花牌', tai: 1, category: 'flower', descZhCN: '每張+1台', descZhTW: '每張+1台' },

    // 特殊胡牌時機
    { id: 'tianHu', name: 'Heavenly Hand', nameZhCN: '天胡', nameZhTW: '天胡', tai: 16, category: 'special', descZhCN: '莊家起手胡=封頂', descZhTW: '莊家起手胡=封頂', isCapped: true },
    { id: 'diHu', name: 'Earthly Hand', nameZhCN: '地胡', nameZhTW: '地胡', tai: 16, category: 'special', descZhCN: '閒家首輪胡=封頂', descZhTW: '閒家首輪胡=封頂', isCapped: true },
    { id: 'renHu', name: 'Human Hand', nameZhCN: '人胡', nameZhTW: '人胡', tai: 8, category: 'special', descZhCN: '首巡被放炮', descZhTW: '首巡被放炮' },
    { id: 'haiDiLaoYue', name: 'Bottom of the Sea', nameZhCN: '海底捞月', nameZhTW: '海底撈月', tai: 1, category: 'special', descZhCN: '最後一張自摸', descZhTW: '最後一張自摸' },
    { id: 'heDiLaoYu', name: 'Bottom of the River', nameZhCN: '河底捞鱼', nameZhTW: '河底撈魚', tai: 1, category: 'special', descZhCN: '最後一張胡', descZhTW: '最後一張胡' },
    { id: 'qiangGang', name: 'Robbing Kong', nameZhCN: '抢杠', nameZhTW: '搶槓', tai: 1, category: 'special', descZhCN: '搶槓胡', descZhTW: '搶槓胡' },
];

// 計算總台數
export function calculateTaiwanScore(
    selectedItems: string[],
    flowerCount: number = 0,
    maxTai: number = 16      // 封頂台數
): TaiwanScoreResult {
    const items: { item: TaiwanScoreItem; count: number }[] = [];
    let totalTai = 0;

    // 檢查是否有封頂項目（天胡、地胡、字一色）
    const cappedItems = ['tianHu', 'diHu', 'ziYiSe'];
    const hasCappedItem = selectedItems.some(id => cappedItems.includes(id));

    if (hasCappedItem) {
        // 直接封頂，只顯示封頂項目
        const cappedId = selectedItems.find(id => cappedItems.includes(id))!;
        const cappedItem = TAIWAN_SCORE_ITEMS.find(i => i.id === cappedId)!;
        items.push({ item: cappedItem, count: 1 });

        return {
            totalTai: maxTai,
            items,
            perPlayer: 0,
            explanation: `${cappedItem.nameZhTW} = 直接封頂 ${maxTai} 台`,
            isCapped: true
        };
    }

    // 底台（固定1台）
    const baseItem = TAIWAN_SCORE_ITEMS.find(i => i.id === 'base')!;
    items.push({ item: baseItem, count: 1 });
    totalTai += 1;

    // 處理門清自摸組合邏輯
    const hasMenQingSelfDraw = selectedItems.includes('menQingSelfDraw');
    const hasSelfDraw = selectedItems.includes('selfDraw');
    const hasMenQing = selectedItems.includes('menQing');

    if (hasMenQingSelfDraw || (hasSelfDraw && hasMenQing)) {
        // 門清自摸直接3台
        const menQingSelfDrawItem = TAIWAN_SCORE_ITEMS.find(i => i.id === 'menQingSelfDraw')!;
        items.push({ item: menQingSelfDrawItem, count: 1 });
        totalTai += 3;
    } else {
        // 單獨的自摸或門清
        if (hasSelfDraw) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === 'selfDraw')!;
            items.push({ item, count: 1 });
            totalTai += 1;
        }
        if (hasMenQing) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === 'menQing')!;
            items.push({ item, count: 1 });
            totalTai += 1;
        }
    }

    // 處理莊家/連莊邏輯（只算最高的）
    const dealerIds = ['lianZhuang3', 'lianZhuang2', 'lianZhuang1', 'isDealer'];
    for (const id of dealerIds) {
        if (selectedItems.includes(id)) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === id)!;
            items.push({ item, count: 1 });
            totalTai += item.tai;
            break;  // 只算一個
        }
    }

    // 處理牌型
    const patternIds = ['qingYiSe', 'hunYiSe', 'duiDuiHu', 'qiDuiZi', 'daSanYuan', 'xiaoSanYuan'];
    for (const id of patternIds) {
        if (selectedItems.includes(id)) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === id)!;
            items.push({ item, count: 1 });
            totalTai += item.tai;
        }
    }

    // 處理特殊胡牌時機（非封頂類）
    const specialIds = ['renHu', 'haiDiLaoYue', 'heDiLaoYu', 'qiangGang'];
    for (const id of specialIds) {
        if (selectedItems.includes(id)) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === id)!;
            items.push({ item, count: 1 });
            totalTai += item.tai;
        }
    }

    // 花牌
    if (flowerCount > 0) {
        const flowerItem = TAIWAN_SCORE_ITEMS.find(i => i.id === 'flower')!;
        items.push({ item: flowerItem, count: flowerCount });
        totalTai += flowerCount;
    }

    // 封頂
    const isCapped = totalTai > maxTai;
    const cappedTai = Math.min(totalTai, maxTai);

    const explanation = isCapped
        ? `總計 ${totalTai} 台 → 封頂 ${maxTai} 台`
        : `總計 ${cappedTai} 台`;

    return {
        totalTai: cappedTai,
        items,
        perPlayer: 0,
        explanation,
        isCapped
    };
}
