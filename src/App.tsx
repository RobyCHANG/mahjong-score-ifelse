import { useState, useEffect } from 'react';
import { Language, MahjongMode, getTranslations, AVAILABLE_MODES } from './i18n';
import { CustomSelect } from './CustomSelect';
import { TaiwanMahjong } from './TaiwanMahjong';
import { NanchangMahjong } from './NanchangMahjong';
import './App.css';

type Theme = 'light' | 'dark';

function App() {
    // 主題（初始淺色）
    const [theme, setTheme] = useState<Theme>('light');

    // 語言和模式（初始：台灣麻將 + 繁體）
    const [language, setLanguage] = useState<Language>('zh-TW');
    const [mode, setMode] = useState<MahjongMode>('taiwan');

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

    // 應用主題到 document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // 模式選項
    const modeOptions = AVAILABLE_MODES.map(m => ({
        value: m.value,
        label: m.label[language],
    }));

    // 主題選項
    const themeOptions = [
        { value: 'light', label: language === 'zh-CN' ? '浅色' : '淺色' },
        { value: 'dark', label: language === 'zh-CN' ? '深色' : '深色' },
    ];

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
                    <NanchangMahjong language={language} />
                )}
            </main>
        </div>
    );
}

export default App;
