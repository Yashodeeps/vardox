"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";
import { WagmiProvider } from "wagmi";

import { http, createConfig } from "wagmi";
import { base, mainnet, optimism } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <Provider store={store}>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </WagmiProvider>
            <Toaster />
          </Provider>
        </SessionProvider>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
