import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dagre from 'dagre';
import {
  FileUp,
  Files,
  Database,
  Loader2,
  CheckCircle2,
  FileText,
  Search,
  Sparkles
} from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RawGraphNode {
  id: string;
  label?: string;
  type?: string;
  documentSources?: string[];
}

interface RawGraphEdge {
  id?: string;
  source: string;
  target: string;
  relation?: string;
}

export const LeftPanel = () => {
  const { data: session } = useSession();
  const { documents, addDocument, toggleDocumentSelection, setNodes, setEdges, nodes, setFocusedNodeId, activeSessionId } = useGraphStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [entitySearchQuery, setEntitySearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Group entities
  const groupedEntities = useMemo(() => {
    const groups: Record<string, typeof nodes> = {};
    const filteredNodes = nodes.filter(n => n.data.label.toLowerCase().includes(entitySearchQuery.toLowerCase()));

    filteredNodes.forEach(node => {
      const cat = node.data.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(node);
    });
    return groups;
  }, [nodes, entitySearchQuery]);

  const handleEntityClick = (id: string) => {
    setFocusedNodeId(id);

    // Select the node visually
    const updatedNodes = nodes.map(n => ({
      ...n,
      selected: n.id === id
    }));
    setNodes(updatedNodes);
  };

  const handleClearSelection = () => {
    setFocusedNodeId(null);
    setNodes(nodes.map(n => ({ ...n, selected: false })));
  };

  const handleCompareMode = () => {
    useGraphStore.getState().submitQuery("Compare and contrast the key findings, entities, and themes across all uploaded documents.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const updateGraphVisuals = useCallback(async (docIds: string[]) => {
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (docIds.length > 0) {
        queryParams.append("document_ids", docIds.join(","));
      }
      if (activeSessionId) {
        queryParams.append("session_id", activeSessionId);
      }
      const url = `http://127.0.0.1:8000/graph?${queryParams.toString()}`;
      const graphRes = await fetch(url);
      if (graphRes.ok) {
        const graphData = await graphRes.json();

        // 1. Deduplicate Nodes
        const uniqueNodesMap = new Map();
        const originalToMergedId = new Map();
        const docMap = new Map(useGraphStore.getState().documents.map(d => [d.id, d.name]));

        (graphData.nodes || []).forEach((n: RawGraphNode & { document_id?: string }) => {
          const labelLower = (n.label || '').trim().toLowerCase();
          const docName = n.document_id ? (docMap.get(n.document_id) || 'Uploaded File') : 'Pre-loaded';
          if (!uniqueNodesMap.has(labelLower)) {
            n.documentSources = [docName];
            uniqueNodesMap.set(labelLower, n);
          } else {
            const existing = uniqueNodesMap.get(labelLower);
            if (!existing.documentSources.includes(docName)) {
              existing.documentSources.push(docName);
            }
          }
          originalToMergedId.set(n.id, uniqueNodesMap.get(labelLower).id);
        });

        const uniqueNodesArray = Array.from(uniqueNodesMap.values()).slice(0, 80);

        // 2. Initialize Dagre
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 120 });

        uniqueNodesArray.forEach((n: RawGraphNode) => {
          dagreGraph.setNode(n.id, { width: 160, height: 60 });
        });

        const mappedEdges = (graphData.edges || []).map((e: RawGraphEdge) => ({
          ...e,
          source: originalToMergedId.get(e.source) || e.source,
          target: originalToMergedId.get(e.target) || e.target,
        })).filter((e: RawGraphEdge) => e.source !== e.target);

        const cappedEdges = mappedEdges.slice(0, 150);

        cappedEdges.forEach((e: RawGraphEdge) => {
          dagreGraph.setEdge(e.source, e.target);
        });

        dagre.layout(dagreGraph);

        const formattedNodes = uniqueNodesArray.map((n: RawGraphNode) => {
          const nodeWithPosition = dagreGraph.node(n.id);
          return {
            id: n.id,
            type: 'entityNode',
            position: {
              x: nodeWithPosition.x - 80,
              y: nodeWithPosition.y - 30
            },
            data: {
              label: n.label || '',
              category: (['Person', 'Concept', 'Organization', 'Location', 'Technology', 'Event'].includes(n.type || '') ? n.type : 'Other') as any,
              documentSources: n.documentSources || []
            }
          };
        });

        const formattedEdges = cappedEdges.map((e: RawGraphEdge, i: number) => ({
          id: `e-${e.source}-${e.target}-${i}`,
          source: e.source,
          target: e.target,
          label: e.relation,
          animated: true
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      } else {
        setError('Backend server unreachable. Please check connection.');
      }
    } catch (err) {
      console.error("Failed to fetch fresh graph:", err);
      setError('Backend server unreachable. Please check connection.');
    }
  }, [setNodes, setEdges, activeSessionId]);

  const selectedDocIds = useMemo(() => {
    return documents.filter(d => d.selected !== false).map(d => d.id);
  }, [documents]);

  useEffect(() => {
    updateGraphVisuals(selectedDocIds);
  }, [selectedDocIds, updateGraphVisuals]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (activeSessionId) {
      formData.append("session_id", activeSessionId);
    }
    
    // Explicitly set user_id with fallback to guest_user
    const userId = session?.user?.email || session?.user?.name || "guest_user";
    formData.append("user_id", userId);

    try {
      console.log("Starting upload to http://127.0.0.1:8000/upload...");
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (response.ok) {
        const newDoc = {
          id: data.document_id,
          name: selectedFile.name,
          size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
          status: 'completed' as const,
          uploadedAt: Date.now(),
        };
        addDocument(newDoc);
        setSelectedFile(null);
      } else {
        console.error("Upload failed:", data.detail);
      }
    } catch (error) {
      console.error("Network error during upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-transparent border-r border-slate-800/80 relative text-slate-100 overflow-hidden font-sans">
      
      {/* Uploading Progress Top Bar */}
      {isUploading && (
        <div className="h-1 w-full bg-slate-900 absolute top-0 left-0 z-50 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '70%' }} />
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* Vault Header Bar */}
      <div className="p-6 space-y-6 shrink-0 w-full">
        <div className="flex items-center justify-between border-l-[3px] border-blue-500 pl-3.5 py-0.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-black text-xs tracking-wider uppercase text-slate-200">Knowledge Vault</h2>
              <span className="text-[10px] text-slate-500 font-mono">Dense Vector Storage</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-400">{documents.length} Streams</span>
        </div>

        {/* Dropzone Container */}
        <div className="relative group w-full">
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            disabled={isUploading}
            accept=".pdf,.txt"
          />
          <div className={cn(
            "border border-dashed border-slate-700/80 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 bg-[#060c22]/80 backdrop-blur-2xl shadow-[inset_0_0_25px_rgba(59,130,246,0.05)] w-full",
            "group-hover:border-blue-500 group-hover:bg-[#0a1438]/90 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
            (isUploading || selectedFile) && "border-blue-500 bg-blue-500/10 shadow-[0_0_35px_rgba(59,130,246,0.4)]"
          )}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              {selectedFile ? (
                <FileText className="w-6 h-6 text-blue-400 animate-pulse" />
              ) : (
                <FileUp className="w-6 h-6 text-cyan-400" />
              )}
            </div>

            <div className="text-center space-y-2 w-full px-2 flex flex-col items-center min-w-0">
              <div className="max-w-full flex">
                <p className="text-sm font-bold text-slate-100 block truncate">
                  {selectedFile ? selectedFile.name : "Ingest Document Stream"}
                </p>
              </div>

              {isUploading ? (
                <div className="w-full space-y-2 mt-2">
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '65%' }} />
                  </div>
                  <p className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase animate-pulse">Decomposing & Indexing Entities...</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 shrink-0 font-mono">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB Ready for Graph` : "PDF / TXT up to 50MB"}
                </p>
              )}
            </div>
          </div>
        </div>

        {selectedFile && (
          <Button
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm py-6 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2.5 group hover:scale-102"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-cyan-200" />
                <span>Synthesizing Graph Schema...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>Decompose & Extract Entities</span>
              </>
            )}
          </Button>
        )}
      </div>

      <div className="px-6 w-full">
        <Separator className="bg-slate-800/80 w-full" />
      </div>

      <Tabs defaultValue="documents" className="flex-1 flex flex-col min-h-0 pt-6 w-full overflow-hidden">
        <div className="px-6 pb-4 shrink-0 w-full">
          <TabsList className="!grid w-full grid-cols-2 !h-12 bg-[#050b1e]/90 p-1.5 border border-blue-500/30 rounded-xl shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
            <TabsTrigger value="documents" className="text-xs font-bold text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-lg !py-0 !h-full flex items-center justify-center transition-all">
              Corpus Streams
            </TabsTrigger>
            <TabsTrigger value="entities" className="text-xs font-bold text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-lg !py-0 !h-full flex items-center justify-center transition-all">
              Entity Vault ({nodes.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documents" className="flex-1 m-0 min-h-0 flex flex-col overflow-hidden w-full">
          <ScrollArea className="flex-1 px-6 pb-6 w-full h-full pr-4">
            <div className="space-y-4 pt-1 w-full">
              {documents.length >= 2 && (
                <Button
                  onClick={handleCompareMode}
                  className="w-full bg-gradient-to-r from-[#06102b] to-[#0a1a44] hover:from-[#0a183d] hover:to-[#0f255c] text-cyan-300 border border-cyan-500/40 py-6 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] rounded-2xl flex items-center justify-center gap-3 font-bold text-sm group"
                >
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span>Execute Corpus Cross-Analysis</span>
                </Button>
              )}

              {documents.length === 0 ? (
                <div className="text-center py-24 opacity-60 w-full">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600 shadow-inner">
                    <Files className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Streams Ingested</p>
                  <p className="text-[11px] text-slate-600 mt-1">Upload files above to construct 3D knowledge map</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <Card 
                    key={doc.id} 
                    onClick={() => toggleDocumentSelection(doc.id)}
                    className={cn(
                      "p-4 bg-[#050b1e]/80 backdrop-blur-xl border border-slate-800/80 border-l-[4px] transition-all duration-300 group shadow-[0_10px_20px_rgba(0,0,0,0.5)] rounded-2xl cursor-pointer w-full",
                      doc.selected !== false 
                        ? "border-l-blue-500 hover:border-blue-500/60 hover:bg-[#0a1538]/90" 
                        : "border-l-slate-600 opacity-50 hover:opacity-75 hover:bg-[#0a1538]/40"
                    )}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-100 truncate w-full group-hover:text-cyan-300 transition-colors" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">100% Vectorized</span>
                          <span className="text-[10px] text-slate-500 font-mono">· {doc.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {doc.status === 'processing' ? (
                          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                        ) : (
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center shadow-md border",
                            doc.selected !== false
                              ? "bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                              : "bg-slate-500/10 border-slate-500/20"
                          )}>
                            {doc.selected !== false ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="entities" className="flex-1 m-0 min-h-0 flex flex-col overflow-hidden w-full">
          <div className="px-6 pb-4 space-y-4 shrink-0 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-cyan-400" />
              <Input
                placeholder="Filter entity matrix..."
                value={entitySearchQuery}
                onChange={(e) => setEntitySearchQuery(e.target.value)}
                className="pl-10 h-10 bg-[#060c22] border-blue-500/30 text-xs text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] font-mono w-full"
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Click entity to isolate sub-graph</span>
              <button
                onClick={handleClearSelection}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest font-black bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30 shrink-0 ml-2"
              >
                Reset Filter
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-6 pb-6 w-full h-full pr-4">
            <div className="space-y-6 pt-2 w-full">
              {Object.keys(groupedEntities).length === 0 ? (
                <div className="text-center py-16 opacity-60 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-600">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Entities Discovered</p>
                </div>
              ) : (
                Object.entries(groupedEntities).map(([category, catNodes]) => (
                  <div key={category} className="space-y-3 w-full">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 w-full">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{category}</p>
                      <span className="text-[10px] font-mono font-bold bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-md shadow-inner">{catNodes.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full">
                      {catNodes.map(node => {
                        let dotColor = "bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.8)]";
                        let borderStyle = "border-gray-500/30 hover:border-gray-400";
                        if (category === 'Person') { dotColor = "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"; borderStyle = "border-blue-500/40 hover:border-blue-400"; }
                        if (category === 'Concept') { dotColor = "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"; borderStyle = "border-purple-500/40 hover:border-purple-400"; }
                        if (category === 'Organization') { dotColor = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"; borderStyle = "border-emerald-500/40 hover:border-emerald-400"; }
                        if (category === 'Technology') { dotColor = "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"; borderStyle = "border-cyan-500/40 hover:border-cyan-400"; }

                        return (
                          <Badge
                            key={node.id}
                            onClick={() => handleEntityClick(node.id)}
                            variant="secondary"
                            className={cn(
                              "bg-[#050c21]/90 hover:bg-[#0a163a] text-slate-200 text-xs py-2 px-3.5 rounded-xl font-bold transition-all shadow-md cursor-pointer flex items-center gap-2.5 border backdrop-blur-xl group shrink-0",
                              borderStyle,
                              node.selected ? "ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] bg-[#0d1e4d]" : ""
                            )}
                          >
                            <div className={cn("w-2 h-2 rounded-full group-hover:scale-125 transition-transform", dotColor)} />
                            <span>{node.data.label}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
