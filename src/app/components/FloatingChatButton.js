"use client";
import { MessageCircle } from "lucide-react";

export default function FloatingChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 Raight-5 z-50 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-400 transition"
     
    >
      <MessageCircle size={24} />
    </button>
  );
}
