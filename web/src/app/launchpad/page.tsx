"use client"
import LaunchMemeCoin, { TokenDetails } from '@/shared/LaunchMemeCoin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BlueCreateWalletButton } from '@/shared/CreateWalletButton'
import { PurpleConnectWalletButton } from '@/shared/LoginWalletButton'
import { useAccount } from 'wagmi'
import { useCreateToken } from '@/hooks/use-create-token'

export default function LaunchpadPage() {
  const { address } = useAccount()
  const { createToken, launchStatus, tokenAddress } = useCreateToken();

  const handleWalletSuccess = () => {
    window.location.reload()
  }

  const handleWalletError = (error: Error) => {
    console.error('Wallet error:', error)
  }

  const handleLaunch = async (tokenDetails: TokenDetails) => {
    await createToken(tokenDetails);
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
            {!address ? (
              <div className="flex gap-4">
                <BlueCreateWalletButton handleSuccess={handleWalletSuccess} handleError={handleWalletError} />
                <PurpleConnectWalletButton handleSuccess={handleWalletSuccess} handleError={handleWalletError} />
              </div>
            ) : launchStatus === 'launching' ? (
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
