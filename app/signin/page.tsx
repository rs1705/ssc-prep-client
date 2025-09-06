"use client";
import SignInWithGoogle from "@/components/custom/sign-in-google/sign-in-google";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import SignInForm from "@/components/custom/sign-in-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const router = useRouter();
  const { user, isLoading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="py-10 px-8 rounded-xl shadow-xl w-full sm:w-[65%] md:w-[480px] lg:w-[480px] xl:w-[480px]">
        <SignInForm />
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <div>
          <SignInWithGoogle onClickSignIn={signInWithGoogle} />
        </div>
        <br />
        <div>
          <p>
            Don&apos;t have any account yet?
            <Button variant="link" className="text-md">
              <Link href="/signup">Sign up</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
