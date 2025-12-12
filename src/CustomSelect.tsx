import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function CustomSelect({ options, value, onChange, className = '' }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // 點擊外部關閉
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`custom-select ${className} ${isOpen ? 'custom-select--open' : ''}`} ref={selectRef}>
            <button
                className="custom-select__trigger"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span>{selectedOption?.label}</span>
                <span className="custom-select__arrow">▾</span>
            </button>

            {isOpen && (
                <div className="custom-select__dropdown">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            className={`custom-select__option ${opt.value === value ? 'custom-select__option--selected' : ''}`}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            type="button"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
