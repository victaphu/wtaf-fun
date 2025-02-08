import React, { useCallback } from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { Button } from '@/components/ui/button';
 
const sdk = createCoinbaseWalletSDK({
  appName: 'WTAF.fun',
  appLogoUrl: 'https://wtaf.fun/_next/image?url=%2Flogo-wtaf.png&w=640&q=75',
  appChainIds: [84532],
});
 
const provider = sdk.getProvider();
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlueCreateWalletButton({ handleSuccess, handleError }: any) {
  const createWallet = useCallback(async () => {
    try {
      const [address] = await provider.request({
        method: 'eth_requestAccounts',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
      handleSuccess(address);
    } catch (error) {
      handleError(error);
    }
  }, [handleSuccess, handleError]);
 
  return (
    <Button onClick={createWallet}>
      Create Wallet
    </Button>
  );
}