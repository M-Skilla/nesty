// import { useStoreEffect } from "@/hooks/useStoreEffect";
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
