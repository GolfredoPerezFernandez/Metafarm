import { InjectedConnector } from 'wagmi/connectors/injected';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import apiPost from 'utils/apiPost';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { useRouter } from 'next/router'
import { useMoralis } from 'react-moralis';

const ConnectButton = () => {
  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();
  const { data } = useSession();
  const router = useRouter()

  const {  authenticate } = useMoralis();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      const { account, chain } = await connectAsync();
      const userData = { address: account, chain: chain.id, network: 'evm' };

      const { message } = await apiPost('/auth/request-message', userData);

      const signature = await signMessageAsync({ message });
 
      await signIn('credentials', { message, signature, callbackUrl: '/' });
    } catch (e) {
      toast({
        title: 'Oops, something is wrong...',
        description: (e as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleDisconnect = async () => {
    await disconnectAsync();
    signOut({ callbackUrl: '/' });
  };

  const handleExplorer = async () => { 
    router.push('/explorer')
  };
  const handleMint = async () => {
    router.push('/mint' )

  };
  if (data?.user) {
    return (
      <HStack >
                 
    <Button size="sm" onClick={handleMint} colorScheme="red">
     Mint
    </Button>  
     <HStack onClick={handleDisconnect} cursor={'pointer'}>

        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(data.user.address)}</Text>
      </HStack></HStack>
    );
  }

  return (<HStack >
        
    <Button size="sm" onClick={handleAuth} colorScheme="blue">
      Connect Wallet
    </Button>  
        </HStack>
  );
};

export default ConnectButton;
