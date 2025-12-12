// 台灣16張麻將計分器

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
}

// 計算結果
export interface TaiwanScoreResult {
    totalTai: number;
    items: { item: TaiwanScoreItem; count: number }[];
    perPlayer: number;
    explanation: string;
}

// 台數定義
export const TAIWAN_SCORE_ITEMS: TaiwanScoreItem[] = [
    // 基本
    { id: 'base', name: 'Base', nameZhCN: '底台', nameZhTW: '底台', tai: 1, category: 'base' },

    // 莊家相關
    { id: 'isDealer', name: 'Dealer', nameZhCN: '庄家', nameZhTW: '莊家', tai: 1, category: 'dealer', descZhCN: '莊家胡牌或放槍+1台', descZhTW: '莊家胡牌或放槍+1台' },
    { id: 'lianZhuang1', name: 'Consecutive Win 1', nameZhCN: '连1庄', nameZhTW: '連1莊', tai: 3, category: 'dealer' },
    { id: 'lianZhuang2', name: 'Consecutive Win 2', nameZhCN: '连2庄', nameZhTW: '連2莊', tai: 5, category: 'dealer' },
    { id: 'lianZhuang3', name: 'Consecutive Win 3', nameZhCN: '连3庄', nameZhTW: '連3莊', tai: 7, category: 'dealer' },

    // 胡牌方式
    { id: 'selfDraw', name: 'Self Draw', nameZhCN: '自摸', nameZhTW: '自摸', tai: 1, category: 'win' },
    { id: 'menQing', name: 'Concealed Hand', nameZhCN: '门清', nameZhTW: '門清', tai: 1, category: 'win', descZhCN: '全程不吃不碰', descZhTW: '全程不吃不碰' },
    { id: 'menQingSelfDraw', name: 'Concealed Self Draw', nameZhCN: '门清自摸', nameZhTW: '門清自摸', tai: 3, category: 'win', descZhCN: '直接算3台', descZhTW: '直接算3台' },

    // 牌型
    { id: 'qingYiSe', name: 'Pure Suit', nameZhCN: '清一色', nameZhTW: '清一色', tai: 8, category: 'pattern', descZhCN: '全同一花色', descZhTW: '全同一花色' },
    { id: 'hunYiSe', name: 'Mixed Suit', nameZhCN: '混一色', nameZhTW: '混一色', tai: 4, category: 'pattern', descZhCN: '一种花色+字牌', descZhTW: '一種花色+字牌' },
    { id: 'duiDuiHu', name: 'All Triplets', nameZhCN: '对对胡', nameZhTW: '對對胡', tai: 4, category: 'pattern', descZhCN: '四组刻/槓+一对将', descZhTW: '四組刻/槓+一對將' },
    { id: 'qiDuiZi', name: 'Seven Pairs', nameZhCN: '七对子', nameZhTW: '七對子', tai: 4, category: 'pattern', descZhCN: '七个对子', descZhTW: '七個對子' },
    { id: 'daSanYuan', name: 'Big Three Dragons', nameZhCN: '大三元', nameZhTW: '大三元', tai: 8, category: 'pattern', descZhCN: '中发白三组刻/槓', descZhTW: '中發白三組刻/槓' },
    { id: 'xiaoSanYuan', name: 'Small Three Dragons', nameZhCN: '小三元', nameZhTW: '小三元', tai: 4, category: 'pattern', descZhCN: '中发白其二为刻', descZhTW: '中發白其二為刻' },
    { id: 'ziYiSe', name: 'All Honors', nameZhCN: '字一色', nameZhTW: '字一色', tai: 16, category: 'pattern', descZhCN: '全部字牌', descZhTW: '全部字牌' },

    // 花牌
    { id: 'flower', name: 'Flower', nameZhCN: '花牌', nameZhTW: '花牌', tai: 1, category: 'flower', descZhCN: '每张花+1台', descZhTW: '每張花+1台' },

    // 特殊胡牌時機
    { id: 'tianHu', name: 'Heavenly Hand', nameZhCN: '天胡', nameZhTW: '天胡', tai: 16, category: 'special', descZhCN: '庄家起手胡', descZhTW: '莊家起手胡' },
    { id: 'diHu', name: 'Earthly Hand', nameZhCN: '地胡', nameZhTW: '地胡', tai: 16, category: 'special', descZhCN: '闲家第一輪自摸', descZhTW: '閒家第一輪自摸' },
    { id: 'renHu', name: 'Human Hand', nameZhCN: '人胡', nameZhTW: '人胡', tai: 8, category: 'special', descZhCN: '第一巡内有人放炮', descZhTW: '第一巡內有人放炮' },
    { id: 'haiDiLaoYue', name: 'Bottom of the Sea', nameZhCN: '海底捞月', nameZhTW: '海底撈月', tai: 1, category: 'special', descZhCN: '最后一张自摸', descZhTW: '最後一張自摸' },
    { id: 'heDiLaoYu', name: 'Bottom of the River', nameZhCN: '河底捞鱼', nameZhTW: '河底撈魚', tai: 1, category: 'special', descZhCN: '最后一张被你胡', descZhTW: '最後一張被你胡' },
    { id: 'qiangGang', name: 'Robbing Kong', nameZhCN: '抢杠', nameZhTW: '搶槓', tai: 1, category: 'special' },
    { id: 'menFeng', name: 'Seat Wind', nameZhCN: '门风台', nameZhTW: '門風台', tai: 1, category: 'special', descZhCN: '有门风刻/槓', descZhTW: '有門風刻/槓' },
    { id: 'duTing', name: 'One Chance', nameZhCN: '独听', nameZhTW: '獨聽', tai: 1, category: 'special', descZhCN: '只听一张牌', descZhTW: '只聽一張牌' },
    { id: 'bianZhang', name: 'Edge Wait', nameZhCN: '边张/坎张', nameZhTW: '邊張/坎張', tai: 1, category: 'special' },
];

