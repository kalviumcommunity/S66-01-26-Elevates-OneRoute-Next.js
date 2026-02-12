import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4">
            Streamline Your Internship Journey
          </h1>
          <p className="text-gray-500 mb-6">
            Track applications, deadlines, and mentor feedback in one place.
          </p>

          <div className="flex gap-4">
            <Link href="/signup" className="btn-primary">
              Sign Up
            </Link>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>

        <Image src="/hero.jpg" alt="Internship" width={500} height={400} />
      </section>
    </>
  );
}
