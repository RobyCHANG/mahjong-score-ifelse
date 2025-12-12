import { useState, useEffect } from 'react';
import { Language } from './i18n';
import { TAIWAN_SCORE_ITEMS, calculateTaiwanScore, TaiwanScoreResult } from './taiwanScoreCalculator';
import './TaiwanMahjong.css';

interface TaiwanMahjongProps {
    language: Language;
}

export function TaiwanMahjong({ language }: TaiwanMahjongProps) {
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
        if (selectedItems.length > 0 || flowerCount > 0) {
            const calcResult = calculateTaiwanScore(selectedItems, flowerCount);
            setResult(calcResult);
        } else {
            setResult(null);
        }
    }, [selectedItems, flowerCount]);

    // 切換選項
    const toggleItem = (id: string) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }

            // 特殊邏輯：門清自摸與門清/自摸互斥
            if (id === 'menQingSelfDraw') {
                return [...prev.filter(i => i !== 'menQing' && i !== 'selfDraw'), id];
            }
            if (id === 'menQing' || id === 'selfDraw') {
                return [...prev.filter(i => i !== 'menQingSelfDraw'), id];
            }

            // 莊家選項互斥（只能選一個）
            const dealerIds = ['isDealer', 'lianZhuang1', 'lianZhuang2', 'lianZhuang3'];
            if (dealerIds.includes(id)) {
                return [...prev.filter(i => !dealerIds.includes(i)), id];
            }

            return [...prev, id];
        });
    };

    // 重置
    const handleReset = () => {
        setSelectedItems([]);
        setFlowerCount(0);
        setResult(null);
    };

    // 渲染選項
    const renderCheckbox = (item: typeof TAIWAN_SCORE_ITEMS[0], isChecked: boolean) => (
        <label
            key={item.id}
            className={`tw-checkbox ${isChecked ? 'tw-checkbox--checked' : ''}`}
        >
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item.id)}
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
        title: language === 'zh-CN' ? '台湾16张麻将计分器' : '台灣16張麻將計分器',
        subtitle: language === 'zh-CN' ? '勾选适用条件，自动计算台数' : '勾選適用條件，自動計算台數',
        dealer: language === 'zh-CN' ? '庄家 / 连庄' : '莊家 / 連莊',
        win: language === 'zh-CN' ? '胡牌方式' : '胡牌方式',
        pattern: language === 'zh-CN' ? '牌型' : '牌型',
        flower: language === 'zh-CN' ? '花牌数量' : '花牌數量',
        special: language === 'zh-CN' ? '特殊情况' : '特殊情況',
        result: language === 'zh-CN' ? '计算结果' : '計算結果',
        totalTai: language === 'zh-CN' ? '总台数' : '總台數',
        reset: language === 'zh-CN' ? '重新计算' : '重新計算',
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

            {/* 莊家/連莊 */}
            <section className="tw-section">
                <h3 className="tw-section__title">🏠 {t.dealer}</h3>
                <div className="tw-options">
                    {dealerItems.map(item => renderCheckbox(item, selectedItems.includes(item.id)))}
                </div>
            </section>

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

            {/* 特殊情況 */}
            <section className="tw-section">
                <h3 className="tw-section__title">✨ {t.special}</h3>
                <div className="tw-options tw-options--3col">
                    {specialItems.map(item => renderCheckbox(item, selectedItems.includes(item.id)))}
                </div>
            </section>

            {/* 結果 */}
            {result && (
                <div className="tw-result">
                    <div className="tw-result__label">{t.result}</div>
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
                </div>
            )}

            {/* 重置 */}
            {(selectedItems.length > 0 || flowerCount > 0) && (
                <button className="reset-btn" onClick={handleReset}>
                    <span>↻</span>
                    <span>{t.reset}</span>
                </button>
            )}
        </div>
    );
}
