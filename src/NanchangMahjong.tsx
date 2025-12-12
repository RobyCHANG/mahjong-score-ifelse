import { useState, useEffect } from 'react';
import { Language, getTranslations } from './i18n';
import {
    Role,
    WinEvent,
    HandPattern,
    WIN_EVENT_OPTIONS,
    JING_OPTIONS,
    getAvailablePatterns,
    OptionConfig,
} from './types';
import { calculateScore, applyJingBonus, ScoreResult } from './scoreCalculator';
import './TaiwanMahjong.css';  // 共用台灣麻將的樣式

interface NanchangMahjongProps {
    language: Language;
}

// 正精數量選項 (0-3)
const ZHENG_JING_OPTIONS = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

// 附精數量選項 (0-3)
const FU_JING_OPTIONS = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export function NanchangMahjong({ language }: NanchangMahjongProps) {
    const t = getTranslations(language);

    // 狀態
    const [role, setRole] = useState<Role | null>(null);
    const [winEvent, setWinEvent] = useState<WinEvent | null>(null);
    const [hasJing, setHasJing] = useState<boolean | null>(null);
    const [zhengJingCount, setZhengJingCount] = useState<number | null>(null);
    const [fuJingCount, setFuJingCount] = useState<number | null>(null);
    const [pattern, setPattern] = useState<HandPattern | null>(null);
    const [result, setResult] = useState<ScoreResult | null>(null);

    // 計算總精加成
    const totalJingBonus = ((zhengJingCount ?? 0) * 2) + (fuJingCount ?? 0);

    // 判斷精選擇是否完成
    const jingSelectionComplete = hasJing === false ||
        (hasJing === true && zhengJingCount !== null && fuJingCount !== null);

    // 可用的胡牌方式（根據身份）
    const availableWinEvents = role ? WIN_EVENT_OPTIONS[role] : [];

    // 可用的牌型
    const availablePatterns = winEvent ? getAvailablePatterns(winEvent, hasJing) : [];

    // 計算結果
    useEffect(() => {
        if (role && winEvent && hasJing !== null && jingSelectionComplete && pattern) {
            const baseResult = calculateScore(role, winEvent, hasJing, pattern);
            if (baseResult) {
                const finalResult = hasJing && totalJingBonus > 0
                    ? applyJingBonus(baseResult, totalJingBonus)
                    : baseResult;
                setResult(finalResult);
            } else {
                setResult(null);
            }
        } else {
            setResult(null);
        }
    }, [role, winEvent, hasJing, zhengJingCount, fuJingCount, pattern, jingSelectionComplete, totalJingBonus]);

    // 重置
    const handleReset = () => {
        setRole(null);
        setWinEvent(null);
        setHasJing(null);
        setZhengJingCount(null);
        setFuJingCount(null);
        setPattern(null);
        setResult(null);
    };

    // 渲染選項按鈕（互斥單選）
    const renderRadioOptions = <T,>(
        options: OptionConfig<T>[],
        selected: T | null,
        onSelect: (value: T) => void,
        columns: number = 2
    ) => (
        <div className={`tw-options ${columns === 3 ? 'tw-options--3col' : ''}`}>
            {options.map(opt => (
                <label
                    key={String(opt.value)}
                    className={`tw-checkbox ${selected === opt.value ? 'tw-checkbox--checked' : ''}`}
                    onClick={() => onSelect(opt.value)}
                >
                    <span className="tw-checkbox__box"></span>
                    <span className="tw-checkbox__content">
                        <span className="tw-checkbox__label">{opt.label}</span>
                        {opt.description && <span className="tw-checkbox__tai">{opt.description}</span>}
                    </span>
                </label>
            ))}
        </div>
    );

    // 渲染結果
    const renderResult = (res: ScoreResult) => (
        <div className="tw-result__breakdown">
            {res.dealerPays !== null && (
                <div className="tw-result__item">
                    <span>{t.dealerPays}</span>
                    <span>{res.dealerPays}</span>
                </div>
            )}
            {res.nonDealerPays !== null && (
                <div className="tw-result__item">
                    <span>{role === 'dealer' ? t.nonDealerPays : t.eachNonDealerPays}</span>
                    <span>{res.nonDealerPays}</span>
                </div>
            )}
            {res.discardPays !== null && (
                <div className="tw-result__item">
                    <span>{t.discardPays}</span>
                    <span>{res.discardPays}</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="taiwan-mahjong">
            {/* 標題 */}
            <header className="card-header">
                <div className="card-header__icon">🀄</div>
                <h1 className="card-header__title">{t.appTitle}</h1>
                <p className="card-header__subtitle">{t.appSubtitle}</p>
            </header>

            <div className="card-divider"></div>

            {/* 第一步：選擇身份 */}
            <section className="tw-section">
                <h3 className="tw-section__title">👤 {t.step1Title}</h3>
                <div className="tw-role-selector">
                    <button
                        className={`tw-role-btn ${role === 'dealer' ? 'tw-role-btn--active' : ''}`}
                        onClick={() => { setRole('dealer'); setWinEvent(null); setPattern(null); }}
                    >
                        <span className="tw-role-btn__icon">🏠</span>
                        <span className="tw-role-btn__label">{t.dealer}</span>
                        <span className="tw-role-btn__desc">{t.dealerDesc}</span>
                    </button>
                    <button
                        className={`tw-role-btn ${role === 'nonDealer' ? 'tw-role-btn--active' : ''}`}
                        onClick={() => { setRole('nonDealer'); setWinEvent(null); setPattern(null); }}
                    >
                        <span className="tw-role-btn__icon">👥</span>
                        <span className="tw-role-btn__label">{t.nonDealer}</span>
                        <span className="tw-role-btn__desc">{t.nonDealerDesc}</span>
                    </button>
                </div>
            </section>

            {/* 第二步：胡牌方式 */}
            {role && (
                <section className="tw-section">
                    <h3 className="tw-section__title">🎯 {t.step2Title}</h3>
                    {renderRadioOptions(availableWinEvents, winEvent, setWinEvent)}
                </section>
            )}

            {/* 第三步：有無精 */}
            {winEvent && (
                <section className="tw-section">
                    <h3 className="tw-section__title">✨ {t.step3Title}</h3>
                    {renderRadioOptions(
                        JING_OPTIONS,
                        hasJing,
                        (v) => { setHasJing(v); if (!v) { setZhengJingCount(null); setFuJingCount(null); } setPattern(null); }
                    )}
                </section>
            )}

            {/* 精的數量 */}
            {hasJing && (
                <section className="tw-section">
                    <h3 className="tw-section__title">🔢 {t.jingStepTitle}</h3>
                    <div className="tw-jing-row">
                        <span className="tw-jing-label">{t.zhengJing}</span>
                        <div className="tw-flower-selector">
                            {ZHENG_JING_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`tw-flower-btn ${zhengJingCount === opt.value ? 'tw-flower-btn--active' : ''}`}
                                    onClick={() => setZhengJingCount(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="tw-jing-row">
                        <span className="tw-jing-label">{t.fuJing}</span>
                        <div className="tw-flower-selector">
                            {FU_JING_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`tw-flower-btn ${fuJingCount === opt.value ? 'tw-flower-btn--active' : ''}`}
                                    onClick={() => setFuJingCount(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {zhengJingCount !== null && fuJingCount !== null && (
                        <div className="tw-jing-total">
                            {t.jingTotal}: +{totalJingBonus}
                        </div>
                    )}
                </section>
            )}

            {/* 第四步：牌型 */}
            {jingSelectionComplete && (
                <section className="tw-section">
                    <h3 className="tw-section__title">🀄 {t.step4Title}</h3>
                    {renderRadioOptions(availablePatterns, pattern, setPattern, 3)}
                </section>
            )}

            {/* 結果 */}
            {result && (
                <div className="tw-result">
                    <div className="tw-result__label">{t.resultLabel}</div>
                    {renderResult(result)}
                    {hasJing && totalJingBonus > 0 && (
                        <div className="tw-result__note">
                            {t.jingBonusNote} (+{totalJingBonus})
                        </div>
                    )}
                </div>
            )}

            {/* 重置 */}
            {(role || winEvent || hasJing !== null || pattern) && (
                <button className="reset-btn" onClick={handleReset}>
                    <span>↻</span>
                    <span>{t.reset}</span>
                </button>
            )}
        </div>
    );
}
