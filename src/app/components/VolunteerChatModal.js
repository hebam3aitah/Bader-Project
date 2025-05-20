"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VolunteerChatModal({ volunteerId, onClose }) {
  const [volunteer, setVolunteer] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    const res = await axios.get(`/api/volunteer/${volunteerId}`);
    setVolunteer(res.data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await axios.post(`/api/volunteer/${volunteerId}/message`, {
      message: newMessage,
    });
    setNewMessage("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-4 relative">
        <h2 className="text-xl font-bold mb-4 text-right">محادثة مع الأدمن</h2>
        <div className="h-64 overflow-y-auto mb-4 border p-2 rounded">
          {volunteer?.messages?.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded ${
                msg.sender === "admin"
                  ? "bg-blue-100 text-right ml-auto"
                  : "bg-gray-100 text-right mr-auto"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.sentAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="اكتب ردك..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            إرسال
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
