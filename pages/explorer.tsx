import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { INFTBalances } from 'components/templates/balances/NFT/types';
import Moralis from 'moralis';
import { Explorer } from 'components/templates/explorer';

const ExplorerPage: NextPage<INFTBalances> = (props) => {
  return (
    <Default pageName="Explorer">
      <Explorer {...props} />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  if (!session?.user.address) {
    return { props: { error: 'Connect your wallet first' } };
  }

  const balances = await Moralis.EvmApi.account.getNFTs({
    address: '0x0FD2F04B0956487DF679A91480b0666b7F90FbB3',
    chain: process.env.APP_CHAIN_ID,
  });

  if (!balances) {
    return { props: { error: 'Error' } };
  }
  return {
    props: {
      balances: [JSON.parse(JSON.stringify(balances.result))],
      isMarket: true,
    },
  };
};

export default ExplorerPage;
