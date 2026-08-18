"use client";

import { Construction, Sparkles } from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { motion } from "framer-motion";

export default function ComingSoon({ 
  title = "Coming Soon", 
  description = "We are working hard to bring this feature to you!",
  pageTitle
}: { 
  title?: string, 
  description?: string,
  pageTitle?: string 
}) {
  return (
    <TopicPageLayout centerContent hideBreadcrumbs>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center p-8 sm:p-10 min-h-[420px] w-full max-w-lg mx-auto rounded-3xl bg-card/60 backdrop-blur-2xl border border-amber-500/25 shadow-xl shadow-amber-500/5 mt-10 relative overflow-hidden"
      >
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -left-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 relative shadow-inner"
        >
          <Construction className="w-10 h-10 text-amber-500" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
          </motion.div>
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-2 z-10">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed z-10 max-w-sm">
          {description}
        </p>
        
        <motion.div 
          className="mt-8 flex gap-2 items-center z-10 bg-card/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Active Sprint Development</span>
        </motion.div>
      </motion.div>
    </TopicPageLayout>
  );
}
