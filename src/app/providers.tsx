'use client';

import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      {children}
    </PrimeReactProvider>
  );
}
