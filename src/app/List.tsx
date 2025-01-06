import React, { useEffect, useState, useCallback, useRef } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import { useTheme } from "@/Context/ThemeContext";

type CopiedText = {
  text: string;
  fav: boolean;
  count: number;
};

export default function List() {
  const { user } = useAuth();
  const [copiedTexts, setCopiedTexts] = useState<CopiedText[]>([]);
  const [loading, setLoading] = useState(true);
  const [copy, setCopy] = useState(-1);
  const [view, setView] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editText]);

  const fetchCopiedTexts = useCallback(async () => {
    if (!user || !user.email) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("copied")
        .eq("email", user.email)
        .single();

      if (error) throw error;

      setCopiedTexts(data?.copied || []);
    } catch (error) {
      console.error("Error fetching copied texts:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleFavorite = async (index: number) => {
    if (!user || !user.email) return;

    try {
      const updatedTexts = copiedTexts.map((item, i) =>
        i === index ? { ...item, fav: !item.fav } : item
      );

      const { error } = await supabase
        .from("users")
        .update({ copied: updatedTexts })
        .eq("email", user.email);

      if (error) throw error;

      setCopiedTexts(updatedTexts);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const removeItem = async (index: number) => {
    if (!user || !user.email) return;

    try {
      const updatedTexts = copiedTexts.filter((_, i) => i !== index);
      const { error } = await supabase
        .from("users")
        .update({ copied: updatedTexts })
        .eq("email", user.email);

      if (error) throw error;

      setCopiedTexts(updatedTexts);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        document.execCommand("copy", true, text);
      }
      
      setCopy(index);

      const updatedTexts = copiedTexts.map((item, i) =>
        i === index ? { ...item, count: item.count + 1 } : item
      );

      if (user && user.email) {
        const { error } = await supabase
          .from("users")
          .update({ copied: updatedTexts })
          .eq("email", user.email);

        if (error) throw error;

        setCopiedTexts(updatedTexts);
      }

      setTimeout(() => {
        setCopy(-1);
      }, 5000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleEdit = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !user || !user.email) return;

    try {
      const updatedTexts = [...copiedTexts];
      updatedTexts[editingIndex].text = editText;

      const { error } = await supabase
        .from("users")
        .update({ copied: updatedTexts })
        .eq("email", user.email);

      if (error) throw error;

      setCopiedTexts(updatedTexts);
      setEditingIndex(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating text:", error);
    }
  };

  useEffect(() => {
    if (!user || !user.email) return;

    fetchCopiedTexts();

    const channel = supabase
    .channel("realtime:users")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `email=eq.${user.email}`,
      },
      (payload) => {
        if (payload.new && Array.isArray(payload.new.copied)) {
          setCopiedTexts(payload.new.copied);
        } else {
          console.warn("Unexpected payload format:", payload);
        }
      }
    )
    .subscribe();
  

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCopiedTexts]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const sortedCopiedTexts = copiedTexts.sort((a, b) => {
    if (a.fav === b.fav) {
      return b.count - a.count;
    }
    return b.fav ? 1 : -1;
  });

  return (
    <div className="md:w-3/4 sm:w-5/6 mx-auto p-4 rounded-lg shadow-md">
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/solid.css"
      />
      <div className="mb-4 flex justify-between px-3">
        <h2 className="text-2xl">Your Clipboard</h2>
        <button onClick={() => setView(!view)} className="hidden md:block text-3xl">
          {view ? (
            <i className="uil uil-list-ul"></i>
          ) : (
            <i className="uil uil-apps"></i>
          )}
        </button>
      </div>
      {sortedCopiedTexts.length > 0 ? (
        <ul
          className={`grid gap-4 ${view ? "grid-cols-2" : "flex flex-col"}`}
        >
          {sortedCopiedTexts.map((item, index) => (
            <li
              key={index}
              className={`p-4 space-y-4 border rounded-md ${theme === "dark" ? "text-white bg-black" : "border-black text-black"}`}
              style={{ height: "auto" }}
            >
              <div className="flex justify-end space-x-4 text-2xl">
                <button
                  onClick={() => copyToClipboard(item.text, index)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  {copy !== index ? (
                    <i className="uil uil-clipboard-notes"></i>
                  ) : (
                    <i className="uil uil-check"></i>
                  )}
                </button>
                <button
                  onClick={() => toggleFavorite(index)}
                  className="text-yellow-500 hover:text-yellow-700 transition"
                >
                  {item.fav ? (
                    <i className="uis uis-favorite"></i>
                  ) : (
                    <i className="uil uil-favorite"></i>
                  )}
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <i className="uil uil-trash-alt"></i>
                </button>
                <button
                  onClick={() => handleEdit(index, item.text)}
                  className="text-green-500 hover:text-green-700 transition"
                >
                  <i className="uil uil-edit"></i>
                </button>
              </div>
              {editingIndex === index ? (
                <div>
                  <textarea
                    ref={textareaRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`w-full p-2 mt-2 outline-none border rounded-lg scrollbar-none resize-none " ${theme === "dark" ? "text-white bg-black" : "border-black"}`}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="mt-2 text-white bg-green-500 p-2 rounded"
                  >
                    Save Edit
                  </button>
                </div>
              ) : (
                <p>{item.text}</p>
              )}
              <p className="text-sm text-gray-500">
                Copied {item.count} times
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No copied texts available</p>
      )}
    </div>
  );
}
