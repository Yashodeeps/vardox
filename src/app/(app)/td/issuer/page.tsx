"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { FileCheck, Paperclip, Upload, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CONTRACT_ADDRESS } from "@/lib/utils";
import { aib } from "@/lib/aib";
import { Address } from "viem";
import { sepolia } from "wagmi/chains";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();

  const {
    data: hash,
    writeContract,
    isSuccess,
    isPending,
  } = useWriteContract();

  const [formData, setFormData] = useState({
    authority: "",
    certificateName: "",
    certificateType: "",
    vardoxId: "",
    docHash: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isStored, setIsStored] = useState(false);
  const [touched, setTouched] = useState({
    authority: false,
    name: false,
    certificateType: false,
    vardoxId: false,
    file: false,
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      setError("No file selected");
      return;
    }
    const file = files[0];
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

  const handleIssuanceStorage = async () => {
    const data = {
      name: formData.certificateName,
      type: formData.certificateType,
      transactionHash: hash,
      authority: formData.authority,
      issuerAddress: address,
      ownerId: formData.vardoxId,
    };
    console.log("Issuance data:", data);

    try {
      const response = await axios.post("/api/issued-doc", data);
      console.log("Issuance stored:", response.data);
      if (!response.data) {
        setError("Error storing issuance");
      }
      setIsStored(true);
    } catch (error) {
      console.error("Error storing issuance:", error);
      setIsStored(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      authority: true,
      certificateType: true,
      vardoxId: true,
      file: true,
      name: true,
    });

    if (
      !formData.authority ||
      !formData.certificateType ||
      !formData.vardoxId ||
      !formData.certificateName ||
      !selectedFile
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    console.log("Form Data:", formData);
    console.log("File:", selectedFile);

    try {
      const contractResult = writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: aib,
        functionName: "issueDocument",
        chain: sepolia,
        args: [
          formData.vardoxId,
          formData.docHash,
          formData.certificateName,
          formData.certificateType,
        ],
      });

      // if (isSuccess) {
      //   setFormData({
      //     authority: "",
      //     certificateName: "",
      //     certificateType: "",
      //     vardoxId: "",
      //     docHash: "",
      //   });
      //   setSelectedFile(null);
      // }
    } catch (error) {
      console.error("Contract interaction error:", error);
      setError("Failed to issue document. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black/40 p-8 flex items-center justify-center w-screen">
      <div className="w-fit max-w-4xl flex gap-8">
        <Card className="flex-1 border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Issue Certificate
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Create and issue blockchain-verified certificates
            </p>
          </CardHeader>
          <Separator className="bg-gray-800" />
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"secondary"}
                    className="w-full relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      {isConnected ? (
                        <span className="text-sm truncate ">{address}</span>
                      ) : (
                        "Connect Wallet"
                      )}
                    </div>
                    {isConnected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Select Wallet</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center flex-wrap gap-3">
                    {connectors.map((connector) => (
                      <Button
                        variant="outline"
                        key={connector.uid}
                        onClick={() => connect({ connector })}
                        className="hover:bg-purple-500/20 transition-colors"
                      >
                        {connector.name}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Authority <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="authority"
                    value={formData.authority}
                    onChange={handleInputChange}
                    placeholder="Hack this fall"
                    className={`bg-gray-800/50 border-gray-700 focus:border-purple-500 transition-colors ${
                      touched.authority && !formData.authority
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Certificate Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="certificateName"
                    value={formData.certificateName}
                    onChange={handleInputChange}
                    placeholder="HTF Winner"
                    className={`bg-gray-800/50 border-gray-700 focus:border-purple-500 transition-colors ${
                      touched.name && !formData.certificateName
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Type of Document <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="certificateType"
                    value={formData.certificateType}
                    onChange={handleInputChange}
                    placeholder="certificate"
                    className={`bg-gray-800/50 border-gray-700 focus:border-purple-500 transition-colors ${
                      touched.certificateType && !formData.certificateType
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Recipient Vardox ID <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="vardoxId"
                    value={formData.vardoxId}
                    onChange={handleInputChange}
                    placeholder="IR23456"
                    className={`bg-gray-800/50 border-gray-700 focus:border-purple-500 transition-colors ${
                      touched.vardoxId && !formData.vardoxId
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Upload Document <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="file"
                      onChange={handleFileUpload}
                      className={`bg-gray-800/50 border-gray-700 focus:border-purple-500 transition-colors file:bg-gray-700 file:text-gray-200 file:border-0 file:mr-4 ${
                        touched.file && !selectedFile ? "border-red-500" : ""
                      }`}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Document Hash</Label>
                  <Input
                    type="text"
                    value={formData.docHash}
                    placeholder="Upload document to generate hash"
                    className="bg-gray-800/50 border-gray-700 text-gray-400 truncate"
                    disabled
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-colors"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Issue Certificate
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isSuccess && (
          <Card className="w-80 bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-400">
                Certificate Issued! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConfirming && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent" />
                  Confirming transaction...
                </div>
              )}
              {isConfirmed && (
                <div className="flex items-center gap-2 text-green-400">
                  <FileCheck className="w-4 h-4" />
                  Transaction confirmed
                </div>
              )}
              {hash && (
                <div className="space-y-2">
                  <Label className="text-gray-400">Transaction Hash</Label>
                  <p className="text-xs text-green-400 bg-green-500/10 p-2 rounded break-all">
                    {hash}
                  </p>
                </div>
              )}
              {hash && (
                <Button
                  disabled={isStored}
                  onClick={handleIssuanceStorage}
                  variant="default"
                  className="w-full hover:bg-purple-500/20 transition-colors"
                >
                  {isStored ? (
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      Stored Successfully
                    </span>
                  ) : (
                    "Save Issuance"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
