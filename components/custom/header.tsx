"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth";
import { Button } from "../ui/button";
import {
  BookOpen,
  HomeIcon,
  LogIn,
  LucideLogOut,
  UserPlus,
  Menu,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "./logo";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const [hoveredSubject, setHoveredSubject] = useState<"english" | "maths" | "reasoning" | "gk">("english");
  const [activeMobileSubject, setActiveMobileSubject] = useState<string | null>(null);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark";
    if (
      typeof document === "undefined" ||
      !(document as any).startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Simple Text Navigation Links */}
            <div className="flex items-center gap-6 mr-2">
              <Link
                href="/"
                className={`text-base transition-colors ${pathname === "/"
                  ? "font-bold text-foreground"
                  : "font-semibold text-muted-foreground hover:text-foreground"
                  }`}
              >
                Home
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`text-base transition-colors !bg-transparent hover:!bg-transparent focus:!bg-transparent data-[state=open]:!bg-transparent data-[state=open]:hover:!bg-transparent px-0 h-auto ${pathname.startsWith("/SSC/")
                        ? "font-bold text-foreground"
                        : "font-semibold text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Subjects
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-0 md:w-[420px] lg:w-[440px]">
                      <div className="flex h-[260px]">
                        {/* Left Pane - Subjects list */}
                        <div className="w-[170px] p-2 border-r border-border/40 flex flex-col gap-1 bg-accent/10 dark:bg-slate-900/20">
                          {/* English */}
                          <div
                            onMouseEnter={() => setHoveredSubject("english")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${hoveredSubject === "english"
                              ? "bg-accent text-accent-foreground font-semibold"
                              : "hover:bg-accent/40 text-muted-foreground font-medium"
                              }`}
                          >
                            <span className="text-base">👩🏼‍🎓</span>
                            <span className="text-sm">English</span>
                          </div>

                          {/* Maths */}
                          <div
                            onMouseEnter={() => setHoveredSubject("maths")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${hoveredSubject === "maths"
                              ? "bg-accent text-accent-foreground font-semibold"
                              : "hover:bg-accent/40 text-muted-foreground font-medium"
                              }`}
                          >
                            <span className="text-base">🧮</span>
                            <span className="text-sm">Maths</span>
                          </div>

                          {/* Reasoning */}
                          <div
                            onMouseEnter={() => setHoveredSubject("reasoning")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${hoveredSubject === "reasoning"
                              ? "bg-accent text-accent-foreground font-semibold"
                              : "hover:bg-accent/40 text-muted-foreground font-medium"
                              }`}
                          >
                            <span className="text-base">🧠</span>
                            <span className="text-sm">Reasoning</span>
                          </div>

                          {/* GK */}
                          <div
                            onMouseEnter={() => setHoveredSubject("gk")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${hoveredSubject === "gk"
                              ? "bg-accent text-accent-foreground font-semibold"
                              : "hover:bg-accent/40 text-muted-foreground font-medium"
                              }`}
                          >
                            <span className="text-base">🌍</span>
                            <span className="text-sm flex-1 truncate">Gen Knowledge</span>
                          </div>
                        </div>

                        {/* Right Pane - Dynamic content based on hoveredSubject */}
                        <div className="flex-1 p-3.5 flex flex-col gap-3 min-w-[250px]">
                          {hoveredSubject === "english" && (
                            <div className="flex flex-col gap-2.5 animate-fadeIn">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="/SSC/english"
                                  className="text-xs font-bold uppercase tracking-wider text-primary hover:underline transition-colors border-b border-border/40 pb-1"
                                >
                                  Go to English Homepage
                                </Link>
                              </NavigationMenuLink>
                              <ul className="flex flex-col gap-2">
                                <li>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href="/SSC/english/flashcards"
                                      className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
                                    >
                                      <span>🎴</span> Flashcards
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>☠️</span> Hangman <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🔀</span> Word Shuffle <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🧠</span> Crossword <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {hoveredSubject === "maths" && (
                            <div className="flex flex-col gap-2.5 animate-fadeIn">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="/SSC/maths"
                                  className="text-xs font-bold uppercase tracking-wider text-primary hover:underline transition-colors border-b border-border/40 pb-1"
                                >
                                  Go to Maths Homepage
                                </Link>
                              </NavigationMenuLink>
                              <ul className="flex flex-col gap-2">
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>📐</span> Mental Maths <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>💡</span> Formulas & Tricks <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🎯</span> Topic Practice <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🧾</span> Mock Tests <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {hoveredSubject === "reasoning" && (
                            <div className="flex flex-col gap-2.5 animate-fadeIn">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="/SSC/reasoning"
                                  className="text-xs font-bold uppercase tracking-wider text-primary hover:underline transition-colors border-b border-border/40 pb-1"
                                >
                                  Go to Reasoning Homepage
                                </Link>
                              </NavigationMenuLink>
                              <ul className="flex flex-col gap-2">
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🧩</span> Logic Puzzles <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🧠</span> Analytical Reasoning <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🎲</span> Spatial & Non-Verbal <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🧾</span> Mock Tests <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {hoveredSubject === "gk" && (
                            <div className="flex flex-col gap-2.5 animate-fadeIn">
                              <NavigationMenuLink asChild>
                                <Link
                                  href="/SSC/gk"
                                  className="text-xs font-bold uppercase tracking-wider text-primary hover:underline transition-colors border-b border-border/40 pb-1"
                                >
                                  Go to GK Homepage
                                </Link>
                              </NavigationMenuLink>
                              <ul className="flex flex-col gap-2">
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>📰</span> Current Affairs <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🏛️</span> History & Polity <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🔬</span> General Science <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <span>🧾</span> Mock Tests <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">(Soon)</span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                href="/about"
                className={`text-base transition-colors ${pathname === "/about"
                  ? "font-bold text-foreground"
                  : "font-semibold text-muted-foreground hover:text-foreground"
                  }`}
              >
                About
              </Link>
            </div>

            <div className="w-px h-6 bg-border"></div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:cursor-pointer"
              onClick={toggleTheme}
            >
              <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth section */}
            {user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-11 px-3 pr-5 hover:cursor-pointer flex-row items-center font-semibold bg-accent/30 rounded-full hover:bg-accent border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-border/50">
                          <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-foreground">
                          {user.displayName?.toUpperCase()}
                        </span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2 min-w-[200px]">
                      <div className="px-2 py-2 mb-2 border-b border-border/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Account</p>
                      </div>
                      <NavigationMenuLink asChild>
                        <Button
                          onClick={logout}
                          variant="ghost"
                          className="flex items-center justify-start w-full h-10 px-3 font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer transition-colors"
                        >
                          <LucideLogOut className="mr-2 w-4 h-4" />
                          Sign Out
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin">
                  <Button variant="ghost" className="h-10 px-4 text-sm font-semibold rounded-xl hover:cursor-pointer flex items-center gap-2">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-10 px-4 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 hover:cursor-pointer flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 hover:cursor-pointer"
              onClick={toggleTheme}
            >
              <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet>
              {user ? (
                <SheetTrigger asChild>
                  <button className="flex items-center justify-center rounded-full hover:opacity-85 transition-opacity focus:outline-none focus:ring-0 mr-1">
                    <Avatar className="w-8 h-8 border border-border/50 shadow-sm">
                      <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </button>
                </SheetTrigger>
              ) : (
                <Link href="/signin" className="mr-1.5">
                  <Button variant="ghost" size="sm" className="h-9 px-3.5 text-sm font-semibold rounded-xl border border-border hover:bg-accent/60 transition-colors shadow-sm">
                    Sign In
                  </Button>
                </Link>
              )}

              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-11 h-11 flex flex-col justify-center items-center gap-[4.5px] hover:cursor-pointer">
                  <span className="w-6 h-[2px] bg-foreground rounded-full"></span>
                  <span className="w-6 h-[2px] bg-foreground rounded-full"></span>
                  <span className="w-6 h-[2px] bg-foreground rounded-full"></span>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center justify-start mb-2"><Logo /></SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${pathname === "/"
                        ? "bg-accent/80 text-foreground font-bold"
                        : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                        }`}
                    >
                      <HomeIcon className={`w-4 h-4 ${pathname === "/" ? "text-primary" : ""}`} />
                      Home
                    </Link>
                  </SheetClose>

                  <div className="flex flex-col gap-2 px-4 py-3 bg-accent/20 rounded-xl my-1 border border-border/40 max-h-[380px] overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subjects</p>

                    {/* English */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() => setActiveMobileSubject(activeMobileSubject === "english" ? null : "english")}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeMobileSubject === "english" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">👩🏼‍🎓</span>
                          <span className="text-sm font-semibold text-foreground">English</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeMobileSubject === "english" ? "rotate-180" : ""}`} />
                      </div>
                      {activeMobileSubject === "english" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-2 pt-1 animate-fadeIn">
                          <SheetClose asChild>
                            <Link
                              href="/SSC/english"
                              className="text-sm font-semibold text-primary hover:underline py-0.5 block"
                            >
                              Go to English Homepage
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href="/SSC/english/flashcards"
                              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all py-0.5 block"
                            >
                              🎴 Flashcards
                            </Link>
                          </SheetClose>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            ☠️ Hangman <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🔀 Word Shuffle <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🧠 Crossword <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Maths */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() => setActiveMobileSubject(activeMobileSubject === "maths" ? null : "maths")}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeMobileSubject === "maths" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🧮</span>
                          <span className="text-sm font-semibold text-foreground">Maths</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeMobileSubject === "maths" ? "rotate-180" : ""}`} />
                      </div>
                      {activeMobileSubject === "maths" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-2 pt-1 animate-fadeIn">
                          <SheetClose asChild>
                            <Link
                              href="/SSC/maths"
                              className="text-sm font-semibold text-primary hover:underline py-0.5 block"
                            >
                              Go to Maths Homepage
                            </Link>
                          </SheetClose>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            📐 Mental Maths <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            💡 Formulas & Tricks <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🎯 Topic Practice <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🧾 Mock Tests <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reasoning */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() => setActiveMobileSubject(activeMobileSubject === "reasoning" ? null : "reasoning")}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeMobileSubject === "reasoning" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🧠</span>
                          <span className="text-sm font-semibold text-foreground">Reasoning</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeMobileSubject === "reasoning" ? "rotate-180" : ""}`} />
                      </div>
                      {activeMobileSubject === "reasoning" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-2 pt-1 animate-fadeIn">
                          <SheetClose asChild>
                            <Link
                              href="/SSC/reasoning"
                              className="text-sm font-semibold text-primary hover:underline py-0.5 block"
                            >
                              Go to Reasoning Homepage
                            </Link>
                          </SheetClose>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🧩 Logic Puzzles <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🧠 Analytical Reasoning <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🎲 Spatial & Non-Verbal <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🧾 Mock Tests <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* GK */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() => setActiveMobileSubject(activeMobileSubject === "gk" ? null : "gk")}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeMobileSubject === "gk" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🌍</span>
                          <span className="text-sm font-semibold text-foreground">GK</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${activeMobileSubject === "gk" ? "rotate-180" : ""}`} />
                      </div>
                      {activeMobileSubject === "gk" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-1.5 pt-1 animate-fadeIn">
                          <SheetClose asChild>
                            <Link
                              href="/SSC/gk"
                              className="text-sm font-semibold text-primary hover:underline py-0.5 block"
                            >
                              Go to GK Homepage
                            </Link>
                          </SheetClose>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            📰 Current Affairs <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🏛️ History & Polity <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🔬 General Science <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 block select-none cursor-not-allowed">
                            🧾 Mock Tests <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-1">(Soon)</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <SheetClose asChild>
                    <Link
                      href="/about"
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${pathname === "/about"
                        ? "bg-accent/80 text-foreground font-bold"
                        : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                        }`}
                    >
                      <BookOpen className={`w-4 h-4 ${pathname === "/about" ? "text-primary" : ""}`} />
                      About
                    </Link>
                  </SheetClose>

                  <div className="h-px w-full bg-border my-4"></div>

                  {user ? (
                    <div className="flex flex-col gap-2 px-4">
                      <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 flex flex-col gap-3 mb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Account</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-border/50 shadow-sm">
                            <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm text-foreground tracking-tight">
                            {user.displayName?.toUpperCase() || 'USER'}
                          </span>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button
                          onClick={logout}
                          variant="outline"
                          className="w-fit mx-auto justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border-red-200/80 dark:border-red-950/80 text-red-600 hover:text-red-700 hover:bg-red-50/80 dark:hover:bg-red-950/20 transition-all shadow-sm"
                        >
                          <LucideLogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex gap-3 w-full px-4">
                      <SheetClose asChild>
                        <Link href="/signin" className="flex-1">
                          <Button variant="outline" className="w-full justify-center gap-2 h-11 px-4 rounded-xl text-sm font-bold border-border hover:bg-accent hover:text-accent-foreground transition-all shadow-sm">
                            <LogIn className="w-4 h-4" />
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup" className="flex-1">
                          <Button className="w-full justify-center gap-2 h-11 px-4 rounded-xl text-sm font-bold shadow-sm transition-all hover:opacity-90">
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
