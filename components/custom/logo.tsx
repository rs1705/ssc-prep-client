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
      className={`flex items-center gap-2 group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-alt-500 shadow-sm flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 hover:rotate-6 cursor-pointer">
        <Rocket className="w-5 h-5" />
      </div>
      <div className="font-bold text-2xl tracking-tight">
        <span className="text-foreground font-extrabold">Ept</span>
        <span className="text-brand-alt-500 font-extrabold">Ssc</span>
      </div>
    </Link>
  );
};
