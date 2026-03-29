import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />
      <main className="mx-auto max-w-5xl flex-grow px-4 pt-16">
        {children}
      </main>
    </div>
  );
}
