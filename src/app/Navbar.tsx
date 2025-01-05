"use client";
import { Barrio } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import SignOut from "./SignOut";
import { useTheme } from "@/Context/ThemeContext";

const ul = Barrio({ subsets: ["latin"], weight: "400" });

export default function Navbar() {
  const { user } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      ></link>

      <button
        className="fixed z-20 md:hidden text-xl sm:text-3xl p-5 right-0 rounded-bl-xl"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <i className="uil uil-bars"></i>
        ) : (
          <i className="uil uil-multiply"></i>
        )}
      </button>

      <div
        className={`h-screen w-full z-10 md:w-1/5 fixed p-5 md:border-r transition-all ${open ? "-translate-x-full" : ""} ${theme === "dark" ? "border-white/50" : "border-black/50"} my-6`}
      >
        <div className={ul.className + " text-2xl lg:text-3xl font-semibold mb-6"}>
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

        <hr className={`${theme === "dark" ? "border-white/50" : "border-black/50"} my-6`} />

        <div className="my-5">
          <button 
            onClick={toggleTheme}
            className={`${theme === "dark" ? "bg-white text-black" : "bg-black text-white"} h-14 w-14 flex justify-center items-center text-3xl rounded`}>
            {theme !== "dark" ?
            <i className="uil uil-moon"></i>:
            <i className="uil uil-sun"></i>}
          </button>
        </div>

        <hr className={`${theme === "dark" ? "border-white/50" : "border-black/50"} my-6`} />

      </div>
    </div>
  );
}
