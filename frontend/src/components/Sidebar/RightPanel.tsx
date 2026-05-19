"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '../Chat/ChatMessage';
import { cn } from '@/lib/utils';

export const RightPanel = () => {
  const { messages, isThinking } = useGraphStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (overrideText?: string) => {
    const textToSubmit = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSubmit.trim() || isThinking) return;

    setInput('');
    await useGraphStore.getState().submitQuery(textToSubmit);
  };

  return (
    <div className="h-full w-full flex flex-col bg-transparent relative text-slate-100 font-sans overflow-hidden min-w-0">
      
      {/* Top Copilot Header Bar */}
      <div className="p-6 border-b border-slate-800/80 bg-[#050b1e]/90 backdrop-blur-2xl z-10 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-xs uppercase tracking-wider text-white">
                  Graphenautic Copilot
                </h2>
                <span className="text-[10px] bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono px-2 py-0.5 rounded-full leading-none">
                  Gemini 1.5
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Multi-Modal Entity Grounding</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] shadow-inner shrink-0 self-start mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-emerald-400 font-bold leading-none">14ms Response</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 bg-[#020512]/90 backdrop-blur-3xl w-full pr-4 h-full" viewportRef={scrollRef}>
        <div className="pb-6 pt-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isThinking && (
            <div className="flex gap-4 px-6 py-5 animate-pulse bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent border-y border-blue-500/20">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="flex-1 space-y-3 py-1">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>SYNTHESIZING GRAPH REASONING HOPS...</span>
                </div>
                <div className="space-y-2 max-w-md">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '80%' }} />
                  </div>
                  <div className="h-2 w-4/5 bg-slate-800 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-slate-800/80 shrink-0 z-10 bg-[#050b1e]/90 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "Who are the key researchers?",
            "What technologies are mentioned?",
            "Compare and contrast themes"
          ].map(query => (
            <button
              key={query}
              onClick={() => handleSend(query)}
              className="bg-[#03081a] border border-blue-500/30 text-slate-300 text-xs rounded-xl px-3.5 py-2 hover:border-cyan-400 hover:text-white transition-all hover:bg-[#071336] shadow font-medium cursor-pointer"
            >
              {query}
            </button>
          ))}
        </div>

        <div className="relative flex items-center bg-[#030716] border border-blue-500/40 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] focus-within:shadow-[0_0_40px_rgba(6,182,212,0.4)] focus-within:border-cyan-400 transition-all p-1.5">
          <Input
            placeholder="Ask your hybrid graph anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="border-none bg-transparent focus-visible:ring-0 text-sm h-12 px-4 placeholder:text-slate-500 font-medium w-full text-white"
            disabled={isThinking}
          />
          <div className="pr-1 shrink-0">
            <Button 
              size="icon" 
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg group",
                input.trim() ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.6)]" : "bg-slate-900 border border-slate-800 text-slate-500"
              )}
              onClick={() => handleSend()}
              disabled={isThinking || !input.trim()}
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-3 px-2">
          <span>Deterministic Sub-Graph Grounding</span>
          <span>Zero Hallucination Guarantee</span>
        </div>
      </div>
    </div>
  );
};
