"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import {
  AlertCircle,
  CheckCircle2,
  FileSearch,
  PartyPopper,
  Shield,
  Upload,
  Wallet,
  XCircle,
} from "lucide-react";
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
import { CONTRACT_ADDRESS } from "@/lib/utils";
import { Address } from "viem";
import { aib } from "@/lib/aib";
import { sepolia } from "viem/chains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isValid, setIsValid] = useState<Boolean | null>(null);

  const [formData, setFormData] = useState({
    vardoxId: "",
    docHash: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    vardoxId: false,
    file: false,
  });
  const [verificationResult, setVerificationResult] = useState("");
  const { data: isDocumentValid, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: aib,
    functionName: "verifyDocument",
    args: [formData.vardoxId, formData.docHash],
    chainId: sepolia.id,
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
    setVerificationResult("");
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
      setVerificationResult("");
    }
  };

  const handleVerify = async (e: any) => {
    e.preventDefault();

    setTouched({
      vardoxId: true,
      file: true,
    });

    if (!formData.vardoxId || !selectedFile) {
      setError("Please fill in all required fields");
      setVerificationResult("");
      return;
    }

    try {
      refetch();
      if (isDocumentValid === true) {
        setVerificationResult("Document is valid and verified on blockchain");
        setIsValid(true);
      } else {
        setVerificationResult(
          "Document is invalid or not verified on blockchain"
        );
        setIsValid(false);
      }
    } catch (error) {
      console.error("Contract interaction error:", error);
      setError("Failed to issue document. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black/40 p-8 flex items-center justify-center w-screen">
      <Card className="w-fit max-w-2xl border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Verify Certificate
            </CardTitle>
          </div>
          <p className="text-gray-400 text-sm">
            Validate the authenticity of blockchain-certified documents
          </p>
        </CardHeader>
        <Separator className="bg-gray-800" />
        <CardContent className="pt-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"secondary"}
                  className="w-full relative overflow-hidden group"
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    {isConnected ? (
                      <span className="text-sm truncate">{address}</span>
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
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Document Hash</Label>
              <Input
                type="text"
                value={formData.docHash}
                placeholder="Upload document to generate hash"
                className="bg-gray-800/50 border-gray-700 text-gray-400"
                disabled
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                Verify Certificate
              </div>
            </Button>

            {verificationResult && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isValid
                    ? "bg-green-500/10 border border-green-500/20"
                    : isValid === false
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-gray-500/10 border border-gray-500/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isValid ? (
                    <CheckCircle2 className="text-green-400 w-5 h-5" />
                  ) : isValid === false ? (
                    <XCircle className="text-red-400 w-5 h-5" />
                  ) : null}
                  <p
                    className={`text-sm ${
                      isValid
                        ? "text-green-400"
                        : isValid === false
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {verificationResult}
                  </p>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
