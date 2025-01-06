"use client";
import UploadText from "./UploadText";
import List from "./List";
import Footer from "./Footer";
import { useTheme } from "@/Context/ThemeContext";

export default function Main() {

  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen md:w-4/5 md:float-right border-l space-y-5 ${theme === "dark" ? "border-white/50 bg-black" : "border-black/50 bg-white"}`}>
        <UploadText/>
        <List/>
        <Footer/>
    </div>
  );
}
