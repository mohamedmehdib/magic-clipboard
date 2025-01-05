import React, { useEffect, useState, useCallback } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

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
  const [view, setView] = useState(true);

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
      await navigator.clipboard.writeText(text);
      setCopy(index);

      setTimeout(() => {
        setCopy(-1);
      }, 5000);
    } catch (error) {
      console.error("Failed to copy text:", error);
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
          if (payload.new?.copied) {
            setCopiedTexts(payload.new.copied);
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

  return (
    <div className="w-3/4 mx-auto p-4 rounded-lg shadow-md text-white">
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/solid.css"
      ></link>
      <div className="mb-4 flex justify-between px-3">
        <h2 className="text-2xl">Your Clipboard</h2>
        <button onClick={() => setView(!view)} className="text-3xl">
          {view ? (
            <i className="uil uil-list-ul"></i>
          ) : (
            <i className="uil uil-apps"></i>
          )}
        </button>
      </div>
      {copiedTexts.length > 0 ? (
        <ul
          className={`grid gap-4 ${view ? "grid-cols-2" : "flex flex-col"}`}
        >
          {copiedTexts.map((item, index) => (
            <li
              key={index}
              className={`p-4 space-y-4 bg-black border rounded-md`}
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
              </div>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No texts saved yet.</p>
      )}
    </div>
  );
}
