import { InvoiceData } from '@/types/invoice';

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDueDate(days = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function generateInvoiceNumber(prefix = 'INV'): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${datePart}-${randomSuffix}`;
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
      taxId: '',
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
      phone: '',
      taxId: '',
    },
    meta: {
      invoiceNumber: generateInvoiceNumber(),
      issueDate: getToday(),
      dueDate: getDueDate(30),
      currency: 'USD',
      status: 'draft',
      poNumber: '',
      paymentTerms: 'Net 30',
      accentColor: '#6366f1',
      canvasTheme: 'light',
    },
    lineItems: [
      { id: 'item-1', description: '', quantity: 1, unitPrice: 0 },
    ],
    taxRate: 0,
    discountRate: 0,
    shipping: 0,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date. Thank you for your business!',
  };
}

export function createSampleInvoice(): InvoiceData {
  return {
    sender: {
      companyName: 'Acme Design & Engineering Ltd.',
      logo: '',
      address: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States',
      email: 'billing@acmedesign.io',
      phone: '+1 (415) 890-2345',
      website: 'www.acmedesign.io',
      taxId: 'US-EIN-94827104',
    },
    client: {
      name: 'Sarah Jenkins',
      company: 'Horizon Cloud Technologies',
      address: '100 Innovation Parkway, Floor 8',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
      email: 'accounts@horizoncloud.com',
      phone: '+1 (512) 345-6789',
      taxId: 'US-TX-8839201',
    },
    meta: {
      invoiceNumber: 'INV-2026-8942',
      issueDate: getToday(),
      dueDate: getDueDate(14),
      currency: 'USD',
      status: 'sent',
      poNumber: 'PO-HORIZON-4412',
      paymentTerms: 'Net 14',
      accentColor: '#6366f1',
      canvasTheme: 'light',
    },
    lineItems: [
      {
        id: 'sample-item-1',
        description: 'Brand Identity & Design System (Tokens, UI Components & Typography)',
        quantity: 1,
        unitPrice: 3200,
      },
      {
        id: 'sample-item-2',
        description: 'Full-Stack Next.js 16 Web Application Engineering (120 hrs)',
        quantity: 120,
        unitPrice: 85,
      },
      {
        id: 'sample-item-3',
        description: 'Cloud Infrastructure Setup (AWS ECS, Docker CI/CD, SSL & Database Provisioning)',
        quantity: 1,
        unitPrice: 1800,
      },
      {
        id: 'sample-item-4',
        description: 'Performance Optimization, Automated Testing & Security Audit',
        quantity: 1,
        unitPrice: 950,
      },
    ],
    taxRate: 8.5,
    discountRate: 5,
    shipping: 0,
    notes: 'Direct wire transfer or Stripe ACH preferred. Please include invoice number INV-2026-8942 in payment description.',
    terms: 'Payment is due within 14 days of issue. Unpaid balances past the due date will accrue interest at 1.5% per month.',
  };
}
