'use client';
import { InvoiceMeta, CurrencyCode, CURRENCY_SYMBOLS } from '@/types/invoice';
import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';

interface Props {
  meta: InvoiceMeta;
  onChange: (partial: Partial<InvoiceMeta>) => void;
}

const CURRENCY_OPTIONS = (Object.keys(CURRENCY_SYMBOLS) as CurrencyCode[]).map((code) => ({
  value: code,
  label: `${code} — ${CURRENCY_SYMBOLS[code]}`,
}));

const STATUS_OPTIONS = [
  { value: 'draft', label: '📝 Draft' },
  { value: 'sent', label: '📤 Sent' },
  { value: 'paid', label: '✅ Paid' },
];

export function InvoiceMetaForm({ meta, onChange }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="section-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
        </div>
        <h2>Invoice Details</h2>
      </div>
      <div className="form-grid" style={{ gap: 'var(--space-4)' }}>
        <div className="form-grid form-grid-2">
          <Input
            id="invoice-number"
            label="Invoice Number"
            placeholder="INV-2024-001"
            value={meta.invoiceNumber}
            onChange={(e) => onChange({ invoiceNumber: e.target.value })}
          />
          <Select
            id="invoice-status"
            label="Status"
            options={STATUS_OPTIONS}
            value={meta.status}
            onChange={(e) => onChange({ status: e.target.value as InvoiceMeta['status'] })}
          />
        </div>
        <div className="form-grid form-grid-2">
          <Input
            id="issue-date"
            label="Issue Date"
            type="date"
            value={meta.issueDate}
            onChange={(e) => onChange({ issueDate: e.target.value })}
          />
          <Input
            id="due-date"
            label="Due Date"
            type="date"
            value={meta.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
          />
        </div>
        <Select
          id="currency"
          label="Currency"
          options={CURRENCY_OPTIONS}
          value={meta.currency}
          onChange={(e) => onChange({ currency: e.target.value as CurrencyCode })}
        />
      </div>
    </div>
  );
}