// 計算總台數
export function calculateTaiwanScore(
    selectedItems: string[],
    flowerCount: number = 0,
    taiPerUnit: number = 10,  // 每台多少錢
    maxTai: number = 16      // 封頂台數
): TaiwanScoreResult {
    const items: { item: TaiwanScoreItem; count: number }[] = [];
    let totalTai = 0;

    // 底台（固定1台）
    const baseItem = TAIWAN_SCORE_ITEMS.find(i => i.id === 'base')!;
    items.push({ item: baseItem, count: 1 });
    totalTai += 1;

    // 處理門清自摸組合邏輯
    if (selectedItems.includes('menQingSelfDraw')) {
        // 門清自摸直接3台，不再算門清+自摸
        const menQingSelfDrawItem = TAIWAN_SCORE_ITEMS.find(i => i.id === 'menQingSelfDraw')!;
        items.push({ item: menQingSelfDrawItem, count: 1 });
        totalTai += 3;
        // 移除單獨的門清和自摸
        selectedItems = selectedItems.filter(id => id !== 'menQing' && id !== 'selfDraw');
    }

    // 處理連莊邏輯（只算最高的）
    const lianZhuangItems = ['lianZhuang3', 'lianZhuang2', 'lianZhuang1', 'isDealer'];
    let dealerHandled = false;
    for (const id of lianZhuangItems) {
        if (selectedItems.includes(id) && !dealerHandled) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === id)!;
            items.push({ item, count: 1 });
            totalTai += item.tai;
            dealerHandled = true;
            break;
        }
    }

    // 處理其他選項
    for (const id of selectedItems) {
        // 跳過已處理的
        if (['base', 'menQingSelfDraw', 'menQing', 'selfDraw', ...lianZhuangItems].includes(id)) {
            if (!['menQingSelfDraw'].includes(id) || selectedItems.includes('menQingSelfDraw')) {
                continue;
            }
        }
        if (lianZhuangItems.includes(id)) continue;

        const item = TAIWAN_SCORE_ITEMS.find(i => i.id === id);
        if (item && item.id !== 'flower') {
            items.push({ item, count: 1 });
            totalTai += item.tai;
        }
    }

    // 單獨處理自摸和門清（如果沒有選門清自摸）
    if (!selectedItems.includes('menQingSelfDraw')) {
        if (selectedItems.includes('selfDraw')) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === 'selfDraw')!;
            items.push({ item, count: 1 });
            totalTai += item.tai;
        }
        if (selectedItems.includes('menQing')) {
            const item = TAIWAN_SCORE_ITEMS.find(i => i.id === 'menQing')!;
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
    const cappedTai = Math.min(totalTai, maxTai);
    const perPlayer = cappedTai * taiPerUnit;

    const explanation = totalTai > maxTai
        ? `總台數 ${totalTai} 台，封頂 ${maxTai} 台`
        : `總台數 ${cappedTai} 台`;

    return {
        totalTai: cappedTai,
        items,
        perPlayer,
        explanation
    };
}
