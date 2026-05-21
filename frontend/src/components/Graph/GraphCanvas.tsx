"use client";

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  BackgroundVariant,
  Panel,
  SelectionMode,
  MarkerType,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, ZoomIn, ZoomOut, Maximize, RotateCcw, Type, Download, Share, FileJson, FileText, ChevronRight, Sparkles, Activity } from 'lucide-react';

import { useGraphStore } from '@/store/useGraphStore';
import { ProcessedDocument } from '@/types/graph';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { cn } from '@/lib/utils';
import dagre from 'dagre';

const GraphTools = ({ onToggleLabels, onExport, onLayout }: { onToggleLabels: () => void, onExport: (type: string) => void, onLayout: () => void }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [showExport, setShowExport] = React.useState(false);

  return (
    <Panel position="top-right" className="flex items-center gap-2 bg-[#050b1e]/90 backdrop-blur-2xl border border-blue-500/40 p-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative z-50">
      <button onClick={() => zoomIn()} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-blue-500/10 rounded-xl transition-all" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
      <button onClick={() => zoomOut()} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-blue-500/10 rounded-xl transition-all" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
      <div className="w-px h-5 bg-slate-800" />
      <button onClick={() => fitView({ duration: 800, padding: 0.2 })} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-blue-500/10 rounded-xl transition-all" title="Fit View"><Maximize className="w-4 h-4" /></button>
      <button onClick={onLayout} className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-blue-500/10 rounded-xl transition-all" title="Auto Layout Matrix"><RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} /></button>
      <div className="w-px h-5 bg-slate-800" />
      <button onClick={onToggleLabels} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-blue-500/10 rounded-xl transition-all" title="Toggle Typography"><Type className="w-4 h-4" /></button>
      <div className="w-px h-5 bg-slate-800" />
      <div className="relative">
        <button onClick={() => setShowExport(!showExport)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-blue-500/10 rounded-xl transition-all flex items-center gap-1.5" title="Export">
          <Download className="w-4 h-4" />
        </button>
        {showExport && (
          <div className="absolute right-0 top-full mt-3 w-56 bg-[#060e26]/95 backdrop-blur-3xl border border-blue-500/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] py-2 z-50">
            <button onClick={() => { onExport('png'); setShowExport(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-blue-500/20 hover:text-cyan-300 flex items-center gap-2.5 transition-colors"><Share className="w-4 h-4 text-blue-400" /> PNG High-Res Screenshot</button>
            <button onClick={() => { onExport('csv'); setShowExport(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-blue-500/20 hover:text-cyan-300 flex items-center gap-2.5 transition-colors"><FileText className="w-4 h-4 text-purple-400" /> Export Entities Matrix (CSV)</button>
            <button onClick={() => { onExport('json'); setShowExport(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-blue-500/20 hover:text-cyan-300 flex items-center gap-2.5 transition-colors"><FileJson className="w-4 h-4 text-cyan-400" /> Copy Raw Graph JSON</button>
          </div>
        )}
      </div>
    </Panel>
  );
};

const GraphCanvasContent = () => {
  const nodeTypes = useMemo(() => ({ entityNode: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ default: CustomEdge }), []);
  const {
    nodes,
    edges,
    documents,
    onNodesChange,
    onEdgesChange,
    onConnect,
    focusedNodeId,
    setFocusedNodeId,
    submitQuery,
    setNodes
  } = useGraphStore();

  const { fitView } = useReactFlow();

  // Auto focus node
  React.useEffect(() => {
    if (focusedNodeId) {
      setTimeout(() => {
        fitView({ nodes: [{ id: focusedNodeId }], duration: 800, padding: 0.2, maxZoom: 1.2 });
      }, 50);
    }
  }, [focusedNodeId, fitView]);

  const handleExport = (type: string) => {
    if (type === 'json') {
      navigator.clipboard.writeText(JSON.stringify({ nodes, edges }, null, 2));
      alert('Graph JSON copied to clipboard!');
    } else if (type === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "ID,Label,Category\n"
        + nodes.map(n => `"${n.id}","${n.data.label}","${n.data.category}"`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "graphenautic_entities.csv");
      document.body.appendChild(link);
      link.click();
    } else if (type === 'png') {
      alert('PNG export requires html-to-image library. JSON & CSV exports are fully functional.');
    }
  };

  const proOptions = { hideAttribution: true };

  const [searchQuery, setSearchQuery] = React.useState('');
  const [labelsVisible, setLabelsVisible] = React.useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      setLastUpdated(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 0);
    return () => clearTimeout(handle);
  }, [nodes]);

  React.useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
    }
  }, [nodes.length, fitView]);

  const selectedNodeId = nodes.find(n => n.selected)?.id || focusedNodeId;

  const getDocAccent = (docName: string, allDocs: ProcessedDocument[]) => {
    const index = allDocs.findIndex(d => d.name === docName);
    const colors = [
      "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]",
      "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      "border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.4)]",
      "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
    ];
    return index >= 0 ? colors[index % colors.length] : "";
  };

  // AFTER:
  const processedNodes = useMemo(() => nodes.filter(n => n?.data?.label).map(node => {
    const isSearchMatch = searchQuery.trim() !== '' && node.data.label.toLowerCase().includes(searchQuery.toLowerCase());
    const isDimmedBySearch = searchQuery.trim() !== '' && !isSearchMatch;

    const isSelected = node.id === selectedNodeId;

    const isRelated = selectedNodeId && edges.some(e =>
      (e.source === selectedNodeId && e.target === node.id) ||
      (e.target === selectedNodeId && e.source === node.id)
    );
    const isDimmedBySelection = selectedNodeId && node.id !== selectedNodeId && !isRelated;

    const docSources = node.data.documentSources || [];
    const docAccentClass = docSources.length > 0 ? getDocAccent(docSources[0], documents) : "";

    return {
      ...node,
      data: { ...node.data, hideLabel: !labelsVisible },
      className: cn(
        node.className,
        (isSearchMatch || isSelected) ? "ring-2 ring-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8)] scale-105" : docAccentClass,
        (isDimmedBySearch || isDimmedBySelection) ? "opacity-15 scale-90 grayscale blur-[1px]" : "opacity-100 scale-100"
      )
    };
  }), [nodes, selectedNodeId, edges, searchQuery, labelsVisible, documents]);

  const processedEdges = useMemo(() => edges.map(edge => ({
    ...edge,
    selected: Boolean(edge.selected || (selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId))),
    animated: true,
  })), [edges, selectedNodeId]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId || n.id === focusedNodeId);
  const connectedEdges = edges.filter(e => e.source === selectedNode?.id || e.target === selectedNode?.id);

  const applyAutoLayout = useCallback(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });

    nodes.forEach((n) => {
      dagreGraph.setNode(n.id, { width: 180, height: 70 });
    });
    edges.forEach((e) => {
      dagreGraph.setEdge(e.source, e.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((n) => {
      const nodeWithPosition = dagreGraph.node(n.id);
      return {
        ...n,
        position: {
          x: nodeWithPosition.x - 90,
          y: nodeWithPosition.y - 35,
        },
      };
    });

    setNodes(layoutedNodes);
    setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 50);
  }, [nodes, edges, setNodes, fitView]);

  return (
    <div className="w-full h-full flex flex-col bg-[#020512] relative group overflow-hidden font-sans">

      {/* Cybernetic Corner Brackets HUD */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500/40 pointer-events-none z-20"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500/40 pointer-events-none z-20"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500/40 pointer-events-none z-20"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500/40 pointer-events-none z-20"></div>

      {/* Top Stats HUD Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#03081a]/90 backdrop-blur-xl border-b border-blue-500/30 text-slate-300 text-xs font-mono tracking-widest z-20 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse"></span>
            <span className="font-bold text-white">NODES: {nodes.length}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
            <span className="font-bold text-white">EDGES: {edges.length}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Activity className="w-3.5 h-3.5" /> STREAMS: {documents.length}
          </div>
        </div>
        <div className="flex items-center gap-3 font-bold text-slate-400">
          <span>SYNC TIME: {lastUpdated || "--:--:--"}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400">DETERMINISTIC CLUSTER</span>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <ReactFlow
          nodes={processedNodes}
          edges={processedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_event: React.MouseEvent, node: any) => setFocusedNodeId(node.id)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          proOptions={proOptions}
          snapToGrid
          snapGrid={[20, 20]}
          selectionMode={SelectionMode.Partial}
          defaultEdgeOptions={{
            type: 'default',
            style: { stroke: '#06b6d4', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 15,
              height: 15,
              color: '#06b6d4',
            },
          }}
          className="transition-opacity duration-500"
          style={{ background: '#020512' }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={40}
            size={1}
            color="#08132e"
            className="opacity-80"
          />
          <MiniMap
            position={selectedNode ? "bottom-left" : "bottom-right"}
            className="!bg-[#050b1e]/90 backdrop-blur-2xl !border-blue-500/40 !rounded-2xl !shadow-2xl overflow-hidden p-2 border"
            nodeColor="#06b6d4"
            maskColor="rgba(2, 5, 18, 0.85)"
          />

          {/* Top-Left Search */}
          <Panel position="top-left" className="bg-[#050b1e]/90 backdrop-blur-2xl border border-blue-500/40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center px-4 py-3 z-50">
            <Search className="w-4 h-4 text-cyan-400 mr-3 animate-pulse" />
            <input
              type="text"
              placeholder="Search graph entity..."
              className="bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:outline-none w-64 font-mono font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Panel>

          {/* Top-Right Custom Controls */}
          <GraphTools onToggleLabels={() => setLabelsVisible(prev => !prev)} onExport={handleExport} onLayout={applyAutoLayout} />

          {/* Bottom-Left Legend HUD */}
          <Panel position="bottom-left" className="bg-[#050b1e]/90 backdrop-blur-2xl border border-blue-500/40 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-3 z-50">
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Entity Schema Map</span>
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>Person</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>Concept</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>Org</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>Tech</div>
            </div>
          </Panel>

        </ReactFlow>
      </div>

      {/* Elite Interaction Slide-in Panel */}
      {selectedNode && (
        <div className="absolute right-6 top-20 bottom-6 w-96 flex flex-col z-50 bg-[#060e26]/95 backdrop-blur-3xl border border-cyan-400/60 shadow-[0_30px_100px_rgba(0,0,0,0.95)] rounded-3xl p-7 text-white transition-all duration-300 ease-out overflow-hidden animate-slide-left">
          <div className="pb-5 border-b border-slate-800 flex justify-between items-start shrink-0 relative">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-300 mb-3 shadow">
                <span>✦</span> <span>{selectedNode.data.category}</span>
              </span>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow">{selectedNode.data.label}</h3>
            </div>
            <button onClick={() => {
              setFocusedNodeId(null);
              setNodes(nodes.map(n => ({ ...n, selected: false })));
            }} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 space-y-6">
            <div>
              <h4 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>Semantic Edges ({connectedEdges.length})</span>
              </h4>
              <div className="space-y-2.5">
                {connectedEdges.map(edge => {
                  const isSource = edge.source === selectedNode.id;
                  const connectedNodeId = isSource ? edge.target : edge.source;
                  const connectedNode = nodes.find(n => n.id === connectedNodeId);
                  return (
                    <div
                      key={edge.id}
                      onClick={() => {
                        if (connectedNodeId) {
                          setFocusedNodeId(connectedNodeId);
                          const updatedNodes = nodes.map(n => ({
                            ...n,
                            selected: n.id === connectedNodeId
                          }));
                          setNodes(updatedNodes);
                        }
                      }}
                      className="flex items-center gap-2.5 text-xs bg-[#040817]/90 p-3.5 rounded-2xl border border-blue-500/30 font-mono shadow-inner group hover:border-cyan-400 hover:bg-blue-500/10 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <span className="text-slate-500 shrink-0 font-bold">{isSource ? 'OUT' : 'IN'}:</span>
                      <span className="text-cyan-400 font-bold truncate bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{edge.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-white font-bold truncate group-hover:text-cyan-300 transition-colors">{connectedNode?.data.label || 'Unknown'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 shrink-0 space-y-3">
            <button
              onClick={() => {
                submitQuery(`Tell me everything about ${selectedNode.data.label}, including all its direct citations and underlying semantics.`);
              }}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Synthesize Entity Briefing</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export const GraphCanvas = () => (
  <ReactFlowProvider>
    <GraphCanvasContent />
  </ReactFlowProvider>
);
