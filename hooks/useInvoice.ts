'use client';
import { useState, useCallback } from 'react';
import { InvoiceData, LineItem, SenderInfo, ClientInfo, InvoiceMeta, InvoiceThemeColor } from '@/types/invoice';
import { createBlankInvoice, createSampleInvoice } from '@/lib/defaults';

type Action =
  | { type: 'SET_SENDER'; payload: Partial<SenderInfo> }
  | { type: 'SET_CLIENT'; payload: Partial<ClientInfo> }
  | { type: 'SET_META'; payload: Partial<InvoiceMeta> }
  | { type: 'SET_ACCENT_COLOR'; payload: InvoiceThemeColor }
  | { type: 'SET_CANVAS_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_LINE_ITEM' }
  | { type: 'UPDATE_LINE_ITEM'; payload: { id: string; field: keyof LineItem; value: string | number } }
  | { type: 'REMOVE_LINE_ITEM'; payload: { id: string } }
  | { type: 'MOVE_LINE_ITEM'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SET_TAX'; payload: number }
  | { type: 'SET_DISCOUNT'; payload: number }
  | { type: 'SET_SHIPPING'; payload: number }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_TERMS'; payload: string }
  | { type: 'RESET' }
  | { type: 'LOAD_SAMPLE' }
  | { type: 'LOAD'; payload: InvoiceData };

function reducer(state: InvoiceData, action: Action): InvoiceData {
  switch (action.type) {
    case 'SET_SENDER':
      return { ...state, sender: { ...state.sender, ...action.payload } };
    case 'SET_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } };
    case 'SET_META':
      return { ...state, meta: { ...state.meta, ...action.payload } };
    case 'SET_ACCENT_COLOR':
      return { ...state, meta: { ...state.meta, accentColor: action.payload } };
    case 'SET_CANVAS_THEME':
      return { ...state, meta: { ...state.meta, canvasTheme: action.payload } };
    case 'ADD_LINE_ITEM':
      return {
        ...state,
        lineItems: [
          ...state.lineItems,
          {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`,
            description: '',
            quantity: 1,
            unitPrice: 0,
          },
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
    case 'MOVE_LINE_ITEM': {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex < 0 || fromIndex >= state.lineItems.length || toIndex < 0 || toIndex >= state.lineItems.length) {
        return state;
      }
      const updated = [...state.lineItems];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...state, lineItems: updated };
    }
    case 'SET_TAX':
      return { ...state, taxRate: action.payload };
    case 'SET_DISCOUNT':
      return { ...state, discountRate: action.payload };
    case 'SET_SHIPPING':
      return { ...state, shipping: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_TERMS':
      return { ...state, terms: action.payload };
    case 'RESET':
      return createBlankInvoice();
    case 'LOAD_SAMPLE':
      return createSampleInvoice();
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
