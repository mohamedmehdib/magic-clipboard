import React, { useState } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import { useTheme } from "@/Context/ThemeContext";

export default function UploadText() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const { theme } = useTheme();

  const handleUploadText = async () => {
    if (!user || !user.email) {
      alert("User not logged in.");
      return;
    }

    if (text.trim()) {
      try {
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("copied")
          .eq("email", user.email)
          .single();

        if (fetchError) throw fetchError;

        const newText = {
          text,
          fav: false,
          count: 0,  
        };

        const updatedCopied = userData?.copied
          ? [...userData.copied, newText]
          : [newText];

        const { error: updateError } = await supabase
          .from("users")
          .update({ copied: updatedCopied })
          .eq("email", user.email);

        if (updateError) throw updateError;

        setText("");
        alert("Text uploaded successfully!");
      } catch (error) {
        console.error("Error uploading text:", error);
        alert("Failed to upload text.");
      }
    } else {
      alert("Please enter some text.");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:p-10 md:p-14 rounded-lg -md">
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      ></link>
      <h2 className="text-xl md:text-2xl mb-4 py-5">Add text to your Clipboard!</h2>

      <div className="relative flex flex-col">
        <textarea
          placeholder="Enter text"
          value={text}
          onChange={handleTextChange}
          className={`flex-grow p-3 mb-4 border-2 focus:outline-none resize-none rounded-md ${theme === "dark" ? "border-white bg-black" : "border-black"}`}
          style={{ minHeight: "25vh", overflow: "hidden" }}
        />
        <button
          onClick={handleUploadText}
          className="absolute w-12 h-12 right-2 top-2 bg-blue-500 hover:bg-blue-700 transition-all rounded-md text-white"
        >
          <i className="uil uil-plus"></i>
        </button>
      </div>
    </div>
  );
}
