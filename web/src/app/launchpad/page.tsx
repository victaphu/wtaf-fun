"use client"
import { useState, useEffect } from 'react'
import LaunchMemeCoin, { TokenDetails } from '@/shared/LaunchMemeCoin'
import { BlueCreateWalletButton } from '@/shared/CreateWalletButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PurpleConnectWalletButton } from '@/shared/LoginWalletButton'
import { useWriteContract } from 'wagmi'
import { getContractEvents, getTransactionReceipt } from 'viem/actions'
import { config } from '../wagmi'

export default function LaunchpadPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'success'>("idle")
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)

  const { writeContractAsync } = useWriteContract();

  const handleWalletSuccess = (address: string) => {
    setWalletAddress(address)
  }

  const handleWalletError = (error: Error) => {
    console.error('Wallet error:', error)
  }

  const handleLaunch = async (tokenDetails: TokenDetails) => {
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
            { "indexed": false, "name": "emoji", "type": "string" }
          ],
          "name": "TokenCreated",
          "type": "event"
        }
      ];

      const results = await writeContractAsync({
        abi: factoryAbi,
        address: '0xA418a6a536d8f806b52E7ec2821Bbe0DfE07C7d0',
        functionName: 'createToken',
        args: [tokenDetails.tokenName, tokenDetails.tokenSymbol, tokenDetails.emoji, tokenDetails.description],
      });

      console.log('result', results);
      const receipt = await getTransactionReceipt(config.getClient(), { hash: results });
      console.log('receipt', receipt);

      const logs = await getContractEvents(config.getClient(), {
        abi: factoryAbi,
        blockHash: receipt.blockHash
      });

      console.log(logs);
      
      setTokenAddress(results)
      setLaunchStatus('success')
    } catch (error) {
      console.error("Error launching token:", error);
      setLaunchStatus('idle')
      throw error;
    }
  }
  return (
    <div className="min-h-screen bg-[#4f0000] text-white">
      <img src="/rocketship.gif" alt="Rocket Ship" className="w-full max-w-5xl mx-auto" />

      <section className="container mx-auto px-4 pb-50 pt-10">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold mb-4">WTAF Launchpad</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Welcome to the WTAF Launchpad - where meme dreams take flight! Create your own meme coin with just a few clicks.
            No coding required, just pure memetic potential. Join the revolution of decentralized humor!
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/'}>
              Back to Home 🏠     
            </Button>
            <Button size="lg" onClick={() => window.location.href = '/arena'}>
              Join The Arena 🎮
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Card className="bg-white/5 text-white p-8">
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            {launchStatus === 'launching' ? (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Preparing to Launch the Memecoin</h2>
                <p className="opacity-75">Please wait while your memecoin is being created...</p>
              </div>
            ) : launchStatus === 'success' ? (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Launch Successful! 🚀</h2>
                <p className="opacity-75">Your memecoin has been created!</p>
                <a 
                  href={`https://sepolia.basescan.org/address/${tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  View on BaseScan
                </a>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/arena'}
                >
                  Go to Arena 🎮
                </Button>
              </div>
            ) : (
              <LaunchMemeCoin onLaunch={handleLaunch} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
