'use client';
import React from 'react';
import { InvoiceData, computeTotals, CURRENCY_SYMBOLS } from '@/types/invoice';
import styles from './InvoicePreview.module.css';

interface Props {
  invoice: InvoiceData;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function InvoicePreview({ invoice, printRef }: Props) {
  const { sender, client, meta, lineItems, taxRate, discountRate, notes, terms } = invoice;
  const totals = computeTotals(lineItems, taxRate, discountRate);
  const sym = CURRENCY_SYMBOLS[meta.currency] ?? meta.currency;
  const fmt = (n: number) => `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const statusColors: Record<string, string> = {
    draft: '#6b7094',
    sent: '#00d4aa',
    paid: '#22c55e',
  };

  return (
    <div className={`invoice-document ${styles.document}`} ref={printRef}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {sender.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sender.logo} alt="Company logo" className={styles.logo} />
          )}
          <div>
            <div className={styles.companyName}>{sender.companyName || 'Your Company'}</div>
            {sender.address && <div className={styles.senderAddress}>{sender.address}</div>}
            {(sender.city || sender.state || sender.zip) && (
              <div className={styles.senderAddress}>
                {[sender.city, sender.state, sender.zip].filter(Boolean).join(', ')}
              </div>
            )}
            {sender.country && <div className={styles.senderAddress}>{sender.country}</div>}
            {sender.email && <div className={styles.senderAddress}>{sender.email}</div>}
            {sender.phone && <div className={styles.senderAddress}>{sender.phone}</div>}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.invoiceTitle}>INVOICE</div>
          <div className={styles.invoiceNumber}>{meta.invoiceNumber}</div>
          <div
            className={styles.statusBadge}
            style={{ background: `${statusColors[meta.status]}20`, color: statusColors[meta.status], border: `1px solid ${statusColors[meta.status]}40` }}
          >
            {meta.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Accent bar */}
      <div className={styles.accentBar} />

      {/* Bill to + dates */}
      <div className={styles.metaRow}>
        <div className={styles.billTo}>
          <div className={styles.metaLabel}>BILL TO</div>
          <div className={styles.clientName}>{client.name || 'Client Name'}</div>
          {client.company && <div className={styles.clientDetail}>{client.company}</div>}
          {client.address && <div className={styles.clientDetail}>{client.address}</div>}
          {(client.city || client.state || client.zip) && (
            <div className={styles.clientDetail}>
              {[client.city, client.state, client.zip].filter(Boolean).join(', ')}
            </div>
          )}
          {client.country && <div className={styles.clientDetail}>{client.country}</div>}
          {client.email && <div className={styles.clientDetail}>{client.email}</div>}
        </div>

        <div className={styles.dateBlock}>
          <div className={styles.dateRow}>
            <span className={styles.metaLabel}>ISSUE DATE</span>
            <span className={styles.dateValue}>{fmtDate(meta.issueDate)}</span>
          </div>
          <div className={styles.dateRow}>
            <span className={styles.metaLabel}>DUE DATE</span>
            <span className={styles.dateValue}>{fmtDate(meta.dueDate)}</span>
          </div>
          <div className={styles.dateRow}>
            <span className={styles.metaLabel}>CURRENCY</span>
            <span className={styles.dateValue}>{meta.currency}</span>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thDesc}>Description</th>
            <th className={styles.thNum}>Qty</th>
            <th className={styles.thNum}>Unit Price</th>
            <th className={styles.thNum}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <tr key={item.id} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td className={styles.tdDesc}>{item.description || <span style={{ color: '#aaa' }}>—</span>}</td>
              <td className={styles.tdNum}>{item.quantity}</td>
              <td className={styles.tdNum}>{fmt(item.unitPrice)}</td>
              <td className={styles.tdNum}>{fmt(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className={styles.totalsSection}>
        <div className={styles.totalsBlock}>
          <div className={styles.totalsRow}>
            <span>Subtotal</span>
            <span>{fmt(totals.subtotal)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className={styles.totalsRow} style={{ color: '#059669' }}>
              <span>Discount ({discountRate}%)</span>
              <span>−{fmt(totals.discountAmount)}</span>
            </div>
          )}
          {totals.taxAmount > 0 && (
            <div className={styles.totalsRow}>
              <span>Tax ({taxRate}%)</span>
              <span>{fmt(totals.taxAmount)}</span>
            </div>
          )}
          <div className={styles.totalDue}>
            <span>Total Due</span>
            <span>{fmt(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(notes || terms) && (
        <div className={styles.footer}>
          {notes && (
            <div className={styles.footerSection}>
              <div className={styles.footerLabel}>NOTES</div>
              <div className={styles.footerText}>{notes}</div>
            </div>
          )}
          {terms && (
            <div className={styles.footerSection}>
              <div className={styles.footerLabel}>PAYMENT TERMS</div>
              <div className={styles.footerText}>{terms}</div>
            </div>
          )}
        </div>
      )}

      {/* Thank you line */}
      <div className={styles.thankYou}>
        {sender.website ? (
          <span>Thank you for your business — {sender.website}</span>
        ) : (
          <span>Thank you for your business!</span>
        )}
      </div>
    </div>
  );
}
