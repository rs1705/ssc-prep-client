"use client";
import React, { useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Lottie to prevent Server-Side Rendering (SSR) issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Attempt to load the rocket.json file from the public folder
    fetch("/rocket.json")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("rocket.json not found");
      })
      .then((data) => setAnimationData(data))
      .catch(() => setAnimationData(null)); // Fallback to Lucide icon
  }, []);

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon: Rocket in Blue Box */}
      <div className="bg-blue-700 rounded-lg p-1.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105 group-hover:-translate-y-0.5 overflow-hidden w-8 h-8">
        {animationData ? (
          <Lottie 
            animationData={animationData} 
            loop={isHovered}
            autoplay={isHovered}
            className="w-full h-full scale-[1.3]" // Scale up slightly to fill the box better
          />
        ) : (
          <Rocket className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Text: PrepPilot Dual-Tone */}
      <div className="font-bold text-2xl tracking-tight">
        <span className="text-slate-900 dark:text-white">Prep</span>
        <span className="text-blue-600">Pilot</span>
      </div>
    </Link>
  );
};
