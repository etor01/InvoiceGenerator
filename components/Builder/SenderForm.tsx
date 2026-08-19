'use client';
import { SenderInfo } from '@/types/invoice';
import { Input } from '@/components/UI/Input';
import { LogoUpload } from '@/components/UI/Logo';

interface Props {
  sender: SenderInfo;
  onChange: (partial: Partial<SenderInfo>) => void;
}

export function SenderForm({ sender, onChange }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="section-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>
        <h2>Your Business</h2>
      </div>
      <div className="form-grid" style={{ gap: 'var(--space-4)' }}>
        <LogoUpload logo={sender.logo} onChange={(url) => onChange({ logo: url })} />
        <Input
          id="sender-company"
          label="Company Name"
          placeholder="Acme Inc."
          value={sender.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
        />
        <Input
          id="sender-address"
          label="Street Address"
          placeholder="123 Business Ave"
          value={sender.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
        <div className="form-grid form-grid-3">
          <Input id="sender-city" label="City" placeholder="New York" value={sender.city} onChange={(e) => onChange({ city: e.target.value })} />
          <Input id="sender-state" label="State" placeholder="NY" value={sender.state} onChange={(e) => onChange({ state: e.target.value })} />
          <Input id="sender-zip" label="ZIP" placeholder="10001" value={sender.zip} onChange={(e) => onChange({ zip: e.target.value })} />
        </div>
        <Input id="sender-country" label="Country" placeholder="United States" value={sender.country} onChange={(e) => onChange({ country: e.target.value })} />
        <div className="form-grid form-grid-2">
          <Input id="sender-email" label="Email" type="email" placeholder="hello@company.com" value={sender.email} onChange={(e) => onChange({ email: e.target.value })} />
          <Input id="sender-phone" label="Phone" type="tel" placeholder="+1 555 000 0000" value={sender.phone} onChange={(e) => onChange({ phone: e.target.value })} />
        </div>
        <Input id="sender-website" label="Website" placeholder="www.company.com" value={sender.website} onChange={(e) => onChange({ website: e.target.value })} />
      </div>
    </div>
  );
}
