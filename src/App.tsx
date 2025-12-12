import { useState, useEffect } from 'react';
import {
    Role,
    WinEvent,
    HandPattern,
    OptionConfig,
} from './types';
import { calculateScore, applyJingBonus, ScoreResult } from './scoreCalculator';
import { Language, MahjongMode, getTranslations, AVAILABLE_MODES } from './i18n';
import './App.css';

// 正精數量選項 (0-3)
const ZHENG_JING_OPTIONS: OptionConfig<number>[] = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

// 附精數量選項 (0-3)
const FU_JING_OPTIONS: OptionConfig<number>[] = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

function App() {
    // 語言和模式
    const [language, setLanguage] = useState<Language>('zh-CN');
    const [mode, setMode] = useState<MahjongMode>('nanchang');
    const t = getTranslations(language);

    // 状态
    const [role, setRole] = useState<Role | null>(null);
    const [winEvent, setWinEvent] = useState<WinEvent | null>(null);
    const [hasJing, setHasJing] = useState<boolean | null>(null);
    const [zhengJingCount, setZhengJingCount] = useState<number | null>(null);
    const [fuJingCount, setFuJingCount] = useState<number | null>(null);
    const [pattern, setPattern] = useState<HandPattern | null>(null);

    // 计算结果
    const [result, setResult] = useState<ScoreResult | null>(null);

    // 動態選項配置
    const ROLE_OPTIONS: OptionConfig<Role>[] = [
        { value: 'dealer', label: t.dealer, description: t.dealerDesc },
        { value: 'nonDealer', label: t.nonDealer, description: t.nonDealerDesc },
    ];

    const WIN_EVENT_OPTIONS: Record<Role, OptionConfig<WinEvent>[]> = {
        dealer: [
            { value: 'selfDraw', label: t.selfDraw, description: t.selfDrawDesc },
            { value: 'nonDealerDiscard', label: t.nonDealerDiscard, description: t.nonDealerDiscardDesc },
        ],
        nonDealer: [
            { value: 'selfDraw', label: t.selfDraw, description: t.selfDrawDesc },
            { value: 'dealerDiscard', label: t.dealerDiscard, description: t.dealerDiscardDesc },
            { value: 'nonDealerDiscard', label: t.nonDealerDiscard, description: t.nonDealerDiscardDealerDesc },
        ],
    };

    const JING_OPTIONS: OptionConfig<boolean>[] = [
        { value: true, label: t.hasJing, description: t.hasJingDesc },
        { value: false, label: t.noJing, description: t.noJingDesc },
    ];

    const HAND_PATTERN_OPTIONS: OptionConfig<HandPattern>[] = [
        { value: 'pingHu', label: t.pingHu, description: t.pingHuDesc },
        { value: 'jingDiao', label: t.jingDiao, description: t.jingDiaoDesc },
        { value: 'gangKai', label: t.gangKai, description: t.gangKaiDesc },
        { value: 'qiDui', label: t.qiDui, description: t.qiDuiDesc },
        { value: 'shiSanLan', label: t.shiSanLan, description: t.shiSanLanDesc },
        { value: 'qiXingShiSanLan', label: t.qiXingShiSanLan, description: t.qiXingShiSanLanDesc },
    ];

    // 获取可用的胡牌方式
    const availableWinEvents = role ? WIN_EVENT_OPTIONS[role] : [];

    // 获取可用的牌型 (使用翻譯後的配置)
    const availablePatterns = winEvent
        ? HAND_PATTERN_OPTIONS.filter(opt => {
            if (opt.value === 'jingDiao') {
                return winEvent === 'selfDraw' && hasJing === true;
            }
            if (opt.value === 'gangKai') {
                return winEvent === 'selfDraw';
            }
            return true;
        })
        : [];

    // 计算精的总加成: 正精 × 2 + 附精 × 1
    const totalJingBonus = (zhengJingCount ?? 0) * 2 + (fuJingCount ?? 0) * 1;

    // 当选择变化时重置后续选项
    useEffect(() => {
        if (role === null) {
            setWinEvent(null);
        }
    }, [role]);

    useEffect(() => {
        if (winEvent === null) {
            setHasJing(null);
        }
    }, [winEvent]);

    useEffect(() => {
        if (hasJing === null) {
            setZhengJingCount(null);
            setFuJingCount(null);
            setPattern(null);
        } else if (hasJing === false) {
            setZhengJingCount(0);
            setFuJingCount(0);
        } else {
            setZhengJingCount(null);
            setFuJingCount(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasJing]);

    // 判斷精數量是否已選擇完成
    const jingSelectionComplete = hasJing === false ||
        (hasJing === true && zhengJingCount !== null && fuJingCount !== null);

    useEffect(() => {
        if (hasJing === true && !jingSelectionComplete) {
            setPattern(null);
        }
    }, [hasJing, jingSelectionComplete]);

    // 计算分数
    useEffect(() => {
        if (role && winEvent && hasJing !== null && jingSelectionComplete && pattern) {
            const baseScore = calculateScore(role, winEvent, hasJing, pattern);
            if (baseScore) {
                const finalResult = applyJingBonus(baseScore, totalJingBonus);
                setResult(finalResult);
            } else {
                setResult(null);
            }
        } else {
            setResult(null);
        }
    }, [role, winEvent, hasJing, zhengJingCount, fuJingCount, pattern, jingSelectionComplete, totalJingBonus]);

    // 重置所有选项
    const handleReset = () => {
        setRole(null);
        setWinEvent(null);
        setHasJing(null);
        setZhengJingCount(null);
        setFuJingCount(null);
        setPattern(null);
        setResult(null);
    };

    // 切換語言
    const toggleLanguage = () => {
        setLanguage(prev => prev === 'zh-CN' ? 'zh-TW' : 'zh-CN');
    };

    // 渲染选项组
    const renderOptions = <T,>(
        options: OptionConfig<T>[],
        selected: T | null,
        onSelect: (value: T) => void,
        columns: 2 | 3 | 4 = 2
    ) => (
        <div className={`options options--${columns}col`}>
            {options.map((opt) => (
                <button
                    key={String(opt.value)}
                    className={`option ${selected === opt.value ? 'option--selected' : ''}`}
                    onClick={() => onSelect(opt.value)}
                >
                    <span className="option__label">{opt.label}</span>
                    {opt.description && <span className="option__desc">{opt.description}</span>}
                </button>
            ))}
        </div>
    );

    // 渲染結算結果
    const renderResult = (result: ScoreResult) => {
        const isDealer = role === 'dealer';

        return (
            <div className="result-details">
                {result.dealerPays > 0 && (
                    <div className="result-row">
                        <span className="result-row__label">🏠 {t.dealerPays}</span>
                        <span className="result-row__value result-row__value--dealer">
                            {result.dealerPays}
                        </span>
                    </div>
                )}

                <div className="result-row">
                    <span className="result-row__label">
                        👤 {isDealer ? t.nonDealerPays : t.eachNonDealerPays}
                    </span>
                    <span className="result-row__value result-row__value--nondealer">
                        {result.nonDealerPays}
                    </span>
                </div>

                {result.hasDiscard && result.discardPays > 0 && (
                    <div className="result-row">
                        <span className="result-row__label">💥 {t.discardPays}</span>
                        <span className="result-row__value result-row__value--discard">
                            {result.discardPays}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // 判斷是否需要顯示精數量步驟
    const showJingCountStep = hasJing === true;
    // 判斷是否可以選牌型
    const canSelectPattern = jingSelectionComplete;

    return (
        <div className="app">
            {/* 頂部工具欄 */}
            <div className="toolbar">
                {/* 模式選擇 - 可點擊切換 */}
                <button
                    className="toolbar__mode-btn"
                    onClick={() => {
                        // 循環切換模式（目前只有一個，未來可擴展）
                        const modes = AVAILABLE_MODES.map(m => m.value);
                        const currentIndex = modes.indexOf(mode);
                        const nextIndex = (currentIndex + 1) % modes.length;
                        setMode(modes[nextIndex]);
                    }}
                >
                    🀄 {AVAILABLE_MODES.find(m => m.value === mode)?.label[language]}
                </button>

                {/* 語言切換 */}
                <button className="toolbar__btn" onClick={toggleLanguage}>
                    {language === 'zh-CN' ? '繁' : '简'}
                </button>
            </div>

            {/* 标题 */}
            <header className="header">
                <div className="header__icon">🀄</div>
                <h1 className="header__title">{t.appTitle}</h1>
                <p className="header__subtitle">{t.appSubtitle}</p>
            </header>

            {/* 主卡片 */}
            <main className="card">
                {/* 步骤 1: 身份 */}
                <section className="step">
                    <div className="step__label">
                        <span className="step__number">1</span>
                        <span className="step__title">{t.step1Title}</span>
                    </div>
                    {renderOptions(ROLE_OPTIONS, role, setRole)}
                </section>

                {/* 步骤 2: 胡牌方式 */}
                <section className={`step ${!role ? 'step--disabled' : ''}`}>
                    <div className="step__label">
                        <span className="step__number">2</span>
                        <span className="step__title">{t.step2Title}</span>
                    </div>
                    {role && renderOptions(availableWinEvents, winEvent, setWinEvent)}
                </section>

                {/* 步骤 3: 有无精 */}
                <section className={`step ${!winEvent ? 'step--disabled' : ''}`}>
                    <div className="step__label">
                        <span className="step__number">3</span>
                        <span className="step__title">{t.step3Title}</span>
                    </div>
                    {winEvent && renderOptions(JING_OPTIONS, hasJing, setHasJing)}
                </section>

                {/* 步骤 3.5: 精的數量 */}
                {showJingCountStep && (
                    <section className="step jing-step">
                        <div className="step__label">
                            <span className="step__number">✦</span>
                            <span className="step__title">{t.jingStepTitle}</span>
                        </div>

                        <div className="jing-selectors">
                            <div className="jing-selector">
                                <span className="jing-selector__label">{t.zhengJing}</span>
                                {renderOptions(ZHENG_JING_OPTIONS, zhengJingCount, setZhengJingCount, 4)}
                            </div>
                            <div className="jing-selector">
                                <span className="jing-selector__label">{t.fuJing}</span>
                                {renderOptions(FU_JING_OPTIONS, fuJingCount, setFuJingCount, 4)}
                            </div>
                        </div>

                        {zhengJingCount !== null && fuJingCount !== null && (
                            <div className="jing-total">
                                {t.jingTotal}: {zhengJingCount}×2 + {fuJingCount}×1 = <strong>+{totalJingBonus}</strong>
                            </div>
                        )}
                    </section>
                )}

                {/* 步骤 4: 牌型 */}
                <section className={`step ${!canSelectPattern ? 'step--disabled' : ''}`}>
                    <div className="step__label">
                        <span className="step__number">4</span>
                        <span className="step__title">{t.step4Title}</span>
                    </div>
                    {canSelectPattern && renderOptions(availablePatterns, pattern, setPattern, 3)}
                </section>

                {/* 结果 */}
                {result ? (
                    <div className="result">
                        <div className="result__label">{t.resultLabel}</div>
                        {renderResult(result)}
                        {hasJing && totalJingBonus > 0 && (
                            <div className="result__note">
                                {t.jingBonusNote} (+{totalJingBonus})
                            </div>
                        )}
                    </div>
                ) : (
                    role && winEvent && canSelectPattern && pattern && (
                        <div className="no-result">{t.noResult}</div>
                    )
                )}

                {/* 重置按钮 */}
                {(role || winEvent || hasJing !== null || pattern) && (
                    <button className="reset-btn" onClick={handleReset}>
                        <span>↻</span>
                        <span>{t.reset}</span>
                    </button>
                )}
            </main>
        </div>
    );
}

export default App;
