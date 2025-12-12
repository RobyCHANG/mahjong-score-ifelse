// 語言類型
export type Language = 'zh-CN' | 'zh-TW';

// 麻將模式
export type MahjongMode = 'nanchang' | 'taiwan';

// 翻譯文本
interface Translations {
    // 標題
    appTitle: string;
    appSubtitle: string;

    // 步驟標題
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    jingStepTitle: string;

    // 身份
    dealer: string;
    dealerDesc: string;
    nonDealer: string;
    nonDealerDesc: string;

    // 胡牌方式
    selfDraw: string;
    selfDrawDesc: string;
    dealerDiscard: string;
    dealerDiscardDesc: string;
    nonDealerDiscard: string;
    nonDealerDiscardDesc: string;
    nonDealerDiscardDealerDesc: string;

    // 精
    hasJing: string;
    hasJingDesc: string;
    noJing: string;
    noJingDesc: string;
    zhengJing: string;
    fuJing: string;
    jingTotal: string;

    // 牌型
    pingHu: string;
    pingHuDesc: string;
    jingDiao: string;
    jingDiaoDesc: string;
    gangKai: string;
    gangKaiDesc: string;
    qiDui: string;
    qiDuiDesc: string;
    shiSanLan: string;
    shiSanLanDesc: string;
    qiXingShiSanLan: string;
    qiXingShiSanLanDesc: string;

    // 結果
    resultLabel: string;
    dealerPays: string;
    nonDealerPays: string;
    eachNonDealerPays: string;
    discardPays: string;
    jingBonusNote: string;
    noResult: string;

    // 按鈕
    reset: string;

    // 模式
    modeLabel: string;
    nanchangMode: string;
}

const translations: Record<Language, Translations> = {
    'zh-CN': {
        appTitle: '麻将计分器',
        appSubtitle: '南昌麻将 · 快速计算胡牌得分',

        step1Title: '选择身份',
        step2Title: '胡牌方式',
        step3Title: '有无精牌',
        step4Title: '选择牌型',
        jingStepTitle: '精的数量',

        dealer: '庄家',
        dealerDesc: '本局庄家',
        nonDealer: '闲家',
        nonDealerDesc: '非庄家玩家',

        selfDraw: '自摸',
        selfDrawDesc: '自己摸牌胡',
        dealerDiscard: '庄家放炮',
        dealerDiscardDesc: '庄家打出的牌',
        nonDealerDiscard: '闲家放炮',
        nonDealerDiscardDesc: '闲家打出的牌',
        nonDealerDiscardDealerDesc: '其他闲家打出的牌',

        hasJing: '有精',
        hasJingDesc: '手牌含精牌',
        noJing: '无精',
        noJingDesc: '手牌无精牌',
        zhengJing: '正精 (×2)',
        fuJing: '附精 (×1)',
        jingTotal: '总计',

        pingHu: '平胡',
        pingHuDesc: '基础胡牌',
        jingDiao: '精吊',
        jingDiaoDesc: '单吊精牌',
        gangKai: '杠开',
        gangKaiDesc: '杠上开花',
        qiDui: '七对',
        qiDuiDesc: '7个对子',
        shiSanLan: '十三烂',
        shiSanLanDesc: '无顺无对',
        qiXingShiSanLan: '七星十三烂',
        qiXingShiSanLanDesc: '含七种字牌',

        resultLabel: '结算结果',
        dealerPays: '庄家出',
        nonDealerPays: '每位闲家出',
        eachNonDealerPays: '其他闲家各出',
        discardPays: '放炮者出',
        jingBonusNote: '已加上精的加成',
        noResult: '暂未录入该组合的分值',

        reset: '重新计算',

        modeLabel: '模式',
        nanchangMode: '南昌麻将',
    },
    'zh-TW': {
        appTitle: '麻將計分器',
        appSubtitle: '南昌麻將 · 快速計算胡牌得分',

        step1Title: '選擇身份',
        step2Title: '胡牌方式',
        step3Title: '有無精牌',
        step4Title: '選擇牌型',
        jingStepTitle: '精的數量',

        dealer: '莊家',
        dealerDesc: '本局莊家',
        nonDealer: '閒家',
        nonDealerDesc: '非莊家玩家',

        selfDraw: '自摸',
        selfDrawDesc: '自己摸牌胡',
        dealerDiscard: '莊家放炮',
        dealerDiscardDesc: '莊家打出的牌',
        nonDealerDiscard: '閒家放炮',
        nonDealerDiscardDesc: '閒家打出的牌',
        nonDealerDiscardDealerDesc: '其他閒家打出的牌',

        hasJing: '有精',
        hasJingDesc: '手牌含精牌',
        noJing: '無精',
        noJingDesc: '手牌無精牌',
        zhengJing: '正精 (×2)',
        fuJing: '附精 (×1)',
        jingTotal: '總計',

        pingHu: '平胡',
        pingHuDesc: '基礎胡牌',
        jingDiao: '精吊',
        jingDiaoDesc: '單吊精牌',
        gangKai: '槓開',
        gangKaiDesc: '槓上開花',
        qiDui: '七對',
        qiDuiDesc: '7個對子',
        shiSanLan: '十三爛',
        shiSanLanDesc: '無順無對',
        qiXingShiSanLan: '七星十三爛',
        qiXingShiSanLanDesc: '含七種字牌',

        resultLabel: '結算結果',
        dealerPays: '莊家出',
        nonDealerPays: '每位閒家出',
        eachNonDealerPays: '其他閒家各出',
        discardPays: '放炮者出',
        jingBonusNote: '已加上精的加成',
        noResult: '暫未錄入該組合的分值',

        reset: '重新計算',

        modeLabel: '模式',
        nanchangMode: '南昌麻將',
    },
};

export function getTranslations(lang: Language): Translations {
    return translations[lang];
}

export const AVAILABLE_LANGUAGES: { value: Language; label: string }[] = [
    { value: 'zh-CN', label: '简体' },
    { value: 'zh-TW', label: '繁體' },
];

export const AVAILABLE_MODES: { value: MahjongMode; label: Record<Language, string> }[] = [
    { value: 'nanchang', label: { 'zh-CN': '南昌麻将', 'zh-TW': '南昌麻將' } },
    { value: 'taiwan', label: { 'zh-CN': '台湾16张麻将', 'zh-TW': '台灣16張麻將' } },
];
