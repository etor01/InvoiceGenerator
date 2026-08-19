'use client';
import { LineItem } from '@/types/invoice';
import { Button } from '@/components/UI/Button';

interface Props {
  lineItems: LineItem[];
  currency: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
}

export function LineItems({ lineItems, currency, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="section-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </div>
        <h2>Line Items</h2>
      </div>

      {/* Header row */}
      <div className="line-items-header">
        <span className="li-desc">Description</span>
        <span className="li-qty">Qty</span>
        <span className="li-price">Unit Price</span>
        <span className="li-amount">Amount</span>
        <span className="li-action" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {lineItems.map((item, index) => {
          const amount = item.quantity * item.unitPrice;
          return (
            <div key={item.id} className="line-item-row">
              <input
                className="form-input li-desc"
                placeholder={`Item ${index + 1}`}
                value={item.description}
                onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                id={`li-desc-${item.id}`}
                aria-label={`Line item ${index + 1} description`}
              />
              <input
                className="form-input li-qty"
                type="number"
                min="0"
                step="1"
                placeholder="1"
                value={item.quantity === 0 ? '' : item.quantity}
                onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                id={`li-qty-${item.id}`}
                aria-label={`Line item ${index + 1} quantity`}
              />
              <input
                className="form-input li-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={item.unitPrice === 0 ? '' : item.unitPrice}
                onChange={(e) => onUpdate(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                id={`li-price-${item.id}`}
                aria-label={`Line item ${index + 1} unit price`}
              />
              <span className="li-amount li-amount-value">
                {currency}{amount.toFixed(2)}
              </span>
              <button
                className="btn btn-danger btn-icon li-action"
                onClick={() => onRemove(item.id)}
                disabled={lineItems.length === 1}
                aria-label={`Remove line item ${index + 1}`}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/>
                  <path d="M10,11v6"/><path d="M14,11v6"/>
                  <path d="M9,6V4h6v2"/>
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <Button variant="secondary" size="sm" onClick={onAdd} className="no-print" style={{ marginTop: 'var(--space-4)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Item
      </Button>

      <style>{`
        .line-items-header {
          display: grid;
          grid-template-columns: 1fr 70px 100px 100px 40px;
          gap: var(--space-2);
          padding: var(--space-2) 0;
          margin-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-border);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-muted);
        }
        .line-item-row {
          display: grid;
          grid-template-columns: 1fr 70px 100px 100px 40px;
          gap: var(--space-2);
          align-items: center;
        }
        .li-amount-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-2);
          text-align: right;
          padding-right: var(--space-2);
        }
        .li-qty, .li-price { text-align: right; }
        .li-amount { text-align: right; }
        @media (max-width: 640px) {
          .line-items-header { grid-template-columns: 1fr 55px 80px 80px 36px; }
          .line-item-row { grid-template-columns: 1fr 55px 80px 80px 36px; }
        }
      `}</style>
    </div>
  );
}
