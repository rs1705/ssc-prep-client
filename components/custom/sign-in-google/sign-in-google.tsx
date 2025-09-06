import { Button } from "@/components/ui/button";
import React from "react";

interface SignInWithGoogleProps {
  onClickSignIn: () => void;
}

const SignInWithGoogle: React.FC<SignInWithGoogleProps> = ({
  onClickSignIn,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClickSignIn}
      className="hover:cursor-pointer w-full"
    >
      Continue with Google
    </Button>
  );
};

export default SignInWithGoogle;
