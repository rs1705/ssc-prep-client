"use client";
import SignUpForm from "@/components/custom/sign-up-form";
import React from "react";
import Link from "next/link";
import SignInWithGoogle from "@/components/custom/sign-in-google/sign-in-google";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignupPage = () => {
  const router = useRouter();
  const { user, isLoading, signInWithGoogle } = useAuth();

  const [queryStr, setQueryStr] = useState("");

  useEffect(() => {
    setQueryStr(window.location.search);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirectUrl") || "/";
      router.replace(redirectUrl);
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-start pt-3 sm:pt-6 md:pt-8 pb-10 px-3 sm:px-6 w-full">
      <div className="w-full max-w-[460px] bg-card p-4 sm:p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col gap-3.5 sm:gap-4.5">
        <SignUpForm />
        
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        
        <SignInWithGoogle onClickSignIn={signInWithGoogle} />
        
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?&nbsp;
            <Link href={`/signin${queryStr}`} className="font-semibold text-primary hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
