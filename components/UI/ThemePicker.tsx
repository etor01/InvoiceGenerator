'use client';
import React from 'react';
import { InvoiceThemeColor } from '@/types/invoice';

const PALETTES: { label: string; color: InvoiceThemeColor }[] = [
  { label: 'Indigo', color: '#6366f1' },
  { label: 'Emerald', color: '#10b981' },
  { label: 'Ocean', color: '#0ea5e9' },
  { label: 'Violet', color: '#8b5cf6' },
  { label: 'Amber', color: '#f59e0b' },
  { label: 'Rose', color: '#f43f5e' },
  { label: 'Slate', color: '#1e293b' },
];

interface ThemePickerProps {
  currentColor: InvoiceThemeColor;
  onChangeColor: (color: InvoiceThemeColor) => void;
  canvasTheme: 'light' | 'dark';
  onToggleCanvasTheme: (theme: 'light' | 'dark') => void;
}

export function ThemePicker({
  currentColor,
  onChangeColor,
  canvasTheme,
  onToggleCanvasTheme,
}: ThemePickerProps) {
  return (
    <div className="theme-picker-card">
      <div className="theme-picker-header">
        <span className="theme-picker-title">Brand Accent</span>
        <div className="canvas-toggle-group">
          <button
            type="button"
            className={`canvas-toggle-btn ${canvasTheme === 'light' ? 'active' : ''}`}
            onClick={() => onToggleCanvasTheme('light')}
            title="Light Paper Canvas (WYSIWYG PDF)"
            aria-label="Light Paper Canvas"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Paper
          </button>
          <button
            type="button"
            className={`canvas-toggle-btn ${canvasTheme === 'dark' ? 'active' : ''}`}
            onClick={() => onToggleCanvasTheme('dark')}
            title="Dark Canvas Mode"
            aria-label="Dark Canvas Mode"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark
          </button>
        </div>
      </div>

      <div className="palette-row" role="radiogroup" aria-label="Invoice accent colors">
        {PALETTES.map((p) => {
          const isSelected = currentColor === p.color;
          return (
            <button
              key={p.color}
              type="button"
              className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
              style={{ backgroundColor: p.color }}
              onClick={() => onChangeColor(p.color)}
              title={p.label}
              aria-label={`${p.label} theme`}
              aria-checked={isSelected}
              role="radio"
            >
              {isSelected && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
