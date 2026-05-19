"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LeftPanel } from '@/components/Sidebar/LeftPanel';
import { RightPanel } from '@/components/Sidebar/RightPanel';
import { GraphCanvas } from '@/components/Graph/GraphCanvas';
import { useGraphStore } from '@/store/useGraphStore';
import { v4 as uuidv4 } from 'uuid';
import { Menu, MessageSquare, ChevronDown, Plus, Check, History, X } from 'lucide-react';

interface SessionObject {
  id: string;
  name: string;
  createdAt: number;
}

export default function GraphWorkspacePage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const { activeSessionId, setActiveSessionId, setNodes, setEdges, setMessages, setDocuments } = useGraphStore();
  const [sessionsList, setSessionsList] = useState<SessionObject[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const loadSessions = async () => {
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/sessions`);
        if (res.ok) {
          const data = await res.json();
          if (data.sessions && data.sessions.length > 0) {
            const mapped: SessionObject[] = data.sessions.map((sid: string, idx: number) => ({
              id: sid,
              name: `Session - ${sid.slice(0, 8)}`,
              createdAt: Date.now() - idx * 60000
            }));
            setSessionsList(mapped);
            setActiveSessionId(mapped[0].id);
            return;
          }
        } else {
          setError('Backend server unreachable. Please check connection.');
        }
      } catch (err) {
        console.error("Failed to fetch sessions from backend:", err);
        setError('Backend server unreachable. Please check connection.');
      }

      // Default fallback session
      const initialId = uuidv4();
      const initialSession: SessionObject = {
        id: initialId,
        name: `Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
        createdAt: Date.now()
      };
      setActiveSessionId(initialId);
      setSessionsList([initialSession]);
    };

    loadSessions();
  }, [setActiveSessionId]);

  const handleSwitchSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // Clear current visual layout and Copilot chat
    setNodes([]);
    setEdges([]);
    setDocuments([]);
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Session loaded. The knowledge graph is synchronized.",
        timestamp: Date.now(),
      }
    ]);
  };

  const handleNewSession = () => {
    const newId = uuidv4();
    const newSession: SessionObject = {
      id: newId,
      name: `Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
      createdAt: Date.now()
    };
    setSessionsList(prev => [newSession, ...prev].slice(0, 10));
    setActiveSessionId(newId);
    setDropdownOpen(false);
    setHistoryOpen(false);

    // Clear the current canvas layout and Copilot chat
    setNodes([]);
    setEdges([]);
    setDocuments([]);
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Canvas initialized. Drop a PDF to begin.",
        timestamp: Date.now(),
      }
    ]);
  };

  // Find active session name
  const activeSessionName = sessionsList.find(s => s.id === activeSessionId)?.name || 'Select Session';

  // Get the portal element
  const portalTarget = typeof document !== 'undefined' ? document.getElementById('canvas-header-portal') : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#01030a] text-slate-100 font-sans selection:bg-blue-500/30 relative">
      {/* Immersive Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[300px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Render the header controls into the layout portal */}
      {mounted && portalTarget && createPortal(
        <div className="flex items-center gap-2 relative z-50">
          {/* Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl bg-[#050b1e]/90 hover:bg-[#07102e]/95 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-inner"
            >
              <div className="flex items-center gap-1.5 max-w-[120px] sm:max-w-[160px]">
                <span className="truncate">{activeSessionName}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                {/* Click outside backdrop */}
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setDropdownOpen(false)} />

                {/* Dropdown content */}
                <div className="absolute top-full mt-2 left-0 w-64 bg-[#050b1e]/95 backdrop-blur-2xl border border-slate-800 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Recent Sessions</div>
                  {sessionsList.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        handleSwitchSession(session.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs font-medium transition-all ${activeSessionId === session.id
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-white/5 border border-transparent hover:text-white'
                        }`}
                    >
                      <span className="truncate pr-2">{session.name}</span>
                      {activeSessionId === session.id && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* History Panel Toggle Button */}
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all text-xs font-bold ${historyOpen
                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'bg-[#050b1e]/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            title="Toggle Session History"
          >
            <History className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">History</span>
          </button>

          {/* New Graph Session Button */}
          <button
            onClick={handleNewSession}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-500/40 hover:border-blue-500/60 text-blue-300 hover:text-blue-200 font-bold text-xs font-sans transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.2)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Graph Session</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-800/80 mx-1" />

          {/* Knowledge Vault Toggle Button */}
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-bold ${leftOpen ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-[#050b1e]/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
          >
            <Menu className="w-4 h-4" />
            <span className="hidden md:inline">Knowledge Vault</span>
          </button>

          {/* Neural Copilot Toggle Button */}
          <button
            onClick={() => setRightOpen(!rightOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-bold ${rightOpen ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-[#050b1e]/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">Neural Copilot</span>
          </button>
        </div>,
        portalTarget
      )}

      {/* Backend Unreachable Alert */}
      {error && (
        <div className="absolute top-4 left-4 z-40 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.2)] backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dashboard Workspace */}
      <div className="flex-1 flex w-full h-full relative min-h-0 overflow-hidden">
        {/* Left Sidebar - Knowledge Base */}
        <aside className={`w-[340px] flex-shrink-0 flex-col border-r border-slate-800/80 z-30 bg-[#030715]/95 backdrop-blur-3xl shadow-[20px_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 ${leftOpen ? 'flex absolute inset-y-0 left-0' : 'hidden lg:flex'}`}>
          <div className="flex-1 min-h-0 flex flex-col h-full w-full">
            <LeftPanel />
          </div>
        </aside>

        {/* Center Canvas - Knowledge Graph - The "Viewing Portal" */}
        <main className="flex-1 relative min-w-0 bg-[#030612] overflow-hidden">
          <GraphCanvas />
        </main>

        {/* Right Sidebar - Neural Link Chat Interface */}
        <aside className={`w-full md:w-[440px] flex-shrink-0 flex-col border-l border-slate-800/80 z-30 bg-[#030715]/95 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 ${rightOpen ? 'flex absolute inset-y-0 right-0' : 'hidden md:flex'}`}>
          <div className="flex-1 min-h-0 flex flex-col h-full w-full">
            <RightPanel />
          </div>
        </aside>

        {/* Backdrop for mobile panels */}
        {(leftOpen || rightOpen) && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => { setLeftOpen(false); setRightOpen(false); }}
          />
        )}
      </div>

      {/* Slide-out History Panel Backdrop */}
      {historyOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={() => setHistoryOpen(false)}
        />
      )}

      {/* Slide-out History Panel */}
      <aside className={`fixed top-16 right-0 bottom-0 w-80 bg-[#030715]/95 backdrop-blur-3xl border-l border-slate-800/80 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out flex flex-col ${historyOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
            <History className="w-4 h-4 text-blue-400" />
            <span>Session History</span>
          </div>
          <button
            onClick={() => setHistoryOpen(false)}
            className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Content - Session List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {sessionsList.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-medium">No past sessions found.</div>
          ) : (
            sessionsList.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  handleSwitchSession(session.id);
                  setHistoryOpen(false);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-300 group relative overflow-hidden flex flex-col gap-1.5 cursor-pointer ${activeSessionId === session.id
                    ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'bg-[#050a1c]/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700/80 hover:bg-[#07102e]/60'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold truncate pr-2 ${activeSessionId === session.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                    {session.name}
                  </span>
                  {activeSessionId === session.id && (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>ID: {session.id.slice(0, 8)}...</span>
                  <span>{new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
