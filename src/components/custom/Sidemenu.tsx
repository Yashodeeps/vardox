"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("home");

  console.log(pathname);
  return (
    <div className="p-4 mx-4 border text-base border-gray-700 shadow-lg rounded-lg  text-zinc-300  w-fit h-fit my-28 ">
      <ul className="space-y-3">
        <li
          onClick={() => {
            setActive("home");
            router.push("/dashboard");
          }}
          className={
            active === "home"
              ? " hover:bg-purple-500 bg-purple-600 rounded-lg cursor-pointer px-3 py-2"
              : "hover:bg-black rounded-lg cursor-pointer  px-3 py-2"
          }
        >
          Home
        </li>

        <li className="hover:bg-black rounded-lg cursor-pointer   px-3 py-2">
          <Accordion type="single" collapsible className="w-full ">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline ">
                All documents
              </AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
