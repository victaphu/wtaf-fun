"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const eliminationRules = [
  "Only tokens whose emoji + name character count forms a Fibonacci number survive",
  "Eliminate tokens where description contains more vowels than consonants",
  "Survive if token position multiplied by emoji Unicode value is prime",
  "Eliminate if token name anagram contains 'moon' or 'lambo'",
  "Only tokens whose holders count forms a perfect square survive",
  "Eliminate tokens where symbol length + emoji count equals holder count",
  "Survive if description contains exactly 3 punctuation marks",
  "Eliminate tokens whose name starts with the same letter as the most common first letter among all tokens",
  "Only tokens with palindrome total supply numbers survive",
  "Eliminate if token position + emoji Unicode value is divisible by 13",
  "Survive if description contains exactly two emoji references",
  "Eliminate tokens whose name contains same number of letters as current block height mod 10",
  "Only tokens whose holder count is a multiple of their position survive",
  "Eliminate if total supply divided by current supply is irrational",
  "Survive if token name contains exactly one mathematical symbol",
  "Eliminate tokens whose description has an odd number of words",
  "Only tokens with emoji from the 'food' category survive",
  "Eliminate if sum of ASCII values in symbol is prime",
  "Survive if token position is a perfect cube",
  "Eliminate tokens whose name contains more than one animal reference",
  "Only tokens whose description contains a movie quote survive",
  "Eliminate if total holder addresses contain more even numbers than odd",
  "Survive if token name contains exactly one color word",
  "Eliminate tokens whose symbol contains a repeated character",
  "Only tokens created during Mercury retrograde survive",
  "Eliminate if description contains any words from top 100 crypto buzzwords",
  "Survive if token position is divisible by both 3 and 7",
  "Eliminate tokens whose name length equals their position",
  "Only tokens with emoji that represent celestial bodies survive",
  "Eliminate if total supply is a palindrome",
  "Survive if description contains exactly three adjectives",
  "Eliminate tokens whose holder count is a Mersenne number",
  "Only tokens with name containing exactly two digits survive",
  "Eliminate if symbol contains any letter from 'HODL'",
  "Survive if token's creation timestamp is prime",
  "Eliminate tokens whose description contains 'safe' or 'moon'",
  "Only tokens with emoji from 'transportation' category survive",
  "Eliminate if total supply contains repeating digits",
  "Survive if token name contains a programming language",
  "Eliminate tokens whose symbol forms a valid English word",
  "Only tokens whose description contains exactly one meme reference survive",
  "Eliminate if holder count divided by position equals emoji Unicode value",
  "Survive if token name contains exactly one cryptocurrency reference",
  "Eliminate tokens whose description has perfect comma placement",
  "Only tokens with emoji representing extinct animals survive",
  "Eliminate if sum of all numbers in description is even",
  "Survive if token position is a triangular number",
  "Eliminate tokens whose name contains exactly two compound words",
  "Only tokens with emoji that change meaning when reversed survive",
  "Eliminate if description contains exactly three Oxford commas",
  "Only tokens with animal-themed emojis survive",
  "Eliminate tokens with more than 3 syllables in name",
  "Survive if description contains a haiku",
  "Eliminate tokens whose symbol contains a vowel",
  "Only tokens with food-related names survive",
  "Eliminate if total supply is not a multiple of 42",
  "Survive if emoji matches first letter of description",
  "Eliminate tokens created on odd-numbered days",
  "Only tokens with exactly 5 words in description survive",
  "Eliminate if holder count is less than position number",
  "Survive if token name contains alliteration",
  "Eliminate tokens whose symbol length is prime",
  "Only tokens with weather-related emojis survive",
  "Eliminate if description contains 'crypto' or 'token'",
  "Survive if total supply is a perfect power",
  "Eliminate tokens whose name ends in 'coin'",
  "Only tokens with emoji from 'nature' category survive",
  "Eliminate if holder count is a multiple of 7",
  "Survive if description contains a rhyming pair",
  "Eliminate tokens whose position is in bottom quartile",
  "Only tokens with single-character symbols survive",
  "Eliminate if name contains more than one number",
  "Survive if emoji is from 'faces' category",
  "Eliminate tokens whose description is shorter than name",
  "Only tokens with prime number of holders survive",
  "Eliminate if total supply contains digit '4'",
  "Survive if token name contains a planet name",
  "Eliminate tokens whose symbol contains numbers",
  "Only tokens with emoji representing tools survive",
  "Eliminate if description contains fewer than 10 words",
  "Top 10 tokens by holder count survive",
  "Tokens with total supply > 500M survive",
  "Tokens whose current supply is > 80% of total supply survive",
  "Tokens with description length > 100 characters survive",
  "Tokens with symbol length <= 4 survive",
  "Tokens whose name contains their symbol survive",
  "Top 15 tokens by creation date survive",
  "Tokens with unique first letter in name survive",
  "Tokens with highest holder-to-supply ratio survive",
  "Tokens in positions 1-10 survive",
  "Tokens with matching emoji category and name theme survive",
  "Tokens with descriptions containing their emoji survive",
  "Tokens whose symbol is all uppercase survive",
  "Tokens with balanced holder distribution (top holder < 10%) survive",
  "Tokens whose name length is less than 12 characters survive",
  "Tokens with unique emoji categories survive",
  "Tokens whose current supply differs less than 10% from total supply survive",
  "Tokens whose position is in top 50% survive",
  "Tokens with descriptive names (not random characters) survive",
  "Tokens whose holder count > 1% of total supply survive"];
