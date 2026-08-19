import { InvoiceData } from '@/types/invoice';

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDueDate(days = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-001`;
}

export function createBlankInvoice(): InvoiceData {
  return {
    sender: {
      companyName: '',
      logo: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
      website: '',
    },
    client: {
      name: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
    },
    meta: {
      invoiceNumber: generateInvoiceNumber(),
      issueDate: getToday(),
      dueDate: getDueDate(30),
      currency: 'USD',
      status: 'draft',
    },
    lineItems: [
      { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 },
    ],
    taxRate: 0,
    discountRate: 0,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur a 2% monthly fee.',
  };
}
