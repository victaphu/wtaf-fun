import { useEffect, useState } from 'react';
import * as d3 from 'd3';
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

  const setupSimulation = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    width: number,
    height: number
  ) => {
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .force('collision', d3.forceCollide().radius((d: any) => d.r + 5))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .alphaTarget(0.1)
      .velocityDecay(0.3);

    return simulation;
  };

  const createDragBehavior = (simulation: d3.Simulation<Node & TokenDetails, undefined>) => {
    return d3.drag<SVGGElement, Node & TokenDetails>()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('start', (event, d:any) => {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('drag', (event, d:any) => {
        d.fx = event.x;
        d.fy = event.y;
        simulation.alpha(0.5).restart();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('end', (event, d:any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  };

  return {
    nodes,
    eliminationHistory,
    round,
    setupSimulation,
    createDragBehavior
  };
};
