import { NextResponse } from "next/server";
import ContactMessage from "@/models/ContactMessage";
import connectDB from "@/lib/db";
import { sendReplyEmail } from "@/lib/email";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { replied, replyText } = await request.json();

    const message = await ContactMessage.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // تحديث حالة الرسالة
    message.replied = replied ?? true;
    message.read = true;
    await message.save();

    // إرسال الإيميل إذا كان هناك نص للرد
    if (replyText) {
      await sendReplyEmail({
        to: message.email,
        subject: "رد على رسالتك",
        html: `<p>مرحبًا ${message.name}،</p><p>${replyText}</p><p>مع تحياتنا، فريق بادر.</p>`,
        text: `مرحبًا ${message.name},\n\n${replyText}\n\nمع تحياتنا، فريق بادر.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message updated and email sent if replyText provided.",
    });
  } catch (error) {
    console.error("❌ Error in PUT /contact-messages/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    await ContactMessage.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("❌ Error in DELETE /contact-messages/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



