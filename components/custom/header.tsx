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
import { useAuth } from "@/context/auth";
import { Button } from "../ui/button";
import { LogIn, LucideLogOut, UserPlus } from "lucide-react";
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div>
            <Link className="font-bold text-lg" href="/">
              SSC PREP
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className="text-lg font-semibold">
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                   
                    className="text-lg font-semibold"
                  >
                    <Link href="#">{user ? user.displayName : "Guest"}</Link>
                  </NavigationMenuTrigger>
                  {!user ? (
                    <NavigationMenuContent>
                      <ul className="w-[100]">
                        <li>
                          <NavigationMenuLink
                            className="text-md font-semibold"
                            asChild
                          >
                            <Link
                              href="/signin"
                              className="flex-row justify-around"
                            >
                              <LogIn
                                size={20}
                                stroke="gray"
                                className="mt-[5px]"
                              />
                              Sign In
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink
                            className="text-md font-semibold"
                            asChild
                          >
                            <Link
                              href="/signup"
                              className="flex-row justify-around"
                            >
                              <UserPlus
                                size={20}
                                stroke="gray"
                                className="mt-[5px]"
                              />
                              Sign up
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  ) : (
                    <NavigationMenuContent>
                      <ul>
                        <li className="font-semibold text-md">
                          <NavigationMenuLink
                            className="text-md font-semibold flex items-center"
                            asChild
                          >
                            <Button
                              onClick={logout}
                              variant="ghost"
                              className="flex-row justify-center hover:cursor-pointer"
                            >
                              <LucideLogOut
                                size={20}
                                className="mt-[5px] hover:text-white"
                              />
                              Sign Out
                            </Button>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-lg font-semibold" asChild>
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
