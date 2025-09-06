"use client";
import SignInWithGoogle from "@/components/custom/sign-in-google/sign-in-google";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import SignInForm from "@/components/custom/sign-in-form";

const SignInPage = () => {
  const router = useRouter();
  const { user, isLoading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  return (
    <div>
      <div className="flex-row justify-center">
        <SignInForm />
      </div>
      <p className="text-center">OR</p>
      <SignInWithGoogle onClickSignIn={signInWithGoogle} />
    </div>
  );
};

export default SignInPage;
