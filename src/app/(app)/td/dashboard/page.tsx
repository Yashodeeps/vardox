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
    <div className="flex h-screen justify-center  items-center">
      <div>Id: {userData?.identifier}</div>
    </div>
  );
};

export default Page;
