'use client';
import { InvoiceTotals, CurrencyCode, CURRENCY_SYMBOLS } from '@/types/invoice';

interface Props {
  totals: InvoiceTotals;
  taxRate: number;
  discountRate: number;
  currency: CurrencyCode;
  onTaxChange: (v: number) => void;
  onDiscountChange: (v: number) => void;
}

export function TotalsPanel({ totals, taxRate, discountRate, currency, onTaxChange, onDiscountChange }: Props) {
  const sym = CURRENCY_SYMBOLS[currency];
  const fmt = (n: number) => `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="card">
      <div className="card-header">
        <div className="section-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <h2>Summary</h2>
      </div>

      <div className="totals-grid">
        <div className="totals-adjustments">
          <div className="form-group">
            <label htmlFor="discount-rate" className="form-label">Discount (%)</label>
            <input
              id="discount-rate"
              type="number"
              className="form-input"
              min="0"
              max="100"
              step="0.5"
              value={discountRate === 0 ? '' : discountRate}
              placeholder="0"
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tax-rate" className="form-label">Tax (%)</label>
            <input
              id="tax-rate"
              type="number"
              className="form-input"
              min="0"
              max="100"
              step="0.5"
              value={taxRate === 0 ? '' : taxRate}
              placeholder="0"
              onChange={(e) => onTaxChange(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="totals-breakdown">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>{fmt(totals.subtotal)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="totals-row totals-row-discount">
              <span>Discount ({discountRate}%)</span>
              <span>−{fmt(totals.discountAmount)}</span>
            </div>
          )}
          {totals.taxAmount > 0 && (
            <div className="totals-row">
              <span>Tax ({taxRate}%)</span>
              <span>{fmt(totals.taxAmount)}</span>
            </div>
          )}
          <div className="totals-row totals-row-total">
            <span>Total Due</span>
            <span>{fmt(totals.total)}</span>
          </div>
        </div>
      </div>

      <style>{`
        .totals-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .totals-adjustments {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        .totals-breakdown {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-4);
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--color-text-2);
          padding: var(--space-1) 0;
        }
        .totals-row-discount { color: var(--color-accent-2); }
        .totals-row-total {
          border-top: 2px solid var(--color-border-2);
          padding-top: var(--space-3);
          margin-top: var(--space-1);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text);
        }
      `}</style>
    </div>
  );
}
