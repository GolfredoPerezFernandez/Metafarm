import { EvmNftContractType } from '@moralisweb3/evm-utils';

export type TNFTBalance = {
  tokenAddress: string;
  chain: string | number;
  price: string | undefined;
  ownerOf: string | undefined;
  blockNumberMinted: string | undefined;
  blockNumber: string | undefined;
  tokenId: string | number;
  contractType: EvmNftContractType;
  tokenUri?: string | undefined;
  tokenHash?: string | undefined;
  metadata: any;
  name?: string | undefined;
  symbol?: string | undefined;
  lastMetadataSync?: Date | undefined;
  lastTokenUriSync?: Date | undefined;
  amount?: number | undefined;
};

export interface INFTBalances {
  balances?: TNFTBalance[];
}
