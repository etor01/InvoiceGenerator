'use client';
import React, { useRef } from 'react';

interface LogoUploadProps {
  logo: string;
  onChange: (dataUrl: string) => void;
}

export function LogoUpload({ logo, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="form-group">
      <span className="form-label">Company Logo</span>
      <div
        className="logo-upload-area"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload company logo"
      >
        {logo ? (
          <div className="logo-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Company logo" style={{ maxHeight: 60, maxWidth: 160, objectFit: 'contain' }} />
            <button
              className="logo-remove btn btn-danger btn-sm"
              onClick={(e) => { e.stopPropagation(); onChange(''); if (inputRef.current) inputRef.current.value = ''; }}
              aria-label="Remove logo"
              type="button"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <div className="logo-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Click to upload logo</span>
            <span className="text-xs text-muted">PNG, JPG, SVG up to 2MB</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
        id="logo-file-input"
        aria-label="Logo file input"
      />
      <style>{`
        .logo-upload-area {
          border: 2px dashed var(--color-border-2);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          cursor: pointer;
          transition: border-color var(--transition), background var(--transition);
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-upload-area:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-glow);
        }
        .logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--color-muted);
          font-size: 13px;
          pointer-events: none;
        }
        .logo-preview {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .logo-remove { font-size: 11px; }
      `}</style>
    </div>
  );
}
