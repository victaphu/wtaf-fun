"use client"
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import * as d3 from 'd3';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BlueCreateWalletButton } from '@/shared/CreateWalletButton';
import EliminationHistory from '@/shared/EliminationHistory';
import { useGame } from '@/hooks/use-game';

interface Node {
  id: string;
  emoji: string;
  x: number;
  y: number;
  r: number;
}

export default function ArenaPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const {eliminationHistory, nodes, round} = useGame();

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoom as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const simulation: any = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .force('collision', d3.forceCollide().radius((d: any) => (d as Node).r + 5))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .alphaTarget(0.1)
      .velocityDecay(0.3);

    const node = g
      .selectAll<SVGGElement, Node>('.node')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .data(nodes, (d: any) => d.id)
      .join(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (enter: any) => {
          const nodeGroup = enter.append('g')
            .attr('class', 'node')
            .call(drag(simulation))

          nodeGroup.append('circle')
            .attr('r', 22)
            .attr('fill', 'url(#marbleGradient)')
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('class', 'node-circle');

          // Define marble gradient
          const marbleGradient = svg.append('defs')
            .append('radialGradient')
            .attr('id', 'marbleGradient')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%');

          marbleGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.8)');

          marbleGradient.append('stop')
            .attr('offset', '70%')
            .attr('stop-color', 'rgba(200, 200, 200, 0.6)');

          marbleGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgba(150, 150, 150, 0.4)');

          nodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '24px')
            .style('cursor', 'pointer')
            .style('background', 'rgba(255,255,255,1)')
            .style('filter', 'drop-shadow(0 0 8px rgba(255,255,255,0.6))')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => d.emoji);            return nodeGroup;
        }
      );

    simulation.on('tick', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: d3.Simulation<Node, undefined>) {
      return d3.drag<SVGGElement, Node>()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('start', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.1).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('drag', (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
          simulation.alpha(0.5).restart();
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('end', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, round]);

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
        <div
          className="relative mt-8"
          style={{ width: 800, height: 600 }}
        >
          <Image
            src="/battleground.png"
            alt="Battleground"
            fill
            className="rounded-lg"
          />
          <svg
            ref={svgRef}
            width="800"
            height="600"
            className="absolute top-0 left-0 rounded-lg"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
}
