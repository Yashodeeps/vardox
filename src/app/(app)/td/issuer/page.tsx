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
import { useState } from "react";

const Page = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [formData, setFormData] = useState({
    authority: "",
    certificateType: "",
    vardoxId: "",
    docHash: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    authority: false,
    certificateType: false,
    vardoxId: false,
    file: false,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setError("");
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setTouched((prev) => ({
        ...prev,
        file: true,
      }));

      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setFormData((prev) => ({
        ...prev,
        docHash: hashHex,
      }));
      setError("");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setTouched({
      authority: true,
      certificateType: true,
      vardoxId: true,
      file: true,
    });

    if (
      !formData.authority ||
      !formData.certificateType ||
      !formData.vardoxId ||
      !selectedFile
    ) {
      setError("Please fill in all required fields");
      return;
    }

    console.log("Form Data:", formData);
    console.log("File:", selectedFile);
    // submission logic
  };

  return (
    <div className="flex justify-center w-full items-center h-screen mx-4">
      <div className="border border-gray-500 rounded-xl shadow-xl w-1/2 md:w-1/3 h-2/3 ">
        <div className="text-xl text-gray-300 font-bold p-4">
          Issue a certificate{" "}
        </div>
        <Separator className="bg-gray-500" />
        <form onSubmit={handleSubmit} className="p-4">
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
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <div className="pt-3">
            <Label>
              Authority <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="authority"
              value={formData.authority}
              onChange={handleInputChange}
              placeholder="Hack this fall"
              className={`w-full p-2 rounded-lg border ${
                touched.authority && !formData.authority
                  ? "border-red-500"
                  : "border-gray-500"
              }`}
            />
          </div>

          <div className="pt-3">
            <Label>
              Type of certificate <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="certificateType"
              value={formData.certificateType}
              onChange={handleInputChange}
              placeholder="HTF Winner"
              className={`w-full p-2 rounded-lg border ${
                touched.certificateType && !formData.certificateType
                  ? "border-red-500"
                  : "border-gray-500"
              }`}
            />
          </div>

          <div className="flex gap-4">
            <div className="pt-3">
              <Label>
                Receiptent vardox Id <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="vardoxId"
                value={formData.vardoxId}
                onChange={handleInputChange}
                placeholder="IR23456"
                className={`p-2 rounded-lg border ${
                  touched.vardoxId && !formData.vardoxId
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
              />
            </div>
            <div className="pt-3">
              <Label>
                Upload doc <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                onChange={handleFileUpload}
                className={`p-2 rounded-lg border ${
                  touched.file && !selectedFile
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
              />
            </div>
          </div>

          <div className="pt-3">
            <Label>Doc hash</Label>
            <Input
              type="text"
              value={formData.docHash}
              placeholder="Upload doc to get hash"
              className="p-2 rounded-lg border border-gray-500"
              disabled
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 flex gap-3 mt-3"
            >
              Issue
              <PartyPopper />
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
