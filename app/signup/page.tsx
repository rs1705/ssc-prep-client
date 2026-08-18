"use client";
import SignUpForm from "@/components/custom/sign-up-form";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SignInWithGoogle from "@/components/custom/sign-in-google/sign-in-google";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-8 px-4 w-full relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[460px] bg-card/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-border/40 shadow-2xl shadow-black/10 flex flex-col gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit mb-3">
            <Sparkles className="w-3 h-3" />
            Join PrepPilot
          </div>
          <SignUpForm />
          
          <div className="flex items-center gap-4 my-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-muted-foreground text-xs font-mono font-medium uppercase tracking-widest">or continue with</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          
          <SignInWithGoogle onClickSignIn={signInWithGoogle} />
          
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground font-medium">
              Already have an account?&nbsp;
              <Link href={`/signin${queryStr}`} className="font-bold text-amber-500 hover:text-amber-400 hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
