'use client';
import { ClientInfo } from '@/types/invoice';
import { Input } from '@/components/UI/Input';

interface Props {
  client: ClientInfo;
  onChange: (partial: Partial<ClientInfo>) => void;
}

export function ClientForm({ client, onChange }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="section-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2>Bill To</h2>
      </div>
      <div className="form-grid" style={{ gap: 'var(--space-4)' }}>
        <div className="form-grid form-grid-2">
          <Input id="client-name" label="Contact Name" placeholder="Jane Doe" value={client.name} onChange={(e) => onChange({ name: e.target.value })} />
          <Input id="client-company" label="Company" placeholder="Client Co." value={client.company} onChange={(e) => onChange({ company: e.target.value })} />
        </div>
        <Input id="client-address" label="Street Address" placeholder="456 Client Street" value={client.address} onChange={(e) => onChange({ address: e.target.value })} />
        <div className="form-grid form-grid-3">
          <Input id="client-city" label="City" placeholder="Chicago" value={client.city} onChange={(e) => onChange({ city: e.target.value })} />
          <Input id="client-state" label="State" placeholder="IL" value={client.state} onChange={(e) => onChange({ state: e.target.value })} />
          <Input id="client-zip" label="ZIP" placeholder="60601" value={client.zip} onChange={(e) => onChange({ zip: e.target.value })} />
        </div>
        <Input id="client-country" label="Country" placeholder="United States" value={client.country} onChange={(e) => onChange({ country: e.target.value })} />
        <Input id="client-email" label="Email" type="email" placeholder="client@company.com" value={client.email} onChange={(e) => onChange({ email: e.target.value })} />
      </div>
    </div>
  );
}
