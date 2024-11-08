import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center h-screen">
      <div className="text-lg">What is this account for? </div>
      <div className="text-xl flex gap-4">
        <div className="border  rounded-3xl p-5 cursor-pointer hover:bg-white hover:text-black">
          {" "}
          Document Issuance
        </div>
        <div className="border rounded-3xl p-5 cursor-pointer hover:bg-white hover:text-black">
          {" "}
          Verifier/ Individual
        </div>
      </div>
    </div>
  );
};

export default Page;
