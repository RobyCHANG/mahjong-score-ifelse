import { useState, useEffect } from 'react';
import { Language } from './i18n';
import { TAIWAN_SCORE_ITEMS, calculateTaiwanScore, TaiwanScoreResult } from './taiwanScoreCalculator';
import './TaiwanMahjong.css';

interface TaiwanMahjongProps {
    language: Language;
}

type PlayerRole = 'dealer' | 'nonDealer' | null;

export function TaiwanMahjong({ language }: TaiwanMahjongProps) {
    const [playerRole, setPlayerRole] = useState<PlayerRole>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [flowerCount, setFlowerCount] = useState(0);
    const [result, setResult] = useState<TaiwanScoreResult | null>(null);

    // 分類項目
    const dealerItems = TAIWAN_SCORE_ITEMS.filter(i => i.category === 'dealer');
    const winItems = TAIWAN_SCORE_ITEMS.filter(i => i.category === 'win');
    const patternItems = TAIWAN_SCORE_ITEMS.filter(i => i.category === 'pattern');
    const specialItems = TAIWAN_SCORE_ITEMS.filter(i => i.category === 'special');

    // 計算結果
    useEffect(() => {
        if (playerRole && (selectedItems.length > 0 || flowerCount > 0)) {
            const calcResult = calculateTaiwanScore(selectedItems, flowerCount);
            setResult(calcResult);
        } else {
            setResult(null);
        }
    }, [playerRole, selectedItems, flowerCount]);

    // 切換角色
    const handleRoleChange = (role: PlayerRole) => {
        setPlayerRole(role);
        // 切換角色時清除莊家相關選項
        if (role === 'nonDealer') {
            setSelectedItems(prev => prev.filter(id =>
                !['isDealer', 'lianZhuang1', 'lianZhuang2', 'lianZhuang3', 'tianHu'].includes(id)
            ));
        }
    };

    // 切換選項
    const toggleItem = (id: string) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }

            // 特殊邏輯：門清自摸與門清/自摸
            if (id === 'menQingSelfDraw') {
                // 選門清自摸時，移除單獨的門清和自摸
                return [...prev.filter(i => i !== 'menQing' && i !== 'selfDraw'), id];
            }

            // 選自摸時，如果已經有門清，自動轉換為門清自摸
            if (id === 'selfDraw') {
                if (prev.includes('menQing')) {
                    return [...prev.filter(i => i !== 'menQing' && i !== 'menQingSelfDraw'), 'menQingSelfDraw'];
                }
                return [...prev.filter(i => i !== 'menQingSelfDraw'), id];
            }

            // 選門清時，如果已經有自摸，自動轉換為門清自摸
            if (id === 'menQing') {
                if (prev.includes('selfDraw')) {
                    return [...prev.filter(i => i !== 'selfDraw' && i !== 'menQingSelfDraw'), 'menQingSelfDraw'];
                }
                return [...prev.filter(i => i !== 'menQingSelfDraw'), id];
            }

            // 莊家選項互斥（只能選一個）
            const dealerIds = ['isDealer', 'lianZhuang1', 'lianZhuang2', 'lianZhuang3'];
            if (dealerIds.includes(id)) {
                return [...prev.filter(i => !dealerIds.includes(i)), id];
            }

            // 天胡/地胡互斥
            if (id === 'tianHu') {
                return [...prev.filter(i => i !== 'diHu'), id];
            }
            if (id === 'diHu') {
                return [...prev.filter(i => i !== 'tianHu'), id];
            }

            return [...prev, id];
        });
    };

    // 重置
    const handleReset = () => {
        setPlayerRole(null);
        setSelectedItems([]);
        setFlowerCount(0);
        setResult(null);
    };

    // 渲染選項
    const renderCheckbox = (item: typeof TAIWAN_SCORE_ITEMS[0], isChecked: boolean, disabled: boolean = false) => (
        <label
            key={item.id}
            className={`tw-checkbox ${isChecked ? 'tw-checkbox--checked' : ''} ${disabled ? 'tw-checkbox--disabled' : ''}`}
        >
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => !disabled && toggleItem(item.id)}
                disabled={disabled}
            />
            <span className="tw-checkbox__box"></span>
            <span className="tw-checkbox__content">
                <span className="tw-checkbox__label">
                    {language === 'zh-CN' ? item.nameZhCN : item.nameZhTW}
                </span>
                <span className="tw-checkbox__tai">+{item.tai}台</span>
            </span>
        </label>
    );

    const t = {
        title: language === 'zh-CN' ? '麻将计分器' : '麻將計分器',
        subtitle: language === 'zh-CN' ? '台湾16张 · 勾选适用条件' : '台灣16張 · 勾選適用條件',
        selectRole: language === 'zh-CN' ? '选择身份' : '選擇身份',
        dealer: language === 'zh-CN' ? '庄家' : '莊家',
        dealerDesc: language === 'zh-CN' ? '本局庄家' : '本局莊家',
        nonDealer: language === 'zh-CN' ? '闲家' : '閒家',
        nonDealerDesc: language === 'zh-CN' ? '非庄家' : '非莊家',
        dealerBonus: language === 'zh-CN' ? '庄家 / 连庄台' : '莊家 / 連莊台',
        win: language === 'zh-CN' ? '胡牌方式' : '胡牌方式',
        pattern: language === 'zh-CN' ? '牌型' : '牌型',
        flower: language === 'zh-CN' ? '花牌数量' : '花牌數量',
        special: language === 'zh-CN' ? '特殊情况' : '特殊情況',
        result: language === 'zh-CN' ? '计算结果' : '計算結果',
        totalTai: language === 'zh-CN' ? '总台数' : '總台數',
        reset: language === 'zh-CN' ? '重新计算' : '重新計算',
        asDealer: language === 'zh-CN' ? '(莊家)' : '(莊家)',
        asNonDealer: language === 'zh-CN' ? '(闲家)' : '(閒家)',
    };

    return (
        <div className="taiwan-mahjong">
            {/* 標題 */}
            <header className="card-header">
                <div className="card-header__icon">🀄</div>
                <h1 className="card-header__title">{t.title}</h1>
                <p className="card-header__subtitle">{t.subtitle}</p>
            </header>

            <div className="card-divider"></div>

            {/* 第一步：選擇身份 */}
            <section className="tw-section">
                <h3 className="tw-section__title">👤 {t.selectRole}</h3>
                <div className="tw-role-selector">
                    <button
                        className={`tw-role-btn ${playerRole === 'dealer' ? 'tw-role-btn--active' : ''}`}
                        onClick={() => handleRoleChange('dealer')}
                    >
                        <span className="tw-role-btn__icon">🏠</span>
                        <span className="tw-role-btn__label">{t.dealer}</span>
                        <span className="tw-role-btn__desc">{t.dealerDesc}</span>
                    </button>
                    <button
                        className={`tw-role-btn ${playerRole === 'nonDealer' ? 'tw-role-btn--active' : ''}`}
                        onClick={() => handleRoleChange('nonDealer')}
                    >
                        <span className="tw-role-btn__icon">👥</span>
                        <span className="tw-role-btn__label">{t.nonDealer}</span>
                        <span className="tw-role-btn__desc">{t.nonDealerDesc}</span>
                    </button>
                </div>
            </section>

            {/* 只有選擇身份後才顯示其他選項 */}
            {playerRole && (
                <>
                    {/* 莊家專屬：莊家/連莊台 */}
                    {playerRole === 'dealer' && (
                        <section className="tw-section">
                            <h3 className="tw-section__title">🏠 {t.dealerBonus}</h3>
                            <div className="tw-options">
                                {dealerItems.map(item => renderCheckbox(item, selectedItems.includes(item.id)))}
                            </div>
                        </section>
                    )}

                    {/* 胡牌方式 */}
                    <section className="tw-section">
                        <h3 className="tw-section__title">🎯 {t.win}</h3>
                        <div className="tw-options">
                            {winItems.map(item => renderCheckbox(item, selectedItems.includes(item.id)))}
                        </div>
                    </section>

                    {/* 牌型 */}
                    <section className="tw-section">
                        <h3 className="tw-section__title">🀄 {t.pattern}</h3>
                        <div className="tw-options tw-options--3col">
                            {patternItems.map(item => renderCheckbox(item, selectedItems.includes(item.id)))}
                        </div>
                    </section>

                    {/* 花牌 */}
                    <section className="tw-section">
                        <h3 className="tw-section__title">🌸 {t.flower}</h3>
                        <div className="tw-flower-selector">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <button
                                    key={n}
                                    className={`tw-flower-btn ${flowerCount === n ? 'tw-flower-btn--active' : ''}`}
                                    onClick={() => setFlowerCount(n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 特殊情況 - 根據身份過濾 */}
                    <section className="tw-section">
                        <h3 className="tw-section__title">✨ {t.special}</h3>
                        <div className="tw-options tw-options--3col">
                            {specialItems.map(item => {
                                // 天胡只有莊家可選，地胡只有閒家可選
                                const isDisabled =
                                    (item.id === 'tianHu' && playerRole === 'nonDealer') ||
                                    (item.id === 'diHu' && playerRole === 'dealer');
                                return renderCheckbox(item, selectedItems.includes(item.id), isDisabled);
                            })}
                        </div>
                    </section>

                    {/* 結果 */}
                    {result && (
                        <div className="tw-result">
                            <div className="tw-result__label">
                                {t.result} {playerRole === 'dealer' ? t.asDealer : t.asNonDealer}
                            </div>
                            <div className="tw-result__total">
                                <span className="tw-result__number">{result.totalTai}</span>
                                <span className="tw-result__unit">{t.totalTai}</span>
                            </div>
                            <div className="tw-result__breakdown">
                                {result.items.map((entry, idx) => (
                                    <div key={idx} className="tw-result__item">
                                        <span>{language === 'zh-CN' ? entry.item.nameZhCN : entry.item.nameZhTW}</span>
                                        <span>+{entry.item.tai * entry.count}台{entry.count > 1 ? ` (×${entry.count})` : ''}</span>
                                    </div>
                                ))}
                            </div>
                            {result.isCapped && (
                                <div className="tw-result__note">{result.explanation}</div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* 重置 */}
            {(playerRole || selectedItems.length > 0 || flowerCount > 0) && (
                <button className="reset-btn" onClick={handleReset}>
                    <span>↻</span>
                    <span>{t.reset}</span>
                </button>
            )}
        </div>
    );
}
