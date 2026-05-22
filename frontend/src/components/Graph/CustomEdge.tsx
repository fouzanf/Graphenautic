import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { cn } from '@/lib/utils';

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        className={cn(
          "react-flow__edge-path transition-all duration-300",
          selected ? "stroke-[#2a4a6a] stroke-[2px]" : "stroke-[#2a4a6a] stroke-[1.5px]"
        )}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors duration-150 shadow-sm",
            selected ? "bg-[#2a4a6a] text-white border-[#2a4a6a]" : "bg-[#0f1624] text-gray-400 border border-[#1e2a40]"
          )}
        >
          {data?.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

