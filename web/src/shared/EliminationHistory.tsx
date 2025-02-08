'use client'

import { Card } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TokenDetails } from './LaunchMemeCoin'

export default function EliminationHistory({ eliminationHistory = [], currentRound = 1 }: { eliminationHistory: { rule: string, eliminated: TokenDetails[] }[], currentRound: number }) {
  const totalRounds = 5

  return (
    <div className="flex flex-row gap-4 p-2">
      {Array(totalRounds).fill(null).map((_, index) => {
        const roundNumber = index + 1
        const isRoundReady = roundNumber <= currentRound
        const token = eliminationHistory[eliminationHistory.length - index - 1]

        return (
          <Card
            key={index}
            className={`p-6 h-full flex-1 flex flex-col ${!isRoundReady ? 'bg-gray-100' : ''} ${roundNumber === currentRound ? 'animate-shake' : ''}`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-semibold">Round {roundNumber}</h3>
                {isRoundReady && token ? (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {token.rule}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-gray-600">
                    This round has not started yet
                  </p>
                )}
              </div>
              <div className="flex flex-row gap-2 mt-4 flex-wrap">
                {isRoundReady && token && (
                  token.eliminated.map((t, i) => <Popover key={i}>
                    <PopoverTrigger asChild>
                      <div onMouseEnter={() => { }}>
                        <span className="text-md cursor-pointer">{t.emoji}</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {t.tokenName}</p>
                        <p><strong>Symbol:</strong> {t.tokenSymbol}</p>
                        <p><strong>Supply:</strong> {t.totalSupply}</p>
                      </div>
                    </PopoverContent>
                  </Popover>)
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
