"use client";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error",
        description: "Error signing in",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session.data?.user) {
      router.push("/td/dashboard");
    }
  }, [session, router, handleSignIn]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <div className=" text-neutral-200 font-bold text-center space-y-4">
        <div className="text-xl  ">Issue, Verify & Browse</div>
        <div className="text-md   ">
          {" "}
          <span className="text-purple-500 text-6xl">
            Digital Documents
          </span>{" "}
          with ease.
        </div>
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Learn More{" "}
        </button>
        <button
          onClick={handleSignIn}
          className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
