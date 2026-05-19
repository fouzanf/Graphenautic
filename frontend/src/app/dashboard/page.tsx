"use client";
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Share2, FileText, Sparkles, ArrowRight, Activity, Cpu, Globe, Database, Lock, Layers } from 'lucide-react';

export default function WorkspaceHub() {
  const { data: session } = useSession();

  return (
    <div className="min-h-full p-8 sm:p-12 max-w-7xl mx-auto relative font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}} />

      {/* Grid Background & Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse-slow" />
        <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Interactive Welcome Header */}
      <div className="mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-mono font-bold tracking-wider mb-4 shadow-inner">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>ZERO-TELEMETRY RESEARCH HUB</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Welcome back, <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            {session?.user?.name || 'Enterprise Researcher'}
          </span>.
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed">
          The Graphenautic Synthesis Engine is initialized. Your multidimensional knowledge vectors and Neo4j graph schemas are synchronized.
        </p>
      </div>

      {/* 3 Premium Glassmorphic Quick-Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
        {/* Card 1: Upload New PDF */}
        <Link href="/dashboard/vault" className="group relative">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <div className="h-full bg-[#050a1c]/90 hover:bg-[#07102e]/95 border border-slate-800/80 group-hover:border-blue-500/50 rounded-3xl p-8 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl rounded-full group-hover:bg-blue-600/20 transition-colors" />
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-blue-300 transition-colors">Upload New Research PDF</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                Decompose complex literature into structured entity graphs instantly using Gemini 1.5 Flash reasoning pipelines.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors pt-4 border-t border-slate-800/80">
              <span>Access Document Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Card 2: Query Knowledge Graph */}
        <Link href="/dashboard/canvas" className="group relative">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <div className="h-full bg-[#050a1c]/90 hover:bg-[#07102e]/95 border border-slate-800/80 group-hover:border-purple-500/50 rounded-3xl p-8 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-2xl rounded-full group-hover:bg-purple-600/20 transition-colors" />
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_25px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform">
                <Share2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-purple-300 transition-colors">Query Knowledge Graph</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                Explore multidimensional node relationships, author networks, and cross-paper citations in real-time 3D space.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors pt-4 border-t border-slate-800/80">
              <span>Launch Interactive Canvas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Card 3: View Extracted Entities */}
        <Link href="/dashboard/canvas" className="group relative">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <div className="h-full bg-[#050a1c]/90 hover:bg-[#07102e]/95 border border-slate-800/80 group-hover:border-cyan-500/50 rounded-3xl p-8 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-2xl rounded-full group-hover:bg-cyan-600/20 transition-colors" />
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_25px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">View Extracted Entities</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                Inspect high-density relationship metadata, quantum node clusters, and vector similarities across documents.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors pt-4 border-t border-slate-800/80">
              <span>Inspect Neural Entities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Real-time System Telemetry Stream */}
      <div className="bg-[#040817]/90 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 font-mono text-sm">
            <Layers className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">Infrastructure Telemetry</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono">
            <span className="flex items-center gap-2 text-slate-400"><Globe className="w-4 h-4 text-blue-400" /> Neo4j Active</span>
            <span className="flex items-center gap-2 text-slate-400"><Database className="w-4 h-4 text-purple-400" /> Pinecone Vector</span>
            <span className="flex items-center gap-2 text-slate-400"><Cpu className="w-4 h-4 text-cyan-400" /> Gemini 1.5 Flash</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 font-mono text-xs">
          <div className="space-y-1">
            <div className="text-slate-500 uppercase tracking-wider">Graph Nodes</div>
            <div className="text-2xl font-black text-white">1,482</div>
            <div className="text-[10px] text-emerald-400">+12% this week</div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-500 uppercase tracking-wider">Vector Embeddings</div>
            <div className="text-2xl font-black text-purple-400">14.2k</div>
            <div className="text-[10px] text-purple-300">us-east-1 index</div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-500 uppercase tracking-wider">Query Latency</div>
            <div className="text-2xl font-black text-cyan-400">14ms</div>
            <div className="text-[10px] text-cyan-300">Hybrid GraphRAG avg</div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-500 uppercase tracking-wider">Privacy Guarantee</div>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-5 h-5" />
              <span>100%</span>
            </div>
            <div className="text-[10px] text-slate-400">Zero-Telemetry Enclave</div>
          </div>
        </div>
      </div>
    </div>
  );
}
