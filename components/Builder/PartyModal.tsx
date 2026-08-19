'use client';
import React, { useState } from 'react';
import { SenderInfo, ClientInfo } from '@/types/invoice';

type PartyType = 'sender' | 'client';

interface PartyModalProps {
  isOpen: boolean;
  type: PartyType;
  initialData: SenderInfo | ClientInfo;
  onSaveSender?: (data: Partial<SenderInfo>) => void;
  onSaveClient?: (data: Partial<ClientInfo>) => void;
  onClose: () => void;
}

export function PartyModal({
  isOpen,
  type,
  initialData,
  onSaveSender,
  onSaveClient,
  onClose,
}: PartyModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    name: (initialData as ClientInfo).name || '',
    companyName: (initialData as SenderInfo).companyName || (initialData as ClientInfo).company || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zip: initialData.zip || '',
    country: initialData.country || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    website: (initialData as SenderInfo).website || '',
    taxId: initialData.taxId || '',
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'sender' && onSaveSender) {
      onSaveSender({
        companyName: formData.companyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        taxId: formData.taxId,
      });
    } else if (type === 'client' && onSaveClient) {
      onSaveClient({
        name: formData.name,
        company: formData.companyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        taxId: formData.taxId,
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {type === 'sender' ? (
                <>
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </>
              ) : (
                <>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </>
              )}
            </svg>
            <h3>{type === 'sender' ? 'Edit Your Business Profile' : 'Edit Client Information'}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {type === 'client' && (
            <div className="form-group">
              <label className="form-label" htmlFor="modal-name">Contact Person / Name</label>
              <input
                id="modal-name"
                className="form-input"
                placeholder="e.g. Jane Doe"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-company">Company / Business Name</label>
              <input
                id="modal-company"
                className="form-input"
                placeholder="e.g. Acme Corp"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-taxid">Tax ID / VAT Number</label>
              <input
                id="modal-taxid"
                className="form-input"
                placeholder="e.g. US-EIN-123456"
                value={formData.taxId || ''}
                onChange={(e) => handleChange('taxId', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-address">Street Address</label>
            <input
              id="modal-address"
              className="form-input"
              placeholder="e.g. 123 Market St, Suite 500"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-city">City</label>
              <input
                id="modal-city"
                className="form-input"
                placeholder="San Francisco"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-state">State / Province</label>
              <input
                id="modal-state"
                className="form-input"
                placeholder="CA"
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-zip">Postal / ZIP Code</label>
              <input
                id="modal-zip"
                className="form-input"
                placeholder="94103"
                value={formData.zip || ''}
                onChange={(e) => handleChange('zip', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-country">Country</label>
              <input
                id="modal-country"
                className="form-input"
                placeholder="United States"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-email">Email Address</label>
              <input
                id="modal-email"
                type="email"
                className="form-input"
                placeholder="billing@example.com"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-phone">Phone Number</label>
              <input
                id="modal-phone"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            {type === 'sender' && (
              <div className="form-group">
                <label className="form-label" htmlFor="modal-website">Website</label>
                <input
                  id="modal-website"
                  className="form-input"
                  placeholder="www.example.com"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
