"use client";
import React from "react";
import Link from "next/link";

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
  UserIcon,
  UserPlus,
} from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between lg:justify-around h-16 items-center">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg">
            SSC PREP
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center">
            {/* Navigation links */}
            <NavigationMenu>
              <NavigationMenuList className="flex">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-md px-3">
                    <Link
                      href="/"
                      className="flex-row items-center font-semibold"
                    >
                      <HomeIcon stroke="black" />
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-md px-3">
                    <Link
                      href="/about"
                      className="flex-row items-center font-semibold"
                    >
                      <BookOpen stroke="black" />
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* User menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-md hover:cursor-pointer flex-row items-center font-semibold">
                    {user ? (
                      <div className="flex items-center gap-1">
                        {user.displayName}
                        <Avatar>
                          <AvatarImage src="https://github.com/evilrabbit.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <UserIcon stroke="black" size={20} />
                        Guest
                      </div>
                    )}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="mr-5">
                    {!user ? (
                      <ul className="w-[95px] p-1">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/signin"
                              className="flex-row items-center font-semibold"
                            >
                              <LogIn size={18} stroke="black" />
                              Sign in
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/signup"
                              className="flex-row items-center font-semibold"
                            >
                              <UserPlus size={18} stroke="black" />
                              Sign up
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    ) : (
                      <NavigationMenuLink asChild className="m-0">
                        <Button
                          onClick={logout}
                          variant="ghost"
                          className="flex-row items-center font-semibold hover:cursor-pointer"
                        >
                          <LucideLogOut size={20} stroke="black" />
                          Sign Out
                        </Button>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button className="p-2 rounded hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
