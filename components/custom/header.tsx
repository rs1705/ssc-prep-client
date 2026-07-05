"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

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

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl tracking-tight text-primary">
            SSC PREP
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Navigation links */}
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-md px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Link href="/" className="flex items-center font-medium gap-2">
                      <HomeIcon className="w-4 h-4" />
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-md px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Link href="/about" className="flex items-center font-medium gap-2">
                      <BookOpen className="w-4 h-4" />
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="w-px h-6 bg-border mx-2"></div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth section */}
            {user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-md hover:cursor-pointer flex-row items-center font-semibold">
                      <div className="flex items-center gap-2">
                        {user.displayName}
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="mr-5">
                      <NavigationMenuLink asChild className="m-0">
                        <Button
                          onClick={logout}
                          variant="ghost"
                          className="flex items-center justify-start w-full font-semibold hover:cursor-pointer"
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
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost" className="font-semibold gap-2 hover:cursor-pointer">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="font-semibold gap-2 hover:cursor-pointer">
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className=""
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
                  <SheetTitle className="text-left">SSC PREP</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <SheetClose asChild>
                    <Link href="/" className="flex items-center font-medium gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-all">
                      <HomeIcon className="w-5 h-5 text-primary" />
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/about" className="flex items-center font-medium gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-all">
                      <BookOpen className="w-5 h-5 text-primary" />
                      About
                    </Link>
                  </SheetClose>

                  <div className="h-px w-full bg-border my-4"></div>

                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 px-2">
                        <Avatar className="w-12 h-12 shadow-sm">
                          <AvatarImage src={user.photoURL || "https://github.com/evilrabbit.png"} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-lg">{user.displayName || 'User'}</span>
                      </div>
                      <SheetClose asChild>
                        <Button onClick={logout} variant="secondary" className="w-full justify-center gap-2 h-12 rounded-xl text-md font-semibold hover:bg-red-50 hover:text-red-600 transition-colors">
                          <LucideLogOut className="w-5 h-5" />
                          Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 mt-4">
                      <SheetClose asChild>
                        <Link href="/signin" className="w-full">
                          <Button variant="outline" className="w-full justify-center gap-2 h-12 rounded-xl text-md font-semibold border-primary/20 text-primary hover:bg-primary/10 transition-all">
                            <LogIn className="w-5 h-5" />
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full justify-center gap-2 h-12 rounded-xl text-md font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
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
