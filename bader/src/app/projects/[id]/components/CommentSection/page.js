
"use client";

import { useState, useEffect } from 'react';
import { Heart, Flag, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function CommentSection({ projectId, onReportComment, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!projectId) return;
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/comments`);
      setComments(res.data.reverse());
    } catch (err) {
      console.error("فشل تحميل التعليقات:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/api/projects/${projectId}/comments`, {
        text: commentText,
      });
      fetchComments();
      setCommentText('');
    } catch (err) {
      console.error("فشل إرسال التعليق:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/projects/${projectId}/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("فشل حذف التعليق:", err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#31124b]">التعليقات</h3>

      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="اكتب تعليقك هنا..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e08c18]"
          rows="3"
        />
        <button 
          type="submit"
          className="mt-2 bg-[#e08c18] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          إرسال
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between mb-2">
              <div className="font-bold">{comment.user || "مستخدم"}</div>
              <div className="text-gray-500 text-sm">
                {comment.date}
              </div>
            </div>
            <p className="text-gray-700 mb-2">{comment.text}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button className="text-gray-500 text-sm flex items-center">
                  <Heart className="w-4 h-4 ml-1" />
                  <span>0</span>
                </button>
                <button
                  onClick={() => onReportComment?.(comment.id)}
                  className="text-gray-500 text-sm flex items-center"
                >
                  <Flag className="w-4 h-4 ml-1" />
                  <span>إبلاغ</span>
                </button>
                {/** ✅ زر الحذف يظهر فقط إذا كان المستخدم هو صاحب التعليق */}
                {currentUserId && comment.userId === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 text-sm flex items-center"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    <span>حذف</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
