"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlueCreateWalletButton({ handleSuccess, handleError }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const sdk = createCoinbaseWalletSDK({
      appName: 'WTAF.fun',
      appLogoUrl: 'https://wtaf.fun/_next/image?url=%2Flogo-wtaf.png&w=640&q=75',
      appChainIds: [84532],
    });

    const provider = sdk.getProvider();
    setProvider(provider);
  }, []);

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
  }, [handleSuccess, handleError, provider]);

  return (
    <Button onClick={createWallet}>
      Create Wallet
    </Button>
  );
}