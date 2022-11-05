import { ChakraProvider } from '@chakra-ui/react';
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { extendTheme } from '@chakra-ui/react';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider resetCSS theme={theme}> 
    
      <WagmiConfig client={client}> 
      
         <MoralisProvider appId={"3YV6ajrewjUqUjio0heFVEROSw6nrxqnbq4ABhRu"} serverUrl={"https://mifgyepwzbyo.usemoralis.com:2053/server"}>
    
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <Component {...pageProps} />

        </SessionProvider>  
        </MoralisProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default MyApp;
