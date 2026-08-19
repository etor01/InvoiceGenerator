'use client';
import { Textarea } from '@/components/UI/Input';

interface Props {
  notes: string;
  terms: string;
  onNotesChange: (v: string) => void;
  onTermsChange: (v: string) => void;
}

export function NotesTerms({ notes, terms, onNotesChange, onTermsChange }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="section-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h2>Notes & Terms</h2>
      </div>
      <div className="form-grid" style={{ gap: 'var(--space-4)' }}>
        <Textarea
          id="invoice-notes"
          label="Notes"
          placeholder="Thank you for your business! Any relevant notes for the client..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
        />
        <Textarea
          id="invoice-terms"
          label="Payment Terms"
          placeholder="Payment is due within 30 days..."
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
