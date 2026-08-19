import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input id={id} className={`form-input ${className}`.trim()} {...props} />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
}

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <textarea id={id} className={`form-textarea ${className}`.trim()} {...props} />
    </div>
  );
}
