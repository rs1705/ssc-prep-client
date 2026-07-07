"use client";
import React from "react";
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
  Moon
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "./logo";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

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
                className={`text-base transition-colors ${
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
                      className={`text-base transition-colors !bg-transparent hover:!bg-transparent focus:!bg-transparent data-[state=open]:!bg-transparent data-[state=open]:hover:!bg-transparent px-0 h-auto ${
                        pathname.startsWith("/SSC/") 
                          ? "font-bold text-foreground" 
                          : "font-semibold text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Subjects
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-2 min-w-[220px]">
                      <ul className="flex flex-col gap-1 w-full">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link 
                              href="/SSC/english" 
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform">👩🏼‍🎓</span>
                              <div>
                                <div className="text-sm font-semibold">English</div>
                                <p className="text-xs text-muted-foreground">Grammar & Vocab</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link 
                              href="/SSC/maths" 
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform">🧮</span>
                              <div>
                                <div className="text-sm font-semibold">Maths</div>
                                <p className="text-xs text-muted-foreground">Speed & Accuracy</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link 
                              href="/SSC/reasoning" 
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform">🧠</span>
                              <div>
                                <div className="text-sm font-semibold">Reasoning</div>
                                <p className="text-xs text-muted-foreground">Logic & Puzzles</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link 
                              href="/SSC/gk" 
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform">🌍</span>
                              <div>
                                <div className="text-sm font-semibold">General Knowledge</div>
                                <p className="text-xs text-muted-foreground">Current Affairs</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link 
                href="/about" 
                className={`text-base transition-colors ${
                  pathname === "/about" 
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
              className="rounded-full h-10 w-10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
                        <span className="text-base font-bold text-foreground">
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
                  <Button variant="ghost" className="h-11 px-5 text-base font-bold rounded-xl hover:cursor-pointer">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-11 px-5 text-base font-bold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 hover:cursor-pointer">
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 hover:cursor-pointer" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hover:cursor-pointer" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
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
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                        pathname === "/" 
                          ? "bg-accent/80 text-foreground font-bold" 
                          : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <HomeIcon className={`w-5 h-5 ${pathname === "/" ? "text-primary" : ""}`} />
                      Home
                    </Link>
                  </SheetClose>

                  <div className="flex flex-col gap-1 px-4 py-2 bg-accent/20 rounded-xl my-1 border border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subjects</p>
                    <SheetClose asChild>
                      <Link 
                        href="/SSC/english" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          pathname === "/SSC/english" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <span className="text-xl">👩🏼‍🎓</span>
                        <div>
                          <div className="text-sm font-semibold">English</div>
                          <p className="text-[10px] text-muted-foreground">Grammar & Vocab</p>
                        </div>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/SSC/maths" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          pathname === "/SSC/maths" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <span className="text-xl">🧮</span>
                        <div>
                          <div className="text-sm font-semibold">Maths</div>
                          <p className="text-[10px] text-muted-foreground">Speed & Accuracy</p>
                        </div>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/SSC/reasoning" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          pathname === "/SSC/reasoning" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <span className="text-xl">🧠</span>
                        <div>
                          <div className="text-sm font-semibold">Reasoning</div>
                          <p className="text-[10px] text-muted-foreground">Logic & Puzzles</p>
                        </div>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="/SSC/gk" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          pathname === "/SSC/gk" ? "bg-background shadow-sm border border-border/50" : "hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <span className="text-xl">🌍</span>
                        <div>
                          <div className="text-sm font-semibold">General Knowledge</div>
                          <p className="text-[10px] text-muted-foreground">Current Affairs</p>
                        </div>
                      </Link>
                    </SheetClose>
                  </div>

                  <SheetClose asChild>
                    <Link 
                      href="/about" 
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                        pathname === "/about" 
                          ? "bg-accent/80 text-foreground font-bold" 
                          : "text-muted-foreground font-semibold hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <BookOpen className={`w-5 h-5 ${pathname === "/about" ? "text-primary" : ""}`} />
                      About
                    </Link>
                  </SheetClose>

                  <div className="h-px w-full bg-border my-4"></div>

                  {user ? (
                    <div className="flex flex-col gap-2">
                      <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 flex flex-col gap-3 mb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Account</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-border/50 shadow-sm">
                            <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-lg text-foreground tracking-tight">
                            {user.displayName?.toUpperCase() || 'USER'}
                          </span>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button 
                          onClick={logout} 
                          variant="ghost" 
                          className="w-full justify-start gap-3 h-12 px-4 rounded-xl text-md font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LucideLogOut className="w-5 h-5" />
                          Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Link href="/signin" className="w-full">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-4 rounded-xl text-md font-semibold text-foreground hover:bg-accent transition-all border border-transparent">
                            <LogIn className="w-5 h-5" />
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full justify-start gap-3 h-12 px-4 rounded-xl text-md font-bold shadow-sm transition-all hover:-translate-y-0.5">
                            <UserPlus className="w-5 h-5" />
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
