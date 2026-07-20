"use client";
import React from "react";
import { Rocket } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ className = "", onClick }: LogoProps) => {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 group ${className}`}
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm flex items-center justify-center text-white transition-transform group-hover:scale-105 group-hover:-translate-y-0.5">
        <Rocket className="w-5 h-5" />
      </div>
      <div className="font-bold text-2xl tracking-tight">
        <span className="text-foreground font-extrabold">Prep</span>
        <span className="text-orange-500">Pilot</span>
      </div>
    </Link>
  );
};
