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
        className="flex flex-col items-center justify-center text-center p-8 min-h-[400px] w-full max-w-lg mx-auto rounded-3xl bg-card border border-border shadow-sm mt-10 relative overflow-hidden"
      >
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative"
        >
          <Construction className="w-10 h-10 text-primary" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground mb-3 z-10">{title}</h3>
        <p className="text-muted-foreground leading-relaxed z-10">
          {description}
        </p>
        
        <motion.div 
          className="mt-8 flex gap-2 items-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-xs font-medium text-primary uppercase tracking-widest">In Development</span>
        </motion.div>
      </motion.div>
    </TopicPageLayout>
  );
}
