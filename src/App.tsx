import { useState, useEffect } from 'react';
import {
    Role,
    WinEvent,
    HandPattern,
    OptionConfig,
} from './types';
import { calculateScore, applyJingBonus, ScoreResult } from './scoreCalculator';
import { Language, MahjongMode, getTranslations, AVAILABLE_MODES } from './i18n';
import { CustomSelect } from './CustomSelect';
import { TaiwanMahjong } from './TaiwanMahjong';
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

type Theme = 'light' | 'dark';

function App() {
    // 主題（初始淺色）
    const [theme, setTheme] = useState<Theme>('light');

    // 語言和模式（初始：台灣麻將 + 繁體）
    const [language, setLanguage] = useState<Language>('zh-TW');
    const [mode, setMode] = useState<MahjongMode>('taiwan');
    const t = getTranslations(language);

    // 模式切換時自動切換語言
    const handleModeChange = (newMode: MahjongMode) => {
        setMode(newMode);
        // 台灣模式 -> 繁體，南昌模式 -> 簡體
        if (newMode === 'taiwan') {
            setLanguage('zh-TW');
        } else if (newMode === 'nanchang') {
            setLanguage('zh-CN');
        }
    };

    // 状态
    const [role, setRole] = useState<Role | null>(null);
    const [winEvent, setWinEvent] = useState<WinEvent | null>(null);
    const [hasJing, setHasJing] = useState<boolean | null>(null);
    const [zhengJingCount, setZhengJingCount] = useState<number | null>(null);
    const [fuJingCount, setFuJingCount] = useState<number | null>(null);
    const [pattern, setPattern] = useState<HandPattern | null>(null);

    // 计算结果
    const [result, setResult] = useState<ScoreResult | null>(null);

    // 應用主題到 document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

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

    // 获取可用的牌型
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

    // 渲染選項按鈕組
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

    // 主題選項
    const themeOptions = [
        { value: 'light', label: language === 'zh-CN' ? '☀️ 浅色' : '☀️ 淺色' },
        { value: 'dark', label: '🌙 ' + (language === 'zh-CN' ? '深色' : '深色') },
    ];

    // 模式選項
    const modeOptions = AVAILABLE_MODES.map(m => ({
        value: m.value,
        label: m.label[language],
    }));

    return (
        <div className="app">
            {/* 設置卡片 */}
            <div className="settings-card">
                <div className="settings-row">
                    <span className="settings-label">🀄 {language === 'zh-CN' ? '模式' : '模式'}</span>
                    <CustomSelect
                        options={modeOptions}
                        value={mode}
                        onChange={(v) => handleModeChange(v as MahjongMode)}
                    />
                </div>
                <div className="settings-row">
                    <span className="settings-label">{language === 'zh-CN' ? '语言' : '語言'}</span>
                    <CustomSelect
                        options={[
                            { value: 'zh-CN', label: '简体中文' },
                            { value: 'zh-TW', label: '繁體中文' },
                        ]}
                        value={language}
                        onChange={(v) => setLanguage(v as Language)}
                    />
                </div>
                <div className="settings-row">
                    <span className="settings-label">{language === 'zh-CN' ? '主题' : '主題'}</span>
                    <CustomSelect
                        options={themeOptions}
                        value={theme}
                        onChange={(v) => setTheme(v as Theme)}
                    />
                </div>
            </div>

            {/* 主卡片 - 標題和內容整合為一體 */}
            <main className="card mahjong-card">
                {/* 根據模式顯示不同內容 */}
                {mode === 'taiwan' ? (
                    <TaiwanMahjong language={language} />
                ) : (
                    <>
                        {/* 標題區域 */}
                        <header className="card-header">
                            <div className="card-header__icon">🀄</div>
                            <h1 className="card-header__title">{t.appTitle}</h1>
                            <p className="card-header__subtitle">{t.appSubtitle}</p>
                        </header>

                        <div className="card-divider"></div>

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
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
