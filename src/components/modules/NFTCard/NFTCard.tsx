/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint-disable complexity */
/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint-disable arrow-spacing */
/* eslint-disable no-await-in-loop */
/* eslint-disable arrow-parens */
/* eslint-disable arrow-spacing */
/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */

/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint @typescript-eslint/no-unused-vars: "off" */
/* eslint @typescript-eslint/no-unused-vars: "off" */

/* eslint-disable no-loop-func */
/* eslint-disable no-inline-comments */
import { Box, Image, SimpleGrid, useColorModeValue, Button } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { resolveIPFS } from 'utils/resolveIPFS';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';

import { INFTCard } from './types';

const NFTCard: FC<INFTCard> = ({ amount, tokenId, name, metadata }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const contractProcessor = useWeb3ExecuteFunction();
  const { Moralis, isWeb3Enabled, enableWeb3 } = useMoralis();
  const [price, setPrice] = useState<any>('');
  const [price2, setPrice2] = useState<any>('');
  const [isMarket, setIsMarket] = useState<any>(true);

  const router = useRouter();

  useEffect(() => {
    async function init() {
      const OPTIONS = {
        contractAddress: '0x0FD2F04B0956487DF679A91480b0666b7F90FbB3',
        functionName: 'fetchItem',
        abi: nftAbi,
        params: {
          _tokenId: tokenId,
        },
      };

      await contractProcessor.fetch({
        params: OPTIONS,
        onSuccess: (res: any) => {
          console.log(router.pathname);
          if (router.pathname === '/') {
            setIsMarket(true);
          } else {
            setIsMarket(false);
          }
          setPrice(Moralis.Units.FromWei(res[5]));
          setPrice(Moralis.Units.FromWei(res[5]));
          setPrice2(res[5]);
        },
        onError: (error: any) => {
          console.log(error);
        },
      });
    }
    if (isWeb3Enabled) {
      init();
    }
  }, [isWeb3Enabled]);

  const buyNFT = async () => {
    console.log(tokenId, 'tokenId');
    console.log(price, 'price');
    console.log(price2, 'price2');
    const itemId = tokenId;
    const tokenPrice = price2;
    const OPTIONS2 = {
      contractAddress: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      functionName: 'approve',
      abi: tokenAbi,
      params: {
        _spender: '0x0FD2F04B0956487DF679A91480b0666b7F90FbB3',
        _value: parseInt(tokenPrice).toString(),
      },
    };

    await contractProcessor.fetch({
      params: OPTIONS2,
      onSuccess: async (res: any) => {
        await res.wait();

        const OPTIONS = {
          contractAddress: '0x0FD2F04B0956487DF679A91480b0666b7F90FbB3',
          functionName: 'createMarketSale',
          abi: nftAbi,
          params: {
            itemId,
          },
          msgValue: parseInt(tokenPrice).toString(),
        };

        await contractProcessor.fetch({
          params: OPTIONS,
          onSuccess: () => {
            alert('NFT bought!');
          },
          onError: (error: any) => {
            console.log(error);
            if (error.data?.message !== undefined) {
              alert(error.data?.message);
            }
          },
        });
        alert('NFT bought!');
      },
      onError: (error: any) => {
        console.log(error);
        if (error.data?.message !== undefined) {
          alert(error.data?.message);
        }
      },
    });
  };
  useEffect(() => {
    async function init() {
      await enableWeb3();
    }
    if (!isWeb3Enabled) {
      init();
    }
  }, [isWeb3Enabled]);
  return (
    <Box maxWidth="315px" bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
      <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
        <Image
          src={resolveIPFS(metadata?.image as string)}
          alt={'nft'}
          minH="260px"
          minW="260px"
          boxSize="100%"
          objectFit="fill"
        />
      </Box>
      <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
        {name}
      </Box>
      <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
            Name
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm">
            {metadata?.name}
          </Box>
        </Box>{' '}
        {isMarket ? (
          <Box>
            <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
              Price
            </Box>
            <Box as="h4" noOfLines={1} fontSize="sm">
              {price}
            </Box>
          </Box>
        ) : null}
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
            Amount
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm">
            {amount}
          </Box>
        </Box>
      </SimpleGrid>
      {isMarket ? (
        <Button size="sm" width={200} marginTop={3} onClick={buyNFT} colorScheme="blue">
          Buy
        </Button>
      ) : null}
    </Box>
  );
};

export default NFTCard;