const emojiList = ["🚀", "🌙", "🎮", "🎲", "🎪", "🎭", "🎨", "🎯", "🎪", "🎭", "🦄", "🐱", "🐶", "🦊", "🦁", "🐯", "🦒", "🦘", "🦬", "🦙", "🎪", "🎭", "🎨", "🃏", "🎲", "🎯", "🎪", "🎭"];

const generateRandomEmojis = (count: number) => {
  return Array.from({ length: count }, () =>
    emojiList[Math.floor(Math.random() * emojiList.length)]
  );
};

export default function Home() {
  const [currentRule, setCurrentRule] = useState('');
  const [emojis, setEmojis] = useState(generateRandomEmojis(100));
  useEffect(() => {
    const ruleInterval = setInterval(() => {
      const randomRule = eliminationRules[Math.floor(Math.random() * eliminationRules.length)];
      setCurrentRule(randomRule);

      // Remove random emojis
      setEmojis(prev => {
        const removeCount = Math.floor(Math.random() * 5) + 1;

        if (prev.length === 0) {
          return generateRandomEmojis(100);
        }
        return prev.slice(0, prev.length - removeCount);
      });

    }, 3000);

    return () => clearInterval(ruleInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4f0000] to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="space-y-6">
          <Image src="/wtaf.gif" alt="WTAF" width={800} height={200} className="mx-auto" />
          <p className="text-2xl">What The Actual F*** is this token?</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="animate-bounce">
              Launch Your Meme 🚀
            </Button>
            <Button size="lg">
              Join The Madness 🎮
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-black/20">
        <h2 className="text-4xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/5 rounded-lg">
            <h3 className="text-xl font-bold mb-4">🎲 5 Rounds of Chaos</h3>
            <p>Launch your memecoin and compete against other memecoiners to survive 5 elimination rounds! After each round, the Evil AI Game Master picks from 100 random criteria to eliminate tokens. Losers get burnt, survivors advance!</p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg">
            <h3 className="text-xl font-bold mb-4">💰 Buy & Win</h3>
            <p>1-minute trading window between rounds to buy surviving tokens. Final survivors split 50% of the pot, while 20% goes to token holders, 20% to liquidity launch, and 10% to WTAF.fund!</p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg">
            <h3 className="text-xl font-bold mb-4">🔥 Periodic Launches</h3>
            <p>Game rounds launch periodically. Launch your meme, survive the chaos, and claim your share of the prize pool. But beware - one wrong move and you're burnt forever!</p>
          </div>
        </div>
      </section>
      {/* Tokenomics */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Tokenomics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Prize Distribution</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-lg">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-bold">50% - Winners Pool</p>
                  <p className="text-sm opacity-75">Split among final survivors</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-2xl">💎</span>
                <div>
                  <p className="font-bold">20% - Token Shareholders</p>
                  <p className="text-sm opacity-75">Distributed to token holders</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-bold">20% - Liquidity Pool</p>
                  <p className="text-sm opacity-75">Ensures trading stability</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="font-bold">10% - WTAF Fund</p>
                  <p className="text-sm opacity-75">Platform development & maintenance</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Game Mechanics</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-xl">🎮</span>
                  <p>5 rounds of AI-driven elimination chaos</p>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🔄</span>
                  <p>No winners? Prize pool rolls over to next game</p>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <p>1-minute trading windows between rounds</p>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Advanced Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-xl">📈</span>
                  <p>Dynamic bonding curve for token pricing</p>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🔒</span>
                  <p>Stake tokens to earn passive rewards</p>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  <p>Launched on <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="underline">BASE Chain</a> for low fees</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Winners Gallery */}
      <section className="container mx-auto px-4 py-16 bg-black/10">
        <h2 className="text-4xl font-bold mb-8 text-center">Hall of Fame 🏆</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/15 transition-colors text-white">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-bold">DOGE VADER #{i + 1}</h3>
                <p className="text-sm opacity-75">Won 42.69 ETH</p>
                <Badge className="mt-2">Round #{100 - i}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>


      {/* Losers Gallery */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Recent Casualties 💀</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-red-600/10 backdrop-blur-sm border border-black/20 p-4 hover:bg-white/15 transition-colors text-white">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="font-bold">PEPE REKT #{i + 1}</h3>
                <p className="text-sm opacity-75">Survived {Math.floor(Math.random() * 4) + 1} rounds</p>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge >Eliminated</Badge>
                  <Badge >Round #{Math.floor(Math.random() * 100) + 1}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Game Master */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center w-full">Meet Your Chaos Agent 🤖</h2>        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 z-10 flex flex-col gap-4">
            <p className="text-sm">Born in the depths of BASE chain's neural networks, our Chaos Agent is the most unhinged AI ever to grace the blockchain. Armed with 100 elimination rules ranging from galaxy-brain logic to absolute madness, it's here to turn your meme coins into digital confetti.</p>

            <p className="font-bold text-xl">Current Chaos Level: MAXIMUM OVERDRIVE 🌪️</p>

            <div className="text-sm bg-red-300/5 p-4 rounded-lg">
              <span className="text-primary font-bold">Fun Fact:</span> Our Chaos Agent once eliminated a token because its emoji's Unicode value multiplied by its position number formed a perfect square on a Tuesday during a solar eclipse.
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
              >
                <p className="text-xl">{currentRule}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 relative min-h-[400px]">
            <div className="absolute inset-0 flex flex-wrap gap-2 justify-center items-center">
              <AnimatePresence>
                {emojis.map((emoji, index) => (
                  <motion.span
                    key={`${emoji}-${index}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0, rotate: 360 }}
                    className="text-2xl"
                  >
                    <span aria-label="a rocket blasting off" role="img">{emoji}</span>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#4f0000] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="container mx-auto px-4 py-16 bg-black/20">
        <h2 className="text-4xl font-bold mb-8 text-center">Live Stats 📊</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500/10 p-6 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold">Total Games</h3>
            <p className="text-4xl font-bold text-primary">1,337</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500/10 p-6 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold">Tokens Burned</h3>
            <p className="text-4xl font-bold text-primary">42,069</p>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-500/10 p-6 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold">Total Prize Pool</h3>
            <p className="text-4xl font-bold text-primary">∞ ETH</p>
          </Card>
        </div>
      </section>
      {/* Roadmap */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Roadmap 🗺️</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
          
          <div className="space-y-24">
            {[
              { phase: "Phase 1", title: "Launch Chaos", desc: "Initial game release on BASE" },
              { phase: "Phase 2", title: "More Mayhem", desc: "New elimination rules & community voting" },
              { phase: "Phase 3", title: "Cross-Chain Carnage", desc: "Expand to other chains" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <Badge className="mb-2">{item.phase}</Badge>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="opacity-75">{item.desc}</p>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2 shadow-lg shadow-purple-500/50" />
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 bg-black/10">
        <h2 className="text-4xl font-bold mb-8 text-center">FAQ 🤔</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            { q: "What is WTAF?", a: "The most ridiculous token game ever created on BASE chain!" },
            { q: "How do I play?", a: "Stake 0.01 tokens, choose your emoji, and pray to the AI gods!" },
            { q: "What happens if I lose?", a: "Your token gets ceremoniously burned. But hey, that's show business!" },
          ].map((item, i) => (
            <Card key={i} className="bg-white/70 p-4">
              <h3 className="font-bold mb-2">{item.q}</h3>
              <p className="opacity-75">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <Button size="icon">
              <span className="text-2xl">📱</span>
            </Button>
            <Button size="icon">
              <span className="text-2xl">💬</span>
            </Button>
            <Button size="icon">
              <span className="text-2xl">🐦</span>
            </Button>
          </div>
          <p className="opacity-75">© 2024 WTAF.FUN - The Most WTF Token Game Ever</p>
        </div>
      </footer>
    </div>
  );
}