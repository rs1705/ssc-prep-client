"use client";
import { BrandMark } from "@/components/custom/brand-mark";
import React from "react";
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
      <BrandMark className="h-9 w-9 shadow-sm rounded-full transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
      <div className="font-bold text-2xl tracking-tight">
        <span className="text-foreground font-extrabold">Ept</span>
        <span className="text-brand-alt-500 font-extrabold">SSC</span>
      </div>
    </Link>
  );
};
