import type services from '../services';

declare global {
  interface Window {
    services: typeof services;
    api: {
      updatePat: (pat: string) => void;
    };
  }
}
