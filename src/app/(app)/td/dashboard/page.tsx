"use client";
import Sidemenu from "@/components/custom/Sidemenu";
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slices/userSlice";

export interface UserDate {
  identifier: string;
}

const Page = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserDate | null>(null);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/auth/check-user");
      if (!response.data) {
        return toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
      }
      dispatch(setUser(response.data.user));
      setUserData(response.data.user);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error fetching user data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="flex h-screen  w-full items-center justify-center">
      <div className="h-1/2 bg-gray-800 flex  flex-col gap-4 w-1/2 md:w-1/4 p-4 rounded-2xl shadow-xl">
        <div className="text-lg text-purple-500 font-semibold">
          ID: {userData?.identifier}
        </div>
        <div className="text-gray-300">Your Documents</div>

        <div className="flex h-full justify-center font-semibold items-center text-lg text-gray-400">
          <div>!!!No issued documents</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
