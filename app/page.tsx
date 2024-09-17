"use server"
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const data = await getServerSession();
  // console.log("portal data", data?.user);

  return (
    <main className="w-full h-full">
      <div className="flex flex-col gap-6 items-center justify-center w-full h-screen  bg-no-repeat bg-center" style={{ backgroundImage: "url('/cover/banner-img.jpg')" }}>
        <h2 className="font-serif text-4xl sm:text-6xl text-center font-bold tracking-widest caption-top text-[#139F9B]">Ensileta Portal Dashboard</h2>
        <p className="text-lg sm:text-2xl md:w-1/2 font-satoshi text-center text-white font-semibold tracking-wide p-2 bg-[#3D2C22] bg-opacity-50 rounded-lg">The best rooms have something to say about the people who live in them</p>
        <Link href={data?.user ? "/portal/dashboard/customerProfile" : "/api/auth/signin"} title="signin" className="px-3 py-1.5 rounded-md bg-[#139F9B] font-semibold tracking-wide text-sm sm:text-lg hover:bg-opacity-70 text-white fixed top-5 right-6 sm:right-14">Portal</Link>
      </div>
    </main>
  );
}
