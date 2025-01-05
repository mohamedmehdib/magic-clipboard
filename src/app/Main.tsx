"use client";
import UploadText from "./UploadText";
import List from "./List";
import Footer from "./Footer";

export default function Main() {
  
  return (
    <div className="bg-black min-h-screen md:w-4/5 md:float-right space-y-5">
        <UploadText/>
        <List/>
        <Footer/>
    </div>
  );
}
