"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, FileClock, User, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";

export interface UserData {
  identifier: string;
}

const Page = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const dispatch = useDispatch();
  interface Document {
    name: string;
    authority: string;
    transactionHash: string;
    type: string;
    issuerAddress: string;
  }

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  async function getUserDocuments(identifier: string) {
    try {
      const response = await axios.get(`/api/issued-doc?owner=${identifier}`);
      if (!response.data) {
        toast({
          title: "No Documents Found",
          description: "You don't have any documents yet.",
          variant: "destructive",
        });
        return;
      }
      setDocuments(response.data.documents);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/auth/check-user");
      if (!response.data) {
        toast({
          title: "Authentication Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }
      dispatch(setUser(response.data.user));
      setUserData(response.data.user);
      await getUserDocuments(response.data.user.identifier);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <div className="w-full max-w-6xl p-6">
        <Card className="mb-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl font-bold text-white">
                Document Dashboard
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>ID: {userData?.identifier}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchUserData()}
              className="gap-2 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 text-gray-200"
            >
              <FileClock className="w-4 h-4" /> Refresh
            </Button>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">
              Loading documents...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents && documents.length > 0 ? (
              documents.map((doc, index: number) => (
                <Card
                  key={index}
                  className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:bg-gray-800/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {doc.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/40"
                      >
                        {doc.authority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full gap-2 bg-gray-800/50 border-gray-700/50 hover:bg-indigo-900/50 hover:border-indigo-700/50 text-gray-300 hover:text-indigo-300 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" /> View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900/90 backdrop-blur-lg border-gray-800/50">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Document Details
                          </DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Complete information about your document
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-800/50 rounded-lg break-all border border-gray-700/50">
                            <Label className="font-medium text-indigo-300">
                              Transaction Hash
                            </Label>
                            <div className="text-sm text-gray-300 mt-1">
                              {doc.transactionHash}
                            </div>
                          </div>
                          <div className="p-4 bg-gray-800/50 rounded-lg break-all border border-gray-700/50">
                            <Label className="font-medium text-indigo-300">
                              Authority
                            </Label>
                            <div className="text-sm text-gray-300 mt-1">
                              {doc.authority}
                            </div>
                          </div>
                          <div className="flex gap-3 w-full">
                            <div className="p-4 bg-gray-800/50 rounded-lg break-all border border-gray-700/50 w-1/2">
                              <Label className="font-medium text-indigo-300">
                                name
                              </Label>
                              <div className="text-sm text-gray-300 mt-1">
                                {doc.name}
                              </div>
                            </div>
                            <div className="p-4 bg-gray-800/50 rounded-lg break-all border border-gray-700/50 w-1/2">
                              <Label className="font-medium text-indigo-300">
                                Type
                              </Label>
                              <div className="text-sm text-gray-300 mt-1">
                                {doc.type}
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-800/50 rounded-lg break-all border border-gray-700/50">
                            <Label className="font-medium text-indigo-300">
                              Issuer Address
                            </Label>
                            <div className="text-sm text-gray-300 mt-1">
                              {doc.issuerAddress}
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="secondary"
                              className="bg-gray-800/50 hover:bg-indigo-900/50 text-gray-300 hover:text-indigo-300"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Folder className="w-12 h-12 text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Documents Found
                  </h3>
                  <p className="text-gray-400">
                    You dont have any issued documents yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
