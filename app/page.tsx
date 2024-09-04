import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="flex flex-col gap-6 items-center justify-center w-full h-screen">
        <h2 className="font-serif text-5xl font-bold tracking-widest caption-top">Ensileta Portal Dashboard</h2>
        <Link href={"/api/auth/signin"} title="signin" className="p-3 rounded-md bg-[#139F9B] font-semibold tracking-wide text-lg hover:bg-opacity-70 text-white">Portal</Link>
      </div>
    </main>
  );
}
