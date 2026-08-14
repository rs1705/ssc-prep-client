"use client";
import React, { useState, useEffect } from "react";
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
  LucideLogOut,
  UserPlus,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  GraduationCap,
  Calculator,
  Globe,
  BrainCircuit,
  // English section icons
  Layers,
  Skull,
  Shuffle,
  Grid3X3,
  // Maths section icons
  Zap,
  Lightbulb,
  Target,
  ClipboardList,
  // Reasoning section icons
  Puzzle,
  Brain,
  Layers3,
  // GK section icons
  Newspaper,
  Landmark,
  FlaskConical,
} from "lucide-react";
import { Logo } from "./logo";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const [hoveredSubject, setHoveredSubject] = useState<
    "english" | "maths" | "reasoning" | "gk"
  >("english");
  const [activeMobileSubject, setActiveMobileSubject] = useState<string | null>(
    null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark";
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (
      typeof document === "undefined" ||
      !doc.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
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
        },
      );
    });
  };

  return (
    <nav className="w-full bg-background/95 sm:bg-background/80 backdrop-blur-none sm:backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo */}
          <Logo onClick={() => setIsMobileMenuOpen(false)} />

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Simple Text Navigation Links */}
            <div className="flex items-center gap-6 mr-2">
              <Link
                href="/"
                className={`text-sm uppercase tracking-wide transition-colors ${
                  pathname === "/"
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
                      className={`text-sm uppercase tracking-wide transition-colors !bg-transparent hover:!bg-transparent focus:!bg-transparent data-[state=open]:!bg-transparent data-[state=open]:hover:!bg-transparent px-0 h-auto ${
                        pathname.startsWith("/SSC/")
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
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              hoveredSubject === "english"
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent/40 text-muted-foreground font-medium"
                            }`}
                          >
                            <GraduationCap className="w-4 h-4 shrink-0 text-violet-500 dark:text-violet-400" />
                            <span className="text-sm">English</span>
                          </div>

                          {/* Maths */}
                          <div
                            onMouseEnter={() => setHoveredSubject("maths")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              hoveredSubject === "maths"
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent/40 text-muted-foreground font-medium"
                            }`}
                          >
                            <Calculator className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                            <span className="text-sm">Maths</span>
                          </div>

                          {/* Reasoning */}
                          <div
                            onMouseEnter={() => setHoveredSubject("reasoning")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              hoveredSubject === "reasoning"
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent/40 text-muted-foreground font-medium"
                            }`}
                          >
                            <BrainCircuit className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                            <span className="text-sm">Reasoning</span>
                          </div>

                          {/* GK */}
                          <div
                            onMouseEnter={() => setHoveredSubject("gk")}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              hoveredSubject === "gk"
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent/40 text-muted-foreground font-medium"
                            }`}
                          >
                            <Globe className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                            <span className="text-sm flex-1 truncate">
                              Gen Knowledge
                            </span>
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
                                      <Layers className="w-3.5 h-3.5 shrink-0 text-violet-400" />
                                      Flashcards
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Skull className="w-3.5 h-3.5 shrink-0 text-violet-300/50" />
                                    Hangman{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Shuffle className="w-3.5 h-3.5 shrink-0 text-violet-300/50" />
                                    Word Shuffle{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Grid3X3 className="w-3.5 h-3.5 shrink-0 text-violet-300/50" />
                                    Crossword{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
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
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href="/SSC/maths/mental-maths"
                                      className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
                                    >
                                      <Zap className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                                      Speed Math
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-emerald-300/50" />
                                    Formulas &amp; Tricks{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Target className="w-3.5 h-3.5 shrink-0 text-emerald-300/50" />
                                    Topic wise Pyqs{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <ClipboardList className="w-3.5 h-3.5 shrink-0 text-emerald-300/50" />
                                    Mock Tests{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
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
                                    <Puzzle className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                                    Logic Puzzles{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Brain className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                                    Analytical Reasoning{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Layers3 className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                                    Spatial &amp; Non-Verbal{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <ClipboardList className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                                    Mock Tests{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
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
                                    <Newspaper className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                                    Current Affairs{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <Landmark className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                                    History &amp; Polity{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <FlaskConical className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                                    General Science{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
                                  </span>
                                </li>
                                <li>
                                  <span className="text-sm font-semibold text-muted-foreground/45 flex items-center gap-2 select-none cursor-not-allowed">
                                    <ClipboardList className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                                    Mock Tests{" "}
                                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                                      (Soon)
                                    </span>
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
                className={`text-sm uppercase tracking-wide transition-colors ${
                  pathname === "/about"
                    ? "font-bold text-foreground"
                    : "font-semibold text-muted-foreground hover:text-foreground"
                }`}
              >
                About
              </Link>

              <Link
                href="/feedback"
                className={`text-sm uppercase tracking-wide transition-colors ${
                  pathname === "/feedback"
                    ? "font-bold text-foreground"
                    : "font-semibold text-muted-foreground hover:text-foreground"
                }`}
              >
                Feedback
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
                          <AvatarImage
                            src={
                              user.photoURL ||
                              "https://github.com/evilrabbit.png"
                            }
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-foreground">
                          {user.displayName?.toUpperCase()}
                        </span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2 min-w-[200px]">
                      <div className="px-2 py-2 mb-2 border-b border-border/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          My Account
                        </p>
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
                  <Button
                    variant="ghost"
                    className="h-10 px-4 text-sm font-semibold rounded-xl hover:cursor-pointer flex items-center gap-2"
                  >
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

            {user ? (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center rounded-full hover:opacity-85 transition-opacity focus:outline-none focus:ring-0 mr-1"
              >
                <Avatar className="w-8 h-8 border border-border/50 shadow-sm">
                  <AvatarImage
                    src={user.photoURL || "https://github.com/evilrabbit.png"}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <Link
                href="/signin"
                className="mr-1.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3.5 text-sm font-semibold rounded-xl border border-border hover:bg-accent/60 transition-colors shadow-sm"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 flex flex-col justify-center items-center gap-[4.5px] hover:cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span
                className={`w-6 h-[2px] bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
              ></span>
              <span
                className={`w-6 h-[2px] bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`w-6 h-[2px] bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
              ></span>
              <span className="sr-only">Open menu</span>
            </Button>

            {isMobileMenuOpen && (
              <div className="fixed top-14 left-0 right-0 bottom-0 w-full h-[calc(100vh-56px)] bg-background z-40 border-t border-border flex flex-col animate-fadeIn overflow-y-auto">
                <div className="flex flex-col gap-2 mt-6">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-8 py-2.5 transition-all text-sm ${
                      pathname === "/"
                        ? "bg-accent/80 text-foreground font-bold"
                        : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <HomeIcon
                      className={`w-4 h-4 ${pathname === "/" ? "text-primary" : ""}`}
                    />
                    Home
                  </Link>

                  <div className="flex flex-col gap-2 px-4 py-3 bg-accent/20 rounded-xl mx-4 my-1 border border-border/40 max-h-[380px] overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-3">
                      Subjects
                    </p>

                    {/* English */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() =>
                          setActiveMobileSubject(
                            activeMobileSubject === "english"
                              ? null
                              : "english",
                          )
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeMobileSubject === "english"
                            ? "bg-background shadow-sm border border-border/50"
                            : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-4 h-4 shrink-0 text-violet-500 dark:text-violet-400" />
                          <span className="text-sm font-semibold">English</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${activeMobileSubject === "english" ? "rotate-180" : ""}`}
                        />
                      </div>
                      {activeMobileSubject === "english" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-2 pt-1 animate-fadeIn">
                          <Link
                            href="/SSC/english"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline pb-1"
                          >
                            Go to English Homepage
                          </Link>
                          <Link
                            href="/SSC/english/flashcards"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all py-0.5 flex items-center gap-2"
                          >
                            <Layers className="w-3.5 h-3.5 shrink-0 text-violet-400" />
                            Flashcards
                          </Link>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Skull className="w-3.5 h-3.5 shrink-0 text-violet-300/50" />
                            Hangman{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Shuffle className="w-3.5 h-3.5 shrink-0 text-violet-300/50" />
                            Word Shuffle{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Grid3X3 className="w-3.5 h-3.5 shrink-0 text-violet-300/50" />
                            Crossword{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Maths */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() =>
                          setActiveMobileSubject(
                            activeMobileSubject === "maths" ? null : "maths",
                          )
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeMobileSubject === "maths"
                            ? "bg-background shadow-sm border border-border/50"
                            : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Calculator className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                          <span className="text-sm font-semibold">Maths</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${activeMobileSubject === "maths" ? "rotate-180" : ""}`}
                        />
                      </div>
                      {activeMobileSubject === "maths" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-2 pt-1 animate-fadeIn">
                          <Link
                            href="/SSC/maths"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline pb-1"
                          >
                            Go to Maths Homepage
                          </Link>
                          <Link
                            href="/SSC/maths/mental-maths"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all py-0.5 flex items-center gap-2"
                          >
                            <Zap className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                            Speed Math
                          </Link>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Lightbulb className="w-3.5 h-3.5 shrink-0 text-emerald-300/50" />
                            Formulas & Tricks{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Target className="w-3.5 h-3.5 shrink-0 text-emerald-300/50" />
                            Topic wise Pyqs{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <ClipboardList className="w-3.5 h-3.5 shrink-0 text-emerald-300/50" />
                            Mock Tests{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reasoning */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() =>
                          setActiveMobileSubject(
                            activeMobileSubject === "reasoning"
                              ? null
                              : "reasoning",
                          )
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeMobileSubject === "reasoning"
                            ? "bg-background shadow-sm border border-border/50"
                            : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <BrainCircuit className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                          <span className="text-sm font-semibold">
                            Reasoning
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${activeMobileSubject === "reasoning" ? "rotate-180" : ""}`}
                        />
                      </div>
                      {activeMobileSubject === "reasoning" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-2 pt-1 animate-fadeIn">
                          <Link
                            href="/SSC/reasoning"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline pb-1"
                          >
                            Go to Reasoning Homepage
                          </Link>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Puzzle className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                            Logic Puzzles{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Brain className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                            Analytical Reasoning{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Layers3 className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                            Spatial & Non-Verbal{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <ClipboardList className="w-3.5 h-3.5 shrink-0 text-amber-300/50" />
                            Mock Tests{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* GK */}
                    <div className="flex flex-col gap-0.5">
                      <div
                        onClick={() =>
                          setActiveMobileSubject(
                            activeMobileSubject === "gk" ? null : "gk",
                          )
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeMobileSubject === "gk"
                            ? "bg-background shadow-sm border border-border/50"
                            : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                          <span className="text-sm font-semibold">
                            Gen Knowledge
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${activeMobileSubject === "gk" ? "rotate-180" : ""}`}
                        />
                      </div>
                      {activeMobileSubject === "gk" && (
                        <div className="pl-10 flex flex-col gap-1.5 pb-1.5 pt-1 animate-fadeIn">
                          <Link
                            href="/SSC/gk"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline pb-1"
                          >
                            Go to GK Homepage
                          </Link>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Newspaper className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                            Current Affairs{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <Landmark className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                            History &amp; Polity{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <FlaskConical className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                            General Science{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground/45 py-0.5 flex items-center gap-2 select-none cursor-not-allowed">
                            <ClipboardList className="w-3.5 h-3.5 shrink-0 text-rose-300/50" />
                            Mock Tests{" "}
                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase ml-auto">
                              (Soon)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-8 py-2.5 transition-all text-sm ${
                      pathname === "/about"
                        ? "bg-accent/80 text-foreground font-bold"
                        : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <BookOpen
                      className={`w-4 h-4 ${pathname === "/about" ? "text-primary" : ""}`}
                    />
                    About
                  </Link>

                  <Link
                    href="/feedback"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-8 py-2.5 transition-all text-sm ${
                      pathname === "/feedback"
                        ? "bg-accent/80 text-foreground font-bold"
                        : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <MessageSquare
                      className={`w-4 h-4 ${pathname === "/feedback" ? "text-primary" : ""}`}
                    />
                    Feedback
                  </Link>

                  <div className="mt-8 border-t border-border/40 pt-6">
                    {user ? (
                      <div className="flex flex-col gap-2 px-8">
                        <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 flex flex-col gap-3 mb-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            My Account
                          </p>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 border border-border/50 shadow-sm">
                              <AvatarImage
                                src={
                                  user.photoURL ||
                                  "https://github.com/evilrabbit.png"
                                }
                              />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm text-foreground tracking-tight">
                              {user.displayName?.toUpperCase() || "USER"}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-fit mx-auto justify-center gap-2 h-10 px-5 rounded-xl text-sm font-bold border-red-200/80 dark:border-red-950/80 text-red-600 hover:text-red-700 hover:bg-red-50/80 dark:hover:bg-red-950/20 transition-all shadow-sm"
                        >
                          <LucideLogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex w-full px-8 justify-center">
                        <Link
                          href="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button className="justify-center gap-2 h-10 px-5 rounded-xl text-sm font-bold shadow-sm transition-all hover:opacity-90">
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
