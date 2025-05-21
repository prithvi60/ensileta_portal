"use server"
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await getServerSession();
  // console.log("portal data", data?.user);

  return (
    <main className="w-full h-full">
      <div className="flex flex-col gap-6 items-center bg-cover justify-center w-full h-screen  bg-no-repeat bg-center" style={{ backgroundImage: "url('/cover/banner-img.jpg')" }}>
        <Image
          src={"/logo/newlogo.png"}
          width={450}
          height={450}
          alt="bg-image"
          sizes="(min-width: 1380px) 256px, (min-width: 1280px) calc(63.75vw - 611px), 242px"
        />
        <h2 className="font-serif text-2xl sm:text-4xl text-center font-bold tracking-widest caption-top text-white">Customer Portal</h2>
        <p className="text-lg sm:text-xl md:w-1/2 font-satoshi  text-white font-semibold tracking-wide p-2  drop-shadow-md rounded-lg text-justify"> Easily review and provide feedback on your 2D, 3D  design mockups in one place. Send remarks to refine designs and approve changes seamlessly through our project portal.</p>
        <Link href={data?.user ? "/portal/dashboard/view2d" : "/api/auth/signin"} title="signin" className="px-6 py-2 rounded-md bg-secondary font-semibold tracking-wide text-sm sm:text-lg hover:bg-opacity-70 text-white ">Go to Portal</Link>
      </div>
    </main>
  );
}
