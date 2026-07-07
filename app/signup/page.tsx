"use client";
import SignUpForm from "@/components/custom/sign-up-form";
import React from "react";
import Link from "next/link";
import SignInWithGoogle from "@/components/custom/sign-in-google/sign-in-google";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignupPage = () => {
  const router = useRouter();
  const { user, isLoading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-120px)] pt-16 pb-12 px-2 sm:px-6">
      <div className="w-full max-w-[540px] bg-card p-6 sm:p-12 rounded-[24px] border border-border shadow-sm flex flex-col gap-6">
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
            <Link href="/signin" className="font-semibold text-primary hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
