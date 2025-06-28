import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

// Create wagmi config for BASE network
const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'CryptoQuest: The Shards of Genesis',
      appLogoUrl: 'https://cryptoquest.game/logo.png',
    }),
    metaMask(),
  ],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

interface CoinbaseWagmiProviderProps {
  children: React.ReactNode;
}

export function CoinbaseWagmiProvider({ children }: CoinbaseWagmiProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_COINBASE_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}