// "use client"
import Header from "@/components/Header";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import Sidebar from "@/components/Sidebar/Sidebar";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  return (
    <DefaultLayout>
      <div className="w-full h-[70vh] overflow-auto flex flex-col items-center justify-center gap-6">
        <Image
          src={"/logo/newlogo.png"}
          width={450}
          height={450}
          alt="bg-image"
          sizes="(min-width: 1380px) 256px, (min-width: 1280px) calc(63.75vw - 611px), 242px"
        />
        <p className="text-lg sm:text-2xl font-semibold font-satoshi leading-6 sm:leading-snug tracking-wide italic text-primary w-full text-center sm:w-4/5">
          Decorating is not about making stage sets, it’s not about making
          pretty pictures for the magazines; it’s really about creating a
          quality of life, a beauty that nourishes the soul.
        </p>
        <div className="font-bold text-md text-red">
          Please select a customer from the sidebar to view their details{" "}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
