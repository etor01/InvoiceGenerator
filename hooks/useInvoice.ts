'use client';
import { useState, useCallback } from 'react';
import { InvoiceData, LineItem, SenderInfo, ClientInfo, InvoiceMeta } from '@/types/invoice';
import { createBlankInvoice } from '@/lib/defaults';

type Action =
  | { type: 'SET_SENDER'; payload: Partial<SenderInfo> }
  | { type: 'SET_CLIENT'; payload: Partial<ClientInfo> }
  | { type: 'SET_META'; payload: Partial<InvoiceMeta> }
  | { type: 'ADD_LINE_ITEM' }
  | { type: 'UPDATE_LINE_ITEM'; payload: { id: string; field: keyof LineItem; value: string | number } }
  | { type: 'REMOVE_LINE_ITEM'; payload: { id: string } }
  | { type: 'SET_TAX'; payload: number }
  | { type: 'SET_DISCOUNT'; payload: number }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_TERMS'; payload: string }
  | { type: 'RESET' }
  | { type: 'LOAD'; payload: InvoiceData };

function reducer(state: InvoiceData, action: Action): InvoiceData {
  switch (action.type) {
    case 'SET_SENDER':
      return { ...state, sender: { ...state.sender, ...action.payload } };
    case 'SET_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } };
    case 'SET_META':
      return { ...state, meta: { ...state.meta, ...action.payload } };
    case 'ADD_LINE_ITEM':
      return {
        ...state,
        lineItems: [
          ...state.lineItems,
          { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 },
        ],
      };
    case 'UPDATE_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, [action.payload.field]: action.payload.value }
            : item
        ),
      };
    case 'REMOVE_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.filter((item) => item.id !== action.payload.id),
      };
    case 'SET_TAX':
      return { ...state, taxRate: action.payload };
    case 'SET_DISCOUNT':
      return { ...state, discountRate: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_TERMS':
      return { ...state, terms: action.payload };
    case 'RESET':
      return createBlankInvoice();
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

export function useInvoice(initial: InvoiceData) {
  const [state, setState] = useState<InvoiceData>(initial);

  const dispatch = useCallback((action: Action) => {
    setState((prev) => reducer(prev, action));
  }, []);

  return { invoice: state, dispatch };
}
