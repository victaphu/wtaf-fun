import { useState } from 'react'
import { TokenDetails } from '@/shared/LaunchMemeCoin'
import { useWriteContract } from 'wagmi'
import { getContractEvents, getTransactionReceipt } from 'viem/actions'
import { config } from '@/app/wagmi'


export const useCreateToken = () => {
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'success'>("idle")
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)
  const { writeContractAsync } = useWriteContract();

  const createToken = async (tokenDetails: TokenDetails) => {
    try {
      setLaunchStatus('launching')
      const factoryAbi = [
        {
          "inputs": [
            { "name": "name", "type": "string" },
            { "name": "symbol", "type": "string" },
            { "name": "emoji", "type": "string" },
            { "name": "description", "type": "string" }
          ],
          "name": "createToken",
          "outputs": [{ "name": "", "type": "address" }],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            { "indexed": true, "name": "tokenAddress", "type": "address" },
            { "indexed": false, "name": "name", "type": "string" },
            { "indexed": false, "name": "symbol", "type": "string" },
            { "indexed": false, "name": "emoji", "type": "string" },
            { "indexed": false, "name": "description", "type": "string" }
          ],
          "name": "TokenCreated",
          "type": "event"
        }
      ];
      
      const results = await writeContractAsync({
        abi: factoryAbi,
        address: '0x90EcC427c18F2d1aAB478822238B9a68Ba7b8CDa',
        functionName: 'createToken',
        args: [tokenDetails.tokenName, tokenDetails.tokenSymbol, tokenDetails.emoji, tokenDetails.description],
      });

      console.log('result', results);
      const receipt = await getTransactionReceipt(config.getClient(), { hash: results });
      console.log('receipt', receipt);

      const logs: any = await getContractEvents(config.getClient(), {
        abi: factoryAbi,
        blockHash: receipt.blockHash
      });

      console.log(logs);

      const createdTokenDetails = logs[0].args;

      setTokenAddress(createdTokenDetails.tokenAddress)
      setLaunchStatus('success')
      
      return createdTokenDetails.tokenAddress;
    } catch (error) {
      console.error("Error launching token:", error);
      setLaunchStatus('idle')
      throw error;
    }
  }

  return { createToken, launchStatus, tokenAddress };
}