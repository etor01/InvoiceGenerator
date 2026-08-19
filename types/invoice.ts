export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'INR' | 'ZAR';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  INR: '₹',
  ZAR: 'R',
};

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface SenderInfo {
  companyName: string;
  logo: string; // base64 data URL
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  taxId?: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
  taxId?: string;
}

export type InvoiceThemeColor = '#6366f1' | '#10b981' | '#0ea5e9' | '#8b5cf6' | '#f59e0b' | '#f43f5e' | '#1e293b';

export interface InvoiceMeta {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  status: 'draft' | 'sent' | 'paid';
  poNumber?: string;
  paymentTerms?: string;
  accentColor?: InvoiceThemeColor;
  canvasTheme?: 'light' | 'dark';
}

export interface InvoiceData {
  sender: SenderInfo;
  client: ClientInfo;
  meta: InvoiceMeta;
  lineItems: LineItem[];
  taxRate: number;       // percentage e.g. 10 = 10%
  discountRate: number;  // percentage
  shipping?: number;     // fixed amount
  notes: string;
  terms: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shipping: number;
  total: number;
}

export function roundCurrency(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function computeTotals(
  lineItems: LineItem[],
  taxRate = 0,
  discountRate = 0,
  shipping = 0
): InvoiceTotals {
  const subtotal = roundCurrency(
    lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0)
  );
  const discountAmount = roundCurrency(subtotal * ((Number(discountRate) || 0) / 100));
  const taxableAmount = Math.max(0, roundCurrency(subtotal - discountAmount));
  const taxAmount = roundCurrency(taxableAmount * ((Number(taxRate) || 0) / 100));
  const safeShipping = roundCurrency(Math.max(0, Number(shipping) || 0));
  const total = roundCurrency(taxableAmount + taxAmount + safeShipping);

  return { subtotal, discountAmount, taxableAmount, taxAmount, shipping: safeShipping, total };
}
