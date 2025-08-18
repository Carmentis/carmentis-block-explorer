'use client';
// Centralized route builders for navigating within the app
// Keeping all path formats here makes future changes easier

export const routes = {
  explorer: {
    home: () => `/explorer`,
    block: (id: number | string) => `/explorer/block/${id}`,
    microblock: (hash: string) => `/explorer/microblock/${hash}`,
    virtualBlockchain: (hash: string) => `/explorer/virtualBlockchain/${hash}`,
  },
  accounts: {
    root: () => `/accounts`,
    byPublicKey: (publicKey: string) => `/accounts/publicKey/${publicKey}`,
  },
} as const;

export type Routes = typeof routes;