const tokenAbi = [
  {
    constant: false,
    inputs: [],
    name: 'disregardProposeOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'assetProtectionRole',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'r', type: 'bytes32[]' },
      { name: 's', type: 'bytes32[]' },
      { name: 'v', type: 'uint8[]' },
      { name: 'to', type: 'address[]' },
      { name: 'value', type: 'uint256[]' },
      { name: 'fee', type: 'uint256[]' },
      { name: 'seq', type: 'uint256[]' },
      { name: 'deadline', type: 'uint256[]' },
    ],
    name: 'betaDelegatedTransferBatch',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'sig', type: 'bytes' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'fee', type: 'uint256' },
      { name: 'seq', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    name: 'betaDelegatedTransfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'initializeDomainSeparator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'unfreeze',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'claimOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_newSupplyController', type: 'address' }],
    name: 'setSupplyController',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getOwner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'target', type: 'address' }],
    name: 'nextSeqOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_newAssetProtectionRole', type: 'address' }],
    name: 'setAssetProtectionRole',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'freeze',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_newWhitelister', type: 'address' }],
    name: 'setBetaDelegateWhitelister',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'decreaseSupply',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'isWhitelistedBetaDelegate',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'whitelistBetaDelegate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_proposedOwner', type: 'address' }],
    name: 'proposeOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'increaseSupply',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'betaDelegateWhitelister',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'proposedOwner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'unwhitelistBetaDelegate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'wipeFrozenAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'EIP712_DOMAIN_HASH',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'isFrozen',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'supplyController',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'reclaimBUSD',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'currentOwner', type: 'address' },
      { indexed: true, name: 'proposedOwner', type: 'address' },
    ],
    name: 'OwnershipTransferProposed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'oldProposedOwner', type: 'address' }],
    name: 'OwnershipTransferDisregarded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'oldOwner', type: 'address' },
      { indexed: true, name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
  { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'addr', type: 'address' }],
    name: 'AddressFrozen',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'addr', type: 'address' }],
    name: 'AddressUnfrozen',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'addr', type: 'address' }],
    name: 'FrozenAddressWiped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'oldAssetProtectionRole', type: 'address' },
      { indexed: true, name: 'newAssetProtectionRole', type: 'address' },
    ],
    name: 'AssetProtectionRoleSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'SupplyIncreased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'SupplyDecreased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'oldSupplyController', type: 'address' },
      { indexed: true, name: 'newSupplyController', type: 'address' },
    ],
    name: 'SupplyControllerSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
      { indexed: false, name: 'seq', type: 'uint256' },
      { indexed: false, name: 'fee', type: 'uint256' },
    ],
    name: 'BetaDelegatedTransfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'oldWhitelister', type: 'address' },
      { indexed: true, name: 'newWhitelister', type: 'address' },
    ],
    name: 'BetaDelegateWhitelisterSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'newDelegate', type: 'address' }],
    name: 'BetaDelegateWhitelisted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'oldDelegate', type: 'address' }],
    name: 'BetaDelegateUnwhitelisted',
    type: 'event',
  },
];

const nftAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'itemId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'nftContract', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'seller', type: 'address' },
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
      { indexed: false, internalType: 'bool', name: 'sold', type: 'bool' },
    ],
    name: 'MarketItemCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'itemId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'MarketItemSold',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
      { indexed: false, internalType: 'uint256[]', name: 'values', type: 'uint256[]' },
    ],
    name: 'TransferBatch',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'TransferSingle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'value', type: 'string' },
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'URI',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'accounts', type: 'address[]' },
      { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'nftContractAddress', type: 'address' },
      { internalType: 'uint256', name: 'marketItemId', type: 'uint256' },
    ],
    name: 'cancelMarketItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'nftContract', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
    ],
    name: 'createMarketItem',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'nftContract', type: 'address' },
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'prices', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    name: 'createMarketItemBatch',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'itemId', type: 'uint256' }],
    name: 'createMarketSale',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'fetchItem',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'itemId', type: 'uint256' },
          { internalType: 'address', name: 'nftContract', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'address payable', name: 'seller', type: 'address' },
          { internalType: 'address payable', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'price', type: 'uint256' },
          { internalType: 'bool', name: 'sold', type: 'bool' },
          { internalType: 'bool', name: 'cancel', type: 'bool' },
        ],
        internalType: 'struct NFTContract.MarketItem',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fetchMarketItems',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'itemId', type: 'uint256' },
          { internalType: 'address', name: 'nftContract', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'address payable', name: 'seller', type: 'address' },
          { internalType: 'address payable', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'price', type: 'uint256' },
          { internalType: 'bool', name: 'sold', type: 'bool' },
          { internalType: 'bool', name: 'cancel', type: 'bool' },
        ],
        internalType: 'struct NFTContract.MarketItem[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    name: 'mintBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_wallet1', type: 'address' }],
    name: 'setAddress1',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_wallet2', type: 'address' }],
    name: 'setAddress2',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'uri',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wallet1',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wallet2',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
