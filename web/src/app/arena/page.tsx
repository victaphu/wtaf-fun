"use client"
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import * as d3 from 'd3';
import { eliminationRules, emojiList } from '../common/constants';
import Image from 'next/image';

interface Node {
  id: string;
  emoji: string;
  x: number;
  y: number;
  r: number;
}

export default function ArenaPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [eliminationHistory, setEliminationHistory] = useState<{ rule: string, eliminated: string[] }[]>([]);
  const [round, setRound] = useState<number>(1);

  useEffect(() => {
    const initialNodes = Array.from({ length: 100 }, (_, i) => ({
      id: `node-${i}`,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: Math.random() * 800,
      y: Math.random() * 600,
      r: 20
    }));
    setNodes(initialNodes);
  }, []);

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

    const simulation = d3.forceSimulation(nodes)
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('click', (event: any, d: any) => {
              const eliminatedNodes = [d];
              handleElimination(eliminatedNodes);
            });

          nodeGroup.append('circle')
            .attr('r', 22)
            .attr('fill', 'rgba(255, 255, 255, 0.1)')
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('class', 'node-circle');

          nodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '24px')
            .style('cursor', 'pointer')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => d.emoji);

          return nodeGroup;
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

    const handleElimination = (eliminatedNodes: Node[]) => {
      const rule = eliminationRules[Math.floor(Math.random() * eliminationRules.length)];

      setEliminationHistory(prev => [
        {
          rule,
          eliminated: eliminatedNodes.map(node => node.emoji)
        },
        ...prev
      ]);

      g.selectAll('.node')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((d: any) => eliminatedNodes.some(n => n.id === d.id))
        .transition()
        .duration(500)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('transform', (d: any) => `translate(${d.x},${d.y}) scale(2)`)
        .transition()
        .duration(300)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('transform', (d: any) => `translate(${d.x},${d.y}) scale(0)`)
        .style('opacity', 0)
        .remove();

      setNodes(prev => prev.filter(n => !eliminatedNodes.some(en => en.id === n.id)));
    };

    const eliminationInterval = setInterval(() => {
      if (nodes.length > 1 && round <= 5) {
        const numToEliminate = Math.floor(nodes.length / 2);
        const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);
        const eliminatedNodes = shuffledNodes.slice(0, numToEliminate);

        handleElimination(eliminatedNodes);
        setRound(prev => prev + 1);
      }
    }, 5000);

    return () => {
      simulation.stop();
      clearInterval(eliminationInterval);
    };
  }, [nodes, round]);

  return (
    <div className="flex min-h-screen bg-[#4f0000]">
      <div className="fixed w-1/4 h-screen p-4 bg-black/20 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Elimination History</h2>
        <div className="space-y-4">
          {eliminationHistory.map((event, i) => (
            <Card key={i} className="p-4 bg-white/10 text-white">
              <p className="text-sm opacity-75">Rule {eliminationHistory.length - i}:</p>
              <p>{event.rule}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">💀</span>
                <span>Eliminated: {event.eliminated.join(', ')}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="ml-[25%] flex-1 flex flex-col items-center">
        <Image src="/logo-wtaf.png" alt="WTAF" width={400} height={200} className="mx-auto" />
        <div className="text-white text-center mb-4">
          <h1 className="text-4xl font-bold">Memes Alive</h1>
          <p className="text-8xl font-bold">{nodes.length}</p>
          <p className="text-2xl">Round {round - 1}/5</p>
        </div>
        <svg
          ref={svgRef}
          width="800"
          height="600"
          className="bg-black/30 rounded-lg"
        />
      </div>
    </div>
  );
}
