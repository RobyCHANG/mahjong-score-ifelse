// 身份
export type Role = 'dealer' | 'nonDealer';

// 胡牌方式
export type WinEvent = 'selfDraw' | 'dealerDiscard' | 'nonDealerDiscard';

// 牌型
export type HandPattern =
    | 'pingHu'        // 平胡
    | 'jingDiao'      // 精吊
    | 'gangKai'       // 杠开
    | 'qiDui'         // 七对
    | 'shiSanLan'     // 十三烂
    | 'qiXingShiSanLan'; // 七星十三烂

// 场景键值
export interface ScenarioKey {
    role: Role;
    event: WinEvent;
    hasJing: boolean;
    pattern: HandPattern;
}

// 选项配置
export interface OptionConfig<T> {
    value: T;
    label: string;
    description?: string;
}

// 各选项的显示配置
export const ROLE_OPTIONS: OptionConfig<Role>[] = [
    { value: 'dealer', label: '庄家', description: '本局庄家' },
    { value: 'nonDealer', label: '闲家', description: '非庄家玩家' },
];

export const WIN_EVENT_OPTIONS: Record<Role, OptionConfig<WinEvent>[]> = {
    dealer: [
        { value: 'selfDraw', label: '自摸', description: '自己摸牌胡' },
        { value: 'nonDealerDiscard', label: '闲家放炮', description: '闲家打出的牌' },
    ],
    nonDealer: [
        { value: 'selfDraw', label: '自摸', description: '自己摸牌胡' },
        { value: 'dealerDiscard', label: '庄家放炮', description: '庄家打出的牌' },
        { value: 'nonDealerDiscard', label: '闲家放炮', description: '其他闲家打出的牌' },
    ],
};

export const JING_OPTIONS: OptionConfig<boolean>[] = [
    { value: true, label: '有精', description: '手牌含精牌' },
    { value: false, label: '无精', description: '手牌无精牌' },
];

export const HAND_PATTERN_OPTIONS: OptionConfig<HandPattern>[] = [
    { value: 'pingHu', label: '平胡', description: '基础胡牌' },
    { value: 'jingDiao', label: '精吊', description: '单吊精牌' },
    { value: 'gangKai', label: '杠开', description: '杠上开花' },
    { value: 'qiDui', label: '七对', description: '7个对子' },
    { value: 'shiSanLan', label: '十三烂', description: '无顺无对' },
    { value: 'qiXingShiSanLan', label: '七星十三烂', description: '含七种字牌' },
];

// 根据条件过滤可用的牌型
export function getAvailablePatterns(
    event: WinEvent,
    hasJing: boolean | null
): OptionConfig<HandPattern>[] {
    // 精吊只有自摸时可用
    // 杠开只有自摸+无精时可用
    return HAND_PATTERN_OPTIONS.filter(opt => {
        if (opt.value === 'jingDiao') {
            return event === 'selfDraw' && hasJing === true;
        }
        if (opt.value === 'gangKai') {
            return event === 'selfDraw';
        }
        return true;
    });
}
