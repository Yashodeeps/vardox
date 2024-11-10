"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, CheckCircle, LogOut, LogIn } from "lucide-react";

const Navbar = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/75 backdrop-blur-md border-b border-purple-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/td/dashboard")}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-purple-700 transition-all">
              VARDOX
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                onClick={() => router.push("/td/issuer")}
              >
                <FileText size={18} />
                Issue a doc
              </Button>

              <Button
                variant="ghost"
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                onClick={() => router.push("/td/verifier")}
              >
                <CheckCircle size={18} />
                Verify a doc
              </Button>
            </div>

            {/* Auth Button */}
            {session.data?.user ? (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                onClick={() => signOut()}
              >
                <LogOut size={18} />
                Log out
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
              >
                <LogIn size={18} />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
