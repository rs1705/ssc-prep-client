"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { SectionCardProps } from "@/lib/types";
import InfoDialog from "../info-dialog";
import { useRouter } from "next/navigation";

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  linkTo,
  buttonText,
  knowMoreText,
  icon,
  index = 0,
  cols = 2,
  colorTheme = "indigo",
}: SectionCardProps) => {
  const router = useRouter();
  const isClickable = linkTo !== "#";
  const theme = colorTheme || "indigo";

  const themeMap = {
    sky: {
      iconWrapper: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-[0_2px_8px_rgba(14,165,233,0.05)]",
    },
    emerald: {
      iconWrapper: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.05)]",
    },
    rose: {
      iconWrapper: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-[0_2px_8px_rgba(244,63,94,0.05)]",
    },
    amber: {
      iconWrapper: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.05)]",
    },
    violet: {
      iconWrapper: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 shadow-[0_2px_8px_rgba(139,92,246,0.05)]",
    },
    indigo: {
      iconWrapper: "bg-primary/10 text-primary border border-primary/20 shadow-[0_2px_8px_rgba(99,102,241,0.05)]",
    },
  };

  const currentTheme = themeMap[theme];

  return (
    <Card 
      className={`group relative w-full max-w-[380px] mx-auto h-full flex flex-col bg-card/65 dark:bg-card/45 border border-border/80 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-xs hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden select-none animate-in fade-in slide-in-from-bottom-3 zoom-in-[0.98] hover:border-primary/30 hover:ring-1 hover:ring-primary/30 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)] ${
        !isClickable ? "opacity-60 cursor-not-allowed" : ""
      }`}
      style={{ animationDelay: `${Math.floor(index / cols) * 120}ms`, animationFillMode: "both" }}
    >
      <CardHeader className="pb-2 pt-6 px-6">
        {icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out ${currentTheme.iconWrapper}`}>
            {icon}
          </div>
        )}
        <CardTitle className="text-lg font-black tracking-tight text-foreground transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-4">
        <p className="text-muted-foreground/90 text-xs sm:text-sm leading-relaxed">{description}</p>
        {knowMoreText && (
          <div className="mt-3.5">
            <InfoDialog description={knowMoreText} title={title} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={linkTo}
          className="flex w-full items-center justify-center"
        >
          <Button 
            variant={linkTo === "#" ? "outline" : "default"} 
            disabled={linkTo === "#"} 
            className={`w-full justify-center font-bold text-xs cursor-pointer gap-2 h-10 rounded-xl transition-all duration-300 ${
              linkTo !== "#"
                ? "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white shadow-sm hover:shadow-[0_4px_12px_rgba(99,102,241,0.25)] active:scale-[0.98]"
                : "border-border/60 hover:bg-transparent text-muted-foreground/50"
            }`}
          >
            {linkTo !== "#" && <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />}
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SectionCard;
