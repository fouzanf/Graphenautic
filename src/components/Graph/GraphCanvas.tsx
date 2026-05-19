"use client";

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  SelectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';

// 1. MOVED THE IMPORT TO THE TOP
import { cn } from '@/lib/utils';
import { useGraphStore } from '@/store/useGraphStore';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';

const nodeTypes = {
  entityNode: CustomNode,
};

const edgeTypes = {
  default: CustomEdge,
};

export const GraphCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect // 2. NO LONGER CONFLICTING WITH REACT FLOW
  } = useGraphStore();

  const proOptions = { hideAttribution: true };

  // Determine which nodes and edges to highlight
  const selectedNodeId = nodes.find(n => n.selected)?.id;

  const processedNodes = useMemo(() => nodes.map(node => ({
    ...node,
    className: cn(
      node.className,
      "transition-all duration-300 ease-in-out",
      selectedNodeId && node.id !== selectedNodeId && !edges.some(e =>
        (e.source === selectedNodeId && e.target === node.id) ||
        (e.target === selectedNodeId && e.source === node.id)
      ) ? "opacity-20 scale-95 grayscale" : "opacity-100 scale-100"
    )
  })), [nodes, selectedNodeId, edges]);

  const processedEdges = useMemo(() => edges.map(edge => ({
    ...edge,
    selected: edge.selected || (selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId)),
    animated: edge.animated || (selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId)),
  })), [edges, selectedNodeId]);

  return (
    <div className="w-full h-full bg-[#0A0A0A] relative group">
      <ReactFlow
        nodes={processedNodes}
        edges={processedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={proOptions}
        snapToGrid
        snapGrid={[20, 20]}
        selectionMode={SelectionMode.Partial}
        defaultEdgeOptions={{
          type: 'default',
          animated: true,
        }}
        className="transition-opacity duration-500"
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={40}
          size={1}
          color="#1A1A1A"
          className="opacity-50"
        />
        <Controls className="!bg-black/50 !backdrop-blur-md !border-border/50 !shadow-2xl !fill-white" />
        <MiniMap
          className="!bg-black/80 !border-border/50 !rounded-xl !shadow-2xl overflow-hidden"
          nodeColor={(node) => {
            if (node.id === selectedNodeId) return '#7C3AED';
            return '#262626';
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
        <Panel position="top-right" className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2 animate-pulse" />
          Axiom Engine Active
        </Panel>
      </ReactFlow>
    </div>
  );
};