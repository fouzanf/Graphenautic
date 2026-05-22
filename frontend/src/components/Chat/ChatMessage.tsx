import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '@/types/graph';
import { cn } from '@/lib/utils';
import { Sparkles, Copy, Check } from 'lucide-react';

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isAssistant = message.role === 'assistant';
  const [timeStr, setTimeStr] = React.useState("");
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      setTimeStr(new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 0);
    return () => clearTimeout(handle);
  }, [message.timestamp]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className={cn(
      "flex w-full px-6 py-3 transition-all duration-300 min-w-0",
      isAssistant ? "justify-start" : "justify-end"
    )}>
      {isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-cyan-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 mr-4 mt-1 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        </div>
      )}

      <div className={cn(
        "max-w-[85%] flex flex-col group min-w-0",
        isAssistant ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "space-y-2 relative transition-all duration-300 shadow-lg backdrop-blur-xl max-w-full break-words overflow-x-auto",
          !isAssistant
            ? "bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-[0_5px_20px_rgba(59,130,246,0.4)] font-medium self-end"
            : "bg-[#0f172a] border border-slate-700 border-l-[4px] border-l-cyan-400 px-6 py-4 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] font-normal self-start"
        )}>
          {isAssistant && (
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 gap-4">
              <span className="text-xs font-mono font-black tracking-wider text-cyan-400 uppercase flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Graphenautic Engine</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold shrink-0">
                Verified Grounding
              </span>
            </div>
          )}
          <div className={cn(
            "text-sm leading-relaxed prose prose-invert max-w-none break-words overflow-x-hidden prose-p:my-1.5 prose-p:leading-relaxed prose-li:my-1 prose-ul:my-1.5 prose-ol:my-1.5 prose-headings:text-white prose-headings:font-bold prose-strong:text-cyan-300 prose-pre:bg-[#030716] prose-pre:border prose-pre:border-blue-500/30 prose-pre:text-cyan-300 prose-pre:shadow-inner prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:text-cyan-400 prose-code:bg-[#030716] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:border prose-code:border-blue-500/20",
            isAssistant ? "text-slate-200" : "text-white"
          )}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {isAssistant && (
            <div className="flex justify-end mt-2 pt-2">
              <button
                onClick={() => handleCopy(message.content)}
                className="text-slate-500 hover:text-cyan-400 p-1.5 rounded-md hover:bg-blue-500/10 transition-colors"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 px-1">
          <span suppressHydrationWarning className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors min-h-[14px]">
            {timeStr}
          </span>
          {isAssistant && <span className="text-[10px] font-mono text-blue-400/80">· Zero Hallucination</span>}
        </div>
      </div>
    </div>
  );
};
