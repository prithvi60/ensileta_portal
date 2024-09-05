import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="flex flex-col gap-6 items-center justify-center w-full h-screen">
        <h2 className="font-serif text-5xl font-bold tracking-widest caption-top text-[#139F9B]">Ensileta Portal Dashboard</h2>
        <p className="text-xl tracking-wide w-1/2 font-satoshi text-center">The best rooms have something to say about the people who live in them</p>
        <Link href={"/api/auth/signin"} title="signin" className="p-3 rounded-md bg-[#139F9B] font-semibold tracking-wide text-lg hover:bg-opacity-70 text-white fixed top-5 right-14">Portal</Link>
      </div>
    </main>
  );
}
