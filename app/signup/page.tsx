import SignUpForm from "@/components/custom/sign-up-form";
import React from "react";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="py-10 px-8 rounded-xl shadow-xl w-full sm:w-[65%] md:w-[480px] lg:w-[480px] xl:w-[480px]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignupPage;
