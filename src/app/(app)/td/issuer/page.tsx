"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { PartyPopper } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  console.log(isConnected);

  return (
    <div className="flex justify-center w-full items-center h-screen   mx-4    ">
      <div className="border border-gray-500 rounded-xl shadow-xl w-1/2 md:w-1/3 h-2/3 ">
        <div className="text-xl text-gray-300 font-bold p-4">
          Issue a certificate{" "}
        </div>
        <Separator className="bg-gray-500" />
        <div className=" p-4  ">
          <Dialog>
            <DialogTrigger asChild>
              {isConnected ? (
                <Button variant={"secondary"}>{address}</Button>
              ) : (
                <Button>Connect your wallet</Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Choose your wallet</DialogTitle>
              </DialogHeader>
              <div className="flex items-center flex-wrap gap-3">
                {connectors.map((connector) => (
                  <Button
                    variant={"secondary"}
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                  >
                    {connector.name}
                  </Button>
                ))}{" "}
              </div>
            </DialogContent>
          </Dialog>
          <div className="pt-3">
            <Label>Authority</Label>
            <Input
              type="text"
              placeholder="Hack this fall"
              className="w-full p-2 rounded-lg border border-gray-500"
            />
          </div>
          <div className="pt-3">
            <Label>Type of certificate</Label>
            <Input
              type="text"
              placeholder="HTF Winner"
              className="w-full p-2 rounded-lg border border-gray-500"
            />
          </div>
          <div className="flex  gap-4">
            <div className="pt-3">
              <Label>Receiptent vardox Id</Label>
              <Input
                type="text"
                placeholder="IR23456"
                className=" p-2 rounded-lg border border-gray-500"
              />
            </div>
            <div className="pt-3">
              <Label>Upload doc</Label>
              <Input
                type="file"
                className=" p-2 rounded-lg border border-gray-500"
              />
            </div>
          </div>
          <div className="pt-3">
            <Label>Doc hash</Label>
            <Input
              type="text"
              placeholder="Upload doc to get hash"
              className=" p-2 rounded-lg border border-gray-500"
              disabled
            />
          </div>

          <Button className="bg-purple-600 hover:bg-purple-500 flex gap-3 my-3">
            Issue
            <PartyPopper />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
