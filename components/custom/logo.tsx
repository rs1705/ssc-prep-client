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
      <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-lg p-1.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105 group-hover:-translate-y-0.5 overflow-hidden w-8 h-8">
        <Rocket className="w-5 h-5 text-white" />
      </div>
      <div className="font-bold text-2xl tracking-tight">
        <span className="text-slate-900 dark:text-white">Prep</span>
        <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Pilot</span>
      </div>
    </Link>
  );
};
