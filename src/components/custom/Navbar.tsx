"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const session = useSession();
  const router = useRouter();
  return (
    <div className="flex justify-between p-4 fixed top-0 left-0 right-0  border-b border-gray-600 ">
      <div className="text-xl text-purple-500 font-bold"> TrueDoc</div>
      <div className="flex gap-12">
        <div className="flex gap-4 text-purple-500">
          <Button
            className=" hover:text-purple-600"
            variant={"outline"}
            onClick={() => {
              router.push("/td/issuer");
            }}
          >
            Issue a doc
          </Button>
          <Button variant={"outline"}>Verify a doc</Button>
        </div>
        {session.data?.user ? (
          <Button
            variant={"outline"}
            onClick={() => {
              signOut();
            }}
          >
            Log out
          </Button>
        ) : (
          <Button variant={"outline"}>Sign In</Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
