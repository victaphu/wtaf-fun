import { useEffect, useState } from 'react';
import { eliminationRules, emojiList } from '../app/common/constants';
import { createPublicClient, getAddress, Hex, http } from 'viem';
import { baseSepolia } from 'viem/chains';

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

const simulationMode = true;

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
const battleRoyaleAddress = "0xFcD18dbA40c43b6e01f09D3D1858B7C4706cf6Ca";

async function fetchAllActiveTokens(): Promise<TokenDetails[]> {

  const getActiveTokensAbi = [{
    "inputs": [],
    "name": "getActiveTokens",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  }];

  try {
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    const activeTokens = await client.readContract({
      address: battleRoyaleAddress as Hex,
      abi: getActiveTokensAbi,
      functionName: 'getActiveTokens',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any[];

    // console.log("Active tokens:", activeTokens);

    // Define MemeCoinFactory ABI for events
    const memeCoinFactoryAbi = [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "emoji",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        }
      ],
      "name": "TokenCreated",
      "type": "event"
    }];

    // Get logs for TokenCreated events
    const logs = await client.getLogs({

      address: '0x90EcC427c18F2d1aAB478822238B9a68Ba7b8CDa' as Hex,
      events: [memeCoinFactoryAbi[0]],
      fromBlock: BigInt(21661065),
      toBlock: 'latest'
    });

    // Parse and print the logs
    // console.log("Token Creation Events:", logs);
    // logs.forEach((log: any, index) => {
    //   console.log(`\nToken #${index + 1}:`);
    //   console.log(`Token Address: ${log.args.tokenAddress}`);
    //   console.log(`Name: ${log.args.name}`);
    //   console.log(`Symbol: ${log.args.symbol}`);
    //   console.log(`Emoji: ${log.args.emoji}`);
    // });

    // Create array of token objects from logs

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokenList: (TokenDetails & { tokenAddress: string })[] = logs.map((log: any) => ({
      tokenAddress: getAddress(log.args.tokenAddress),
      tokenName: log.args.name,
      tokenSymbol: log.args.symbol,
      emoji: log.args.emoji,
      description: log.args.description,
      totalSupply: "100000000",
      websiteUrl: `https://${log.args.name.toLowerCase().replace(' ', '')}.io`
    }));

    // Filter tokens that are in the active list
    const activeTokenList = tokenList.filter(token =>
      activeTokens.includes(token.tokenAddress)
    );

    return activeTokenList;

  } catch (error) {
    console.error("Error fetching active tokens:", error);
    throw error;
  }
}

const useGameSim = () => {
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
    refresh: () => { }
  };
};

const battleRoyaleABI = [
  {
    "inputs": [],
    "name": "currentRound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "roundNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalStaked",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }, {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "eliminationRules",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];

const useGameReal = () => {
  const [nodes, setNodes] = useState<(Node & TokenDetails)[]>([]);
  const [eliminationHistory,] = useState<EliminationEvent[]>([]);
  const [round, setRound] = useState<number>(1);
  const fetchData = async () => {
    try {
      const activeTokens = await fetchAllActiveTokens();
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http()
      });

      const gameState = await publicClient.readContract({
        address: battleRoyaleAddress,
        abi: battleRoyaleABI,
        functionName: 'currentRound'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
      // setRound(Number(gameState)); 
      setRound(Number(gameState[0]));
      console.log(gameState);
      const initialNodes = activeTokens.map((token, i) => ({
        id: `node-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: 20,
        ...token,
      }));
      setNodes(initialNodes);

      // const eliminationRules = await publicClient.readContract({
      //   address: battleRoyaleAddress,
      //   abi: battleRoyaleABI,
      //   functionName: 'eliminationRules',
      //   args: [BigInt(round)]

      // }) as string[];

      // console.log(eliminationRules);

      // // Fetch elimination history
      // const history: EliminationEvent[] = [];
      // for (let i = 0; i < roundData; i++) {
      //   const rule = await publicClient.readContract({
      //     address: BATTLE_ROYALE_ADDRESS,
      //     abi: battleRoyaleABI,
      //     functionName: 'roundToEliminationRule',
      //     args: [BigInt(i)]
      //   });
      //   if (rule) {
      //     history.push({
      //       rule,
      //       eliminated: [] // We would need additional contract methods to get eliminated tokens per round
      //     });
      //   }
      // }
      // setEliminationHistory(history);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    nodes,
    eliminationHistory,
    round,
    refresh: fetchData,
  };

}

export const useGame = simulationMode ? useGameSim : useGameReal;