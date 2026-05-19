"use client";
import React, { useState } from 'react';
import { FolderOpen, Upload, FileText, Search, Database, ArrowRight, Shield, Layers, Plus, ExternalLink, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState([
    { id: 1, title: 'Quantum_Superposition_Decoherence_2026.pdf', entities: 248, relationships: 412, date: 'May 18, 2026', status: 'Indexed' },
    { id: 2, title: 'Topological_Qubits_Fault_Tolerance.pdf', entities: 315, relationships: 640, date: 'May 16, 2026', status: 'Indexed' },
    { id: 3, title: 'Hybrid_GraphRAG_Vector_Synthesis_Axiom.pdf', entities: 520, relationships: 890, date: 'May 14, 2026', status: 'Indexed' },
    { id: 4, title: 'Enterprise_Knowledge_Graphs_Neo4j.pdf', entities: 405, relationships: 720, date: 'May 10, 2026', status: 'Indexed' },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<'idle' | 'chunking' | 'embedding' | 'syncing' | 'complete'>('idle');
  const [progressValue, setProgressValue] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      startPipeline(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startPipeline(file.name);
    }
  };

  const startPipeline = (fileName: string) => {
    setUploadingFile(fileName);
    setPipelineStep('chunking');
    setProgressValue(25);

    setTimeout(() => {
      setPipelineStep('embedding');
      setProgressValue(65);

      setTimeout(() => {
        setPipelineStep('syncing');
        setProgressValue(90);

        setTimeout(() => {
          setPipelineStep('complete');
          setProgressValue(100);

          setTimeout(() => {
            setDocuments(prev => [
              {
                id: Date.now(),
                title: fileName,
                entities: Math.floor(Math.random() * 300) + 150,
                relationships: Math.floor(Math.random() * 500) + 250,
                date: 'Just now',
                status: 'Indexed'
              },
              ...prev
            ]);
            setPipelineStep('idle');
            setUploadingFile(null);
          }, 1200);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="p-8 sm:p-12 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 mb-2 uppercase tracking-wider">
            <FolderOpen className="w-4 h-4 text-blue-500 animate-pulse" />
            <span>SECURE VAULT STORAGE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Document Vault</h1>
          <p className="text-slate-400 text-sm mt-1">Manage, index, and decompose research literature into Neo4j graph vectors.</p>
        </div>

        <button
          onClick={() => {
            const input = document.getElementById('vault-file-input');
            input?.click();
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] border border-blue-400/30 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Ingest New Literature</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#050a1c]/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-2">Total Literature</div>
          <div className="text-4xl font-black text-white">{documents.length} Indexed Documents</div>
        </div>
        <div className="bg-[#050a1c]/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-2">Extracted Entities</div>
          <div className="text-4xl font-black text-cyan-400">
            {documents.reduce((acc, doc) => acc + doc.entities, 0).toLocaleString()} Total
          </div>
        </div>
        <div className="bg-[#050a1c]/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-2">Vector Synthesis</div>
          <div className="text-4xl font-black text-purple-400">
            {documents.reduce((acc, doc) => acc + doc.relationships, 0).toLocaleString()} Triples
          </div>
        </div>
      </div>

      {/* Premium Drag-and-Drop Upload Zone */}
      <div className="mb-12">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-6 transition-all duration-300 bg-[#050a1c]/70 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] group ${
            isDragging ? 'border-blue-400 bg-blue-500/10 scale-[1.01] shadow-[0_0_40px_rgba(59,130,246,0.4)]' : 'border-blue-500/50 hover:border-blue-400 hover:bg-[#07102e]/80'
          }`}
        >
          <input
            id="vault-file-input"
            type="file"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept=".pdf,.txt,.docx"
            disabled={pipelineStep !== 'idle'}
          />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl font-black text-white tracking-tight">Drop your research PDF here, or click to browse</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Supports PDF, TXT, and DOCX literature up to 100MB. Files are automatically chunked, vectorized via Pinecone, and decomposed into Neo4j graph triples.
            </p>
          </div>
        </div>

        {/* Mock Processing Pipeline HUD */}
        {pipelineStep !== 'idle' && uploadingFile && (
          <div className="mt-8 bg-[#040817]/90 border border-blue-500/40 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(59,130,246,0.2)]">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 truncate">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)] shrink-0" />
                <span className="font-mono text-sm font-bold text-white uppercase tracking-wider truncate">Neural Pipeline Active: {uploadingFile}</span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400 shrink-0">{progressValue}%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 font-sans">
              {/* Step 1: Chunking PDF */}
              <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                pipelineStep === 'chunking' ? 'bg-blue-500/10 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse' :
                ['embedding', 'syncing', 'complete'].includes(pipelineStep) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#070e24] border-slate-800 text-slate-500'
              }`}>
                {['embedding', 'syncing', 'complete'].includes(pipelineStep) ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <Loader2 className={`w-6 h-6 text-blue-400 shrink-0 ${pipelineStep === 'chunking' ? 'animate-spin' : ''}`} />}
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">1. Chunking Literature</div>
                  <div className="text-xs text-slate-400 font-mono">Semantic Sectioning & OCR</div>
                </div>
              </div>

              {/* Step 2: Generating Vector Embeddings */}
              <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                pipelineStep === 'embedding' ? 'bg-purple-500/10 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse' :
                ['syncing', 'complete'].includes(pipelineStep) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#070e24] border-slate-800 text-slate-500'
              }`}>
                {['syncing', 'complete'].includes(pipelineStep) ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <Loader2 className={`w-6 h-6 text-purple-400 shrink-0 ${pipelineStep === 'embedding' ? 'animate-spin' : ''}`} />}
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">2. Generating Embeddings</div>
                  <div className="text-xs text-slate-400 font-mono">Pinecone us-east-1 Synthesis</div>
                </div>
              </div>

              {/* Step 3: Syncing to Neo4j */}
              <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                pipelineStep === 'syncing' ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse' :
                pipelineStep === 'complete' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#070e24] border-slate-800 text-slate-500'
              }`}>
                {pipelineStep === 'complete' ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> : <Loader2 className={`w-6 h-6 text-cyan-400 shrink-0 ${pipelineStep === 'syncing' ? 'animate-spin' : ''}`} />}
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">3. Syncing to Neo4j</div>
                  <div className="text-xs text-slate-400 font-mono">Knowledge Graph Triples</div>
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="h-3 w-full bg-[#070e24] rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Document Table */}
      <div className="bg-[#040817]/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            <span>Active Knowledge Corpus</span>
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search literature..."
              className="w-full bg-[#070e24] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4">Document Title</th>
                <th className="py-4 px-4">Extracted Entities</th>
                <th className="py-4 px-4">Relationships</th>
                <th className="py-4 px-4">Ingestion Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-sm">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate max-w-xs md:max-w-md">{doc.title}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-cyan-400 font-bold">{doc.entities}</td>
                  <td className="py-4 px-4 font-mono text-purple-400 font-bold">{doc.relationships}</td>
                  <td className="py-4 px-4 font-mono text-slate-400 text-xs">{doc.date}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors border border-transparent hover:border-blue-500/30" title="Inspect Graph">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}
                        className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
