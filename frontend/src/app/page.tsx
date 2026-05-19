"use client";
import React from 'react';
import Link from 'next/link';
import { Network, Search, ArrowRight, Sparkles, Shield, Cpu, Layers, CheckCircle2, ChevronRight, Command, Terminal, Database, Lock, Globe, Activity, Box } from 'lucide-react';

const useInView = (threshold = 0.1) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref as React.RefObject<HTMLElement | null>, inView] as const;
};

const useCounter = (target: number, duration: number, inView: boolean, suffix = '') => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count + suffix;
};

export default function LandingPage() {
  const [scrollY, setScrollY] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(0);
  const [heroMouse, setHeroMouse] = React.useState({ normX: 0, normY: 0 });

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navScrolled = scrollY > 50;

  // Hero section mouse parallax
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroMouse({ normX, normY });
  };
  const handleHeroMouseLeave = () => {
    setHeroMouse({ normX: 0, normY: 0 });
  };

  const scrollTiltX = Math.max(0, 8 - scrollY * 0.02);
  const [tilt, setTilt] = React.useState({ x: 8, y: 0 });
  const [isPressed, setIsPressed] = React.useState(false);
  const mockupRef = React.useRef<HTMLDivElement>(null);

  const handleMockupMouseMove = (e: React.MouseEvent) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -6 + 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMockupMouseLeave = () => {
    setTilt({ x: scrollTiltX, y: 0 });
  };

  const handleMockupMouseDown = (e: React.MouseEvent) => {
    setIsPressed(true);
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setTilt({ x: 14, y: clickX < rect.width / 2 ? -18 : 18 });
    setTimeout(() => {
      setIsPressed(false);
      setTilt({ x: scrollTiltX, y: 0 });
    }, 600);
  };

  React.useEffect(() => {
    if (!mockupRef.current?.matches(':hover')) {
      setTilt({ x: scrollTiltX, y: 0 });
    }
  }, [scrollTiltX]);

  const [featuresRef, featuresInView] = useInView(0.15);
  const [bentoRef, bentoInView] = useInView(0.15);
  const [stepsRef, stepsInView] = useInView(0.2);
  const [statsRef, statsInView] = useInView(0.3);
  const [ctaRef, ctaInView] = useInView(0.2);
  const [footerRef, footerInView] = useInView(0.1);

  const stat1 = useCounter(50, 1500, statsInView, '+');
  const stat2 = useCounter(10, 1200, statsInView, 'x');
  const stat3 = useCounter(99, 2000, statsInView, '%');

  // Advanced scroll calculations for full 3D feel
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  // Calculate scroll progress across 1.2x viewport height for smooth sticky transition
  const scrollProgress = Math.min(1, Math.max(0, scrollY / (heroHeight * 1.2)));

  // 3D perspective transition: starts tilted 28deg back with -8deg Y rotation and -120px depth, flattens to 0
  const mockupRotateX = 28 - scrollProgress * 28;
  const mockupRotateY = -8 + scrollProgress * 8;
  const mockupTranslateZ = -120 + scrollProgress * 120;
  const mockupScale = 0.85 + scrollProgress * 0.15;
  const mockupOpacity = 0.5 + scrollProgress * 0.5;

  // Flashlight hover spotlight for cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    e.currentTarget.style.transform = `perspective(1200px) rotateY(${normX * 14}deg) rotateX(${-normY * 14}deg) translateZ(20px)`;
  };
  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  const showcaseTabs = [
    {
      title: "Visual Knowledge Canvas",
      badge: "Neo4j 3D Graph Structure",
      desc: "Watch your documents instantly decompose into living entity networks. Click any node to traverse direct citations and underlying semantics.",
      codeSnippet: `MATCH (d:Document)-[:MENTIONS]->(e:Entity)\nWHERE d.summary CONTAINS 'Quantum'\nRETURN e.name, count(d) as degree\nORDER BY degree DESC`,
      metrics: [
        { label: "Entity Extraction Speed", val: "18ms", color: "text-blue-400" },
        { label: "Semantic Edges Created", val: "1,420+", color: "text-cyan-400" },
        { label: "Graph Traversal Latency", val: "4ms", color: "text-indigo-400" }
      ]
    },
    {
      title: "Hybrid Vector RAG 2.0",
      badge: "Pinecone + Dense Embeddings",
      desc: "Combining high-dimensional semantic search with exact entity sub-graph matching. Eliminate AI hallucinations with deterministic source grounding.",
      codeSnippet: `query_vector = get_embedding("Superconducting qubits")\npinecone.query(top_k=25, vector=query_vector)\nneo4j.execute("MATCH (e:Entity)...")`,
      metrics: [
        { label: "Vector Index Speed", val: "12ms", color: "text-blue-400" },
        { label: "Recall Rate", val: "99.4%", color: "text-purple-400" },
        { label: "Hallucination Reduction", val: "87%", color: "text-cyan-400" }
      ]
    },
    {
      title: "Gemini Synthesis Engine",
      badge: "Gemini 1.5 Flash 002 Engine",
      desc: "State-of-the-art context window reasons across thousands of pages and entity relationships simultaneously to synthesize flawless research briefings.",
      codeSnippet: `response = client.models.generate_content(\n  model='gemini-1.5-flash-002',\n  contents=['Synthesize graph context', retrieved_subgraph]\n)`,
      features: [
        "1M+ Token Context Window",
        "Deterministic JSON Extraction",
        "Multi-step Entity Disambiguation"
      ]
    }
  ];

  return (
    <main
      className="w-full min-h-screen font-sans text-slate-200 selection:bg-blue-500/30 bg-[#02040a] pt-24"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(29, 78, 216, 0.18), rgba(88, 28, 135, 0.12), rgba(2, 4, 10, 1))' }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-16px) rotate(1deg); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(16px) rotate(-1deg); } }
        @keyframes float-badge { 0%, 100% { transform: translateY(0px) translateZ(60px); } 50% { transform: translateY(-10px) translateZ(80px); } }
        @keyframes float-badge-right { 0%, 100% { transform: translateY(0px) translateZ(90px); } 50% { transform: translateY(-14px) translateZ(110px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.02); } }
        @keyframes laser-scan { 0% { top: -10%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes borderGlow { 0%, 100% { border-color: rgba(59,130,246,0.3); shadow: 0 0 15px rgba(59,130,246,0.2); } 50% { border-color: rgba(59,130,246,0.8); shadow: 0 0 35px rgba(59,130,246,0.5); } }
        @keyframes nodePulse { 0%,100%{r:22;opacity:1} 50%{r:25;opacity:0.85} }

        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotate-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes particle-float { 0%,100% { transform: translateY(0px) scale(1); opacity: 0.5; } 50% { transform: translateY(-40px) scale(1.3); opacity: 0.95; } }
        @keyframes revealLine { from { opacity: 0; transform: translateY(24px) skewY(1.5deg); filter: blur(6px); } to { opacity: 1; transform: translateY(0) skewY(0deg); filter: blur(0); } }
        @keyframes dash-flow { to { stroke-dashoffset: -30; } }
        @keyframes dash-flow-reverse { to { stroke-dashoffset: 30; } }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .animate-float-badge { animation: float-badge 6s ease-in-out infinite; }
        .animate-float-badge-right { animation: float-badge-right 7s ease-in-out infinite 1s; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-border-glow { animation: borderGlow 2.5s ease-in-out infinite; }
        .node-pulse { animation: nodePulse 2s ease-in-out infinite; }
        .animate-shimmer-text {
          background: linear-gradient(90deg, #ffffff, #93c5fd, #d8b4fe, #67e8f9, #ffffff);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear infinite;
        }
        .animate-rotate-slow { animation: rotate-slow 35s linear infinite; }
        .animate-rotate-reverse { animation: rotate-reverse 28s linear infinite; }
        .reveal-line { animation: revealLine 0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        
        /* 3D Glass Surface Style */
        .glass-3d-card {
          background: rgba(8, 14, 30, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .glass-bezel {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          border: 1px solid transparent;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 30%) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out; mask-composite: exclude;
        }
      `}} />

      {/* Top Announcement Pill (Linear/Apple Tier) */}
      <div className="relative z-50 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-cyan-900/20 border-b border-white/10 backdrop-blur-xl px-4 py-2.5 text-center text-xs font-semibold text-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5">
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-black px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.5)]">3D Canvas Live</span>
          <span className="text-white font-medium">Graphenautic v2.0 Enterprise Hybrid GraphRAG Framework is fully deployed.</span>
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline font-bold inline-flex items-center gap-1 transition-colors">
            Launch interactive graph <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300 ${navScrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-transparent h-24'
        }`}>
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 truncate min-w-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.6)] border border-blue-400/40 shrink-0">
            <span className="text-white italic text-lg sm:text-xl leading-none font-black">G</span>
          </div>
          <span className="font-extrabold text-lg sm:text-2xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight truncate">Graphenautic</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-8 shrink-0 ml-3 sm:ml-0">
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
            <button onClick={() => document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Architecture</button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Platform Layers</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Pipeline</button>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 shadow-inner">
              <Command className="w-3.5 h-3.5 text-blue-400" />
              <span>K</span>
            </div>
            <Link href="/login" className="shrink-0">
              <button className="relative group overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 shrink-0 whitespace-nowrap">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span>Launch Canvas</span> <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with True 3D Interactive Mouse Parallax */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="pt-16 sm:pt-24 pb-12 flex flex-col items-center justify-start relative px-4 sm:px-6 lg:px-12 overflow-hidden min-h-[150vh]"
        style={{ perspective: '1000px' }}
      >
        {/* Luminous atmospheric deep lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/20 to-cyan-600/15 blur-[160px] rounded-full -z-10 pointer-events-none" />

        {/* 3D Mouse Reactive Background Rings */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] -z-10 animate-rotate-slow pointer-events-none opacity-25 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(-50%, -50%, ${heroMouse.normY * -50}px) rotateX(${heroMouse.normY * 15}deg) rotateY(${heroMouse.normX * 15}deg)` }}
        >
          <div className="w-full h-full rounded-full border border-blue-500/30" style={{ boxShadow: 'inset 0 0 100px rgba(59,130,246,0.2)' }} />
        </div>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] -z-10 animate-rotate-reverse pointer-events-none opacity-20 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(-50%, -50%, ${heroMouse.normY * 50}px) rotateX(${-heroMouse.normY * 15}deg) rotateY(${-heroMouse.normX * 15}deg)` }}
        >
          <div className="w-full h-full rounded-full border border-purple-500/30" style={{ boxShadow: 'inset 0 0 80px rgba(168,85,247,0.2)' }} />
        </div>

        {/* Scanning laser line effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" style={{ animation: 'scan-line 8s ease-in-out infinite' }} />
        </div>

        {/* Premium Dot grid */}
        <div className="absolute inset-0 -z-10 opacity-[0.035] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.95) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* 3D Parallax Floating Particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/80 -z-10 pointer-events-none transition-transform duration-500 ease-out"
            style={{
              left: `${8 + (i * 6.5) % 85}%`,
              top: `${10 + (i * 8.5) % 80}%`,
              animation: `particle-float ${4 + (i % 5)}s ease-in-out infinite ${i * 0.3}s`,
              width: i % 4 === 0 ? '4px' : i % 2 === 0 ? '2px' : '1px',
              height: i % 4 === 0 ? '4px' : i % 2 === 0 ? '2px' : '1px',
              boxShadow: i % 4 === 0 ? '0 0 10px rgba(59,130,246,0.9)' : 'none',
              transform: `translate3d(${heroMouse.normX * (i % 2 === 0 ? 30 : -30)}px, ${heroMouse.normY * (i % 2 === 0 ? 30 : -30)}px, ${(i % 3) * 20}px)`
            }}
          />
        ))}

        <div
          className="w-full max-w-7xl mx-auto text-center md:text-left z-10 animate-slide-up mt-6 transition-transform duration-500 ease-out mb-16 px-4 sm:px-6 lg:px-8"
          style={{ transform: `translate3d(${heroMouse.normX * 10}px, ${heroMouse.normY * 10}px, 0)` }}
        >
          <div className="flex justify-center md:justify-start mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 text-blue-300 text-xs font-bold tracking-wider shadow-[0_0_30px_rgba(59,130,246,0.25)] backdrop-blur-xl animate-border-glow">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="uppercase tracking-widest font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-cyan-200">The Enterprise GraphRAG Architecture</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.08] mb-8 drop-shadow-2xl text-center md:text-left" style={{ letterSpacing: '-0.04em' }}>
            <span className="block text-white reveal-line" style={{ animationDelay: '0.1s' }}>Where Documents</span>
            <span className="block text-white reveal-line" style={{ animationDelay: '0.25s' }}>Become Living</span>
            <span className="block animate-shimmer-text reveal-line pb-2" style={{ animationDelay: '0.4s' }}>Knowledge Networks.</span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl md:mx-0 mx-auto text-center md:text-left font-normal leading-relaxed mb-12 drop-shadow">
            Graphenautic decomposes complex PDFs into deterministic 3D entity graphs, powered by Neo4j, Pinecone vector indexing, and Google Gemini 1.5 Flash reasoning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5 mb-14 px-4">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-[length:200%_auto] hover:bg-[position:100%_0] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_75px_rgba(59,130,246,0.9)] border border-blue-400/40 transition-all duration-500 flex items-center justify-center gap-2.5 group">
                <span>Launch Graph Canvas</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 bg-[#080e1e]/80 hover:bg-[#0c162e]/90 text-slate-200 px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Explore Pipeline</span>
            </button>
          </div>

          {/* Enterprise Logo Strip */}
          <div className="pt-8 border-t border-white/10 max-w-4xl md:mx-0 mx-auto px-4">
            <p className="text-xs uppercase font-black tracking-widest text-slate-500 mb-6 text-center md:text-left">Engineered for deterministic AI retrieval across high-stakes data</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2.5 font-black tracking-tighter text-xl text-white"><Globe className="w-5 h-5 text-blue-500" /> NEO4J GRAPH</div>
              <div className="flex items-center gap-2.5 font-bold tracking-tight text-xl text-white"><Database className="w-5 h-5 text-purple-500" /> PINECONE VECTOR</div>
              <div className="flex items-center gap-2.5 font-extrabold tracking-widest text-xl text-white"><Cpu className="w-5 h-5 text-cyan-500" /> GEMINI 1.5 FLASH</div>
              <div className="flex items-center gap-2.5 font-mono tracking-tighter text-xl text-white"><Lock className="w-5 h-5 text-emerald-500" /> ZERO-TELEMETRY</div>
            </div>
          </div>
        </div>

        {/* Sticky 3D Dashboard Mockup with Extruded Floating HUD Badges */}
        <div className="sticky top-24 sm:top-28 w-full max-w-5xl mx-auto z-30 px-2 sm:px-4 mb-12">
          {/* Animated pulsing neon frame */}
          <div
            className="absolute -inset-[3px] rounded-3xl -z-10 opacity-80"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(168,85,247,0.6), rgba(6,182,212,0.8))',
              filter: 'blur(16px)',
              animation: 'pulse-glow 4s ease-in-out infinite',
            }}
          />
          {/* Deep floor reflection */}
          <div
            className="absolute -bottom-14 left-10 right-10 h-20 rounded-full -z-20 opacity-50"
            style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.6) 0%, transparent 75%)', filter: 'blur(20px)' }}
          />

          <div
            style={{
              perspective: '1600px',
              opacity: mockupOpacity,
            }}
          >
            <div
              ref={mockupRef}
              onMouseMove={handleMockupMouseMove}
              onMouseLeave={handleMockupMouseLeave}
              onMouseDown={handleMockupMouseDown}
              className="w-full bg-[#030714] border border-slate-700/80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-[0_40px_100px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative transition-all duration-300"
              style={{
                transform: `rotateX(${mockupRotateX + tilt.x * (1 - scrollProgress)}deg) rotateY(${mockupRotateY + tilt.y}deg) translateZ(${mockupTranslateZ}px) scale(${mockupScale})`,
                boxShadow: `0 ${30 + scrollProgress * 60}px ${120 + scrollProgress * 100}px rgba(0,0,0,0.95), 0 0 90px rgba(59,130,246,${0.2 + scrollProgress * 0.3}), inset 0 2px 0 rgba(255,255,255,0.18)`,
              }}
            >
              {/* Internal Bezel Reflection */}
              <div className="glass-bezel"></div>

              {/* 3D Extruded Floating Badge Left */}
              <div className="absolute -left-8 top-20 z-50 glass-3d-card rounded-2xl p-4 hidden lg:flex flex-col gap-2 shadow-2xl animate-float-badge pointer-events-none border border-blue-400/30">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Graph Density</span>
                </div>
                <div className="text-2xl font-mono font-black text-blue-400">99.8% Grounded</div>
                <div className="w-36 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="w-11/12 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>
              </div>

              {/* 3D Extruded Floating Badge Right */}
              <div className="absolute -right-8 bottom-24 z-50 glass-3d-card rounded-2xl p-4 hidden lg:flex flex-col gap-2 shadow-2xl animate-float-badge-right pointer-events-none border border-purple-400/30">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Pinecone Vector</span>
                </div>
                <div className="text-xl font-mono font-black text-purple-400">1536-Dimension</div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Zero Hallucination Pipeline</span>
                </div>
              </div>

              {/* Laser Scanner light passing over the screen */}
              <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] z-40 pointer-events-none animate-laser-scan" style={{ animationDuration: '6s' }}></div>

              {/* Mockup Title Bar */}
              <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 bg-[#02050f] border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] transition-colors"></div>
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] transition-colors"></div>
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-colors"></div>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-500 ml-2 sm:ml-4 truncate max-w-[160px] sm:max-w-none">graphenautic_hybrid_graph_rag_engine v2.0 // Active Canvas</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest shadow-inner">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-ping"></span>
                    <span className="hidden sm:inline">Graph Synchronized</span>
                    <span className="inline sm:hidden">Synced</span>
                  </div>
                </div>
              </div>

              {/* Mockup Body */}
              <div className="flex h-[320px] sm:h-[400px] md:h-[450px] lg:h-[500px] pointer-events-none overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 border-r border-slate-800/80 bg-[#030612] p-5 flex flex-col gap-5 shrink-0 hidden lg:flex">
                  <div className="flex items-center gap-3.5 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30">
                      <Network className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate">Quantum_Paper.pdf</div>
                      <div className="text-[10px] text-slate-400">148 Nodes · 392 Edges</div>
                    </div>
                  </div>

                  <div className="w-full bg-[#050a1b]/80 border border-dashed border-blue-500/30 rounded-2xl p-4 flex flex-col justify-center gap-2 shadow-inner">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                      <span>Vector Grounding</span>
                      <span className="text-emerald-400 font-mono">100% Grounded</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-2">Discovered Clusters</div>
                  <div className="space-y-2.5 mt-1">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/25 rounded-2xl text-xs font-bold text-blue-300 shadow">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                        <span className="truncate">Superposition Mechanics</span>
                      </div>
                      <span className="bg-blue-500/20 px-2 py-0.5 rounded text-[10px] font-mono">64</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/25 rounded-2xl text-xs font-bold text-purple-300 shadow">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                        <span className="truncate">Error Correction Codes</span>
                      </div>
                      <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[10px] font-mono">38</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/25 rounded-2xl text-xs font-bold text-cyan-300 shadow">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                        <span className="truncate">Hardware Topologies</span>
                      </div>
                      <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono">46</span>
                    </div>
                  </div>
                </div>

                {/* Center Graph Canvas */}
                <div className="flex-1 relative bg-[#030614] overflow-hidden flex items-center justify-center min-w-0">
                  {/* Premium Grid lines */}
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '36px 36px' }}></div>
                  <svg className="w-full h-full max-w-full max-h-full p-2 sm:p-4" viewBox="0 0 600 300">
                    <defs>
                      <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                      </linearGradient>
                      <radialGradient id="centerNodeGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                      </radialGradient>
                      <filter id="superGlow">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Active Pulsing Edges */}
                    <line x1="300" y1="150" x2="150" y2="80" stroke="url(#lineGrad1)" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: 'dash-flow 2s linear infinite' }} filter="url(#superGlow)" />
                    <line x1="300" y1="150" x2="450" y2="80" stroke="url(#lineGrad2)" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: 'dash-flow-reverse 2.5s linear infinite' }} filter="url(#superGlow)" />
                    <line x1="300" y1="150" x2="170" y2="230" stroke="url(#lineGrad1)" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: 'dash-flow 2s linear infinite' }} filter="url(#superGlow)" />
                    <line x1="300" y1="150" x2="430" y2="220" stroke="url(#lineGrad2)" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: 'dash-flow 2s linear infinite' }} filter="url(#superGlow)" />

                    {/* Background Subtle Edges */}
                    <line x1="150" y1="80" x2="80" y2="160" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="450" y1="80" x2="520" y2="160" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="170" y1="230" x2="80" y2="160" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="430" y1="220" x2="520" y2="160" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />

                    {/* Center node */}
                    <circle cx="300" cy="150" r="25" fill="url(#centerNodeGrad)" stroke="#60a5fa" strokeWidth="3" className="node-pulse" filter="url(#superGlow)" />
                    <circle cx="300" cy="150" r="25" fill="none" stroke="#60a5fa" strokeWidth="10" strokeOpacity="0.2" />

                    {/* Outer nodes */}
                    <circle cx="150" cy="80" r="16" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2.5" filter="url(#superGlow)" />
                    <circle cx="450" cy="80" r="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" filter="url(#superGlow)" />
                    <circle cx="170" cy="230" r="15" fill="#0f172a" stroke="#3b82f6" strokeWidth="2.5" filter="url(#superGlow)" />
                    <circle cx="430" cy="220" r="15" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2.5" filter="url(#superGlow)" />

                    <circle cx="80" cy="160" r="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                    <circle cx="520" cy="160" r="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />

                    {/* Node labels */}
                    <text x="300" y="154" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Quantum Computing</text>
                    <text x="150" y="84" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="bold">Superposition</text>
                    <text x="450" y="84" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="bold">Qubit Scalability</text>
                    <text x="170" y="234" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">Entanglement</text>
                    <text x="430" y="224" textAnchor="middle" fill="#e879f9" fontSize="9" fontWeight="bold">Decoherence</text>
                  </svg>
                </div>

                {/* Right Chat Panel */}
                <div className="w-72 lg:w-80 border-l border-slate-800/80 bg-[#030612] p-5 flex flex-col gap-4 shrink-0 hidden md:flex">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Hybrid GraphRAG Copilot</span>
                  </div>

                  <div className="w-full bg-[#050a1a] border border-slate-700/80 rounded-2xl p-3.5 flex flex-col gap-2 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">U</div>
                      <span className="text-xs font-bold text-slate-200">How do superposition and decoherence correlate?</span>
                    </div>
                  </div>

                  <div className="w-full bg-gradient-to-b from-blue-950/40 via-[#070e24] to-[#040816] border border-blue-500/30 rounded-2xl p-4 flex flex-col gap-2.5 mt-1 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-blue-400 uppercase tracking-wider truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0"></span>
                        <span className="truncate">Graphenautic Synthesis Engine</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">14ms</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-3">
                      Based on entity linkage across 12 papers, decoherence acts as the primary bottleneck limiting scalable superposition states in multi-qubit gates...
                    </div>
                  </div>

                  <div className="w-full h-11 bg-[#050a1b] border border-slate-700 rounded-xl p-3 flex items-center justify-between mt-auto shadow-inner">
                    <span className="text-xs text-slate-500 font-mono truncate">Ask your research graph...</span>
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow shrink-0"><ArrowRight className="w-3.5 h-3.5 text-white" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Billion-Dollar Bento Grid Section with Flashlight Hover Spotlight */}
      <section id="bento-grid" ref={bentoRef} className="pt-16 pb-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/40 bg-purple-500/15 text-purple-300 text-xs font-bold tracking-widest mb-6 uppercase shadow-[0_0_30px_rgba(168,85,247,0.25)] backdrop-blur-xl animate-border-glow">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Unrivaled Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tight mb-8">Engineered for the AI Frontier</h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-xl font-normal leading-relaxed">
            Traditional keyword search misses critical nuance. Graphenautic extracts every concept, author, and citation into an immutable 3D graph architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: 2-col span */}
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="group md:col-span-2 bg-[#060b1c]/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-10 hover:border-blue-500/60 hover:bg-[#0a122c]/90 transition-all duration-500 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            style={{
              opacity: bentoInView ? 1 : 0,
              transform: bentoInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s'
            }}
          >
            {/* Flashlight Spotlight effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59,130,246,0.18), transparent 80%)` }} />

            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl group-hover:bg-blue-600/25 transition-all duration-500 -z-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <Network className="w-8 h-8" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">Visual Entity Mapping</h3>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl font-normal">
                Automatically extract entities (People, Organizations, Technologies, Theorems) and establish semantic edges. See exactly how your entire corpus connects across disparate research silos.
              </p>
            </div>
            <div className="mt-10 border-t border-slate-800 pt-6 flex items-center justify-between font-mono text-xs text-blue-400 relative z-10">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Deterministic Neo4j Schema</span>
              <span className="bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30 font-bold">100% Extracted</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="group bg-[#060b1c]/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-10 hover:border-purple-500/60 hover:bg-[#0a122c]/90 transition-all duration-500 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            style={{
              opacity: bentoInView ? 1 : 0,
              transform: bentoInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168,85,247,0.18), transparent 80%)` }} />

            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl group-hover:bg-purple-600/25 transition-all duration-500 -z-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Hybrid GraphRAG</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-normal">
                Combining Pinecone dense vector similarity with multi-hop Neo4j graph traversal for unparalleled recall accuracy.
              </p>
            </div>
            <div className="mt-10 border-t border-slate-800 pt-6 flex items-center justify-between font-mono text-xs text-purple-400 relative z-10">
              <span>Vector + Graph Retrieval</span>
              <span className="bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30 font-bold">Zero Hallucination</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="group bg-[#060b1c]/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-10 hover:border-cyan-500/60 hover:bg-[#0a122c]/90 transition-all duration-500 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            style={{
              opacity: bentoInView ? 1 : 0,
              transform: bentoInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6,182,212,0.18), transparent 80%)` }} />

            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl group-hover:bg-cyan-600/25 transition-all duration-500 -z-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Gemini 1.5 Flash</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-normal">
                Harnessing Google&apos;s most efficient multimodal reasoning model for lightning-fast entity extraction across massive textbook corpora.
              </p>
            </div>
            <div className="mt-10 border-t border-slate-800 pt-6 flex items-center justify-between font-mono text-xs text-cyan-400 relative z-10">
              <span>1M Token Context</span>
              <span className="bg-cyan-500/20 px-2 py-1 rounded border border-cyan-500/30 font-bold">Sub-Second Latency</span>
            </div>
          </div>

          {/* Card 4: 2-col span */}
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="group md:col-span-2 bg-[#060b1c]/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-10 hover:border-emerald-500/60 hover:bg-[#0a122c]/90 transition-all duration-500 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            style={{
              opacity: bentoInView ? 1 : 0,
              transform: bentoInView ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16,185,129,0.18), transparent 80%)` }} />

            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl group-hover:bg-emerald-600/25 transition-all duration-500 -z-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">Enterprise-Grade Privacy</h3>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl font-normal">
                Your research is proprietary. Graphenautic operates with strict zero-telemetry guarantees. Your vector embeddings and Neo4j databases run entirely within your controlled cloud or local environments.
              </p>
            </div>
            <div className="mt-10 border-t border-slate-800 pt-6 flex items-center justify-between font-mono text-xs text-emerald-400 relative z-10">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-500" /> End-to-End Encrypted Storage</span>
              <span className="bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30 font-bold">Zero Leakage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Interactive Showcase (Vercel Style) */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto relative z-10 border-t border-slate-800">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase block mb-4">Inside the Architecture</span>
          <h2 className="text-4xl sm:text-7xl font-black text-white mb-6 tracking-tight">Explore the Platform Layers</h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-xl font-normal leading-relaxed">
            Switch between our core infrastructure layers to inspect real-time query executions and underlying 3D graph representations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {showcaseTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-8 py-4 rounded-2xl font-black text-base transition-all duration-300 flex items-center gap-3 shadow-2xl ${activeTab === i
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border border-blue-400/40 shadow-[0_0_35px_rgba(59,130,246,0.6)] scale-105'
                : 'bg-[#060c20]/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-[#0a122c]'
                }`}
            >
              {i === 0 && <Network className="w-5 h-5 text-blue-400" />}
              {i === 1 && <Database className="w-5 h-5 text-purple-400" />}
              {i === 2 && <Cpu className="w-5 h-5 text-cyan-400" />}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="bg-[#050a1b]/95 backdrop-blur-3xl border border-slate-700/80 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.95)] grid grid-cols-1 md:grid-cols-2 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"></div>

          {/* Left Description Box */}
          <div className="p-8 sm:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-xs font-black text-blue-400 uppercase tracking-widest mb-8 shadow-inner">
                <span>{showcaseTabs[activeTab].badge}</span>
              </div>
              <h3 className="text-4xl font-black text-white mb-6 tracking-tight">{showcaseTabs[activeTab].title}</h3>
              <p className="text-slate-300 text-xl leading-relaxed mb-10 font-normal">{showcaseTabs[activeTab].desc}</p>

              {showcaseTabs[activeTab].metrics && (
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
                  {showcaseTabs[activeTab].metrics?.map((m, idx) => (
                    <div key={idx}>
                      <div className={`text-3xl sm:text-4xl font-black ${m.color} drop-shadow`}>{m.val}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {showcaseTabs[activeTab].features && (
                <div className="space-y-4 pt-8 border-t border-slate-800/80">
                  {showcaseTabs[activeTab].features?.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 text-base text-slate-200 font-bold">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-4 h-4" /></div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-14 flex items-center gap-4">
              <Link href="/login">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-black text-base shadow-[0_0_30px_rgba(59,130,246,0.6)] border border-blue-400/30 transition-all flex items-center gap-2.5 hover:scale-105 active:scale-95">
                  <span>Test this Layer Live</span> <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Code / Graph Viewer */}
          <div className="p-8 sm:p-14 bg-[#020510] flex flex-col justify-between font-mono text-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-8 text-slate-400 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping"></span>
                <span className="text-white">Active Runtime Execution</span>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded font-mono">status: 200 OK</span>
            </div>

            <div className="bg-[#040816] border border-slate-700/80 p-8 rounded-2xl overflow-x-auto text-cyan-300 font-mono text-sm leading-loose mb-10 shadow-inner">
              <pre>{showcaseTabs[activeTab].codeSnippet}</pre>
            </div>

            {/* Interactive representation */}
            <div className="w-full h-56 bg-[#030612] border border-slate-800/80 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl">
              {activeTab === 0 && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full flex items-center justify-around">
                    <div className="p-5 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-300 text-center font-bold shadow-[0_0_25px_rgba(59,130,246,0.4)] animate-pulse">Quantum Node</div>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                    <div className="p-5 rounded-2xl bg-purple-500/20 border border-purple-500/50 text-purple-300 text-center font-bold shadow-[0_0_25px_rgba(168,85,247,0.4)]">Qubit Node</div>
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className="text-center p-8">
                  <div className="text-emerald-400 font-black text-base mb-3 animate-pulse">✦ Hybrid Top-K Subgraph Grounding Successful</div>
                  <div className="text-slate-400 font-mono text-sm bg-[#050a1c] border border-slate-800 px-4 py-2 rounded-xl inline-block">Vector Match Score: 0.942 · Graph Entity Hops: 2</div>
                </div>
              )}
              {activeTab === 2 && (
                <div className="text-center p-8">
                  <div className="inline-block p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mb-4 animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]"><Cpu className="w-8 h-8" /></div>
                  <div className="text-white font-black text-base tracking-wide">Gemini Multi-Modal Token Processing Complete</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" ref={stepsRef} className="py-32 px-4 sm:px-6 lg:px-12 bg-[#020510] relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-xs font-black tracking-widest text-cyan-400 uppercase block mb-4">Deterministic Pipeline</span>
            <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tight">From Raw PDF to Graph Intelligence</h2>
          </div>

          <div className="relative flex flex-col md:flex-row items-start justify-between max-w-5xl mx-auto gap-12 md:gap-4">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] border-t-[3px] border-dashed border-blue-500/40 z-0 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>

            {[
              { num: '1', title: 'Upload PDF', desc: 'Securely parse high-density academic papers or textbooks.' },
              { num: '2', title: 'Gemini Parsing', desc: 'LLM extracts concepts, relationships, and metadata accurately.' },
              { num: '3', title: 'Graph & Vector Index', desc: 'Simultaneous persistence across Neo4j and Pinecone.' },
              { num: '4', title: 'Hybrid Retrieval', desc: 'Chat with your data using semantic + graph multi-hop routing.' },
            ].map((step, i) => (
              <div
                key={i}
                className="group relative z-10 flex flex-col items-center text-center w-full md:w-1/4"
                style={{
                  opacity: stepsInView ? 1 : 0,
                  transform: stepsInView ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.6s ease ${i * 0.2}s`
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl border border-blue-400/60 bg-[#060c22] text-cyan-400 font-black text-2xl flex items-center justify-center mb-6 shadow-[0_10px_0_rgba(29,78,216,0.6)] group-hover:scale-110 group-hover:translate-y-[-4px] group-hover:shadow-[0_15px_0_rgba(29,78,216,0.9)] transition-all duration-300"
                >
                  {step.num}
                </div>
                <h4 className="text-2xl font-black text-white mb-3">{step.title}</h4>
                <p className="text-lg text-slate-400 px-4 leading-relaxed font-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="w-full bg-gradient-to-r from-blue-950/60 via-[#0a1230] to-cyan-950/60 py-28 border-y border-white/10 relative z-10 px-4 sm:px-6 lg:px-12 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div>
            <h4 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-5 drop-shadow-2xl">{stat1}</h4>
            <p className="text-slate-300 font-black tracking-widest text-base uppercase">Average Entities Extracted Per Document</p>
          </div>
          <div>
            <h4 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-5 drop-shadow-2xl">{stat2}</h4>
            <p className="text-slate-300 font-black tracking-widest text-base uppercase">Faster Literature Review & Synthesis</p>
          </div>
          <div>
            <h4 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-5 drop-shadow-2xl">{stat3}</h4>
            <p className="text-slate-300 font-black tracking-widest text-base uppercase">Graph Grounding Recall Accuracy</p>
          </div>
        </div>
      </section>

      {/* High-End CTA Section (Stripe/Apple Style) */}
      <section ref={ctaRef} className="py-32 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto relative z-10">
        <div
          className="relative rounded-3xl bg-gradient-to-br from-[#060e28] via-[#0a1538] to-[#04091a] border border-blue-500/40 p-12 sm:p-24 text-center overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.35)] backdrop-blur-2xl"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.8s ease'
          }}
        >
          {/* Luminous orb in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tight mb-8">
              Start researching at the speed of thought.
            </h2>
            <p className="text-xl sm:text-2xl text-slate-300 mb-12 leading-relaxed font-normal">
              Join leading academic labs and enterprise R&D teams powering their literature discovery with deterministic hybrid knowledge graphs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-[0_0_50px_rgba(59,130,246,0.7)] hover:shadow-[0_0_90px_rgba(59,130,246,1)] border border-blue-400/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group">
                  <span>Launch Platform Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </Link>
              <button onClick={() => alert('Enterprise demo request received. Our graph specialists will contact you shortly.')} className="w-full sm:w-auto bg-[#050a1c]/90 hover:bg-[#08102c] border border-slate-700 hover:border-slate-500 text-white px-12 py-6 rounded-2xl font-black text-xl backdrop-blur-xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span>Schedule Enterprise Demo</span>
              </button>
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400 font-bold tracking-wider uppercase">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Instant API Access</span>
              <span>·</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Zero Setup Required</span>
              <span>·</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> SOC2 Compliance Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="py-20 bg-[#01030a] border-t border-slate-800/80 relative z-10 px-4 sm:px-6 lg:px-12" style={{
        opacity: footerInView ? 1 : 0,
        transform: footerInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s ease'
      }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-14 mb-16">
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl border border-blue-400/40">
                <span className="text-white italic text-xl leading-none font-black">G</span>
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">Graphenautic Architecture</span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm font-normal">
              The deterministic AI research platform. Bridging dense vector search with multi-hop Neo4j entity knowledge graphs for rigorous knowledge discovery.
            </p>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs w-max shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="font-bold">All Graph Engines Operational</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-black text-white uppercase tracking-widest mb-5">Infrastructure</h5>
            <ul className="space-y-3 text-base text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Neo4j Integration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinecone Indexing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gemini 1.5 Flash Reasoning</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Deterministic Extraction</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-black text-white uppercase tracking-widest mb-5">Solutions</h5>
            <ul className="space-y-3 text-base text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Academic Labs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Biotech R&D</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal & Regulatory Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Financial Intelligence</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-black text-white uppercase tracking-widest mb-5">Enterprise</h5>
            <ul className="space-y-3 text-base text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Security & SOC2</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zero-Telemetry Licensing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">On-Prem Deployment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support & SLA</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-slate-500 font-semibold tracking-wide">
          <div>&copy; 2026 Graphenautic AI Corporation. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security Overview</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
