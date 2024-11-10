"use client";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileCheck, ArrowRight, LogIn } from "lucide-react";

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
  }, [session, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo icon */}
        <div className="mb-8 inline-block">
          <FileCheck size={48} className="text-purple-500 animate-pulse" />
        </div>

        {/* Main content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-200">
            Issue, Verify & Browse
          </h1>

          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent pb-2">
              Digital Documents
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 mt-2">
              with ease.
            </p>
          </div>

          {/* Features list */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-neutral-300 text-sm max-w-2xl mx-auto">
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <p>Secure Document Issuance</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <p>Quick Verification Process</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <p>Easy Document Management</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <button className="group px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2">
            Learn More
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={handleSignIn}
            className="group px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-medium border border-purple-500/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Sign In
            <LogIn
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-neutral-400 text-sm">
          Trusted by professionals worldwide
        </div>
      </div>
    </main>
  );
}
