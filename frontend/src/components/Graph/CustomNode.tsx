import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { EntityNodeData } from '@/types/graph';
import { cn } from '@/lib/utils';
import { 
  User, 
  Lightbulb, 
  Building2, 
  MapPin, 
  Cpu, 
  Calendar, 
  FileQuestion,
  Layers
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  Person: <User className="w-4 h-4 text-blue-400" />,
  Concept: <Lightbulb className="w-4 h-4 text-purple-400" />,
  Organization: <Building2 className="w-4 h-4 text-emerald-400" />,
  Location: <MapPin className="w-4 h-4 text-orange-400" />,
  Technology: <Cpu className="w-4 h-4 text-cyan-400" />,
  Event: <Calendar className="w-4 h-4 text-rose-400" />,
  Other: <FileQuestion className="w-4 h-4 text-gray-400" />,
};

const categoryColors: Record<string, { bg: string; border: string; glow: string; dot: string; shadow: string }> = {
  Person: { bg: 'from-[#061233]/90 to-[#03091e]/95', border: 'border-blue-500/40', glow: 'rgba(59,130,246,0.5)', dot: 'bg-blue-400', shadow: 'rgba(59,130,246,0.3)' },
  Concept: { bg: 'from-[#1b0733]/90 to-[#0e031e]/95', border: 'border-purple-500/40', glow: 'rgba(168,85,247,0.5)', dot: 'bg-purple-400', shadow: 'rgba(168,85,247,0.3)' },
  Organization: { bg: 'from-[#052617]/90 to-[#02140c]/95', border: 'border-emerald-500/40', glow: 'rgba(16,185,129,0.5)', dot: 'bg-emerald-400', shadow: 'rgba(16,185,129,0.3)' },
  Location: { bg: 'from-[#2e1505]/90 to-[#180a02]/95', border: 'border-orange-500/40', glow: 'rgba(249,115,22,0.5)', dot: 'bg-orange-400', shadow: 'rgba(249,115,22,0.3)' },
  Technology: { bg: 'from-[#052129]/90 to-[#031116]/95', border: 'border-cyan-500/40', glow: 'rgba(6,182,212,0.5)', dot: 'bg-cyan-400', shadow: 'rgba(6,182,212,0.3)' },
  Event: { bg: 'from-[#330713]/90 to-[#1a0309]/95', border: 'border-rose-500/40', glow: 'rgba(244,63,94,0.5)', dot: 'bg-rose-400', shadow: 'rgba(244,63,94,0.3)' },
  Other: { bg: 'from-[#1a1f2c]/90 to-[#0d1017]/95', border: 'border-gray-500/40', glow: 'rgba(107,114,128,0.5)', dot: 'bg-gray-400', shadow: 'rgba(107,114,128,0.3)' },
};

export const CustomNode = memo(({ data, selected }: NodeProps<EntityNodeData>) => {
  const styles = categoryColors[data.category] || categoryColors.Other;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ zIndex: isHovered ? 1000 : 1 }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#06b6d4] border-none !min-w-0 !min-h-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
      
      {/* Hover / Hold Floating Popover Card */}
      {isHovered && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 bg-[#060e26]/95 backdrop-blur-3xl border border-cyan-400/80 rounded-3xl p-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-[1000] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{data.category}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Grounding Active
            </span>
          </div>
          <h4 className="text-base font-black text-white leading-tight drop-shadow mb-3 tracking-tight">{data.label}</h4>
          {data.documentSources && data.documentSources.length > 0 && (
            <div className="text-[11px] font-mono text-slate-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2 mb-3 shadow-inner">
              <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Source: {data.documentSources.join(', ')}</span>
            </div>
          )}
          <div className="text-[10px] font-mono text-cyan-300/80 flex items-center justify-between pt-2 border-t border-slate-800/80 font-bold tracking-wide">
            <span>✦ Click to isolate semantic edges</span>
          </div>
        </div>
      )}

      <div 
        className={cn(
          "flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all duration-300 max-w-[200px] bg-gradient-to-br backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.95)]",
          styles.bg,
          styles.border,
          selected ? "ring-2 ring-cyan-400 scale-105" : "hover:border-cyan-400/60 hover:scale-102"
        )}
        style={{
          boxShadow: selected ? `0 0 35px ${styles.glow}, inset 0 2px 0 rgba(255,255,255,0.2)` : `0 10px 25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`
        }}
      >
        {/* Top-Right Pulsing Status Dot */}
        <div className="absolute top-2 right-2 flex items-center">
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", styles.dot)} style={{ boxShadow: `0 0 8px ${styles.shadow}` }} />
        </div>

        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/40 border border-white/10 shrink-0 shadow-inner">
          {categoryIcons[data.category] || <FileQuestion className="w-4 h-4 text-gray-400" />}
        </div>
        
        <div className="flex flex-col pr-2 min-w-0 flex-1">
          {!data.hideLabel && (
            <>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 block truncate">
                {data.category}
              </span>
              <span className="text-sm font-black text-white block truncate w-full tracking-tight drop-shadow">
                {data.label}
              </span>
            </>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#06b6d4] border-none !min-w-0 !min-h-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
