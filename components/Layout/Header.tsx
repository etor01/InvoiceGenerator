'use client';
import React, { useRef } from 'react';
import { InvoiceData } from '@/types/invoice';

interface HeaderProps {
  invoice: InvoiceData;
  onReset: () => void;
  onLoadSample: () => void;
  onDownload: () => void;
  onImport: (data: InvoiceData) => void;
}

export function Header({
  invoice,
  onReset,
  onLoadSample,
  onDownload,
  onImport,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(invoice, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoice.meta.invoiceNumber || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as InvoiceData;
        if (parsed.meta && parsed.lineItems) {
          onImport(parsed);
        } else {
          alert('Invalid invoice JSON file structure.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="app-header no-print">
      <div className="header-left">
        <div className="brand-badge">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
          <div>
            <div className="brand-name">
              Invoice<span>Gen</span>
            </div>
            <div className="brand-tagline">Pro Invoicing Suite</div>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-btn secondary"
          onClick={onLoadSample}
          title="Populate with realistic sample invoice data"
          id="load-sample-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Sample Invoice</span>
        </button>

        <button
          type="button"
          className="header-btn secondary"
          onClick={onReset}
          title="Create a clean blank invoice"
          id="new-invoice-header-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>New Invoice</span>
        </button>

        <div className="header-divider-v" />

        <button
          type="button"
          className="header-btn ghost icon-only"
          onClick={handleExportJson}
          title="Backup Invoice (Export JSON)"
          aria-label="Export Invoice as JSON"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        <button
          type="button"
          className="header-btn ghost icon-only"
          onClick={() => fileInputRef.current?.click()}
          title="Restore Invoice (Import JSON)"
          aria-label="Import Invoice from JSON"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImportJson}
        />

        <button
          type="button"
          className="header-btn primary"
          onClick={onDownload}
          title="Download as PDF or Print"
          id="header-download-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Download PDF</span>
        </button>
      </div>
    </header>
  );
}
