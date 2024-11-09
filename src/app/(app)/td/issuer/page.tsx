import { Separator } from "@/components/ui/separator";
import React from "react";
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";

const Page = () => {
  return (
    <div className="flex justify-center w-full items-center h-screen   mx-4    ">
      <div className="border border-gray-500 rounded-xl shadow-xl w-1/2 md:w-1/3 h-2/3 ">
        <div className="text-xl text-gray-300 font-bold p-4">
          Issue a certificate{" "}
        </div>
        <Separator className="bg-gray-500" />

        <Timeline>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>February 2022</Timeline.Time>
              <Timeline.Title>
                Application UI code in Tailwind CSS
              </Timeline.Title>
              <Timeline.Body>
                Get access to over 20+ pages including a dashboard layout,
                charts, kanban board, calendar, and pre-order E-commerce &
                Marketing pages.
              </Timeline.Body>
              <Button color="gray">
                Learn More
                <HiArrowNarrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>March 2022</Timeline.Time>
              <Timeline.Title>Marketing UI design in Figma</Timeline.Title>
              <Timeline.Body>
                All of the pages and components are first designed in Figma and
                we keep a parity between the two versions even as we update the
                project.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>April 2022</Timeline.Time>
              <Timeline.Title>
                E-Commerce UI code in Tailwind CSS
              </Timeline.Title>
              <Timeline.Body>
                Get started with dozens of web components and interactive
                elements built on top of Tailwind CSS.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
      </div>
    </div>
  );
};

export default Page;
