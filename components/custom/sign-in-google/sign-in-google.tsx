import { Button } from "@/components/ui/button";
import React from "react";

interface SignInWithGoogleProps {
  onClickSignIn: () => void;
}

const SignInWithGoogle: React.FC<SignInWithGoogleProps> = ({
  onClickSignIn,
}) => {
  return (
    <div className="flex justify-center">
      <Button onClick={onClickSignIn} className="hover:cursor-pointer">
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInWithGoogle;
