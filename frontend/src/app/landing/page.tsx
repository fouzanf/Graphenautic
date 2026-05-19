import React from 'react';
import Link from 'next/link';
import { Network, Search, Zap, FileText, Share2, Layers, MessageSquare, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30 pt-24">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .perspective-container {
          perspective: 1200px;
        }
        .card-3d {
          transform: rotateX(15deg) rotateY(-10deg) rotateZ(5deg);
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        .card-3d:hover {
          transform: rotateX(5deg) rotateY(-5deg) rotateZ(2deg) translateY(-10px);
        }
      `}} />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[150px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg text-white tracking-tight">Graphenautic</span>
          </div>
          <Link href="/login">
            <button className="text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Knowledge Has a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">New Shape</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Graphenautic transforms your documents into living knowledge graphs. Ask anything. Discover everything. Uncover the hidden relationships in your research.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                Launch Graphenautic <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-semibold text-lg backdrop-blur transition-all flex items-center justify-center">
              See How It Works
            </a>
          </div>
        </div>

        {/* 3D Mockup */}
        <div className="mt-20 w-full max-w-5xl mx-auto perspective-container z-10 px-4">
          <div className="card-3d relative w-full aspect-[16/9] bg-[#0A0F1E] border border-white/10 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Fake Dashboard Header */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-[#111827] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="ml-4 h-6 w-64 bg-white/5 rounded-md"></div>
            </div>
            {/* Fake Graph */}
            <div className="absolute inset-0 top-12 p-8">
              <svg className="w-full h-full opacity-30" viewBox="0 0 800 400">
                <circle cx="400" cy="200" r="8" fill="#60A5FA" />
                <circle cx="250" cy="120" r="6" fill="#A78BFA" />
                <circle cx="550" cy="280" r="6" fill="#34D399" />
                <circle cx="600" cy="100" r="5" fill="#F472B6" />
                <circle cx="200" cy="300" r="5" fill="#60A5FA" />
                <line x1="400" y1="200" x2="250" y2="120" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
                <line x1="400" y1="200" x2="550" y2="280" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
                <line x1="400" y1="200" x2="600" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
                <line x1="400" y1="200" x2="200" y2="300" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
                <line x1="250" y1="120" x2="200" y2="300" stroke="#475569" strokeWidth="1" strokeDasharray="4" />
                <line x1="550" y1="280" x2="600" y2="100" stroke="#475569" strokeWidth="1" strokeDasharray="4" />
              </svg>
              {/* Floating Panels */}
              <div className="absolute left-6 top-6 w-48 h-64 bg-white/5 border border-white/10 rounded-lg backdrop-blur"></div>
              <div className="absolute right-6 top-6 w-64 h-80 bg-white/5 border border-white/10 rounded-lg backdrop-blur"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-4">
              <h4 className="text-4xl font-black text-blue-500 mb-2">51+</h4>
              <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Entities Extracted</p>
            </div>
            <div className="py-4">
              <h4 className="text-4xl font-black text-cyan-400 mb-2">2</h4>
              <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Papers Analyzed</p>
            </div>
            <div className="py-4">
              <h4 className="text-4xl font-black text-purple-500 mb-2">100%</h4>
              <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Local Graph</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for Deep Research</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Stop reading flat text. Start exploring multidimensional knowledge networks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Visual Knowledge Graphs</h3>
            <p className="text-slate-400 leading-relaxed">
              See how your documents connect at the entity level. Automatically extract people, concepts, and technologies into an interactive canvas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Hybrid RAG Retrieval</h3>
            <p className="text-slate-400 leading-relaxed">
              Combines semantic vector search with graph traversal for precise answers. Discover insights that keyword search alone would miss.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Powered by Gemini</h3>
            <p className="text-slate-400 leading-relaxed">
              State-of-the-art LLM extracts and reasons over your document network, providing high-quality synthesis of your complex data.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-[#080B14] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From PDF to Intelligence in Seconds</h2>
          </div>

          <div className="relative flex flex-col md:flex-row items-start justify-between max-w-5xl mx-auto gap-8 md:gap-4">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-white/10 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1624] border border-white/10 flex items-center justify-center mb-4 shadow-lg text-slate-400">
                <FileText className="w-7 h-7" />
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-xs font-bold">1</div>
              <h4 className="text-lg font-bold text-white mb-2">Upload PDF</h4>
              <p className="text-sm text-slate-500">Drag and drop your research papers or textbooks.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1624] border border-white/10 flex items-center justify-center mb-4 shadow-lg text-slate-400">
                <Layers className="w-7 h-7" />
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-xs font-bold">2</div>
              <h4 className="text-lg font-bold text-white mb-2">AI Extracts Entities</h4>
              <p className="text-sm text-slate-500">Gemini parses text and identifies concepts.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4 group">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/30 border border-blue-500/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-blue-400 transition-all group-hover:scale-110">
                <Share2 className="w-7 h-7" />
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">3</div>
              <h4 className="text-lg font-bold text-white mb-2">Graph is Built</h4>
              <p className="text-sm text-slate-400">Relationships are mapped in a 2D interactive canvas.</p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1624] border border-white/10 flex items-center justify-center mb-4 shadow-lg text-slate-400">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-xs font-bold">4</div>
              <h4 className="text-lg font-bold text-white mb-2">Ask Anything</h4>
              <p className="text-sm text-slate-500">Chat with your data using Hybrid GraphRAG.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-[#050810] text-center">
        <p className="text-slate-500 text-sm">
          Graphenautic &mdash; Intelligent Research Architecture
        </p>
        <div className="mt-4">
          <Link href="/login" className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
            Access Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
