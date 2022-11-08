import { TNFTBalance } from 'components/templates/balances/NFT/types';

export interface INFTCard
  extends Pick<
    TNFTBalance,
    | 'price'
    | 'isMarket'
    | 'amount'
    | 'contractType'
    | 'name'
    | 'symbol'
    | 'price'
    | 'tokenAddress'
    | 'tokenId'
    | 'metadata'
  > {}
