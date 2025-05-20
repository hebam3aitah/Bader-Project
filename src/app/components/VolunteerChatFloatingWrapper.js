"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import FloatingChatButton from "./FloatingChatButton";
import VolunteerChatModal from "./VolunteerChatModal";

export default function VolunteerChatFloatingWrapper() {
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/current-user");
        setUser(res.data);
      } catch (err) {
        console.error("فشل في جلب المستخدم:", err);
      }
    };
    fetchUser();
  }, []);

  if (user?.role !== "volunteer") return null;

  return (
    <>
      <FloatingChatButton onClick={() => setShowChat(true)} />
      {showChat && (
        <VolunteerChatModal
          volunteerId={user.volunteerId || user._id}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}
