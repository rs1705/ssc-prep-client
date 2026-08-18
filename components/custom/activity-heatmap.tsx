"use client";

  import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Flame, Trophy } from 'lucide-react';

export const ActivityHeatmap = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate 24 weeks of mock data (168 days)
  const days = 168;
  
  // Create realistic data (wrapped in useMemo so it doesn't randomize on hover re-renders)
  const heatmapData = useMemo(() => {
    return Array.from({ length: days }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      // Recent days have higher chance
      const isRecent = i > days - 45;
      const baseChance = isRecent ? 0.75 : 0.45;
      
      // Weekends might have more activity
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const chance = baseChance + (isWeekend ? 0.15 : 0);
      
      let level = 0;
      let count = 0;
      
      if (Math.random() < chance) {
        level = Math.floor(Math.random() * 4) + 1;
        // map level to fake activity count
        count = level === 1 ? Math.floor(Math.random() * 10) + 1 
              : level === 2 ? Math.floor(Math.random() * 25) + 10
              : level === 3 ? Math.floor(Math.random() * 50) + 35
              : Math.floor(Math.random() * 100) + 85;
      }
      
      return { level, count, date };
    });
  }, [days]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 1: return "bg-amber-500/30 border-2 border-amber-500/20";
      case 2: return "bg-amber-500/60 border-2 border-amber-500/40";
      case 3: return "bg-amber-500 border-2 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]";
      case 4: return "bg-orange-500 border-2 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.6)]";
      default: return "bg-card/40 border-2 border-border/20";
    }
  };

  const weeks = [];
  for (let i = 0; i < days; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  // Calculate Month labels (we check the first day of each week)
  const monthLabels: {name: string, index: number}[] = [];
  let currentMonth = -1;
  weeks.forEach((week, index) => {
    if (!week[0]) return;
    const month = week[0].date.getMonth();
    if (month !== currentMonth) {
      monthLabels.push({ name: week[0].date.toLocaleString('default', { month: 'short' }), index });
      currentMonth = month;
    }
  });

  return (
    <div className={cn("p-5 sm:p-6 rounded-3xl bg-card/60 backdrop-blur-2xl border-2 border-border/40 shadow-xl shadow-black/5 flex flex-col gap-4 relative", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20">
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Activity Heatmap
            </h4>
            <p className="text-[10px] sm:text-xs font-mono font-medium text-muted-foreground mt-0.5">
              Tracking consistency over 168 days
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-3 sm:gap-6 bg-background/50 px-4 sm:px-5 py-2.5 rounded-2xl border-2 border-border/40 w-fit shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Total</span>
            <span className="text-sm font-black text-foreground">94 Days</span>
          </div>
          <div className="w-0.5 h-6 bg-border/50" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              Streak <Trophy className="w-2.5 h-2.5 text-amber-500" />
            </span>
            <span className="text-sm font-black text-amber-500">12 Days</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="w-full overflow-x-auto scrollbar-none pb-2 pt-1 -mx-2 px-2 relative group/heatmap">
        <div className="min-w-max">
          
          {/* Months Row */}
          <div className="flex relative h-6 mb-2 ml-8">
            {monthLabels.map((m, i) => (
              <span 
                key={i} 
                className="absolute text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest -translate-x-1/2"
                style={{ left: `${(m.index / weeks.length) * 100}%` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          <div className="flex gap-2 relative">
            {/* Day Labels */}
            <div className="flex flex-col gap-[10px] justify-between py-1 pr-2 w-8 shrink-0">
              <span className="text-[9px] leading-none font-mono font-bold text-muted-foreground uppercase">Mon</span>
              <span className="text-[9px] leading-none font-mono font-bold text-muted-foreground uppercase">Wed</span>
              <span className="text-[9px] leading-none font-mono font-bold text-muted-foreground uppercase">Fri</span>
            </div>
            
            {/* The Grid */}
            <div className="flex gap-1 sm:gap-1.5">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1 sm:gap-1.5">
                  {week.map((cell, dayIdx) => (
                    <div
                      key={dayIdx}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                      className={cn(
                        "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[4px] transition-all duration-200 cursor-pointer",
                        "hover:scale-125 hover:z-10 hover:ring-2 hover:ring-amber-500/50 hover:ring-offset-1 hover:ring-offset-background",
                        getIntensityClass(cell.level)
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Floating Tooltip */}
      {hoveredCell && mounted && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-100 -translate-x-1/2 -translate-y-full"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y - 12,
          }}
        >
          <div className="bg-foreground text-background px-3 py-2 rounded-xl text-xs shadow-2xl flex flex-col items-center border-2 border-white/10 dark:border-black/10 backdrop-blur-xl">
            <span className="font-black text-amber-400">
              {hoveredCell.count === 0 ? 'No activity' : `${hoveredCell.count} questions`}
            </span>
            <span className="font-mono text-[9px] font-bold opacity-80 whitespace-nowrap mt-0.5">
              {hoveredCell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {/* Tooltip Arrow */}
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-foreground rotate-45 border-r-2 border-b-2 border-white/10 dark:border-black/10" />
          </div>
        </div>,
        document.body
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-2 pt-4 border-t-2 border-border/40">
        <span>Less</span>
        <div className="flex gap-1.5 mx-1">
          <div className="w-3.5 h-3.5 rounded-[4px] bg-card/40 border-2 border-border/20" />
          <div className="w-3.5 h-3.5 rounded-[4px] bg-amber-500/30 border-2 border-amber-500/20" />
          <div className="w-3.5 h-3.5 rounded-[4px] bg-amber-500/60 border-2 border-amber-500/40" />
          <div className="w-3.5 h-3.5 rounded-[4px] bg-amber-500 border-2 border-amber-400" />
          <div className="w-3.5 h-3.5 rounded-[4px] bg-orange-500 border-2 border-orange-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
