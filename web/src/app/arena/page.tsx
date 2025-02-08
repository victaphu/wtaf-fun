"use client"
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BlueCreateWalletButton } from '@/shared/CreateWalletButton';
import EliminationHistory from '@/shared/EliminationHistory';
import { useGame } from '@/hooks/use-game';

export default function ArenaPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const {eliminationHistory, nodes, round} = useGame();

  return (
    <div className="flex min-h-screen bg-[#4f0000]">
      <div className="fixed w-1/4 h-screen p-4 bg-black/20 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Game History</h2>
        <div className="space-y-4">
          {eliminationHistory.map((event, i) => (
            <div key={eliminationHistory.length - i}>
              {event.eliminated.map((token, tokenIndex) => (
                <Card key={`${i}-${tokenIndex}`} className="p-4 bg-white/10 text-white mb-2 animate-flip-up">
                  <p className="text-sm opacity-75">Round {round - 1}:</p>
                  <p>{event.rule}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl">{token.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-bold">{token.tokenName}</span>
                      <span className="text-sm opacity-75">{token.tokenSymbol}</span>
                    </div>
                  </div>
                </Card>              
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="ml-[25%] flex-1 flex flex-col items-center">
        <nav className="w-full bg-black/30 pr-1 py-1">
          <div className="container mx-auto flex items-center justify-between">
            <Image src="/logo-wtaf.png" alt="WTAF" width={200} height={100} />
            <div className="flex items-center gap-8 text-white">
              <Card className="p-4 w-40">
                <div className="flex flex-col items-center gap-2">
                  <span>Memes Alive:</span>
                  <span className="font-bold flex items-center gap-2">
                    <span>🫀</span>
                    {nodes.length}
                  </span>
                </div>
              </Card>
              <Card className="p-4 w-40">
                <div className="flex flex-col items-center gap-2">
                  <span>Memes Dead:</span>
                  <span className="font-bold flex items-center gap-2">
                    <span>💀</span>
                    {eliminationHistory.reduce((acc, curr) => acc + curr.eliminated.length, 0)}
                  </span>
                </div>
              </Card>
              <Card className="p-4 w-40">
                <div className="flex flex-col items-center gap-2">
                  <span>Round:</span>
                  <span className="font-bold flex items-center gap-2">
                    <span>🔄</span>
                    {round - 1}/5
                  </span>
                </div>
              </Card>
              <div className="flex flex-col gap-2">
                <BlueCreateWalletButton />
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Connect Wallet
                </Button>
                {/* <LaunchMemeCoin /> */}
              </div>
            </div>
          </div>
        </nav>
        <EliminationHistory eliminationHistory={eliminationHistory} currentRound={round} />
        <svg
          ref={svgRef}
          width="800"
          height="600"
          className="bg-black/30 rounded-lg mt-8"
        />
      </div>
    </div>
  );
}
