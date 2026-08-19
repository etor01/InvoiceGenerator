'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useInvoice } from '@/hooks/useInvoice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createBlankInvoice } from '@/lib/defaults';
import { computeTotals, CURRENCY_SYMBOLS, CurrencyCode } from '@/types/invoice';
import type { InvoiceData, LineItem } from '@/types/invoice';

const STORAGE_KEY = 'invoice-gen-v2';

const CURRENCIES: { value: string; label: string }[] = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'NGN', label: 'NGN (₦)' },
  { value: 'CAD', label: 'CAD (CA$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'ZAR', label: 'ZAR (R)' },
];

function fmt(n: number, sym: string) {
  return `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Home() {
  const [saved, setSaved] = useLocalStorage<InvoiceData>(STORAGE_KEY, createBlankInvoice());
  const { invoice, dispatch } = useInvoice(saved);
  const printRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [saved2Indicator, setSaved2Indicator] = useState(false);

  // Sync to localStorage on every change
  useEffect(() => { setSaved(invoice); }, [invoice, setSaved]);

  // Show saved indicator briefly
  useEffect(() => {
    setSaved2Indicator(true);
    const t = setTimeout(() => setSaved2Indicator(false), 1200);
    return () => clearTimeout(t);
  }, [invoice]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${invoice.meta.invoiceNumber}`,
  });

  const handleLogoFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch({ type: 'SET_SENDER', payload: { logo: reader.result as string } });
    reader.readAsDataURL(file);
  }, [dispatch]);

  const sym = CURRENCY_SYMBOLS[invoice.meta.currency as CurrencyCode] ?? '$';
  const totals = computeTotals(invoice.lineItems, invoice.taxRate, invoice.discountRate);
  const shippingAmount = showShipping ? (invoice as InvoiceData & { shipping?: number }).shipping ?? 0 : 0;
  const grandTotal = totals.total + shippingAmount;
  const balanceDue = grandTotal - amountPaid;

  return (
    <div className="app">
      {/* ── Main Document Area ─────────────────────────────── */}
      <div className="app-content">
        <div className="invoice-doc" ref={printRef}>

          {/* ─ Header: Logo + INVOICE title ───────────────── */}
          <div className="doc-header">
            {/* Logo */}
            <div>
              {invoice.sender.logo ? (
                <div className="logo-zone" onClick={() => logoInputRef.current?.click()} aria-label="Change logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={invoice.sender.logo} alt="Company logo" />
                  <button
                    className="logo-remove-btn"
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_SENDER', payload: { logo: '' } }); }}
                    type="button"
                    aria-label="Remove logo"
                  >✕ Remove</button>
                </div>
              ) : (
                <div className="logo-zone" onClick={() => logoInputRef.current?.click()} aria-label="Add logo" role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && logoInputRef.current?.click()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                  + Add Your Logo
                </div>
              )}
              <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoFile} id="logo-file-input" />
            </div>

            {/* INVOICE + number */}
            <div className="doc-header-right">
              <div className="invoice-title">INVOICE</div>
              <div className="invoice-number-row">
                <span className="hash">#</span>
                <input
                  id="invoice-number"
                  className="invoice-number-input"
                  value={invoice.meta.invoiceNumber}
                  onChange={(e) => dispatch({ type: 'SET_META', payload: { invoiceNumber: e.target.value } })}
                  aria-label="Invoice number"
                />
              </div>
            </div>
          </div>

          <hr className="doc-divider" />

          {/* ─ Body: From/BillTo + Dates ──────────────────── */}
          <div className="doc-body-row">
            {/* Left column: From + Bill To / Ship To */}
            <div className="doc-from-bilship">
              {/* Who is this from */}
              <div>
                <textarea
                  id="sender-info"
                  className="doc-textarea"
                  rows={3}
                  placeholder="Who is this from? (name, address, email...)"
                  value={[
                    invoice.sender.companyName,
                    invoice.sender.address,
                    [invoice.sender.city, invoice.sender.state, invoice.sender.zip].filter(Boolean).join(', '),
                    invoice.sender.country,
                    invoice.sender.email,
                    invoice.sender.phone,
                  ].filter(Boolean).join('\n') || ''}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    dispatch({ type: 'SET_SENDER', payload: { companyName: lines[0] || '', address: lines[1] || '', email: lines[2] || '' } });
                  }}
                  aria-label="Sender information"
                />
              </div>

              {/* Bill To / Ship To */}
              <div className="doc-billship-row">
                <div>
                  <div className="doc-label">Bill To</div>
                  <textarea
                    id="bill-to"
                    className="doc-textarea"
                    rows={3}
                    placeholder="Who is this to?"
                    value={[
                      invoice.client.name,
                      invoice.client.company,
                      invoice.client.address,
                      [invoice.client.city, invoice.client.state, invoice.client.zip].filter(Boolean).join(', '),
                      invoice.client.country,
                      invoice.client.email,
                    ].filter(Boolean).join('\n') || ''}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n');
                      dispatch({ type: 'SET_CLIENT', payload: { name: lines[0] || '', company: lines[1] || '', address: lines[2] || '', email: lines[3] || '' } });
                    }}
                    aria-label="Bill to information"
                  />
                </div>
                <div>
                  <div className="doc-label">Ship To</div>
                  <textarea
                    id="ship-to"
                    className="doc-textarea"
                    rows={3}
                    placeholder="(optional)"
                    aria-label="Ship to information"
                  />
                </div>
              </div>
            </div>

            {/* Right column: Dates */}
            <div className="doc-dates">
              <div className="doc-date-row">
                <span className="doc-label">Date</span>
                <input
                  id="issue-date"
                  type="date"
                  className="doc-date-input"
                  value={invoice.meta.issueDate}
                  onChange={(e) => dispatch({ type: 'SET_META', payload: { issueDate: e.target.value } })}
                  aria-label="Issue date"
                />
              </div>
              <div className="doc-date-row">
                <span className="doc-label">Payment Terms</span>
                <input
                  id="payment-terms"
                  className="doc-date-input"
                  placeholder="Net 30"
                  style={{ width: 150 }}
                  defaultValue="Net 30"
                  aria-label="Payment terms"
                />
              </div>
              <div className="doc-date-row">
                <span className="doc-label">Due Date</span>
                <input
                  id="due-date"
                  type="date"
                  className="doc-date-input"
                  value={invoice.meta.dueDate}
                  onChange={(e) => dispatch({ type: 'SET_META', payload: { dueDate: e.target.value } })}
                  aria-label="Due date"
                />
              </div>
              <div className="doc-date-row">
                <span className="doc-label">PO Number</span>
                <input
                  id="po-number"
                  className="doc-date-input"
                  placeholder="—"
                  aria-label="PO number"
                />
              </div>
            </div>
          </div>

          {/* ─ Line Items Table ───────────────────────────── */}
          <table className="line-table" aria-label="Invoice line items">
            <thead>
              <tr>
                <th style={{ width: '100%' }}>Item</th>
                <th className="th-num" style={{ width: 70 }}>Quantity</th>
                <th className="th-num" style={{ width: 110 }}>Rate</th>
                <th className="th-num" style={{ width: 90 }}>Amount</th>
                <th style={{ width: 32 }} />
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item: LineItem, idx: number) => (
                <tr key={item.id}>
                  <td>
                    <input
                      className="doc-input-ghost"
                      placeholder={`Description of item/service...`}
                      value={item.description}
                      onChange={(e) => dispatch({ type: 'UPDATE_LINE_ITEM', payload: { id: item.id, field: 'description', value: e.target.value } })}
                      id={`item-desc-${idx}`}
                      aria-label={`Item ${idx + 1} description`}
                    />
                  </td>
                  <td>
                    <input
                      className="num-input"
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity === 0 ? '' : item.quantity}
                      placeholder="1"
                      onChange={(e) => dispatch({ type: 'UPDATE_LINE_ITEM', payload: { id: item.id, field: 'quantity', value: parseFloat(e.target.value) || 0 } })}
                      id={`item-qty-${idx}`}
                      aria-label={`Item ${idx + 1} quantity`}
                    />
                  </td>
                  <td>
                    <div className="rate-cell">
                      <span className="rate-sym">{sym}</span>
                      <input
                        className="num-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        placeholder="0"
                        onChange={(e) => dispatch({ type: 'UPDATE_LINE_ITEM', payload: { id: item.id, field: 'unitPrice', value: parseFloat(e.target.value) || 0 } })}
                        id={`item-rate-${idx}`}
                        aria-label={`Item ${idx + 1} rate`}
                      />
                    </div>
                  </td>
                  <td className="td-amount">
                    {fmt(item.quantity * item.unitPrice, sym)}
                  </td>
                  <td className="td-del">
                    <button
                      className="del-btn"
                      onClick={() => dispatch({ type: 'REMOVE_LINE_ITEM', payload: { id: item.id } })}
                      disabled={invoice.lineItems.length === 1}
                      aria-label={`Remove item ${idx + 1}`}
                      type="button"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6l-1,14H6L5,6"/>
                        <path d="M10,11v6"/><path d="M14,11v6"/>
                        <path d="M9,6V4h6v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            id="add-line-item"
            className="add-line-btn"
            onClick={() => dispatch({ type: 'ADD_LINE_ITEM' })}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Line Item
          </button>

          {/* ─ Bottom: Notes + Totals ─────────────────────── */}
          <div className="doc-bottom">
            {/* Notes & Terms */}
            <div className="doc-notes-col">
              <div>
                <div className="doc-notes-label">Notes</div>
                <textarea
                  id="invoice-notes"
                  className="doc-textarea"
                  rows={4}
                  placeholder="Notes - any relevant information not already covered"
                  value={invoice.notes}
                  onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
                  aria-label="Invoice notes"
                />
              </div>
              <div>
                <div className="doc-notes-label">Terms</div>
                <textarea
                  id="invoice-terms"
                  className="doc-textarea"
                  rows={4}
                  placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                  value={invoice.terms}
                  onChange={(e) => dispatch({ type: 'SET_TERMS', payload: e.target.value })}
                  aria-label="Invoice terms"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="totals-block">
              <div className="totals-row">
                <span className="totals-label">Subtotal</span>
                <span className="totals-value">{fmt(totals.subtotal, sym)}</span>
              </div>

              {/* Discount toggle */}
              {showDiscount ? (
                <div className="totals-row">
                  <span className="totals-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Discount
                    <div className="tax-row-inner">
                      <input
                        id="discount-rate"
                        className="tax-input"
                        type="number" min="0" max="100" step="0.5"
                        value={invoice.discountRate === 0 ? '' : invoice.discountRate}
                        placeholder="0"
                        onChange={(e) => dispatch({ type: 'SET_DISCOUNT', payload: parseFloat(e.target.value) || 0 })}
                        aria-label="Discount rate"
                      />
                      <span className="tax-sym">%</span>
                    </div>
                  </span>
                  <span className="totals-value" style={{ color: '#22c55e' }}>−{fmt(totals.discountAmount, sym)}</span>
                </div>
              ) : null}

              {/* Tax */}
              <div className="totals-row">
                <span className="totals-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Tax
                  <div className="tax-row-inner">
                    <input
                      id="tax-rate"
                      className="tax-input"
                      type="number" min="0" max="100" step="0.5"
                      value={invoice.taxRate === 0 ? '' : invoice.taxRate}
                      placeholder="0"
                      onChange={(e) => dispatch({ type: 'SET_TAX', payload: parseFloat(e.target.value) || 0 })}
                      aria-label="Tax rate"
                    />
                    <span className="tax-sym">%</span>
                  </div>
                </span>
                <span className="totals-value">{fmt(totals.taxAmount, sym)}</span>
              </div>

              {/* Shipping */}
              {showShipping ? (
                <div className="totals-row">
                  <span className="totals-label">Shipping</span>
                  <div className="amount-paid-input">
                    <span className="amount-paid-sym">{sym}</span>
                    <input
                      id="shipping-amount"
                      className="amount-paid-field"
                      type="number" min="0" step="0.01"
                      placeholder="0"
                      aria-label="Shipping amount"
                    />
                  </div>
                </div>
              ) : null}

              {/* Toggle buttons */}
              <div className="totals-row" style={{ border: 'none', paddingTop: 4, gap: 12 }}>
                {!showDiscount && (
                  <button id="add-discount" className="toggle-link" onClick={() => setShowDiscount(true)} type="button">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Discount
                  </button>
                )}
                {!showShipping && (
                  <button id="add-shipping" className="toggle-link" onClick={() => setShowShipping(true)} type="button">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Shipping
                  </button>
                )}
              </div>

              <div className="totals-row totals-row-total">
                <span>Total</span>
                <span>{fmt(grandTotal, sym)}</span>
              </div>

              <div className="totals-row">
                <span className="totals-label">Amount Paid</span>
                <div className="amount-paid-input">
                  <span className="amount-paid-sym">{sym}</span>
                  <input
                    id="amount-paid"
                    className="amount-paid-field"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={amountPaid === 0 ? '' : amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    aria-label="Amount paid"
                  />
                </div>
              </div>

              <div className="totals-row totals-row-balance">
                <span>Balance Due</span>
                <span>{fmt(balanceDue, sym)}</span>
              </div>
            </div>
          </div>

        </div>{/* end invoice-doc */}
      </div>

      {/* ── Right Sidebar ─────────────────────────────────── */}
      <aside className="sidebar" aria-label="Invoice actions">
        <button
          id="save-send-btn"
          className="sidebar-btn-primary"
          onClick={handlePrint}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
          </svg>
          Save &amp; Send
        </button>

        <button
          id="download-btn"
          className="sidebar-link"
          onClick={handlePrint}
          type="button"
          aria-label="Download PDF"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </button>

        <div className="autosave-badge" aria-live="polite">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {saved2Indicator
              ? <polyline points="20,6 9,17 4,12"/>
              : <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>}
          </svg>
          {saved2Indicator ? 'Saved' : 'Auto-saving...'}
        </div>

        <hr className="sidebar-divider" />

        {/* Invoice Settings */}
        <button
          id="invoice-settings-toggle"
          className="settings-header"
          onClick={() => setSettingsOpen((o) => !o)}
          type="button"
          aria-expanded={settingsOpen}
        >
          Invoice Settings
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '150ms' }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {settingsOpen && (
          <div className="settings-body">
            <div className="settings-field">
              <label htmlFor="currency-select" className="settings-label">Currency</label>
              <select
                id="currency-select"
                className="settings-select"
                value={invoice.meta.currency}
                onChange={(e) => dispatch({ type: 'SET_META', payload: { currency: e.target.value as CurrencyCode } })}
                aria-label="Select currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="settings-field">
              <label htmlFor="status-select" className="settings-label">Status</label>
              <select
                id="status-select"
                className="settings-select"
                value={invoice.meta.status}
                onChange={(e) => dispatch({ type: 'SET_META', payload: { status: e.target.value as 'draft'|'sent'|'paid' } })}
                aria-label="Invoice status"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <button
              id="new-invoice-btn"
              className="sidebar-link"
              style={{ justifyContent: 'flex-start', color: '#ef4444', fontSize: 12, marginTop: 4 }}
              onClick={() => {
                if (confirm('Start a new blank invoice? Your current draft will be cleared.')) {
                  dispatch({ type: 'RESET' });
                  setAmountPaid(0);
                  setShowDiscount(false);
                  setShowShipping(false);
                }
              }}
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              New Invoice
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
