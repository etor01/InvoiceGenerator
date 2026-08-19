import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InvoiceGen — Free Online Invoice Generator',
  description: 'Create professional, printable invoices in seconds. No sign-up required. Free invoice generator with PDF download.',
  keywords: ['invoice generator', 'free invoice', 'pdf invoice', 'online invoice maker'],
  openGraph: {
    title: 'InvoiceGen — Free Online Invoice Generator',
    description: 'Create professional, printable invoices in seconds. No sign-up required.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
