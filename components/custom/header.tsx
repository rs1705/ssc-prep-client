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
import { User } from "lucide-react";
const Header = () => {
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="font-bold text-base">
            <Link href="/">SSC Prep</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-md">
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <User size={20} />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-4 p-1 w-[100px] text-center">
                      <NavigationMenuLink asChild className="text-md">
                        <Link href="/signin">Sign In</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="text-md">
                        <Link href="/signup" className="text-md">
                          Sign Up
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-md">
                    <Link href="/about">About</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button className="p-2 rounded hover:bg-base/10">
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
