import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <section className="w-full mt-20 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <AlertTriangle color="red" size={50} aria-hidden="true" />
      <h1 className="text-gray-300 font-bold text-4xl">404</h1>
      <p className="text-gray-300 text-sm">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="bg-[#F5B800] text-xs text-black font-semibold px-8 py-3 rounded-md mt-2"
      >
        BACK TO HOME
      </Link>
    </section>
  );
}
