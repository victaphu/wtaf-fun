import { useEffect, useState } from 'react';
import { eliminationRules, emojiList } from '../app/common/constants';

interface Node {
  id: string;
  emoji: string;
  x: number;
  y: number;
  r: number;
}

interface TokenDetails {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  description: string;
  websiteUrl: string;
  emoji: string;
}

interface EliminationEvent {
  rule: string;
  eliminated: TokenDetails[];
}

const generateRandomToken = (): TokenDetails => {
  const adjectives = ['Super', 'Mega', 'Ultra', 'Hyper', 'Epic', 'Magic', 'Cosmic', 'Lucky'];
  const nouns = ['Moon', 'Rocket', 'Star', 'Doge', 'Cat', 'Pepe', 'Shiba', 'Coin'];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const tokenName = `${randomAdjective} ${randomNoun}`;
  const tokenSymbol = `${randomAdjective.substring(0, 1)}${randomNoun.substring(0, 3)}`.toUpperCase();

  return {
    tokenName,
    tokenSymbol,
    totalSupply: (Math.random() * 1000000000000).toFixed(0),
    description: `The next generation ${tokenName.toLowerCase()} token for the web3 revolution!`,
    websiteUrl: `https://${tokenName.toLowerCase().replace(' ', '')}.io`,
    emoji: emojiList[Math.floor(Math.random() * emojiList.length)]
  };
};

export const useGame = () => {
  const [nodes, setNodes] = useState<(Node & TokenDetails)[]>([]);
  const [eliminationHistory, setEliminationHistory] = useState<EliminationEvent[]>([]);
  const [round, setRound] = useState<number>(1);

  useEffect(() => {
    const initialNodes = Array.from({ length: 100 }, (_, i) => {
      const token = generateRandomToken();
      return {
        id: `node-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: 20,
        ...token,
      };
    });
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    const eliminationInterval = setInterval(() => {
      if (nodes.length > 1 && round <= 5) {
        const numToEliminate = Math.floor(nodes.length / 2);
        const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);
        const eliminatedNodes = shuffledNodes.slice(0, numToEliminate);
        const rule = eliminationRules[Math.floor(Math.random() * eliminationRules.length)];

        setEliminationHistory(prev => [{
          rule,
          eliminated: eliminatedNodes.map(node => ({
            emoji: node.emoji,
            tokenName: node.tokenName,
            websiteUrl: node.websiteUrl,
            description: node.description,
            tokenSymbol: node.tokenSymbol,
            totalSupply: node.totalSupply
          }))
        }, ...prev]);

        setNodes(prev => prev.filter(n => !eliminatedNodes.some(en => en.id === n.id)));
        setRound(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(eliminationInterval);
  }, [nodes, round]);

  return {
    nodes,
    eliminationHistory,
    round,
  };
};
