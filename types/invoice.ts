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
}

export interface InvoiceMeta {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  status: 'draft' | 'sent' | 'paid';
}

export interface InvoiceData {
  sender: SenderInfo;
  client: ClientInfo;
  meta: InvoiceMeta;
  lineItems: LineItem[];
  taxRate: number;       // percentage e.g. 10 = 10%
  discountRate: number;  // percentage
  notes: string;
  terms: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export function computeTotals(lineItems: LineItem[], taxRate: number, discountRate: number): InvoiceTotals {
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = subtotal * (discountRate / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;
  return { subtotal, discountAmount, taxableAmount, taxAmount, total };
}
