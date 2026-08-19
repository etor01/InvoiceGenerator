'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useInvoice } from '@/hooks/useInvoice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createBlankInvoice } from '@/lib/defaults';
import {
  computeTotals,
  CURRENCY_SYMBOLS,
  CurrencyCode,
  InvoiceData,
  LineItem,
  InvoiceThemeColor,
} from '@/types/invoice';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ThemePicker } from '@/components/UI/ThemePicker';
import { PartyModal } from '@/components/Builder/PartyModal';

const STORAGE_KEY = 'invoice-gen-v2';

const CURRENCIES: { value: CurrencyCode; label: string }[] = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'NGN', label: 'NGN (₦)' },
  { value: 'CAD', label: 'CAD (CA$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CHF', label: 'CHF (CHF)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'ZAR', label: 'ZAR (R)' },
];

function fmt(n: number, sym: string) {
  return `${sym}${(Number(n) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function Home() {
  const [saved, setSaved] = useLocalStorage<InvoiceData>(STORAGE_KEY, createBlankInvoice());
  const { invoice, dispatch } = useInvoice(saved);
  const printRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [activeModal, setActiveModal] = useState<'sender' | 'client' | null>(null);
  const [showDiscount, setShowDiscount] = useState(invoice.discountRate > 0);
  const [showTax, setShowTax] = useState(invoice.taxRate > 0);
  const [showShipping, setShowShipping] = useState((invoice.shipping ?? 0) > 0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(true);

  // Sync to local storage
  useEffect(() => {
    setSaved(invoice);
    const timer = setTimeout(() => {
      setIsSaved(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [invoice, setSaved]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${invoice.meta.invoiceNumber || 'Document'}`,
  });

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrint]);

  const handleLogoFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        dispatch({ type: 'SET_SENDER', payload: { logo: reader.result as string } });
      };
      reader.readAsDataURL(file);
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    if (confirm('Start a fresh blank invoice? Your current draft will be reset.')) {
      dispatch({ type: 'RESET' });
      setAmountPaid(0);
      setShowDiscount(false);
      setShowTax(false);
      setShowShipping(false);
    }
  }, [dispatch]);

  const handleLoadSample = useCallback(() => {
    dispatch({ type: 'LOAD_SAMPLE' });
    setShowDiscount(true);
    setShowTax(true);
    setShowShipping(false);
    setAmountPaid(0);
  }, [dispatch]);

  const sym = CURRENCY_SYMBOLS[invoice.meta.currency as CurrencyCode] ?? '$';
  const totals = computeTotals(
    invoice.lineItems,
    showTax ? invoice.taxRate : 0,
    showDiscount ? invoice.discountRate : 0,
    showShipping ? invoice.shipping : 0
  );
  const balanceDue = Math.max(0, totals.total - amountPaid);
  const accentColor: InvoiceThemeColor = invoice.meta.accentColor || '#6366f1';
  const canvasTheme = invoice.meta.canvasTheme || 'light';

  return (
    <div
      className="app-root"
      style={
        {
          '--theme-accent': accentColor,
        } as React.CSSProperties
      }
    >
      {/* ── Top Header Navigation ────────────────────────────── */}
      <Header
        invoice={invoice}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        onDownload={handlePrint}
        onImport={(data) => dispatch({ type: 'LOAD', payload: data })}
      />

      <div className="app-layout">
        {/* ── Main Canvas Area ──────────────────────────────── */}
        <main className="workspace-area">
          <div
            className={`invoice-sheet paper-canvas-${canvasTheme}`}
            ref={printRef}
            id="invoice-document"
          >
            {/* Top decorative accent bar */}
            <div className="sheet-accent-bar" />

            {/* ─ Document Header: Logo & Title ───────────────── */}
            <div className="sheet-header">
              <div>
                {invoice.sender.logo ? (
                  <div
                    className="logo-uploader"
                    onClick={() => logoInputRef.current?.click()}
                    title="Click to replace logo"
                    role="button"
                    tabIndex={0}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={invoice.sender.logo} alt="Company logo" />
                    <button
                      type="button"
                      className="logo-remove-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'SET_SENDER', payload: { logo: '' } });
                      }}
                      aria-label="Remove logo"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div
                    className="logo-uploader"
                    onClick={() => logoInputRef.current?.click()}
                    title="Upload high-res company logo"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && logoInputRef.current?.click()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>+ Add Your Logo</span>
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoFile}
                />
              </div>

              <div className="sheet-header-right">
                <div className="sheet-title">INVOICE</div>
                <div className="sheet-inv-number-row">
                  <span className="sheet-inv-hash">#</span>
                  <input
                    id="invoice-number"
                    className="sheet-inv-input"
                    value={invoice.meta.invoiceNumber}
                    onChange={(e) => dispatch({ type: 'SET_META', payload: { invoiceNumber: e.target.value } })}
                    aria-label="Invoice number"
                    placeholder="INV-001"
                  />
                </div>
                <span className={`status-pill ${invoice.meta.status}`}>
                  {invoice.meta.status}
                </span>
              </div>
            </div>

            <hr className="sheet-divider" />

            {/* ─ Parties & Invoice Dates Grid ───────────────── */}
            <div className="sheet-info-grid">
              {/* Left Column: From & Bill-To */}
              <div className="party-block">
                {/* Sender Card */}
                <div className="party-card">
                  <div className="party-card-header">
                    <span className="party-label">From</span>
                    <button
                      type="button"
                      className="party-edit-btn no-print"
                      onClick={() => setActiveModal('sender')}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                  {invoice.sender.companyName ? (
                    <div>
                      <div className="party-display-title">{invoice.sender.companyName}</div>
                      <div className="party-display-sub">
                        {[
                          invoice.sender.address,
                          [invoice.sender.city, invoice.sender.state, invoice.sender.zip].filter(Boolean).join(', '),
                          invoice.sender.country,
                          invoice.sender.email,
                          invoice.sender.phone,
                          invoice.sender.taxId ? `Tax ID: ${invoice.sender.taxId}` : '',
                        ]
                          .filter(Boolean)
                          .join('\n')}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="party-placeholder"
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveModal('sender')}
                    >
                      + Click to enter your business details &amp; contact info
                    </div>
                  )}
                </div>

                {/* Client Card */}
                <div className="party-card">
                  <div className="party-card-header">
                    <span className="party-label">Bill To</span>
                    <button
                      type="button"
                      className="party-edit-btn no-print"
                      onClick={() => setActiveModal('client')}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                  {invoice.client.company || invoice.client.name ? (
                    <div>
                      <div className="party-display-title">
                        {invoice.client.company || invoice.client.name}
                      </div>
                      {invoice.client.company && invoice.client.name && (
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--canvas-text)' }}>
                          Attn: {invoice.client.name}
                        </div>
                      )}
                      <div className="party-display-sub">
                        {[
                          invoice.client.address,
                          [invoice.client.city, invoice.client.state, invoice.client.zip].filter(Boolean).join(', '),
                          invoice.client.country,
                          invoice.client.email,
                          invoice.client.phone,
                          invoice.client.taxId ? `Tax ID: ${invoice.client.taxId}` : '',
                        ]
                          .filter(Boolean)
                          .join('\n')}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="party-placeholder"
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveModal('client')}
                    >
                      + Click to enter client or company billing information
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Invoice Dates & PO */}
              <div className="meta-card">
                <div className="meta-row">
                  <span className="meta-label">Issue Date</span>
                  <input
                    id="issue-date"
                    type="date"
                    className="meta-input"
                    value={invoice.meta.issueDate}
                    onChange={(e) => dispatch({ type: 'SET_META', payload: { issueDate: e.target.value } })}
                    aria-label="Issue date"
                  />
                </div>
                <div className="meta-row">
                  <span className="meta-label">Payment Terms</span>
                  <input
                    id="payment-terms"
                    className="meta-input"
                    value={invoice.meta.paymentTerms || ''}
                    placeholder="Net 30"
                    onChange={(e) => dispatch({ type: 'SET_META', payload: { paymentTerms: e.target.value } })}
                    aria-label="Payment terms"
                  />
                </div>
                <div className="meta-row">
                  <span className="meta-label">Due Date</span>
                  <input
                    id="due-date"
                    type="date"
                    className="meta-input"
                    value={invoice.meta.dueDate}
                    onChange={(e) => dispatch({ type: 'SET_META', payload: { dueDate: e.target.value } })}
                    aria-label="Due date"
                  />
                </div>
                <div className="meta-row">
                  <span className="meta-label">PO Number</span>
                  <input
                    id="po-number"
                    className="meta-input"
                    placeholder="PO-0000"
                    value={invoice.meta.poNumber || ''}
                    onChange={(e) => dispatch({ type: 'SET_META', payload: { poNumber: e.target.value } })}
                    aria-label="Purchase Order Number"
                  />
                </div>
              </div>
            </div>

            {/* ─ Line Items Table ───────────────────────────── */}
            <div className="table-container">
              <table className="line-table" aria-label="Invoice Line Items">
                <thead>
                  <tr>
                    <th style={{ width: '56%' }}>Description</th>
                    <th className="th-num" style={{ width: '12%' }}>Qty</th>
                    <th className="th-num" style={{ width: '16%' }}>Rate</th>
                    <th className="th-num" style={{ width: '16%' }}>Amount</th>
                    <th className="no-print" style={{ width: '36px' }} />
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item: LineItem, idx: number) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          id={`item-desc-${idx}`}
                          className="item-desc-input"
                          placeholder="Description of service or product..."
                          value={item.description}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_LINE_ITEM',
                              payload: { id: item.id, field: 'description', value: e.target.value },
                            })
                          }
                          aria-label={`Item ${idx + 1} description`}
                        />
                      </td>
                      <td>
                        <input
                          id={`item-qty-${idx}`}
                          className="item-num-input"
                          type="number"
                          min="0"
                          step="1"
                          placeholder="1"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_LINE_ITEM',
                              payload: { id: item.id, field: 'quantity', value: parseFloat(e.target.value) || 0 },
                            })
                          }
                          aria-label={`Item ${idx + 1} quantity`}
                        />
                      </td>
                      <td>
                        <div className="rate-cell-wrapper">
                          <span className="rate-cell-sym">{sym}</span>
                          <input
                            id={`item-rate-${idx}`}
                            className="item-num-input"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={item.unitPrice === 0 ? '' : item.unitPrice}
                            onChange={(e) =>
                              dispatch({
                                type: 'UPDATE_LINE_ITEM',
                                payload: { id: item.id, field: 'unitPrice', value: parseFloat(e.target.value) || 0 },
                              })
                            }
                            onKeyDown={(e) => {
                              // Power user shortcut: Press Tab on last rate input to auto-add next line
                              if (e.key === 'Tab' && !e.shiftKey && idx === invoice.lineItems.length - 1) {
                                dispatch({ type: 'ADD_LINE_ITEM' });
                              }
                            }}
                            aria-label={`Item ${idx + 1} unit price`}
                          />
                        </div>
                      </td>
                      <td className="td-amount-cell">
                        {fmt((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), sym)}
                      </td>
                      <td className="td-action-cell no-print">
                        <button
                          type="button"
                          className="row-delete-btn"
                          onClick={() => dispatch({ type: 'REMOVE_LINE_ITEM', payload: { id: item.id } })}
                          disabled={invoice.lineItems.length === 1}
                          title="Remove item"
                          aria-label={`Remove item ${idx + 1}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              id="add-line-item-btn"
              type="button"
              className="add-item-trigger no-print"
              onClick={() => dispatch({ type: 'ADD_LINE_ITEM' })}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Line Item</span>
            </button>

            {/* ─ Notes, Terms & Summary Totals ──────────────── */}
            <div className="sheet-bottom-grid">
              <div className="notes-terms-block">
                <div className="note-field-group">
                  <label className="note-field-label" htmlFor="invoice-notes">
                    Notes &amp; Payment Details
                  </label>
                  <textarea
                    id="invoice-notes"
                    className="note-textarea"
                    rows={3}
                    placeholder="e.g. Bank transfer info, payment links, wire instructions..."
                    value={invoice.notes}
                    onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
                  />
                </div>
                <div className="note-field-group">
                  <label className="note-field-label" htmlFor="invoice-terms">
                    Terms &amp; Conditions
                  </label>
                  <textarea
                    id="invoice-terms"
                    className="note-textarea"
                    rows={3}
                    placeholder="e.g. Net 30, late payment fee policy..."
                    value={invoice.terms}
                    onChange={(e) => dispatch({ type: 'SET_TERMS', payload: e.target.value })}
                  />
                </div>
              </div>

              {/* Totals Summary */}
              <div className="totals-summary-card">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">{fmt(totals.subtotal, sym)}</span>
                </div>

                {showDiscount && (
                  <div className="summary-row">
                    <span className="summary-label">
                      Discount
                      <div className="tax-rate-badge-input no-print">
                        <input
                          id="discount-rate-input"
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={invoice.discountRate === 0 ? '' : invoice.discountRate}
                          placeholder="0"
                          onChange={(e) => dispatch({ type: 'SET_DISCOUNT', payload: parseFloat(e.target.value) || 0 })}
                        />
                        <span>%</span>
                      </div>
                    </span>
                    <span className="summary-value" style={{ color: '#10b981' }}>
                      −{fmt(totals.discountAmount, sym)}
                    </span>
                  </div>
                )}

                {showTax && (
                  <div className="summary-row">
                    <span className="summary-label">
                      Tax
                      <div className="tax-rate-badge-input no-print">
                        <input
                          id="tax-rate-input"
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={invoice.taxRate === 0 ? '' : invoice.taxRate}
                          placeholder="0"
                          onChange={(e) => dispatch({ type: 'SET_TAX', payload: parseFloat(e.target.value) || 0 })}
                        />
                        <span>%</span>
                      </div>
                    </span>
                    <span className="summary-value">{fmt(totals.taxAmount, sym)}</span>
                  </div>
                )}

                {showShipping && (
                  <div className="summary-row">
                    <span className="summary-label">Shipping</span>
                    <span className="summary-value">{fmt(totals.shipping, sym)}</span>
                  </div>
                )}

                <div className="summary-total-row summary-row">
                  <span>Total</span>
                  <span className="summary-value" style={{ fontSize: 18 }}>
                    {fmt(totals.total, sym)}
                  </span>
                </div>

                <div className="summary-row no-print" style={{ paddingTop: 8 }}>
                  <span className="summary-label">Amount Paid</span>
                  <div className="tax-rate-badge-input" style={{ width: 100 }}>
                    <span style={{ fontSize: 12, paddingRight: 2 }}>{sym}</span>
                    <input
                      id="amount-paid-input"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={amountPaid === 0 ? '' : amountPaid}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="balance-due-box">
                  <span className="balance-due-label">Balance Due</span>
                  <span className="balance-due-value">{fmt(balanceDue, sym)}</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Control Sidebar ────────────────────────────────── */}
        <aside className="control-sidebar no-print" aria-label="Invoice controls">
          <button
            id="sidebar-download-btn"
            type="button"
            className="sidebar-primary-btn"
            onClick={handlePrint}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download PDF</span>
          </button>

          <div className="autosave-pill">
            <span className="autosave-dot" />
            <span>{isSaved ? 'Changes saved locally' : 'Saving...'}</span>
          </div>

          {/* Theme & Canvas Customizer */}
          <div className="sidebar-section">
            <ThemePicker
              currentColor={accentColor}
              onChangeColor={(c) => dispatch({ type: 'SET_ACCENT_COLOR', payload: c })}
              canvasTheme={canvasTheme}
              onToggleCanvasTheme={(t) => dispatch({ type: 'SET_CANVAS_THEME', payload: t })}
            />
          </div>

          {/* Currency & Status */}
          <div className="sidebar-section">
            <span className="sidebar-section-title">Configuration</span>

            <div className="sidebar-select-wrapper">
              <select
                id="currency-select"
                className="sidebar-select"
                value={invoice.meta.currency}
                onChange={(e) => dispatch({ type: 'SET_META', payload: { currency: e.target.value as CurrencyCode } })}
                aria-label="Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="sidebar-select-arrow">▼</div>
            </div>

            <div className="sidebar-select-wrapper">
              <select
                id="status-select"
                className="sidebar-select"
                value={invoice.meta.status}
                onChange={(e) =>
                  dispatch({ type: 'SET_META', payload: { status: e.target.value as 'draft' | 'sent' | 'paid' } })
                }
                aria-label="Invoice status"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
              <div className="sidebar-select-arrow">▼</div>
            </div>
          </div>

          {/* Financial Addons */}
          <div className="sidebar-section">
            <span className="sidebar-section-title">Invoice Addons</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showTax}
                  onChange={(e) => {
                    setShowTax(e.target.checked);
                    if (e.target.checked && invoice.taxRate === 0) {
                      dispatch({ type: 'SET_TAX', payload: 10 });
                    }
                  }}
                />
                Include Tax / VAT
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showDiscount}
                  onChange={(e) => {
                    setShowDiscount(e.target.checked);
                    if (e.target.checked && invoice.discountRate === 0) {
                      dispatch({ type: 'SET_DISCOUNT', payload: 5 });
                    }
                  }}
                />
                Include Discount
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showShipping}
                  onChange={(e) => setShowShipping(e.target.checked)}
                />
                Include Shipping Fee
              </label>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Buy Me A Coffee Footer ─────────────────────────── */}
      <Footer />

      {/* ── Party Modal (Structured Sender & Client details) ── */}
      {activeModal && (
        <PartyModal
          key={`${activeModal}-${Boolean(activeModal)}`}
          isOpen={Boolean(activeModal)}
          type={activeModal}
          initialData={activeModal === 'sender' ? invoice.sender : invoice.client}
          onSaveSender={(senderData) => dispatch({ type: 'SET_SENDER', payload: senderData })}
          onSaveClient={(clientData) => dispatch({ type: 'SET_CLIENT', payload: clientData })}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
