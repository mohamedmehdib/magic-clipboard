"use client";
import { Barrio } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import SignOut from "./SignOut";

const ul = Barrio({ subsets: ["latin"], weight: "400" });

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="text-white">
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      ></link>

      <button
        className="fixed z-20 md:hidden text-3xl p-5 right-0 bg-black"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <i className="uil uil-bars"></i>
        ) : (
          <i className="uil uil-multiply"></i>
        )}
      </button>

      <div
        className={`h-screen w-1/5 fixed bg-black p-5 md:border-r-2 border-white/50 transition-all ${open ? "-translate-x-full" : ""}`}
      >
        <div className={ul.className + " text-3xl font-semibold mb-6"}>
          Magic Clipboard!
        </div>

        <div className="my-5">
          {!user ? (
            <Link
              href="/SignIn"
              className="bg-green-500 hover:bg-green-700 transition-all duration-300 p-3 w-fit flex justify-center items-center font-medium rounded-lg shadow-md hover:shadow-xl"
            >
              Sign In
            </Link>
          ) : (
            <SignOut />
          )}
        </div>

        <hr />

        <div>
          <p className="py-4">Favorites</p>
        </div>
      </div>
    </div>
  );
}
