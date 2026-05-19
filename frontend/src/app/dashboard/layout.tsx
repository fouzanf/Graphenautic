"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Network, LayoutDashboard, Share2, FolderOpen, Settings, LogOut, Sparkles, Loader2, User, ChevronRight, Activity, Globe, Database, Cpu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (status === 'loading') {
    return (
      <div className="h-screen w-full bg-[#020510] flex flex-col items-center justify-center gap-4 text-slate-300 font-mono">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin relative z-10" />
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">Verifying Cryptographic Session...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Workspace Hub', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Graph Canvas', path: '/dashboard/canvas', icon: Share2 },
    { name: 'Document Vault', path: '/dashboard/vault', icon: FolderOpen },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020510] text-slate-100 font-sans selection:bg-blue-500/30 relative">
      {/* Immersive ambient light */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Billion-Dollar Floating Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-20 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-[#050b1e]/90 backdrop-blur-xl border border-blue-400/80 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:scale-110 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
        style={{ left: sidebarOpen ? 'calc(16rem - 1rem)' : '1rem' }}
        title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Persistent Sleek Left Sidebar */}
      <aside className={`bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between z-40 backdrop-blur-2xl shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden shrink-0 ${
        sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
      }`}>
        {/* Top Brand */}
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/40 shrink-0">
            <span className="text-white italic text-xl leading-none font-black">G</span>
          </div>
          <div className="flex flex-col truncate">
            <span className="font-black text-lg text-white tracking-tight truncate">Graphenautic</span>
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-bold">Enterprise Node</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Core Navigation</div>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / System Status */}
        <div className="p-4 border-t border-slate-800/60 bg-[#040818]/60 flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold">SECURE ENCLAVE</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]"></span>
              ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-900/80 p-2 rounded-lg border border-slate-800 truncate">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Gemini 1.5 Flash Synced</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Minimal Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#030715]/90 backdrop-blur-2xl flex items-center justify-between px-6 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 font-mono text-xs text-slate-400">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold tracking-wider uppercase text-[11px]">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Workspace Connected</span>
            </span>
            {/* Portal target for page-specific header items */}
            <div id="canvas-header-portal" className="flex items-center gap-2" />
          </div>

          <div className="flex items-center gap-4">
            {/* User Profile Pill */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/40 transition-colors shadow-inner">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || 'User'} className="w-6 h-6 rounded-full border border-blue-400 shadow" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-[11px] text-white shadow">
                    {session?.user?.name ? session.user.name[0].toUpperCase() : 'R'}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200 pr-1 truncate max-w-[120px] sm:max-w-[160px]">
                  {session?.user?.name || 'Enterprise User'}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-bold text-xs font-mono transition-all hover:scale-105 active:scale-95 shadow"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-[#020510] relative">
          {children}
        </main>
      </div>
    </div>
  );
}
