"use client";
import UploadText from "./UploadText";
import List from "./List";
import Footer from "./Footer";
import { useTheme } from "@/Context/ThemeContext";
import { useState } from "react";

export default function Main() {

  const { theme } = useTheme();
  const [refresh, setRefresh] = useState(false);
  
  return (
    <div className={`min-h-screen md:w-4/5 md:float-right border-l space-y-5 ${theme === "dark" ? "border-white/50 bg-black text-white" : "border-black/50 bg-white text-black"}`}>
      <UploadText onUpload={() => setRefresh((prev) => !prev)} />
      <List refresh={refresh} />
        <Footer/>
    </div>
  );
}

